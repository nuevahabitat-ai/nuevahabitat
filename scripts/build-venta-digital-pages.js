/**
 * Genera venta-digital.html (hub) y venta-digital-{ciudad}.html
 * Uso: node scripts/build-venta-digital-pages.js (también vía build-landings.js)
 */
const fs = require('fs');
const path = require('path');
const { CIUDADES, SITE, FEE_BASE, FEE_IVA } = require('./venta-digital-ciudades-data');
const { renderVentaDigitalPage } = require('./render-venta-digital-page');

const ROOT = path.join(__dirname, '..');

function renderHub() {
  const cards = CIUDADES.map(
    (c) => `<a href="/${c.slug}" class="nh-plan-card fade-up" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;height:100%">
      <div class="nh-plan-tag">100 % digital · ${c.cityName}</div>
      <h3 style="font-family:var(--font-serif);margin:.5rem 0">Venta digital ${c.cityName}</h3>
      <p class="nh-plan-price">${FEE_BASE} € + IVA</p>
      <p style="color:var(--gris-texto);font-size:.875rem;line-height:1.55;flex:1">${c.areaServed}. ${c.priceM2}. ${c.avgDays}.</p>
      <span class="btn btn-outline nh-plan-cta" style="width:100%;justify-content:center;margin-top:1rem">Ver landing SEO →</span>
    </a>`
  ).join('\n');

  const cityLinks = CIUDADES.map(
    (c) => `<a href="/${c.slug}"><strong>${c.cityName}</strong><span>${c.keyword_principal}</span></a>`
  ).join('\n      ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Venta 100 % digital · Madrid, Barcelona, Valencia, Sevilla · 1.999 € + IVA · NuevaHabitat</title>
  <meta name="description" content="Vende con agencia 100 % digital en Madrid, Barcelona, Valencia y Sevilla. Honorarios fijos 1.999 € + IVA · expediente online, portales nacionales y visitas cualificadas. 50 % al contratar y 50 % en escritura."/>
  <meta name="keywords" content="venta 100 por ciento digital, vender piso online madrid barcelona valencia sevilla, inmobiliaria digital precio fijo, nueva habitat venta digital"/>
  <link rel="canonical" href="${SITE}/venta-digital"/>
  <meta property="og:title" content="Venta 100 % digital · NuevaHabitat"/>
  <meta property="og:description" content="Plan digital en cuatro ciudades: precio fijo, panel vendedor y sin comisión del 3 %."/>
  <meta property="og:url" content="${SITE}/venta-digital"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <script type="application/ld+json" id="nh-seo-static">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Venta 100 % digital · NuevaHabitat',
        url: `${SITE}/venta-digital`,
        description: 'Landings SEO venta digital Madrid Barcelona Valencia Sevilla',
      },
      {
        '@type': 'ItemList',
        itemListElement: CIUDADES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/${c.slug}`,
          name: `Venta digital ${c.cityName}`,
        })),
      },
    ],
  })}</script>
</head>
<body>
<nav id="navbar" class="scrolled" style="background:rgba(13,13,13,.97)">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="imagenes/Logo/logosinfondo2.png" alt="NuevaHabitat"/><div class="nav-logo-divider"></div><div class="logo-text"><span class="logo-name">Nueva Habitat</span><span class="logo-sub">Venta digital</span></div></a>
    <ul class="nav-links">
      <li><a href="/venta-digital" aria-current="page">100 % digital</a></li>
      <li><a href="/vender">Hub vender</a></li>
      <li><a href="/#planes-venta">Comparar planes</a></li>
    </ul>
    <div class="nav-actions"><a href="/registro?tipo=vender&amp;plan=digital" class="nav-cta">Contratar</a></div>
  </div>
</nav>

<section class="nh-svc-hero">
  <div class="nh-svc-hero-bg" style="background-image:url('imagenes/interior11.jpg')"></div>
  <div class="nh-svc-hero-overlay"></div>
  <div class="container nh-svc-hero-inner fade-up">
    <div class="hero-badge">SEO · venta 100 % digital · España</div>
    <h1>Venta 100&nbsp;% digital en Madrid, Barcelona, Valencia y Sevilla</h1>
    <div class="nh-svc-price-chip"><strong>${FEE_BASE} € + IVA</strong> · ${FEE_IVA.toLocaleString('es-ES')} € IVA incl. · <span>50&nbsp;% contrato + 50&nbsp;% escritura</span></div>
    <p>Un solo plan nacional: NuevaHabitat publica en portales, filtra compradores con hipoteca o liquidez y negocia hasta escritura. <strong>Tú recibes las visitas cualificadas</strong> en tu ciudad. Sin comisión del 3&nbsp;% sobre el precio de venta.</p>
    <div class="nh-svc-hero-actions">
      <a href="/registro?tipo=vender&amp;plan=digital" class="btn btn-gold">Contratar venta digital</a>
      <a href="/venta-digital-barcelona" class="btn btn-outline-light">Barcelona</a>
      <a href="/venta-digital-madrid" class="btn btn-outline-light">Madrid</a>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--blanco);padding:3rem 0">
  <div class="container">
    <div class="text-center" style="max-width:760px;margin:0 auto 2rem">
      <h2 class="section-title">Elige tu ciudad</h2>
      <p style="color:var(--gris-texto);line-height:1.7">Cada landing incluye mercado local orientativo, comparativa de honorarios, FAQ y enlaces al panel de registro con plan digital.</p>
    </div>
    <div class="nh-planes-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem">
      ${cards}
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:820px">
    <h2 class="section-title">Qué es la venta 100&nbsp;% digital</h2>
    <p style="color:var(--gris-texto);line-height:1.75">Es el plan de <strong>honorarios fijos</strong> de NuevaHabitat (1.999&nbsp;€ + IVA): misma tecnología que la venta clásica, pero <strong>las visitas las hace el propietario</strong> en horarios que marca en el panel. Ideal para ahorrar frente a comisiones del 3&nbsp;–&nbsp;6&nbsp;% y mantener control de quién entra en casa.</p>
    <ul class="lc-nh-checklist">
      <li>Expediente online, contrato y pagos Stripe (50&nbsp;% + 50&nbsp;%).</li>
      <li>Publicación en portales inmobiliarios principales.</li>
      <li>Filtro de solvencia antes de cada visita.</li>
      <li>Negociación, arras y coordinación hasta notaría.</li>
    </ul>
    <p style="margin-top:1rem"><a href="/venta-clasica-barcelona">Venta clásica</a> (visitas NH) · <a href="/venta-comercial-barcelona">Digital + comercial</a> (solo Barcelona)</p>
  </div>
</section>

<section class="lc-section" style="background:var(--negro);padding:2rem 0">
  <div class="container nh-svc-planes-nav">
    ${cityLinks}
  </div>
</section>

<section class="lc-section" style="background:var(--negro);color:#fff;text-align:center">
  <div class="container fade-up">
    <a href="/registro?tipo=vender&amp;plan=digital" class="btn btn-gold">Contratar venta digital</a>
    <p style="margin-top:1rem;font-size:.85rem;color:rgba(255,255,255,.6)"><a href="/mapa-del-sitio" style="color:var(--gold)">Mapa del sitio</a> · <a href="/contacto" style="color:var(--gold)">Contacto</a></p>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-bottom"><p>© 2026 NuevaHabitat</p></div>
  </div>
</footer>
<script src="js/leads.js"></script>
<script src="js/site-config.js"></script>
<script src="js/main.js"></script>
</body>
</html>
`;
}

function main() {
  CIUDADES.forEach((c) => {
    const out = path.join(ROOT, `${c.slug}.html`);
    fs.writeFileSync(out, renderVentaDigitalPage(c), 'utf8');
    console.log('Built', c.slug + '.html');
  });
  fs.writeFileSync(path.join(ROOT, 'venta-digital.html'), renderHub(), 'utf8');
  console.log('Built venta-digital.html (hub)');
}

if (require.main === module) main();
module.exports = { main, renderHub };
