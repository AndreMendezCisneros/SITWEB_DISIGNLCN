<?php
$pageTitle = 'Contacto — LCS';
$pageDescription = 'Cotiza tu proyecto con Luque Construcción y Servicios.';
require __DIR__ . '/includes/header.php';

$status = isset($_GET['status']) ? (string) $_GET['status'] : '';
?>
<section class="page-hero">
  <div class="container">
    <p class="eyebrow">Contáctanos</p>
    <h1 class="display">Cotiza tu proyecto</h1>
    <p>Escríbenos para consultas de infraestructura educativa, vial, deportiva, saneamiento o contratos municipales.</p>
  </div>
</section>

<section class="section section-black">
  <div class="container grid-2 md-2">
    <div>
      <div class="info-card" style="margin-bottom:1rem">
        <p class="eyebrow">Oficina</p>
        <p style="margin-top:0.75rem"><?= e(SITE_ADDRESS) ?></p>
        <p style="margin-top:0.75rem"><a href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?></a></p>
        <p style="margin-top:0.5rem"><a href="tel:+51<?= e(preg_replace('/\D+/', '', SITE_PHONE)) ?>"><?= e(SITE_PHONE) ?></a></p>
        <p style="margin-top:0.5rem"><a href="https://wa.me/<?= e(SITE_WHATSAPP) ?>" target="_blank" rel="noopener">WhatsApp</a></p>
      </div>
      <iframe
        class="map-frame"
        title="Oficina LCS"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-76.99605%2C-12.11635%2C-76.98605%2C-12.10635&amp;layer=mapnik&amp;marker=<?= e(SITE_MAP_LAT) ?>%2C<?= e(SITE_MAP_LNG) ?>"
      ></iframe>
      <p class="meta" style="margin-top:0.75rem">
        <a href="https://www.google.com/maps?q=<?= e(SITE_MAP_LAT) ?>,<?= e(SITE_MAP_LNG) ?>" target="_blank" rel="noopener">Abrir en Google Maps</a>
      </p>
    </div>

    <div>
      <?php if ($status === 'ok'): ?>
        <div class="alert alert-ok">Mensaje recibido. Te contactaremos pronto.</div>
      <?php elseif ($status === 'error'): ?>
        <div class="alert alert-error">No pudimos enviar el mensaje. Revisa los datos e inténtalo de nuevo.</div>
      <?php elseif ($status === 'spam'): ?>
        <div class="alert alert-error">Envío rechazado por seguridad. Intenta nuevamente.</div>
      <?php endif; ?>

      <form class="info-card" method="post" action="<?= e(base_url('enviar.php')) ?>" novalidate>
        <div class="honeypot" aria-hidden="true">
          <label for="website">Sitio web</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>
        <input type="hidden" name="started_at" value="<?= e((string) round(microtime(true) * 1000)) ?>">

        <div class="form-grid two">
          <div>
            <label for="name">Nombre *</label>
            <input id="name" name="name" type="text" required minlength="2" maxlength="120">
          </div>
          <div>
            <label for="company">Empresa</label>
            <input id="company" name="company" type="text" maxlength="160">
          </div>
        </div>

        <div class="form-grid two" style="margin-top:1rem">
          <div>
            <label for="email">Correo *</label>
            <input id="email" name="email" type="email" required maxlength="160">
          </div>
          <div>
            <label for="phone">Teléfono</label>
            <input id="phone" name="phone" type="text" maxlength="40">
          </div>
        </div>

        <div style="margin-top:1rem">
          <label for="message">Mensaje *</label>
          <textarea id="message" name="message" rows="6" required minlength="10" maxlength="4000"></textarea>
        </div>

        <div class="actions">
          <button class="btn btn-gold" type="submit">Enviar mensaje</button>
        </div>
      </form>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
