<?php
$pageTitle = 'Servicios — LCS';
$pageDescription = 'Soluciones integrales de construcción, infraestructura y mantenimiento.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Servicios</p>
    <h1 class="display">Soluciones integrales de construcción</h1>
    <p>Desde edificaciones y vías hasta saneamiento, hidráulica y contratos municipales.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="grid-3">
      <?php foreach ($services as $service): ?>
        <article class="service-card">
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
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Solicitar cotización</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
