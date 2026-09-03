<?php
declare(strict_types=1);

/**
 * Configuración LCS — sitio PHP para cPanel
 * Sube toda la carpeta cpanel-lcs al public_html (o subcarpeta).
 */

define('SITE_NAME', 'Luque Construcción y Servicios S.A.C.');
define('SITE_SHORT', 'LCS');
define('SITE_EMAIL', 'contactenos@lcs.pe');
define('SITE_PHONE', '912 260 675');
define('SITE_WHATSAPP', '51912260675');
define('SITE_ADDRESS', 'Av. Manuel Olguín 335, Edificio Link Tower — Oficina 901, Surco');
define('SITE_MANAGER', 'Jorge Luis Luque Solis');
define('SITE_MAP_QUERY', 'C E Link Tower, Av. Manuel Olguín 335, Santiago de Surco');
define('SITE_MAP_PLUS', 'C E Link Tower, Santiago de Surco');

function maps_embed_url(): string
{
    return 'https://maps.google.com/maps?q=' . rawurlencode(SITE_MAP_QUERY) . '&hl=es&z=18&output=embed';
}

function maps_open_url(): string
{
    return 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode(SITE_MAP_QUERY);
}

/** Destinatario de cotizaciones (cámbialo si hace falta) */
define('CONTACT_TO', 'contactenos@lcs.pe');
define('CONTACT_FROM_NAME', 'LCS Web');
/** Si mail() falla en tu hosting, deja false y los mensajes se guardan en /mensajes */
define('CONTACT_TRY_MAIL', true);

/** Base URL relativa ('' si está en la raíz de public_html) */
define('BASE_PATH', '');

date_default_timezone_set('America/Lima');

function base_url(string $path = ''): string
{
    $base = rtrim(BASE_PATH, '/');
    $path = ltrim($path, '/');
    if ($path === '') {
        return $base === '' ? '/' : $base . '/';
    }
    return ($base === '' ? '' : $base) . '/' . $path;
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function format_money(?float $amount): string
{
    if ($amount === null) {
        return '—';
    }
    return 'S/ ' . number_format($amount, 2, '.', ',');
}

function current_page(): string
{
    $script = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');
    return pathinfo($script, PATHINFO_FILENAME);
}

function is_active(string $page): string
{
    return current_page() === $page ? ' is-active' : '';
}

/** Extrae ID de YouTube desde URL o ID suelto. */
function youtube_id(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    if (preg_match('/^[a-zA-Z0-9_-]{11}$/', $value)) {
        return $value;
    }
    if (preg_match('/(?:youtu\.be\/|v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/', $value, $m)) {
        return $m[1];
    }
    return null;
}

/** URL canónica de video/reel de Facebook, o null. */
function facebook_video_url(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    if (preg_match('#facebook\.com/reel/(\d+)#i', $value, $m)) {
        return 'https://www.facebook.com/reel/' . $m[1];
    }
    if (preg_match('#facebook\.com/(?:watch/?\?.*[?&]?v=|video\.php\?.*[?&]?v=|[^/]+/videos/)(\d+)#i', $value, $m)) {
        return 'https://www.facebook.com/watch/?v=' . $m[1];
    }
    if (preg_match('#[?&]v=(\d+)#', $value, $m) && stripos($value, 'facebook.com') !== false) {
        return 'https://www.facebook.com/watch/?v=' . $m[1];
    }
    return null;
}

function facebook_embed_url(?string $value): ?string
{
    $canonical = facebook_video_url($value);
    if ($canonical === null) {
        return null;
    }
    return 'https://www.facebook.com/plugins/video.php?href=' . rawurlencode($canonical) . '&show_text=false';
}

function video_is_playable(array $video): bool
{
    if (!empty($video['file'])) {
        return true;
    }
    if (youtube_id($video['youtube'] ?? null) !== null) {
        return true;
    }
    return facebook_embed_url($video['facebook'] ?? null) !== null;
}

/**
 * Renderiza un video (archivo local MP4/WebM, YouTube o Facebook).
 * @param array{title?:string,file?:string,youtube?:string,facebook?:string,poster?:string} $video
 */
function render_video(array $video, string $class = ''): void
{
    $title = $video['title'] ?? 'Video';
    $poster = $video['poster'] ?? '';
    $file = $video['file'] ?? '';
    $yt = youtube_id($video['youtube'] ?? null);
    $fb = facebook_embed_url($video['facebook'] ?? null);
    $orientation = ($video['orientation'] ?? '') === 'portrait' ? ' video-frame--portrait' : '';
    $classAttr = trim('video-frame' . $orientation . ' ' . $class);

    if ($file !== '') {
        $absolute = dirname(__DIR__) . '/' . ltrim(str_replace('\\', '/', $file), '/');
        $src = base_url($file);
        if (is_file($absolute)) {
            $src .= '?v=' . (string) filemtime($absolute);
        }
        $posterAttr = $poster !== '' ? ' poster="' . e(base_url($poster)) . '"' : '';
        echo '<div class="' . e($classAttr) . '">';
        echo '<video controls preload="metadata" playsinline' . $posterAttr . ' title="' . e($title) . '">';
        echo '<source src="' . e($src) . '" type="video/mp4">';
        echo 'Tu navegador no soporta video HTML5.';
        echo '</video></div>';
        return;
    }

    if ($yt !== null) {
        $embed = 'https://www.youtube.com/embed/' . rawurlencode($yt) . '?rel=0&modestbranding=1';
        echo '<div class="' . e($classAttr) . '">';
        echo '<iframe src="' . e($embed) . '" title="' . e($title) . '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        echo '</div>';
        return;
    }

    if ($fb !== null) {
        echo '<div class="' . e($classAttr) . '">';
        echo '<iframe src="' . e($fb) . '" title="' . e($title) . '" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>';
        echo '</div>';
        return;
    }

    echo '<div class="' . e($classAttr) . ' video-frame--empty">';
    if ($poster !== '') {
        echo '<img src="' . e(base_url($poster)) . '" alt="' . e($title) . '">';
    }
    echo '<p>Video pendiente</p></div>';
}
