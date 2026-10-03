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

  const INQ_DOC_TIPOS = ['inquilino_dni', 'inquilino_nominas', 'inquilino_contrato', 'inquilino_seguro', 'inquilino_otro'];
  const ALQ_DOC_TIPOS = ['alquiler_contrato', 'alquiler_seguro', 'alquiler_incasol', 'alquiler_administracion', 'alquiler_otro', 'contrato', 'contrato_arras'];

  let currentUser = null;
  let expediente = null;

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

  function setHeaderUser(user) {
    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Propietario';
    document.getElementById('pUserName').textContent = nombre;
    const parts = nombre.trim().split(/\s+/);
    const ini = (parts[0]?.[0] || '') + (parts[1]?.[0] || parts[0]?.[1] || '');
    document.getElementById('pAvatar').textContent = ini.slice(0, 2).toUpperCase();
  }

  function showSection(id) {
    document.querySelectorAll('.p-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sec === id);
    });
    const sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
    if (id === 'incidencias') loadIncidencias();
    if (id === 'documentacion' || id === 'inquilino') loadDocumentos();
  }

  function bindNav() {
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.sec));
    });
    document.getElementById('pLogout')?.addEventListener('click', () => nhAuth.logout());
    const q = new URLSearchParams(location.search);
    const sec = q.get('sec');
    if (sec) showSection(sec);
  }

  function renderTimeline(estado) {
    const idx = ESTADOS.findIndex(e => e.key === estado);
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

  function renderDl(targetId, rows) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = rows.map(([label, val]) =>
      `<dt>${esc(label)}</dt><dd>${esc(val || '—')}</dd>`
    ).join('');
  }

  function applyExpediente(row) {
    expediente = row;
    window.alqExpediente = row;
    const estado = row.estado_gestion || 'alta';
    document.getElementById('statEstado').textContent = ESTADO_LABEL[estado] || estado;
    document.getElementById('statRenta').textContent = fmtEur(row.renta_mensual);

    const badge = document.getElementById('alqResumenBadge');
    if (row.suscripcion_activa) {
      badge.innerHTML = '<span class="nh-pay-badge nh-pay-badge--ok">Cuota domiciliada</span>';
    } else {
      badge.innerHTML = '<span class="nh-pay-badge nh-pay-badge--pending">Cuota pendiente</span>';
    }

    renderTimeline(estado);

    renderDl('dlInquilino', [
      ['Nombre', row.inquilino_nombre],
      ['Teléfono', row.inquilino_telefono],
      ['Email', row.inquilino_email],
      ['Inicio contrato', fmtDate(row.contrato_inicio)],
      ['Fin / revisión', fmtDate(row.contrato_fin)],
    ]);

    renderDl('dlPropietario', [
      ['Nombre', row.nombre],
      ['DNI/NIE', row.dni],
      ['Teléfono', row.telefono],
      ['Email', row.email],
      ['Dirección postal', row.direccion_propietario],
      ['IBAN cobro renta', row.iban_cobro ? '•••• ' + String(row.iban_cobro).slice(-4) : null],
      ['Notas', row.notas_propietario],
    ]);

    renderDl('dlInmueble', [
      ['Dirección', row.inmueble_direccion],
      ['Referencia NH', row.inmueble_ref],
      ['Ref. catastral', row.inmueble_ref_catastral],
      ['Renta', fmtEur(row.renta_mensual)],
      ['Servicio', row.servicio === 'integral' ? 'Alquiler integral (previo)' : 'Administración 60 €/mes'],
      ['Notas', row.inmueble_notas],
    ]);

    if (window.nhAlquilerStripe?.render) window.nhAlquilerStripe.render(row);
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
    const abiertas = (data || []).filter(i => !['resuelta', 'cerrada'].includes(i.estado)).length;
    document.getElementById('statIncidencias').textContent = String(abiertas);

    if (!data?.length) {
      el.innerHTML = `<div class="p-empty">
        <h4>Sin incidencias registradas</h4>
        <p>Cuando haya una avería o consulta gestionada por Nueva Habitat, la verás aquí con su estado.</p>
      </div>`;
      return;
    }
    el.innerHTML = data.map(i => `<div class="p-lead-row">
      <span class="p-lead-tipo">${esc(i.estado)}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${esc(i.titulo)}</div>
        <div style="font-size:.8125rem;color:var(--gris-texto);margin-top:.25rem">${esc(i.descripcion || '')}</div>
        ${i.responsable ? `<div style="font-size:.72rem;color:var(--gris-medio);margin-top:.35rem">Responsable: ${esc(i.responsable)}</div>` : ''}
      </div>
      <div style="font-size:.75rem;color:var(--gris-medio);white-space:nowrap">${fmtDate(i.created_at)}</div>
    </div>`).join('');
  }

  async function resolveDocUrl(url) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const { data, error } = await window.nhSupabase.storage.from('documentos-clientes').createSignedUrl(url, 3600);
    return error ? null : data?.signedUrl || null;
  }

  function docRowHtml(d, href) {
    const btn = href
      ? `<a href="${href}" target="_blank" rel="noopener" class="btn btn-outline" style="font-size:.78rem;padding:.4rem .9rem">Ver</a>`
      : `<span style="font-size:.75rem;color:var(--gris-medio)">Pendiente</span>`;
    return `<div class="p-doc-row">
      <div class="p-doc-name">${esc(d.nombre)}</div>
      <div style="font-size:.75rem;color:var(--gris-medio);text-transform:capitalize">${esc(d.estado || 'pendiente')}</div>
      ${btn}
    </div>`;
  }

  async function loadDocumentos() {
    if (!currentUser?.email) return;
    const { data } = await window.nhSupabase.from('cliente_documentos')
      .select('*')
      .ilike('cliente_email', currentUser.email)
      .order('created_at', { ascending: false });

    const all = data || [];
    const inq = all.filter(d => INQ_DOC_TIPOS.includes(d.tipo) || String(d.tipo || '').startsWith('inquilino'));
    const alq = all.filter(d => ALQ_DOC_TIPOS.includes(d.tipo) || String(d.tipo || '').startsWith('alquiler'));

    const emptyInq = '<p style="font-size:.85rem;color:var(--gris-medio)">Aún no hay documentos del inquilino visibles. Los subiremos cuando estén validados.</p>';
    const emptyAlq = '<p style="font-size:.85rem;color:var(--gris-medio)">Contratos de administración, LAU e INCASÒL aparecerán aquí.</p>';

    const inqEl = document.getElementById('docsInquilino');
    const alqEl = document.getElementById('docsAlquiler');
    if (inqEl) {
      if (!inq.length) inqEl.innerHTML = emptyInq;
      else {
        const rows = await Promise.all(inq.map(async d => docRowHtml(d, await resolveDocUrl(d.url))));
        inqEl.innerHTML = rows.join('');
      }
    }
    if (alqEl) {
      if (!alq.length) alqEl.innerHTML = emptyAlq;
      else {
        const rows = await Promise.all(alq.map(async d => docRowHtml(d, await resolveDocUrl(d.url))));
        alqEl.innerHTML = rows.join('');
      }
    }
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

    await nhAuth.ensureClientRecord(user, { tipo: 'propietario' });

    let row = await fetchExpediente();
    if (!row) {
      document.getElementById('alqResumenCopy').textContent =
        'Estamos preparando tu expediente. Si acabas de registrarte, Juan Cárdenas te contactará en menos de 24 h.';
    } else {
      applyExpediente(row);
      await loadIncidencias();
      await loadDocumentos();
    }

    bindNav();

    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId && window.nhAlquilerStripe?.verifySession) {
      await window.nhAlquilerStripe.verifySession(sessionId);
      row = await fetchExpediente();
      if (row) applyExpediente(row);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
