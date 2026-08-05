<?php
$pageTitle = 'Nosotros — LCS';
$pageDescription = 'Quiénes somos, misión, visión y valores de Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Nosotros</p>
    <h1 class="display">Construimos confianza, entregamos resultados</h1>
    <p>Empresa peruana de construcción con foco en calidad, seguridad y cumplimiento.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container grid-2 md-2 nosotros-intro">
    <div class="nosotros-copy">
      <p class="eyebrow">Nuestra historia</p>
      <h2 class="display"><?= e($about['historia']['title']) ?></h2>
      <?php foreach (explode("\n\n", $about['historia']['body']) as $para): ?>
        <p><?= e($para) ?></p>
      <?php endforeach; ?>
    </div>
    <div class="about-image has-img">
      <img src="<?= e(base_url('assets/img/proyectos/ie-20158-mala.webp')) ?>" alt="Obra educativa LCS">
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container grid-3">
    <?php foreach (['mision', 'vision', 'valores'] as $key): ?>
      <div class="info-card">
        <p class="eyebrow"><?= e($about[$key]['title']) ?></p>
        <?php foreach (explode("\n\n", $about[$key]['body']) as $para): ?>
          <p style="margin-top:0.9rem"><?= e($para) ?></p>
        <?php endforeach; ?>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Pilares</p>
      <h2 class="display">Cómo trabajamos</h2>
    </div>
    <div class="grid-4">
      <?php foreach ($pillars as $item): ?>
        <div class="pillar">
          <p class="eyebrow"><?= e($item['title']) ?></p>
          <p><?= e($item['body']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Cobertura</p>
      <h2 class="display">Presencia regional</h2>
      <p class="coverage-lead">Proyectos ejecutados en seis regiones estratégicas del Perú.</p>
    </div>
    <div class="coverage-layout">
      <figure class="coverage-map">
        <img
          src="<?= e(base_url('assets/img/cobertura-regional-lcs.png')) ?>"
          alt="Mapa del Perú con cobertura de LCS en Piura, La Libertad, Lima, Callao y Moquegua"
          loading="lazy"
        >
      </figure>
      <div class="coverage-regions">
        <?php foreach ($regions as $region): ?>
          <div class="region-card">
            <span class="region-marker" aria-hidden="true"></span>
            <div>
              <strong><?= e($region['name']) ?></strong>
              <p><?= e($region['province']) ?></p>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Hablar con LCS</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
