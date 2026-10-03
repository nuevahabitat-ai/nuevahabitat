/**
 * Documentación unificada — panel comprador / vendedor (subida + listado)
 */
(function () {
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

  const UPLOAD_SLOTS = [
    { tipo: 'dni_titular', label: 'DNI / NIE de titular(es)' },
    { tipo: 'cedula_habitabilidad', label: 'Cédula de habitabilidad' },
    { tipo: 'certificado_energetico', label: 'Certificado energético (CEE)' },
    { tipo: 'nota_simple', label: 'Nota simple registral' },
    { tipo: 'escritura', label: 'Escrituras' },
    { tipo: 'otro', label: 'Otros documentos' },
  ];

  const AGENT_DOC_TIPOS = new Set([
    'contrato_encargo',
    'contrato_arras',
    'contrato',
    'tasacion',
    'nota_mercado',
    'firmado',
  ]);

  let docsCache = [];

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function toast(msg, type) {
    if (window.nhToast) window.nhToast(msg, type || 'error');
    else alert(msg);
  }

  function isAllowedFile(file) {
    if (!file || file.size > MAX_FILE_BYTES) return false;
    if (ALLOWED_EXT.test(file.name)) return true;
    if (file.type && ALLOWED_MIME.has(file.type)) return true;
    return false;
  }

  function storageFolder(email) {
    return email.toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
  }

  async function getAccessToken() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  function clientPanelRol(user) {
    const q = new URLSearchParams(window.location.search).get('tipo');
    if (q === 'vendedor' || q === 'comprador') return q;
    if (window.nhAuth && typeof window.nhAuth.getUserTipo === 'function') {
      const t = window.nhAuth.getUserTipo(user);
      if (t === 'vendedor' || t === 'comprador') return t;
    }
    return null;
  }

  async function notifyAdminDocUpload(user, tipo, label) {
    const rol = clientPanelRol(user);
    if (rol !== 'vendedor' && rol !== 'comprador') return;
    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Cliente';
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'documento_subido_cliente',
          email: user.email,
          nombre,
          extra: {
            rol: rol === 'vendedor' ? 'Vendedor' : 'Comprador',
            documentoNombre: label,
            documentoTipo: tipo,
          },
        }),
      });
    } catch (e) {
      console.warn('notify admin doc upload', e);
    }
  }

  async function apiUpload(body) {
    const token = await getAccessToken();
    if (!token) throw new Error('Sesión expirada');
    const rol = clientPanelRol(window.currentUser);
    const res = await fetch('/api/panel-propietario?action=upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body, rol: rol || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'Error al subir');
    return data;
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

  async function resolveDocUrl(url) {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const { data, error } = await window.nhSupabase.storage.from('documentos-clientes').createSignedUrl(url, 3600);
    return error ? null : data?.signedUrl || null;
  }

  async function uploadViaClient(file, path) {
    const { error } = await window.nhSupabase.storage
      .from('documentos-clientes')
      .upload(path, file, { upsert: false, contentType: file.type || 'application/octet-stream' });
    if (error) throw error;
  }

  async function uploadDocument(file, tipo, label, user) {
    const email = user.email;
    const folder = storageFolder(email);
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    let insertedByApi = false;

    try {
      await uploadViaClient(file, path);
    } catch (clientErr) {
      const msg = clientErr.message || '';
      const tryApi = async () => {
        await apiUpload({
          tipo,
          label,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          base64: await fileToBase64(file),
        });
        insertedByApi = true;
      };
      if (/bucket not found|permission denied|row-level security|policy/i.test(msg)) {
        await tryApi();
      } else {
        await tryApi();
      }
    }

    if (!insertedByApi) {
      const { error: insErr } = await window.nhSupabase.from('cliente_documentos').insert({
        perfil_id: user.id,
        cliente_email: email,
        tipo,
        nombre: label,
        url: path,
        estado: 'subido',
      });
      if (insErr) {
        if (/permission denied|row-level security|policy/i.test(insErr.message || '')) {
          await apiUpload({
            tipo,
            label,
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            base64: await fileToBase64(file),
          });
          insertedByApi = true;
        } else {
          throw insErr;
        }
      }
    }
    if (!insertedByApi) await notifyAdminDocUpload(user, tipo, label);
  }

  function docsForTipo(tipo) {
    return docsCache.filter((d) => d.tipo === tipo);
  }

  function renderUploadSlots() {
    const el = document.getElementById('clienteDocsUpload');
    if (!el) return;
    el.innerHTML = UPLOAD_SLOTS.map((slot) => {
      const n = docsForTipo(slot.tipo).length;
      const chip = n
        ? `<span class="p-doc-chip ok">${n} archivo(s)</span>`
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
  }

  async function onFilePicked(input) {
    const file = input.files?.[0];
    const user = window.currentUser;
    if (!file || !user) return;
    if (!isAllowedFile(file)) {
      toast('Formato no permitido o archivo > 50 MB. Usa PDF, JPG, PNG, WEBP, HEIC, DOC o DOCX.', 'error');
      input.value = '';
      return;
    }
    input.disabled = true;
    try {
      await uploadDocument(file, input.dataset.tipo, input.dataset.label || file.name, user);
      toast('Documento subido correctamente', 'success');
      await load();
    } catch (err) {
      console.error('upload doc', err);
      toast(err.message || 'Error al subir', 'error');
    } finally {
      input.value = '';
      input.disabled = false;
    }
  }

  async function deleteDoc(id) {
    if (!confirm('¿Eliminar este documento?')) return;
    const { error } = await window.nhSupabase.from('cliente_documentos').delete().eq('id', id);
    if (error) {
      toast(error.message, 'error');
      return;
    }
    toast('Documento eliminado', 'success');
    await load();
  }

  async function docRowHtml(d) {
    const href = await resolveDocUrl(d.url);
    const canDel = ['subido', 'pendiente', 'pendiente_revision'].includes(d.estado);
    const btn = href
      ? `<a href="${href}" target="_blank" rel="noopener" class="btn btn-gold" style="font-size:.78rem;padding:.4rem .9rem">Ver / Descargar</a>`
      : '';
    const del = canDel
      ? `<button type="button" class="btn btn-outline" style="font-size:.72rem;padding:.35rem .65rem;border-color:#fca5a5;color:#b91c1c" data-del-doc="${esc(d.id)}">Eliminar</button>`
      : '';
    return `<div class="p-doc-row">
      <div class="p-doc-icon"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
      <div class="p-doc-info" style="flex:1;min-width:0">
        <div class="p-doc-name">${esc(d.nombre)}</div>
        <div style="font-size:.72rem;color:var(--gris-medio)">${esc(d.tipo)} · ${esc(d.estado || 'subido')}</div>
      </div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap">${btn}${del}</div>
    </div>`;
  }

  async function renderLists() {
    const agentEl = document.getElementById('clienteDocsAgentList');
    const mineEl = document.getElementById('clienteDocsMineList');
    const agentDocs = docsCache.filter((d) => AGENT_DOC_TIPOS.has(d.tipo) || d.estado === 'firmado' || d.estado === 'disponible');
    const mineDocs = docsCache.filter((d) => !agentDocs.includes(d));

    if (agentEl) {
      if (!agentDocs.length) {
        agentEl.innerHTML = '<p style="font-size:.85rem;color:var(--gris-medio)">Cuando Nueva Habitat suba contratos, arras o informes, aparecerán aquí.</p>';
      } else {
        const rows = await Promise.all(agentDocs.map((d) => docRowHtml(d)));
        agentEl.innerHTML = rows.join('');
      }
    }
    if (mineEl) {
      if (!mineDocs.length) {
        mineEl.innerHTML = '<p style="font-size:.85rem;color:var(--gris-medio)">Aún no has subido documentación. Usa los campos de arriba.</p>';
      } else {
        const rows = await Promise.all(mineDocs.map((d) => docRowHtml(d)));
        mineEl.innerHTML = rows.join('');
      }
    }

    document.querySelectorAll('[data-del-doc]').forEach((btn) => {
      btn.addEventListener('click', () => deleteDoc(btn.getAttribute('data-del-doc')));
    });
    renderUploadSlots();
  }

  async function load() {
    if (!window.nhSupabase || !window.currentUser?.email) return;
    const { data, error } = await window.nhSupabase
      .from('cliente_documentos')
      .select('*')
      .ilike('cliente_email', window.currentUser.email)
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('cliente_documentos', error);
      docsCache = [];
    } else {
      docsCache = data || [];
    }
    await renderLists();
  }

  window.nhPanelClienteDocs = { load, UPLOAD_SLOTS };
})();
