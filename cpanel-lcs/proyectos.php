<?php
$pageTitle = 'Proyectos — LCS';
$pageDescription = 'Obras públicas y privadas ejecutadas por Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Proyectos</p>
    <h1 class="display">Obras que impulsan el desarrollo</h1>
    <p>Intervenciones documentadas en educación, vial, deporte, saneamiento y más.</p>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="grid-3">
      <?php foreach ($projects as $project): ?>
        <a class="project-card" href="<?= e(base_url('proyecto.php?slug=' . urlencode($project['slug']))) ?>">
          <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>" loading="lazy">
          <p class="meta"><?= e($project['category']) ?> · <?= e((string) $project['year']) ?></p>
          <h3><?= e($project['name']) ?></h3>
          <p class="meta"><?= e($project['location']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
