/**
 * Compradores: relleno silencioso de precio compraventa desde anuncios Idealista.
 */
(function () {
  const KEY = 'nh_auto_presupuesto_ts';
  const MIN_INTERVAL_MS = 4 * 60 * 1000;
  let inflight = false;

  function needsSyncAnuncio(c) {
    if (!c || c.activo === false) return false;
    const n = String(c.notas || '');
    const esIdealista =
      /idealista/i.test(n) || /\[idealista\s+import\]/i.test(n) || /idealista\s+\d{6,}/i.test(n);
    if (!esIdealista) return false;
    if (c.presupuesto_max == null || c.presupuesto_min == null) return true;
    if (c.habitaciones_min == null || c.m2_min == null || c.banos_min == null) return true;
    if (c.ascensor == null) return true;
    return false;
  }

  async function nhAutoPresupuestoCompradoresOnLoad(compData, opts) {
    if (inflight) return;
    const force = opts?.force === true;
    const list = compData || window._compData || [];
    if (!list.length || !list.some(needsSyncAnuncio)) return;
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
          `Ficha compraventa y criterios actualizados en ${n} comprador(es) desde el anuncio.`,
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