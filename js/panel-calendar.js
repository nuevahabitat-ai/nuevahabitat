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

  async function loadSavedAvailability(root, userId, role) {
    const listEl = root.querySelector('.p-cal-saved-list');
    if (!listEl || !window.nhSupabase || !userId) return;
    const tipo = role === 'vendedor' ? 'disponibilidad_vendedor' : 'disponibilidad_comprador';
    const { data } = await window.nhSupabase
      .from('visitas')
      .select('id, fecha_hora, notas, tipo_solicitud, estado')
      .eq('perfil_id', userId)
      .eq('tipo_solicitud', tipo)
      .order('fecha_hora', { ascending: false })
      .limit(8);
    if (!data?.length) {
      listEl.innerHTML = '<p class="p-cal-empty">Aún no has registrado franjas horarias.</p>';
      return;
    }
    listEl.innerHTML = data.map(formatSavedRow).join('');
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

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Guardando…';
    }

    try {
      await window.nhWaitSupabase?.();

      let leadId = null;
      if (window.nhSubmitLead) {
        const ok = await window.nhSubmitLead({
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
          errorMsg: false,
          onLeadCreated(row) { leadId = row?.id || null; },
        });
        if (!ok) throw new Error('No se pudo registrar la solicitud');
      }

      if (window.nhSupabase) {
        const row = {
          lead_id: leadId,
          perfil_id: user.id,
          estado: 'pendiente',
          fecha_hora: fechaVisita.toISOString(),
          notas: mensaje,
          tipo_solicitud: tipoSolicitud,
        };
        if (inmuebleId) row.inmueble_id = inmuebleId;
        const { error } = await window.nhSupabase.from('visitas').insert(row);
        if (error) throw error;
      }

      window.nhToast?.('Disponibilidad registrada. El equipo te contactará para confirmar.');
      if (notesInput) notesInput.value = '';
      root.querySelectorAll('.p-cal-hour').forEach(b => b.classList.remove('sel'));
      await loadSavedAvailability(root, user.id, role);
      if (typeof window.loadVisitas === 'function') window.loadVisitas();
      if (typeof window.loadVisitasVendedor === 'function') window.loadVisitasVendedor();
    } catch (err) {
      console.error('panel-calendar', err);
      const msg = err?.message || err?.details || '';
      const hint = /tipo_solicitud|inmueble_id|column/.test(msg)
        ? ' Falta aplicar la migración 023 en Supabase.'
        : '';
      window.nhToast?.('Error al guardar. Inténtalo de nuevo o contacta por WhatsApp.' + hint);
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
    loadSavedAvailability(root, opts.user?.id, opts.role);
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
