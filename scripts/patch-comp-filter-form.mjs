import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const open = '<div class="adm-filter-bar" id="comp-filter-bar">';
const wrapped = '<form id="comp-filter-form" class="adm-filter-bar" id="comp-filter-bar" autocomplete="off" onsubmit="return false" style="display:flex;flex-wrap:wrap;gap:inherit;align-items:flex-end">';
if (s.includes(open) && !s.includes('id="comp-filter-form"')) {
  s = s.replace(open, wrapped);
  s = s.replace(
    /<\/div>\s*\n\s*<!-- Grid de compradores -->/,
    '</form>\n\n        <!-- Grid de compradores -->'
  );
}
// fix duplicate id if we messed up
s = s.replace(
  'class="adm-filter-bar" id="comp-filter-bar" autocomplete',
  'id="comp-filter-bar" class="adm-filter-bar" autocomplete'
);
fs.writeFileSync(panel, s);
console.log('comp filter form wrap done');
