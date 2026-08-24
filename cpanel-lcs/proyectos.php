<?php
$pageTitle = 'Proyectos — LCS';
$pageDescription = 'Obras públicas y privadas ejecutadas y en ejecución por Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';
$live = projects_in_progress($projects);
$done = projects_completed($projects);
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Proyectos</p>
    <h1 class="display">Obras que impulsan el desarrollo</h1>
    <p>Intervenciones documentadas en educación, salud, vial, deporte, saneamiento y más.</p>
  </div>
</section>

<section class="section section-live">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">En ejecución</p>
      <h2 class="display">Proyectos vigentes de alto impacto</h2>
    </div>
    <div class="grid-2 md-2">
      <?php foreach ($live as $project): ?>
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

<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Realizados</p>
      <h2 class="display">Proyectos históricos</h2>
    </div>
    <div class="grid-3">
      <?php foreach ($done as $project): ?>
        <a class="project-card" href="<?= e(base_url('proyecto.php?slug=' . urlencode($project['slug']))) ?>">
          <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>" loading="lazy" width="640" height="400">
          <p class="meta"><?= e($project['category']) ?> · <?= e((string) $project['year']) ?></p>
          <h3><?= e($project['name']) ?></h3>
          <p class="meta"><?= e($project['location']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
