/**
 * Sincronizar contactos Idealista desde notas (sin reimportar todo el CSV).
 */
(function () {
  async function nhSyncIdealistaSinReimportar() {
    const idealistaId =
      (document.getElementById('rebaja-match-idealista')?.value || '').trim() ||
      _rebajaVisState?.inm?.idealista_id;
    const ref = _rebajaVisState?.inm?.ref;
    if (!idealistaId) {
      window.nhToast?.('Escribe la ref. Idealista en el modal', 'info');
      return;
    }
    const { data: { session } } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) {
      window.nhToast?.('Sesión no válida', 'error');
      return;
    }
    window.nhToast?.('Sincronizando desde notas de compradores…', 'info');
    const res = await fetch('/api/notify?__action=admin-backfill-idealista-interes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.access_token,
      },
      body: JSON.stringify({ idealista_id: idealistaId, inmueble_ref: ref }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      window.nhToast?.(json.error || 'Error al sincronizar', 'error');
      return;
    }
    window.nhToast?.(
      `Listo: ${json.created} vínculos nuevos · ${json.skipped} ya existían · ${json.compradoresScanned} compradores revisados`,
      json.created ? 'success' : 'info',
      8000
    );
    if (typeof window.__nhRefreshRebajaVisitantes === 'function') {
      await window.__nhRefreshRebajaVisitantes();
    }
  }

  window.nhSyncIdealistaSinReimportar = nhSyncIdealistaSinReimportar;

  window.nhImportIdealistaSoloEstaRef = async function () {
    const want =
      (document.getElementById('rebaja-match-idealista')?.value || '').trim() ||
      _rebajaVisState?.inm?.idealista_id;
    const norm = String(want || '').match(/\d{6,}/)?.[0];
    if (!norm) {
      window.nhToast?.('Ref. Idealista vacía', 'info');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt,.xls,.xlsx';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        let rows = [];
        const low = (file.name || '').toLowerCase();
        if (low.endsWith('.csv') || low.endsWith('.txt')) {
          const text = await file.text();
          const sep = (text.slice(0, 500).match(/;/g) || []).length >= (text.match(/,/g) || []).length ? ';' : ',';
          const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
          const headers = lines[0].split(sep).map((h) => h.trim());
          rows = lines.slice(1).map((line) => {
            const cells = line.split(sep);
            const o = {};
            headers.forEach((h, i) => { o[h] = cells[i] != null ? cells[i].trim() : ''; });
            return o;
          });
        } else {
          window.nhToast?.('Para solo esta ref., usa el CSV exportado de Idealista', 'info');
          if (typeof openIdealistaImportModal === 'function') openIdealistaImportModal();
          return;
        }
        const filtered = rows.filter((r) => {
          const ref = String(r['REF. IDEALISTA'] || r['REF IDEALISTA'] || '').replace(/\D/g, '') || String(r['REF. IDEALISTA'] || '');
          return ref.includes(norm) || String(r['REF. IDEALISTA'] || '') === norm;
        });
        if (!filtered.length) {
          window.nhToast?.('Ninguna fila con ref. ' + norm, 'error');
          return;
        }
        const { data: { session } } = await window.nhSupabase.auth.getSession();
        const importFn = window.importIdealistaCompradoresChunked;
        const json = importFn
          ? await importFn(filtered, session.access_token, {})
          : await (async () => {
              const res = await fetch('/api/notify?__action=admin-import-idealista-compradores', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + session.access_token,
                },
                body: JSON.stringify({ rows: filtered }),
              });
              return res.json();
            })();
        window.nhToast?.(
          `Ref. ${norm}: ${filtered.length} filas · intereses nuevos ${json.interesesRegistrados || 0}`,
          'success',
          8000
        );
        if (typeof loadCompradores === 'function') loadCompradores(true);
        if (typeof window.__nhRefreshRebajaVisitantes === 'function') await window.__nhRefreshRebajaVisitantes();
      } catch (e) {
        window.nhToast?.(e.message, 'error');
      }
    };
    input.click();
  };
})();
