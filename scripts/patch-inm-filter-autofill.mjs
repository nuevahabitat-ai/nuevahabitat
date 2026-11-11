import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const barOpen = '<div class="adm-filter-bar" id="inm-filter-bar">';
const barForm =
  '<form class="adm-filter-bar" id="inm-filter-bar" autocomplete="off" onsubmit="return false" style="display:flex;flex-wrap:wrap;gap:inherit;align-items:flex-end">';
if (s.includes(barOpen)) {
  s = s.replace(barOpen, barForm);
  s = s.replace(
    /<span class="adm-filter-count" id="inm-filter-count"><\/span>\s*\n\s*<\/div>\s*\n\s*<div class="pub-grid" id="pub-grid">/,
    '<span class="adm-filter-count" id="inm-filter-count"></span>\n          </form>\n\n          <div class="pub-grid" id="pub-grid">'
  );
}

const oldIfZona =
  '<input type="text" id="if-zona" list="if-zona-list" placeholder="Barrio, municipio…"/>';
const newIfZona =
  '<input type="search" id="if-zona" list="if-zona-list" placeholder="Barrio, municipio…" autocomplete="off" autocorrect="off" spellcheck="false" name="nh_inm_zona_filter" data-lpignore="true" data-1p-ignore="true"/>';
if (s.includes(oldIfZona)) s = s.replace(oldIfZona, newIfZona);

fs.writeFileSync(panel, s);
console.log('patch inm-filter-bar + if-zona OK');
