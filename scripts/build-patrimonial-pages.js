/**
 * Genera patrimonial-{zona}.html desde scripts/patrimonial-zonas-data.js
 * Actualiza grid de barrios/ciudades en patrimonial.html
 */
const fs = require('fs');
const path = require('path');
const { ZONAS, barrioZonas, ciudadZonas, SITE } = require('./patrimonial-zonas-data');
const { renderPatrimonialZonaPage } = require('./render-patrimonial-zona-page');

const ROOT = path.join(__dirname, '..');

function replaceBetween(text, start, end, replacement) {
  const i = text.indexOf(start);
  const j = text.indexOf(end);
  if (i === -1 || j === -1) throw new Error('Marcadores no encontrados: ' + start);
  return text.slice(0, i + start.length) + '\n' + replacement + '\n' + text.slice(j);
}

function syncPatrimonialHub() {
  const p = path.join(ROOT, 'patrimonial.html');
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('<!-- NH_PATRIMONIAL_ZONAS_START -->')) {
    const anchor = '<section class="lc-section" style="background:var(--crema)">\n  <div class="container">\n    <div class="text-center fade-up" style="margin-bottom:2rem">\n      <span class="overline">Metodología</span>';
    const section = `<section class="lc-section" id="patrimonial-zonas" style="background:var(--blanco);padding:3rem 0">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2rem">
      <span class="overline">SEO · cartera B2B</span>
      <h2 class="section-title">Patrimonial por barrio y ciudad</h2>
      <p style="color:var(--gris-texto);max-width:640px;margin:.75rem auto 0;line-height:1.7">Landings para <strong>sociedades patrimoniales</strong>, pymes e inversores con varios inmuebles. Gestión de viviendas, locales y naves con un responsable de cuenta.</p>
    </div>
    <!-- NH_PATRIMONIAL_ZONAS_START -->
    <p>Placeholder zonas</p>
    <!-- NH_PATRIMONIAL_ZONAS_END -->
  </div>
</section>

`;
    if (html.includes(anchor)) {
      html = html.replace(anchor, section + anchor);
    }
  }

  const barrioGrid = barrioZonas()
    .map(
      (z) =>
        `<a href="/${z.slug}" class="nh-vd-city-link"><strong>${z.zoneName}</strong><span>Patrimonial · cartera empresas</span></a>`
    )
    .join('\n      ');
  const ciudadGrid = ciudadZonas()
    .map(
      (z) =>
        `<a href="/${z.slug}" class="nh-vd-city-link"><strong>${z.zoneName}</strong><span>Patrimonial · ${z.areaServed}</span></a>`
    )
    .join('\n      ');
  const block = `<h3 class="section-title" style="font-size:1.15rem;margin:0 0 1rem">Barcelona y área metropolitana</h3>
    <div class="nh-svc-planes-nav nh-vd-city-grid" style="margin-bottom:2rem">
      ${barrioGrid}
    </div>
    <h3 class="section-title" style="font-size:1.15rem;margin:0 0 1rem">España (cartera multi-zona)</h3>
    <div class="nh-svc-planes-nav nh-vd-city-grid">
      ${ciudadGrid}
    </div>`;

  html = replaceBetween(html, '<!-- NH_PATRIMONIAL_ZONAS_START -->', '<!-- NH_PATRIMONIAL_ZONAS_END -->', block);
  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated patrimonial.html zona grid');
}

function main() {
  ZONAS.forEach((z) => {
    const out = path.join(ROOT, `${z.slug}.html`);
    fs.writeFileSync(out, renderPatrimonialZonaPage(z), 'utf8');
    console.log('Built', z.slug + '.html');
  });
  syncPatrimonialHub();
}

if (require.main === module) main();
module.exports = { main, syncPatrimonialHub };
