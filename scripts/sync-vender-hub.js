/**
 * Sincroniza bloques generados en vender.html (plan chooser, compare, testimonios, FAQ).
 * Uso: node scripts/sync-vender-hub.js
 */
const fs = require('fs');
const path = require('path');
const { testimonialsSection } = require('./landing-testimonials');
const {
  planChooserSection,
  compareThreePlansTable,
  venderFaqSectionHtml,
  jsonLdServiceFaq,
  venderHubFaqs,
} = require('./venta-planes-shared');

const ROOT = path.join(__dirname, '..');
const VENDER = path.join(ROOT, 'vender.html');

function replaceBetween(text, start, end, replacement) {
  const i = text.indexOf(start);
  const j = text.indexOf(end);
  if (i === -1 || j === -1) throw new Error('Marcadores no encontrados: ' + start);
  return text.slice(0, i + start.length) + '\n' + replacement + '\n' + text.slice(j);
}

function main() {
  let html = fs.readFileSync(VENDER, 'utf8');

  const extra = planChooserSection() + '\n' + compareThreePlansTable('');
  html = replaceBetween(html, '<!-- NH_VENDER_EXTRA_START -->', '<!-- NH_VENDER_EXTRA_END -->', extra);

  const testimonials = testimonialsSection({
    slug: 'vender',
    cluster: 'intencion',
    footerLabel: 'Barcelona',
  });
  html = replaceBetween(
    html,
    '<!-- NH_VENDER_TESTIMONIALS_START -->',
    '<!-- NH_VENDER_TESTIMONIALS_END -->',
    testimonials
  );

  html = replaceBetween(
    html,
    '<!-- NH_VENDER_FAQ_LIST_START -->',
    '<!-- NH_VENDER_FAQ_LIST_END -->',
    venderFaqSectionHtml()
  );

  const ld = jsonLdServiceFaq({
    serviceName: 'Vender piso con NuevaHabitat — tres planes',
    url: 'https://www.nuevahabitat.com/vender',
    price: '1999',
    faqs: venderHubFaqs(),
  });
  html = replaceBetween(
    html,
    '<!-- NH_VENDER_JSONLD_START -->',
    '<!-- NH_VENDER_JSONLD_END -->',
    `<script type="application/ld+json">${ld}</script>`
  );

  fs.writeFileSync(VENDER, html, 'utf8');
  console.log('Updated vender.html hub blocks (extra, testimonials, FAQ)');
}

if (require.main === module) main();
module.exports = { main };
