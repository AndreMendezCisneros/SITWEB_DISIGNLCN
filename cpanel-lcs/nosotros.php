<?php
$pageTitle = 'Nosotros — LCS';
$pageDescription = 'Quiénes somos, misión, visión y valores de Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Nosotros</p>
    <h1 class="display">Construimos confianza, entregamos resultados</h1>
    <p>Empresa peruana de construcción con cinco años de trayectoria, un equipo multidisciplinario y foco en calidad, seguridad y cumplimiento.</p>
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
      <img src="<?= e(base_url('assets/img/proyectos/ie-20158-mala.webp')) ?>" alt="Obra educativa LCS" width="800" height="500" loading="lazy">
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container manager-block">
    <figure class="manager-photo">
      <img
        src="<?= e(base_url('assets/img/equipo/gerente-general.png')) ?>"
        alt="Jorge Luis Luque Solis, gerente general de Luque Construcción y Servicios"
        width="900"
        height="900"
      >
    </figure>
    <div class="manager-copy">
      <p class="eyebrow">Gerencia</p>
      <h2 class="display"><?= e(SITE_MANAGER) ?></h2>
      <p class="manager-role">Gerente general</p>
      <p>Dirige la operación de LCS y el equipo multidisciplinario que ejecuta obras de infraestructura, edificación y mantenimiento en Lima y otras regiones del país.</p>
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
    <div class="section-head reveal">
      <p class="eyebrow">Trayectoria</p>
      <h2 class="display">Nuestra historia en hitos</h2>
    </div>
    <?php require __DIR__ . '/includes/partials/timeline.php'; ?>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Pilares</p>
      <h2 class="display">Cómo trabajamos</h2>
    </div>
    <div class="grid-4">
      <?php foreach ($pillars as $item): ?>
        <div class="pillar reveal">
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
      <p class="coverage-lead">Proyectos ejecutados en ocho regiones del Perú: Talara, Trujillo, Lima, Cañete, Callao, Ilo, Mariscal Nieto y Moho (Puno).</p>
    </div>
    <div class="coverage-layout">
      <div
        class="coverage-map coverage-map-interactive"
        id="coverage-map"
        data-json="<?= e(base_url('assets/data/peru-provinces.json')) ?>"
      >
        <div class="coverage-map-head">
          <p class="coverage-map-kicker">Cobertura</p>
          <div class="coverage-map-stats" aria-hidden="true">
            <span><b data-stat-prov>8</b> provincias</span>
            <span><b data-stat-dep>6</b> departamentos</span>
          </div>
        </div>
        <div class="coverage-map-stage">
          <svg id="coverage-svg" viewBox="0 0 480 694" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Provincias del Perú donde LCS tiene proyectos">
            <g data-leaders></g>
            <g data-provinces></g>
            <g data-dots></g>
            <g data-labels></g>
          </svg>
        </div>
        <p class="coverage-map-note">Toca una provincia en el mapa o en la lista para ubicarla. Las líneas muestran provincia y departamento.</p>
        <div class="coverage-tip" data-coverage-tip></div>
      </div>
      <div class="coverage-regions" id="coverage-regions">
        <?php
        $provinceKeys = [
          'Provincia de Talara' => 'Talara',
          'Provincia de Trujillo' => 'Trujillo',
          'Provincia de Lima' => 'Lima',
          'Provincia de Cañete' => 'Cañete',
          'Provincia del Callao' => 'Callao',
          'Provincia de Ilo' => 'Ilo',
          'Provincia de Mariscal Nieto' => 'Mariscal Nieto',
          'Provincia de Moho' => 'Moho',
        ];
        foreach ($regions as $region):
          $key = $provinceKeys[$region['name']] ?? preg_replace('/^Provincia (de |del )?/u', '', $region['name']);
          $isNew = in_array($key, ['Lima', 'Moho'], true);
        ?>
          <button type="button" class="region-card" data-province="<?= e($key) ?>">
            <span class="region-marker" aria-hidden="true"></span>
            <div>
              <strong><?= e($region['name']) ?><?php if ($isNew): ?> <span class="region-new">nuevo</span><?php endif; ?></strong>
              <p><?= e($region['province']) ?></p>
            </div>
          </button>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Hablar con LCS</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
