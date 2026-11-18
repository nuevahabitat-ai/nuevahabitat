#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'admin-panel.html');
let s = fs.readFileSync(file, 'utf8');
let n = 0;

function must(replace) {
  if (!replace.ok) {
    console.error('FAIL:', replace.label);
    process.exit(1);
  }
  n++;
}

function rep(label, from, to) {
  if (!s.includes(from)) {
    if (s.includes(to.slice(0, Math.min(40, to.length)))) {
      return { ok: true, label: `${label} (ya aplicado)` };
    }
    console.error('Missing anchor:', label);
    return { ok: false, label };
  }
  s = s.replace(from, to);
  return { ok: true, label };
}

must(
  rep(
    'subtab',
    `<button class="adm-subtab active" id="tab-pub" onclick="showInmTab('pub')">📋 Publicaciones</button>
          <button class="adm-subtab" id="tab-new" onclick="showInmTab('new')">+ Nuevo inmueble</button>`,
    `<button class="adm-subtab active" id="tab-pub" onclick="showInmTab('pub')">📋 Publicaciones</button>
          <button class="adm-subtab" id="tab-idealista" onclick="showInmTab('idealista')">🔗 ID Idealista</button>
          <button class="adm-subtab" id="tab-new" onclick="showInmTab('new')">+ Nuevo inmueble</button>`,
  ),
);

must(
  rep(
    'panel-html',
    `        </div>

        <!-- Wizard -->
        <div id="inm-new" style="display:none">`,
    `        </div>

        <!-- Vinculación Idealista (export contactos) -->
        <div id="inm-idealista" style="display:none">
          <p class="text-muted" style="font-size:.82rem;line-height:1.55;margin:0 0 1rem;max-width:52rem">
            Guarda el <strong>ID numérico</strong> del anuncio en Idealista (URL <code>…/inmueble/<strong>112985423</strong>/</code>).
            Al importar el CSV/Excel en <strong>Compradores → Importar</strong>, cada contacto se cruza con el inmueble NH que tenga ese ID.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:1rem">
            <span class="text-muted" id="inm-idl-stats">—</span>
            <select id="inm-idl-filter" class="adm-control" style="width:auto;min-width:11rem" onchange="renderInmIdealistaTab()">
              <option value="todos">Todos los inmuebles</option>
              <option value="sin">Sin ID Idealista</option>
              <option value="con">Con ID vinculado</option>
            </select>
            <input type="search" id="inm-idl-search" class="adm-control" placeholder="Buscar ref. o título…" style="min-width:200px;flex:1;max-width:320px" oninput="renderInmIdealistaTab()"/>
            <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" onclick="document.getElementById('inm-idl-search').value='';document.getElementById('inm-idl-filter').value='sin';renderInmIdealistaTab()">Ver sin ID</button>
            <a href="/admin-import-idealista" class="adm-btn adm-btn-gold adm-btn-sm" style="text-decoration:none">Importar contactos Idealista</a>
          </div>
          <div id="inm-idl-table-wrap" class="adm-table-wrap" style="overflow:auto"></div>
        </div>

        <!-- Wizard -->
        <div id="inm-new" style="display:none">`,
  ),
);

must(
  rep(
    'wizard-field',
    `<div class="adm-field">
                    <label>Referencia</label>
                    <input type="text" id="w-ref" placeholder="Auto-generada"/>
                  </div>
                  <div class="adm-field">
                    <label>Tipo *</label>`,
    `<div class="adm-field">
                    <label>Referencia</label>
                    <input type="text" id="w-ref" placeholder="Auto-generada"/>
                  </div>
                  <div class="adm-field">
                    <label for="w-idealista-id">ID Idealista</label>
                    <input type="text" id="w-idealista-id" inputmode="numeric" placeholder="112985423"/>
                    <p class="text-muted" style="font-size:.68rem;margin-top:.25rem;line-height:1.35">Mismo ID que en el export de contactos del portal.</p>
                  </div>
                  <div class="adm-field">
                    <label>Tipo *</label>`,
  ),
);

