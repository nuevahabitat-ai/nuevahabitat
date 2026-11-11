import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
const tag = '<script src="js/admin-rebaja-render-fix.js"></script>';
let s = fs.readFileSync(panel, 'utf8');
if (!s.includes('admin-rebaja-render-fix.js')) {
  s = s.replace(
    '<script src="js/admin-comp-filters-autofill.js"></script>',
    '<script src="js/admin-comp-filters-autofill.js"></script>\n' + tag
  );
  fs.writeFileSync(panel, s);
  console.log('injected rebaja fix script');
} else {
  console.log('already injected');
}
