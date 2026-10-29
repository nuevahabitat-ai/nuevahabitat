const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['admin-panel.html']);
const NEEDLE = '<script src="js/ga-config.js"></script>';
const INSERT =
  '<script src="js/ga-config.js"></script>\n<script src="js/gtag-init.js"></script>';

function patchFile(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('js/ga-config.js') || c.includes('js/gtag-init.js')) return false;
  c = c.replaceAll(NEEDLE, INSERT);
  fs.writeFileSync(file, c);
  return true;
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(full);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    if (SKIP.has(name)) continue;
    if (patchFile(full)) console.log('patched', path.relative(ROOT, full));
  }
}

walk(ROOT);
