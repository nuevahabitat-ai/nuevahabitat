import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');
const needle = `            <div class="dash-panel-body" id="dash-comp-list"><div class="dash-empty">Cargando…</div></div>
          </div>
        </div>

        <div class="adm-card dash-hoy-toca"`;
const insert = `            <div class="dash-panel-body" id="dash-comp-list"><div class="dash-empty">Cargando…</div></div>
          </div>
          <div class="dash-panel">
            <div class="dash-panel-head">
              <h3>Últimos leads</h3>
              <button type="button" class="dash-panel-link" onclick="switchSection('leads')">Ver todos</button>
            </div>
            <div class="dash-panel-body" id="dash-leads-list"><div class="dash-empty">Cargando…</div></div>
          </div>
        </div>

        <div class="adm-card dash-hoy-toca"`;
if (s.includes(needle)) {
  s = s.replace(needle, insert);
}
const bottom = `<div class="dash-panel dash-panel--leads-bottom" style="margin-bottom:1rem">
          <div class="dash-panel-head">
            <h3>Últimos leads</h3>
            <button type="button" class="dash-panel-link" onclick="switchSection('leads')">Ver todos</button>
          </div>
          <div class="dash-panel-body" id="dash-leads-list"><div class="dash-empty">Cargando…</div></div>
        </div>

        `;
if (s.includes(bottom)) s = s.replace(bottom, '');
fs.writeFileSync(panel, s);
console.log('dash leads:', (s.match(/dash-leads-list/g) || []).length);
