import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const start = s.indexOf('async function refreshRebajaVisitantesModal(){');
const end = s.indexOf('async function openRebajaVisitantesModal(', start);
if (start < 0 || end < 0) {
  console.error('markers not found');
  process.exit(1);
}

const replacement = `async function refreshRebajaVisitantesModal(){
  if(window.__nhRefreshRebajaVisitantes) return window.__nhRefreshRebajaVisitantes();
  if(!_rebajaVisState) return;
  const body = document.getElementById('rebaja-vis-body');
  if(body) body.innerHTML = '<p class="text-muted">Cargando… (actualiza con Ctrl+F5 si no hay lista)</p>';
}

`;

s = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(panel, s);
console.log('refresh delegates to window.__nhRefreshRebajaVisitantes');
