/**
 * Regenera argumento_principal del lote 12 con plantillas ampliadas.
 * node scripts/refresh-lote12-intencion-argumentos.js
 */
const fs = require('fs');
const path = require('path');
const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');

const BARRIO_DIR = path.join(__dirname, '..', 'content', 'landings', 'barrio');
const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');

const PF_BARRIOS = [
  'vender-piso-barceloneta',
  'vender-piso-born-barcelona',
  'vender-piso-gotic-barcelona',
  'vender-piso-raval-barcelona',
  'vender-bon-pastor-barcelona',
  'vender-navas-barcelona',
  'vender-verneda-barcelona',
  'vender-el-besos-barcelona',
  'vender-provencals-del-poblenou-barcelona',
  'vender-camp-den-grassot-barcelona',
];

const PP_BARRIOS = [
  'vender-diagonal-mar-barcelona',
  'vender-fort-pienc-barcelona',
  'vender-guinardo-barcelona',
  'vender-hostafrancs-barcelona',
  'vender-vila-olimpica-barcelona',
  'vender-montjuic-barcelona',
  'vender-la-sagrera-barcelona',
  'vender-pedralbes-barcelona',
  'vender-sagrada-familia-barcelona',
  'vender-roquetes-barcelona',
];

function wc(html) {
  return (html || '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

for (const barrioSlug of PF_BARRIOS) {
  const intSlug = pf.intencionSlugFromBarrio(barrioSlug);
  const p = path.join(INT, intSlug + '.json');
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal = pf.buildArgumento(B, intSlug);
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('pf', intSlug, wc(L.argumento_principal));
}

for (const barrioSlug of PP_BARRIOS) {
  const intSlug = pp.intencionSlugFromBarrio(barrioSlug);
  const p = path.join(INT, intSlug + '.json');
  let zoneSlug = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
  if (!zoneSlug.endsWith('-barcelona')) zoneSlug += '-barcelona';
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal = pp.buildArgumento(B, intSlug, zoneSlug);
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('pp', intSlug, wc(L.argumento_principal));
}
