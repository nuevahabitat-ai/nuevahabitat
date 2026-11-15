import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const tag = '<script src="js/idealista-import-chunks.js"></script>';
if (!s.includes(tag)) {
  s = s.replace(
    '<script src="js/admin-idealista-compradores-import.js"></script>',
    tag + '\n<script src="js/admin-idealista-compradores-import.js"></script>'
  );
  fs.writeFileSync(panel, s);
  console.log('added chunks script');
}
