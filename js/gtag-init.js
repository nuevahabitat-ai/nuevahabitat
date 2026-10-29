/** Google tag + Consent Mode v2 — cargar en todas las páginas tras ga-config.js */
(function () {
  const CONSENT_DENIED = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  if (typeof window.gtag !== 'function') window.gtag = gtag;

  gtag('consent', 'default', CONSENT_DENIED);

  function tagIds() {
    const gaId = window.NH_GA_ID || 'G-XXXXXXXXXX';
    const adsId = (window.NH_GADS_ID || '').trim();
    const hasGa = gaId && gaId !== 'G-XXXXXXXXXX';
    const hasAds = !!adsId;
    const loaderId = hasGa ? gaId : hasAds ? adsId : '';
    return { gaId, adsId, hasGa, hasAds, loaderId };
  }

  window.__nhGtagInit = function () {
    if (window.__nhGtagScriptRequested) return;
    const { loaderId, hasGa, hasAds, gaId, adsId } = tagIds();
    if (!loaderId) return;
    window.__nhGtagScriptRequested = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(loaderId);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (hasAds) gtag('config', adsId);
    if (hasGa) gtag('config', gaId, { anonymize_ip: true, send_page_view: true });
  };

  window.nhGrantAnalyticsConsent = function () {
    window.__nhGtagInit();
    if (window.__nhAnalyticsConsentGranted) {
      document.dispatchEvent(new CustomEvent('nh:analytics-ready'));
      return;
    }
    window.__nhAnalyticsConsentGranted = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    document.dispatchEvent(new CustomEvent('nh:analytics-ready'));
  };

  window.nhLoadAnalytics = window.nhGrantAnalyticsConsent;

  function fireAdsConversion(sendTo, dedupeKey) {
    if (!sendTo || !window.__nhAnalyticsConsentGranted) return false;
    if (sessionStorage.getItem(dedupeKey)) return true;
    if (typeof window.gtag !== 'function') return false;
    window.gtag('event', 'conversion', {
      send_to: sendTo,
      value: 1.0,
      currency: 'EUR',
    });
    sessionStorage.setItem(dedupeKey, '1');
    return true;
  }

  window.nhTrackGoogleAdsLeadConversion = function (opts) {
    const sendTo = window.NH_GADS_LEAD_SEND_TO;
    if (!sendTo) return false;
    const leadId = opts?.leadId != null ? String(opts.leadId) : '';
    const dedupeKey = 'nh_gads_lead_' + (leadId || opts?.onceKey || '1');
    if (sessionStorage.getItem(dedupeKey)) return true;

    function attempt() {
      if (!fireAdsConversion(sendTo, dedupeKey)) return false;
      if (leadId && sessionStorage.getItem('nh_gads_lead_pending') === leadId) {
        sessionStorage.removeItem('nh_gads_lead_pending');
      }
      return true;
    }

    if (attempt()) return true;
    document.addEventListener('nh:analytics-ready', () => attempt(), { once: true });
    return false;
  };

  window.nhTrackGoogleAdsWhatsAppConversion = function (opts) {
    const sendTo = (window.NH_GADS_WHATSAPP_SEND_TO || '').trim();
    if (!sendTo) return false;
    const onceKey = opts?.onceKey || 'wa_' + Date.now();
    const dedupeKey = 'nh_gads_wa_' + onceKey;
    if (sessionStorage.getItem(dedupeKey)) return true;

    function attempt() {
      return fireAdsConversion(sendTo, dedupeKey);
    }

    if (attempt()) return true;
    document.addEventListener('nh:analytics-ready', () => attempt(), { once: true });
    return false;
  };

  window.__nhGtagInit();

  try {
    if (localStorage.getItem('nh_cookies') === 'all') {
      window.nhGrantAnalyticsConsent();
    }
  } catch (_) { /* private mode */ }
})();
