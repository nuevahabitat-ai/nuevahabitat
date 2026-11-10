import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const tag = '<script src="js/admin-comp-filters-autofill.js"></script>';
if (!s.includes(tag)) {
  s = s.replace(
    '<script src="js/admin-operaciones-delete.js"></script>',
    '<script src="js/admin-operaciones-delete.js"></script>\n' + tag
  );
}
s = s.replace(
  '<input type="text" id="cf-zona" list="cf-zona-list" placeholder="Eixample, Gràcia…"/>',
  '<input type="search" id="cf-zona" list="cf-zona-list" placeholder="Eixample, Gràcia…" autocomplete="off" autocorrect="off" spellcheck="false" name="nh_comp_zona_filter" data-lpignore="true"/>'
);
fs.writeFileSync(panel, s);
console.log('comp zona autofill fix');
