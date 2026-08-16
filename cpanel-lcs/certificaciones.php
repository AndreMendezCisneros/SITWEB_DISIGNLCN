<?php
$pageTitle = 'Certificaciones ISO — LCS';
$pageDescription = 'Certificados ISO 45001, ISO 37001, ISO 9001 e ISO 14001 de Luque Construcción y Servicios S.A.C.';
require __DIR__ . '/includes/header.php';
$meta = $certificationMeta;
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Certificaciones</p>
    <h1 class="display">Sistemas de gestión certificados</h1>
    <p>Registros ISO emitidos por SISTEMACERTS para <?= e($meta['company']) ?>, con alcance en ejecución de obras, servicios, suministro y consultoría.</p>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="cert-intro reveal">
      <div>
        <p class="eyebrow">Titular</p>
        <h2 class="display cert-intro-title"><?= e($meta['company']) ?></h2>
        <p class="muted">RUC <?= e($meta['ruc']) ?> · <?= e($meta['ciiu']) ?> · <?= e($meta['sector']) ?></p>
        <p class="muted"><?= e($meta['address']) ?></p>
      </div>
      <div class="cert-intro-actions">
        <a class="btn btn-gold" href="<?= e($meta['verify_url']) ?>" target="_blank" rel="noopener">Verificar registro</a>
      </div>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Normas certificadas</p>
      <h2 class="display">Cuatro sistemas de gestión</h2>
    </div>
    <div class="cert-iso-grid">
      <?php foreach ($certifications as $cert): ?>
        <article class="cert-iso-card reveal">
          <span class="cert-badge"><?= e($cert['badge']) ?></span>
          <p class="meta"><?= e($cert['code']) ?></p>
          <h3 class="cert-card-title"><?= e($cert['name']) ?></h3>
          <dl class="cert-facts">
            <div>
              <dt>Vigencia</dt>
              <dd><?= e($cert['valid_from']) ?> — <?= e($cert['valid_to']) ?></dd>
            </div>
            <div>
              <dt>Registro</dt>
              <dd><?= e($cert['register']) ?></dd>
            </div>
            <div>
              <dt>Código de validez</dt>
              <dd><code><?= e($cert['validity_code']) ?></code></dd>
            </div>
            <div>
              <dt>Emisor</dt>
              <dd><?= e($cert['issuer']) ?></dd>
            </div>
            <div>
              <dt>Acreditación</dt>
              <dd><?= e($cert['accreditation']) ?></dd>
            </div>
            <div>
              <dt>1.ª evaluación periódica</dt>
              <dd><?= e($cert['review_1']) ?></dd>
            </div>
            <div>
              <dt>2.ª evaluación periódica</dt>
              <dd><?= e($cert['review_2']) ?></dd>
            </div>
          </dl>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-black">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Alcance certificado</p>
      <h2 class="display">Obras, servicios, bienes y consultoría</h2>
      <p class="muted section-lead">El alcance cubre creación, construcción, mejoramiento, ampliación, mantenimiento, remodelación, reparación, acondicionamiento, rehabilitación, sustitución, adecuación, instalación, reconstrucción y demolición en las siguientes líneas.</p>
    </div>
    <div class="cert-scope-grid">
      <?php foreach ($certificationScopeGroups as $group): ?>
        <article class="info-card reveal">
          <p class="eyebrow"><?= e($group['title']) ?></p>
          <ul class="cert-scope-list">
            <?php foreach ($group['items'] as $item): ?>
              <li><?= e($item) ?></li>
            <?php endforeach; ?>
          </ul>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section-charcoal">
  <div class="container grid-2 md-2">
    <div class="info-card reveal">
      <p class="eyebrow">Tipo de proveedor</p>
      <ul class="cert-scope-list">
        <?php foreach ($meta['provider_types'] as $type): ?>
          <li><?= e($type) ?></li>
        <?php endforeach; ?>
      </ul>
    </div>
    <div class="info-card reveal">
      <p class="eyebrow">Verificación</p>
      <p>Ingresa el código de validez de cada certificado en el portal de SISTEMACERTS.</p>
      <p class="meta cert-card-meta">ISO/IEC 17021-1 N.° <?= e($meta['iso17021']) ?></p>
      <p class="meta">Perú: <?= e($meta['verify_pe']) ?></p>
      <div class="actions">
        <a class="btn btn-gold" href="<?= e($meta['verify_url']) ?>" target="_blank" rel="noopener">sistemacerts-verification.com</a>
      </div>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
