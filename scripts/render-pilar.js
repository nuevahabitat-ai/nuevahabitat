function formatEuro(n) {
  return Number(n).toLocaleString('es-ES');
}

function heroPicture(L) {
  const img = L.heroImage;
  if (img.endsWith('.webp')) {
    const jpg = img.replace('.webp', '.jpg');
    return `<picture class="lc-hero-media"><source srcset="${img}" type="image/webp"/><img src="${jpg}" alt="${L.heroImageAlt}" width="1920" height="1280" fetchpriority="high" decoding="async"/></picture>`;
  }
  return `<div class="lc-hero-media"><img src="${img}" alt="${L.heroImageAlt}" fetchpriority="high" decoding="async"/></div>`;
}

function pilarGrid(L) {
  return (L.subBarrios || []).map((b) => {
    const precio = formatEuro(b.precio);
    return `<a href="/${b.slug}" class="lc-pilar-card fade-up">
      <span class="lc-pilar-tag">${b.nombre}</span>
      <h3>Vender piso en ${b.nombre}</h3>
      <p>${b.resumen}</p>
      <div class="lc-pilar-meta">Piso tipo ~${precio} € · ahorro ~${b.ahorro} € vs 6%</div>
      <span class="lc-pilar-link">Ver guía de ${b.nombre} →</span>
    </a>`;
  }).join('');
}

function renderPilar(L, deps) {
  const { SITE, sharedStyles, faqHtml, formBlock, footerAndScripts, relatedBlock, buildJsonLd, calcBlock, navBar, callBanner } = deps;
  const cp = (L.postalCodes && L.postalCodes[0]) || '08002';
  const precio = L.ejemploPrecio;
  const comision6 = formatEuro(Math.round(precio * 0.06));
  const precioFmt = formatEuro(precio);
  const badge = `${L.barrio} · Barcelona`;

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
  <meta property="og:image" content="${SITE}/${L.heroImage.replace('.webp', '.jpg')}"/>
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
      <a href="#barrios" class="btn btn-gold btn-lg">Elegir barrio del centro</a>
      <a href="#valorar" class="btn btn-outline-light btn-lg">Valoración gratuita</a>
    </div>
  </div></div>
</section>
${callBanner()}
<section class="lc-section" style="background:var(--blanco)" id="barrios">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2.5rem">
      <span class="overline">Ciutat Vella</span>
      <h2 class="section-title">Vender piso en el centro: elige tu barrio</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Cada zona del distrito tiene comprador, precio y estrategia distintos. Entra en la guía específica o pide valoración si no tienes claro dónde encaja tu piso.</p>
    </div>
    <div class="lc-pilar-grid">${pilarGrid(L)}</div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema)">
  <div class="container lc-grid-2">
    <div class="lc-prose fade-up">
      <span class="overline">Vender en ${L.barrio}</span>
      <h2>Vender piso en Ciutat Vella con precio fijo y compradores filtrados</h2>
      ${L.argumento_principal}
      <p style="font-size:.9375rem;color:var(--gris-medio)"><strong>Barrios:</strong> ${L.zonas.join(', ')}.</p>
    </div>
    ${formBlock(L)}
  </div>
</section>
${calcBlock(L)}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:720px;margin:0 auto 2.5rem">
      <span class="overline">Comparativa real</span>
      <h2 class="section-title">Agencia tradicional al 6% vs NuevaHabitat precio fijo</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Ejemplo sobre un piso en Ciutat Vella vendido a <strong>${precioFmt} €</strong>.</p>
    </div>
    <div class="lc-compare-wrap fade-up"><table class="lc-compare">
      <thead><tr><th>Concepto</th><th>Agencia tradicional (~6%)</th><th>NuevaHabitat (precio fijo)</th></tr></thead>
      <tbody>
        <tr><td><strong>Honorarios al vendedor</strong></td><td class="lc-lose">${comision6} € + IVA (6% de ${precioFmt} €)</td><td class="lc-win"><strong>3.000 € + IVA</strong> — solo en escritura</td></tr>
        <tr><td>Cuándo pagas</td><td class="lc-lose">Al firmar, aunque lleves meses en exclusiva</td><td class="lc-win">Solo si vendes. Sin venta, sin factura</td></tr>
        <tr><td>Conocimiento del centro</td><td class="lc-lose">Precio medio genérico del distrito</td><td class="lc-win">Valoración por barrio (Gòtic, Born, Raval, Barceloneta)</td></tr>
        <tr><td>Compradores</td><td>Cualquiera que llame</td><td class="lc-win">Cartera con hipoteca preaprobada</td></tr>
        <tr><td>Visitas</td><td>Horario de agencia</td><td class="lc-win"><strong>Tú eliges días y franjas</strong></td></tr>
      </tbody>
    </table></div>
    <p style="text-align:center;margin-top:1.5rem;font-size:.9375rem;color:var(--gris-texto)">En un piso de ${precioFmt} € te ahorras más de <strong>${L.ahorro} €</strong> frente a una comisión del 6%.</p>
  </div>
