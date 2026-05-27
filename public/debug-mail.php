<?php
// TEMPORARY DEBUG — delete this file after diagnosing the SMTP issue
// Access: https://yourdomain.com/debug-mail.php?key=manny2026debug

if (($_GET['key'] ?? '') !== 'manny2026debug') {
    http_response_code(404);
    exit('Not found');
}

header('Content-Type: text/plain; charset=utf-8');

$vars = [
    'MANNY_SMTP_HOST',
    'MANNY_SMTP_PORT',
    'MANNY_SMTP_USER',
    'MANNY_SMTP_PASS',
    'MANNY_MAIL_FROM',
    'MANNY_MAIL_TO_CONTACT',
    'MANNY_MAIL_TO_GATE',
];

echo "=== ENV VAR CHECK ===\n\n";
foreach ($vars as $key) {
    $via_getenv = getenv($key);
    $via_server = $_SERVER[$key] ?? null;

    $found = ($via_getenv !== false && $via_getenv !== '') ? 'getenv()' : (($via_server !== null) ? '$_SERVER' : 'NOT FOUND');
    // Show only first 4 chars of sensitive values
    $val = $via_getenv ?: $via_server ?: '';
    $display = ($val && in_array($key, ['MANNY_SMTP_PASS'])) ? substr($val, 0, 4) . '****' : $val;

    echo "{$key}: [{$found}] {$display}\n";
}

echo "\n=== PHP INFO ===\n";
echo "PHP version: " . PHP_VERSION . "\n";
echo "SAPI: " . php_sapi_name() . "\n";
