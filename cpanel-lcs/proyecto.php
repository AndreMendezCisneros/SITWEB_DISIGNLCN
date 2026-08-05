<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/data.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
$project = $slug !== '' ? find_project_by_slug($projects, $slug) : null;

if ($project === null) {
    header('Location: ' . base_url('proyectos.php'), true, 302);
    exit;
}

$pageTitle = $project['name'] . ' — LCS';
$pageDescription = $project['description'];
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow"><?= e($project['category']) ?></p>
    <h1 class="display"><?= e($project['name']) ?></h1>
    <p><?= e($project['location']) ?> · <?= e((string) $project['year']) ?></p>
  </div>
</section>

<section class="section section-black">
  <div class="container grid-2 md-2">
    <div class="detail-media">
      <img src="<?= e(base_url($project['image'])) ?>" alt="<?= e($project['name']) ?>">
    </div>
    <div>
      <p><?= e($project['description']) ?></p>
      <div class="detail-meta" style="margin-top:1.75rem">
        <div><span>Entidad</span><?= e($project['entity']) ?></div>
        <div><span>Estado</span><?= e($project['condition']) ?></div>
        <div><span>Monto</span><?= e(format_money((float) $project['amount'])) ?></div>
        <div><span>Duración</span><?= $project['duration_days'] ? e((string) $project['duration_days']) . ' días' : '—' ?></div>
      </div>
      <div class="actions">
        <a class="btn btn-gold" href="<?= e(base_url('contacto.php')) ?>">Cotizar un proyecto similar</a>
        <a class="btn btn-outline-gold" href="<?= e(base_url('proyectos.php')) ?>">Volver a proyectos</a>
      </div>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
