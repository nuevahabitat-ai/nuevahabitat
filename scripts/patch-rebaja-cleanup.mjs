import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const start = s.indexOf('function mergeRebajaCompatibles');
const end = s.indexOf('function rebajaVisitantesMatchOpts');
if (start !== -1 && end !== -1 && start < end) {
  s = s.slice(0, start) + s.slice(end);
}

s = s.replace(
  /^\s*include_compatibles:.*\n/m,
  ''
);

s = s.replace(
  /\s*<label><input type="checkbox" id="rebaja-match-ch-compat"[^]*?Compradores compatibles[^<]*<\/label>\n/,
  '\n'
);

const oldRefresh = `    const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, rebajaVisitantesMatchOpts());
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
const newRefresh = `    const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, rebajaVisitantesMatchOpts());
    _rebajaVisState.meta = json.meta || null;
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
if (s.includes(oldRefresh)) s = s.replace(oldRefresh, newRefresh);

s = s.replace(
  /const compatN = getMatchesForInmueble\(inm, _compData\)\.length;\n\s*const hint/,
  'const hint'
);
s = s.replace(
  /return filters \+ `<p class="text-muted">Ningún contacto con estos filtros\.[\s\S]*?'\+\s*hint \+ '<\/p>' : ''}`;/,
  `return filters + '<p class="text-muted">Ningún contacto Idealista ni visita NH para este piso. Revisa la <strong>ref. Idealista</strong> y vuelve a pulsar <strong>Actualizar lista</strong>. Los del botón 🎯 no son demandas de este anuncio.</p>' + (hint ? '<p class="text-muted" style="font-size:.72rem;margin-top:.5rem">'+hint+'</p>' : '');`
);

s = s.replace(
  /v\.fuente === 'idealista_import' \? ' · Idealista' : v\.fuente === 'idealista_notas' \? ' · Idealista \(notas\)' : v\.fuente === 'compatible' \? ' · Compatible' : ''/,
  "v.fuente === 'idealista_import' ? ' · Idealista' : v.fuente === 'idealista_notas' ? ' · Idealista (notas)' : ''"
);

fs.writeFileSync(panel, s);
console.log('rebaja cleanup OK');
