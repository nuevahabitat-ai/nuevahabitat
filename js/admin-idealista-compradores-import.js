/**
 * Panel admin · Importar Idealista — botón junto a «Nuevo comprador» + modal.
 */
(function () {
  let idealistaRows = [];

  function ensureXlsx() {
    return new Promise((resolve, reject) => {
      if (window.XLSX) {
        resolve(window.XLSX);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = () => resolve(window.XLSX);
      s.onerror = () => reject(new Error('No se pudo cargar el lector Excel'));
      document.head.appendChild(s);
    });
  }

  function telDigits(raw) {
    const d = String(raw || '').replace(/\D/g, '');
    return d.length >= 9 ? d.slice(-9) : '';
  }

  function parseCsv(text) {
    const raw = text.replace(/^\uFEFF/, '');
    const semi = (raw.slice(0, 800).match(/;/g) || []).length;
    const comma = (raw.slice(0, 800).match(/,/g) || []).length;
    const sep = semi >= comma ? ';' : ',';
    const matrix = [];
    let row = [];
    let cell = '';
    let q = false;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i];
      if (c === '"') {
        if (q && raw[i + 1] === '"') { cell += '"'; i++; }
        else q = !q;
      } else if (c === sep && !q) {
        row.push(cell.trim());
        cell = '';
      } else if ((c === '\n' || c === '\r') && !q) {
        if (c === '\r' && raw[i + 1] === '\n') i++;
        row.push(cell.trim());
        cell = '';
        if (row.some((x) => x !== '')) matrix.push(row);
        row = [];
      } else cell += c;
    }
    if (cell || row.length) {
      row.push(cell.trim());
      if (row.some((x) => x !== '')) matrix.push(row);
    }
    if (!matrix.length) return [];
    const headers = matrix[0];
    return matrix.slice(1).map((cells) => {
      const o = {};
      headers.forEach((h, j) => { o[h] = cells[j] != null ? cells[j] : ''; });
      return o;
    });
  }

  function ensureModal() {
    if (document.getElementById('comp-idealista-modal')) return;
    const el = document.createElement('div');
    el.id = 'comp-idealista-modal';
    el.className = 'dash-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'comp-idealista-modal-title');
    el.innerHTML = `
      <div class="dash-modal-backdrop" data-close="1"></div>
      <div class="dash-modal-panel" style="width:min(520px,100%)">
        <div class="dash-modal-head">
          <div>
            <div class="dash-modal-kicker">Compradores</div>
            <h3 id="comp-idealista-modal-title">Importar contactos Idealista</h3>
          </div>
          <button type="button" class="dash-modal-close" id="comp-idealista-modal-close" aria-label="Cerrar">✕</button>
        </div>
        <div class="dash-modal-body">
          <p class="text-muted" style="font-size:.78rem;line-height:1.55;margin-bottom:1rem">
            Sube el export del portal (CSV o Excel). Compradores <strong>activos</strong> por teléfono. Para presupuesto y rebajas, rellena <strong>Ref. Idealista</strong> en cada inmueble NH.
          </p>
          <div class="adm-field">
            <label for="comp-idealista-file">Archivo</label>
            <input type="file" id="comp-idealista-file" accept=".csv,.txt,.xls,.xlsx" class="adm-control"/>
          </div>
          <div id="comp-idealista-preview" class="text-muted" style="font-size:.78rem;margin-top:.75rem;line-height:1.5;display:none"></div>
          <div id="comp-idealista-result" style="margin-top:.65rem;display:none"></div>
        </div>
        <div class="dash-modal-foot">
          <button type="button" class="adm-btn adm-btn-ghost" id="comp-idealista-modal-cancel">Cancelar</button>
          <button type="button" class="adm-btn adm-btn-gold" id="comp-idealista-import-btn" disabled>Importar compradores</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector('[data-close]')?.addEventListener('click', closeIdealistaImportModal);
    document.getElementById('comp-idealista-modal-close')?.addEventListener('click', closeIdealistaImportModal);
    document.getElementById('comp-idealista-modal-cancel')?.addEventListener('click', closeIdealistaImportModal);
    document.getElementById('comp-idealista-file')?.addEventListener('change', onFile);
    document.getElementById('comp-idealista-import-btn')?.addEventListener('click', runImport);
  }

  function injectHeaderButton() {
    const sec = document.getElementById('sec-compradores');
    if (!sec || document.getElementById('comp-idealista-open-btn')) return;
    const hdr = sec.querySelector('.adm-section-hdr');
    if (!hdr) return;
    document.getElementById('comp-idealista-import-wrap')?.remove();
    const nuevoBtn = hdr.querySelector('button[onclick*="openCompForm"]');
    if (!nuevoBtn) return;
    let actions = hdr.querySelector('.comp-hdr-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'comp-hdr-actions';
      actions.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;align-items:center';
      nuevoBtn.replaceWith(actions);
      actions.appendChild(nuevoBtn);
    }
    const imp = document.createElement('button');
    imp.type = 'button';
    imp.id = 'comp-idealista-open-btn';
    imp.className = 'adm-btn adm-btn-ghost';
    imp.textContent = 'Importar';
    imp.addEventListener('click', openIdealistaImportModal);
    actions.insertBefore(imp, actions.firstChild);
  }

  window.openIdealistaImportModal = function () {
    ensureModal();
    idealistaRows = [];
    const preview = document.getElementById('comp-idealista-preview');
    const result = document.getElementById('comp-idealista-result');
    const file = document.getElementById('comp-idealista-file');
    const btn = document.getElementById('comp-idealista-import-btn');
    if (file) file.value = '';
    if (preview) preview.style.display = 'none';
    if (result) result.style.display = 'none';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Importar compradores';
    }
    document.getElementById('comp-idealista-modal')?.classList.add('open');
  };

  window.closeIdealistaImportModal = function () {
    document.getElementById('comp-idealista-modal')?.classList.remove('open');
  };

  async function onFile(ev) {
    const file = ev.target?.files?.[0];
    const preview = document.getElementById('comp-idealista-preview');
    const btn = document.getElementById('comp-idealista-import-btn');
    const result = document.getElementById('comp-idealista-result');
    idealistaRows = [];
    if (btn) btn.disabled = true;
    if (result) result.style.display = 'none';
    if (!file) {
      if (preview) preview.style.display = 'none';
      return;
    }
    try {
      const low = (file.name || '').toLowerCase();
      if (low.endsWith('.csv') || low.endsWith('.txt')) {
        idealistaRows = parseCsv(await file.text());
      } else {
        const XLSX = await ensureXlsx();
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        idealistaRows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      }
      const conTel = idealistaRows.filter((r) => telDigits(r['TELÉFONO'] || r.TELEFONO || r.telefono)).length;
      if (preview) {
        preview.style.display = 'block';
        preview.innerHTML = `<strong>${idealistaRows.length}</strong> filas · <strong>${conTel}</strong> con teléfono importable.`;
      }
      if (btn) btn.disabled = !conTel;
    } catch (e) {
      window.nhToast?.('Error leyendo archivo: ' + e.message, 'error');
      if (preview) preview.style.display = 'none';
    }
  }

  async function runImport() {
    if (!idealistaRows.length) return;
    if (!confirm(`¿Importar ${idealistaRows.length} filas como compradores Idealista?`)) return;
    const btn = document.getElementById('comp-idealista-import-btn');
    const result = document.getElementById('comp-idealista-result');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Importando…';
    }
    try {
      const { data: { session } } = await window.nhSupabase.auth.getSession();
      if (!session?.access_token) throw new Error('Sesión no válida');
      const importFn = window.importIdealistaCompradoresChunked;
      const json = importFn
        ? await importFn(idealistaRows, session.access_token, {
          onProgress(done, total) {
            if (btn) btn.textContent = `Importando ${done}/${total}…`;
          },
        })
        : await (async () => {
          const res = await fetch('/api/notify?__action=admin-import-idealista-compradores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + session.access_token,
            },
            body: JSON.stringify({ rows: idealistaRows }),
          });
          const j = await res.json().catch(() => ({}));
          if (!res.ok || !j.ok) throw new Error(j.error || 'Error en importación');
          return j;
        })();
      const ids = (json.idealistaSinMatch || []).slice(0, 12).join(', ');
      const extra = ids ? ` Refs sin inmueble NH: ${ids}${json.idealistaSinMatch.length > 12 ? '…' : ''}.` : '';
      const dupC = json.compradoresDuplicadosOmitidos || 0;
      const dupI = json.interesesDuplicadosOmitidos || 0;
      const fc = json.fichasCompletadas;
      const fcTxt = fc
        ? ` Fichas con precio: ${fc.completadas}/${fc.total}.`
        : json.cacheAnuncios
          ? ` Anuncios en caché: ${json.cacheAnuncios.enCache}/${json.cacheAnuncios.solicitados}.`
          : '';
      window.nhToast?.(
        `Creados ${json.compradoresCreados}, dup. compradores ${dupC}, intereses nuevos ${json.interesesRegistrados}, dup. intereses ${dupI}.${fcTxt}${extra}`,
        'success',
        11000,
      );
      if (result) {
        result.style.display = 'block';
        result.className = 'alert-box alert-info';
        result.innerHTML = `Creados: <strong>${json.compradoresCreados}</strong> · Compradores ya existían: <strong>${dupC}</strong> · Intereses nuevos: <strong>${json.interesesRegistrados}</strong> · Intereses duplicados: <strong>${dupI}</strong> · Ref. NH en piso: según <code>idealista_id</code> en inmueble · Sin vínculo: <strong>${json.sinVinculoInmueble || 0}</strong>${json.errores?.length ? '<br><span style="font-size:.75rem">' + json.errores.map((e) => String(e)).join('<br>') + '</span>' : ''}`;
      }
      if (typeof bustPanelCache === 'function') bustPanelCache(['compradores', 'dashboard']);
      if (typeof loadCompradores === 'function') loadCompradores(true);
    } catch (e) {
      window.nhToast?.(e.message, 'error', 7000);
    } finally {
      if (btn) {
        btn.disabled = !idealistaRows.length;
        btn.textContent = 'Importar compradores';
      }
    }
  }

  function injectIdealistaIdField() {
    if (document.getElementById('w-idealista-id')) return;
    const refField = document.getElementById('w-ref')?.closest('.adm-field');
    if (!refField?.parentElement) return;
    const wrap = document.createElement('div');
    wrap.className = 'adm-field';
    wrap.innerHTML = `
      <label for="w-idealista-id">Ref. Idealista</label>
      <input type="text" id="w-idealista-id" inputmode="numeric" placeholder="112985423"/>
      <p class="text-muted" style="font-size:.68rem;margin-top:.25rem;line-height:1.35">Vincula contactos del portal e importaciones.</p>`;
    refField.insertAdjacentElement('afterend', wrap);
  }

  const origMatch = window.matchCompradorIdForVisitor;
  window.matchCompradorIdForVisitor = function (v) {
    if (v?.comprador_id) return v.comprador_id;
    const em = (v?.email || '').trim().toLowerCase();
    const data = window._compData || (typeof _compData !== 'undefined' ? _compData : []);
    if (em) {
      const c = data.find((x) => (x.email || '').trim().toLowerCase() === em);
      if (c) return c.id;
    }
    const t9 = telDigits(v?.telefono);
    if (t9) {
      const c = data.find((x) => telDigits(x.telefono) === t9);
      if (c) return c.id;
    }
    if (typeof origMatch === 'function') return origMatch(v);
    return null;
  };

  window.compTelLast9 = telDigits;

  function loadWizardIdealistaColocacion() {
    if (document.querySelector('script[data-nh-wizard-idealista-coloc]')) return;
    const s = document.createElement('script');
    s.src = 'js/admin-wizard-idealista-colocacion.js?v=' + encodeURIComponent('20261112');
    s.dataset.nhWizardIdealistaColoc = '1';
    s.async = true;
    document.head.appendChild(s);
  }

  function boot() {
    ensureModal();
    injectHeaderButton();
    injectIdealistaIdField();
    loadWizardIdealistaColocacion();
  }

  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
})();
