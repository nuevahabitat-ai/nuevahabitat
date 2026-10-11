/**
 * Landings alquiler (integral / administración) — layout distinto al silo venta (lc-econ-hub).
 */
const { economicaHubStyles } = require('./render-economica-hub');

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
  return `<section class="lc-econ-stats" aria-label="Servicio de alquiler">
  <div class="container"><div class="lc-econ-stats-grid">${cards}</div></div>
</section>`;
}

function stepsBlock(L) {
  const ca = L.como_ayudamos;
  if (!ca || !ca.steps?.length) return '';
  const steps = ca.steps.map((s, i) =>
    `<div class="lc-step fade-up${i ? ` fade-up-delay-${Math.min(i, 3)}` : ''}">
      <div class="lc-step-num">${i + 1}</div>
      <h4 style="margin:.4rem 0">${s.title}</h4>
      <p style="font-size:.875rem;color:var(--gris-texto)">${s.body}</p>
    </div>`
  ).join('');
  return `<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem">
      <span class="overline">Cómo trabajamos</span>
      <h2 class="section-title">${ca.title}</h2>
      <p style="color:var(--gris-texto);max-width:640px;margin:.75rem auto 0;line-height:1.7">${ca.description || ''}</p>
    </div>
    <div class="lc-steps">${steps}</div>
  </div>
</section>`;
}

function renderAlquiler(L, ctx, deps) {
  const {
    SITE, sharedStyles, faqHtml, formBlock, footerAndScripts, relatedBlock,
    buildJsonLd, navBar, callBanner, checklistBlock, argumentoProseMarkup, gestoresContactBanner, testimonialsSection,
  } = deps;

  const rows = L.comparativa_modelos.rows.map((r) =>
    `<tr><td><strong>${r.modelo}</strong></td><td>${r.tiempo}</td><td>${r.coste}</td><td class="${r.tipo === 'win' ? 'win' : r.tipo === 'lose' ? 'lose' : ''}">${r.riesgo}</td></tr>`
  ).join('');

  const mitos = L.mitos.items.map((m) =>
    `<div class="lc-mito"><strong>Mito: ${m.mito}</strong><span>Realidad: ${m.realidad}</span></div>`
  ).join('');

  const heroImg = L.hero.image;
  const heroAlt = L.hero.imageAlt;
  const hubHref = L.servicio === 'administracion'
    ? '/administracion-alquiler-barcelona'
    : '/alquiler-integral-barcelona';
  const hubLabel = L.servicio === 'administracion' ? 'Administración de alquiler' : 'Alquiler integral';
  const proseIntro = L.servicio === 'administracion'
    ? `<span class="overline">Administración de alquiler en Barcelona</span><h2>Gestión mensual con gestor en Les Corts</h2>`
    : `<span class="overline">Alquiler integral en Barcelona</span><h2>Del anuncio al contrato LAU sin improvisar</h2>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${L.meta.title}</title>
  <meta name="description" content="${L.meta.description}"/>
  <meta name="keywords" content="${L.meta.keywords}"/>
  <meta name="robots" content="${L.indexable !== false ? 'index, follow, max-snippet:-1, max-image-preview:large' : 'noindex, follow'}"/>
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
  <style>${economicaHubStyles()}
    body.lc-alquiler-hub .lc-econ-hero__panel{background:linear-gradient(135deg,#1a3d32 0%,#0d0d0d 55%)}
    body.lc-alquiler-hub .lc-badge{background:rgba(201,169,110,.22);color:var(--oro-claro)}
  </style>
</head>
<body class="lc-econ-hub lc-alquiler-hub" data-nh-cluster="${L.cluster}" data-nh-landing-slug="${L.slug}" data-nh-no-sticky="1">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="${hubHref}">${hubLabel}</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.footerLabel}</span></nav></div>
<header class="lc-econ-hero">
  <figure class="lc-econ-hero__figure">
    <img src="${heroImg}" alt="${heroAlt}" width="5791" height="3866" fetchpriority="high" decoding="sync"/>
  </figure>
  <div class="lc-econ-hero__panel">
    <div class="container">
      <div class="lc-econ-hero__content">
        <span class="lc-badge">${L.hero.badge}</span>
        <h1>${L.hero.h1}</h1>
        <p>${L.hero.lead}</p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.5rem">
          <a href="#valorar" class="btn btn-gold btn-lg">Consultar mi caso</a>
          <a href="${hubHref}" class="btn btn-outline-light btn-lg">Guía ${hubLabel.toLowerCase()}</a>
        </div>
      </div>
    </div>
  </div>
</header>
${heroStatsBlock(L)}
${callBanner()}
<div class="container" style="padding-top:2rem">
  <div class="lc-econ-intro">
    <span class="overline">${L.calculadora.titulo}</span>
    <h2 class="section-title">${L.barrioNombre || L.footerLabel}</h2>
    <p style="color:var(--gris-texto);line-height:1.7">${L.calculadora.subtitulo}</p>
  </div>
</div>
${argumentoProseMarkup(L, proseIntro + L.argumento_principal)}
${gestoresContactBanner(L, 'postArticle')}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem">
      <span class="overline">Comparativa</span>
      <h2 class="section-title">${L.comparativa_modelos.title}</h2>
    </div>
    <div style="overflow-x:auto"><table class="lc-compare"><thead><tr><th>Modelo</th><th>Tiempo / ritmo</th><th>Coste</th><th>Riesgo</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>
</section>
${stepsBlock(L)}
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
      <span class="overline">Propietario en ${L.barrioNombre || 'Barcelona'}</span>
      <h2 class="section-title">Cuéntanos tu piso y te llamamos en 24 h</h2>
      <p style="color:var(--gris-texto);line-height:1.7">${L.form_side_text || 'Daniel o Sebastián, desde Les Corts, revisan renta orientativa, LAU e INCASÒL antes de proponerte un plan.'}</p>
    </div>
    <div class="lc-econ-form-wrap">${formBlock(L).replace(' fade-up', '').replace('Solicitar valoración gratuita', 'Consultar servicio de alquiler')}</div>
  </div>
</section>
${testimonialsSection(L)}
${relatedBlock(L, ctx)}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:800px">
    <div class="text-center" style="margin-bottom:2rem"><span class="overline">FAQ</span><h2 class="section-title">Preguntas frecuentes</h2></div>
    <div class="faq-list">${faqHtml(L.faq)}</div>
    <div class="lc-kw">${L.keywords_footer}</div>
  </div>
</section>
${footerAndScripts(L)}
</body></html>`;
}

module.exports = { renderAlquiler };
