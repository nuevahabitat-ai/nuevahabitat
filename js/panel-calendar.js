/**
 * Calendario interactivo de disponibilidad — panel comprador / vendedor.
 */
(function () {
  const HOUR_SLOTS = ['10:00–12:00', '12:00–14:00', '16:00–18:00', '18:00–20:00'];

  function parseDateHour(dateStr, hourRange) {
    const d = new Date(dateStr + 'T12:00:00');
    let h = 10;
    if (hourRange && hourRange.startsWith('12')) h = 12;
    if (hourRange && hourRange.startsWith('16')) h = 16;
    if (hourRange && hourRange.startsWith('18')) h = 18;
    d.setHours(h, 0, 0, 0);
    return d;
  }

  function parseDateHourEnd(dateStr, hourRange) {
    const d = parseDateHour(dateStr, hourRange);
    d.setHours(d.getHours() + 2);
    return d;
  }

  function formatCalendarDateTime(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  function minDateStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function userEmailTag(notas, email) {
    if (!email || (notas || '').includes(email)) return notas;
    return `${notas} · ${email}`;
  }

  function formatSavedRow(v) {
    const d = new Date(v.fecha_hora);
    const fecha = d.toLocaleDateString('es-ES', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    const tipo = v.tipo_solicitud === 'disponibilidad_vendedor'
      ? 'Disponibilidad vendedor'
      : v.tipo_solicitud === 'disponibilidad_comprador'
        ? 'Disponibilidad comprador'
        : 'Visita';
    return `<div class="p-cal-saved">
      <span class="p-cal-saved-tag">${tipo}</span>
      <span class="p-cal-saved-msg">${v.notas || fecha}</span>
      <span class="p-cal-saved-date">${fecha}</span>
    </div>`;
  }

  async function loadSavedAvailability(root, userId, role, userEmail) {
    const listEl = root.querySelector('.p-cal-saved-list');
    if (!listEl || !window.nhSupabase || !userId) return;
    const tipo = role === 'vendedor' ? 'disponibilidad_vendedor' : 'disponibilidad_comprador';
    const label = role === 'vendedor' ? 'Disponibilidad vendedor' : 'Disponibilidad comprador';

    let q = window.nhSupabase
      .from('visitas')
      .select('id, fecha_hora, notas, tipo_solicitud, estado')
      .order('fecha_hora', { ascending: false })
      .limit(20);

    if (userEmail) {
      q = q.or(`perfil_id.eq.${userId},notas.ilike.%${userEmail}%`);
    } else {
      q = q.eq('perfil_id', userId);
    }

    const { data, error } = await q;
    const rows = (data || []).filter((v) => {
      if (v.tipo_solicitud) return v.tipo_solicitud === tipo;
      return (v.notas || '').includes(label);
    }).slice(0, 8);

    if (error || !rows.length) {
      listEl.innerHTML = '<p class="p-cal-empty">Aún no has registrado franjas horarias.</p>';
      return;
    }
    listEl.innerHTML = rows.map(formatSavedRow).join('');
  }

  async function saveViaApi(user, payload) {
    const { data: { session } } = await window.nhSupabase.auth.getSession();
    if (!session?.access_token) return { ok: false, code: 'NO_SESSION' };
    const res = await fetch('/api/disponibilidad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...payload, nombre: payload.nombre, telefono: payload.telefono, email: user.email }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true, via: 'api' };
    return { ok: false, code: data.code, needsMigration: data.needsMigration, error: data.error };
  }

  async function saveViaRpc(payload) {
    const { data, error } = await window.nhSupabase.rpc('registrar_disponibilidad_panel', {
      p_fecha_hora: payload.fecha_hora,
      p_notas: payload.notas,
      p_tipo_solicitud: payload.tipo_solicitud,
      p_inmueble_id: payload.inmueble_id || null,
    });
    if (error) return { ok: false, error };
    return { ok: true, via: 'rpc', id: data };
  }

  async function saveViaDirectInsert(payload) {
    const notas = userEmailTag(payload.notas, payload.userEmail);
    const attempts = [
      { perfil_id: payload.perfil_id, tipo_solicitud: payload.tipo_solicitud, inmueble_id: payload.inmueble_id },
      { perfil_id: payload.perfil_id, tipo_solicitud: payload.tipo_solicitud },
      { perfil_id: payload.perfil_id },
      { tipo_solicitud: payload.tipo_solicitud },
      {},
    ];
    let lastErr = null;
    for (const extra of attempts) {
      const row = cleanRow({
        estado: 'pendiente',
        fecha_hora: payload.fecha_hora,
        notas,
        ...extra,
      });
      const { error } = await window.nhSupabase.from('visitas').insert(row);
      if (!error) return { ok: true, via: 'direct' };
      lastErr = error;
    }
    return { ok: false, error: lastErr };
  }

  function cleanRow(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null && v !== ''));
  }

  async function saveViaLeadOnly(leadOpts) {
    if (!window.nhSubmitLead) return { ok: false };
    const { perfil_id, ...safeOpts } = leadOpts;
    const ok = await window.nhSubmitLead({ ...safeOpts, errorMsg: false });
    return ok ? { ok: true, via: 'lead' } : { ok: false };
  }

  async function persistAvailability(user, payload, leadOpts) {
    await window.nhAuth?.ensureClientRecord?.(user);

    const apiResult = await saveViaApi(user, payload);
    if (apiResult.ok) return apiResult;

    const rpcResult = await saveViaRpc(payload);
    if (rpcResult.ok) return rpcResult;

    const directResult = await saveViaDirectInsert({ ...payload, userEmail: user.email });
    if (directResult.ok) return directResult;

    const leadResult = await saveViaLeadOnly(leadOpts);
    if (leadResult.ok) return leadResult;

    const errMsg = directResult.error?.message || rpcResult.error?.message || apiResult.error || 'unknown';
    const err = new Error(errMsg);
    err.needsMigration = apiResult.needsMigration || /inmueble_id|not-null|tipo_solicitud|column/i.test(errMsg);
    throw err;
  }

  async function saveAvailability(root, opts) {
    const { role, user, inmuebleId } = opts;
    const dateInput = root.querySelector('.p-cal-date');
    const hourBtn = root.querySelector('.p-cal-hour.sel');
    const notesInput = root.querySelector('.p-cal-notes');
    const saveBtn = root.querySelector('.p-cal-save');

    const dateStr = dateInput?.value;
    const hourRange = hourBtn?.dataset.val;
    const notes = (notesInput?.value || '').trim();

    if (!dateStr) { window.nhToast?.('Selecciona un día.'); return; }
    if (!hourRange) { window.nhToast?.('Selecciona una franja horaria.'); return; }

    const telefono = user.user_metadata?.telefono
      || document.getElementById('pf-tel')?.value?.trim() || '';
    if (!telefono) {
      window.nhToast?.('Añade tu teléfono en Mi perfil antes de guardar disponibilidad.');
      return;
    }

    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Cliente';
    const tipoSolicitud = role === 'vendedor' ? 'disponibilidad_vendedor' : 'disponibilidad_comprador';
    const label = role === 'vendedor' ? 'Disponibilidad vendedor' : 'Disponibilidad comprador';
    const mensaje = `${label}: ${dateStr} · ${hourRange}${notes ? ' · ' + notes : ''}`;
    const fechaVisita = parseDateHour(dateStr, hourRange);
    const fechaFin = parseDateHourEnd(dateStr, hourRange);
    const calendar = {
      start: formatCalendarDateTime(fechaVisita),
      end: formatCalendarDateTime(fechaFin),
      timeZone: 'Europe/Madrid',
    };

    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando…'; }

    const payload = {
      fecha_hora: fechaVisita.toISOString(),
      notas: userEmailTag(mensaje, user.email),
      tipo_solicitud: tipoSolicitud,
      inmueble_id: inmuebleId || null,
      perfil_id: user.id,
      nombre,
      telefono,
    };

    const leadOpts = {
      nombre, telefono, email: user.email, mensaje,
      tipo: 'info',
      origen: role === 'vendedor' ? 'panel_disponibilidad_vendedor' : 'panel_disponibilidad_comprador',
      inmueble_id: inmuebleId || undefined,
      template: 'disponibilidad',
      method: 'panel_calendar',
      notifyExtra: { rol: role },
      extra: { landing: 'panel', rol: role },
      calendar,
      errorMsg: false,
    };

    try {
      await window.nhWaitSupabase?.();
      if (!window.nhSupabase) throw new Error('Sin conexión con la base de datos');

      const result = await persistAvailability(user, payload, leadOpts);

      if (result.via === 'lead') {
        window.nhToast?.('Disponibilidad registrada. Te hemos enviado confirmación por email.');
      } else {
        window.nhSubmitLead({ ...leadOpts, notify: false, errorMsg: false }).catch(() => {});
        if (window.nhNotify) {
          window.nhNotify({
            nombre, telefono, email: user.email, mensaje,
            template: 'disponibilidad',
            extra: { rol: role },
            calendar,
          });
        }
        window.nhToast?.('Disponibilidad registrada. Revisa tu email para añadir la cita al calendario.');
      }

      if (notesInput) notesInput.value = '';
      root.querySelectorAll('.p-cal-hour').forEach(b => b.classList.remove('sel'));
      await loadSavedAvailability(root, user.id, role, user.email);
      if (typeof window.loadVisitas === 'function') window.loadVisitas();
      if (typeof window.loadVisitasVendedor === 'function') window.loadVisitasVendedor();
    } catch (err) {
      console.error('panel-calendar', err);
      let toast = 'No se pudo guardar. ';
      if (err.needsMigration) {
        toast += 'Ejecuta la migración 025 en Supabase (SQL Editor) y vuelve a intentar.';
      } else {
        toast += 'Inténtalo de nuevo o escríbenos a info@nuevahabitat.com';
      }
      window.nhToast?.(toast);
    } finally {
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Guardar disponibilidad →'; }
    }
  }

  function bindCalendar(root, opts) {
    root.querySelectorAll('.p-cal-hour').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.p-cal-hour').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');
      });
    });
    root.querySelector('.p-cal-save')?.addEventListener('click', () => saveAvailability(root, opts));
    loadSavedAvailability(root, opts.user?.id, opts.role, opts.user?.email);
  }

  window.nhInitPanelCalendar = function (opts) {
    const root = document.getElementById(opts.rootId);
    if (!root || !opts.user) return;

    const intro = opts.role === 'vendedor'
      ? 'Indica qué días y horas tienes disponible para que tu asesor haga visitas con compradores cualificados en tu inmueble.'
      : 'Indica qué días y horas te vienen bien para visitar inmuebles de vendedores en nuestra cartera.';

    root.innerHTML = `
      <p class="p-cal-intro">${intro}</p>
      <div class="p-cal-form">
        <div class="p-field">
          <label>Día</label>
          <input type="date" class="p-cal-date" min="${minDateStr()}"/>
        </div>
        <div class="p-field p-field-full">
          <label>Franja horaria</label>
          <div class="p-cal-hours">
            ${HOUR_SLOTS.map(h => `<button type="button" class="p-cal-hour" data-val="${h}">${h}</button>`).join('')}
          </div>
        </div>
        <div class="p-field p-field-full">
          <label>Notas (opcional)</label>
          <input type="text" class="p-cal-notes" placeholder="Ej. solo por la mañana, llaves en portería…"/>
        </div>
        <button type="button" class="btn btn-gold p-cal-save" style="margin-top:.5rem">Guardar disponibilidad →</button>
      </div>
      <div class="p-cal-saved-wrap">
        <div class="p-cal-saved-title">Tus franjas registradas</div>
        <div class="p-cal-saved-list"><p class="p-cal-empty">Cargando…</p></div>
      </div>`;

    bindCalendar(root, opts);
  };
})();
