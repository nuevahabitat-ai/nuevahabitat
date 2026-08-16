/** Panel comprador — inmuebles que encajan con tu perfil */
(function () {
  async function loadCompatibles() {
    const el = document.getElementById('compatiblesContent');
    const resumen = document.getElementById('compatiblesResumen');
    if (!el || !window.nhMatching || !window.currentUser) return;
    if (window.userTipo !== 'comprador') return;

    el.innerHTML = '<p style="color:var(--gris-medio);font-size:.875rem">Buscando inmuebles compatibles…</p>';

    const { data: comprador } = await window.nhSupabase.from('compradores')
      .select('id,nombre,activo,presupuesto_max,tipo_inmueble,habitaciones_min,ascensor,zona_buscada')
      .eq('email', currentUser.email)
      .maybeSingle();

    if (!comprador) {
      el.innerHTML = '<div class="p-empty"><p>Completa tu perfil de búsqueda para ver recomendaciones.</p></div>';
      return;
    }

    const cols = 'id,ref,titulo,precio,habitaciones,m2_utiles,barrio,municipio,estado,imagen_principal,ascensor';
    const { data: inmuebles, error } = await window.nhAuth.fetchInmuebles(cols, { column: 'created_at', ascending: false }, { estado: 'disponible' });

    if (error) {
      el.innerHTML = '<p style="color:#b91c1c;font-size:.875rem">No se pudieron cargar inmuebles.</p>';
      return;
    }

    const matches = nhMatching.filterMatches(comprador, inmuebles || []).slice(0, 12);

    if (resumen) {
      resumen.innerHTML = matches.length
        ? `<span class="nh-pay-chip nh-pay-chip--pending">${matches.length} compatible${matches.length === 1 ? '' : 's'}</span>`
        : '';
    }

    if (!matches.length) {
      el.innerHTML = `
        <div class="p-empty">
          <h4>Sin coincidencias por ahora</h4>
          <p>Cuando haya inmuebles que encajen con tu presupuesto, zona y criterios, aparecerán aquí.</p>
          <a href="/inmuebles" class="btn btn-gold" style="margin-top:1rem;font-size:.84rem">Explorar cartera</a>
        </div>`;
      return;
    }

    const criteria = [
      comprador.presupuesto_max ? `≤ ${Number(comprador.presupuesto_max).toLocaleString('es-ES')} €` : null,
      comprador.habitaciones_min ? `min. ${comprador.habitaciones_min} hab.` : null,
      comprador.zona_buscada || null,
    ].filter(Boolean).join(' · ');

    el.innerHTML = `
      <p style="font-size:.85rem;color:var(--gris-texto);margin-bottom:1rem;line-height:1.55">
        ${matches.length} inmueble${matches.length === 1 ? '' : 's'} en cartera encajan con tu búsqueda${criteria ? `: <strong>${criteria}</strong>` : ''}.
      </p>
      <div class="p-fav-grid">
        ${matches.map((p) => {
          const img = p.imagen_principal || 'imagenes/interior1.jpg';
          const loc = [p.barrio, p.municipio].filter(Boolean).join(', ');
          return `<a href="/inmueble-detalle?id=${p.id}" class="p-fav-card" style="text-decoration:none;color:inherit">
            <img src="${img}" alt="" loading="lazy" onerror="this.src='imagenes/interior1.jpg'"/>
            <div class="p-fav-card-body">
              <div style="font-size:.72rem;color:var(--oro);font-weight:700;margin-bottom:.2rem">${p.ref || ''}</div>
              <div style="font-size:.875rem;font-weight:600;line-height:1.35;margin-bottom:.25rem">${p.titulo || 'Inmueble'}</div>
              <div style="font-size:.8125rem;color:var(--gris-texto)">${p.precio != null ? Number(p.precio).toLocaleString('es-ES') + ' €' : ''}${loc ? ' · ' + loc : ''}</div>
            </div>
          </a>`;
        }).join('')}
      </div>
      <div style="text-align:center;margin-top:1.25rem">
        <a href="/inmuebles" class="btn btn-outline" style="font-size:.84rem">Ver todos los inmuebles</a>
      </div>`;
  }

  window.nhPanelCompatibles = { loadCompatibles };
})();
