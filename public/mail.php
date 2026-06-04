<?php
// ============================================================
// Manny Aero — PHP Mail Handler
// Handles: contact form + permits email gate
// Security: origin check, honeypot, rate limiting, sanitization
// ============================================================

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

// Load credentials from a secrets file outside public_html (never wiped by deploys).
// If not found, fall back to env vars (getenv / $_SERVER).
$_secrets_file = '/home/u676595820/manny-secrets.php';
if (file_exists($_secrets_file)) {
    require $_secrets_file; // defines: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
                             //          MAIL_FROM, MAIL_FROM_NAME, MAIL_TO_CONTACT, MAIL_TO_GATE
}

// Read an env var — tries getenv() first, then $_SERVER (Hostinger may use either).
function env_get(string $key, string $default = ''): string {
    $v = getenv($key);
    if ($v !== false && $v !== '') return $v;
    return $_SERVER[$key] ?? $default;
}

if (!defined('SMTP_HOST'))       define('SMTP_HOST',       env_get('MANNY_SMTP_HOST',       'smtp-mail.outlook.com'));
if (!defined('SMTP_PORT'))       define('SMTP_PORT',       (int) env_get('MANNY_SMTP_PORT', '587'));
if (!defined('SMTP_USER'))       define('SMTP_USER',       env_get('MANNY_SMTP_USER',       'no-replay@manny.aero'));
if (!defined('SMTP_PASS'))       define('SMTP_PASS',       env_get('MANNY_SMTP_PASS',       ''));
if (!defined('MAIL_FROM'))       define('MAIL_FROM',       env_get('MANNY_MAIL_FROM',       'no-replay@manny.aero'));
if (!defined('MAIL_FROM_NAME'))  define('MAIL_FROM_NAME',  env_get('MANNY_MAIL_FROM_NAME',  'Website Form'));
if (!defined('MAIL_TO_CONTACT')) define('MAIL_TO_CONTACT', env_get('MANNY_MAIL_TO_CONTACT', 'augustotturi99@gmail.com'));
if (!defined('MAIL_TO_GATE'))    define('MAIL_TO_GATE',    env_get('MANNY_MAIL_TO_GATE',    'augustotturi99@gmail.com'));

// CC recipients for the contact form
define('MAIL_CC_CONTACT', []);
define('RATE_LIMIT_MAX',    15);   // max sends per IP per window
define('RATE_LIMIT_WINDOW', 3600); // 1 hour

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ── Helpers ─────────────────────────────────────────────────

function json_ok(string $message = 'ok'): never {
    echo json_encode(['ok' => true, 'message' => $message]);
    exit;
}

function json_error(string $message, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function valid_email(string $email): bool {
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ── 1. Method ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

// ── 2. Parse JSON body ───────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    json_error('Invalid payload');
}

// ── 3. Origin check ─────────────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$allowed = 'https://manny.aero';
$origin_ok = str_starts_with($origin, $allowed) || str_starts_with($referer, $allowed);
if (!$origin_ok) {
    error_log('[manny-aero mail] Origin blocked — origin: ' . $origin . ' | referer: ' . $referer);
    json_error('Forbidden', 403);
}

// ── 4. Honeypot ──────────────────────────────────────────────
// If the hidden "website" field has any value, it's a bot.
// We return ok silently so the bot thinks it succeeded.
$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
    json_ok('ok'); // silent discard
}

// ── 5. Rate limiting — runs only right before an actual send ──
// Intentionally placed here as a callable, NOT executed on every
// request. Validation errors should never consume a rate-limit slot —
// only real email sends do. This also prevents bots from exhausting
// a legitimate user's quota by flooding with invalid payloads.
function rate_check(): void {
    $ip        = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ip_clean  = preg_replace('/[^a-f0-9.:]/i', '', explode(',', $ip)[0]);
    $rate_dir  = sys_get_temp_dir() . '/manny_rate';
    $rate_file = $rate_dir . '/' . md5($ip_clean) . '.json';

    if (!is_dir($rate_dir)) {
        mkdir($rate_dir, 0700, true);
    }

    $now   = time();
    $hits  = [];

    if (file_exists($rate_file)) {
        $stored = json_decode(file_get_contents($rate_file), true);
        if (is_array($stored)) {
            $hits = array_filter($stored, fn($t) => ($now - $t) < RATE_LIMIT_WINDOW);
        }
    }

    if (count($hits) >= RATE_LIMIT_MAX) {
        json_error('Too many requests. Please wait a few minutes and try again.', 429);
    }

    $hits[] = $now;
    file_put_contents($rate_file, json_encode(array_values($hits)), LOCK_EX);
}

