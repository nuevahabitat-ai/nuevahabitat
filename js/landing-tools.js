/** CTAs de conversión en landings — llamadas, WhatsApp, sticky bars */
(function () {
  const STICKY_THRESHOLD = 400;

  function landingMeta() {
    const body = document.body;
    const slug = body.dataset.nhLandingSlug
      || location.pathname.replace(/^\//, '').replace(/\.html$/, '')
      || '';
    return { slug, cluster: body.dataset.nhCluster || '' };
  }

  function track(eventName, params) {
    window.nhSeo?.track(eventName, {
      landing_slug: landingMeta().slug,
      page_location: location.pathname,
      cluster: landingMeta().cluster,
      ...params,
    });
  }

  function initCallTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      if (link.dataset.nhCallBound) return;
      link.dataset.nhCallBound = '1';
      link.addEventListener('click', () => {
        track('click_to_call', {
          event_category: 'conversion',
          method: 'phone',
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
    el.innerHTML = '<a href="#valorar" class="nh-sticky-cta__btn btn btn-gold" data-nh-track-cta>Valoración gratis</a>';
    document.body.appendChild(el);

    el.querySelector('a')?.addEventListener('click', () => {
      track('sticky_cta_click', { event_category: 'engagement' });
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
    el.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><span>Llamar</span>';
    el.hidden = true;
    document.body.appendChild(el);

    el.addEventListener('click', () => {
      track('click_to_call', { event_category: 'conversion', method: 'phone', call_placement: 'sticky-mobile' });
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
        track('whatsapp_click', { event_category: 'conversion', method: 'whatsapp', link_url: link.href });
      });
    });
  }

  function init() {
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
