/**
 * Calendario de disponibilidad — panel vendedor / comprador.
 */
(function () {
  const HOUR_SLOTS = ['10:00–12:00', '12:00–14:00', '16:00–18:00', '18:00–20:00'];
  const calendarInstances = [];

  function storageKey(userId, role) {
    return `nh_cal_${userId}_${role}`;
  }

  function getLocalSlots(userId, role) {
    try {
      return JSON.parse(localStorage.getItem(storageKey(userId, role)) || '[]');
    } catch {
      return [];
    }
  }

  function addLocalSlot(userId, role, slot) {
    const list = getLocalSlots(userId, role).filter((s) => s.notas !== slot.notas);
    list.unshift(slot);
    localStorage.setItem(storageKey(userId, role), JSON.stringify(list.slice(0, 12)));
  }

  function parseDateHour(dateStr, hourRange) {
    const d = new Date(dateStr + 'T12:00:00');
    let h = 10;
    if (hourRange?.startsWith('12')) h = 12;
    if (hourRange?.startsWith('16')) h = 16;
    if (hourRange?.startsWith('18')) h = 18;
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
    return new Date().toISOString().slice(0, 10);
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

  function mergeSlots(rows, tipo, label) {
    const seen = new Set();
    return rows
      .filter((v) => {
        if (v.tipo_solicitud && v.tipo_solicitud !== tipo) return false;
        if (!v.tipo_solicitud && v.notas && !v.notas.includes(label)) return false;
        const key = (v.notas || '') + (v.fecha_hora || '');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
      .slice(0, 8);
  }

  async function fetchSlotsFromDb(userId, role, userEmail) {
    const tipo = role === 'vendedor' ? 'disponibilidad_vendedor' : 'disponibilidad_comprador';
    const label = role === 'vendedor' ? 'Disponibilidad vendedor' : 'Disponibilidad comprador';
    const rows = [...getLocalSlots(userId, role)];

    if (!window.nhSupabase) return mergeSlots(rows, tipo, label);

    let q = window.nhSupabase
      .from('visitas')
      .select('id, fecha_hora, notas, tipo_solicitud, estado')
      .order('fecha_hora', { ascending: false })
      .limit(20);

    if (userEmail) q = q.or(`perfil_id.eq.${userId},notas.ilike.%${userEmail}%`);
    else q = q.eq('perfil_id', userId);

    const { data: visitas } = await q;
    if (visitas?.length) rows.push(...visitas);

    const origen = role === 'vendedor' ? 'panel_disponibilidad_vendedor' : 'panel_disponibilidad_comprador';
    if (userEmail) {
      const { data: leads } = await window.nhSupabase
        .from('leads')
        .select('id, mensaje, created_at, origen')
        .eq('email', userEmail)
        .eq('origen', origen)
        .order('created_at', { ascending: false })
        .limit(10);
      (leads || []).forEach((l) => {
        rows.push({
          id: l.id,
          fecha_hora: l.created_at,
          notas: l.mensaje,
          tipo_solicitud: tipo,
          estado: 'pendiente',
        });
      });
    }

    return mergeSlots(rows, tipo, label);
  }

  async function loadSavedAvailability(root, userId, role, userEmail) {
    const listEl = root.querySelector('.p-cal-saved-list');
    if (!listEl || !userId) return;

    const rows = await fetchSlotsFromDb(userId, role, userEmail);
    listEl.innerHTML = rows.length
      ? rows.map(formatSavedRow).join('')
      : '<p class="p-cal-empty">Aún no has registrado franjas horarias.</p>';
  }

  function refreshAllCalendars(userId, role, userEmail) {
    calendarInstances
      .filter((c) => c.role === role && c.user?.id === userId)
      .forEach((c) => {
        const root = document.getElementById(c.rootId);
        if (root) loadSavedAvailability(root, userId, role, userEmail);
      });
  }

  async function trySaveVisita(supabase, row) {
    const attempts = [
      row,
      { ...row, perfil_id: undefined },
      { ...row, tipo_solicitud: undefined },
      { ...row, perfil_id: undefined, tipo_solicitud: undefined },
      { estado: row.estado, fecha_hora: row.fecha_hora, notas: row.notas },
    ];
    for (const attempt of attempts) {
      const clean = Object.fromEntries(
        Object.entries(attempt).filter(([, v]) => v != null && v !== '')
      );
      const { error } = await supabase.from('visitas').insert(clean);
      if (!error) return true;
    }
    return false;
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
      window.nhToast?.('Añade tu teléfono en Mi perfil antes de guardar.');
      return;
    }

    const nombre = user.user_metadata?.nombre || user.email?.split('@')[0] || 'Cliente';
    const tipoSolicitud = role === 'vendedor' ? 'disponibilidad_vendedor' : 'disponibilidad_comprador';
    const label = role === 'vendedor' ? 'Disponibilidad vendedor' : 'Disponibilidad comprador';
    const mensaje = `${label}: ${dateStr} · ${hourRange}${notes ? ' · ' + notes : ''} · ${user.email}`;
    const fechaVisita = parseDateHour(dateStr, hourRange);
    const fechaFin = parseDateHourEnd(dateStr, hourRange);
    const calendar = {
      start: formatCalendarDateTime(fechaVisita),
      end: formatCalendarDateTime(fechaFin),
      timeZone: 'Europe/Madrid',
    };

    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando…'; }

    try {
      await window.nhWaitSupabase?.();
      if (!window.nhSupabase) throw new Error('Sin conexión');

      await window.nhAuth?.ensureClientRecord?.(user, { tipo: role }).catch(() => {});

      let savedInDb = false;

      try {
        const sess = await window.nhSupabase.auth.getSession();
        const token = sess?.data?.session?.access_token;
        if (token) {
          const res = await fetch('/api/disponibilidad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              fecha_hora: fechaVisita.toISOString(),
              notas: mensaje,
              tipo_solicitud: tipoSolicitud,
              inmueble_id: inmuebleId || null,
              nombre, telefono,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.ok) savedInDb = true;
        }
      } catch (_) {}

      if (!savedInDb) {
        try {
          const { data, error } = await window.nhSupabase.rpc('registrar_disponibilidad_panel', {
            p_fecha_hora: fechaVisita.toISOString(),
            p_notas: mensaje,
            p_tipo_solicitud: tipoSolicitud,
            p_inmueble_id: inmuebleId || null,
          });
          if (!error && data) savedInDb = true;
        } catch (_) {}
      }

      if (!savedInDb) {
        savedInDb = await trySaveVisita(window.nhSupabase, {
          perfil_id: user.id,
          estado: 'pendiente',
          fecha_hora: fechaVisita.toISOString(),
          notas: mensaje,
          tipo_solicitud: tipoSolicitud,
          inmueble_id: inmuebleId || null,
        });
      }

      try {
        await window.nhSubmitLead?.({
          nombre, telefono, email: user.email, mensaje,
          tipo: 'info',
          origen: role === 'vendedor' ? 'panel_disponibilidad_vendedor' : 'panel_disponibilidad_comprador',
          template: 'disponibilidad',
          notifyExtra: { rol: role },
          calendar,
          notify: false,
          errorMsg: false,
        });
      } catch (_) {}

      if (window.nhNotify) {
        await window.nhNotify({
          nombre, telefono, email: user.email, mensaje,
          template: 'disponibilidad',
          extra: { rol: role },
          calendar,
        });
      }

      addLocalSlot(user.id, role, {
        id: `local-${Date.now()}`,
        fecha_hora: fechaVisita.toISOString(),
        notas: mensaje,
        tipo_solicitud: tipoSolicitud,
        estado: 'pendiente',
      });

      window.nhToast?.('Disponibilidad registrada. Te hemos enviado confirmación por email.', 'success');
      if (notesInput) notesInput.value = '';
      root.querySelectorAll('.p-cal-hour').forEach(b => b.classList.remove('sel'));
      refreshAllCalendars(user.id, role, user.email);
      if (typeof window.loadVisitas === 'function') window.loadVisitas();
      if (typeof window.loadVisitasVendedor === 'function') window.loadVisitasVendedor();
    } catch (err) {
      console.error('panel-calendar', err);
      window.nhToast?.('Error inesperado. Escríbenos a info@nuevahabitat.com');
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

    if (!calendarInstances.some((c) => c.rootId === opts.rootId)) {
      calendarInstances.push({ rootId: opts.rootId, role: opts.role, user: opts.user });
    }

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

  window.nhRefreshPanelCalendars = refreshAllCalendars;
})();
