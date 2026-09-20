/**
 * Landing hub «venta económica» — layout estático, sin sticky ni fade-up.
 */
function economicaHubStyles() {
  return `
    body.lc-econ-hub .fade-up{opacity:1!important;transform:none!important;transition:none!important}
    body.lc-econ-hub .lc-prose--cols{columns:1!important;max-width:820px;margin:0 auto}
    body.lc-econ-hub .lc-article-aside{display:none!important}
    .lc-hero--hub{min-height:72vh}
    .lc-hero--hub .lc-hero-media img{object-position:center 42%}
    .lc-econ-stats{padding:0 0 3rem;background:var(--blanco);margin-top:-3rem;position:relative;z-index:2}
    .lc-econ-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;max-width:960px;margin:0 auto}
    .lc-econ-stat{background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.5rem 1.25rem;text-align:center;box-shadow:var(--shadow-md)}
    .lc-econ-stat-label{font-size:.6875rem;text-transform:uppercase;letter-spacing:.1em;color:var(--gris-medio);margin-bottom:.5rem}
    .lc-econ-stat-val{font-family:var(--font-serif);font-size:1.75rem;font-weight:700;color:var(--negro);line-height:1.15}
    .lc-econ-stat-val--gold{color:var(--oro-oscuro)}
    .lc-econ-stat-note{font-size:.8125rem;color:var(--gris-texto);margin-top:.45rem;line-height:1.45}
    .lc-econ-intro{max-width:720px;margin:0 auto 2.5rem;text-align:center}
    .lc-econ-intro .section-title{margin-bottom:.75rem}
    .lc-econ-form-wrap{max-width:520px;margin:0 auto}
    .lc-econ-form-section{background:linear-gradient(180deg,var(--crema) 0%,#fff 100%)}
    .lc-econ-form-section .lc-form{position:static!important;box-shadow:var(--shadow-lg)}
    @media(max-width:768px){
      .lc-econ-stats{margin-top:-2rem;padding-bottom:2rem}
      .lc-econ-stats-grid{grid-template-columns:1fr;gap:.75rem;padding:0 1rem}
      .lc-hero--hub{min-height:68vh}
    }
  `;
}

function heroStatsBlock(L) {
  const stats = L.heroStats || [];
  if (!stats.length) return '';
  const cards = stats.map((s) =>
    `<div class="lc-econ-stat">
      <div class="lc-econ-stat-label">${s.label}</div>
      <div class="lc-econ-stat-val${s.highlight ? ' lc-econ-stat-val--gold' : ''}">${s.value}</div>
      <div class="lc-econ-stat-note">${s.note}</div>
    </div>`
  ).join('');
  return `<section class="lc-econ-stats" aria-label="Comparativa de honorarios">
  <div class="container"><div class="lc-econ-stats-grid">${cards}</div></div>
</section>`;
}

function renderEconomicaHub(L, ctx, deps) {
  const {
    SITE, sharedStyles, faqHtml, formBlock, footerAndScripts, relatedBlock,
    buildJsonLd, calcBlock, navBar, callBanner, checklistBlock, nhPlatformBundle,
  } = deps;

  const rows = L.comparativa_modelos.rows.map((r) =>
    `<tr><td><strong>${r.modelo}</strong></td><td>${r.tiempo}</td><td>${r.coste}</td><td class="${r.tipo === 'win' ? 'win' : r.tipo === 'lose' ? 'lose' : ''}">${r.riesgo}</td></tr>`
  ).join('');

  const mitos = L.mitos.items.map((m) =>
    `<div class="lc-mito"><strong>Mito: ${m.mito}</strong><span>Realidad: ${m.realidad}</span></div>`
  ).join('');

  const calc = L.calculadora?.precioDefault || 350000;
  const pos = L.hero.objectPosition || 'center 42%';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${SITE}/${L.slug}"/>
  <meta property="og:title" content="${L.meta.title}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${L.hero.image}"/>
  <meta property="og:locale" content="es_ES"/>
  <meta property="og:site_name" content="NuevaHabitat"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
  <style>${economicaHubStyles()}</style>
</head>
<body class="lc-econ-hub" data-nh-cluster="${L.cluster}" data-nh-landing-slug="${L.slug}" data-nh-precio-default="${calc}" data-nh-no-sticky="1">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/vender">Vender</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.footerLabel}</span></nav></div>
<section class="lc-hero lc-hero--hub">
  <div class="lc-hero-media"><img src="${L.hero.image}" alt="${L.hero.imageAlt}" style="object-position:${pos}" fetchpriority="high" decoding="async"/></div>
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content">
    <span class="lc-badge">${L.hero.badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem">
      <a href="#calc" class="btn btn-gold btn-lg">Comparativa real de honorarios</a>
      <a href="#valorar" class="btn btn-outline-light btn-lg">Valoración gratuita</a>
    </div>
  </div></div>
</section>
${heroStatsBlock(L)}
${callBanner()}
<div class="container" style="padding-top:2rem">
  <div class="lc-econ-intro">
    <span class="overline">Comparativa real de honorarios</span>
    <h2 class="section-title">${L.calculadora.titulo}</h2>
    <p style="color:var(--gris-texto);line-height:1.7">${L.calculadora.subtitulo}</p>
  </div>
</div>
${calcBlock(L)}
${nhPlatformBundle(L)}
<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="lc-econ-intro">
      <span class="overline">Venta económica en Barcelona</span>
      <h2 class="section-title">Cómo funciona NuevaHabitat si quieres vender sin pagar un 6%</h2>
    </div>
    <div class="lc-prose">${L.argumento_principal}</div>
  </div>
</section>
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem">
      <span class="overline">Modelos de venta</span>
      <h2 class="section-title">${L.comparativa_modelos.title}</h2>
    </div>
    <div style="overflow-x:auto"><table class="lc-compare"><thead><tr><th>Modelo</th><th>Tiempo típico</th><th>Coste</th><th>Riesgo</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:760px">
    <h2 class="section-title" style="margin-bottom:1.5rem;text-align:center">${L.mitos.title}</h2>
    ${mitos}
    ${checklistBlock(L.checklist?.title, L.checklist?.items, L.checklist?.intro)}
  </div>
</section>
<section class="lc-section lc-econ-form-section" id="valorar">
  <div class="container">
    <div class="lc-econ-intro">
      <span class="overline">Sin compromiso</span>
      <h2 class="section-title">Pide valoración y plan de venta económica</h2>
      <p style="color:var(--gris-texto);line-height:1.7">${L.form_side_text}</p>
    </div>
    <div class="lc-econ-form-wrap">${formBlock(L).replace(' fade-up', '')}</div>
  </div>
</section>
${relatedBlock(L, ctx)}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:800px">
    <div class="faq-list">${faqHtml(L.faq)}</div>
    <div class="lc-kw">${L.keywords_footer}</div>
  </div>
</section>
${footerAndScripts(L)}
</body></html>`;
}

module.exports = { renderEconomicaHub, economicaHubStyles };
