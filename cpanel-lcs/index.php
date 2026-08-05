<?php
$pageTitle = 'LCS — Luque Construcción y Servicios';
$pageDescription = 'Construimos soluciones, creamos futuro. Proyectos de construcción, infraestructura y mantenimiento.';
require __DIR__ . '/includes/header.php';

$featured = array_values(array_filter($projects, static fn ($p) => !empty($p['featured'])));
$historiaParts = explode("\n\n", $about['historia']['body']);
?>
<section class="hero">
  <div class="hero-media">
    <video autoplay muted loop playsinline preload="metadata" poster="<?= e(base_url('assets/img/hero.png')) ?>" aria-hidden="true">
      <source src="<?= e(base_url('assets/video/hero-lcs.mp4')) ?>" type="video/mp4">
    </video>
  </div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="eyebrow">Luque Construcción y Servicios</p>
    <h1 class="display">Construimos soluciones,<br>creamos futuro</h1>
    <p>Ejecutamos proyectos de construcción, infraestructura y mantenimiento con enfoque en calidad, seguridad y cumplimiento de plazos, brindando soluciones confiables en cada etapa de la obra.</p>
    <div class="hero-actions">
      <a class="btn btn-gold" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
      <a class="btn btn-outline-gold" href="<?= e(base_url('servicios.php')) ?>">Nuestros servicios</a>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container grid-4">
    <?php foreach ($pillars as $item): ?>
      <div class="pillar">
        <p class="eyebrow"><?= e($item['title']) ?></p>
        <p><?= e($item['body']) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section
  class="scroll-showcase"
  style="--showcase-image: url('<?= e(base_url('assets/img/hero.png')) ?>')"
  aria-label="Maquinaria y experiencia de LCS"
>
  <div class="scroll-showcase-overlay"></div>
  <div class="container scroll-showcase-content">
    <p class="eyebrow">Experiencia en movimiento</p>
    <h2 class="display">Construimos sobre bases sólidas</h2>
    <p>Maquinaria, planificación y un equipo comprometido para convertir cada proyecto en resultados.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container grid-2 md-2">
    <div>
      <p class="eyebrow">Sobre LCS</p>
      <h2 class="display">Construimos con confianza</h2>
      <p style="margin-top:1.25rem;color:#555"><?= e($historiaParts[0] ?? '') ?></p>
      <p style="margin-top:1rem;color:#555">Transformamos visión en realidad: desde infraestructura educativa y deportiva hasta saneamiento, vías y contratos municipales, con un firme compromiso en excelencia operativa.</p>
      <div class="actions">
        <a class="btn btn-dark" href="<?= e(base_url('nosotros.php')) ?>">Conoce nuestra empresa</a>
        <a class="btn btn-outline-dark" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
      </div>
    </div>
    <div class="about-image has-img">
      <img src="<?= e(base_url('assets/img/proyectos/mercado-el-algarrobal.webp')) ?>" alt="Proyecto LCS">
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Resultados</p>
      <h2 class="display">Más de 10 años construyendo futuro</h2>
      <p class="muted" style="margin-top:1rem;max-width:40rem">Capacidad demostrada en obras públicas y privadas a lo largo del Perú. Estos indicadores resumen nuestro alcance operativo.</p>
    </div>
    <div class="stats-grid grid-4" style="margin-bottom:2rem">
      <?php foreach ($stats as $stat): ?>
        <div class="stat-card">
          <p class="display"><?= e($stat['value']) ?></p>
          <p><?= e($stat['label']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="highlights-grid grid-4">
      <?php foreach ($workHighlights as $item): ?>
        <div class="highlight-card">
          <p class="eyebrow" style="letter-spacing:0.12em"><?= e($item['label']) ?></p>
          <p style="margin:0.6rem 0 0"><?= e($item['value']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Proyectos destacados</p>
      <h2 class="display">Obras que impulsan el desarrollo</h2>
    </div>
    <div class="grid-3">
      <?php foreach (array_slice($featured, 0, 6) as $project): ?>
        <a class="project-card" href="<?= e(base_url('proyecto.php?slug=' . urlencode($project['slug']))) ?>">
          <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>" loading="lazy">
          <p class="meta"><?= e($project['category']) ?> · <?= e((string) $project['year']) ?></p>
          <h3><?= e($project['name']) ?></h3>
          <p class="meta"><?= e($project['location']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-outline-gold" href="<?= e(base_url('proyectos.php')) ?>">Ver todos los proyectos</a>
    </div>
  </div>
</section>

<?php
$homeVideos = videos_ready($videos);
$homeFeatured = null;
foreach ($videos as $video) {
    if (!empty($video['featured']) && (!empty($video['file']) || youtube_id($video['youtube'] ?? null))) {
        $homeFeatured = $video;
        break;
    }
}
if ($homeFeatured === null && $homeVideos !== []) {
    $homeFeatured = $homeVideos[0];
}
?>
<?php if ($homeFeatured): ?>
<section class="section section-black">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Videos</p>
      <h2 class="display">Así trabajamos en obra</h2>
      <p class="muted" style="margin-top:0.85rem;max-width:40rem">Mira el trabajo de LCS en campo. Puedes subir MP4 a cPanel o enlazar YouTube.</p>
    </div>
    <?php render_video($homeFeatured, 'video-frame--hero'); ?>
    <?php if (count($homeVideos) > 1): ?>
      <div class="grid-3" style="margin-top:1.5rem">
        <?php foreach (array_slice($homeVideos, 0, 3) as $video): ?>
          <?php if (($video['title'] ?? '') === ($homeFeatured['title'] ?? '')) continue; ?>
          <article class="video-card">
            <?php render_video($video); ?>
            <h3><?= e($video['title']) ?></h3>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
    <div class="actions">
      <a class="btn btn-outline-gold" href="<?= e(base_url('videos.php')) ?>">Ver todos los videos</a>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="section section-white">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Nuestros servicios</p>
      <h2 class="display">Soluciones integrales de construcción</h2>
    </div>
    <div class="grid-3">
      <?php foreach (array_slice($services, 0, 6) as $service): ?>
        <div class="service-card">
          <h3><?= e($service['title']) ?></h3>
          <p style="color:#555"><?= e($service['description']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('servicios.php')) ?>">Ver servicios</a>
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Nuestros clientes</p>
      <h2 class="display">Entidades que confían en LCS</h2>
    </div>
    <div class="grid-3">
      <?php foreach ($clients as $client): ?>
        <a class="client-card client-logo-card" href="<?= e($client['website']) ?>" target="_blank" rel="noopener noreferrer">
          <div class="client-logo-wrap">
            <img src="<?= e(base_url($client['logo'])) ?>" alt="Logotipo de <?= e($client['name']) ?>" loading="lazy">
          </div>
          <strong><?= e($client['name']) ?></strong>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-gold">
  <div class="container" style="text-align:center">
    <h2 class="display" style="font-size:clamp(2rem,5vw,3.4rem)">¿Listo para iniciar tu proyecto?</h2>
    <p style="margin:1rem auto 0;max-width:34rem">Cuéntanos tu necesidad y te respondemos con una propuesta clara, técnica y orientada a plazos.</p>
    <div class="actions" style="justify-content:center">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
