const { SITE } = require('./patrimonial-zonas-data');
const {
  esc,
  patrimonialAssetGrid,
  patrimonialServicesNav,
  patrimonialFormBlock,
  patrimonialFormScript,
} = require('./patrimonial-content-blocks');

function relatedLinks(z) {
  return (z.relatedGuides || [])
    .map((g) => `<a href="${esc(g.href)}" class="btn btn-outline" style="margin:.25rem .35rem .25rem 0">${esc(g.label)}</a>`)
    .join('');
}

function renderPatrimonialZonaPage(z) {
  const canonical = `${SITE}/${z.slug}`;
  const title = `Nueva Hábitat Patrimonial · ${z.zoneName} · empresas y carteras`;
  const kw = z.keyword_principal || `patrimonial inmobiliario ${z.zoneName}`;
  const description = `${kw}: administración de cartera (viviendas, locales, naves) para patrimoniales y empresas en ${z.zoneName}. 59 €/mes · 599 € integral · venta precio fijo.`;
  const aliasesMeta = (z.keyword_aliases || []).slice(0, 8).join(', ');
  const microList = (z.microZones || []).map((m) => `<li>${esc(m)}</li>`).join('');
  const hubParent = z.zoneType === 'ciudad' ? 'Patrimonial España' : 'Patrimonial Barcelona';

  const faqBase = [
    {
      q: `¿Qué gestiona Patrimonial en ${z.zoneName}?`,
      a: 'Viviendas en alquiler, locales, oficinas y otros activos de cartera: inventario, administración mensual, ocupación de vacíos con alquiler integral y venta con honorarios fijos.',
    },
    {
      q: '¿Cuánto cuesta por inmueble?',
      a: 'Administración 59 €/mes IVA incl. por unidad con contrato vigente. Alquiler integral 599 € IVA incl. pago único por vacío. Venta con planes a precio fijo por activo.',
    },
    {
      q: '¿Hay responsable de cuenta?',
      a: 'Sí: un interlocutor comercial (Juan / equipo NH) para cartera, reporting y coordinación con tu asesoría.',
    },
  ];

  const faqExtra = z.localFaq || '';
  const faqHtml = faqBase
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`
    )
    .join('\n      ') + faqExtra;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Nueva Hábitat Patrimonial · ${z.zoneName}`,
        serviceType: 'Administración de fincas y gestión de carteras inmobiliarias',
        provider: { '@id': `${SITE}/#organization` },
        areaServed: z.areaServed,
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${SITE}/#organization`,
        name: 'NuevaHabitat',
        url: SITE,
        telephone: '+34603656587',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer de Mejía Lequerica, 42',
          addressLocality: 'Barcelona',
          postalCode: '08028',
          addressCountry: 'ES',
        },
        areaServed: z.areaServed,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Patrimonial', item: `${SITE}/patrimonial` },
          { '@type': 'ListItem', position: 3, name: z.zoneName, item: canonical },
        ],
      },
      {
        '@type': 'WebPage',
        name: title,
        url: canonical,
        description,
      },
    ],
  });

  const waText = encodeURIComponent(`Consulta Patrimonial NuevaHabitat · ${z.zoneName}`);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}"/>
  <meta name="keywords" content="${esc(kw)}, ${esc(aliasesMeta)}"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:image" content="${SITE}/${esc(z.heroImage || 'imagenes/inmobiliario5.jpg')}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${jsonLd}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">Patrimonial</span></div></a>
    <ul class="nav-links">
      <li><a href="/patrimonial" aria-current="page">Patrimonial</a></li>
      <li><a href="/administracion-alquileres">Administración</a></li>
      <li><a href="/alquiler-integral">Alquiler integral</a></li>
      <li><a href="/vender">Vender</a></li>
    </ul>
    <div class="nav-actions"><a href="#pat-contacto" class="nav-cta">Reunión cartera</a></div>
  </div>
</nav>

