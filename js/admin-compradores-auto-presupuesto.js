/**
 * Compradores: relleno silencioso de precio compraventa desde anuncios Idealista.
 */
(function () {
  const KEY = 'nh_auto_presupuesto_ts';
  const MIN_INTERVAL_MS = 4 * 60 * 1000;
  let inflight = false;

  function needsCompraventa(c) {
    if (!c || c.activo === false) return false;
    if (c.presupuesto_max != null && c.presupuesto_min != null) return false;
    const n = String(c.notas || '');
    if (/idealista/i.test(n) || /\[idealista\s+import\]/i.test(n)) return true;
    if (/idealista\s+\d{6,}/i.test(n)) return true;
    return false;
  }

  async function nhAutoPresupuestoCompradoresOnLoad(compData, opts) {
    if (inflight) return;
    const force = opts?.force === true;
    const list = compData || window._compData || [];
    if (!list.length || !list.some(needsCompraventa)) return;
    const last = parseInt(sessionStorage.getItem(KEY) || '0', 10);
    if (!force && Date.now() - last < MIN_INTERVAL_MS) return;
  if (!window.nhSupabase) return;
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) return;

    inflight = true;
    try {
      const res = await fetch('/api/notify?__action=admin-auto-presupuesto-compradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ maxScrape: 80, limit: 500 }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) return;
      sessionStorage.setItem(KEY, String(Date.now()));
      const n = json.actualizados ?? json.porIdealistaId?.actualizados ?? 0;
      if (n > 0) {
        nhToast?.(
          `Compraventa actualizada en ${n} comprador(es) desde anuncios Idealista.`,
          'success',
          6000,
        );
        if (typeof loadCompradores === 'function') loadCompradores(true);
      }
    } catch (_) {
      /* silencioso */
    } finally {
      inflight = false;
    }
  }

  window.nhAutoPresupuestoCompradoresOnLoad = nhAutoPresupuestoCompradoresOnLoad;
})();