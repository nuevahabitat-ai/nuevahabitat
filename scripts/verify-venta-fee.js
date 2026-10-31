/**
 * Falla si quedan honorarios de venta obsoletos (3.500 € + IVA) en copy público o defaults rotos.
 * node scripts/verify-venta-fee.js
 */
const fs = require('fs');
const path = require('path');
const { NH_FEE_TOTAL_EUR } = require('./fee-config');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor', 'agent-tools', 'supabase/migrations']);
const SKIP_FILES = new Set([
  'apply-venta-price-3500.js',
  'verify-venta-price-3500.js',
  'apply-scaffold-fee-3630.js',
  'economica-argumentos-batch2.js',
]);

const BAD = [
  /3\.500\s*€\s*\+\s*IVA(?!\s*\(\d)/, // honorarios, no €/m² "3.500 – 4"
  /3\.500€\s*\+\s*IVA/,
  /HONORARIOS_VENDEDOR_IVA\s*=\s*4235/,
  /NH_FEE(?:_EUR)?\s*=\s*3500/,
  /NH_FEE\s*=\s*3500/,
  /value="4235"/,
];

function isPricePerM2Line(line) {
  return /€\/m²|€\/m2|\d\.\d+\s*[–-]\s*\d/.test(line);
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    if (rel.startsWith('supabase/migrations/')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|json|js|md)$/.test(name) && !SKIP_FILES.has(name)) {
      if (/scripts[/\\]patch-/.test(p) || /scripts[/\\]expand-/.test(p)) continue;
      if (name === 'verify-venta-fee.js') continue;
      out.push(p);
    }
  }
  return out;
}

const hits = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts/') && !rel.includes('scaffold') && rel !== 'scripts/fee-config.js') {
    if (!/apply-venta|verify-venta|scaffold-fee/.test(rel)) continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const re of BAD) {
    if (!re.test(text)) continue;
    const offending = lines.some((line) => re.test(line) && !isPricePerM2Line(line));
    if (offending) {
      hits.push({ file: rel, re: re.source });
      break;
    }
  }
}

if (hits.length) {
  console.error('Honorarios venta obsoletos en', hits.length, 'archivo(s):');
  hits.slice(0, 40).forEach((h) => console.error(' -', h.file));
  if (hits.length > 40) console.error(' ... y', hits.length - 40, 'más');
  process.exit(1);
}
console.log(`OK: sin 3.500 € + IVA en honorarios (estándar vendedor ${NH_FEE_TOTAL_EUR} € IVA incl.).`);
