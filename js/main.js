/* ============================================================
   NUEVAHABITAT — JavaScript Principal
   ============================================================ */

/* ── Toast (páginas sin supabase.js) ─────────────────────── */
(function () {
  if (window.nhToast) return;
  window.nhToast = function (msg, type = 'error', ms = 4500) {
    let root = document.getElementById('nh-toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'nh-toast-root';
      root.style.cssText = 'position:fixed;bottom:calc(70px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:.5rem;max-width:min(420px,92vw);pointer-events:none';
      document.body.appendChild(root);
    }
    const el = document.createElement('div');
    const bg = type === 'success' ? '#166534' : type === 'info' ? '#1e40af' : '#b91c1c';
    el.style.cssText = `background:${bg};color:#fff;padding:.85rem 1.1rem;border-radius:8px;font-size:.875rem;line-height:1.45;box-shadow:0 8px 24px rgba(0,0,0,.2);pointer-events:auto;animation:nhToastIn .25s ease`;
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, ms);
  };
  if (!document.getElementById('nh-toast-style')) {
    const s = document.createElement('style');
    s.id = 'nh-toast-style';
    s.textContent = '@keyframes nhToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
})();

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


/* ── FAQ acordeón ──────────────────────────────────────────── */
(function () {
  const FAQ_ICON = '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>';

  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      if (!btn.querySelector('svg')) btn.insertAdjacentHTML('beforeend', FAQ_ICON);
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    e.preventDefault();
    const item = btn.closest('.faq-item');
    if (!item) return;
    const list = item.closest('.faq-list');
    const wasOpen = item.classList.contains('open');
    list?.querySelectorAll('.faq-item.open').forEach(i => {
      if (i !== item) i.classList.remove('open');
    });
    item.classList.toggle('open', !wasOpen);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaq);
  } else {
    initFaq();
  }
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
      ? `/vender${q ? '?zona=' + encodeURIComponent(q) : ''}`
      : `/comprar${q ? '?zona=' + encodeURIComponent(q) : ''}`;
    window.location.href = url;
  };

  input && input.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.handleSearch();
  });
})();


/* ── Scroll Reveal (Intersection Observer) ─────────────────── */
(function () {
  let observer;
  let mobileFallbackTimer;

  function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function revealInViewport(root) {
    const scope = root || document;
    scope.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120 && rect.bottom > -80) {
        el.classList.add('visible');
      }
    });
  }

  function revealAllFadeUps() {
    document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
      el.classList.add('visible');
    });
  }

  function createObserver() {
    if (!('IntersectionObserver' in window)) return null;
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: isMobileViewport() ? '120px 0px 80px 0px' : '40px 0px 40px 0px',
    });
  }

  function observeAll(root) {
    revealInViewport(root);
    const els = (root || document).querySelectorAll('.fade-up:not(.visible)');
    if (!els.length) return;
    if (!observer) {
      observer = createObserver();
      if (!observer) {
        revealAllFadeUps();
        return;
      }
    }
    els.forEach((el) => observer.observe(el));

    if (isMobileViewport()) {
      clearTimeout(mobileFallbackTimer);
      mobileFallbackTimer = setTimeout(revealAllFadeUps, 1800);
    }
  }

  function boot() {
    observeAll();
    window.addEventListener('load', () => observeAll(), { once: true });
    window.addEventListener('pageshow', () => observeAll());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.nhObserveFadeUps = observeAll;
  window.nhRevealFadeUps = revealAllFadeUps;
})();


