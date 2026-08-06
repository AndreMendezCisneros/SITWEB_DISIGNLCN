/**
 * Carousel simple de testimonios [data-carousel].
 */
(function () {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    if (slides.length < 2) return;

    let index = 0;
    let timer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, n) => {
          dot.classList.toggle('is-active', n === index);
          dot.setAttribute('aria-current', n === index ? 'true' : 'false');
        });
      }
    }

    function next() {
      go(index + 1);
    }

    function prev() {
      go(index - 1);
    }

    function startAuto() {
      if (reduced) return;
      stopAuto();
      timer = window.setInterval(next, 6000);
    }

    function stopAuto() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    if (dotsWrap) {
      slides.forEach((_, n) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'carousel-dot';
        btn.setAttribute('aria-label', 'Ir al testimonio ' + (n + 1));
        btn.addEventListener('click', () => {
          go(n);
          startAuto();
        });
        dotsWrap.appendChild(btn);
      });
    }

    prevBtn && prevBtn.addEventListener('click', () => {
      prev();
      startAuto();
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      next();
      startAuto();
    });

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);

    go(0);
    startAuto();
  });
})();
