/**
 * Compradores: completar fichas desde cuestionarios Alfredo (notas + interés).
 */
(async function () {
  async function nhSyncAlfredoFichasDesdeNotas() {
    if (!window.nhSupabase) {
      nhToast?.('Sin sesión Supabase', 'error');
      return;
    }
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      nhToast?.('Sesión no disponible', 'error');
      return;
    }
    if (
      !confirm(
        '¿Completar fichas de compradores desde respuestas del cuestionario Alfredo (notas e interés Idealista)?\n\nSolo rellena campos vacíos y añade historial si falta.',
      )
    )
      return;
    nhToast?.('Sincronizando cuestionarios Alfredo…', 'info', 8000);
    try {
      const res = await fetch('/api/notify?__action=admin-enrich-alfredo-fichas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      const s = json.stats || {};
      nhToast?.(
        `Fichas Alfredo: ${s.updated ?? 0} actualizada(s), ${s.skipped ?? 0} sin cambios` +
          (s.errors?.length ? ` · ${s.errors.length} error(es)` : ''),
        s.errors?.length ? 'info' : 'success',
        9000,
      );
      if (typeof loadCompradores === 'function') loadCompradores(true);
    } catch (e) {
      nhToast?.(e.message || 'Error sincronizando', 'error', 8000);
    }
  }

  async function nhInferCriteriosDesdePisos() {
    if (!window.nhSupabase) return;
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      nhToast?.('Sesión no disponible', 'error');
      return;
    }
    if (
      !confirm(
        '¿Inferir criterios desde pisos consultados (Idealista, NH en notas, precios)?\n\nEj.: máx. = precio del piso consultado, mín. = −50.000 €, hab/ascensor si aplica.',
      )
    )
      return;
    nhToast?.('Calculando criterios…', 'info', 8000);
    try {
      const res = await fetch('/api/notify?__action=admin-infer-comprador-criterios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ margen: 50000 }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      const s = json.stats || {};
      nhToast?.(
        `Inferencia pisos: ${s.updated ?? 0} ficha(s), ${s.skipped ?? 0} sin datos` +
          (s.errors?.length ? ` · ${s.errors.length} error(es)` : ''),
        'success',
        9000,
      );
      if (typeof loadCompradores === 'function') loadCompradores(true);
    } catch (e) {
      nhToast?.(e.message || 'Error', 'error', 8000);
    }
  }

  async function nhSyncPresupuestoCompradores() {
    if (!window.nhSupabase) return;
    const {
      data: { session },
    } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      nhToast?.('Sesión no disponible', 'error');
      return;
    }
    if (
      !confirm(
        '¿Rellenar presupuesto máximo desde Idealista / notas?\n\nVincula interés, infiere desde pisos consultados (los sin precio en anuncio pueden quedar pendientes).',
      )
    )
      return;
    nhToast?.('Calculando presupuestos…', 'info', 12000);
    try {
      nhToast?.('Descargando precios Idealista y completando fichas…', 'info', 25000);
      const res = await fetch('/api/notify?__action=admin-sync-presupuesto-compradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ maxScrape: 55 }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      const idealista = json.idealista || {};
      const inf = json.inferencia || {};
      const fc = idealista.fichas || {};
      nhToast?.(
        `Fichas: ${fc.completadas ?? 0}/${fc.total ?? 0} con presupuesto · caché ${idealista.warm?.enCache ?? '?'}/${idealista.warm?.solicitados ?? '?'}. Inferencia extra: ${inf.updated ?? 0} actualizado(s).`,
        'success',
        12000,
      );
      if (typeof loadCompradores === 'function') loadCompradores(true);
    } catch (e) {
      nhToast?.(e.message || 'Error', 'error', 8000);
    }
  }

  window.nhSyncAlfredoFichasDesdeNotas = nhSyncAlfredoFichasDesdeNotas;
  window.nhInferCriteriosDesdePisos = nhInferCriteriosDesdePisos;
  window.nhSyncPresupuestoCompradores = nhSyncPresupuestoCompradores;

  function injectBtn() {
    const hdr = document.querySelector('#sec-compradores .adm-section-hdr');
    if (!hdr || hdr.querySelector('[data-nh-alfredo-fichas]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adm-btn adm-btn-ghost';
    btn.dataset.nhAlfredoFichas = '1';
    btn.textContent = '↻ Cuestionarios Alfredo';
    btn.title = 'Completa criterios e historial desde respuestas WhatsApp guardadas en notas';
    btn.onclick = () => nhSyncAlfredoFichasDesdeNotas();
    const btn2 = document.createElement('button');
    btn2.type = 'button';
    btn2.className = 'adm-btn adm-btn-ghost';
    btn2.textContent = '◎ Criterios desde pisos';
    btn2.title = 'Precio min/max, hab., ascensor… desde anuncios que han contactado';
    btn2.onclick = () => nhInferCriteriosDesdePisos();
    const btn3 = document.createElement('button');
    btn3.type = 'button';
    btn3.className = 'adm-btn adm-btn-ghost';
    btn3.textContent = '€ Presupuestos Idealista';
    btn3.title = 'presupuesto_max desde anuncio consultado (idealista / NH vinculado)';
    btn3.onclick = () => nhSyncPresupuestoCompradores();
    const gold = hdr.querySelector('.adm-btn-gold');
    if (gold) {
      hdr.insertBefore(btn3, gold);
      hdr.insertBefore(btn2, gold);
      hdr.insertBefore(btn, gold);
    } else hdr.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectBtn);
  else injectBtn();
})();
