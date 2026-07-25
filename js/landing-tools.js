/** Calculadora 6% vs 3.000€ + CTAs de conversión en landings */
(function () {
  const NH_FEE = 3630;
  const STICKY_THRESHOLD = 400;

  function landingMeta() {
    const body = document.body;
    const slug = body.dataset.nhLandingSlug
      || location.pathname.replace(/^\//, '').replace(/\.html$/, '')
      || '';
    return {
      slug,
      cluster: body.dataset.nhCluster || '',
    };
  }

  function track(eventName, params) {
    window.nhSeo?.track(eventName, {
      landing_slug: landingMeta().slug,
      page_location: location.pathname,
      cluster: landingMeta().cluster,
      ...params,
    });
  }

  function formatEuro(n) {
    return Math.round(n).toLocaleString('es-ES') + ' €';
  }

  function bindCalculator(root) {
    const range = root.querySelector('#lc-precio, [data-lc-precio]');
    if (!range) return;

    const label = root.querySelector('#lc-precio-label');
    const trad = root.querySelector('#lc-trad');
    const save = root.querySelector('#lc-save');
    let tracked = false;

    function upd() {
      const p = Number(range.value) || Number(document.body.dataset.nhPrecioDefault) || 420000;
      const tradVal = Math.round(p * 0.06 * 1.21);
      const saveVal = Math.max(0, tradVal - NH_FEE);
      if (label) label.textContent = p.toLocaleString('es-ES') + ' €';
      if (trad) trad.textContent = formatEuro(tradVal);
      if (save) save.textContent = formatEuro(saveVal);
    }

    range.addEventListener('input', () => {
      upd();
      if (!tracked) {
        tracked = true;
        track('calculator_interaction', { precio: Number(range.value) });
      }
    });
    upd();
  }

  function initCalculator() {
    const roots = document.querySelectorAll('[data-lc-calc], .lc-calc');
    if (!roots.length && document.getElementById('lc-precio')) {
      bindCalculator(document);
      return;
    }
    roots.forEach(bindCalculator);
  }

  function initCallTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      if (link.dataset.nhCallBound) return;
      link.dataset.nhCallBound = '1';
      link.addEventListener('click', () => {
        track('click_to_call', {
          link_url: link.getAttribute('href') || '',
          call_placement: link.dataset.nhCall || (link.classList.contains('nav-tel') ? 'header' : 'banner'),
        });
      });
    });
  }

  function ensureStickyCta() {
    if (!document.body.dataset.nhCluster) return null;
    let el = document.getElementById('nh-sticky-cta');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'nh-sticky-cta';
    el.className = 'nh-sticky-cta';
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<a href="#valorar" class="nh-sticky-cta__btn btn btn-gold">Valoración gratis</a>';
    document.body.appendChild(el);

    el.querySelector('a')?.addEventListener('click', () => {
      track('sticky_cta_click', {});
    });
    return el;
  }

  function ensureStickyCall() {
    if (!document.body.dataset.nhCluster) return null;
    let el = document.getElementById('nh-sticky-call');
    if (el) return el;

    el = document.createElement('a');
    el.id = 'nh-sticky-call';
    el.className = 'nh-sticky-call';
    el.href = 'tel:+34603656587';
    el.setAttribute('aria-label', 'Llamar a NuevaHabitat');
    el.dataset.nhCall = 'sticky-mobile';
    el.innerHTML = '<span class="nh-sticky-call__icon" aria-hidden="true">📞</span><span>Llamar</span>';
    el.hidden = true;
    document.body.appendChild(el);

    el.addEventListener('click', () => {
      track('click_to_call', { call_placement: 'sticky-mobile' });
    });
    return el;
  }

  function initStickyBars() {
    const cta = ensureStickyCta();
    const call = ensureStickyCall();
    if (!cta && !call) return;

    const valorar = document.getElementById('valorar');
    let visible = false;

    function update() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const pastHero = scrollY > STICKY_THRESHOLD;
      let formVisible = false;
      if (valorar) {
        const rect = valorar.getBoundingClientRect();
        formVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      const show = pastHero && !formVisible;
      if (show === visible) return;
      visible = show;

      if (cta) {
        cta.classList.toggle('is-visible', show);
        cta.hidden = !show;
        cta.setAttribute('aria-hidden', show ? 'false' : 'true');
      }
      if (call) {
        call.classList.toggle('is-visible', show);
        call.hidden = !show;
        call.setAttribute('aria-hidden', show ? 'false' : 'true');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initWhatsappFloat() {
    document.querySelectorAll('.whatsapp-float a.whatsapp-btn').forEach((link) => {
      if (link.dataset.nhWaBound) return;
      link.dataset.nhWaBound = '1';
      link.addEventListener('click', () => {
        track('whatsapp_click', { link_url: link.href });
      });
    });
  }

  function init() {
    initCalculator();
    initCallTracking();
    initStickyBars();
    initWhatsappFloat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
