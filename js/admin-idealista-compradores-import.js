/**
 * Panel admin · Importar Excel contactos Idealista → compradores activos.
 * Inyecta UI en #sec-compradores y llama /api/notify?__action=admin-import-idealista-compradores
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

  function injectUi() {
    const sec = document.getElementById('sec-compradores');
    if (!sec || document.getElementById('comp-idealista-import-wrap')) return;
    const hdr = sec.querySelector('.adm-section-hdr');
    if (!hdr) return;
    const card = document.createElement('div');
    card.className = 'adm-card';
    card.id = 'comp-idealista-import-wrap';
    card.style.marginBottom = '1rem';
    card.innerHTML = `
      <div class="adm-card-head"><div>
        <h3>Importar contactos Idealista</h3>
        <p class="text-muted" style="font-size:.75rem;margin:.35rem 0 0;font-weight:400;max-width:720px;line-height:1.5">
          Sube el export del portal. Compradores <strong>activos</strong> por teléfono, presupuesto según precio del inmueble NH vinculado (campo <strong>Ref. Idealista</strong> en el inmueble), e interés para <strong>avisos de rebaja</strong>.
        </p>
      </div></div>
      <div style="padding:0 1.15rem 1.15rem">
        <div class="gap-row" style="flex-wrap:wrap;align-items:flex-end">
          <div class="adm-field" style="min-width:260px">
            <label for="comp-idealista-file">CSV o Excel (.csv / .xls / .xlsx)</label>
            <input type="file" id="comp-idealista-file" accept=".csv,.txt,.xls,.xlsx"/>
          </div>
          <button type="button" class="adm-btn adm-btn-gold" id="comp-idealista-import-btn" disabled>Importar compradores</button>
        </div>
        <div id="comp-idealista-preview" class="text-muted" style="font-size:.78rem;margin-top:.75rem;line-height:1.5;display:none"></div>
        <div id="comp-idealista-result" style="margin-top:.65rem;display:none"></div>
      </div>`;
    hdr.insertAdjacentElement('afterend', card);
    document.getElementById('comp-idealista-file')?.addEventListener('change', onFile);
    document.getElementById('comp-idealista-import-btn')?.addEventListener('click', runImport);
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
        const sheet = wb.Sheets[wb.SheetNames[0]];
        idealistaRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      }
      const conTel = idealistaRows.filter((r) => telDigits(r['TELÉFONO'] || r.TELEFONO || r.telefono)).length;
      if (preview) {
        preview.style.display = 'block';
        preview.innerHTML = `<strong>${idealistaRows.length}</strong> filas · <strong>${conTel}</strong> con teléfono importable.`;
      }
      if (btn) btn.disabled = !conTel;
    } catch (e) {
      window.nhToast?.('Error leyendo Excel: ' + e.message, 'error');
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
      const res = await fetch('/api/notify?__action=admin-import-idealista-compradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ rows: idealistaRows }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Error en importación');
      const ids = (json.idealistaSinMatch || []).slice(0, 12).join(', ');
      const extra = ids ? ` Refs sin inmueble NH vinculado: ${ids}${json.idealistaSinMatch.length > 12 ? '…' : ''}.` : '';
      window.nhToast?.(`Creados ${json.compradoresCreados}, actualizados ${json.compradoresActualizados}, intereses ${json.interesesRegistrados}.${extra}`, 'success', 9000);
      if (result) {
        result.style.display = 'block';
        result.className = 'alert-box alert-info';
        result.innerHTML = `Creados: <strong>${json.compradoresCreados}</strong> · Actualizados: <strong>${json.compradoresActualizados}</strong> · Intereses: <strong>${json.interesesRegistrados}</strong> · Sin vínculo inmueble: <strong>${json.sinVinculoInmueble || 0}</strong>${json.errores?.length ? '<br><span style="font-size:.75rem">' + json.errores.map((e) => String(e)).join('<br>') + '</span>' : ''}`;
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

  document.addEventListener('DOMContentLoaded', () => {
    injectUi();
    injectIdealistaIdField();
  });
  if (document.readyState !== 'loading') {
    injectUi();
    injectIdealistaIdField();
  }
})();
