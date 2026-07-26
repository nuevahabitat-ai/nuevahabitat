const fs = require('fs');
const path = require('path');

function formatEuro(n) {
  return Number(n).toLocaleString('es-ES');
}

function jpgFallbackExists(img) {
  const jpg = img.replace('.webp', '.jpg');
  return fs.existsSync(path.join(__dirname, '..', jpg));
}

function heroPicture(L) {
  const img = L.heroImage;
  if (img.endsWith('.webp') && jpgFallbackExists(img)) {
    const jpg = img.replace('.webp', '.jpg');
    return `<picture class="lc-hero-media"><source srcset="${img}" type="image/webp"/><img src="${jpg}" alt="${L.heroImageAlt}" width="1920" height="1280" fetchpriority="high" decoding="async"/></picture>`;
  }
  return `<div class="lc-hero-media"><img src="${img}" alt="${L.heroImageAlt}" fetchpriority="high" decoding="async"/></div>`;
}

function ogImage(L) {
  const img = L.heroImage;
  if (img.endsWith('.webp') && !jpgFallbackExists(img)) return img;
  return img.replace('.webp', '.jpg');
}

function renderBarrio(L, deps) {
  const { SITE, sharedStyles, faqHtml, formBlock, footerAndScripts, relatedBlock, buildJsonLd, calcBlock, navBar, callBanner, checklistBlock, marketStatsBlock, buyerProfileBlock, nhPlatformBundle } = deps;
  const cp = (L.postalCodes && L.postalCodes[0]) || '08000';
  const precio = L.ejemploPrecio;
  const comision6 = formatEuro(Math.round(precio * 0.06));
  const precioFmt = formatEuro(precio);
  const areaLabel = L.municipio ? 'Área metropolitana' : 'Barcelona';
  const badge = `${L.barrio} · ${cp} · ${areaLabel}`;
  const testimoniosSection = L.testimonials === false ? '' : '';

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
  <meta property="og:title" content="${L.meta.title.replace(' · NuevaHabitat', '')}"/>
  <meta property="og:description" content="${L.meta.description}"/>
  <meta property="og:image" content="${SITE}/${ogImage(L)}"/>
  <meta property="og:locale" content="es_ES"/>
  <meta property="og:site_name" content="NuevaHabitat"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <link rel="canonical" href="${SITE}/${L.slug}"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${buildJsonLd(L)}</script>
  ${sharedStyles()}
</head>
<body data-nh-cluster="barrio" data-nh-landing-slug="${L.slug}" data-nh-precio-default="${precio}">
${navBar(L)}
<div class="container"><nav class="page-breadcrumb fade-up" aria-label="Breadcrumb"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/vender">Vender</a><span aria-hidden="true">/</span><span class="bc-current">${L.breadcrumbCurrent || L.barrio}</span></nav></div>
<section class="lc-hero">
  ${heroPicture(L)}
  <div class="lc-hero-overlay"></div>
  <div class="container"><div class="lc-hero-content fade-up">
    <span class="lc-badge">${badge}</span>
    <h1>${L.hero.h1}</h1>
    <p>${L.hero.lead}</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <a href="#valorar" class="btn btn-gold btn-lg">Valoración gratuita en ${L.barrio}</a>
      <a href="tel:+34603656587" class="btn btn-outline-light btn-lg">603 656 587</a>
    </div>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-grid-2">
    <div class="lc-prose fade-up">
      <span class="overline">Vender en ${L.barrio}</span>
      <h2>Vender piso en ${L.barrio} con precio fijo y compradores filtrados</h2>
      ${L.argumento_principal}
      <p style="font-size:.9375rem;color:var(--gris-medio)"><strong>Micro-zonas:</strong> ${L.zonas.join(', ')}.</p>
      ${marketStatsBlock(L)}
    </div>
    ${formBlock(L)}
  </div>
  ${buyerProfileBlock(L) ? `<div class="container">${buyerProfileBlock(L)}</div>` : ''}
</section>
${calcBlock(L)}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2.5rem">
      <span class="overline">Comparativa real</span>
      <h2 class="section-title">Agencia tradicional al 6% vs NuevaHabitat precio fijo</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Ejemplo sobre un piso en ${L.barrio} vendido a <strong>${precioFmt} €</strong>.</p>
    </div>
    <div class="lc-compare-wrap fade-up"><table class="lc-compare">
      <thead><tr><th>Concepto</th><th>Agencia tradicional (~6%)</th><th>NuevaHabitat (precio fijo)</th></tr></thead>
      <tbody>
        <tr><td><strong>Honorarios al vendedor</strong></td><td class="lc-lose">${comision6} € + IVA (6% de ${precioFmt} €)</td><td class="lc-win"><strong>3.000 € + IVA</strong> — solo en escritura</td></tr>
        <tr><td>Cuándo pagas</td><td class="lc-lose">Al firmar, aunque lleves meses en exclusiva</td><td class="lc-win">Solo si vendes. Sin venta, sin factura</td></tr>
        <tr><td>Panel digital vendedor</td><td>Emails sueltos</td><td class="lc-win">Panel con expediente 24/7</td></tr>
        <tr><td>Compradores</td><td>Cualquiera que llame</td><td class="lc-win">Cartera con hipoteca preaprobada</td></tr>
        <tr><td>Visitas</td><td>Horario de agencia</td><td class="lc-win"><strong>Tú eliges días y franjas</strong></td></tr>
      </tbody>
    </table></div>
    <p style="text-align:center;margin-top:1.5rem;font-size:.9375rem;color:var(--gris-texto)">En un piso de ${precioFmt} € te ahorras más de <strong>${L.ahorro} €</strong> frente a una comisión del 6%.</p>
  </div>
</section>
${nhPlatformBundle(L)}
${L.testimonials === false ? '' : '<section class="testimonios" data-nh-testimonials></section>'}
<section class="lc-section" style="background:var(--crema);padding-top:3rem;padding-bottom:3rem">
  <div class="container text-center fade-up">
    <span class="overline">Cartera activa</span>
    <h2 class="section-title">Inmuebles en venta en ${L.barrio}</h2>
    <a href="inmuebles.html?q=${encodeURIComponent(L.inmueblesQuery)}" class="btn btn-gold btn-lg">Ver inmuebles en ${L.barrio} →</a>
  </div>
</section>
${relatedBlock()}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container" style="max-width:800px">
    ${checklistBlock(L.checklist?.title || `Checklist antes de vender en ${L.barrio}`, L.checklist?.items, L.checklist?.intro)}
    <div class="text-center fade-up" style="margin-bottom:2rem;margin-top:${L.checklist?.items?.length ? '3rem' : '0'}"><span class="overline">FAQ</span><h2 class="section-title">Vender piso en ${L.barrio} — preguntas frecuentes</h2></div>
    <div class="faq-list fade-up">${faqHtml(L.faq)}</div>
    <div class="lc-kw fade-up"><strong>Búsquedas relacionadas:</strong> ${L.keywords_footer}</div>
  </div>
</section>
<section style="padding:4rem 0;background:var(--negro);text-align:center"><div class="container"><h2 class="section-title light">¿Listo para vender en ${L.barrio}?</h2><a href="#valorar" class="btn btn-gold btn-lg">Pedir valoración gratuita</a></div></section>
${footerAndScripts(L)}
</body></html>`;
}

module.exports = { renderBarrio };
