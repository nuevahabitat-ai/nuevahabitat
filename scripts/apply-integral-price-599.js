/**
 * Sustituye copy 499 € → 599 € IVA incluido · pago único (solo patrones seguros).
 * node scripts/apply-integral-price-599.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LABEL = '599 € IVA incluido · pago único';

const REPLACEMENTS = [
  [/499 € precio fijo/g, LABEL],
  [/499 € fijo/g, LABEL],
  [/499 euros precio fijo/g, '599 euros IVA incluido · pago único'],
  [/499 € · tarifa fija del servicio/g, LABEL],
  [/499 € · tarifa fija/g, LABEL],
  [/Tarifa fija 499 €/g, LABEL],
  [/499 € · fijo/g, LABEL],
  [/Pago 499 €/g, 'Pago 599 € IVA incluido'],
  [/499 € pagado/g, '599 € pagado'],
  [/499 € pagados/g, '599 € pagados'],
  [/499 € pendiente/g, '599 € pendiente'],
  [/499 € pend\./g, '599 € pend.'],
  [/Transfer\. 499 €/g, 'Transfer. 599 €'],
  [/499,00 €/g, '599,00 €'],
  [/"price": "499"/g, '"price": "599"'],
  [/Alquiler · integral \(499 €\)/g, 'Alquiler · integral (599 € IVA incluido)'],
  [/Alquiler integral \(499 €\)/g, 'Alquiler integral (599 € IVA incluido · pago único)'],
  [/Pago integral 499 €/g, 'Pago integral 599 € IVA incluido'],
  [/propietarios panel 499 €/g, 'propietarios panel 599 € IVA incluido'],
  [/Panel alquiler integral \(499 €\)/g, 'Panel alquiler integral (599 € IVA incluido)'],
  [/servicio \(499 €\)/g, 'servicio (599 € IVA incluido · pago único)'],
  [/los 499 €/g, 'los 599 € (IVA incluido)'],
  [/499 € integral/g, LABEL],
  [/499 € no explicado/g, '599 € no explicado'],
  [/pack integral 499 €/g, 'pack integral 599 € IVA incluido'],
  [/pack 499 €/g, 'pack 599 € IVA incluido'],
  [/tarifa 499 €/g, 'tarifa 599 € IVA incluido'],
  [/integral_tarifa \?\? 499/g, 'integral_tarifa ?? 599'],
  [/\|\| 499/g, '|| 599'],
  [/Alquiler integral \(499 € fijo\)/g, 'Alquiler integral (599 € IVA incluido · pago único)'],
  [/499 €\)/g, '599 € IVA incluido · pago único)'],
  [/· 499 € fijo/g, '· 599 € IVA incluido · pago único'],
  [/499 € todo incluido/g, '599 € IVA incluido · pago único'],
  [/499 € acordada/g, '599 € IVA incluido acordada'],
  [/499 € cerrado/g, '599 € IVA incluido · pago único'],
  [/El integral \(499 €\)/g, 'El integral (599 € IVA incluido · pago único)'],
  [/integral \(499 €,/g, 'integral (599 € IVA incluido · pago único,'],
  [/499 €\s*·\s*499 €/g, '599 € IVA incluido · pago único'],
  [/<strong>499 €<\/strong> · tarifa fija del servicio/g, '<strong>599 €</strong> · IVA incluido · pago único'],
  [/Incluido en 499 €/g, 'Incluido en 599 € IVA incluido'],
  [/499 € · alquiler integral/g, '599 € IVA incluido · pago único'],
  [/<div class="price">499 €<\/div>/g, '<div class="price">599 €</div><p class="price-note" style="font-size:.85rem;opacity:.85;margin-top:.35rem">IVA incluido · pago único</p>'],
  [/Entrar al panel · 499 €/g, 'Entrar al panel · 599 € IVA incluido'],
  [/Entrar al panel real · 499 €/g, 'Entrar al panel real · 599 € IVA incluido'],
  [/Integral · 499 €/g, 'Integral · 599 € IVA incluido'],
  [/Integral 499 € o administración/g, 'Integral 599 € IVA incluido (pago único) o administración'],
  [/¿499 € incluye IVA\?/g, '¿599 € incluye IVA?'],
  [/Alquiler integral 499€/g, 'Alquiler integral 599€ IVA incluido'],
  [/tarifa fija 499 €/g, '599 € IVA incluido · pago único'],
  [/delega la gestión · 499 €/g, 'delega la gestión · 599 € IVA incl.'],
  [/por <strong>499 €<\/strong>/g, 'por <strong>599 €</strong> (IVA incluido · pago único)'],
  [/<strong>499 €<\/strong> · captación y cierre/g, '<strong>599 €</strong> · IVA incluido · captación y cierre'],
  [/499 € tarifa fija/g, '599 € IVA incluido · pago único'],
  [/Precio fijo 499 €/g, 'Precio fijo 599 € (IVA incluido)'],
  [/Qué incluye 499 €/g, 'Qué incluye 599 € (IVA incluido)'],
  [/499 € · precio fijo/g, '599 € IVA incluido · pago único'],
  [/¿El precio 499 €/g, '¿El precio 599 €'],
  [/499 € fijos/g, '599 € IVA incl. (pago único)'],
  [/499 € fijo/g, '599 € IVA incluido · pago único'],
  [/integral 499 €/g, 'integral 599 € IVA incl.'],
  [/\(499 €\)/g, '(599 € IVA incluido · pago único)'],
  [/Acceso alquiler integral · 499 €/g, 'Acceso alquiler integral · 599 € IVA incl.'],
  [/pago 499 €\./g, 'pago 599 € IVA incluido.'],
  [/servicio <strong>499 €<\/strong>/g, 'servicio <strong>599 €</strong> IVA incluido · pago único'],
  [/\(499 €, publicación/g, '(599 € IVA incluido, publicación'],
  [/Alquiler integral 499 €/g, 'Alquiler integral 599 € IVA incl.'],
  [/<td class="win">499 € fijo<\/td>/g, '<td class="win">599 € IVA incl. · pago único</td>'],
  [/Integral 499 € o administración/g, 'Integral 599 € IVA incl. (pago único) o administración'],
  [/499€/g, '599€ IVA incl.'],
  [/integral_tarifa: 499/g, 'integral_tarifa: 599'],
  [/499 € · panel propietario/g, '599 € IVA incl. · panel propietario'],
  [/· 499 € ·/g, '· 599 € IVA incl. ·'],
  [/499 € —/g, '599 € IVA incl. —'],
  [/499 € integral/g, '599 € IVA incl. · pago único'],
  [/499 € cerrado/g, '599 € IVA incl. · pago único'],
  [/499 € todo incluido/g, '599 € IVA incl. · pago único'],
  [/alquiler integral 499€/gi, 'alquiler integral 599€ IVA incl.'],
  [/499 € no explicado/g, '599 € no explicado'],
  [/pack 499 € fijo/g, 'pack 599 € IVA incl. · pago único'],
  [/h2>499 € fijo/g, 'h2>599 € IVA incl. · pago único'],
  [/¿499 € incluye/g, '¿599 € incluye'],
  [/ 499 €<\/a>/g, ' 599 € IVA incl.</a>'],
  [/ 499 €'/g, " 599 € IVA incl.'"],
  [/Integral 499 € ·/g, 'Integral 599 € IVA incl. ·'],
  [/Alquiler integral · 499 €/g, 'Alquiler integral · 599 € IVA incl.'],
  [/"cardTeaser": "499 € fijo/g, '"cardTeaser": "599 € IVA incl. · pago único'],
  [/integral \(499 €\)/g, 'integral (599 € IVA incl. · pago único)'],
  [/integral \(499€\)/g, 'integral (599€ IVA incl.)'],
  [/499€\)/g, '599€ IVA incl.)'],
  [/pack 499 €\./g, 'pack 599 € IVA incl. · pago único.'],
  [/tarifa 499 €\./g, 'tarifa 599 € IVA incl. · pago único.'],
];

const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor']);

function shouldFile(file) {
  const base = path.basename(file);
  if (base === 'apply-integral-price-599.js') return false;
  const ext = path.extname(file).toLowerCase();
  if (ext === '.py' && (base.startsWith('publish-alquiler-barrios') || base === '_inject-integral-sections.py')) return true;
  if (!['.html', '.json', '.js', '.py'].includes(ext)) return false;
  if (ext === '.html') {
    if (/^alquiler-integral/.test(base)) return true;
    if (/^administracion-alquiler/.test(base)) return true;
    if (/^acceso-alquiler/.test(base)) return true;
    if (base === 'administracion-alquileres.html') return true;
    if (base === 'admin-panel.html' || base === 'login.html') return true;
    return false;
  }
  if (ext === '.js') {
    if (file.includes(`${path.sep}js${path.sep}panel-propietario`)) return true;
    if (file.includes(`${path.sep}js${path.sep}landings.js`)) return true;
    if (file.includes(`${path.sep}js${path.sep}main.js`)) return true;
    if (file.includes(`${path.sep}js${path.sep}supabase.js`)) return true;
    if (base.startsWith('scaffold-alquiler') && file.includes(`${path.sep}scripts${path.sep}`)) return true;
    return false;
  }
  if (ext === '.json') {
    return file.includes(`${path.sep}content${path.sep}`);
  }
  return false;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (shouldFile(p)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [re, rep] of REPLACEMENTS) {
    text = text.replace(re, rep);
  }
  if (text !== before) {
    fs.writeFileSync(file, text, 'utf8');
    console.log('updated', path.relative(ROOT, file));
    changed++;
  }
}
console.log('Done.', changed, 'files');
