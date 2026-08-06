/**
 * Slider antes/después con input range.
 */
(function () {
  document.querySelectorAll('[data-before-after]').forEach((root) => {
    const range = root.querySelector('[data-ba-range]');
    const overlay = root.querySelector('[data-ba-overlay]');
    const handle = root.querySelector('[data-ba-handle]');
    const frame = root.querySelector('.before-after-frame');
    const beforeImg = root.querySelector('.before-after-before');
    if (!range || !overlay) return;

    function syncWidth() {
      if (frame && beforeImg) {
        beforeImg.style.width = frame.clientWidth + 'px';
      }
    }

    function sync(value) {
      const pct = Math.max(0, Math.min(100, Number(value)));
      overlay.style.width = pct + '%';
      if (handle) handle.style.left = pct + '%';
    }

    range.addEventListener('input', () => sync(range.value));
    window.addEventListener('resize', syncWidth);
    syncWidth();
    sync(range.value);
  });
})();
