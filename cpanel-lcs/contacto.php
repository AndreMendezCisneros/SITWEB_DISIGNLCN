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
  <div class="container contact-layout">
    <?php if ($status === 'ok'): ?>
      <div class="alert alert-ok">Mensaje recibido. Te contactaremos pronto en <?= e(SITE_EMAIL) ?>.</div>
    <?php elseif ($status === 'error'): ?>
      <div class="alert alert-error">No pudimos enviar el mensaje. Revisa los datos e inténtalo de nuevo.</div>
    <?php elseif ($status === 'spam'): ?>
      <div class="alert alert-error">Envío rechazado por seguridad. Intenta nuevamente.</div>
    <?php endif; ?>

    <div class="contact-cards">
      <div class="info-card contact-office">
        <p class="eyebrow">Oficina</p>
        <ul class="contact-details">
          <li>
            <span class="contact-label">Dirección</span>
            <p><?= e(SITE_ADDRESS) ?></p>
          </li>
          <li>
            <span class="contact-label">Correo electrónico</span>
            <p><a href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?></a></p>
          </li>
          <li>
            <span class="contact-label">Teléfono / celular</span>
            <p><a href="tel:+51<?= e(preg_replace('/\D+/', '', SITE_PHONE)) ?>"><?= e(SITE_PHONE) ?></a></p>
          </li>
          <li>
            <span class="contact-label">WhatsApp</span>
            <p><a href="https://wa.me/<?= e(SITE_WHATSAPP) ?>" target="_blank" rel="noopener">Escribir por WhatsApp (+51 <?= e(SITE_PHONE) ?>)</a></p>
          </li>
          <li class="contact-manager">
            <span class="contact-label">Contacto / gerencia</span>
            <div class="contact-manager-row">
              <img
                src="<?= e(base_url('assets/img/equipo/gerente-general.png')) ?>"
                alt="Jorge Luis Luque Solis, gerente general de LCS"
                width="88"
                height="88"
              >
              <p><?= e(SITE_MANAGER) ?><br><span class="muted">Gerente general</span></p>
            </div>
          </li>
          <li>
            <span class="contact-label">Horario de atención</span>
            <p>Lunes a viernes, 9:00 a. m. – 6:00 p. m.</p>
          </li>
        </ul>
      </div>

      <form class="info-card contact-form" method="post" action="<?= e(base_url('enviar.php')) ?>" novalidate>
        <div class="honeypot" aria-hidden="true">
          <label for="website">Sitio web</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>
        <input type="hidden" name="started_at" value="<?= e((string) round(microtime(true) * 1000)) ?>">

        <div class="form-grid two">
          <div>
            <label for="name">Nombre *</label>
            <input id="name" name="name" type="text" required minlength="2" maxlength="120" autocomplete="name">
          </div>
          <div>
            <label for="company">Empresa</label>
            <input id="company" name="company" type="text" maxlength="160" autocomplete="organization">
          </div>
        </div>

        <div class="form-grid two" style="margin-top:1rem">
          <div>
            <label for="email">Correo *</label>
            <input id="email" name="email" type="email" required maxlength="160" autocomplete="email">
          </div>
          <div>
            <label for="phone">Teléfono</label>
            <input id="phone" name="phone" type="tel" maxlength="40" autocomplete="tel">
          </div>
        </div>

        <div style="margin-top:1rem">
          <label for="message">Mensaje *</label>
          <textarea id="message" name="message" rows="6" required minlength="10" maxlength="4000"></textarea>
        </div>

        <p class="meta" style="margin-top:1rem">El mensaje se enviará a <?= e(CONTACT_TO) ?>.</p>

        <div class="actions">
          <button class="btn btn-gold" type="submit">Enviar mensaje</button>
        </div>
      </form>
    </div>

    <div class="contact-map">
      <iframe
        class="map-frame"
        title="Oficina LCS en Google Maps"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        src="<?= e(maps_embed_url()) ?>"
        allowfullscreen
      ></iframe>
      <p class="meta" style="margin-top:0.75rem">
        <a href="<?= e(maps_open_url()) ?>" target="_blank" rel="noopener">Abrir en Google Maps — C E Link Tower</a>
      </p>
    </div>
  </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
