/**
 * Honorarios venta: 3.500 € + IVA (base 3500; comparativas sin sumar IVA al gasto NH).
 * node scripts/apply-venta-price-3500.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor', 'agent-tools']);
const SKIP_FILES = new Set(['apply-venta-price-3500.js', 'apply-integral-price-599.js']);

const REPLACEMENTS = [
  [/3\.630&nbsp;€/g, '3.500&nbsp;€ + IVA'],
  [/3\.630 €/g, '3.500 € + IVA'],
  [/3630 €/g, '3.500 € + IVA'],
  [/3630€/g, '3.500€ + IVA'],
  [/3\.630€/g, '3.500€ + IVA'],
  [/3\.000&nbsp;€&nbsp;\+&nbsp;IVA/g, '3.500&nbsp;€&nbsp;+&nbsp;IVA'],
  [/3\.000 € \+ IVA/g, '3.500 € + IVA'],
  [/3\.000€ \+ IVA/g, '3.500€ + IVA'],
  [/3\.000€\+IVA/g, '3.500€ + IVA'],
  [/Precio fijo 3\.000€/gi, 'Precio fijo 3.500€ + IVA'],
  [/precio fijo 3\.000€/gi, 'precio fijo 3.500€ + IVA'],
  [/por 3\.000&nbsp;€/g, 'por 3.500&nbsp;€ + IVA'],
  [/por 3\.000 €/g, 'por 3.500 € + IVA'],
  [/3\.000€ precio fijo/gi, '3.500€ + IVA precio fijo'],
  [/3\.000€ venta/g, '3.500€ + IVA venta'],
  [/Vender: 3\.000€/g, 'Vender: 3.500€ + IVA'],
  [/pagas 3\.000€/g, 'pagas 3.500 € + IVA'],
  [/pagas 3\.000 €/g, 'pagas 3.500 € + IVA'],
  [/cobrados 3\.000 €/g, 'cobrados 3.500 € + IVA'],
  [/cobra 3\.000 €/g, 'cobra 3.500 € + IVA'],
  [/cobra 3\.000€/g, 'cobra 3.500€ + IVA'],
  [/de 3\.000€/g, 'de 3.500€ + IVA'],
  [/3\.000 €, no por/g, '3.500 € + IVA, no por'],
  [/honorarios fijos de 3\.000€/gi, 'honorarios fijos de 3.500€ + IVA'],
  [/Honorarios fijos 3\.000€/gi, 'Honorarios fijos 3.500€ + IVA'],
  [/honorarios fijos 3\.000€/gi, 'honorarios fijos 3.500€ + IVA'],
  [/3\.000 € fijos/g, '3.500 € + IVA fijos'],
  [/fijos 3\.000 €/g, 'fijos 3.500 € + IVA'],
  [/3\.000 € al cerrar/g, '3.500 € + IVA al cerrar'],
  [/3\.000 € solo en/g, '3.500 € + IVA solo en'],
  [/3\.000 € en escritura/g, '3.500 € + IVA en escritura'],
  [/3\.000 € de honorarios/g, '3.500 € + IVA de honorarios'],
  [/precio-amount">3\.000€/g, 'precio-amount">3.500€ + IVA'],
  [/3\.000 €\s*\+\s*IVA solo en escritura/g, '3.500 € + IVA solo en escritura'],
  [/pagar <strong>3\.630 €<\/strong>/g, 'pagar <strong>3.500 € + IVA</strong>'],
  [/pagar 3\.630 €/g, 'pagar 3.500 € + IVA'],
  [/Honorarios <strong>3\.630 €<\/strong>/g, 'Honorarios <strong>3.500 € + IVA</strong>'],
  [/Honorarios 3\.630 €/g, 'Honorarios 3.500 € + IVA'],
  [/honorarios 3\.630 €/gi, 'honorarios 3.500 € + IVA'],
  [/3\.630 € solo en escritura/gi, '3.500 € + IVA solo en escritura'],
  [/3\.630 € en escritura/gi, '3.500 € + IVA en escritura'],
  [/3\.630 € de honorarios/gi, '3.500 € + IVA de honorarios'],
  [/3\.630 € fijos/gi, '3.500 € + IVA fijos'],
  [/3\.630 € únicamente/gi, '3.500 € + IVA únicamente'],
  [/3\.630 €\./g, '3.500 € + IVA.'],
  [/solo en escritura\.\s*<\/strong>3\.630/g, 'solo en escritura.</strong> 3.500 € + IVA'],
  [/precio fijo 3000 euros/gi, 'precio fijo 3500 euros mas IVA'],
  [/precio fijo 3630/gi, 'precio fijo 3500 mas IVA'],
  [/3\.630 €/g, '3.500 € + IVA'],
  [/3,630 €/g, '3.500 € + IVA'],
  [/vendedor: 3630/g, 'vendedor: 4235'],
  [/HONORARIOS_VENDEDOR_IVA = 3630/g, 'HONORARIOS_VENDEDOR_IVA = 4235'],
  [/value="3630"/g, 'value="4235"'],
  [/NH_FEE_EUR = 3630/g, 'NH_FEE_EUR = 3500'],
  [/NH_FEE = 3630/g, 'NH_FEE = 3500'],
  [/DEFAULTS = \{ comprador: 6050, vendedor: 3630 \}/g, 'DEFAULTS = { comprador: 6050, vendedor: 4235 }'],
  [/vendedor: 3630/g, 'vendedor: 4235'],
  [/3\.500 € \+ IVA \+ IVA/g, '3.500 € + IVA'],
  [/3\.500€ \+ IVA \+ IVA/g, '3.500€ + IVA'],
  [/3\.500&nbsp;€&nbsp;\+&nbsp;IVA&nbsp;\+&nbsp;IVA/g, '3.500&nbsp;€&nbsp;+&nbsp;IVA'],
];

function shouldProcess(file) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) return false;
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.json', '.js', '.md'].includes(ext)) return false;
  if (base.startsWith('tmp-')) return false;
  if (ext === '.md' && !file.includes(`${path.sep}content${path.sep}`)) return false;
  if (ext === '.html' && /tmp-fotocasa/.test(base)) return false;
  return true;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (shouldProcess(p)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, 'utf8');
  if (!/3630|3\.630|3\.000\s*€|3\.000€|3000€ venta/i.test(text)) continue;
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
