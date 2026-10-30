/**
 * Falla si quedan referencias de honorarios venta antiguos (3.000/3.630) en copy público.
 * node scripts/verify-venta-price-3500.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor', 'agent-tools', 'supabase/migrations']);
const BAD = [
  /\b3630\s*€/,
  /\b3\.630\s*€/,
  /3\.000\s*€\s*\+\s*IVA/,
  /3\.000€\s*\+\s*IVA/,
  /Precio fijo 3\.000€/i,
  /honorarios fijos 3000 euros/i,
  /vendedor:\s*3630/,
  /HONORARIOS_VENDEDOR_IVA\s*=\s*3630/,
  /NH_FEE(?:_EUR)?\s*=\s*3630/,
  /\(3\.000 \+ IVA\)/,
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    if (rel.startsWith('supabase/migrations/')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|json|js|md)$/.test(name) && !name.startsWith('verify-venta') && name !== 'apply-venta-price-3500.js') {
      out.push(p);
    }
  }
  return out;
}

const hits = [];
for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const re of BAD) {
    if (re.test(text)) {
      hits.push({ file: path.relative(ROOT, file), re: re.source });
      break;
    }
  }
}

if (hits.length) {
  console.error('Precio venta antiguo detectado en', hits.length, 'archivo(s):');
  hits.slice(0, 30).forEach((h) => console.error(' -', h.file));
  if (hits.length > 30) console.error(' ... y', hits.length - 30, 'más');
  process.exit(1);
}
console.log('OK: sin referencias 3.000/3.630 en copy público.');
