/**
 * Página dedicada /admin-import-idealista — CSV o Excel → API import Idealista.
 */
(function () {
  let rows = [];

  const IDEALISTA_COLS = [
    'REF. IDEALISTA', 'REF. CLIENTE', 'DESCRIPCIÓN', 'USUARIO', 'ORIGEN', 'ESTADO',
    'EMAIL', 'TELÉFONO', 'MENSAJE', 'TIPO DE MENSAJE', 'FECHA', 'IDIOMA',
  ];

  function el(id) { return document.getElementById(id); }

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
    const headers = matrix[0].map((h) => h.replace(/^"|"$/g, '').trim());
    return matrix.slice(1).map((cells) => {
      const o = {};
      headers.forEach((h, j) => {
        o[h] = (cells[j] != null ? cells[j] : '').replace(/^"|"$/g, '');
      });
      return o;
    });
  }

  function ensureXlsx() {
    return new Promise((resolve, reject) => {
      if (window.XLSX) { resolve(window.XLSX); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = () => resolve(window.XLSX);
      s.onerror = () => reject(new Error('No se pudo cargar lector Excel'));
      document.head.appendChild(s);
    });
  }

  async function parseFile(file) {
    const name = (file.name || '').toLowerCase();
    if (name.endsWith('.csv') || name.endsWith('.txt')) {
      const text = await file.text();
      return parseCsv(text);
    }
    const XLSX = await ensureXlsx();
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { defval: '' });
  }

  function showLogin(show) {
    el('login-card')?.classList.toggle('hidden', !show);
    el('import-card')?.classList.toggle('hidden', show);
  }

  async function ensureSession() {
    const { data: { session } } = await window.nhSupabase.auth.getSession();
    showLogin(!session?.access_token);
    return session;
  }

  async function doLogin() {
    const email = el('adm-email')?.value?.trim();
    const pass = el('adm-pass')?.value || '';
    const errEl = el('login-err');
    if (!email || !pass) return;
    const { error } = await window.nhSupabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (errEl) {
        errEl.textContent = error.message;
        errEl.classList.remove('hidden');
      }
      return;
    }
    if (errEl) errEl.classList.add('hidden');
    showLogin(false);
  }

  async function onFile(ev) {
    const file = ev.target?.files?.[0];
    const preview = el('preview');
    const btn = el('idealista-import-btn');
    const result = el('result');
    rows = [];
    if (btn) btn.disabled = true;
    if (result) result.classList.add('hidden');
    if (!file) {
      preview?.classList.add('hidden');
      return;
    }
    try {
      rows = await parseFile(file);
      const conTel = rows.filter((r) => telDigits(r['TELÉFONO'] || r.TELEFONO || r.telefono)).length;
      if (preview) {
        preview.classList.remove('hidden');
        preview.innerHTML = `<strong>${rows.length}</strong> filas · <strong>${conTel}</strong> con teléfono válido. Columnas esperadas: ${IDEALISTA_COLS.slice(0, 4).join(', ')}…`;
      }
      if (btn) btn.disabled = !conTel;
    } catch (e) {
      window.nhToast?.('Error leyendo archivo: ' + e.message, 'error');
      preview?.classList.add('hidden');
    }
  }

  async function runImport() {
    if (!rows.length) return;
    if (!confirm(`¿Importar ${rows.length} filas como compradores Idealista?`)) return;
    const btn = el('idealista-import-btn');
    const result = el('result');
    if (btn) { btn.disabled = true; btn.textContent = 'Importando…'; }
    try {
      const { data: { session } } = await window.nhSupabase.auth.getSession();
      if (!session?.access_token) {
        showLogin(true);
        throw new Error('Sesión caducada — vuelve a entrar');
      }
      const res = await fetch('/api/notify?__action=admin-import-idealista-compradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ rows }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Error en importación');
      const msg = `Creados ${json.compradoresCreados}, actualizados ${json.compradoresActualizados}, intereses ${json.interesesRegistrados}.`;
      window.nhToast?.(msg, 'success', 9000);
      if (result) {
        result.classList.remove('hidden', 'err');
        result.classList.add('ok');
        result.innerHTML = `${msg} Sin vínculo inmueble: ${json.sinVinculoInmueble || 0}.${json.errores?.length ? '<br><span style="color:var(--muted)">' + json.errores.map(String).join('<br>') + '</span>' : ''}`;
      }
    } catch (e) {
      if (result) {
        result.classList.remove('hidden', 'ok');
        result.classList.add('err');
        result.textContent = e.message;
      }
      window.nhToast?.(e.message, 'error', 7000);
    } finally {
      if (btn) {
        btn.disabled = !rows.length;
        btn.textContent = 'Importar compradores';
      }
    }
  }

  el('adm-login-btn')?.addEventListener('click', doLogin);
  el('idealista-file')?.addEventListener('change', onFile);
  el('idealista-import-btn')?.addEventListener('click', runImport);

  window.nhSupabase.auth.onAuthStateChange(() => { ensureSession(); });
  ensureSession();
})();
