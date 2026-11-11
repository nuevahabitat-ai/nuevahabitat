import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/** Parche mínimo rebaja: meta en refresh + mensaje vacío (sin tocar StrReplace en el IDE). */
const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

if (!s.includes('_rebajaVisState.meta')) {
  const oldRefresh = `_rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
  const newRefresh = `_rebajaVisState.meta = json.meta || null;
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
  if (s.includes(oldRefresh)) s = s.replace(oldRefresh, newRefresh);
}

if (s.includes('Ningún visitante con estos filtros')) {
  s = s.replace(
    "return filters + '<p class=\"text-muted\">Ningún visitante con estos filtros. Escribe la <strong>ref. Idealista</strong> del portal (aunque aún no esté en la ficha) y pulsa <strong>Actualizar lista</strong>.</p>';",
    `if(!visitantes.length){
    const meta = state.meta;
    const hint = meta ? \`Visitas NH: \${meta.visitas||0} · Idealista (tabla): \${meta.interes||0} · notas import: \${meta.notas||0}\${meta.warn ? ' · '+meta.warn : ''}\` : '';
    return filters + '<p class="text-muted">Ningún contacto Idealista ni visita NH para este piso. Revisa la <strong>ref. Idealista</strong> y pulsa <strong>Actualizar lista</strong>.</p>' + (hint ? '<p class="text-muted" style="font-size:.72rem;margin-top:.5rem">'+hint+'</p>' : '');
  }`
  );
  // remove duplicate if block start was wrong - read file after
}

const oldFuente = `const fuente = v.fuente === 'idealista_import' ? ' · Idealista' : '';`;
if (s.includes(oldFuente)) {
  s = s.replace(
    oldFuente,
    `const fuente = v.fuente === 'idealista_import' ? ' · Idealista' : v.fuente === 'idealista_notas' ? ' · Idealista (notas)' : '';`
  );
}

fs.writeFileSync(panel, s);
console.log('patch rebaja list OK');
