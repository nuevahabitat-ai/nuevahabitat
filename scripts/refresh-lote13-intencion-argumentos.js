/**
 * Regenera argumento_principal del lote 13 (nuevos JSON).
 * node scripts/refresh-lote13-intencion-argumentos.js
 */
const fs = require('fs');
const path = require('path');
const pf = require('./scaffold-intencion-precio-fijo.js');
const pp = require('./scaffold-intencion-para-particulares.js');

const BARRIO_DIR = path.join(__dirname, '..', 'content', 'landings', 'barrio');
const INT = path.join(__dirname, '..', 'content', 'landings', 'intencion');

const PF = [
  'vender-camp-de-larpa-barcelona',
  'vender-la-bordeta-barcelona',
  'vender-la-marina-barcelona',
  'vender-roquetes-barcelona',
  'vender-sant-just-sant-joan-despi',
  'vender-sant-pere-santa-caterina-barcelona',
  'vender-tetuan-barcelona',
  'vender-trinitat-vella-barcelona',
  'vender-vall-d-hebron-barcelona',
];

const PP = [
  'vender-bon-pastor-barcelona',
  'vender-camp-de-larpa-barcelona',
  'vender-camp-den-grassot-barcelona',
  'vender-el-besos-barcelona',
  'vender-la-bordeta-barcelona',
  'vender-la-marina-barcelona',
  'vender-navas-barcelona',
  'vender-piso-barceloneta',
  'vender-piso-born-barcelona',
  'vender-piso-gotic-barcelona',
  'vender-piso-raval-barcelona',
  'vender-provencals-del-poblenou-barcelona',
  'vender-sant-just-sant-joan-despi',
  'vender-sant-pere-santa-caterina-barcelona',
  'vender-tetuan-barcelona',
  'vender-trinitat-vella-barcelona',
  'vender-vall-d-hebron-barcelona',
  'vender-verneda-barcelona',
];

function wc(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function refreshPf(barrioSlug) {
  const intSlug = pf.intencionSlugFromBarrio(barrioSlug);
  const p = path.join(INT, intSlug + '.json');
  if (!fs.existsSync(p)) return;
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal = pf.buildArgumento(B, intSlug);
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('pf', intSlug, wc(L.argumento_principal));
}

function refreshPp(barrioSlug) {
  const intSlug = pp.intencionSlugFromBarrio(barrioSlug);
  const p = path.join(INT, intSlug + '.json');
  if (!fs.existsSync(p)) return;
  let zoneSlug = barrioSlug.replace(/^vender-/, '').replace(/^piso-/, '');
  if (!zoneSlug.endsWith('-barcelona')) zoneSlug += '-barcelona';
  const B = JSON.parse(fs.readFileSync(path.join(BARRIO_DIR, barrioSlug + '.json'), 'utf8'));
  const L = JSON.parse(fs.readFileSync(p, 'utf8'));
  L.argumento_principal = pp.buildArgumento(B, intSlug, zoneSlug);
  fs.writeFileSync(p, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('pp', intSlug, wc(L.argumento_principal));
}

PF.forEach(refreshPf);
PP.forEach(refreshPp);
