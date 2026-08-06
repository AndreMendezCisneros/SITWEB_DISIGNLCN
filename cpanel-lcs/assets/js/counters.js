/**
 * Contadores animados para [data-counter].
 */
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    const target = Number(el.getAttribute('data-counter') || 0);
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduced || !Number.isFinite(target)) {
      el.textContent = String(target) + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = String(value) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => io.observe(el));
})();
