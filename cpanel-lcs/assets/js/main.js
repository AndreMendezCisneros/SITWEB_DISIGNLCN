document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hero video: no bloquea LCP; reproduce tras idle si no hay reduced motion
  const video = document.getElementById('hero-video');
  if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const play = () => {
      video.setAttribute('autoplay', '');
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(play, { timeout: 2000 });
    } else {
      window.setTimeout(play, 400);
    }
  }
});
