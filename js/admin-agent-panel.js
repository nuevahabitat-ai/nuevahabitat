/**
 * Asistente IA panel — pestaña superior + modal compacto (estilo leads dock).
 */
(function () {
  const STORAGE = 'nh_agent_history_v1';
  let _open = false;
  let _sending = false;

  function sectionContext() {
    const sec =
      typeof currentSection !== 'undefined'
        ? currentSection
        : document.querySelector('.adm-section.active')?.id?.replace('sec-', '');
    const ctx = { section: sec || 'dashboard' };
    if (typeof _compCardModalId !== 'undefined' && _compCardModalId) ctx.compradorId = _compCardModalId;
    if (typeof _partCardModalId !== 'undefined' && _partCardModalId) ctx.particularId = _partCardModalId;
    return ctx;
  }

  function loadHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE) || '[]');
    } catch {
      return [];
    }
  }
  function saveHistory(h) {
    sessionStorage.setItem(STORAGE, JSON.stringify(h.slice(-20)));
  }

  function injectStyles() {
    if (document.getElementById('nh-agent-styles')) return;
    const s = document.createElement('style');
    s.id = 'nh-agent-styles';
    s.textContent = `
.nh-agent-dock{position:fixed;top:3.15rem;right:0;z-index:7355;display:flex;flex-direction:column;align-items:center;gap:.2rem;padding:.55rem .45rem .55rem .65rem;background:rgba(184,147,106,.94);color:#1a1208;border:none;border-radius:10px 0 0 10px;cursor:pointer;box-shadow:-4px 0 18px rgba(0,0,0,.35);font-size:.62rem;font-weight:800;letter-spacing:.06em;line-height:1.15;max-width:3.1rem;text-transform:uppercase}
.nh-agent-dock-icon{font-size:1rem;line-height:1}
.nh-agent-dock[hidden],.nh-agent-dock.is-open{display:none}
#nh-agent-modal.dash-modal{align-items:flex-start;justify-content:flex-end;padding:3.25rem .6rem 1rem}
#nh-agent-modal .dash-modal-backdrop{background:rgba(0,0,0,.45)}
#nh-agent-modal .dash-modal-panel{width:min(400px,100%);max-height:min(72vh,560px);border-color:rgba(184,147,106,.35)}
#nh-agent-modal .dash-modal-head{background:rgba(184,147,106,.08);padding:.85rem 1rem}
#nh-agent-modal .dash-modal-body{padding:.75rem 1rem;font-size:.82rem;line-height:1.45;display:flex;flex-direction:column;gap:.5rem;min-height:180px}
#nh-agent-messages{flex:1;overflow:auto;min-height:120px;max-height:min(42vh,340px)}
.nh-agent-msg{margin-bottom:.65rem}
.nh-agent-msg-label{font-size:.66rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.nh-agent-msg-body{margin:.2rem 0 0;white-space:pre-wrap}
#nh-agent-input{font-size:.82rem;min-height:4.2rem;resize:vertical}
@media (max-width:720px){
  .nh-agent-dock{top:auto;bottom:5.5rem;border-radius:10px 0 0 10px}
  #nh-agent-modal.dash-modal{align-items:flex-end;justify-content:center;padding:.75rem}
}`;
    document.head.appendChild(s);
  }

  function ensureUi() {
    injectStyles();
    if (document.getElementById('nh-agent-root')) return;
    const root = document.createElement('div');
    root.id = 'nh-agent-root';
    root.innerHTML = `
      <button type="button" id="nh-agent-dock" class="nh-agent-dock" aria-label="Abrir asistente IA" title="Asistente IA Nueva Hábitat">
        <span class="nh-agent-dock-icon" aria-hidden="true">✦</span>
        <span>IA</span>
      </button>
      <div id="nh-agent-modal" class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="nh-agent-title" hidden>
        <div class="dash-modal-backdrop" data-nh-agent-minimize></div>
        <div class="dash-modal-panel">
          <div class="dash-modal-head">
            <div>
              <div class="dash-modal-kicker">Panel NH</div>
              <h3 id="nh-agent-title">Asistente</h3>
            </div>
            <button type="button" class="dash-modal-close" id="nh-agent-close" aria-label="Minimizar">×</button>
          </div>
          <div class="dash-modal-body">
            <div id="nh-agent-messages"></div>
            <textarea id="nh-agent-input" rows="3" class="adm-control" placeholder="Ej.: Abre Ramon Ros, infiere criterios y ve compatibles…"></textarea>
          </div>
          <div class="dash-modal-foot">
            <button type="button" class="adm-btn adm-btn-gold adm-btn-sm" id="nh-agent-send" style="flex:1">Enviar</button>
            <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-nh-agent-minimize>Minimizar</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(root);

    document.getElementById('nh-agent-dock').onclick = () => openAgentModal();
    document.getElementById('nh-agent-close').onclick = () => closeAgentModal();
    root.querySelectorAll('[data-nh-agent-minimize]').forEach((el) => {
      el.addEventListener('click', () => closeAgentModal());
    });
    document.getElementById('nh-agent-send').onclick = () => sendAgentMessage();
    const input = document.getElementById('nh-agent-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAgentMessage();
      }
    });
    renderMessages(loadHistory());
  }

  function openAgentModal() {
    ensureUi();
    _open = true;
    const modal = document.getElementById('nh-agent-modal');
    const dock = document.getElementById('nh-agent-dock');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.classList.add('open');
    }
    if (dock) dock.classList.add('is-open');
    setTimeout(() => document.getElementById('nh-agent-input')?.focus(), 80);
  }

  function closeAgentModal() {
    _open = false;
    const modal = document.getElementById('nh-agent-modal');
    const dock = document.getElementById('nh-agent-dock');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('hidden', '');
    }
    if (dock) dock.classList.remove('is-open');
  }

  function toggleAgent(on) {
    ensureUi();
    if (on === true) openAgentModal();
    else if (on === false) closeAgentModal();
    else if (_open) closeAgentModal();
    else openAgentModal();
  }

  function renderMessages(history) {
    const el = document.getElementById('nh-agent-messages');
    if (!el) return;
    if (!history.length) {
      el.innerHTML =
        '<p class="text-muted" style="margin:0">Pide buscar compradores, inferir criterios, anotar o ir a una sección. Uso la vista abierta como contexto.</p>';
      return;
    }
    el.innerHTML = history
      .map(
        (m) =>
          `<div class="nh-agent-msg"><div class="nh-agent-msg-label">${m.role === 'user' ? 'Tú' : 'Asistente'}</div><p class="nh-agent-msg-body">${escapeHtml(m.content)}</p></div>`,
      )
      .join('');
    el.scrollTop = el.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function dedupeActions(actions) {
    const seen = new Set();
    return (actions || []).filter((a) => {
      const k = JSON.stringify(a);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  function applyPanelActions(actions) {
    const list = dedupeActions(actions);
    if (!list.length) return;
    for (const a of list) {
      if (a.type === 'refresh_view' && a.target) {
        const t = a.target;
        if (t === 'dashboard' && typeof loadDashboard === 'function') loadDashboard();
        if (t === 'compradores' && typeof loadCompradores === 'function') loadCompradores(true);
        if (t === 'seguimientos' && typeof loadParticulares === 'function') loadParticulares();
        if (t === 'inmuebles' && typeof loadPublications === 'function') loadPublications();
        if (t === 'leads' && typeof loadLeads === 'function') loadLeads();
      }
      if (a.type === 'goto_section' && a.section && typeof switchSection === 'function') {
        switchSection(a.section);
      }
      if (a.type === 'refresh_compradores' && typeof loadCompradores === 'function') {
        loadCompradores(true);
      }
      if (a.type === 'open_comprador' && a.id) {
        if (typeof switchSection === 'function') switchSection('compradores');
        setTimeout(() => window.openCompCardModal?.(a.id), 350);
      }
      if (a.type === 'compatibles_comprador' && a.id && typeof showCompatiblesForComprador === 'function') {
        if (typeof switchSection === 'function') switchSection('compradores');
        setTimeout(() => showCompatiblesForComprador(a.id), 400);
      }
      if (a.type === 'refresh_particulares') {
        if (typeof loadParticulares === 'function') loadParticulares();
      }
      if (a.type === 'open_particular' && a.id) {
        if (typeof switchSection === 'function') switchSection('seguimientos');
        setTimeout(() => window.openPartCardModal?.(a.id), 350);
      }
    }
  }

  async function sendAgentMessage() {
    if (_sending) return;
    ensureUi();
    const input = document.getElementById('nh-agent-input');
    const text = input?.value?.trim();
    if (!text || !window.nhSupabase) return;
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      nhToast?.('Sesión no disponible', 'error');
      return;
    }
    let history = loadHistory();
    history.push({ role: 'user', content: text });
    renderMessages(history);
    input.value = '';
    _sending = true;
    const sendBtn = document.getElementById('nh-agent-send');
    if (sendBtn) sendBtn.disabled = true;
    nhToast?.('Pensando…', 'info', 3500);
    try {
      const res = await fetch('/api/notify?__action=admin-agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1),
          context: sectionContext(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      history.push({ role: 'assistant', content: json.reply || 'Sin respuesta.' });
      saveHistory(history);
      renderMessages(history);
      applyPanelActions(json.panelActions);
      if (json.panelActions?.length) nhToast?.('Actualicé la vista del panel', 'info', 2500);
      if (json.toolCalls > 0 && !json.panelActions?.length) {
        nhToast?.(`Listo (${json.toolCalls} acción/es en base de datos)`, 'success', 3000);
      }
    } catch (e) {
      nhToast?.(e.message || 'Error asistente', 'error', 8000);
      history.pop();
      saveHistory(history);
      renderMessages(history);
    } finally {
      _sending = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  window.nhToggleAdminAgent = toggleAgent;
  window.nhOpenAdminAgent = openAgentModal;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureUi);
  else ensureUi();
})();
