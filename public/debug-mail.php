<?php
// TEMPORARY DEBUG — delete after diagnosing SMTP
// Access: https://yourdomain.com/debug-mail.php?key=manny2026debug

if (($_GET['key'] ?? '') !== 'manny2026debug') {
    http_response_code(404); exit('Not found');
}

header('Content-Type: text/plain; charset=utf-8');

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load secrets file if present (same logic as mail.php)
$_secrets_file = '/home/u676595820/manny-secrets.php';
if (file_exists($_secrets_file)) {
    require $_secrets_file;
    echo "=== SECRETS FILE: found and loaded ===\n\n";
} else {
    echo "=== SECRETS FILE: not found — using env vars ===\n\n";
}

function env_get(string $key, string $default = ''): string {
    $v = getenv($key);
    if ($v !== false && $v !== '') return $v;
    return $_SERVER[$key] ?? $default;
}

function const_or_env(string $const, string $env_key, string $default = ''): string {
    if (defined($const)) return constant($const);
    return env_get($env_key, $default);
}

$host = const_or_env('SMTP_HOST', 'MANNY_SMTP_HOST', 'smtp.hostinger.com');
$port = (int) const_or_env('SMTP_PORT', 'MANNY_SMTP_PORT', '465');
$user = const_or_env('SMTP_USER', 'MANNY_SMTP_USER');
$pass = const_or_env('SMTP_PASS', 'MANNY_SMTP_PASS');
$from = const_or_env('MAIL_FROM', 'MANNY_MAIL_FROM');
$to   = const_or_env('MAIL_TO_CONTACT', 'MANNY_MAIL_TO_CONTACT');

echo "=== SMTP TEST ===\n";
echo "Host: {$host}:{$port}\n";
echo "User: {$user}\n";
echo "Pass (first 8): " . substr($pass, 0, 8) . "****\n";
echo "Pass length: " . strlen($pass) . "\n\n";

// Test 1 — Port 465 SSL (SMTPS)
echo "--- Test 1: Port 465 / ENCRYPTION_SMTPS ---\n";
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $user;
    $mail->Password   = $pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]];
    $mail->setFrom($from, 'Manny Aero Debug');
    $mail->addAddress($to);
    $mail->Subject = 'SMTP Debug Test — 465 SSL';
    $mail->Body    = 'If you see this, port 465 SSL works.';
    $mail->send();
    echo "SUCCESS — port 465 SSL works!\n\n";
} catch (Exception $e) {
    echo "FAILED: " . $mail->ErrorInfo . "\n\n";
}

// Test 2 — Port 587 STARTTLS
echo "--- Test 2: Port 587 / ENCRYPTION_STARTTLS ---\n";
try {
    $mail2 = new PHPMailer(true);
    $mail2->isSMTP();
    $mail2->Host       = $host;
    $mail2->SMTPAuth   = true;
    $mail2->Username   = $user;
    $mail2->Password   = $pass;
    $mail2->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail2->Port       = 587;
    $mail2->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]];
    $mail2->setFrom($from, 'Manny Aero Debug');
    $mail2->addAddress($to);
    $mail2->Subject = 'SMTP Debug Test — 587 STARTTLS';
    $mail2->Body    = 'If you see this, port 587 STARTTLS works.';
    $mail2->send();
    echo "SUCCESS — port 587 STARTTLS works!\n\n";
} catch (Exception $e) {
    echo "FAILED: " . $mail2->ErrorInfo . "\n\n";
}
