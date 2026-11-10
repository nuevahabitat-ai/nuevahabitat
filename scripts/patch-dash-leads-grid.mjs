import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const leadsBlock = `
          <div class="dash-panel">
            <div class="dash-panel-head">
              <h3>Últimos leads</h3>
              <button type="button" class="dash-panel-link" onclick="switchSection('leads')">Ver todos</button>
            </div>
            <div class="dash-panel-body" id="dash-leads-list"><div class="dash-empty">Cargando…</div></div>
          </div>`;

if (!s.includes('dash-grid--principal') || (s.match(/id="dash-leads-list"/g) || []).length > 1) {
  // quitar bloque inferior duplicado
  s = s.replace(
    /\s*<div class="dash-panel dash-panel--leads-bottom"[\s\S]*?id="dash-leads-list"[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n/,
    '\n'
  );
}

if (!s.includes('dash-comp-list') || s.includes(leadsBlock.trim())) {
  // ya
} else if (s.includes('id="dash-comp-list"')) {
  s = s.replace(
    /(<div class="dash-panel-body" id="dash-comp-list">[\s\S]*?<\/div>\s*)\n(\s*)<\/div>\s*\n(\s*)<\/div>\s*\n(\s*)<div class="adm-card dash-hoy-toca"/,
    `$1
$2</div>${leadsBlock}
$3</div>

$4<div class="adm-card dash-hoy-toca"`
  );
}

s = s.replace(
  /\s*<div class="dash-panel dash-panel--leads-bottom"[\s\S]*?id="dash-leads-list"[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n/,
  '\n'
);

if (!s.includes('.dash-grid--principal{')) {
  s = s.replace(
    '.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}',
    '.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}\n.dash-grid--principal{margin-bottom:1.25rem}'
  );
}

const n = (s.match(/id="dash-leads-list"/g) || []).length;
if (n !== 1) {
  console.error('expected 1 dash-leads-list, got', n);
  process.exit(1);
}

fs.writeFileSync(panel, s);
console.log('ok: leads al lado de compradores');
