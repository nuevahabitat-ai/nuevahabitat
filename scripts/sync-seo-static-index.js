/**
 * Actualiza landings-index + js/landings.js desde content/seo-static-landings.json
 * sin ejecutar build-landings.js completo (evita bloqueos en Windows / archivos grandes).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function writeLandingsJs(allMap, order) {
  const lines = [
    '/** Generado por scripts/build-landings.js / sync-seo-static-index.js */',
    'window.NH_LANDING_ORDER = ' + JSON.stringify(order, null, 2) + ';',
    'window.NH_LANDING_CLUSTERS = {',
    "  barrio: { label: 'Por barrio', slugs: [] },",
    "  situacion: { label: 'Por situación', slugs: [] },",
    "  intencion: { label: 'Guías vendedor', slugs: [] },",
    "  particular: { label: 'Vender como particular', slugs: [] },",
    "  comparativa: { label: 'Comparativas', slugs: [] },",
    "  comprador: { label: 'Comprar', slugs: [] },",
    "  alquileres: { label: 'Alquileres', slugs: [] },",
    "  alquiler: { label: 'Alquiler por micro-barrio', slugs: [] },",
    "  ventaDigital: { label: 'Venta 100 % digital', slugs: [] },",
    "  patrimonial: { label: 'Patrimonial · empresas', slugs: [] },",
    '};',
    'window.NH_LANDINGS = ' + JSON.stringify(allMap, null, 2) + ';',
    'Object.keys(window.NH_LANDINGS).forEach(function(slug){',
    '  var c = window.NH_LANDINGS[slug].cluster;',
    '  if (c && window.NH_LANDING_CLUSTERS[c]) window.NH_LANDING_CLUSTERS[c].slugs.push(slug);',
    '});',
    'window.NH_LANDING_SLUGS = window.NH_LANDING_ORDER.slice();',
    '',
  ];
  fs.writeFileSync(path.join(ROOT, 'js', 'landings.js'), lines.join('\n'), 'utf8');
}

function parseLandingsJs() {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'landings.js'), 'utf8');
  const oStart = src.indexOf('window.NH_LANDING_ORDER = ');
  const oJson = src.indexOf('[', oStart);
  const oEnd = src.indexOf('];', oJson) + 1;
  const mStart = src.indexOf('window.NH_LANDINGS = ');
  const mJson = src.indexOf('{', mStart);
  let depth = 0;
  let mEnd = mJson;
  for (let i = mJson; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        mEnd = i + 1;
        break;
      }
    }
  }
  return {
    order: JSON.parse(src.slice(oJson, oEnd)),
    map: JSON.parse(src.slice(mJson, mEnd)),
  };
}

function landingRecord(L) {
  return {
    slug: L.slug,
    cluster: L.cluster || 'ventaDigital',
    footerLabel: L.footerLabel,
    keyword_principal: L.keyword_principal,
    priority: L.priority,
    indexable: L.indexable !== false,
    cardTeaser: L.cardTeaser,
  };
}

function syncSeoStaticIndex() {
  const staticPath = path.join(ROOT, 'content', 'seo-static-landings.json');
  const indexPath = path.join(ROOT, 'content', 'landings-index.json');
  if (!fs.existsSync(staticPath)) {
    console.warn('sync-seo-static-index: sin', staticPath);
    return;
  }
  const { landings: staticList } = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
  const { order, map } = parseLandingsJs();
  let index = fs.existsSync(indexPath)
    ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    : { landings: [] };
  const indexSlugs = new Set((index.landings || []).map((l) => l.slug));
  let added = 0;

  staticList.forEach((L) => {
    if (!L.slug) return;
    if (!map[L.slug]) {
      map[L.slug] = landingRecord(L);
      added++;
    }
    if (!order.includes(L.slug)) {
      const anchor = order.indexOf('venta-digital-barcelona');
      if (anchor >= 0) order.splice(anchor, 0, L.slug);
      else order.push(L.slug);
    }
    if (!indexSlugs.has(L.slug)) {
      index.landings = index.landings || [];
      index.landings.push({
        slug: L.slug,
        cluster: L.cluster || 'ventaDigital',
        indexable: L.indexable !== false,
        priority: L.priority || 0.85,
      });
      indexSlugs.add(L.slug);
    }
  });

  index.updated = new Date().toISOString();
  writeLandingsJs(map, order);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`sync-seo-static-index: ${added} nuevas en js/landings.js · ${staticList.length} estáticas revisadas`);
}

function main() {
  syncSeoStaticIndex();
}

if (require.main === module) main();
module.exports = { syncSeoStaticIndex, main };