/* ── Propiedad favorita toggle (solo tarjetas estáticas sin Supabase) ── */
(function () {
  document.querySelectorAll('.prop-favorite:not([data-fav-id])').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
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
  const file = (path.split('/').pop() || '').replace(/\.html$/, '');

  const map = {
    '': 'inicio',
    'index': 'inicio',
    'inmuebles': 'inmuebles',
    'inmueble-detalle': 'inmuebles',
    'vender': 'vender',
    'comprar': 'comprar',
    'login': 'cuenta',
    'registro': 'cuenta',
    'confirmar-cuenta': 'cuenta',
    'panel': 'cuenta',
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


/* ── Cookie Banner ──────────────────────────────────────────── */
(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (!banner.querySelector('.cookie-banner-inner')) {
    const inner = document.createElement('div');
    inner.className = 'cookie-banner-inner';
    while (banner.firstChild) inner.appendChild(banner.firstChild);
    banner.appendChild(inner);
  }
  const inner = banner.querySelector('.cookie-banner-inner');
  if (!document.getElementById('cookie-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.id = 'cookie-close';
    closeBtn.className = 'cookie-btn-close';
    closeBtn.setAttribute('aria-label', 'Cerrar y usar solo cookies necesarias');
    closeBtn.innerHTML = '&times;';
    inner.insertBefore(closeBtn, inner.firstChild);
  }

  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Preferencias de cookies');
  banner.setAttribute('aria-live', 'polite');

  function dismissBanner(choice) {
    localStorage.setItem('nh_cookies', choice);
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cookie-banner-open');
    if (choice === 'all') window.nhLoadAnalytics && window.nhLoadAnalytics();
  }

  if (localStorage.getItem('nh_cookies')) {
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden', 'true');
    if (localStorage.getItem('nh_cookies') === 'all') {
      window.nhLoadAnalytics && window.nhLoadAnalytics();
    }
    return;
  }

  document.body.classList.add('cookie-banner-open');
  banner.setAttribute('aria-hidden', 'false');

  document.getElementById('cookie-accept')?.addEventListener('click', () => dismissBanner('all'));
  document.getElementById('cookie-reject')?.addEventListener('click', () => dismissBanner('necessary'));
  document.getElementById('cookie-close')?.addEventListener('click', () => dismissBanner('necessary'));
})();

/* ── Google Analytics (solo con consentimiento) ─────────────── */
window.nhLoadAnalytics = function () {
  if (window.__nhGaLoaded) return;
  const id = window.NH_GA_ID || 'G-XXXXXXXXXX';
  if (!id || id === 'G-XXXXXXXXXX') return;
  window.__nhGaLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true, send_page_view: true });
  document.dispatchEvent(new CustomEvent('nh:analytics-ready'));
};

window.nhCookiePrefs = function (mode) {
  localStorage.setItem('nh_cookies', mode === 'all' ? 'all' : 'necessary');
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cookie-banner-open');
  }
  if (mode === 'all') window.nhLoadAnalytics && window.nhLoadAnalytics();
  nhToast(mode === 'all'
    ? 'Preferencias guardadas: aceptadas todas las cookies.'
    : 'Preferencias guardadas: solo cookies necesarias.', 'success');
};


/* ── Mobile Search Bar en home ──────────────────────────────── */
(function () {
  const msb = document.querySelector('.msb-input');
  if (!msb) return;

  msb.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = msb.value.trim();
      if (val) window.location.href = `/inmuebles#q=${encodeURIComponent(val)}`;
    }
  });

  const btn = document.querySelector('.msb-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const val = msb.value.trim();
      window.location.href = `/inmuebles${val ? '?q=' + encodeURIComponent(val) : ''}`;
    });
  }
})();


