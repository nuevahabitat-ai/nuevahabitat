import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
const tag = '<script src="js/admin-rebaja-sync-btn.js"></script>';
let s = fs.readFileSync(panel, 'utf8');

s = s.replace(/<script src="js\/admin-rebaja-sync-btn\.js"><\/script>\s*/g, '');
if (!s.includes('admin-rebaja-sync-btn.js')) {
  s = s.replace(
    '<script src="js/admin-rebaja-idealista-client.js"></script>',
    '<script src="js/admin-rebaja-idealista-client.js"></script>\n' + tag
  );
}
fs.writeFileSync(panel, s);
console.log('sync script injected');
