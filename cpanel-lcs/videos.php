<?php
$pageTitle = 'Videos — LCS';
$pageDescription = 'Videos de obras y proyectos de Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';

$ready = videos_ready($videos);
$featured = null;
foreach ($videos as $video) {
    if (!empty($video['featured']) && (!empty($video['file']) || youtube_id($video['youtube'] ?? null))) {
        $featured = $video;
        break;
    }
}
if ($featured === null && $ready !== []) {
    $featured = $ready[0];
}
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Multimedia</p>
    <h1 class="display">Videos de obra</h1>
    <p>Conoce el trabajo de LCS en campo. Puedes reproducir archivos locales o videos de YouTube.</p>
  </div>
</section>

<?php if ($featured): ?>
<section class="section section-black">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Destacado</p>
      <h2 class="display"><?= e($featured['title']) ?></h2>
      <?php if (!empty($featured['description'])): ?>
        <p class="muted" style="margin-top:0.85rem;max-width:40rem"><?= e($featured['description']) ?></p>
      <?php endif; ?>
    </div>
    <?php render_video($featured, 'video-frame--hero'); ?>
  </div>
</section>
<?php endif; ?>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Galería</p>
      <h2 class="display">Más videos</h2>
    </div>
    <div class="grid-3">
      <?php foreach ($videos as $video): ?>
        <?php
          $playable = !empty($video['file']) || youtube_id($video['youtube'] ?? null);
          if ($featured && ($video['title'] ?? '') === ($featured['title'] ?? '') && $playable) {
              continue;
          }
        ?>
        <article class="video-card">
          <?php if ($playable): ?>
            <?php render_video($video); ?>
          <?php else: ?>
            <div class="video-frame video-frame--empty">
              <?php if (!empty($video['poster'])): ?>
                <img src="<?= e(base_url($video['poster'])) ?>" alt="<?= e($video['title']) ?>">
              <?php endif; ?>
              <p>Próximamente</p>
            </div>
          <?php endif; ?>
          <h3><?= e($video['title']) ?></h3>
          <?php if (!empty($video['description'])): ?>
            <p class="meta"><?= e($video['description']) ?></p>
          <?php endif; ?>
        </article>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-outline-gold" href="<?= e(base_url('proyectos.php')) ?>">Ver proyectos</a>
      <a class="btn btn-gold" href="<?= e(base_url('contacto.php')) ?>">Cotizar</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
