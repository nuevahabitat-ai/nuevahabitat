import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

s = s.replace(
  'const chVis = cv ? cv.checked : true;',
  'const chVis = cv ? cv.checked : false;'
);
s = s.replace(
  /document\.getElementById\('rebaja-vis-title'\)\.textContent = 'Avisar rebaja a visitantes';/,
  "document.getElementById('rebaja-vis-title').textContent = 'Avisar rebaja — contactos Idealista';"
);

fs.writeFileSync(panel, s);
console.log('rebaja defaults OK');
