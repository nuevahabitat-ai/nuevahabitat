/** Añade enlace e import script al panel sin tocar el HTML gigante a mano. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const panel = path.join(root, 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
let n = 0;

if (!s.includes('admin-idealista-compradores-import.js')) {
  const needle = '<script src="js/admin-leads-notify.js"></script>';
  if (s.includes(needle)) {
    s = s.replace(needle, needle + '\n<script src="js/admin-idealista-compradores-import.js"></script>');
    n++;
  }
}

if (!s.includes('admin-import-idealista')) {
  const marker = '<section class="adm-section" id="sec-compradores">';
  const link = '\n        <p class="text-muted" style="font-size:.75rem;margin:0 0 .75rem"><a href="/admin-import-idealista" style="color:var(--gold)">Importar CSV/Excel Idealista →</a></p>';
  if (s.includes(marker) && !s.includes('admin-import-idealista')) {
    s = s.replace(marker, marker + link);
    n++;
  }
}

if (n) {
  fs.writeFileSync(panel, s, 'utf8');
  console.log('Parches aplicados:', n);
} else {
  console.log('Panel ya tenía los parches o no se encontraron anclas.');
}