</section>
<section class="lc-section" style="background:var(--negro);color:#fff">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2.5rem"><span class="overline" style="color:var(--oro)">Plataforma</span><h2 class="section-title light">Vender en Ciutat Vella con tecnología y agente local</h2></div>
    <div class="lc-cards">
      <div class="lc-card fade-up" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:var(--oro-claro)">Panel vendedor</h3><p style="color:rgba(255,255,255,.7)">Estado de la venta 24/7: valoración, visitas, ofertas y escritura.</p></div>
      <div class="lc-card fade-up" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:var(--oro-claro)">Compradores cualificados</h3><p style="color:rgba(255,255,255,.7)">Filtramos por capacidad financiera antes de agendar visitas en el centro.</p></div>
      <div class="lc-card fade-up" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12)"><h3 style="color:var(--oro-claro)">Visitas a tu medida</h3><p style="color:rgba(255,255,255,.7)">Tú decides cuándo recibir visitas en tu piso del centro histórico.</p></div>
    </div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2.5rem"><span class="overline">Proceso</span><h2 class="section-title">Cómo vendemos tu piso en Ciutat Vella</h2></div>
    <div class="lc-steps fade-up">
      <div class="lc-step"><div class="lc-step-num">1</div><h4>Valoración</h4><p style="font-size:.875rem;color:var(--gris-texto)">Precio según barrio, finca y tipo de comprador real.</p></div>
      <div class="lc-step"><div class="lc-step-num">2</div><h4>Publicación</h4><p style="font-size:.875rem;color:var(--gris-texto)">Fotos profesionales y ficha optimizada por micro-zona.</p></div>
      <div class="lc-step"><div class="lc-step-num">3</div><h4>Visitas</h4><p style="font-size:.875rem;color:var(--gris-texto)">Agenda en tus horarios con compradores filtrados.</p></div>
      <div class="lc-step"><div class="lc-step-num">4</div><h4>Escritura</h4><p style="font-size:.875rem;color:var(--gris-texto)">Honorarios solo al cerrar. Si no vendes, no pagas.</p></div>
    </div>
  </div>
</section>
<section class="lc-section" style="background:var(--crema);padding-top:3rem;padding-bottom:3rem">
  <div class="container text-center fade-up">
    <span class="overline">Cartera activa</span>
    <h2 class="section-title">Inmuebles en venta en Ciutat Vella</h2>
    <a href="inmuebles.html?q=${encodeURIComponent(L.inmueblesQuery)}" class="btn btn-gold btn-lg">Ver inmuebles en el centro →</a>
  </div>
</section>
${relatedBlock()}
${callBanner('prefaq')}
<section class="lc-section" style="background:var(--blanco)">
  <div class="container" style="max-width:800px">
    <div class="text-center fade-up" style="margin-bottom:2rem"><span class="overline">FAQ</span><h2 class="section-title">Vender piso en Ciutat Vella — preguntas frecuentes</h2></div>
    <div class="faq-list fade-up">${faqHtml(L.faq)}</div>
    <div class="lc-kw fade-up"><strong>Búsquedas relacionadas:</strong> ${L.keywords_footer}</div>
  </div>
</section>
<section style="padding:4rem 0;background:var(--negro);text-align:center"><div class="container"><h2 class="section-title light">¿Listo para vender en Ciutat Vella?</h2><a href="#valorar" class="btn btn-gold btn-lg">Pedir valoración gratuita</a></div></section>
${footerAndScripts(L)}
</body></html>`;
}

module.exports = { renderPilar };
