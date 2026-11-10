import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const panel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(panel, 'utf8');

const newRender = `function rebajaVisMatchFiltersHtml(inm){
  const nhRef = String(inm?.ref || '').replace(/"/g,'&quot;');
  const prevIdeal = document.getElementById('rebaja-match-idealista')?.value;
  const idRef = String(prevIdeal != null && prevIdeal !== '' ? prevIdeal : (inm?.idealista_id || '')).replace(/"/g,'&quot;');
  const cv = document.getElementById('rebaja-match-ch-vis');
  const ci = document.getElementById('rebaja-match-ch-ideal');
  const cn = document.getElementById('rebaja-match-ch-nhref');
  const chVis = cv ? cv.checked : true;
  const chIdeal = ci ? ci.checked : true;
  const chNh = cn ? cn.checked : true;
  return \\\`
    <div class="adm-form-grid" style="margin-bottom:.85rem;grid-template-columns:1fr 1fr">
      <div class="adm-field"><label>Ref. NH</label><input type="text" id="rebaja-match-nh-ref" class="adm-control" value="\\\${nhRef}" readonly/></div>
      <div class="adm-field"><label>Ref. Idealista (portal)</label><input type="text" id="rebaja-match-idealista" class="adm-control" value="\\\${idRef}" placeholder="112985423" inputmode="numeric"/></div>
    </div>
    <div style="margin-bottom:.75rem;display:flex;gap:.85rem;flex-wrap:wrap;font-size:.78rem;align-items:center">
      <label><input type="checkbox" id="rebaja-match-ch-vis" \\\${chVis?'checked':''}/> Visitas NH</label>
      <label><input type="checkbox" id="rebaja-match-ch-ideal" \\\${chIdeal?'checked':''}/> Contactos Idealista</label>
      <label><input type="checkbox" id="rebaja-match-ch-nhref" \\\${chNh?'checked':''}/> Por ref. NH</label>
      <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" onclick="refreshRebajaVisitantesModal()">↻ Actualizar lista</button>
    </div>\\\`;
}

function renderRebajaVisitantesList(state){
  const { visitantes, alreadySent, inm, precioAnterior, precioNuevo } = state;
  const filters = rebajaVisMatchFiltersHtml(inm);
  const emailSent = new Set(alreadySent?.email || []);
  const waSent = new Set(alreadySent?.whatsapp || []);
  if(!visitantes.length){
    return filters + '<p class="text-muted">Ningún visitante con estos filtros. Escribe la <strong>ref. Idealista</strong> del portal (aunque aún no esté en la ficha) y pulsa <strong>Actualizar lista</strong>.</p>';
  }
  const rows = visitantes.map(v => {
    const key = rebajaContactKey(v);
    const emOk = !!(v.email || '').trim();
    const waOk = !!normalizePhoneWa(v.telefono);
    const emDone = emailSent.has(key);
    const waDone = waSent.has(key);
    const sub = [v.email, v.telefono].filter(Boolean).join(' · ') || 'Sin contacto';
    const fuente = v.fuente === 'idealista_import' ? ' · Idealista' : '';
    return \\\`<div class="comp-match-row" style="align-items:flex-start">
      <label style="display:flex;gap:.6rem;flex:1;cursor:pointer">
        <input type="checkbox" class="rebaja-vis-cb" data-key="\\\${key.replace(/"/g,'')}" \\\${(emOk || waOk) ? 'checked' : ''} \\\${(!emOk && !waOk) ? 'disabled' : ''}/>
        <span><strong>\\\${(v.nombre || 'Visitante').replace(/</g,'')}</strong><span class="text-muted" style="font-size:.68rem">\\\${fuente}</span><br><span class="text-muted" style="font-size:.72rem">\\\${sub}</span>
        \\\${emDone ? '<br><span class="text-muted" style="font-size:.68rem">✓ Email enviado en esta rebaja</span>' : ''}
        \\\${waDone ? '<br><span class="text-muted" style="font-size:.68rem">✓ WhatsApp registrado en esta rebaja</span>' : ''}
        </span>
      </label>
      \\\${waOk ? \\\`<button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" onclick="sendRebajaWaOne('\\\${v.visita_id}')">WA</button>\\\` : ''}
    </div>\\\`;
  }).join('');
  return filters + \\\`
    <p class="text-muted" style="font-size:.8rem;margin-bottom:.75rem">\\\${visitantes.length} visitante(s) · Rebaja \\\${Number(precioAnterior).toLocaleString('es-ES')} → \\\${Number(precioNuevo).toLocaleString('es-ES')} €</p>
    <div class="comp-match-toolbar" style="margin-bottom:.65rem">
      <label><input type="checkbox" id="rebaja-ch-email" checked/> Enviar email (Resend)</label>
      <label style="margin-left:1rem"><input type="checkbox" id="rebaja-ch-wa" checked/> Abrir WhatsApp</label>
    </div>
    <div class="comp-match-list">\\\${rows}</div>\\\`;
}`;

const start = s.indexOf('function renderRebajaVisitantesList(state){');
const end = s.indexOf('async function refreshRebajaVisitantesModal()', start);
if (start < 0 || end < 0) {
  console.error('anchors not found');
  process.exit(1);
}
s = s.slice(0, start) + newRender + '\n\n' + s.slice(end);

const openOld = `async function openRebajaVisitantesModal(inmuebleId, precioAnterior, precioNuevo){
  if(!window.nhSupabase) return;
  await fetchPubData();
  const inm = _pubData.find(x => x.id === inmuebleId);
  if(!inm){ nhToast('Inmueble no encontrado.', 'error'); return; }
  const prev = precioAnterior != null ? Number(precioAnterior) : Number(inm.precio_anterior);
  const nuevo = precioNuevo != null ? Number(precioNuevo) : Number(inm.precio);
  if(!prev || !nuevo || nuevo >= prev){
    nhToast('Este inmueble no tiene rebaja activa (precio anterior > precio actual).', 'info');
    return;
  }`;

const openNew = `async function openRebajaVisitantesModal(inmuebleId, precioAnterior, precioNuevo){
  if(!window.nhSupabase) return;
  await fetchPubData();
  let inm = _pubData.find(x => x.id === inmuebleId);
  if(!inm){
    const { data } = await window.nhSupabase.from('inmuebles').select('id,ref,titulo,precio,precio_anterior,barrio,municipio,idealista_id').eq('id', inmuebleId).maybeSingle();
    inm = data;
  }
  if(!inm){ nhToast('Inmueble no encontrado.', 'error'); return; }
  const prev = precioAnterior != null ? Number(precioAnterior) : Number(inm.precio_anterior);
  const nuevo = precioNuevo != null ? Number(precioNuevo) : Number(inm.precio);
  if(precioAnterior == null && precioNuevo == null && (!prev || !nuevo || nuevo >= prev)){
    nhToast('Para avisar rebaja, primero baja el precio o indica precio anterior y nuevo.', 'info');
    return;
  }`;

if (s.includes(openOld)) s = s.replace(openOld, openNew);

fs.writeFileSync(panel, s, 'utf8');
console.log('rebaja refs UI ok');
