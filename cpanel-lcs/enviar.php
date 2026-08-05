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
    mb_strlen($name) < 2 ||
    mb_strlen($name) > 120 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    mb_strlen($email) > 160 ||
    mb_strlen($message) < 10 ||
    mb_strlen($message) > 4000 ||
    mb_strlen($company) > 160 ||
    mb_strlen($phone) > 40
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
    $body = "Nombre: {$name}\nEmpresa: {$company}\nEmail: {$email}\nTeléfono: {$phone}\n\nMensaje:\n{$message}\n";
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . CONTACT_FROM_NAME . ' <' . SITE_EMAIL . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'X-Mailer: PHP/' . PHP_VERSION,
    ];
    $mailOk = @mail(CONTACT_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}

if ($saved || $mailOk) {
    redirect_contact('ok');
}

redirect_contact('error');