<section class="nh-svc-hero">
  <div class="nh-svc-hero-bg" style="background-image:url('${esc(z.heroImage || 'imagenes/inmobiliario5.jpg')}')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container nh-svc-hero-inner fade-up">
    <p class="nh-breadcrumb" aria-label="Ruta" style="font-size:.75rem;color:rgba(255,255,255,.55);margin:0 0 .75rem"><a href="/" style="color:inherit">Inicio</a> · <a href="/patrimonial" style="color:inherit">Patrimonial</a> · <span>${esc(z.zoneName)}</span></p>
    <span class="nh-pat-hero-badge">${esc(z.heroBadge)}</span>
    <h1>Administración de fincas para empresas y patrimoniales en ${esc(z.zoneName)}</h1>
  <p>${z.marketLead}</p>
    <div class="nh-svc-hero-actions">
      <a href="#pat-contacto" class="btn btn-gold">Solicitar reunión de cartera</a>
      <a href="/patrimonial" class="btn btn-outline-light">Hub Patrimonial</a>
      <a href="#contacto-juan" class="btn btn-outline-light">Hablar con Juan</a>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco);padding:2.5rem 0">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 1.5rem">
      <span class="overline">Activos en cartera</span>
      <h2 class="section-title">Viviendas, locales, oficinas y naves en ${esc(z.zoneName)}</h2>
      <p style="color:var(--gris-texto);line-height:1.7;margin:.75rem auto 0">${esc(z.zoneName)} · ${esc(hubParent)}. Un operador para captar inquilinos serios, administrar contratos y rotar activos sin dispersar gestores.</p>
    </div>
    ${patrimonialAssetGrid()}
    <div style="margin-top:1.5rem;text-align:center">${relatedLinks(z)}</div>
  </div>
</section>

<section class="lc-section" style="background:var(--negro);padding:2.5rem 0">
  <div class="container">
    <p class="text-center fade-up" style="color:rgba(255,255,255,.65);font-size:.875rem;margin:0 0 1rem;max-width:640px;margin-left:auto;margin-right:auto">Tarifas unitarias aplicables a cada activo de tu cartera en ${esc(z.zoneName)}:</p>
    ${patrimonialServicesNav()}
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-nh-split fade-up">
    <div class="nh-pat-prose">
      ${z.seoExtra || ''}
      ${microList ? `<h2>Micro-zonas</h2><ul class="lc-nh-checklist">${microList}</ul>` : ''}
    </div>
    <div>
      <span class="overline">Responsable</span>
      <h2 class="section-title">Juan · patrimoniales</h2>
      <p style="color:var(--gris-texto);line-height:1.75">Primera conversación: inventario de activos en <strong>${esc(z.zoneName)}</strong>, vacíos, administración en curso o disposal. Oficina Les Corts y operativa en campo.</p>
      <a href="tel:+34603656587" class="btn btn-gold" style="margin-top:1rem">603 656 587</a>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:1.25rem"><h2 class="section-title">FAQ · Patrimonial ${esc(z.zoneName)}</h2></div>
    <div class="nh-svc-faq fade-up" style="max-width:800px;margin:0 auto">
      ${faqHtml}
    </div>
  </div>
</section>

<section class="lc-section" id="contacto-juan" style="background:var(--crema);padding:2rem 0">
  <div class="container lc-nh-split fade-up" style="align-items:start">
    <div>
      <span class="overline">Cuéntanos tu cartera</span>
      <h2 class="section-title">Empresa o patrimonial en ${esc(z.zoneName)}</h2>
      <p style="color:var(--gris-texto);line-height:1.75">Indica tipos de activo (pisos, locales, naves), número aproximado y si necesitas administración, ocupar vacíos o vender parte de la cartera.</p>
    </div>
    ${patrimonialFormBlock(z)}
  </div>
</section>

<section class="lc-section" style="background:var(--negro);padding:2rem 0">
  <div class="container nh-svc-planes-nav nh-vd-city-grid" style="display:grid;gap:.75rem">
    ${require('./patrimonial-zonas-data').otherZonaLinks(z.slug)}
  </div>
  <p class="text-center" style="margin-top:1.25rem"><a href="/patrimonial" style="color:var(--oro-claro)">Ver hub Patrimonial →</a></p>
</section>

<footer>
  <div class="container">
    <div class="footer-bottom"><p>© 2026 NuevaHabitat · Patrimonial ${esc(z.zoneName)}</p></div>
  </div>
</footer>
<div class="whatsapp-float"><a href="https://wa.me/34603656587?text=${waText}" class="whatsapp-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a></div>
<script src="js/leads.js"></script>
<script src="js/notify.js"></script>
<script src="js/site-config.js"></script>
<script src="js/main.js"></script>
${patrimonialFormScript(z)}
</body>
</html>`;
}

module.exports = { renderPatrimonialZonaPage };
