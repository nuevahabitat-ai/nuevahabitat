/**
 * Inmuebles → ID Idealista: auto-vincular IDs del export estadísticas.
 */
(function () {
  async function nhAutoLinkIdealistaEstadisticas(dryRun) {
    if (!window.nhSupabase) return;
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      nhToast?.('Sesión no válida', 'error');
      return;
    }
  const msg = dryRun
      ? 'Simular vínculo automático de IDs Idealista (estadísticas) a inmuebles NH sin ID.'
      : '¿Vincular automáticamente los 5 IDs del export estadísticas a los inmuebles que encajen por título/barrio?\n\nLuego conviene pulsar «€ Compraventa Idealista» en Compradores.';
    if (!confirm(msg)) return;
    nhToast?.(dryRun ? 'Simulando…' : 'Vinculando IDs…', 'info', 20000);
    try {
      const res = await fetch('/api/notify?__action=admin-link-idealista-auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ dryRun: !!dryRun, onlySinId: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      const ok = (json.plan || []).filter((p) => p.inmueble_id && !p.error && !p.skip);
      const lines = ok
        .map((p) => `${p.ref || '—'} ← ${p.idealista_id} (${p.score})`)
        .join('\n');
      nhToast?.(
        `${dryRun ? '[Simulación] ' : ''}Vinculados: ${json.vinculados ?? 0}. ${json.errors?.length ? json.errors[0] : ''}`,
        json.errors?.length ? 'info' : 'success',
        12000,
      );
      if (lines) console.info('Idealista auto-link:\n' + lines);
      if (typeof loadPublications === 'function') loadPublications(true);
      if (typeof renderInmIdealistaTab === 'function' && document.getElementById('inm-idealista')?.style.display !== 'none') {
        renderInmIdealistaTab();
      }
    } catch (e) {
      nhToast?.(e.message || 'Error', 'error', 8000);
    }
  }

  window.nhAutoLinkIdealistaEstadisticas = nhAutoLinkIdealistaEstadisticas;

  function inject() {
    const bar = document.querySelector('#inm-idealista .adm-btn-gold')?.parentElement;
    if (!bar || document.getElementById('inm-idl-auto-link-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'inm-idl-auto-link-btn';
    btn.className = 'adm-btn adm-btn-gold adm-btn-sm';
    btn.textContent = 'Auto-vincular estadísticas';
    btn.title = 'Asigna IDs 113064573, 112923386, 113139927, 113133231, 112928263 por título';
    btn.onclick = () => nhAutoLinkIdealistaEstadisticas(false);
    const sim = document.createElement('button');
    sim.type = 'button';
    sim.className = 'adm-btn adm-btn-ghost adm-btn-sm';
    sim.textContent = 'Vista previa';
    sim.onclick = () => nhAutoLinkIdealistaEstadisticas(true);
    bar.insertBefore(sim, bar.querySelector('.adm-btn-gold'));
    bar.insertBefore(btn, sim);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();