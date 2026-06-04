<?php
// TEMPORARY DEBUG — delete after testing SMTP
// Access: https://manny.aero/debug-mail.php?key=manny2026debug

if (($_GET['key'] ?? '') !== 'manny2026debug') {
    http_response_code(404);
    exit('Not found');
}

header('Content-Type: text/plain; charset=utf-8');

// ── Load secrets file (same as mail.php) ────────────────────
$_secrets_file = '/home/u676595820/manny-secrets.php';
if (file_exists($_secrets_file)) {
    require $_secrets_file;
    echo "✅ Secrets file loaded from: {$_secrets_file}\n\n";
} else {
    echo "⚠️  Secrets file NOT found at: {$_secrets_file}\n";
    echo "    Using hardcoded fallback defaults.\n\n";
}

function env_get(string $key, string $default = ''): string {
    $v = getenv($key);
    if ($v !== false && $v !== '') return $v;
    return $_SERVER[$key] ?? $default;
}

if (!defined('SMTP_HOST'))      define('SMTP_HOST',      env_get('MANNY_SMTP_HOST',      'smtp-mail.outlook.com'));
if (!defined('SMTP_PORT'))      define('SMTP_PORT',      (int) env_get('MANNY_SMTP_PORT', '587'));
if (!defined('SMTP_USER'))      define('SMTP_USER',      env_get('MANNY_SMTP_USER',      'no-replay@manny.aero'));
if (!defined('SMTP_PASS'))      define('SMTP_PASS',      env_get('MANNY_SMTP_PASS',      ''));
if (!defined('MAIL_FROM'))      define('MAIL_FROM',      env_get('MANNY_MAIL_FROM',      'no-replay@manny.aero'));
if (!defined('MAIL_FROM_NAME')) define('MAIL_FROM_NAME', env_get('MANNY_MAIL_FROM_NAME', 'Website Form'));
if (!defined('MAIL_TO_CONTACT'))define('MAIL_TO_CONTACT',env_get('MANNY_MAIL_TO_CONTACT','augustotturi99@gmail.com'));

// ── Config summary ───────────────────────────────────────────
echo "=== SMTP CONFIG ===\n";
echo "Host:      " . SMTP_HOST . "\n";
echo "Port:      " . SMTP_PORT . "\n";
echo "User:      " . SMTP_USER . "\n";
echo "Pass:      " . (SMTP_PASS ? substr(SMTP_PASS, 0, 3) . str_repeat('*', strlen(SMTP_PASS) - 3) : '(empty)') . "\n";
echo "From:      " . MAIL_FROM . " (" . MAIL_FROM_NAME . ")\n";
echo "To:        " . MAIL_TO_CONTACT . "\n";
echo "PHP:       " . PHP_VERSION . "\n";
echo "\n";

// ── PHPMailer test ───────────────────────────────────────────
require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

echo "=== SMTP CONNECTION TEST ===\n";

$mail = new PHPMailer(true);
$mail->SMTPDebug  = SMTP::DEBUG_SERVER; // full debug output
$mail->Debugoutput = function($str, $level) {
    echo "  [smtp] " . trim($str) . "\n";
};

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO_CONTACT);

    $mail->isHTML(false);
    $mail->Subject = '[TEST] Manny Aero — SMTP connection OK ' . date('Y-m-d H:i:s') . ' UTC';
    $mail->Body    = "This is an automated SMTP test from manny.aero.\n\n"
                   . "Host:  " . SMTP_HOST . ":" . SMTP_PORT . "\n"
                   . "User:  " . SMTP_USER . "\n"
                   . "From:  " . MAIL_FROM . "\n"
                   . "Time:  " . gmdate('Y-m-d H:i:s') . " UTC\n";

    $mail->send();
    echo "\n✅ EMAIL SENT — check " . MAIL_TO_CONTACT . "\n";

} catch (Exception $e) {
    echo "\n❌ FAILED: " . $mail->ErrorInfo . "\n";
}
