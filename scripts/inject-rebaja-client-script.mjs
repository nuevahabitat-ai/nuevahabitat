import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
const tag = '<script src="js/admin-rebaja-idealista-client.js"></script>';
let s = fs.readFileSync(panel, 'utf8');

if (!s.includes('admin-rebaja-idealista-client.js')) {
  s = s.replace(
    '<script src="js/admin-rebaja-render-fix.js"></script>',
    tag + '\n<script src="js/admin-rebaja-render-fix.js"></script>'
  );
  fs.writeFileSync(panel, s);
  console.log('injected idealista client script');
} else {
  console.log('already present');
}
