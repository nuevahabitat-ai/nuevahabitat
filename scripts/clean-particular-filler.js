/**
 * Elimina bloques de relleno «Particular en X (N)» en guías particular.
 * node scripts/clean-particular-filler.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content', 'landings', 'particular');
const FILLER_RE =
  /<h2>Particular en [^<]*\(\d+\)<\/h2>\s*<p>Documentación, visitas filtradas y panel vendedor en vender-como-particular-[^<]+\. Valoración Les Corts 24 h\.<\/p>/g;

let n = 0;
for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const file = path.join(DIR, name);
  const L = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arg = L.argumento_principal || '';
  if (!FILLER_RE.test(arg)) continue;
  FILLER_RE.lastIndex = 0;
  const cleaned = arg.replace(FILLER_RE, '').trim();
  if (cleaned === arg) continue;
  L.argumento_principal = cleaned;
  fs.writeFileSync(file, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('cleaned', name);
  n++;
}
console.log('Done.', n, 'files');
