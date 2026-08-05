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
        <div class="service-card">
          <h3><?= e($service['title']) ?></h3>
          <p style="color:#555"><?= e($service['description']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Solicitar cotización</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
