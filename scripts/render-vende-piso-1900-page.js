/**
 * Landing SEO «vende tu piso por ~1.900 €» — mismo plan digital, otro ángulo (pasos + checklist).
 */
const { SITE, FEE_BASE } = require('./venta-digital-ciudades-data');
const { testimonialsSection } = require('./landing-testimonials');
const {
  esc,
  portalsPublicationBlock,
  faqSection,
  digitalStandardFaqs,
  compareThreePlansTable,
  includedExcludedBlock,
  firmacertBlock,
  gestoresStrip,
  serviceNavLinks,
} = require('./venta-planes-shared');
const { ventaDigitalExtraStyles, ventaDigitalPaymentBlock, ventaDigitalFullPanel } = require('./venta-digital-content-blocks');
const {
  ALL_ACTIONS,
  nhVp1900Styles,
  savingsStrip,
  illustratedJourneyBlock,
  allActionsBlock,
  citySwitcherBlock,
  composeVariantBody,
} = require('./vende-piso-1900-blocks');

function panelContext(c) {
  return {
    slug: c.slug,
    cityName: c.cityName,
    barrio: c.cityLabel || c.cityName,
    footerLabel: c.cityLabel || c.cityName,
    cluster: 'ventaDigital',
  };
}

function renderVendePiso1900Page(c, allLandings) {
  const canonical = `${SITE}/${c.slug}`;
  const title = c.pageTitle ? `${c.pageTitle} · NuevaHabitat` : `Vende tu piso por 1.900 euros · NuevaHabitat`;
  const description = c.metaDescription || '';
  const kw = c.keyword_principal || 'vende tu piso por 1900 euros';
  const aliasesMeta = (c.keyword_aliases || []).slice(0, 10).join(', ');
  const registroCiudad = c.registroCiudad != null ? c.registroCiudad : c.cityName;
  const registroCiudadQS =
    registroCiudad === '' ? '' : `&amp;ciudad=${encodeURIComponent(registroCiudad)}`;
  const cityPub = c.cityName === 'España' ? 'tu ciudad' : c.cityName;
  const faqBlock = faqSection(
    `vende piso 1900 euros ${cityPub}`,
    digitalStandardFaqs(cityPub === 'tu ciudad' ? 'España' : c.cityName),
    c.localFaq || ''
  );
  const waText = encodeURIComponent(c.waText || 'Hola, quiero información del plan digital ~1.900 € (1.999 + IVA)');
  const heroImg = c.heroImage || 'imagenes/interior11.jpg';
  const h1 =
    c.heroH1 ||
    'Vende tu piso por 1.900 euros: guía ilustrada del plan digital (1.999 € + IVA)';
  const landings = allLandings || [c];
  const heroRowClass = `nh-vp1900-hero nh-svc-hero-inner fade-up${c.heroClass ? ` ${c.heroClass}` : ''}`;
  const heroSavings = c.hideHeroSavings ? '' : savingsStrip(c);
  const ctaPrimary = esc(c.heroCtaPrimary || '#pasos-ilustrados');
  const ctaPrimaryLabel = esc(c.heroCtaPrimaryLabel || 'Ver pasos ilustrados');
  const variantBody = composeVariantBody(c);

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Venta 100 % digital · guía precio fijo ${c.cityLabel || c.cityName}`,
        provider: { '@id': `${SITE}/#organization` },
        areaServed: c.areaServed,
        offers: {
          '@type': 'Offer',
          price: FEE_BASE,
          priceCurrency: 'EUR',
          description: '1.999 € + IVA · 50 % al contratar y 50 % en escritura',
        },
      },
      {
        '@type': 'HowTo',
        name: `Cómo vender tu piso con NuevaHabitat por honorarios fijos`,
        description: description.slice(0, 240),
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Contratar plan digital y pago 50 %' },
          { '@type': 'HowToStep', position: 2, name: 'Documentación y valoración' },
          { '@type': 'HowToStep', position: 3, name: 'Anuncio y portales' },
          { '@type': 'HowToStep', position: 4, name: 'Visitas cualificadas' },
          { '@type': 'HowToStep', position: 5, name: 'Arras y escritura' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Venta digital', item: `${SITE}/venta-digital` },
          { '@type': 'ListItem', position: 3, name: c.breadcrumbLabel || c.cityName, item: canonical },
        ],
      },
      { '@type': 'WebPage', name: title, url: canonical, description },
    ],
  });

  const citySwitchSection = `<section class="lc-section" style="background:var(--blanco);padding:2rem 0 2.5rem">
  <div class="container text-center fade-up">
    <span class="overline">Línea SEO precio fijo</span>
    <h2 class="section-title" style="font-size:1.35rem">Misma operativa · otra URL por intención de búsqueda</h2>
    <p style="color:var(--gris-texto);max-width:640px;margin:.5rem auto 0;line-height:1.65;font-size:.9rem">Estas páginas complementan <a href="/${esc(c.ventaDigitalSlug || 'venta-digital')}">venta digital</a> con enfoque «~1.900 €» y checklist visual. Elige tu ámbito:</p>
    ${citySwitcherBlock(c.slug, landings)}
  </div>
</section>`;

  const proseBlock = c.seoExtra
    ? `<section class="lc-section" style="background:var(--blanco)"><div class="container lc-nh-prose fade-up" style="max-width:820px;margin:0 auto;color:var(--gris-texto);line-height:1.75;font-size:.95rem">${c.seoExtra}</div></section>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}"/>
  <meta name="keywords" content="${esc(kw)}, ${esc(aliasesMeta)}"/>
  <meta property="og:locale" content="es_ES"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:image" content="${SITE}/imagenes/interior11.jpg"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <style>${ventaDigitalExtraStyles()}${nhVp1900Styles()}</style>
  <script type="application/ld+json" id="nh-seo-static">${jsonLd}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">${esc(c.navSub || 'Precio fijo')}</span></div></a>
    ${serviceNavLinks('digital', `/${c.slug}`)}
    <div class="nav-actions"><a href="/registro?tipo=vender&amp;plan=digital${registroCiudadQS}" class="nav-cta">Contratar</a></div>
  </div>
</nav>

<section class="nh-svc-hero" style="min-height:auto;padding-bottom:0">
  <div class="nh-svc-hero-bg" style="background-image:url('${heroImg}')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container ${heroRowClass}">
    <div>
      <p class="nh-breadcrumb" aria-label="Ruta" style="font-size:.75rem;color:rgba(255,255,255,.55);margin:0 0 .75rem"><a href="/" style="color:inherit">Inicio</a> · <a href="/venta-digital" style="color:inherit">Venta digital</a> · <span>${esc(c.breadcrumbLabel || c.cityName)}</span></p>
      <div class="hero-badge">${esc(c.heroBadge || '')}</div>
      <h1>${h1}</h1>
      <div class="nh-svc-price-chip"><strong>1.999 € + IVA</strong> · <span>50&nbsp;% contrato + 50&nbsp;% escritura · mismo servicio digital</span></div>
      <p class="lc-nh-lead" style="margin-top:1rem">${c.marketLead || ''}</p>
      <div class="nh-svc-hero-actions" style="margin-top:1.25rem">
        <a href="${ctaPrimary}" class="btn btn-outline-light">${ctaPrimaryLabel}</a>
        <a href="#todas-las-acciones" class="btn btn-outline-light">Lista de ${ALL_ACTIONS.length} acciones</a>
        <a href="/registro?tipo=vender&amp;plan=digital${registroCiudadQS}" class="btn btn-gold">Contratar</a>
      </div>
      ${heroSavings}
    </div>
    <div class="nh-vp1900-hero-media" aria-hidden="true"><img src="${heroImg}" alt="" loading="eager" width="800" height="600"/></div>
  </div>
</section>

${citySwitchSection}
${variantBody}
${portalsPublicationBlock(cityPub)}

<section class="lc-section" style="background:var(--crema)">
  <div class="container fade-up" style="max-width:720px;margin:0 auto;text-align:center">
    <span class="overline">Panel en tiempo real</span>
    <h2 class="section-title">Todo el expediente, no solo el anuncio</h2>
    <p style="color:var(--gris-texto);line-height:1.7">Misma herramienta que en <a href="/${esc(c.ventaDigitalSlug || 'venta-digital')}">venta digital ${esc(c.cityLabel || c.cityName)}</a>: visitas, ofertas, documentación y pagos centralizados.</p>
  </div>
</section>
${ventaDigitalFullPanel(panelContext(c))}

${ventaDigitalPaymentBlock()}
${includedExcludedBlock('digital')}
${firmacertBlock()}
${proseBlock}
${testimonialsSection({ slug: c.slug, cluster: 'ventaDigital', footerLabel: c.cityLabel || c.cityName })}
${faqBlock}
${compareThreePlansTable('digital')}
${gestoresStrip()}

<section class="lc-section" style="background:var(--negro);color:#fff;text-align:center">
  <div class="container fade-up">
    <h2 class="section-title" style="color:#fff;margin-bottom:1rem">${esc(c.ctaSectionTitle || 'Activa el plan digital por honorarios fijos')}</h2>
    <p style="color:rgba(255,255,255,.7);max-width:520px;margin:0 auto 1.5rem;line-height:1.65">Mismo servicio que venta 100&nbsp;% digital. Esta URL refuerza SEO de búsqueda por precio (~1.900&nbsp;€).</p>
    <a href="/registro?tipo=vender&amp;plan=digital${registroCiudadQS}" class="btn btn-gold">Contratar · 1.999 € + IVA</a>
    ${c.ventaDigitalSlug ? `<p style="margin-top:1rem;font-size:.85rem"><a href="/${esc(c.ventaDigitalSlug)}" style="color:var(--oro-claro)">Ficha venta digital ${esc(c.cityLabel || c.cityName)}</a></p>` : ''}
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-top" style="grid-template-columns:1.5fr 2fr 1fr">
      <div class="footer-brand"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><p>${esc(c.footerBlurb || 'Guía vende tu piso por ~1.900 € · plan digital 1.999 € + IVA.')}</p></div>
      <div class="footer-col footer-col--servicios"><h4>Planes venta</h4><ul><li><a href="/venta-digital-barcelona">Digital · 1.999 € + IVA</a></li><li><a href="/vende-tu-piso-por-1900-euros-barcelona">Guía ~1.900 € BCN</a></li><li><a href="/vende-tu-piso-por-1900-euros-madrid">Guía ~1.900 € MAD</a></li><li><a href="/vende-tu-piso-por-1900-euros-valencia">Guía ~1.900 € VLC</a></li></ul></div>
      <div class="footer-col"><h4>Contacto</h4><ul><li><a href="tel:+34603656587">603 656 587</a></li><li><a href="mailto:info@nuevahabitat.com">info@nuevahabitat.com</a></li></ul></div>
    </div>
    <div class="footer-bottom"><p>© 2026 NuevaHabitat</p><div class="footer-bottom-links"><a href="/privacidad">Privacidad</a><a href="/aviso-legal">Aviso legal</a></div></div>
  </div>
</footer>
<div class="whatsapp-float"><div class="whatsapp-tooltip">¿Dudas del plan ~1.900 €?</div><a href="https://wa.me/34603656587?text=${waText}" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
<script src="js/leads.js"></script>
<script src="js/site-config.js"></script>
<script src="js/ga-config.js"></script>
<script src="js/gtag-init.js"></script>
<script src="js/analytics-events.js"></script>
<script src="js/seo.js"></script>
<script src="js/main.js"></script>
</body>
</html>`;
}

module.exports = { renderVendePiso1900Page };
