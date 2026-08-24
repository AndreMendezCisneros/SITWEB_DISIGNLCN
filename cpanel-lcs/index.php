<?php
$pageTitle = 'LCS — Luque Construcción y Servicios';
$pageDescription = 'Construimos soluciones, creamos futuro. Proyectos de construcción, infraestructura y mantenimiento.';
require __DIR__ . '/includes/header.php';

$featured = array_values(array_filter($projects, static fn ($p) => !empty($p['featured']) && empty($p['in_progress'])));
$historiaParts = explode("\n\n", $about['historia']['body']);
?>
<section class="hero">
  <div class="hero-media">
    <video
      id="hero-video"
      muted
      loop
      playsinline
      preload="none"
      poster="<?= e(base_url('assets/img/hero-poster.jpg')) ?>"
      aria-hidden="true"
    >
      <source src="<?= e(base_url('assets/video/inicio.mp4')) ?>" type="video/mp4">
    </video>
  </div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="eyebrow">Luque Construcción y Servicios</p>
    <h1 class="display hero-title">Construimos soluciones,<br>creamos futuro</h1>
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
      <div class="pillar reveal">
        <p class="eyebrow"><?= e($item['title']) ?></p>
        <p><?= e($item['body']) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section
  class="scroll-showcase"
  style="--showcase-image: url('<?= e(base_url('assets/img/hero-poster.jpg')) ?>')"
  aria-label="Maquinaria y experiencia de LCS"