// ── 6. Route by type ─────────────────────────────────────────
$type = $data['type'] ?? '';

match ($type) {
    'contact' => handle_contact($data),
    'gate'    => handle_gate($data),
    default   => json_error('Unknown form type'),
};

// ── CONTACT FORM ─────────────────────────────────────────────
function handle_contact(array $d): never {
    // Required fields
    $firstName = clean($d['firstName'] ?? '');
    $lastName  = clean($d['lastName']  ?? '');
    $email     = trim($d['email']      ?? '');
    $phone     = clean($d['phone']     ?? '');
    $company   = clean($d['company']   ?? '');
    $service   = clean($d['service']   ?? '');
    $aircraft  = clean($d['aircraft']  ?? '');
    $notes     = clean($d['notes']     ?? '');
    $flights   = $d['flights'] ?? [];

    if (!$firstName || !$lastName) json_error('Name is required');
    if (!valid_email($email))      json_error('Valid email is required');

    $email = clean($email);

    // Max length guard
    foreach (['firstName','lastName','company','service','aircraft','notes'] as $key) {
        if (strlen($$key) > 1000) json_error("Field '$key' is too long");
    }

    $fullName = trim("{$firstName} {$lastName}");
    $subject  = "New Flight Request — {$fullName}" . ($company ? " | {$company}" : '');

    // ── Build sections (each only renders if it has content) ──
    $sections = '';

    // Operator
    $sections .= section('Operator', [
        field_row('Name',    $fullName),
        field_row('Email',   "<a href='mailto:{$email}' style='color:#b8860b;text-decoration:none'>{$email}</a>"),
        field_row('Phone',   $phone),
        field_row('Company', $company),
    ]);

    // Service
    $sections .= section('Service Requested', [
        field_row('Service',       $service),
        field_row('Aircraft Type', $aircraft),
    ]);

    // Flights repeater — each flight is its own mini-card, empty ones skipped
    $sections .= flights_section($flights);

    // Notes
    if ($notes !== '') {
        $sections .= "<tr><td style='padding:22px 32px 0'>"
            . section_label('Notes')
            . "<div style='font:400 14px/1.6 Arial,sans-serif;color:#1f2937;background:#f9fafb;border:1px solid #eceef1;border-radius:10px;padding:14px 16px;margin-top:8px'>"
            . nl2br($notes)
            . "</div></td></tr>";
    }

    $subheading = "Submitted " . gmdate('M j, Y · H:i') . " UTC · via manny.aero contact form";
    $footer     = "Reply directly to this email to reach the operator. Sent automatically from the Manny Aero website contact form.";

    $body = email_document('New Flight Request', $subheading, $sections, $footer);

    rate_check();
    send_mail(MAIL_TO_CONTACT, $subject, $body, $email, $fullName, MAIL_CC_CONTACT);
    json_ok('Request sent');
}

// ── EMAIL GATE ───────────────────────────────────────────────
function handle_gate(array $d): never {
    $email    = trim($d['email']    ?? '');
    $fileName = clean($d['fileName'] ?? 'Unknown file');

    if (!valid_email($email)) json_error('Valid email is required');
    $email = clean($email);

    $subject = "New Lead — Permit Download Requested";

    $sections = section('Lead', [
        field_row('Email',     "<a href='mailto:{$email}' style='color:#b8860b;text-decoration:none'>{$email}</a>"),
        field_row('File',      $fileName),
        field_row('Captured',  gmdate('M j, Y · H:i') . ' UTC'),
    ]);

    $subheading = "A visitor unlocked a downloadable permit document on manny.aero";
    $footer     = "This lead was captured by the permit download gate. Reply to this email to follow up with the operator.";

    $body = email_document('Permit Download Lead', $subheading, $sections, $footer);

    rate_check();
    send_mail(MAIL_TO_GATE, $subject, $body, $email);
    json_ok('Recorded');
}

// ── SMTP sender ──────────────────────────────────────────────
function send_mail(
    string $to,
    string $subject,
    string $body,
    string $replyTo = '',
    string $replyToName = '',
    array  $cc = []
): void {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // port 587
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        $mail->addAddress($to);

        foreach ($cc as $ccAddr) {
            if (filter_var($ccAddr, FILTER_VALIDATE_EMAIL)) {
                $mail->addCC($ccAddr);
            }
        }

        if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($replyTo, $replyToName);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags(str_replace(['<tr>', '</tr>', '<td>', '</td>'], ["\n", '', ' | ', ''], $body));

        $mail->send();
    } catch (Exception $e) {
        // Log full error server-side — never expose raw SMTP detail to the client
        error_log('[manny-aero mail] SMTP ERROR | host: ' . SMTP_HOST . ':' . SMTP_PORT
            . ' | user: ' . SMTP_USER
            . ' | to: ' . $to
            . ' | detail: ' . $mail->ErrorInfo);
        json_error('We could not send your message right now. Please try again or contact us directly.', 500);
    }
}

