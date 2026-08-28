<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/data.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
if ($slug === 'limpieza-trujillo') {
    header('Location: ' . base_url('proyecto.php?slug=planta-valorizacion-residuos'), true, 301);
    exit;
}
$project = $slug !== '' ? find_project_by_slug($projects, $slug) : null;

if ($project === null) {
    header('Location: ' . base_url('proyectos.php'), true, 302);
    exit;
}

$pageTitle = $project['name'] . ' — LCS';
$pageDescription = $project['category'] . ' en ' . $project['location'] . ' | LCS — Luque Construcción y Servicios';
require __DIR__ . '/includes/header.php';

$gallery = $project['gallery'] ?? [];
if ($gallery === [] && !empty($project['image'])) {
    $gallery = [$project['image']];
}
$hasBeforeAfter = !empty($project['before']) && !empty($project['after']);
$projectVideo = $project['video'] ?? null;
$hasProjectVideo = is_array($projectVideo) && video_is_playable($projectVideo);
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
    <div class="detail-media reveal">
      <img
        src="<?= e(base_url($project['image'])) ?>"
        alt="<?= e($project['name']) ?>"
        width="960"
        height="600"
      >
    </div>
    <div class="reveal">
      <p><?= e($project['description']) ?></p>

      <table class="tech-sheet">
        <caption>Ficha técnica</caption>
        <tbody>
          <tr>
            <th scope="row">Entidad contratante</th>
            <td><?= e($project['entity']) ?></td>
          </tr>
          <tr>
            <th scope="row">Ubicación</th>
            <td><?= e($project['location']) ?></td>
          </tr>
          <tr>
            <th scope="row">Año</th>
            <td><?= e((string) $project['year']) ?></td>
          </tr>
          <tr>
            <th scope="row">Plazo</th>
            <td><?= $project['duration_days'] ? e((string) $project['duration_days']) . ' días' : '—' ?></td>
          </tr>
          <tr>
            <th scope="row">Monto</th>
            <td><?= isset($project['amount']) && $project['amount'] !== null ? e(format_money((float) $project['amount'])) : '—' ?></td>
          </tr>
          <tr>
            <th scope="row">Estado</th>
            <td><?= e($project['condition']) ?></td>
          </tr>
        </tbody>
      </table>

      <div class="actions">
        <a class="btn btn-gold" href="<?= e(base_url('contacto.php')) ?>">Cotizar un proyecto similar</a>
        <a class="btn btn-outline-gold" href="<?= e(base_url('proyectos.php')) ?>">Volver a proyectos</a>
      </div>
    </div>
  </div>
</section>

<?php if (count($gallery) > 0): ?>
<section class="section section-charcoal">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Galería</p>
      <h2 class="display">Imágenes del proyecto</h2>
    </div>
    <div class="project-gallery" data-lightbox-gallery>
      <?php foreach ($gallery as $img): ?>
        <a class="project-gallery-item reveal" href="<?= e(base_url($img)) ?>">
          <img src="<?= e(base_url($img)) ?>" alt="<?= e($project['name']) ?>" loading="lazy" width="640" height="400">
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($hasProjectVideo): ?>
<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Video</p>
      <h2 class="display"><?= e($projectVideo['title'] ?? 'Video de obra') ?></h2>
      <?php if (!empty($projectVideo['description'])): ?>
        <p class="muted" style="margin-top:0.85rem;max-width:40rem"><?= e($projectVideo['description']) ?></p>
      <?php endif; ?>
    </div>
    <div class="reveal">
      <?php render_video($projectVideo, 'video-frame--hero'); ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($hasBeforeAfter): ?>
<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Antes / Después</p>
      <h2 class="display">Evolución de la obra</h2>
    </div>
    <div class="reveal">
      <?php
      $before = $project['before'];
      $after = $project['after'];
      $alt = $project['name'];
      require __DIR__ . '/includes/partials/before-after.php';
      ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