/* ── Footer: mapa cuadrado + sellos de confianza ─────────────── */
(function () {
  const MAPS = 'https://www.google.com/maps/search/?api=1&query=Carrer+de+Mej%C3%ADa+Lequerica,+42,+08028+Barcelona';
  const MAP_EMBED = 'https://maps.google.com/maps?q=Carrer+de+Mej%C3%ADa+Lequerica,+42,+Les+Corts,+08028+Barcelona&t=m&z=17&ie=UTF8&iwloc=&output=embed';
  const SEAL_BASE = 'imagenes/sello confianza/';
  const SEALS = [
    { src: 'Sello-Confianza-Online.png', alt: 'Sello Confianza Online', cls: '' },
    { src: 'api.jpg', alt: 'Agente de la Propiedad Inmobiliaria — API', cls: '' },
    { src: 'RGPD.jpg', alt: 'Cumplimiento RGPD', cls: '' },
    { src: 'pyme_innovadora_meic-SP_web.png', alt: 'PYME Innovadora — Ministerio de Ciencia e Innovación', cls: 'footer-trust-wide' },
    { src: 'efqm500.png', alt: 'EFQM 500+ Excelencia', cls: 'footer-trust-tall' },
    { src: 'banner-consejo.jpg', alt: 'Consejo General de los Colegios de Agentes de la Propiedad Inmobiliaria de España', cls: 'footer-trust-wide' },
  ];

  function buildTrustPanel(includeMap) {
    const logos = SEALS.map(s =>
      `<img src="${SEAL_BASE + s.src}" alt="${s.alt}" class="${s.cls}" loading="lazy" decoding="async"/>`
    ).join('');

    const mapBlock = includeMap
      ? `<div class="footer-trust-map">
          <iframe src="${MAP_EMBED}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Mapa oficinas NuevaHabitat — Les Corts, Barcelona"></iframe>
        </div>`
      : '';

    return (
      '<div class="footer-trust-panel">' +
        '<div class="footer-trust-body">' +
          mapBlock +
          '<div class="footer-trust-content">' +
            '<p class="footer-trust-title">Oficinas y sellos de confianza</p>' +
            `<p class="footer-trust-addr">Carrer de Mejía Lequerica, 42, Les Corts, 08028 Barcelona` +
            `<a href="${MAPS}" target="_blank" rel="noopener"> · Google Maps</a></p>` +
            `<div class="footer-trust-logos">${logos}</div>` +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function initFooterExtras() {
    const footer = document.querySelector('footer .container');
    if (!footer) return;

    footer.querySelector('.footer-map-block')?.remove();

    const brand = footer.querySelector('.footer-brand');
    if (brand && !brand.querySelector('.footer-office') && !brand.textContent.includes('Mejía Lequerica')) {
      const office = document.createElement('p');
      office.className = 'footer-office';
      office.innerHTML =
        '<span class="footer-office-label">Oficinas</span>' +
        `<a href="${MAPS}" target="_blank" rel="noopener">Carrer de Mejía Lequerica, 42<br/>Les Corts, 08028 Barcelona</a>`;
      brand.appendChild(office);
    }

    footer.querySelectorAll('.footer-col').forEach(col => {
      const h4 = col.querySelector('h4');
      if (!h4 || !/contacto/i.test(h4.textContent)) return;
      if (col.querySelector('a[href*="Mej"]')) return;
      const ul = col.querySelector('ul');
      if (!ul) return;
      const li = document.createElement('li');
      li.innerHTML =
        `<a href="${MAPS}" target="_blank" rel="noopener" class="footer-addr">` +
        'Carrer de Mejía Lequerica, 42<br/>Les Corts, 08028 Barcelona</a>';
      ul.appendChild(li);
    });

    const includeMap = true;
    let trust = footer.querySelector('.footer-trust');

    if (trust?.querySelector('.footer-trust-panel')) {
      trust.innerHTML = buildTrustPanel(includeMap);
      return;
    }

    if (trust) trust.remove();

    trust = document.createElement('div');
    trust.className = 'footer-trust';
    trust.innerHTML = buildTrustPanel(includeMap);

    const bottom = footer.querySelector('.footer-bottom');
    if (bottom) footer.insertBefore(trust, bottom);
    else footer.appendChild(trust);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterExtras);
  } else {
    initFooterExtras();
  }
})();


/* ── PWA: instalar app en móvil (páginas públicas / clientes) ─ */
(function initPublicPwa() {
  const path = (location.pathname || '/').replace(/\.html$/, '');
  if (/^\/(panel|admin-panel)(\/|$)/.test(path)) return;
  if (document.querySelector('link[rel="manifest"][href*="admin"]')) return;
  if (document.querySelector('link[rel="manifest"][href*="panel"]')) return;

  function injectHeadTags() {
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest-web.json';
      document.head.appendChild(link);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      const theme = document.createElement('meta');
      theme.name = 'theme-color';
      theme.content = '#0d0d0d';
      document.head.appendChild(theme);
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const cap = document.createElement('meta');
      cap.name = 'apple-mobile-web-app-capable';
      cap.content = 'yes';
      document.head.appendChild(cap);
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
      const title = document.createElement('meta');
      title.name = 'apple-mobile-web-app-title';
      title.content = 'NuevaHabitat';
      document.head.appendChild(title);
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const icon = document.createElement('link');
      icon.rel = 'apple-touch-icon';
      icon.href = '/imagenes/Logo/logosinfondo2.png';
      document.head.appendChild(icon);
    }
  }

  function bootPwa() {
    if (!window.nhPwaInstall || window.__nhPublicPwaBooted) return;
    window.__nhPublicPwaBooted = true;
    window.nhPwaInstall.init({
      app: 'web',
      swUrl: '/sw-site.js',
      storageKey: 'nh_pwa_dismiss_web',
      title: 'Instala NuevaHabitat en tu móvil',
      hint: 'Accede a tu expediente, visitas y documentos como una app',
      mobileOnly: true,
      delayMs: 1200,
    });
  }

  function loadInstaller() {
    injectHeadTags();
    if (window.nhPwaInstall) {
      bootPwa();
      return;
    }
    const s = document.createElement('script');
    s.src = '/js/nh-pwa-install.js';
    s.onload = bootPwa;
    s.onerror = () => {};
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInstaller);
  } else {
    loadInstaller();
  }
})();
