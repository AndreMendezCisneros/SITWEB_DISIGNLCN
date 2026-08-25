/**
 * Mapa de cobertura LCS — silueta completa del Perú + provincias activas.
 * Carga diferida al entrar en pantalla (IntersectionObserver).
 */
(function () {
  const root = document.getElementById('coverage-map');
  if (!root) return;

  const jsonUrl = root.getAttribute('data-json');
  if (!jsonUrl) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const tip = root.querySelector('[data-coverage-tip]');
  const listEl = document.getElementById('coverage-regions');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NEW_PROVINCES = new Set(['Lima', 'Moho']);

  let locked = null;
  let covered = [];
  let pathEls = {};
  let started = false;
  let mapData = null;

  function isMobile() {
    return window.matchMedia('(max-width: 700px)').matches;
  }

  function labelGutter() {
    return isMobile() ? 12 : 195;
  }

  function setViewBox(svg, data) {
    const g = labelGutter();
    svg.setAttribute('viewBox', -g + ' 0 ' + (data.w + g) + ' ' + data.h);
    root.classList.toggle('is-mobile', isMobile());
  }

  function el(name, attrs) {
    const node = document.createElementNS(svgNS, name);
    if (attrs) {
      Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
    }
    return node;
  }

  function showTip(e, f) {
    if (!tip) return;
    tip.innerHTML = '<b>' + f.n + '</b><small>Departamento: ' + f.dp + '</small>';
    tip.classList.add('is-show');
    moveTip(e);
  }

  function moveTip(e) {
    if (!tip) return;
    tip.style.left = e.clientX + 'px';
    tip.style.top = e.clientY + 'px';
  }

  function hideTip() {
    if (!tip) return;
    tip.classList.remove('is-show');
  }

  function setActive(name) {
    if (listEl) {
      listEl.querySelectorAll('.region-card').forEach((r) => {
        r.classList.toggle('is-active', r.getAttribute('data-province') === name);
      });
    }
    root.querySelectorAll('.province.covered').forEach((p) => {
      p.classList.toggle('is-active', p.getAttribute('data-name') === name);
    });
    root.querySelectorAll('.centroid-dot').forEach((d) => {
      const on = d.getAttribute('data-name') === name;
      d.setAttribute('r', on ? '4.2' : '3');
      d.classList.toggle('is-active', on);
    });
    root.querySelectorAll('.leader, .leader-label').forEach((node) => {
      node.classList.toggle('is-active', node.getAttribute('data-name') === name);
    });
  }

  function selectProvince(name) {
    locked = locked === name ? null : name;
    setActive(locked);
    if (locked) {
      const f = covered.find((x) => x.n === name);
      if (f && tip) {
        showTip({ clientX: window.innerWidth / 2, clientY: 120 }, f);
        window.setTimeout(hideTip, 1100);
      }
    }
  }

  function wireList() {
    if (!listEl) return;
    listEl.querySelectorAll('.region-card').forEach((row) => {
      const name = row.getAttribute('data-province');
      row.addEventListener('mouseenter', () => {
        if (!locked) setActive(name);
      });
      row.addEventListener('mouseleave', () => {
        if (!locked) setActive(null);
        else setActive(locked);
      });
      row.addEventListener('click', () => selectProvince(name));
    });
  }

  function placeLeaders(data, gLeaders, gLabels) {
    const n = covered.length;
    const top = 40;
    const bottom = data.h - 36;
    const span = n > 1 ? (bottom - top) / (n - 1) : 0;
    const labelX = -18;

    covered.forEach((f, i) => {
      const ly = n === 1 ? data.h / 2 : top + i * span;
      const midX = Math.min(f.cx, labelX + 52);

      gLeaders.appendChild(
        el('path', {
          class: 'leader',
          'data-name': f.n,
          d:
            'M ' +
            f.cx +
            ',' +
            f.cy +
            ' L ' +
            midX +
            ',' +
            f.cy +
            ' L ' +
            (labelX + 10) +
            ',' +
            ly,
        })
      );

      const g = el('g', {
        class: 'leader-label',
        'data-name': f.n,
        transform: 'translate(' + labelX + ',' + ly + ')',
      });

      const province = el('text', {
        class: 'leader-province',
        x: '0',
        y: '-6',
        'text-anchor': 'end',
      });
      province.textContent = f.n;
      g.appendChild(province);

      const dept = el('text', {
        class: 'leader-dept',
        x: '0',
        y: '14',
        'text-anchor': 'end',
      });
      dept.textContent = f.dp;
      g.appendChild(dept);

      if (NEW_PROVINCES.has(f.n)) {
        const tag = el('text', {
          class: 'leader-new',
          x: '0',
          y: '30',
          'text-anchor': 'end',
        });
        tag.textContent = 'nuevo';
        g.appendChild(tag);
      }

      g.addEventListener('click', () => selectProvince(f.n));
      gLabels.appendChild(g);
    });
  }

  function render(data) {
    const svg = root.querySelector('svg');
    const gProv = root.querySelector('[data-provinces]');
    const gLeaders = root.querySelector('[data-leaders]');
    const gDots = root.querySelector('[data-dots]');
    const gLabels = root.querySelector('[data-labels]');
    if (!svg || !gProv || !gLeaders || !gDots || !gLabels) return;

    mapData = data;
    setViewBox(svg, data);

    const frag = document.createDocumentFragment();
    covered = [];
    pathEls = {};

    data.f.forEach((f) => {
      const isCovered = !!f.c;
      const p = el('path', {
        d: f.d,
        class: 'province' + (isCovered ? ' covered' : ''),
      });
      if (isCovered) {
        p.setAttribute('data-name', f.n);
        pathEls[f.n] = p;
        covered.push(f);
        p.addEventListener('mouseenter', (e) => {
          if (!locked) setActive(f.n);
          showTip(e, f);
        });
        p.addEventListener('mousemove', moveTip);
        p.addEventListener('mouseleave', () => {
          hideTip();
          if (!locked) setActive(null);
          else setActive(locked);
        });
        p.addEventListener('click', () => selectProvince(f.n));
      }
      frag.appendChild(p);
    });
    gProv.appendChild(frag);

    covered.sort((a, b) => (a.cy || 0) - (b.cy || 0));

    const deptSet = new Set(covered.map((f) => f.dp));
    const statProv = root.querySelector('[data-stat-prov]');
    const statDep = root.querySelector('[data-stat-dep]');
    if (statProv) statProv.textContent = String(covered.length);
    if (statDep) statDep.textContent = String(deptSet.size);

    placeLeaders(data, gLeaders, gLabels);

    covered.forEach((f, i) => {
      gDots.appendChild(
        el('circle', {
          cx: String(f.cx),
          cy: String(f.cy),
          r: '3',
          class: 'centroid-dot',
          'data-name': f.n,
        })
      );

      if (!reduceMotion) {
        const elPath = pathEls[f.n];
        if (elPath) {
          elPath.style.opacity = '0';
          window.setTimeout(() => {
            elPath.style.transition = 'opacity .22s ease';
            elPath.style.opacity = '1';
          }, 40 + i * 40);
        }
        const dot = gDots.children[i];
        if (dot) {
          dot.style.opacity = '0';
          window.setTimeout(() => {
            dot.style.transition = 'opacity .18s ease';
            dot.style.opacity = '1';
          }, 70 + i * 40);
        }
      }
    });

    wireList();
    root.classList.add('is-ready');

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (mapData) setViewBox(svg, mapData);
      }, 120);
    });
  }

  function loadMap() {
    if (started) return;
    started = true;
    root.classList.add('is-loading');

    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error('map');
        return r.json();
      })
      .then(render)
      .catch(() => {
        root.classList.add('is-error');
      })
      .finally(() => {
        root.classList.remove('is-loading');
      });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          loadMap();
        }
      },
      { rootMargin: '120px 0px' }
    );
    io.observe(root);
  } else {
    loadMap();
  }
})();