// ── Email template helpers ───────────────────────────────────

// A single label/value line. Returns '' when the value is empty,
// so empty fields never leave a blank row behind.
function field_row(string $label, string $value): string {
    if (trim($value) === '') return '';
    return "<tr>
        <td style='padding:7px 0;font:600 12px/1.5 Arial,Helvetica,sans-serif;color:#6b7280;width:150px;vertical-align:top;white-space:nowrap'>{$label}</td>
        <td style='padding:7px 0;font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#111827'>{$value}</td>
    </tr>";
}

// Small accent label used at the top of every section.
function section_label(string $label): string {
    return "<div style='font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#b8860b;padding-bottom:8px;border-bottom:1px solid #e5e7eb'>{$label}</div>";
}

// Wraps a set of field_row() strings in a titled section.
// If every row is empty the whole section is omitted — this is what
// kills the "empty bar" problem at the source.
function section(string $label, array $rows): string {
    $inner = '';
    foreach ($rows as $r) $inner .= $r;
    if (trim($inner) === '') return '';
    return "<tr><td style='padding:22px 32px 0'>"
        . section_label($label)
        . "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='margin-top:6px'>{$inner}</table>"
        . "</td></tr>";
}

// Flights repeater — renders each non-empty flight as its own mini card.
function flights_section($flights): string {
    if (!is_array($flights) || count($flights) === 0) return '';

    $cards = '';
    $n = 0;
    foreach ($flights as $flight) {
        if (!is_array($flight)) continue;
        $rows = '';
        foreach ($flight as $key => $val) {
            $rows .= field_row(clean((string)$key), clean((string)$val));
        }
        if (trim($rows) === '') continue; // skip empty flight blocks
        $n++;
        $cards .= "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='margin-top:10px;background:#f9fafb;border:1px solid #eceef1;border-radius:10px'>
            <tr><td style='padding:12px 16px'>
                <div style='font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#0d0d0d;margin-bottom:4px'>&#9992;&#65039; Flight {$n}</div>
                <table role='presentation' cellpadding='0' cellspacing='0' width='100%'>{$rows}</table>
            </td></tr>
        </table>";
    }
    if (trim($cards) === '') return '';

    return "<tr><td style='padding:22px 32px 0'>"
        . section_label('Flight Details')
        . $cards
        . "</td></tr>";
}

// Full branded HTML email document.
function email_document(string $heading, string $subheading, string $sectionsHtml, string $footerNote): string {
    return "<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<meta name='color-scheme' content='light'>
</head>
<body style='margin:0;padding:0;background:#eef0f3;-webkit-font-smoothing:antialiased'>
  <table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='background:#eef0f3'>
    <tr><td align='center' style='padding:28px 12px'>
      <table role='presentation' cellpadding='0' cellspacing='0' width='600' style='width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 34px rgba(13,13,13,.10)'>

        <!-- Header -->
        <tr><td style='background:#0d0d0d;padding:26px 32px;border-bottom:3px solid #ffb900'>
          <div style='font:800 22px/1 Arial,Helvetica,sans-serif;color:#ffffff;letter-spacing:.04em'>MANNY<span style='color:#ffb900'>AERO</span></div>
          <div style='font:600 11px/1 Arial,Helvetica,sans-serif;color:#9ca3af;letter-spacing:.16em;text-transform:uppercase;margin-top:9px'>Ground Handling &amp; FBO Coordination &middot; Mexico</div>
        </td></tr>

        <!-- Title -->
        <tr><td style='padding:28px 32px 2px'>
          <div style='font:700 20px/1.3 Arial,Helvetica,sans-serif;color:#0d0d0d'>{$heading}</div>
          <div style='font:400 13px/1.5 Arial,Helvetica,sans-serif;color:#6b7280;margin-top:5px'>{$subheading}</div>
        </td></tr>

        {$sectionsHtml}

        <!-- Footer -->
        <tr><td style='padding:28px 32px 30px'>
          <div style='border-top:1px solid #e5e7eb;padding-top:18px;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#9ca3af'>{$footerNote}</div>
        </td></tr>

      </table>
      <div style='font:400 11px/1.5 Arial,Helvetica,sans-serif;color:#9ca3af;padding:16px 0'>Manny Aero &middot; 24/7 Operations &middot; manny.aero</div>
    </td></tr>
  </table>
</body>
</html>";
}
