/** Eventos de conversión GA4 — formularios, llamadas, WhatsApp, calculadora, CTAs */
(function () {
  const GA4_MAP = {
    generate_lead: 'generate_lead',
    lead_valoracion: 'generate_lead',
    contact: 'contact',
    click_to_call: 'contact',
    whatsapp_click: 'contact',
    calculator_interaction: 'select_content',
    calculator_commission_change: 'select_content',
    sticky_cta_click: 'select_content',
    cta_click: 'select_content',
    form_start: 'form_start',
  };

  function baseParams() {
    return {
      page_location: location.href,
      page_path: location.pathname,
      page_title: document.title,
    };
  }

  function track(name, params) {
    const gaEvent = GA4_MAP[name] || name;
    const payload = { ...baseParams(), event_label: name, ...params };

    if (typeof window.gtag === 'function') {
      window.gtag('event', gaEvent, payload);
    }

    if (gaEvent === 'generate_lead' || gaEvent === 'contact') {
      window.gtag?.('event', 'conversion_event', {
        ...payload,
        conversion_type: name,
      });
    }
  }

  function initClickTracking() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;

      const href = a.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        track('click_to_call', {
          event_category: 'conversion',
          method: 'phone',
          link_url: href,
          call_placement: a.dataset.nhCall || a.dataset.nhCallPlacement || 'link',
        });
        return;
      }

      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        track('whatsapp_click', {
          event_category: 'conversion',
          method: 'whatsapp',
          link_url: href,
        });
        return;
      }

      if (a.matches('[data-nh-track-cta]') || (a.classList.contains('btn-gold') && href.includes('#valorar'))) {
        track('cta_click', {
          event_category: 'engagement',
          cta_text: (a.textContent || '').trim().slice(0, 80),
          link_url: href,
        });
      }
    }, true);
  }

  function initFormTracking() {
    document.querySelectorAll('form').forEach((form) => {
      if (form.dataset.nhFormTracked) return;
      form.dataset.nhFormTracked = '1';

      form.addEventListener('focusin', () => {
        if (form.dataset.nhFormStarted) return;
        form.dataset.nhFormStarted = '1';
        track('form_start', {
          event_category: 'engagement',
          form_id: form.id || 'unknown',
          form_name: form.getAttribute('name') || form.id || 'form',
        });
      }, { once: true });
    });
  }

  function patchSeoTrack() {
    if (!window.nhSeo || window.nhSeo.__analyticsPatched) return;
    const orig = window.nhSeo.track?.bind(window.nhSeo);
    if (!orig) return;
    window.nhSeo.__analyticsPatched = true;
    window.nhSeo.track = function (name, params) {
      orig(name, params);
      track(name, params);
    };
  }

  function init() {
    patchSeoTrack();
    initClickTracking();
    initFormTracking();
  }

  window.nhAnalytics = { track, init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('nh:analytics-ready', init);
})();
