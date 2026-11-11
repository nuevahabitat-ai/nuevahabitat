import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const panel = path.join(root, 'admin-panel.html');
const tag = '<script src="js/admin-alfredo-ficha-sync.js"></script>';
let s = fs.readFileSync(panel, 'utf8');
if (!s.includes(tag)) {
  const anchor = '<script src="js/admin-idealista-compradores-import.js"></script>';
  if (!s.includes(anchor)) throw new Error('anchor not found');
  s = s.replace(anchor, anchor + '\n' + tag);
  fs.writeFileSync(panel, s);
  console.log('added admin-alfredo-ficha-sync.js');
} else console.log('skip alfredo ficha sync');
