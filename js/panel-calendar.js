/**
 * Calendario interactivo de disponibilidad — panel comprador / vendedor.
 * Registra en leads + visitas y notifica al administrador.
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

  async function insertVisitaRow(supabase, base) {
    const notas = userEmailTag(base.notas, base.userEmail);
    const attempts = [
      { perfil_id: base.perfilId, tipo_solicitud: base.tipoSolicitud, inmueble_id: base.inmuebleId },
      { perfil_id: base.perfilId, inmueble_id: base.inmuebleId },
      { tipo_solicitud: base.tipoSolicitud, inmueble_id: base.inmuebleId },
      { inmueble_id: base.inmuebleId },
      {},
    ];

    let lastErr = null;
    for (const extra of attempts) {
      const row = {
        estado: 'pendiente',
        fecha_hora: base.fecha_hora,
        notas,
      };
      Object.entries(extra).forEach(([k, v]) => {
        if (v != null && v !== '') row[k] = v;
      });
      const { error } = await supabase.from('visitas').insert(row);
      if (!error) return;
      lastErr = error;
    }
    throw lastErr;
  }

  function userEmailTag(notas, email) {
    if (!email || (notas || '').includes(email)) return notas;
    return `${notas} · ${email}`;
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

    if (!dateStr) {
      window.nhToast?.('Selecciona un día.');
      return;
    }
    if (!hourRange) {
      window.nhToast?.('Selecciona una franja horaria.');
      return;
    }

    const telefono = user.user_metadata?.telefono
      || document.getElementById('pf-tel')?.value?.trim()
      || '';
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

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Guardando…';
    }

    try {
      await window.nhWaitSupabase?.();
      if (!window.nhSupabase) throw new Error('Sin conexión con la base de datos');

      try {
        await window.nhSupabase.rpc('ensure_perfil');
      } catch (_) { /* migración 024 opcional */ }
      await window.nhAuth?.ensureClientRecord?.(user);

      let perfilId = null;
      const { data: perfilRow } = await window.nhSupabase
        .from('perfiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (perfilRow?.id) perfilId = perfilRow.id;

      await insertVisitaRow(window.nhSupabase, {
        perfilId,
        tipoSolicitud,
        inmuebleId: inmuebleId || null,
        fecha_hora: fechaVisita.toISOString(),
        notas: mensaje,
        userEmail: user.email,
      });

      window.nhToast?.('Disponibilidad registrada. Revisa tu email para añadir la cita al calendario.');
      if (notesInput) notesInput.value = '';
      root.querySelectorAll('.p-cal-hour').forEach(b => b.classList.remove('sel'));
      await loadSavedAvailability(root, user.id, role, user.email);
      if (typeof window.loadVisitas === 'function') window.loadVisitas();
      if (typeof window.loadVisitasVendedor === 'function') window.loadVisitasVendedor();

      if (window.nhSubmitLead) {
        window.nhSubmitLead({
          nombre,
          telefono,
          email: user.email,
          mensaje,
          tipo: 'info',
          origen: role === 'vendedor' ? 'panel_disponibilidad_vendedor' : 'panel_disponibilidad_comprador',
          inmueble_id: inmuebleId || undefined,
          perfil_id: user.id,
          template: 'disponibilidad',
          method: 'panel_calendar',
          notifyExtra: { rol: role },
          extra: { landing: 'panel', rol: role },
          calendar,
          errorMsg: false,
        }).catch((err) => console.warn('panel-calendar lead/notify', err));
      }
    } catch (err) {
      console.error('panel-calendar', err);
      const msg = err?.message || err?.details || err?.hint || '';
      let toast = 'No se pudo guardar la disponibilidad. Inténtalo de nuevo.';
      if (/tipo_solicitud|inmueble_id|column|not-null/.test(msg)) {
        toast += ' Ejecuta la migración 023 en Supabase (SQL Editor).';
      } else if (/not authenticated/i.test(msg)) {
        toast = 'Sesión caducada. Vuelve a iniciar sesión.';
      }
      window.nhToast?.(toast);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar disponibilidad →';
      }
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
