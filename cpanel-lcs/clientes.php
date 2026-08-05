<?php
$pageTitle = 'Clientes — LCS';
$pageDescription = 'Entidades públicas y privadas que confían en LCS.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero light">
  <div class="container">
    <p class="eyebrow">Clientes</p>
    <h1 class="display">Entidades que confían en LCS</h1>
    <p>Municipios, gobierno regional y empresas con las que hemos ejecutado obras.</p>
  </div>
</section>

<section class="section section-white">
  <div class="container">
    <div class="grid-3">
      <?php foreach ($clients as $client): ?>
        <a class="client-card client-logo-card" href="<?= e($client['website']) ?>" target="_blank" rel="noopener noreferrer">
          <div class="client-logo-wrap">
            <img src="<?= e(base_url($client['logo'])) ?>" alt="Logotipo de <?= e($client['name']) ?>" loading="lazy">
          </div>
          <strong><?= e($client['name']) ?></strong>
        </a>
      <?php endforeach; ?>
    </div>
    <div class="actions">
      <a class="btn btn-dark" href="<?= e(base_url('contacto.php')) ?>">Cotiza tu proyecto</a>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
