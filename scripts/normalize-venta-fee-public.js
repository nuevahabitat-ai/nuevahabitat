/**
 * Normaliza copy pública de honorarios venta: 3.500 € + IVA, sin totales con IVA incluido.
 * node scripts/normalize-venta-fee-public.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor', 'agent-tools']);
const SKIP_FILES = new Set([
  'normalize-venta-fee-public.js',
  'apply-venta-price-3500.js',
  'savings-calculator.js',
]);

/** Orden: patrones largos primero */
const REPLACEMENTS = [
  [/3\.000\s*Ôé¼\s*\+\s*IVA\s*\([^)]*\)/gi, '3.500 € + IVA'],
  [/3\.000\s*Ôé¼\s*\+\s*IVA/gi, '3.500 € + IVA'],
  [/3\.630\s*Ôé¼/gi, '3.500 € + IVA'],
  [/3\.630\s*Ôé¼/gi, '3.500 € + IVA'],
  [/3000\s*mas\s*IVA\s*3630/gi, '3500 mas IVA'],
  [/3630\s*euros?\s*en\s*escritura/gi, '3500 euros mas IVA'],
  [/3000\s*euros?\s*mas\s*IVA/gi, '3500 euros mas IVA'],
  [/3\.000\s*€\s*\+\s*IVA\s*\([^)]*\)/gi, '3.500 € + IVA'],
  [/3\.000€\s*\+\s*IVA\s*\([^)]*\)/gi, '3.500 € + IVA'],
  [/3\.500\s*€\s*\+\s*IVA\s*\([^)]*\)/gi, '3.500 € + IVA'],
  [/3\.500€\s*\+\s*IVA\s*\([^)]*\)/gi, '3.500 € + IVA'],
  [/3\.000&nbsp;€&nbsp;\+&nbsp;IVA\s*\([^)]*\)/gi, '3.500&nbsp;€&nbsp;+&nbsp;IVA'],
  [/honorarios fijos de 3\.000\s*€/gi, 'honorarios fijos de 3.500 € + IVA'],
  [/Honorarios fijos 3\.000\s*€/gi, 'Honorarios fijos 3.500 € + IVA'],
  [/3\.000&nbsp;€&nbsp;\+&nbsp;IVA/g, '3.500&nbsp;€&nbsp;+&nbsp;IVA'],
  [/3\.000 € \+ IVA/g, '3.500 € + IVA'],
  [/3\.000€ \+ IVA/g, '3.500€ + IVA'],
  [/3\.000€\+IVA/g, '3.500€ + IVA'],
  [/Precio fijo 3\.000€/gi, 'Precio fijo 3.500€ + IVA'],
  [/precio fijo 3\.000€/gi, 'precio fijo 3.500€ + IVA'],
  [/por 3\.000&nbsp;€/g, 'por 3.500&nbsp;€ + IVA'],
  [/por 3\.000 €/g, 'por 3.500 € + IVA'],
  [/Vender: 3\.000€/g, 'Vender: 3.500€ + IVA'],
  [/pagas 3\.000 €/g, 'pagas 3.500 € + IVA'],
  [/pagas 3\.000€/g, 'pagas 3.500 € + IVA'],
  [/3\.000 €, no por/g, '3.500 € + IVA, no por'],
  [/3\.000 € en escritura/g, '3.500 € + IVA'],
  [/3\.000 € solo en/g, '3.500 € + IVA'],
  [/3\.000€ fijos/gi, '3.500€ + IVA'],
  [/agencia 3\.630 €/gi, 'agencia 3.500 € + IVA'],
  [/Honorarios 3\.630 €/gi, 'Honorarios 3.500 € + IVA'],
  [/honorarios 3\.630 €/gi, 'honorarios 3.500 € + IVA'],
  [/· 3\.630 € ·/g, '· 3.500 € + IVA ·'],
  [/6% vs 3\.630 €/g, '6% vs 3.500 € + IVA'],
  [/vs 3\.630 €/g, 'vs 3.500 € + IVA'],
  [/: 3\.630 € en escritura/gi, ': 3.500 € + IVA'],
  [/3\.630 € en escritura/gi, '3.500 € + IVA'],
  [/3\.630 € solo en escritura/gi, '3.500 € + IVA'],
  [/3\.630 € fijos/gi, '3.500 € + IVA'],
  [/<strong>3\.630 €<\/strong>/g, '<strong>3.500 € + IVA</strong>'],
  [/3\.630 €/g, '3.500 € + IVA'],
  [/3\.630&nbsp;€/g, '3.500 € + IVA'],
  [/3\.500 € \+ IVA \+ IVA/g, '3.500 € + IVA'],
  [/3\.500€ \+ IVA \+ IVA/g, '3.500€ + IVA'],
  [/3\.500&nbsp;€&nbsp;\+&nbsp;IVA&nbsp;\+&nbsp;IVA/g, '3.500&nbsp;€&nbsp;+&nbsp;IVA'],
  [/Estándar: 3\.000 € \+ 21% IVA = 3\.630 €/g, 'Estándar: 3.500 € + IVA'],
  [/Solo vendedor · 3\.000 € \+ IVA/g, 'Solo vendedor · 3.500 € + IVA'],
];

function shouldProcess(file) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) return false;
  if (base.startsWith('_tmp') || base.startsWith('_prod')) return false;
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.json', '.js', '.md'].includes(ext)) return false;
  if (ext === '.js' && file.includes(`${path.sep}node_modules${path.sep}`)) return false;
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

const HONORARIO_HINT = /3630|3\.630|3\.000\s*€|3\.000€|3000€ venta|agencia 3\.630/i;

let changed = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, 'utf8');
  if (!HONORARIO_HINT.test(text)) continue;
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
