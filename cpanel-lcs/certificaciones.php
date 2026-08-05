<?php
$pageTitle = 'Certificaciones — LCS';
$pageDescription = 'Gestión de calidad y seguridad en obra.';
require __DIR__ . '/includes/header.php';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Certificaciones</p>
    <h1 class="display">Calidad y seguridad en obra</h1>
    <p>Estándares operativos que aplicamos en cada intervención.</p>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container grid-2 sm-2">
    <?php foreach ($certifications as $cert): ?>
      <div class="cert-card">
        <h3 class="display" style="font-size:1.8rem;margin:0"><?= e($cert['name']) ?></h3>
        <p class="meta" style="margin-top:0.75rem">Emisor: <?= e($cert['issuer']) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
