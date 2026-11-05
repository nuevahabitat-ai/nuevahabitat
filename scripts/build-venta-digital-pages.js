/**
 * Genera venta-digital.html (hub) y venta-digital-{ciudad}.html
 * Uso: node scripts/build-venta-digital-pages.js (también vía build-landings.js)
 */
const fs = require('fs');
const path = require('path');
const { CIUDADES, SITE, FEE_BASE, FEE_IVA } = require('./venta-digital-ciudades-data');
const { renderVentaDigitalPage } = require('./render-venta-digital-page');
const {
  ventaDigitalExtraStyles,
  ventaDigitalQuickGlanceHub,
  ventaDigitalIllustratedFlow,
} = require('./venta-digital-content-blocks');

const ROOT = path.join(__dirname, '..');

function renderHub() {
  const barcelona = CIUDADES.find((c) => c.slug === 'venta-digital-barcelona') || CIUDADES[0];
  const cityNames = CIUDADES.map((c) => c.cityName);
  const cityListShort =
    cityNames.length <= 6
      ? cityNames.join(', ')
      : `${cityNames.slice(0, 5).join(', ')} y ${cityNames.length - 5} más`;
  const cityGrid = CIUDADES.map(
    (c) =>
      `<a href="/${c.slug}" class="nh-vd-city-link"><strong>${c.cityName}</strong><span>1.999 € + IVA · venta digital</span></a>`
  ).join('\n      ');
  const heroCityBtns = CIUDADES.slice(0, 4)
    .map((c) => `<a href="/${c.slug}" class="btn btn-outline-light">${c.cityName}</a>`)
    .join('\n      ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Venta 100 % digital · ${cityNames.length} ciudades · 1.999 € + IVA · NuevaHabitat</title>
  <meta name="description" content="Vende con agencia 100 % digital en ${cityListShort}. Honorarios fijos 1.999 € + IVA · Idealista y pisos.com · visitas cualificadas. 50 % al contratar y 50 % en escritura."/>
  <meta name="keywords" content="venta 100 por ciento digital, vender piso online españa, inmobiliaria digital precio fijo, nueva habitat venta digital ${cityNames.slice(0, 8).join(' ').toLowerCase()}"/>
  <link rel="canonical" href="${SITE}/venta-digital"/>
  <meta property="og:title" content="Venta 100 % digital · NuevaHabitat"/>
  <meta property="og:description" content="Plan digital en ${cityNames.length} ciudades: precio fijo, panel vendedor y sin comisión del 3 %."/>
  <meta property="og:url" content="${SITE}/venta-digital"/>
  <link rel="stylesheet" href="css/styles.css"/>
  <link rel="icon" type="image/png" href="imagenes/Logo/logosinfondo2.png"/>
  <style>${ventaDigitalExtraStyles()}</style>
  <script type="application/ld+json" id="nh-seo-static">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Venta 100 % digital · NuevaHabitat',
        url: `${SITE}/venta-digital`,
        description: `Landings SEO venta digital · ${cityListShort}`,
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
    <h1>Venta 100&nbsp;% digital en ${cityListShort}</h1>
    <div class="nh-svc-price-chip"><strong>${FEE_BASE} € + IVA</strong> · <span>50&nbsp;% contrato + 50&nbsp;% escritura</span></div>
    <p>Un solo plan nacional: NuevaHabitat publica en <strong>Idealista</strong> y <strong>pisos.com</strong>, filtra compradores con hipoteca o liquidez y negocia hasta escritura. <strong>Tú recibes las visitas cualificadas</strong> en tu ciudad. Sin comisión del 3&nbsp;% sobre el precio de venta.</p>
    <div class="nh-svc-hero-actions">
      <a href="/registro?tipo=vender&amp;plan=digital" class="btn btn-gold">Contratar venta digital</a>
      ${heroCityBtns}
      <a href="#ciudades" class="btn btn-outline-light">Todas las ciudades</a>
    </div>
  </div>
</section>

${ventaDigitalQuickGlanceHub()}
${ventaDigitalIllustratedFlow({ cityName: 'España', slug: 'venta-digital', priceExample: 350000 })}

<section class="lc-section" id="ciudades" style="background:var(--blanco);padding:3rem 0">
  <div class="container">
    <div class="text-center" style="margin-bottom:2rem">
      <span class="overline">SEO nacional</span>
      <h2 class="section-title">Venta digital por ciudad</h2>
      <p style="color:var(--gris-texto);max-width:640px;margin:.75rem auto 0;line-height:1.7">Mismo plan <strong>1.999 € + IVA</strong> en toda España donde puedas recibir visitas cualificadas. Elige tu ciudad:</p>
    </div>
    <div class="nh-svc-planes-nav nh-vd-city-grid" style="flex-wrap:wrap;justify-content:center;gap:.75rem">
      ${cityGrid}
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--crema);padding:3rem 0">
  <div class="container" style="max-width:820px">
    <div class="text-center" style="margin:0 auto 2rem">
      <h2 class="section-title">Página de servicio · venta digital</h2>
      <p style="color:var(--gris-texto);line-height:1.75">Desde Barcelona operamos el plan 1.999&nbsp;€ + IVA con panel, Idealista, pisos.com y visitas que tú programas. Contenido por ciudad y barrio lo publicamos en el <a href="/blog">blog</a> (no en el hub principal de vender).</p>
    </div>
    <p style="text-align:center"><a href="/${barcelona.slug}" class="btn btn-gold">Ver venta digital · ${barcelona.cityName}</a> · <a href="/vender" class="btn btn-outline">Comparar los 3 planes</a></p>
  </div>
</section>

<section class="lc-section nh-svc-portals" style="background:var(--crema);padding:2.5rem 0">
  <div class="container fade-up">
    <div class="nh-svc-portals-inner">
      <div class="nh-svc-portals-copy">
        <span class="overline">Publicación</span>
        <h2 class="section-title">Idealista y pisos.com</h2>
        <p class="nh-svc-portals-lead">La publicación se hará con <strong>Idealista</strong> y con <strong>pisos.com</strong>, con lo que tendremos el máximo de clientes interesados en tu inmueble.</p>
      </div>
      <div class="nh-svc-portals-logos">
        <img src="imagenes/portales/idealista.jpg" alt="Idealista" width="254" height="157" loading="lazy" class="nh-svc-portal-logo nh-svc-portal-logo--idealista"/>
        <img src="imagenes/portales/pisos-com.png" alt="pisos.com" width="200" height="80" loading="lazy" class="nh-svc-portal-logo nh-svc-portal-logo--pisos"/>
      </div>
    </div>
  </div>
</section>

<section class="lc-section" style="background:var(--crema)">
  <div class="container" style="max-width:820px">
    <h2 class="section-title">Qué es la venta 100&nbsp;% digital</h2>
    <p style="color:var(--gris-texto);line-height:1.75">Es el plan de <strong>honorarios fijos</strong> de NuevaHabitat (1.999&nbsp;€ + IVA): misma tecnología que la venta clásica, pero <strong>las visitas las hace el propietario</strong> en horarios que marca en el panel. Ideal para ahorrar frente a comisiones del 3&nbsp;–&nbsp;6&nbsp;% y mantener control de quién entra en casa.</p>
    <ul class="lc-nh-checklist">
      <li>Expediente online, contrato y pagos Stripe (50&nbsp;% + 50&nbsp;%).</li>
      <li>Publicación en Idealista y pisos.com.</li>
      <li>Filtro de solvencia antes de cada visita.</li>
      <li>Negociación, arras y coordinación hasta notaría.</li>
    </ul>
    <p style="margin-top:1rem"><a href="/venta-clasica-barcelona">Venta clásica</a> (visitas NH) · <a href="/venta-comercial-barcelona">Digital + comercial</a> (solo Barcelona)</p>
  </div>
</section>

<section class="lc-section" style="background:var(--negro);padding:2rem 0">
  <div class="container nh-svc-planes-nav">
    <a href="/venta-digital-barcelona" class="is-current"><strong>100 % digital</strong><span>1.999 € + IVA</span></a>
    <a href="/venta-comercial-barcelona"><strong>Digital + comercial</strong><span>2.500 € + IVA · Barcelona</span></a>
    <a href="/venta-clasica-barcelona"><strong>Venta clásica</strong><span>3.500 € + IVA</span></a>
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
