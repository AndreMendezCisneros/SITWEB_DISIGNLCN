/**
 * Lightbox vanilla para [data-lightbox-gallery].
 */
(function () {
  const galleries = document.querySelectorAll('[data-lightbox-gallery]');
  if (!galleries.length) return;

  let dialog = document.querySelector('[data-lightbox]');
  if (!dialog) {
    dialog = document.createElement('div');
    dialog.className = 'lightbox';
    dialog.setAttribute('data-lightbox', '');
    dialog.setAttribute('hidden', '');
    dialog.innerHTML =
      '<button type="button" class="lightbox-close" data-lightbox-close aria-label="Cerrar">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Anterior">‹</button>' +
      '<img class="lightbox-img" data-lightbox-img alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Siguiente">›</button>';
    document.body.appendChild(dialog);
  }

  const imgEl = dialog.querySelector('[data-lightbox-img]');
  const btnClose = dialog.querySelector('[data-lightbox-close]');
  const btnPrev = dialog.querySelector('[data-lightbox-prev]');
  const btnNext = dialog.querySelector('[data-lightbox-next]');

  let items = [];
  let index = 0;

  function openAt(list, i) {
    items = list;
    index = i;
    show();
    dialog.removeAttribute('hidden');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    dialog.setAttribute('hidden', '');
    document.body.classList.remove('lightbox-open');
  }

  function show() {
    const item = items[index];
    if (!item || !imgEl) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt || '';
  }

  function prev() {
    if (!items.length) return;
    index = (index - 1 + items.length) % items.length;
    show();
  }

  function next() {
    if (!items.length) return;
    index = (index + 1) % items.length;
    show();
  }

  galleries.forEach((gallery) => {
    const links = Array.from(gallery.querySelectorAll('a[href]'));
    const list = links.map((a) => ({
      src: a.getAttribute('href'),
      alt: (a.querySelector('img') && a.querySelector('img').alt) || '',
    }));

    links.forEach((a, i) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        openAt(list, i);
      });
    });
  });

  btnClose && btnClose.addEventListener('click', close);
  btnPrev && btnPrev.addEventListener('click', prev);
  btnNext && btnNext.addEventListener('click', next);
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) close();
  });
  document.addEventListener('keydown', (ev) => {
    if (dialog.hasAttribute('hidden')) return;
    if (ev.key === 'Escape') close();
    if (ev.key === 'ArrowLeft') prev();
    if (ev.key === 'ArrowRight') next();
  });
})();
