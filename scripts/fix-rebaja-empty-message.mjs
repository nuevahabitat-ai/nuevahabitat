import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const broken =
  'return filters + `<p class="text-muted">Ningún contacto con estos filtros. Los <strong>${compatN} compradores</strong> del botón 🎯 son compatibles por presupuesto; activa <strong>Compradores compatibles</strong> o importa contactos Idealista con ref. <strong>112985423</strong>.</p>${hint ?';
const fixed =
  "const idealRef = (document.getElementById('rebaja-match-idealista')?.value || '').trim() || inm?.idealista_id || '—';\n    return filters + `<p class=\"text-muted\">Ningún contacto para este piso: solo aparecen <strong>visitas NH</strong> o quienes consultaron en Idealista (ref. <strong>${idealRef}</strong>). Importa de nuevo el Excel Idealista o revisa migración 066.</p>${hint ?";

if (s.includes(broken)) {
  s = s.replace(broken, fixed);
} else if (s.includes('compatN')) {
  console.warn('compatN still present, manual check needed');
}

const refreshNeedle = `_rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));
    _rebajaVisState.alreadySent = {`;
const refreshFixed = `_rebajaVisState.meta = json.meta || null;
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));
    _rebajaVisState.alreadySent = {`;

if (s.includes(refreshNeedle) && !s.includes('_rebajaVisState.meta = json.meta')) {
  s = s.replace(refreshNeedle, refreshFixed);
}

fs.writeFileSync(panel, s);
console.log('fix rebaja empty UI OK');
