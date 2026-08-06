<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . base_url('contacto.php'), true, 302);
    exit;
}

function redirect_contact(string $status): void
{
    header('Location: ' . base_url('contacto.php?status=' . rawurlencode($status)), true, 303);
    exit;
}

/** Longitud segura sin depender de la extensión mbstring. */
function str_len(string $value): int
{
    if (function_exists('mb_strlen')) {
        return (int) mb_strlen($value, 'UTF-8');
    }
    return strlen($value);
}

$website = trim((string) ($_POST['website'] ?? ''));
$startedAt = (int) ($_POST['started_at'] ?? 0);
$now = (int) round(microtime(true) * 1000);

if ($website !== '' || $startedAt <= 0 || ($now - $startedAt) < 1200) {
    redirect_contact('spam');
}

$name = trim((string) ($_POST['name'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if (
    str_len($name) < 2 ||
    str_len($name) > 120 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    str_len($email) > 160 ||
    str_len($message) < 10 ||
    str_len($message) > 4000 ||
    str_len($company) > 160 ||
    str_len($phone) > 40
) {
    redirect_contact('error');
}

$payload = [
    'created_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'name' => $name,
    'company' => $company,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
    'to' => CONTACT_TO,
];

$mensajesDir = __DIR__ . '/mensajes';
if (!is_dir($mensajesDir)) {
    mkdir($mensajesDir, 0755, true);
}

$file = $mensajesDir . '/msg-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.json';
$saved = (bool) file_put_contents(
    $file,
    json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
);

$mailOk = false;
if (CONTACT_TRY_MAIL) {
    $subject = 'Nuevo mensaje web LCS — ' . $name;
    $body = implode("\n", [
        'Has recibido un nuevo mensaje desde el formulario web de LCS.',
        '',
        'Nombre: ' . $name,
        'Empresa: ' . ($company !== '' ? $company : '—'),
        'Email: ' . $email,
        'Teléfono: ' . ($phone !== '' ? $phone : '—'),
        '',
        'Mensaje:',
        $message,
        '',
        '—',
        'Enviado: ' . date('d/m/Y H:i:s'),
        'IP: ' . ($payload['ip'] !== '' ? $payload['ip'] : '—'),
    ]);

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . CONTACT_FROM_NAME . ' <' . SITE_EMAIL . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'X-Mailer: PHP/' . PHP_VERSION,
    ];

    $mailOk = @mail(
        CONTACT_TO,
        $encodedSubject,
        $body,
        implode("\r\n", $headers),
        '-f' . SITE_EMAIL
    );
}

if ($saved || $mailOk) {
    redirect_contact('ok');
}

redirect_contact('error');
