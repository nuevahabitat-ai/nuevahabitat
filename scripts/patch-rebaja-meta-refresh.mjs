import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const needle = `const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, rebajaVisitantesMatchOpts());
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({`;
const repl = `const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, rebajaVisitantesMatchOpts());
    _rebajaVisState.meta = json.meta || null;
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({`;

if (s.includes(needle) && !s.includes('_rebajaVisState.meta = json.meta')) {
  s = s.replace(needle, repl);
  fs.writeFileSync(panel, s);
  console.log('meta refresh patched');
} else {
  console.log('meta refresh skip');
}