>
  <div class="scroll-showcase-overlay"></div>
  <div class="container scroll-showcase-content reveal">
    <p class="eyebrow">Experiencia en movimiento</p>
    <h2 class="display">Construimos sobre bases sólidas</h2>
    <p>Maquinaria, planificación y un equipo multidisciplinario para convertir cada proyecto en resultados.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container grid-2 md-2">
    <div class="reveal">
      <p class="eyebrow">Sobre LCS</p>
      <h2 class="display">Construimos con confianza</h2>
      <p class="text-muted-light"><?= e($historiaParts[0] ?? '') ?></p>
      <p class="text-muted-light">Transformamos visión en realidad: desde infraestructura educativa y deportiva hasta saneamiento, vías y contratos municipales, con un firme compromiso en excelencia operativa.</p>
      <div class="actions">
        <a class="btn btn-dark" href="<?= e(base_url('nosotros.php')) ?>">Conoce nuestra empresa</a>
        <a class="btn btn-outline-dark" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
      </div>
    </div>
    <div class="about-image has-img reveal">
      <img src="<?= e(base_url('assets/img/proyectos/mercado-el-algarrobal.webp')) ?>" alt="Proyecto LCS" width="800" height="500" loading="lazy">
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Resultados</p>
      <h2 class="display">Cinco años construyendo futuro</h2>
      <p class="muted section-lead">Capacidad demostrada en obras públicas y privadas a lo largo del Perú, con un equipo multidisciplinario. Estos indicadores resumen nuestro alcance operativo.</p>
    </div>
    <div class="stats-grid grid-4 stats-grid-spaced">
      <?php foreach ($stats as $stat): ?>
        <div class="stat-card reveal">
          <?php if (isset($stat['number']) && $stat['number'] !== null): ?>
            <p class="display">
              <span
                data-counter="<?= e((string) $stat['number']) ?>"
                data-suffix="<?= e((string) ($stat['suffix'] ?? '')) ?>"
              >0<?= e((string) ($stat['suffix'] ?? '')) ?></span>
            </p>
          <?php else: ?>
            <p class="display"><?= e((string) ($stat['value'] ?? '')) ?></p>
          <?php endif; ?>
          <p><?= e($stat['label']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="highlights-grid grid-4">
      <?php foreach ($workHighlights as $item): ?>
        <div class="highlight-card reveal">
          <p class="eyebrow highlight-label"><?= e($item['label']) ?></p>
          <p class="highlight-value"><?= e($item['value']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Seguridad</p>
      <h2 class="display">Compromiso en obra</h2>
      <p class="muted section-lead">Cifras orientativas de nuestro enfoque SST. Actualízalas en includes/data.php cuando tengas datos auditados.</p>
    </div>
    <div class="stats-grid grid-3">
      <?php foreach ($safetyStats as $stat): ?>
        <div class="stat-card reveal">
          <p class="display">
            <span
              data-counter="<?= e((string) $stat['number']) ?>"
              data-suffix="<?= e((string) ($stat['suffix'] ?? '')) ?>"
            >0<?= e((string) ($stat['suffix'] ?? '')) ?></span>
          </p>
          <p><?= e($stat['label']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Trayectoria</p>
      <h2 class="display">Hitos que marcan nuestro camino</h2>
    </div>
    <?php
    $timeline = array_slice($timeline, -5);
    require __DIR__ . '/includes/partials/timeline.php';
    ?>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('nosotros.php')) ?>">Ver trayectoria completa</a>
    </div>
  </div>
</section>

<section class="section section-live">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">En ejecución</p>
      <h2 class="display">Proyectos vigentes de alto impacto</h2>
      <p class="muted section-lead">Intervenciones en curso para el Instituto Nacional de Salud y el Gobierno Regional de Puno.</p>
    </div>
    <div class="grid-2 md-2">
      <?php foreach (projects_in_progress($projects) as $project): ?>
        <a class="project-card project-card-live reveal" href="<?= e(base_url('proyecto.php?slug=' . urlencode($project['slug']))) ?>">
          <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>" loading="lazy" width="640" height="400">
          <p class="meta"><span class="live-pill">En ejecución</span> <?= e($project['category']) ?> · <?= e((string) $project['year']) ?></p>
          <h3><?= e($project['name']) ?></h3>
          <p class="meta"><?= e($project['location']) ?> · <?= e($project['entity']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Proyectos destacados</p>
      <h2 class="display">Obras que impulsan el desarrollo</h2>
    </div>
    <div class="grid-3">
      <?php foreach (array_slice($featured, 0, 6) as $project): ?>
        <a class="project-card reveal" href="<?= e(base_url('proyecto.php?slug=' . urlencode($project['slug']))) ?>">
          <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>" loading="lazy" width="640" height="400">
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
    <div class="section-head reveal">
      <p class="eyebrow">Videos</p>
      <h2 class="display">Así trabajamos en obra</h2>
      <p class="muted section-lead">Mira el trabajo de LCS en campo.</p>
    </div>
    <div class="reveal">
      <?php render_video($homeFeatured, 'video-frame--hero'); ?>
    </div>
    <?php if (count($homeVideos) > 1): ?>
      <div class="grid-3 video-grid-spaced">
        <?php foreach (array_slice($homeVideos, 0, 3) as $video): ?>
          <?php if (($video['title'] ?? '') === ($homeFeatured['title'] ?? '')) continue; ?>
          <article class="video-card reveal">
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
    <div class="section-head reveal">
      <p class="eyebrow">Nuestros servicios</p>
      <h2 class="display">Soluciones integrales de construcción</h2>
    </div>
    <div class="grid-3">
      <?php foreach (array_slice($services, 0, 6) as $service): ?>
        <article class="service-card reveal">
          <?php if (!empty($service['image'])): ?>
            <img
              src="<?= e(base_url($service['image'])) ?>"
              alt="<?= e($service['title']) ?>"
              loading="lazy"
              width="640"
              height="400"
            >
          <?php endif; ?>
          <h3><?= e($service['title']) ?></h3>
          <p class="service-card-desc"><?= e($service['description']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('servicios.php')) ?>">Ver servicios</a>
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Certificaciones</p>
      <h2 class="display">Estándares que aplicamos en obra</h2>
    </div>
    <div class="cert-teaser-grid">
      <?php foreach ($certifications as $cert): ?>
        <article class="cert-badge-card reveal">
          <span class="cert-badge"><?= e($cert['badge'] ?? 'ISO') ?></span>
          <h3><?= e($cert['code'] ?? $cert['name']) ?></h3>
          <p class="meta"><?= e($cert['name']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-outline-gold" href="<?= e(base_url('certificaciones.php')) ?>">Ver certificaciones</a>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Nuestros clientes</p>
      <h2 class="display">Entidades que confían en LCS</h2>
    </div>
    <div class="grid-3">
      <?php foreach ($clients as $client): ?>
        <a class="client-card client-logo-card reveal" href="<?= e($client['website']) ?>" target="_blank" rel="noopener noreferrer">
          <div class="client-logo-wrap">
            <img src="<?= e(base_url($client['logo'])) ?>" alt="Logotipo de <?= e($client['name']) ?>" loading="lazy" width="200" height="120">
          </div>
          <strong><?= e($client['name']) ?></strong>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Testimonios</p>
      <h2 class="display">Lo que destacan de trabajar con LCS</h2>
    </div>
    <div class="carousel reveal" data-carousel>
      <div class="carousel-track">
        <?php foreach ($testimonials as $i => $item): ?>
          <blockquote class="carousel-slide<?= $i === 0 ? ' is-active' : '' ?>" data-carousel-slide<?= $i === 0 ? '' : ' aria-hidden="true"' ?>>
            <p class="carousel-quote">“<?= e($item['quote']) ?>”</p>
            <footer>
              <strong><?= e($item['name']) ?></strong>
              <span class="meta"><?= e($item['role']) ?></span>
            </footer>
          </blockquote>
        <?php endforeach; ?>
      </div>
      <div class="carousel-controls">
        <button type="button" class="btn btn-outline-gold" data-carousel-prev aria-label="Anterior">Anterior</button>
        <div class="carousel-dots" data-carousel-dots></div>
        <button type="button" class="btn btn-outline-gold" data-carousel-next aria-label="Siguiente">Siguiente</button>
      </div>
    </div>
  </div>
</section>

<section class="section section-white" id="cotizar">
  <div class="container grid-2 md-2">
    <div class="reveal">
      <p class="eyebrow">Cotización rápida</p>
      <h2 class="display">Cuéntanos tu proyecto</h2>
      <p class="text-muted-light">Formulario corto para una primera evaluación. También puedes escribirnos por WhatsApp o al correo contactenos@lcs.pe.</p>
    </div>
    <form
      class="info-card quote-form reveal"
      method="post"
      action="<?= e(base_url('enviar-cotizacion.php')) ?>"
      data-quote-form
      novalidate
    >
      <div class="honeypot" aria-hidden="true">
        <label for="quote-website">Sitio web</label>
        <input type="text" id="quote-website" name="website" tabindex="-1" autocomplete="off">
      </div>
      <input type="hidden" name="started_at" value="<?= e((string) round(microtime(true) * 1000)) ?>">

      <div class="form-grid two">
        <div>
          <label for="quote-name">Nombre *</label>
          <input id="quote-name" name="name" type="text" required minlength="2" maxlength="120" autocomplete="name">
        </div>
        <div>
          <label for="quote-contact">Correo o teléfono *</label>
          <input id="quote-contact" name="contact" type="text" required minlength="5" maxlength="160" autocomplete="email">
        </div>
      </div>
      <div class="form-grid two form-grid-spaced">
        <div>
          <label for="quote-project">Tipo de proyecto *</label>
          <input id="quote-project" name="project" type="text" required minlength="3" maxlength="200" placeholder="Ej. infraestructura vial">
        </div>
        <div>
          <label for="quote-location">Ubicación</label>
          <input id="quote-location" name="location" type="text" maxlength="200" placeholder="Distrito / provincia">
        </div>
      </div>
      <div class="form-grid-spaced">
        <label for="quote-budget">Presupuesto aproximado</label>
        <input id="quote-budget" name="budget" type="text" maxlength="80" placeholder="Opcional">
      </div>
      <div class="form-grid-spaced">
        <label for="quote-message">Detalle</label>
        <textarea id="quote-message" name="message" rows="4" maxlength="2000" placeholder="Alcance, plazos u observaciones"></textarea>
      </div>
      <div class="quote-status" data-quote-status hidden></div>
      <div class="actions">
        <button class="btn btn-gold" type="submit">Solicitar cotización</button>
      </div>
    </form>
  </div>
</section>

<section class="section section-gold">
  <div class="container cta-center">
    <h2 class="display cta-title">¿Listo para iniciar tu proyecto?</h2>
    <p class="cta-copy">Cuéntanos tu necesidad y te respondemos con una propuesta clara, técnica y orientada a plazos.</p>
    <div class="actions actions-center">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
