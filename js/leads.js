/** Envío unificado de leads — espera Supabase y notifica por email */
(function () {
  if (window.nhWaitSupabase) return;

  window.nhWaitSupabase = function (timeoutMs = 8000) {
    return new Promise(resolve => {
      if (window.nhSupabase) return resolve(window.nhSupabase);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve(window.nhSupabase || null);
      };
      document.addEventListener('supabase:ready', finish, { once: true });
      document.addEventListener('supabase:error', finish, { once: true });
      setTimeout(finish, timeoutMs);
    });
  };

  window.nhSubmitLead = async function (opts) {
    const nombre = (opts.nombre || '').trim();
    const telefono = (opts.telefono || '').trim();
    if (!nombre || !telefono) {
      window.nhToast?.('Nombre y teléfono son obligatorios.');
      return false;
    }

    await window.nhWaitSupabase();

    const row = {
      nombre,
      telefono,
      email: (opts.email || '').trim() || null,
      mensaje: opts.mensaje || '',
      tipo: opts.tipo || 'info',
      origen: opts.origen || 'web',
      ...(opts.inmueble_id ? { inmueble_id: opts.inmueble_id } : {}),
      ...(opts.perfil_id ? { perfil_id: opts.perfil_id } : {}),
    };

    try {
      let leadRow = null;
      if (window.nhSupabase) {
        const { data, error } = await window.nhSupabase.from('leads').insert(row).select('id').single();
        if (error) throw error;
        leadRow = data;
      }
      if (window.nhNotify) {
        window.nhNotify({
          nombre,
          telefono,
          email: row.email,
          mensaje: row.mensaje,
          tipo: row.tipo,
          template: opts.template || row.tipo,
          inmueble: opts.inmueble,
          extra: opts.notifyExtra || opts.extra,
        });
      }
      opts.onLeadCreated?.(leadRow);
      opts.onSuccess?.();
      const landingSlug = opts.extra?.landing || row.origen;
      const trackParams = {
        lead_type: row.tipo,
        origen: row.origen,
        landing_slug: landingSlug,
        inmueble_id: opts.inmueble_id || '',
        cluster: opts.extra?.cluster || document.body?.dataset?.nhCluster || '',
        method: opts.method || 'form',
      };
      window.nhSeo?.track('generate_lead', trackParams);
      if (row.tipo === 'venta' && landingSlug) {
        window.nhSeo?.track('lead_valoracion', trackParams);
      }
      return true;
    } catch (err) {
      console.error('nhSubmitLead', err);
      if (opts.errorMsg !== false) {
        window.nhToast?.(opts.errorMsg || 'Error al enviar. Llámanos al 603 656 587 o por WhatsApp.');
      }
      opts.onError?.(err);
      return false;
    }
  };
})();
