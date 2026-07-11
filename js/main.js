/* ============================================================
   NUEVAHABITAT — JavaScript Principal
   ============================================================ */

/* ── Navbar: transparente → sólido al hacer scroll ────────── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Menú móvil ────────────────────────────────────────────── */
(function () {
  const menuBtn   = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const mobileNav = document.getElementById('mobileNav');
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => mobileNav.classList.add('open'));
  menuClose && menuClose.addEventListener('click', () => mobileNav.classList.remove('open'));

  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
})();


/* ── Hero Slider ───────────────────────────────────────────── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]  && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]  && dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function start() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.idx));
      start();
    });
  });

  start();
})();


/* ── Toggle Vender / Comprar en el buscador ────────────────── */
(function () {
  const btnVender  = document.getElementById('toggleVender');
  const btnComprar = document.getElementById('toggleComprar');
  const input      = document.getElementById('searchInput');
  if (!btnVender) return;

  let mode = 'vender';

  btnVender.addEventListener('click', () => {
    mode = 'vender';
    btnVender.classList.add('active');
    btnComprar.classList.remove('active');
    input && (input.placeholder = '¿Dónde está tu vivienda? Barrio, municipio...');
  });

  btnComprar.addEventListener('click', () => {
    mode = 'comprar';
    btnComprar.classList.add('active');
    btnVender.classList.remove('active');
    input && (input.placeholder = '¿Dónde buscas tu nuevo hogar? Barrio, municipio...');
  });

  window.handleSearch = function () {
    const q = input ? input.value.trim() : '';
    const url = mode === 'vender'
      ? `vender.html${q ? '?zona=' + encodeURIComponent(q) : ''}`
      : `comprar.html${q ? '?zona=' + encodeURIComponent(q) : ''}`;
    window.location.href = url;
  };

  input && input.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.handleSearch();
  });
})();


/* ── Scroll Reveal (Intersection Observer) ─────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ── Propiedad favorita toggle ─────────────────────────────── */
(function () {
  document.querySelectorAll('.prop-favorite').forEach(btn => {
    btn.addEventListener('click', function () {
      const isActive = this.classList.toggle('active');
      this.style.color = isActive ? '#e84545' : '';
      const svg = this.querySelector('svg');
      if (svg) svg.style.fill = isActive ? '#e84545' : 'none';
    });
  });
})();


/* ── Smooth scroll para anclas internas ────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ── Contador animado en estadísticas del hero ─────────────── */
(function () {
  function animateCount(el, target, suffix, duration) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = (suffix === '%' ? value : '+' + value) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsEl = document.querySelectorAll('.hero-stat-num');
  const data = [
    { target: 250, suffix: '' },
    { target: 97,  suffix: '%' },
    { target: 58,  suffix: ' días' },
  ];

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statsEl.forEach((el, i) => {
        if (data[i]) animateCount(el, data[i].target, data[i].suffix, 1500);
      });
    }
  }, { threshold: 0.5 });

  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);
})();


/* ── Propiedades: mini slider (prev/next) ──────────────────── */
(function () {
  const grid  = document.getElementById('propGrid');
  const prev  = document.getElementById('propPrev');
  const next  = document.getElementById('propNext');
  if (!grid || !prev || !next) return;

  const cards = Array.from(grid.querySelectorAll('.prop-card'));
  let visible = getVisible();
  let page = 0;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function render() {
    visible = getVisible();
    const maxPage = Math.max(0, cards.length - visible);
    page = Math.min(page, maxPage);

    cards.forEach((card, i) => {
      const inView = i >= page && i < page + visible;
      card.style.display = inView ? '' : 'none';
    });

    prev.style.opacity = page === 0 ? '.35' : '1';
    prev.style.pointerEvents = page === 0 ? 'none' : '';
    next.style.opacity = page >= cards.length - visible ? '.35' : '1';
    next.style.pointerEvents = page >= cards.length - visible ? 'none' : '';
  }

  prev.addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
  next.addEventListener('click', () => { page = Math.min(cards.length - visible, page + 1); render(); });
  window.addEventListener('resize', render);

  render();
})();


/* ── Parallax sutil en el hero ─────────────────────────────── */
(function () {
  const hero = document.getElementById('hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const slides = hero.querySelectorAll('.hero-slide');
    slides.forEach(s => {
      s.style.transform = `scale(1.04) translateY(${y * 0.2}px)`;
    });
  }, { passive: true });
})();


/* ── Mobile Bottom Nav: auto-detectar tab activo ─────────── */
(function () {
  const tabs = document.querySelectorAll('.mbn-tab');
  if (!tabs.length) return;

  const path = window.location.pathname.toLowerCase();
  const file = path.split('/').pop() || 'index.html';

  const map = {
    'index.html': 'inicio',
    '':           'inicio',
    'inmuebles.html': 'inmuebles',
    'vender.html': 'vender',
    'comprar.html': 'comprar',
    'login.html': 'cuenta',
    'registro.html': 'cuenta',
  };

  // inmueble detail pages → inmuebles tab
  let active = map[file] || '';
  if (!active && file.startsWith('inmueble-')) active = 'inmuebles';

  tabs.forEach(tab => {
    if (tab.dataset.tab === active) tab.classList.add('active');
  });

  /* Feedback táctil en tap */
  tabs.forEach(tab => {
    tab.addEventListener('pointerdown', () => {
      tab.style.opacity = '.65';
    });
    tab.addEventListener('pointerup', () => {
      tab.style.opacity = '';
    });
    tab.addEventListener('pointerleave', () => {
      tab.style.opacity = '';
    });
  });
})();


/* ── Mobile Search Bar en home ──────────────────────────────── */
(function () {
  const msb = document.querySelector('.msb-input');
  if (!msb) return;

  msb.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = msb.value.trim();
      if (val) window.location.href = `inmuebles.html?q=${encodeURIComponent(val)}`;
    }
  });

  const btn = document.querySelector('.msb-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const val = msb.value.trim();
      window.location.href = `inmuebles.html${val ? '?q=' + encodeURIComponent(val) : ''}`;
    });
  }
})();
