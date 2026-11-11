/**
 * Asistente IA panel (Gemini + tools servidor).
 */
(function () {
  const STORAGE = 'nh_agent_history_v1';
  let _open = false;

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

  function ensureUi() {
    if (document.getElementById('nh-agent-root')) return;
    const root = document.createElement('div');
    root.id = 'nh-agent-root';
    root.innerHTML = `
      <button type="button" id="nh-agent-fab" class="adm-btn adm-btn-gold" title="Asistente IA Nueva Hábitat" style="position:fixed;bottom:1.25rem;right:1.25rem;z-index:12000;border-radius:999px;padding:.65rem 1rem;box-shadow:0 4px 20px rgba(0,0,0,.35)">✦ Asistente</button>
      <motion id="nh-agent-drawer" style="display:none;position:fixed;right:0;top:0;bottom:0;width:min(420px,100vw);z-index:11999;background:var(--bg-card,#1a1a1a);border-left:1px solid rgba(255,255,255,.08);flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.4)">
      </div>`;
    // fix typo motion -> div
    root.innerHTML = `
      <button type="button" id="nh-agent-fab" class="adm-btn adm-btn-gold" title="Asistente IA Nueva Hábitat" style="position:fixed;bottom:1.25rem;right:1.25rem;z-index:12000;border-radius:999px;padding:.65rem 1rem;box-shadow:0 4px 20px rgba(0,0,0,.35)">✦ Asistente</button>
      <div id="nh-agent-drawer" hidden style="position:fixed;right:0;top:0;bottom:0;width:min(420px,100vw);z-index:11999;background:var(--bg-card,#1a1a1a);border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.4)">
        <div style="padding:.85rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;align-items:center">
          <strong style="font-size:.9rem">Asistente NH</strong>
          <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" id="nh-agent-close">✕</button>
        </div>
        <div id="nh-agent-messages" style="flex:1;overflow:auto;padding:1rem;font-size:.82rem;line-height:1.45"></div>
        <div style="padding:.75rem;border-top:1px solid rgba(255,255,255,.08)">
          <textarea id="nh-agent-input" rows="3" class="adm-control" placeholder="Ej.: Busca comprador Ramon y completa criterios desde sus notas…" style="width:100%;font-size:.82rem;margin-bottom:.5rem"></textarea>
          <button type="button" class="adm-btn adm-btn-gold adm-btn-sm" id="nh-agent-send">Enviar</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    document.getElementById('nh-agent-fab').onclick = () => toggleAgent(true);
    document.getElementById('nh-agent-close').onclick = () => toggleAgent(false);
    document.getElementById('nh-agent-send').onclick = () => sendAgentMessage();
    document.getElementById('nh-agent-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendAgentMessage();
    });
    renderMessages(loadHistory());
  }

  function toggleAgent(on) {
    ensureUi();
    _open = on !== undefined ? on : !_open;
    const d = document.getElementById('nh-agent-drawer');
    if (d) d.hidden = !_open;
  }

  function renderMessages(history) {
    const el = document.getElementById('nh-agent-messages');
    if (!el) return;
    if (!history.length) {
      el.innerHTML =
        '<p class="text-muted">Pregunta o pide acciones en compradores y seguimientos. Usa la sección abierta como contexto.</p>';
      return;
    }
    el.innerHTML = history
      .map(
        (m) =>
          `<div style="margin-bottom:.75rem"><span class="text-muted" style="font-size:.68rem">${m.role === 'user' ? 'Tú' : 'Asistente'}</span><p style="margin:.25rem 0 0;white-space:pre-wrap">${escapeHtml(m.content)}</p></div>`,
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

  async function sendAgentMessage() {
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
    nhToast?.('Pensando…', 'info', 4000);
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
      if (typeof loadCompradores === 'function' && /comprador|ficha|criterio/i.test(text)) {
        loadCompradores(true);
      }
    } catch (e) {
      nhToast?.(e.message || 'Error asistente', 'error', 8000);
      history.pop();
      saveHistory(history);
      renderMessages(history);
    }
  }

  window.nhToggleAdminAgent = toggleAgent;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureUi);
  else ensureUi();
})();
