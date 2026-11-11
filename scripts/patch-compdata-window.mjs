import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const needle = '_compData = data || [];';
const repl = '_compData = data || [];\n      window._compData = _compData;';
if (s.includes(needle) && !s.includes('window._compData = _compData')) {
  s = s.replace(needle, repl);
  fs.writeFileSync(panel, s);
  console.log('window._compData OK');
} else {
  console.log('skip compdata window');
}
