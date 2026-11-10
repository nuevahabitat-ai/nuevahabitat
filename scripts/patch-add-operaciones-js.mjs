import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const tag = '<script src="js/admin-operaciones-delete.js"></script>';
if (!s.includes(tag)) {
  s = s.replace(
    '<script src="js/admin-idealista-compradores-import.js"></script>',
    '<script src="js/admin-idealista-compradores-import.js"></script>\n' + tag
  );
  fs.writeFileSync(panel, s);
  console.log('added admin-operaciones-delete.js');
} else console.log('already');
