import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
const tag = '<script src="js/admin-rebaja-render-fix.js"></script>';
let s = fs.readFileSync(panel, 'utf8');
if (s.includes('admin-rebaja-render-fix.js') && s.indexOf(tag) < s.indexOf('</body>') - 500) {
  s = s.replace(tag + '\n', '');
  s = s.replace('\n' + tag, '');
}
if (!s.includes('admin-rebaja-render-fix.js')) {
  s = s.replace('</script>\n</body>', `</script>\n${tag}\n</body>`);
  fs.writeFileSync(panel, s);
  console.log('injected rebaja fix script before </body>');
} else {
  console.log('already at end');
}
