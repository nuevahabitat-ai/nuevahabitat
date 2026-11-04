/**
 * Falla si quedan honorarios obsoletos (3.000 €, 3.630 € total) en copy público.
 * node scripts/verify-venta-fee.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cursor', 'agent-tools', 'supabase/migrations']);
const SKIP_FILES = new Set([
  'verify-venta-fee.js',
  'normalize-venta-fee-public.js',
  'apply-venta-price-3500.js',
  'apply-scaffold-fee-3630.js',
  'economica-argumentos-batch2.js',
  'seo-expansion-fix-validate.js',
]);

const BAD = [
  /(?<![0-9])3\.000\s*€\s*\+\s*IVA/i,
  /(?<![0-9])3\.000€\s*\+\s*IVA/i,
  /3\.630\s*€/i,
  /3630\s*€/i,
  /3\.630\s*Ôé¼/i,
  /3\.000\s*Ôé¼\s*\+\s*IVA/i,
  /\(3\.630/i,
  /honorarios.*3630/i,
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
    if (name.startsWith('_tmp') || name.startsWith('_prod')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|json|js|md)$/.test(name) && !SKIP_FILES.has(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts/') && !/scaffold|fee-config|build-landings|render-|landing-nh|venta-planes|sync-vender/.test(rel)) {
    continue;
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
  console.error('Copy de honorarios obsoleto en', hits.length, 'archivo(s):');
  hits.slice(0, 50).forEach((h) => console.error(' -', h.file));
  if (hits.length > 50) console.error(' ... y', hits.length - 50, 'más');
  process.exit(1);
}
console.log('OK: sin 3.000 € / 3.630 € en honorarios públicos (usar 3.500 € + IVA).');
