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
      if (video.preload === 'none') {
        video.preload = 'metadata';
        video.load();
      }
      video.setAttribute('autoplay', '');
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    const start = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(play, { timeout: 1800 });
      } else {
        window.setTimeout(play, 350);
      }
    };
    if (window.matchMedia('(max-width: 768px)').matches) {
      window.setTimeout(start, 700);
    } else {
      start();
    }
  }
});