must(
  rep(
    'showInmTab',
    `function showInmTab(t, keepState){
  document.getElementById('inm-pub').style.display = t==='pub'?'block':'none';
  document.getElementById('inm-new').style.display = t==='new'?'block':'none';
  document.getElementById('tab-pub').classList.toggle('active', t==='pub');
  document.getElementById('tab-new').classList.toggle('active', t==='new');
  if(t==='pub' && !keepState){
    _fromParticularId = null;
    setWizFromParticularBanner(null);
  }
  if(t==='new' && !keepState) resetWizard();
}`,
    `function showInmTab(t, keepState){
  document.getElementById('inm-pub').style.display = t==='pub'?'block':'none';
  document.getElementById('inm-idealista').style.display = t==='idealista'?'block':'none';
  document.getElementById('inm-new').style.display = t==='new'?'block':'none';
  document.getElementById('tab-pub').classList.toggle('active', t==='pub');
  document.getElementById('tab-idealista').classList.toggle('active', t==='idealista');
  document.getElementById('tab-new').classList.toggle('active', t==='new');
  if(t==='idealista') renderInmIdealistaTab();
  if(t==='pub' && !keepState){
    _fromParticularId = null;
    setWizFromParticularBanner(null);
  }
  if(t==='new' && !keepState) resetWizard();
}`,
  ),
);

if (!s.includes('function renderInmIdealistaTab')) {
  const anchor = `/* ═══════════════════════════════════════════════════════════════
   WIZARD`;
  const block = `/* ── ID Idealista (inmuebles) ─────────────────────────────── */
function inmIdealistaTabVisible(){
  const el = document.getElementById('inm-idealista');
  return el && el.style.display !== 'none';
}
function renderInmIdealistaTab(){
  const wrap = document.getElementById('inm-idl-table-wrap');
  const stats = document.getElementById('inm-idl-stats');
  if(!wrap) return;
  const data = _pubData || [];
  const con = data.filter(p => nhNormalizeIdealistaId(p.idealista_id)).length;
  const sin = data.length - con;
  if(stats) stats.textContent = data.length ? \`\${con} con ID · \${sin} sin vincular\` : 'Carga inmuebles desde Publicaciones…';
  const q = (document.getElementById('inm-idl-search')?.value || '').trim().toLowerCase();
  const fil = document.getElementById('inm-idl-filter')?.value || 'todos';
  let list = data.slice().sort((a,b) => String(a.ref||'').localeCompare(String(b.ref||''), 'es'));
  if(fil === 'sin') list = list.filter(p => !nhNormalizeIdealistaId(p.idealista_id));
  if(fil === 'con') list = list.filter(p => nhNormalizeIdealistaId(p.idealista_id));
  if(q) list = list.filter(p => [p.ref,p.titulo,p.municipio,p.barrio,String(p.idealista_id||'')].join(' ').toLowerCase().includes(q));
  if(!list.length){
    wrap.innerHTML = '<p class="text-muted" style="padding:1rem 0">Ningún inmueble coincide.</p>';
    return;
  }
  const rows = list.map(p => {
    const id = p.id;
    const iid = dashEsc(p.idealista_id || '');
    const ref = dashEsc(p.ref || '—');
    const tit = dashEsc((p.titulo || '').slice(0, 72));
    const est = dashEsc(p.estado || '');
    const link = nhNormalizeIdealistaId(p.idealista_id);
    const linkBtn = link ? \`<a href="https://www.idealista.com/inmueble/\${link}/" target="_blank" rel="noopener" class="adm-btn adm-btn-ghost adm-btn-sm">Ver anuncio</a>\` : '';
    return \`<tr>
      <td style="white-space:nowrap;font-weight:600;color:var(--gold)">\${ref}</td>
      <td style="max-width:280px">\${tit}</td>
      <td><span class="badge badge-warn" style="font-size:.65rem">\${est}</span></td>
      <td><input type="text" class="adm-control" id="inm-idl-\${id}" value="\${iid}" placeholder="112985423" inputmode="numeric" style="min-width:9.5rem" onkeydown="if(event.key==='Enter'){event.preventDefault();saveInmIdealistaId('\${id}')}"/></td>
      <td style="white-space:nowrap;display:flex;gap:.35rem;flex-wrap:wrap;align-items:center">
        <button type="button" class="adm-btn adm-btn-gold adm-btn-sm" onclick="saveInmIdealistaId('\${id}')">Guardar</button>
        \${linkBtn}
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" onclick="editProperty('\${id}')">Editar</button>
      </td>
    </tr>\`;
  }).join('');
  wrap.innerHTML = \`<table class="adm-table" style="width:100%;font-size:.82rem"><thead><tr>
    <th>Ref. NH</th><th>Título</th><th>Estado</th><th>ID Idealista</th><th>Acciones</th>
  </tr></thead><tbody>\${rows}</tbody></table>\`;
}
async function saveInmIdealistaId(inmuebleId){
  if(!window.nhSupabase) return;
  const inp = document.getElementById('inm-idl-' + inmuebleId);
  const id = nhNormalizeIdealistaId(inp?.value);
  const payload = { idealista_id: id, updated_at: new Date().toISOString() };
  const { error } = await window.nhSupabase.from('inmuebles').update(payload).eq('id', inmuebleId);
  if(error){
    const msg = /unique|duplicate|23505/i.test(error.message) ? 'Ese ID ya está en otro inmueble NH.' : error.message;
    nhToast('No se guardó: ' + msg, 'error');
    return;
  }
  const p = (_pubData || []).find(x => x.id === inmuebleId);
  if(p) p.idealista_id = id;
  nhToast(id ? \`ID Idealista \${id} vinculado a \${p?.ref || 'inmueble'}.\` : 'ID Idealista quitado.', 'success');
  renderPublications();
  if(inmIdealistaTabVisible()) renderInmIdealistaTab();
}
window.saveInmIdealistaId = saveInmIdealistaId;
window.renderInmIdealistaTab = renderInmIdealistaTab;

`;
  if (!s.includes(anchor)) {
    console.error('Wizard anchor missing');
    process.exit(1);
  }
  s = s.replace(anchor, block + anchor);
  n++;
}

