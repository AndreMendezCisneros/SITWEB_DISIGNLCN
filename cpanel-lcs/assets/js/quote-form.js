/**
 * Formulario de cotización en home (AJAX).
 */
(function () {
  const form = document.querySelector('[data-quote-form]');
  if (!form) return;

  const statusEl = form.querySelector('[data-quote-status]');
  const submitBtn = form.querySelector('[type="submit"]');

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.className = 'quote-status alert ' + (type === 'ok' ? 'alert-ok' : 'alert-error');
    statusEl.textContent = message;
    statusEl.hidden = false;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const name = (form.querySelector('[name="name"]') || {}).value || '';
    const contact = (form.querySelector('[name="contact"]') || {}).value || '';
    const project = (form.querySelector('[name="project"]') || {}).value || '';
    const location = (form.querySelector('[name="location"]') || {}).value || '';
    const budget = (form.querySelector('[name="budget"]') || {}).value || '';
    const message = (form.querySelector('[name="message"]') || {}).value || '';

    if (name.trim().length < 2) {
      setStatus('error', 'Ingresa tu nombre.');
      return;
    }
    if (contact.trim().length < 5) {
      setStatus('error', 'Ingresa un correo o teléfono de contacto.');
      return;
    }
    if (project.trim().length < 3) {
      setStatus('error', 'Describe brevemente el tipo de proyecto.');
      return;
    }

    const data = new FormData(form);
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setStatus('error', json.message || 'No pudimos enviar la cotización. Intenta de nuevo.');
      } else {
        setStatus('ok', json.message || 'Cotización recibida. Te contactaremos pronto.');
        form.reset();
        const started = form.querySelector('[name="started_at"]');
        if (started) started.value = String(Date.now());
      }
    } catch (err) {
      setStatus('error', 'Error de conexión. Revisa tu red e intenta otra vez.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
