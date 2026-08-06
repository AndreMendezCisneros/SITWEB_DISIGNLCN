<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json; charset=UTF-8');

function json_response(bool $ok, string $message, int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Método no permitido.', 405);
}

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
    json_response(false, 'Envío rechazado por seguridad.', 400);
}

$name = trim((string) ($_POST['name'] ?? ''));
$contact = trim((string) ($_POST['contact'] ?? ''));
$project = trim((string) ($_POST['project'] ?? ''));
$location = trim((string) ($_POST['location'] ?? ''));
$budget = trim((string) ($_POST['budget'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if (
    str_len($name) < 2 ||
    str_len($name) > 120 ||
    str_len($contact) < 5 ||
    str_len($contact) > 160 ||
    str_len($project) < 3 ||
    str_len($project) > 200 ||
    str_len($location) > 200 ||
    str_len($budget) > 80 ||
    str_len($message) > 2000
) {
    json_response(false, 'Revisa los datos del formulario.', 422);
}

$payload = [
    'type' => 'quote',
    'created_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'name' => $name,
    'contact' => $contact,
    'project' => $project,
    'location' => $location,
    'budget' => $budget,
    'message' => $message,
    'to' => CONTACT_TO,
];

$mensajesDir = __DIR__ . '/mensajes';
if (!is_dir($mensajesDir)) {
    mkdir($mensajesDir, 0755, true);
}

$file = $mensajesDir . '/quote-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.json';
$saved = (bool) file_put_contents(
    $file,
    json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
);

$mailOk = false;
if (CONTACT_TRY_MAIL) {
    $subject = 'Nueva cotización web LCS — ' . $name;
    $body = implode("\n", [
        'Nueva solicitud de cotización desde el inicio del sitio.',
        '',
        'Nombre: ' . $name,
        'Contacto: ' . $contact,
        'Proyecto: ' . $project,
        'Ubicación: ' . ($location !== '' ? $location : '—'),
        'Presupuesto: ' . ($budget !== '' ? $budget : '—'),
        '',
        'Detalle:',
        $message !== '' ? $message : '—',
        '',
        'Enviado: ' . date('d/m/Y H:i:s'),
    ]);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . CONTACT_FROM_NAME . ' <' . SITE_EMAIL . '>',
        'Reply-To: ' . $name . ' <' . (filter_var($contact, FILTER_VALIDATE_EMAIL) ? $contact : SITE_EMAIL) . '>',
        'X-Mailer: PHP/' . PHP_VERSION,
    ];
    $mailOk = @mail(
        CONTACT_TO,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $body,
        implode("\r\n", $headers),
        '-f' . SITE_EMAIL
    );
}

if ($saved || $mailOk) {
    json_response(true, 'Cotización recibida. Te contactaremos pronto.');
}

json_response(false, 'No pudimos guardar la cotización.', 500);
