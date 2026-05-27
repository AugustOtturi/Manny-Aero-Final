<?php
// ============================================================
// Manny Aero — PHP Mail Handler
// Handles: contact form + permits email gate
// Security: origin check, honeypot, rate limiting, sanitization
// ============================================================

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/mail-config.php';
require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

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

// ── 2. Origin check ─────────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$allowed = ALLOWED_ORIGIN;

// During local dev (localhost) we skip the origin check
$is_local = str_contains($referer, 'localhost') || str_contains($origin, 'localhost');

if (!$is_local) {
    $origin_ok  = str_starts_with($origin,  $allowed);
    $referer_ok = str_starts_with($referer, $allowed);
    if (!$origin_ok && !$referer_ok) {
        json_error('Forbidden', 403);
    }
}

// ── 3. Parse JSON body ───────────────────────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    json_error('Invalid payload');
}

// ── 4. Honeypot ──────────────────────────────────────────────
// If the hidden "website" field has any value, it's a bot.
// We return ok silently so the bot thinks it succeeded.
$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
    json_ok('ok'); // silent discard
}

// ── 5. Rate limiting (file-based per IP) ────────────────────
$ip         = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip_clean   = preg_replace('/[^a-f0-9.:]/i', '', explode(',', $ip)[0]);
$rate_dir   = sys_get_temp_dir() . '/manny_rate';
$rate_file  = $rate_dir . '/' . md5($ip_clean) . '.json';

if (!is_dir($rate_dir)) {
    mkdir($rate_dir, 0700, true);
}

$now      = time();
$window   = RATE_LIMIT_WINDOW;
$max      = RATE_LIMIT_MAX;
$hits     = [];

if (file_exists($rate_file)) {
    $stored = json_decode(file_get_contents($rate_file), true);
    if (is_array($stored)) {
        // Keep only timestamps within the current window
        $hits = array_filter($stored, fn($t) => ($now - $t) < $window);
    }
}

if (count($hits) >= $max) {
    json_error('Too many requests. Please wait a few minutes and try again.', 429);
}

$hits[] = $now;
file_put_contents($rate_file, json_encode(array_values($hits)), LOCK_EX);

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

    // Build email body
    $subject = "New Flight Request — {$firstName} {$lastName}" . ($company ? " | {$company}" : '');

    $body  = "<h2 style='font-family:sans-serif;color:#111'>New Flight Request</h2>";
    $body .= "<table style='font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%'>";

    $body .= row_header('OPERATOR');
    $body .= row('Name',    "{$firstName} {$lastName}");
    $body .= row('Email',   "<a href='mailto:{$email}'>{$email}</a>");
    if ($phone)   $body .= row('Phone',   $phone);
    if ($company) $body .= row('Company', $company);

    $body .= row_header('SERVICE');
    if ($service)  $body .= row('Service Requested', $service);
    if ($aircraft) $body .= row('Aircraft Type',     $aircraft);

    // Flights repeater
    if (is_array($flights) && count($flights) > 0) {
        $body .= row_header('FLIGHTS');
        foreach ($flights as $i => $flight) {
            if (!is_array($flight)) continue;
            $n = $i + 1;
            $body .= "<tr><td colspan='2' style='padding:6px 12px;font-weight:700;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:.08em;padding-top:14px'>Flight {$n}</td></tr>";
            foreach ($flight as $key => $val) {
                $k = clean((string)$key);
                $v = clean((string)$val);
                if ($v !== '') $body .= row($k, $v);
            }
        }
    }

    if ($notes) {
        $body .= row_header('NOTES');
        $body .= "<tr><td colspan='2' style='padding:8px 12px;color:#333'>" . nl2br($notes) . "</td></tr>";
    }

    $body .= "</table>";
    $body .= "<p style='font-family:sans-serif;font-size:12px;color:#999;margin-top:24px'>Sent from manny.aero contact form</p>";

    send_mail(MAIL_TO_CONTACT, $subject, $body, $email, "{$firstName} {$lastName}");
    json_ok('Request sent');
}

// ── EMAIL GATE ───────────────────────────────────────────────
function handle_gate(array $d): never {
    $email    = trim($d['email']    ?? '');
    $fileName = clean($d['fileName'] ?? 'Unknown file');

    if (!valid_email($email)) json_error('Valid email is required');
    $email = clean($email);

    $subject = "Permit Download — New Email Captured";
    $body    = "<h2 style='font-family:sans-serif;color:#111'>Permit Download — Email Captured</h2>";
    $body   .= "<table style='font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%'>";
    $body   .= row('Email',     "<a href='mailto:{$email}'>{$email}</a>");
    $body   .= row('File',      $fileName);
    $body   .= row('Timestamp', gmdate('Y-m-d H:i') . ' UTC');
    $body   .= "</table>";
    $body   .= "<p style='font-family:sans-serif;font-size:12px;color:#999;margin-top:24px'>Sent from manny.aero permit download gate</p>";

    send_mail(MAIL_TO_GATE, $subject, $body);
    json_ok('Recorded');
}

// ── SMTP sender ──────────────────────────────────────────────
function send_mail(
    string $to,
    string $subject,
    string $body,
    string $replyTo = '',
    string $replyToName = ''
): void {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // port 465
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        $mail->addAddress($to);

        if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($replyTo, $replyToName);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags(str_replace(['<tr>', '</tr>', '<td>', '</td>'], ["\n", '', ' | ', ''], $body));

        $mail->send();
    } catch (Exception $e) {
        json_error('Mail delivery failed: ' . $mail->ErrorInfo, 500);
    }
}

// ── Table helpers ────────────────────────────────────────────
function row(string $label, string $value): string {
    return "<tr>
        <td style='padding:6px 12px;font-weight:600;color:#555;width:160px;vertical-align:top'>{$label}</td>
        <td style='padding:6px 12px;color:#111'>{$value}</td>
    </tr>";
}

function row_header(string $label): string {
    return "<tr><td colspan='2' style='padding:10px 12px 4px;font-weight:700;color:#ffb900;font-size:12px;text-transform:uppercase;letter-spacing:.12em;background:#111;border-radius:4px'>{$label}</td></tr>";
}
