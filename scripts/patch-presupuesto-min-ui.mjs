import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

if (!s.includes('id="c-presupuesto-min"')) {
  s = s.replace(
    '<div class="adm-field"><label>Presupuesto máximo (€)</label><input type="number" id="c-presupuesto" placeholder="300000"/></div>',
    `<div class="adm-field"><label>Presupuesto mínimo (€)</label><input type="number" id="c-presupuesto-min" placeholder="250000" step="1000"/><small class="text-muted" style="font-size:.68rem">Inferido: ~50.000 € bajo el máx. de pisos consultados</small></div>
            <div class="adm-field"><label>Presupuesto máximo (€)</label><input type="number" id="c-presupuesto" placeholder="300000"/></div>`,
  );
}
if (!s.includes('presupuesto_min:')) {
  s = s.replace(
    'presupuesto_max:  parseFloat(document.getElementById(\'c-presupuesto\').value)||null,',
    `presupuesto_min:  parseFloat(document.getElementById('c-presupuesto-min')?.value) || null,
    presupuesto_max:  parseFloat(document.getElementById('c-presupuesto').value)||null,`,
  );
}
if (!s.includes("getElementById('c-presupuesto-min')")) {
  s = s.replace(
    "document.getElementById('c-presupuesto').value = c.presupuesto_max || '';",
    "document.getElementById('c-presupuesto-min').value = c.presupuesto_min ?? '';\n  document.getElementById('c-presupuesto').value = c.presupuesto_max || '';",
  );
}
if (!s.includes("['Presupuesto mín.'")) {
  s = s.replace(
    "['Presupuesto máx.', c.presupuesto_max != null ? Number(c.presupuesto_max).toLocaleString('es-ES') + ' €' : '—'],",
    `['Presupuesto mín.', c.presupuesto_min != null ? Number(c.presupuesto_min).toLocaleString('es-ES') + ' €' : '—'],
    ['Presupuesto máx.', c.presupuesto_max != null ? Number(c.presupuesto_max).toLocaleString('es-ES') + ' €' : '—'],`,
  );
}
if (!s.includes('presupuesto_min,') && s.includes('presupuesto_max,tipo_inmueble')) {
  s = s.replaceAll(
    'presupuesto_max,tipo_inmueble',
    'presupuesto_min,presupuesto_max,tipo_inmueble',
  );
}
if (s.includes('if(c.presupuesto_max) parts.push')) {
  s = s.replace(
    'if(c.presupuesto_max) parts.push(`≤ ${Number(c.presupuesto_max).toLocaleString(\'es-ES\')} €`);',
    `if(c.presupuesto_min != null && c.presupuesto_max != null) parts.push(\`\${Number(c.presupuesto_min).toLocaleString('es-ES')}–\${Number(c.presupuesto_max).toLocaleString('es-ES')} €\`);
  else if(c.presupuesto_max) parts.push(\`≤ \${Number(c.presupuesto_max).toLocaleString('es-ES')} €\`);`,
  );
}

fs.writeFileSync(panel, s);
console.log('patch presupuesto_min ui ok');
