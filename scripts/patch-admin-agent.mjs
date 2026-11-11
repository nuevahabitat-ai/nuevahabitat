import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
const tag = '<script src="js/admin-agent-panel.js"></script>';
let s = fs.readFileSync(panel, 'utf8');
if (!s.includes(tag)) {
  const anchor = '<script src="js/admin-alfredo-ficha-sync.js"></script>';
  if (!s.includes(anchor)) throw new Error('anchor missing');
  s = s.replace(anchor, anchor + '\n' + tag);
  fs.writeFileSync(panel, s);
  console.log('added admin-agent-panel.js');
}
