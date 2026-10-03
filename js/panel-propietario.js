/**
 * Panel propietario — administración de alquileres
 */
(function () {
  const ESTADOS = [
    { key: 'alta', title: 'Alta en el servicio', desc: 'Cuenta creada y expediente abierto con Nueva Habitat.' },
    { key: 'documentacion', title: 'Documentación del inmueble', desc: 'Revisión de contrato, seguros, certificados y datos de cobro.' },
    { key: 'contrato', title: 'Contrato de administración', desc: 'Firma del encargo de gestión y condiciones del servicio.' },
    { key: 'activo', title: 'Gestión activa', desc: 'Incidencias, mediación y seguimiento de renta en curso.' },
    { key: 'renovacion', title: 'Renovación / LAU', desc: 'Prórrogas, actualización de renta o fin de contrato.' },
    { key: 'baja', title: 'Baja del servicio', desc: 'Cierre de la administración (con preaviso acordado).' },
  ];

  const ESTADO_LABEL = {
    alta: 'Alta',
    documentacion: 'Documentación',
    contrato: 'Contrato',
    activo: 'Activo',
    renovacion: 'Renovación',
    baja: 'Baja',
  };

  const INQ_DOC_SLOTS = [
    { tipo: 'inquilino_dni', label: 'DNI / NIE del inquilino' },
    { tipo: 'inquilino_nominas', label: 'Nóminas o solvencia' },
    { tipo: 'inquilino_contrato', label: 'Contrato de arrendamiento firmado' },
    { tipo: 'inquilino_seguro', label: 'Seguro del inquilino (si aplica)' },
  ];

  const PROP_DOC_SLOTS = [
    { tipo: 'prop_escritura', label: 'Escritura de propiedad' },
    { tipo: 'prop_nota_simple', label: 'Nota simple registral' },
    { tipo: 'prop_dni', label: 'DNI / NIE del propietario' },
    { tipo: 'prop_certificado_energetico', label: 'Certificado energético (CEE)' },
    { tipo: 'prop_ibi', label: 'Recibo IBI (opcional)' },
    { tipo: 'prop_seguro_hogar', label: 'Seguro del hogar (opcional)' },
    { tipo: 'prop_otro', label: 'Otros documentos (PDF)' },
  ];

  const INQ_DOC_TIPOS = INQ_DOC_SLOTS.map((s) => s.tipo).concat(['inquilino_otro']);
  const PROP_DOC_TIPOS = PROP_DOC_SLOTS.map((s) => s.tipo);
  const ALQ_DOC_TIPOS = [
    'alquiler_contrato', 'alquiler_seguro', 'alquiler_incasol', 'alquiler_administracion', 'alquiler_otro',
    'contrato', 'contrato_arras',
  ].concat(PROP_DOC_TIPOS);

  const MAX_FILE_BYTES = 50 * 1024 * 1024;
  const ALLOWED_EXT = /\.(pdf|jpe?g|png|webp|heic|doc|docx)$/i;
  const ALLOWED_MIME = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);

  let currentUser = null;
  let expediente = null;
  let docsCache = [];

  async function getAccessToken() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  function isAllowedFile(file) {
    if (!file) return false;
    if (file.size > MAX_FILE_BYTES) return false;
    if (ALLOWED_EXT.test(file.name)) return true;
    if (file.type && ALLOWED_MIME.has(file.type)) return true;
    return false;
  }

  function fmtEur(n) {
    if (n == null || n === '') return '—';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n));
  }

  function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function toast(msg, type) {
    if (window.nhToast) window.nhToast(msg, type || 'error');
    else alert(msg);
  }

  function setHeaderUser(user) {
    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Propietario';
    document.getElementById('pUserName').textContent = nombre;
    const parts = nombre.trim().split(/\s+/);
    const ini = (parts[0]?.[0] || '') + (parts[1]?.[0] || parts[0]?.[1] || '');
    document.getElementById('pAvatar').textContent = ini.slice(0, 2).toUpperCase();
  }

  function showSection(id) {
    document.querySelectorAll('.p-section').forEach((el) => el.classList.remove('active'));
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sec === id);
    });
    const sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
    if (id === 'incidencias') loadIncidencias();
    if (id === 'documentacion' || id === 'inquilino') {
      renderUploadSlots();
      loadDocumentos();
    }
  }

  function bindNav() {
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach((btn) => {
      btn.addEventListener('click', () => showSection(btn.dataset.sec));
    });
    document.getElementById('pLogout')?.addEventListener('click', () => nhAuth.logout());
    const q = new URLSearchParams(location.search);
    const sec = q.get('sec');
    if (sec) showSection(sec);
  }

  function renderTimeline(estado) {
    const idx = ESTADOS.findIndex((e) => e.key === estado);
    const cur = idx >= 0 ? idx : 0;
    const el = document.getElementById('timelineAlquiler');
    if (!el) return;
    el.innerHTML = ESTADOS.map((step, i) => {
      let dotClass = 'dot-pend';
      let inner = String(i + 1);
      if (i < cur) { dotClass = 'dot-done'; inner = '✓'; }
      else if (i === cur) dotClass = 'dot-now';
      return `<div class="p-step">
        <div class="p-step-dot ${dotClass}">${inner}</div>
        <div class="p-step-body">
          <h4>${esc(step.title)}</h4>
          <p>${esc(step.desc)}</p>
        </div>
      </div>`;
    }).join('');
  }

  function dateInputVal(d) {
    if (!d) return '';
    const s = String(d).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
  }

  function fillForms(row) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    };
    set('fPropNombre', row.nombre);
    set('fPropDni', row.dni);
    set('fPropTel', row.telefono);
    set('fPropEmail', row.email || currentUser?.email);
    set('fPropDir', row.direccion_propietario);
    set('fPropIban', row.iban_cobro);
    set('fPropNotas', row.notas_propietario);
    set('fInqNombre', row.inquilino_nombre);
    set('fInqTel', row.inquilino_telefono);
    set('fInqEmail', row.inquilino_email);
    set('fContratoInicio', dateInputVal(row.contrato_inicio));
    set('fContratoFin', dateInputVal(row.contrato_fin));
    set('fInmDir', row.inmueble_direccion);
    set('fInmRef', row.inmueble_ref);
    set('fInmCatastro', row.inmueble_ref_catastral);
    set('fInmRenta', row.renta_mensual != null ? String(row.renta_mensual) : '');
    set('fInmNotas', row.inmueble_notas);
  }

  function formPayload(formEl) {
    const fd = new FormData(formEl);
    const o = {};
    fd.forEach((v, k) => { o[k] = typeof v === 'string' ? v.trim() : v; });
    return o;
  }

  function showSaveMsg(id, ok, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.display = 'inline';
    el.classList.toggle('err', !ok);
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  async function apiPost(action, body) {
    const token = await getAccessToken();
    if (!token) throw new Error('Sesión expirada');
    const res = await fetch(`/api/panel-propietario?action=${encodeURIComponent(action)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : '{}',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || `Error ${action}`);
    return data;
  }

  async function ensureExpediente() {
    if (expediente?.id) return expediente;

    try {
      const { data: rpcRow, error: rpcErr } = await window.nhSupabase.rpc('get_my_propietario_alquiler');
      if (!rpcErr && rpcRow) {
        expediente = typeof rpcRow === 'string' ? JSON.parse(rpcRow) : rpcRow;
        if (expediente?.id) return expediente;
      }
    } catch (e) {
      console.warn('get_my_propietario_alquiler', e);
    }

    try {
      const ensured = await apiPost('ensure');
      if (ensured.row?.id) {
        expediente = ensured.row;
        return expediente;
      }
    } catch (e) {
      console.warn('api ensure expediente', e);
    }

    await nhAuth.ensureClientRecord(currentUser, { tipo: 'propietario' });
    expediente = await fetchExpediente();
    return expediente;
  }

  async function ensureStorageBucket() {
    try {
      await apiPost('ensure-storage');
    } catch (e) {
      console.warn('ensure-storage', e);
    }
  }

  async function saveExpedientePartial(payload, msgId) {
    await ensureExpediente();
    if (!expediente?.id) {
      toast('No hay expediente activo. Recarga la página o contacta con Juan.');
      return false;
    }
    const { data, error } = await window.nhSupabase.rpc('update_propietario_alquiler_expediente', {
      p_data: payload,
    });
    if (error) {
      console.error('saveExpediente', error);
      showSaveMsg(msgId, false, error.message || 'Error al guardar');
      toast('No se pudo guardar: ' + (error.message || 'error'), 'error');
      return false;
    }
    expediente = typeof data === 'string' ? JSON.parse(data) : data;
    window.alqExpediente = expediente;
    applyExpedienteSummary(expediente);
    showSaveMsg(msgId, true, 'Guardado correctamente');
    toast('Datos guardados', 'success');
    return true;
  }

  function bindForms() {
    document.getElementById('formPropietario')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSavePropietario');
      btn.disabled = true;
      await saveExpedientePartial(formPayload(e.target), 'msgPropietario');
      btn.disabled = false;
    });
    document.getElementById('formInquilino')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSaveInquilino');
      btn.disabled = true;
      await saveExpedientePartial(formPayload(e.target), 'msgInquilino');
      btn.disabled = false;
    });
    document.getElementById('formInmueble')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSaveInmueble');
      btn.disabled = true;
      await saveExpedientePartial(formPayload(e.target), 'msgInmueble');
      btn.disabled = false;
    });
  }

  function applyExpedienteSummary(row) {
    expediente = row;
    window.alqExpediente = row;
    const estado = row.estado_gestion || 'alta';
    document.getElementById('statEstado').textContent = ESTADO_LABEL[estado] || estado;
    document.getElementById('statRenta').textContent = fmtEur(row.renta_mensual);

    const badge = document.getElementById('alqResumenBadge');
    if (badge) {
      if (row.suscripcion_activa) {
        badge.innerHTML = '<span class="nh-pay-badge nh-pay-badge--done">Cuota domiciliada</span>';
      } else {
        badge.innerHTML = '<span class="nh-pay-badge nh-pay-badge--pending">Cuota pendiente</span>';
      }
    }

    renderTimeline(estado);
    fillForms(row);

    if (window.nhAlquilerStripe?.render) void window.nhAlquilerStripe.render(row);
  }

  async function fetchExpediente() {
    const email = currentUser?.email;
    if (!email) return null;
    const { data, error } = await window.nhSupabase
      .from('propietarios_alquiler')
      .select('*')
      .ilike('email', email)
      .maybeSingle();
    if (error) {
      console.warn('propietarios_alquiler', error);
      return null;
    }
    return data;
  }

  async function loadIncidencias() {
    const el = document.getElementById('incidenciasList');
    if (!el || !expediente?.id) return;
    el.innerHTML = '<div class="p-empty"><p>Cargando…</p></div>';
    const { data, error } = await window.nhSupabase
      .from('alquiler_incidencias')
      .select('*')
      .eq('propietario_id', expediente.id)
      .order('created_at', { ascending: false });
    if (error) {
      el.innerHTML = '<div class="p-empty"><p>No se pudieron cargar las incidencias.</p></div>';
      return;
    }
    const abiertas = (data || []).filter((i) => !['resuelta', 'cerrada'].includes(i.estado)).length;
    document.getElementById('statIncidencias').textContent = String(abiertas);

    if (!data?.length) {
      el.innerHTML = `<div class="p-empty">
        <h4>Sin incidencias registradas</h4>
        <p>Cuando haya una avería o consulta gestionada por Nueva Habitat, la verás aquí con su estado.</p>
      </div>`;
      return;
    }
    el.innerHTML = data.map((i) => `<div class="p-lead-row">
      <span class="p-lead-tipo">${esc(i.estado)}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${esc(i.titulo)}</div>
        <div style="font-size:.8125rem;color:var(--gris-texto);margin-top:.25rem">${esc(i.descripcion || '')}</div>
        ${i.responsable ? `<div style="font-size:.72rem;color:var(--gris-medio);margin-top:.35rem">Responsable: ${esc(i.responsable)}</div>` : ''}
      </div>
      <div style="font-size:.75rem;color:var(--gris-medio);white-space:nowrap">${fmtDate(i.created_at)}</div>
    </div>`).join('');
  }

  function storageFolder(email) {
    return email.toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
  }

  async function resolveDocUrl(url) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const { data, error } = await window.nhSupabase.storage.from('documentos-clientes').createSignedUrl(url, 3600);
    return error ? null : data?.signedUrl || null;
  }

  function docRowHtml(d, href, canDelete) {
    const btn = href
      ? `<a href="${href}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:.78rem;padding:.4rem .9rem">Ver PDF</a>`
      : `<span style="font-size:.75rem;color:var(--gris-medio)">Pendiente</span>`;
    const del = canDelete
      ? `<button type="button" class="btn btn-outline p-doc-del" data-id="${esc(d.id)}" style="font-size:.78rem;padding:.4rem .7rem;border-color:#fca5a5;color:#b91c1c">Eliminar</button>`
      : '';
    return `<div class="p-doc-row">
      <div class="p-doc-name">${esc(d.nombre)}</div>
      <div style="font-size:.75rem;color:var(--gris-medio);text-transform:capitalize">${esc(d.estado || 'subido')}</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">${btn}${del}</div>
    </div>`;
  }

  function docsForTipo(tipo) {
    return docsCache.filter((d) => d.tipo === tipo);
  }

  function renderUploadSlots() {
    const renderBlock = (containerId, slots) => {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = slots.map((slot) => {
        const existing = docsForTipo(slot.tipo);
        const chip = existing.length
          ? `<span class="p-doc-chip ok">${existing.length} archivo(s)</span>`
          : '<span class="p-doc-chip">Sin subir</span>';
        return `<div class="p-doc-upload" data-tipo="${esc(slot.tipo)}">
          <div class="p-doc-upload-head">
            <strong>${esc(slot.label)}</strong>
            ${chip}
          </div>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx,application/pdf,image/*" data-tipo="${esc(slot.tipo)}" data-label="${esc(slot.label)}"/>
        </div>`;
      }).join('');
      el.querySelectorAll('input[type=file]').forEach((input) => {
        input.addEventListener('change', () => onFilePicked(input));
      });
    };
    renderBlock('docsPropietarioUpload', PROP_DOC_SLOTS);
    renderBlock('docsInquilinoUpload', INQ_DOC_SLOTS);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const s = String(reader.result || '');
        const i = s.indexOf(',');
        resolve(i >= 0 ? s.slice(i + 1) : s);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadViaClient(file, path) {
    const contentType = file.type || 'application/octet-stream';
    const { error: upErr } = await window.nhSupabase.storage
      .from('documentos-clientes')
      .upload(path, file, { upsert: false, contentType });
    if (upErr) throw upErr;
  }

  async function uploadDocumentFile(file, tipo, label) {
    await ensureExpediente();
    if (!expediente?.id) throw new Error('No hay expediente activo. Pulsa Guardar en Datos propietario o recarga.');

    const email = currentUser.email;
    const folder = storageFolder(email);
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    let insertedByApi = false;
    try {
      await uploadViaClient(file, path);
    } catch (clientErr) {
      const msg = clientErr.message || '';
      const tryApi = async () => {
        if (file.size > 4 * 1024 * 1024) {
          throw new Error('Archivo grande: crea el bucket en Supabase (migración 045) y recarga la página.');
        }
        const base64 = await fileToBase64(file);
        await apiPost('upload', {
          tipo,
          label,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64,
        });
        insertedByApi = true;
      };

      if (/bucket not found/i.test(msg)) {
        await ensureStorageBucket();
        try {
          await uploadViaClient(file, path);
        } catch (retryErr) {
          await tryApi();
        }
      } else {
        await tryApi();
      }
    }

    if (!insertedByApi) {
      const { error: insErr } = await window.nhSupabase.from('cliente_documentos').insert({
        perfil_id: currentUser.id,
        cliente_email: email,
        tipo,
        nombre: label,
        url: path,
        estado: 'subido',
      });
      if (insErr) throw insErr;
    }
  }

  async function onFilePicked(input) {
    const file = input.files?.[0];
    if (!file) return;
    if (!isAllowedFile(file)) {
      toast('Formato no permitido o archivo > 50 MB. Usa PDF, JPG, PNG, WEBP, HEIC, DOC o DOCX.', 'error');
      input.value = '';
      return;
    }
    const tipo = input.dataset.tipo;
    const label = input.dataset.label || file.name;
    input.disabled = true;
    try {
      await uploadDocumentFile(file, tipo, label);
      toast('Documento subido correctamente', 'success');
      await loadDocumentos();
      renderUploadSlots();
    } catch (err) {
      console.error('upload', err);
      toast(err.message || 'Error al subir el archivo', 'error');
    } finally {
      input.value = '';
      input.disabled = false;
    }
  }

  async function deleteDocument(id) {
    if (!confirm('¿Eliminar este documento?')) return;
    const { error } = await window.nhSupabase.from('cliente_documentos').delete().eq('id', id);
    if (error) {
      toast(error.message, 'error');
      return;
    }
    toast('Documento eliminado', 'success');
    await loadDocumentos();
    renderUploadSlots();
  }

  async function loadDocumentos() {
    if (!currentUser?.email) return;
    const { data } = await window.nhSupabase.from('cliente_documentos')
      .select('*')
      .ilike('cliente_email', currentUser.email)
      .order('created_at', { ascending: false });

    docsCache = data || [];
    const inq = docsCache.filter((d) => INQ_DOC_TIPOS.includes(d.tipo) || String(d.tipo || '').startsWith('inquilino'));
    const alq = docsCache.filter((d) =>
      ALQ_DOC_TIPOS.includes(d.tipo) || String(d.tipo || '').startsWith('alquiler') || String(d.tipo || '').startsWith('prop_')
    );

    const inqEl = document.getElementById('docsInquilino');
    const alqEl = document.getElementById('docsAlquiler');

    if (inqEl) {
      if (!inq.length) {
        inqEl.innerHTML = '<p style="font-size:.85rem;color:var(--gris-medio)">Aún no hay PDFs del inquilino en el expediente.</p>';
      } else {
        const rows = await Promise.all(inq.map(async (d) => docRowHtml(
          d,
          await resolveDocUrl(d.url),
          ['subido', 'pendiente', 'pendiente_revision'].includes(d.estado)
        )));
        inqEl.innerHTML = rows.join('');
      }
    }

    if (alqEl) {
      if (!alq.length) {
        alqEl.innerHTML = '<p style="font-size:.85rem;color:var(--gris-medio)">Sube documentos arriba o espera los contratos firmados con Nueva Habitat.</p>';
      } else {
        const rows = await Promise.all(alq.map(async (d) => docRowHtml(
          d,
          await resolveDocUrl(d.url),
          String(d.tipo || '').startsWith('prop_') && ['subido', 'pendiente'].includes(d.estado)
        )));
        alqEl.innerHTML = rows.join('');
      }
    }

    document.querySelectorAll('.p-doc-del').forEach((btn) => {
      btn.addEventListener('click', () => deleteDocument(btn.dataset.id));
    });
  }

  async function init() {
    if (!window.nhSupabase) {
      document.addEventListener('supabase:ready', init);
      return;
    }

    const { data: { user }, error } = await window.nhSupabase.auth.getUser();
    if (error || !user) {
      window.location.replace('/login?redirect=' + encodeURIComponent('/panel-propietario'));
      return;
    }
    if (nhAuth.isAdmin(user)) {
      window.location.replace('/admin-panel');
      return;
    }

    currentUser = user;
    window.currentUser = user;
    setHeaderUser(user);
    bindForms();

    await ensureStorageBucket();
    await nhAuth.ensureClientRecord(user, { tipo: 'propietario' });

    let row = await fetchExpediente();
    if (!row) {
      try {
        const ensured = await apiPost('ensure');
        row = ensured.row || null;
      } catch (e) {
        console.warn('init ensure', e);
      }
    }
    if (!row) {
      document.getElementById('alqResumenCopy').textContent =
        'Completa tus datos, inmueble e inquilino abajo. Si acabas de registrarte, Juan Cárdenas puede ayudarte por WhatsApp.';
      document.getElementById('statEstado').textContent = 'Alta';
      fillForms({ email: user.email, nombre: user.user_metadata?.nombre, telefono: user.user_metadata?.telefono });
      const honorBody = document.getElementById('honorariosAlquilerBody');
      const honorResumen = document.getElementById('honorariosResumenCard');
      if (honorBody) {
        honorBody.innerHTML = '<p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6">Guarda primero tus datos de propietario. Luego podrás domiciliar la cuota de 60 €/mes aquí.</p>';
      }
      if (honorResumen) honorResumen.innerHTML = '<div style="font-size:.85rem;opacity:.9">Cuota 60 €/mes · pendiente de alta</div>';
    } else {
      applyExpedienteSummary(row);
      await loadIncidencias();
    }

    renderUploadSlots();
    await loadDocumentos();
    bindNav();

    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId && window.nhAlquilerStripe?.verifySession) {
      await window.nhAlquilerStripe.verifySession(sessionId);
      row = await fetchExpediente();
      if (row) applyExpedienteSummary(row);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