must(
  rep(
    'payload',
    `      destacado:        chk('w-destacado'),
      propietario_nombre:   txt('w-prop-nombre'),`,
    `      destacado:        chk('w-destacado'),
      idealista_id:     nhNormalizeIdealistaId(txt('w-idealista-id')),
      propietario_nombre:   txt('w-prop-nombre'),`,
  ),
);

must(
  rep(
    'load-edit',
    `  document.getElementById('w-ref').value = p.ref || '';
  document.getElementById('w-titulo').value = p.titulo || '';`,
    `  document.getElementById('w-ref').value = p.ref || '';
  const wIdeal = document.getElementById('w-idealista-id');
  if(wIdeal) wIdeal.value = p.idealista_id || '';
  document.getElementById('w-titulo').value = p.titulo || '';`,
  ),
);

must(
  rep(
    'loadpub-callback',
    `  renderPublications();
}`,
    `  renderPublications();
  if(inmIdealistaTabVisible && inmIdealistaTabVisible()) renderInmIdealistaTab();
}`,
  ),
);

// Only patch first loadPublications end - find more specific
if (!s.includes('inmIdealistaTabVisible()')) {
  const needle = `  _pubData = data || [];
  renderPublications();
`;
  const count = (s.match(/_pubData = data \|\| \[\];\s*\n  renderPublications\(\);/g) || []).length;
  if (count >= 1 && s.includes(needle)) {
    s = s.replace(
      needle,
      `  _pubData = data || [];
  renderPublications();
  if(typeof inmIdealistaTabVisible === 'function' && inmIdealistaTabVisible()) renderInmIdealistaTab();
`,
    );
    n++;
  }
}

must(
  rep(
    'pub-card-badge',
    `          <div class="pub-ref">\${p.ref||'NH'} · \${(p.tipo||'piso').toUpperCase()}</div>`,
    `          <div class="pub-ref">\${p.ref||'NH'} · \${(p.tipo||'piso').toUpperCase()}\${p.idealista_id ? \` · <span title="Vinculado a Idealista" style="color:var(--gold-dim)">ID \${dashEsc(p.idealista_id)}</span>\` : \` · <span title="Sin ID — pestaña ID Idealista" style="opacity:.55">Sin ID portal</span>\`}</div>`,
  ),
);

fs.writeFileSync(file, s);
console.log('OK: parches aplicados:', n);