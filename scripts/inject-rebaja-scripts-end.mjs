import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const block = `<script src="js/admin-rebaja-idealista-client.js"></script>
<script src="js/admin-rebaja-render-fix.js"></script>
`;

s = s.replace(/<script src="js\/admin-rebaja-idealista-client\.js"><\/script>\s*/g, '');
s = s.replace(/<script src="js\/admin-rebaja-render-fix\.js"><\/script>\s*/g, '');

if (!s.includes('admin-rebaja-render-fix.js')) {
  s = s.replace('</script>\n</body>', `</script>\n${block}</body>`);
  fs.writeFileSync(panel, s);
  console.log('rebaja scripts at end of body OK');
} else {
  console.log('already OK');
}
