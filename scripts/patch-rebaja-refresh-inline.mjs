import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const insertBefore = 'function rebajaVisitantesMatchOpts(){';
const helpers = `
function nhNormalizeIdealistaId(val){
  if(val==null||val==='') return null;
  const s=String(val).trim();
  const d=s.match(/\\d{6,}/);
  if(d) return d[0];
  const n=Number(s);
  return Number.isFinite(n)&&n>0?String(Math.trunc(n)):null;
}
function nhCompradoresMemoriaIdealista(idealistaId){
  const id=nhNormalizeIdealistaId(idealistaId);
  if(!id) return [];
  return (_compData||[]).filter(c=>{
    const n=String(c.notas||'');
    return n.includes(id)&&((c.telefono||'').trim()||(c.email||'').trim());
  }).map(c=>({
    visita_id:'mem:'+c.id+':'+id,
    nombre:c.nombre||'',
    email:c.email||'',
    telefono:c.telefono||'',
    estado:'realizada',
    comprador_id:c.id,
    fuente:'idealista_notas',
  }));
}
function nhMergeRebajaVisitantesLista(apiList, extra){
  const seen=new Set();
  const out=[];
  for(const v of [...(apiList||[]),...(extra||[])]){
    const key=(v.email||'').trim().toLowerCase()||String(v.telefono||'').replace(/\\D/g,'').slice(-9)||v.visita_id;
    if(!key||seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

`;

if (!s.includes('nhCompradoresMemoriaIdealista')) {
  s = s.replace(insertBefore, helpers + insertBefore);
}

const oldRefresh = `async function refreshRebajaVisitantesModal(){
  if(!_rebajaVisState) return;
  const body = document.getElementById('rebaja-vis-body');
  if(body) body.innerHTML = '<p class="text-muted">Cargando visitantes…</p>';
  try {
    const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, rebajaVisitantesMatchOpts());
    _rebajaVisState.visitantes = (json.visitantes || []).map(v => ({
      ...v,
      comprador_id: matchCompradorIdForVisitor(v),
    }));
    _rebajaVisState.alreadySent = {
      email: new Set(json.alreadySent?.email || []),
      whatsapp: new Set(json.alreadySent?.whatsapp || []),
    };
    if(body) body.innerHTML = renderRebajaVisitantesList(_rebajaVisState);
    const foot = document.getElementById('rebaja-vis-foot');
    if(foot){
      foot.innerHTML = \`<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>
        <button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>\`;
    }
  } catch(e){
    if(body) body.innerHTML = \`<p class="text-muted">Error: \${e.message}</p>\`;
  }
}`;

const newRefresh = `async function refreshRebajaVisitantesModal(){
  if(!_rebajaVisState) return;
  const body = document.getElementById('rebaja-vis-body');
  if(body) body.innerHTML = '<p class="text-muted">Cargando contactos Idealista…</p>';
  try {
    if(typeof loadCompradores==='function' && (!_compData||!_compData.length)) await loadCompradores(true);
    const opts = rebajaVisitantesMatchOpts();
    const idealistaId = nhNormalizeIdealistaId(opts.idealista_id || document.getElementById('rebaja-match-idealista')?.value || _rebajaVisState.inm.idealista_id);
    const json = await fetchRebajaVisitantesApi(_rebajaVisState.inm.id, _rebajaVisState.precioNuevo, opts);
    let rows = (json.visitantes || []).map(v => ({ ...v, comprador_id: matchCompradorIdForVisitor(v) }));
    let clientRows = [];
    if(window.nhFetchIdealistaRebajaClient && window.nhSupabase){
      const client = await window.nhFetchIdealistaRebajaClient(window.nhSupabase, _rebajaVisState.inm, opts);
      clientRows = client.visitantes || [];
      if(!clientRows.length && idealistaId && window.nhBackfillIdealistaInteres){
        const bf = await window.nhBackfillIdealistaInteres(idealistaId);
        if(bf?.created>0){
          const again = await window.nhFetchIdealistaRebajaClient(window.nhSupabase, _rebajaVisState.inm, opts);
          clientRows = again.visitantes || [];
          json.meta = { ...(json.meta||{}), backfill: bf };
        } else if(bf) json.meta = { ...(json.meta||{}), backfill: bf };
      }
    }
    const memRows = nhCompradoresMemoriaIdealista(idealistaId);
    rows = nhMergeRebajaVisitantesLista(nhMergeRebajaVisitantesLista(rows, clientRows), memRows);
    _rebajaVisState.meta = {
      ...(json.meta||{}),
      memoria: memRows.length,
      idealistaId,
      total: rows.length,
      hint: rows.length ? '' : 'No hay filas en comprador_inmueble_interes ni notas con Idealista '+idealistaId+'. Vuelve a importar el CSV (Compradores → Importar Idealista).',
    };
    _rebajaVisState.visitantes = rows;
    _rebajaVisState.alreadySent = {
      email: new Set(json.alreadySent?.email || []),
      whatsapp: new Set(json.alreadySent?.whatsapp || []),
    };
    if(body) body.innerHTML = renderRebajaVisitantesList(_rebajaVisState);
    const foot = document.getElementById('rebaja-vis-foot');
    if(foot){
      foot.innerHTML = '<button type="button" class="adm-btn adm-btn-ghost" onclick="closeRebajaVisitantesModal()">Cerrar</button>' +
        (rows.length ? '<button type="button" class="adm-btn adm-btn-gold" onclick="sendRebajaVisitantesBatch()">Enviar avisos</button>' : '') +
        '<button type="button" class="adm-btn adm-btn-ghost" onclick="typeof openIdealistaImportModal===\\'function\\'&&openIdealistaImportModal()">Importar CSV Idealista</button>';
    }
  } catch(e){
    if(body) body.innerHTML = '<p class="text-muted">Error: '+e.message+'</p>';
  }
}`;

if (s.includes('async function refreshRebajaVisitantesModal(){') && !s.includes('nhCompradoresMemoriaIdealista(idealistaId)')) {
  const start = s.indexOf('async function refreshRebajaVisitantesModal(){');
  const end = s.indexOf('async function openRebajaVisitantesModal(', start);
  if (start >= 0 && end > start) {
    s = s.slice(0, start) + newRefresh + '\n\n' + s.slice(end);
    fs.writeFileSync(panel, s);
    console.log('refreshRebajaVisitantesModal replaced inline');
  }
} else {
  console.log('skip refresh patch', s.includes('nhCompradoresMemoriaIdealista(idealistaId)'));
}

const emptyOld =
  'Ningún contacto para este piso: solo aparecen <strong>visitas NH</strong> o quienes consultaron en Idealista';
if (s.includes(emptyOld)) {
  s = s.replace(
    emptyOld,
    '<strong>Sin contactos Idealista</strong> para este anuncio (ref. en el campo). Importa el CSV de Idealista con el botón del pie del modal'
  );
  fs.writeFileSync(panel, s);
  console.log('empty message updated');
}
