<?php
declare(strict_types=1);

/**
 * Sitemap dinámico para cPanel.
 * Acceso: /sitemap.php  o  /sitemap.xml (vía .htaccess)
 */
header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: public, max-age=3600');

$base = 'https://lcs.pe';
$today = date('Y-m-d');

$urls = [
    ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['loc' => '/nosotros.php', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['loc' => '/servicios.php', 'priority' => '0.9', 'changefreq' => 'monthly'],
    ['loc' => '/proyectos.php', 'priority' => '0.9', 'changefreq' => 'weekly'],
    ['loc' => '/proyecto.php?slug=ie-20158-mala', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=mercado-el-algarrobal', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=bermas-samegua', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=muro-buena-vista', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=campolo-callao', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=limpieza-trujillo', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/proyecto.php?slug=losas-talara', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => '/videos.php', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/clientes.php', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/certificaciones.php', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => '/contacto.php', 'priority' => '0.8', 'changefreq' => 'monthly'],
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($urls as $item): ?>
  <url>
    <loc><?= htmlspecialchars($base . $item['loc'], ENT_XML1) ?></loc>
    <lastmod><?= $today ?></lastmod>
    <changefreq><?= $item['changefreq'] ?></changefreq>
    <priority><?= $item['priority'] ?></priority>
  </url>
<?php endforeach; ?>
</urlset>
