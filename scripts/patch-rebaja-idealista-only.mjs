import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

// Quitar mezcla "compradores compatibles" (solo demanda Idealista / visitas NH)
s = s.replace(/\nfunction mergeRebajaCompatibles\([\s\S]*?\n}\n\nfunction rebajaVisitantesMatchOpts/, '\nfunction rebajaVisitantesMatchOpts');

s = s.replace(
  /\n\s*include_compatibles: document\.getElementById\('rebaja-match-ch-compat'\)\?\.checked !== false,\n/,
  '\n'
);

s = s.replace(
  /\s*<label><input type="checkbox" id="rebaja-match-ch-compat"[^/]*\/><\/label>\n/,
  '\n'
);

const oldRefresh = `_rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
const newRefresh = `_rebajaVisState.meta = json.meta || null;
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));`;
if (s.includes(oldRefresh) && !s.includes('_rebajaVisState.meta')) {
  s = s.replace(oldRefresh, newRefresh);
}

s = s.replace(
  /return filters \+ `<p class="text-muted">Ningún contacto con estos filtros\.[\s\S]*?'\}<\/p>' : ''}`;/,
  `return filters + '<p class="text-muted">Ningún contacto Idealista o visita NH para este piso. Comprueba la <strong>ref. Idealista</strong>, pulsa <strong>Actualizar lista</strong> y, si importaste el Excel, que exista la migración <strong>066</strong> en Supabase.</p>' + (hint ? '<p class="text-muted" style="font-size:.72rem;margin-top:.5rem">'+hint+'</p>' : '');`
);

s = s.replace(
  /v\.fuente === 'idealista_import' \? ' · Idealista' : v\.fuente === 'idealista_notas' \? ' · Idealista \(notas\)' : v\.fuente === 'compatible' \? ' · Compatible' : ''/,
  "v.fuente === 'idealista_import' ? ' · Idealista' : v.fuente === 'idealista_notas' ? ' · Idealista (notas)' : ''"
);

fs.writeFileSync(panel, s);
console.log('rebaja idealista-only patch OK');
