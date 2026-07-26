/** UI compartida de landings SEO — footer e interlinking desde landings.js */
(function () {
  function footerLabel(cfg) {
    if (cfg.footerLabel) return cfg.footerLabel;
    if (cfg.barrio === 'Eixample') return 'Vender en el Eixample';
    if (cfg.barrio) return 'Vender en ' + cfg.barrio;
    return cfg.slug;
  }

  function landingOrder() {
    if (Array.isArray(window.NH_LANDING_ORDER) && window.NH_LANDING_ORDER.length) {
      return window.NH_LANDING_ORDER.filter(function (slug) {
        return window.NH_LANDINGS && window.NH_LANDINGS[slug];
      });
    }
    return window.NH_LANDING_SLUGS || Object.keys(window.NH_LANDINGS || {});
  }

  function linkItem(href, label) {
    return '<li><a href="' + href + '">' + label + '</a></li>';
  }

  function linkList(items) {
    if (!items.length) return '';
    return '<ul>' + items.join('') + '</ul>';
  }

  function cardImage(cfg) {
    if (cfg.cardImage) return cfg.cardImage;
    if (cfg.cluster === 'barrio') return 'imagenes/barcelona2.jpg';
    if (cfg.cluster === 'comparativa') return 'imagenes/inmobiliario1.jpg';
    if (cfg.cluster === 'situacion') return 'imagenes/interior2.jpg';
    return 'imagenes/interior11.jpg';
  }

  function landingCard(slug, cfg, opts) {
    opts = opts || {};
    var badge = cfg.badge || (cfg.cluster === 'comparativa' ? 'Comparativa' : cfg.cluster === 'intencion' ? 'Guía' : cfg.cluster === 'barrio' ? cfg.barrio : 'Situación');
    var title = footerLabel(cfg);
    var teaser = cfg.cardTeaser || (cfg.zonas || []).slice(0, 3).join(', ') || '';
    var img = cardImage(cfg);
    var alt = title + ' · NuevaHabitat Barcelona';
    var cta = opts.cta || 'Ver guía →';

    return (
      '<a href="/' + slug + '" class="nh-landing-card">' +
      '<div class="nh-landing-card-media"><img src="' + img + '" alt="' + alt + '" loading="lazy" decoding="async"/></div>' +
      '<div class="nh-landing-card-body">' +
      '<span class="nh-landing-card-badge">' + badge + '</span>' +
      '<h3 class="nh-landing-card-title">' + title + '</h3>' +
      (teaser ? '<p class="nh-landing-card-teaser">' + teaser + '</p>' : '') +
      '<span class="nh-landing-card-cta">' + cta + '</span>' +
      '</div></a>'
    );
  }

  function renderFooterLinks(container) {
    if (!container || !window.NH_LANDINGS) return;

    var extraLinks = {
      comprar: linkItem('comprar.html', 'Comprar'),
      hipotecas: linkItem('hipotecas.html', 'Hipotecas'),
      inmuebles: linkItem('inmuebles.html', 'Inmuebles'),
    };

    var hub = [linkItem('vender.html', 'Vender')];
    var extra = (container.getAttribute('data-nh-footer-extra') || '').split(',').map(function (s) {
      return s.trim();
    }).filter(Boolean);
    extra.forEach(function (key) {
      if (extraLinks[key]) hub.push(extraLinks[key]);
    });

    var clusters = window.NH_LANDING_CLUSTERS || {};
    var barrioSlugs = (clusters.barrio && clusters.barrio.slugs) || landingOrder().filter(function (slug) {
      return window.NH_LANDINGS[slug] && window.NH_LANDINGS[slug].cluster === 'barrio';
    });
    var guiaSlugs = []
      .concat((clusters.situacion && clusters.situacion.slugs) || [])
      .concat((clusters.intencion && clusters.intencion.slugs) || [])
      .concat((clusters.comparativa && clusters.comparativa.slugs) || []);

    if (!guiaSlugs.length) {
      landingOrder().forEach(function (slug) {
        var cfg = window.NH_LANDINGS[slug];
        if (cfg && (cfg.cluster === 'situacion' || cfg.cluster === 'intencion' || cfg.cluster === 'comparativa')) guiaSlugs.push(slug);
      });
    }

    var barrioLinks = barrioSlugs.map(function (slug) {
      var cfg = window.NH_LANDINGS[slug];
      if (!cfg) return '';
      return linkItem('/' + slug, footerLabel(cfg));
    }).filter(Boolean);

    var guiaLinks = guiaSlugs.map(function (slug) {
      var cfg = window.NH_LANDINGS[slug];
      if (!cfg) return '';
      return linkItem('/' + slug, footerLabel(cfg));
    }).filter(Boolean);

    // Un único flujo continuo (sin partir "a mano" en columnas): el CSS
    // multi-columna reparte automáticamente el alto entre las 3 columnas,
    // así el footer queda siempre equilibrado sin importar cuántas landings
    // por barrio o guías se añadan en el futuro.
    var groups = [
      { label: hub.length > 1 ? 'General' : '', items: hub },
      { label: 'Por barrio', items: barrioLinks },
      { label: 'Guías vendedor', items: guiaLinks },
    ].filter(function (g) {
      return g.items.length;
    });

    container.innerHTML =
      '<div class="nh-footer-links-grid">' +
      groups.map(function (g) {
        return (
          '<div class="nh-footer-group">' +
          (g.label ? '<span class="nh-footer-group-label">' + g.label + '</span>' : '') +
          linkList(g.items) +
          '</div>'
        );
      }).join('') +
      '</div>';

    var colWrap = container.closest('.footer-col');
    if (colWrap) colWrap.classList.add('footer-col--servicios');
  }

  function renderZonaLocal(container) {
    if (!container || !window.NH_LANDINGS) return;

    var barrioSlugs = (window.NH_LANDING_CLUSTERS && window.NH_LANDING_CLUSTERS.barrio && window.NH_LANDING_CLUSTERS.barrio.slugs) || landingOrder().filter(function (s) {
      return window.NH_LANDINGS[s] && window.NH_LANDINGS[s].cluster === 'barrio';
    });

    var cards = barrioSlugs.map(function (slug) {
      var cfg = window.NH_LANDINGS[slug];
      if (!cfg) return '';
      return landingCard(slug, cfg, { cta: 'Vender en ' + cfg.barrio + ' →' });
    }).join('');

    container.innerHTML = cards;
  }

  function renderGuiasVendedor(container) {
    if (!container || !window.NH_LANDINGS) return;

    var clusters = window.NH_LANDING_CLUSTERS || {};
    var guiaSlugs = []
      .concat((clusters.comparativa && clusters.comparativa.slugs) || [])
      .concat((clusters.intencion && clusters.intencion.slugs) || [])
      .concat((clusters.situacion && clusters.situacion.slugs) || []);

    if (!guiaSlugs.length) {
      landingOrder().forEach(function (slug) {
        var cfg = window.NH_LANDINGS[slug];
        if (cfg && (cfg.cluster === 'situacion' || cfg.cluster === 'intencion' || cfg.cluster === 'comparativa')) guiaSlugs.push(slug);
      });
    }

    var cards = guiaSlugs.map(function (slug) {
      var cfg = window.NH_LANDINGS[slug];
      if (!cfg) return '';
      return landingCard(slug, cfg);
    }).join('');

    container.innerHTML = cards;
  }

  function applyTestimonialsVisibility() {
    var page = (location.pathname.replace(/^\//, '').replace(/\.html$/, '') || '').toLowerCase();
    var cfg = window.NH_LANDINGS && window.NH_LANDINGS[page];
    if (!cfg || cfg.testimonials !== false) return;
    document.querySelectorAll('[data-nh-testimonials]').forEach(function (el) {
      el.remove();
    });
  }

  function init() {
    document.querySelectorAll('[data-nh-landing-footer]').forEach(renderFooterLinks);
    document.querySelectorAll('[data-nh-zona-local]').forEach(renderZonaLocal);
    document.querySelectorAll('[data-nh-guias-vendedor]').forEach(renderGuiasVendedor);
    applyTestimonialsVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
