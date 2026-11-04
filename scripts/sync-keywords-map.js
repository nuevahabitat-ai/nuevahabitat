/**
 * Sincroniza content/keywords-map.json con landings JSON (keyword_principal + canonical).
 * Uso: node scripts/sync-keywords-map.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAP_PATH = path.join(ROOT, 'content', 'keywords-map.json');
const CLUSTERS = ['barrio', 'situacion', 'intencion', 'particular', 'comparativa', 'comprador', 'alquiler'];
const { CIUDADES } = require('./venta-digital-ciudades-data');

function loadSeoStaticLandings() {
  const p = path.join(ROOT, 'content', 'seo-static-landings.json');
  if (!fs.existsSync(p)) return [];
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  return Array.isArray(data.landings) ? data.landings : [];
}

function loadLandings() {
  const out = [];
  CLUSTERS.forEach((c) => {
    const dir = path.join(ROOT, 'content', 'landings', c);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .forEach((f) => {
        out.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
      });
  });
  return out;
}

function main() {
  const map = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, 'utf8')) : {};
  const landings = loadLandings();
  let added = 0;
  let updated = 0;

  const allEntries = landings.concat(loadSeoStaticLandings());
  CIUDADES.forEach((c) => {
    allEntries.push({
      slug: c.slug,
      keyword_principal: c.keyword_principal,
      keyword_aliases: c.keyword_aliases,
      cluster: 'ventaDigital',
    });
  });
  allEntries.push({
    slug: 'venta-digital',
    keyword_principal: 'venta 100 por ciento digital españa',
    keyword_aliases: [
      'vender piso online madrid barcelona',
      'inmobiliaria digital precio fijo',
      'agencia venta digital',
    ],
    cluster: 'ventaDigital',
  });

  allEntries.forEach((L) => {
    if (!L.slug || !L.keyword_principal) return;
    const kw = L.keyword_principal.toLowerCase();
    const entry = {
      keyword: kw,
      cluster: L.cluster,
      canonical: '/' + L.slug,
    };
    if (L.keyword_aliases && L.keyword_aliases.length) {
      entry.aliases = L.keyword_aliases.slice(0, 8);
    }
    if (!map[L.slug]) {
      map[L.slug] = entry;
      added++;
    } else {
      map[L.slug] = { ...map[L.slug], ...entry };
      updated++;
    }
  });

  const sorted = {};
  Object.keys(map)
    .sort()
    .forEach((k) => {
      sorted[k] = map[k];
    });
  fs.writeFileSync(MAP_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`keywords-map: ${Object.keys(sorted).length} entradas (+${added} nuevas, ${updated} actualizadas)`);
}

if (require.main === module) main();
module.exports = { main: main };
