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

    var split = Math.ceil(barrioLinks.length / 2);
    var barrioA = barrioLinks.slice(0, split);
    var barrioB = barrioLinks.slice(split);

    var cols = [
      {
        label: hub.length > 1 ? 'General' : '',
        items: hub.concat(barrioA),
      },
      {
        label: barrioB.length ? 'Por barrio' : '',
        items: barrioB,
      },
      {
        label: guiaLinks.length ? 'Guías vendedor' : '',
        items: guiaLinks,
      },
    ].filter(function (col) {
      return col.items.length;
    });

    container.innerHTML =
      '<div class="nh-footer-links-grid">' +
      cols.map(function (col) {
        return (
          '<div class="nh-footer-links-col">' +
          (col.label ? '<span class="nh-footer-group-label">' + col.label + '</span>' : '') +
          linkList(col.items) +
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

      var zonas = (cfg.zonas || []).slice(0, 3).join(', ') || cfg.barrio;

      return (
        '<div style="background:var(--blanco);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-sm);border-left:4px solid var(--oro)">' +
        '<div style="font-size:.8125rem;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--gris-medio);margin-bottom:.35rem">' + cfg.barrio + '</div>' +
        '<p style="font-size:.9375rem;color:var(--negro);margin:0 0 1rem;line-height:1.5">' + zonas + '</p>' +
        '<a href="/' + slug + '" class="btn btn-gold" style="width:100%;justify-content:center">Vender en ' + cfg.barrio + ' →</a>' +
        '</div>'
      );
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

      var badge = cfg.badge || (cfg.cluster === 'comparativa' ? 'Comparativa' : cfg.cluster === 'intencion' ? 'Guía' : 'Situación');

      return (
        '<div style="background:var(--blanco);border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-sm);border-left:4px solid var(--oro)">' +
        '<div style="font-size:.8125rem;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:var(--gris-medio);margin-bottom:.35rem">' + badge + '</div>' +
        '<p style="font-size:.9375rem;color:var(--negro);margin:0 0 1rem;line-height:1.5">' + footerLabel(cfg) + '</p>' +
        '<a href="/' + slug + '" class="btn btn-gold" style="width:100%;justify-content:center">Ver guía →</a>' +
        '</div>'
      );
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
