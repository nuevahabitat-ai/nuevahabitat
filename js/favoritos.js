/** Favoritos en tarjetas de inmuebles (home, listados) */
window.nhFavoritos = {
  _cache: new Set(),

  async init(ids) {
    if (!window.nhSupabase || !ids?.length) return;
    const { data: { user } } = await window.nhSupabase.auth.getUser();
    if (!user) return;
    const { data } = await window.nhSupabase.from('favoritos')
      .select('id,inmueble_id').eq('user_id', user.id).in('inmueble_id', ids);
    this._cache = new Set((data || []).map(f => f.inmueble_id));
    this._map = {};
    (data || []).forEach(f => { this._map[f.inmueble_id] = f.id; });
    document.querySelectorAll('[data-fav-id]').forEach(btn => this.paint(btn, this._cache.has(btn.dataset.favId)));
  },

  paint(btn, on) {
    const svg = btn.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('fill', on ? '#e84545' : 'none');
    svg.setAttribute('stroke', on ? '#e84545' : 'currentColor');
    btn.classList.toggle('is-fav', on);
  },

  async toggle(e, inmuebleId) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.nhSupabase) return;
    const { data: { session } } = await window.nhSupabase.auth.getSession();
    if (!session) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(location.href);
      return;
    }
    const btn = e.currentTarget;
    if (this._cache.has(inmuebleId)) {
      const fid = this._map?.[inmuebleId];
      if (fid) await window.nhSupabase.from('favoritos').delete().eq('id', fid);
      this._cache.delete(inmuebleId);
      delete this._map[inmuebleId];
      this.paint(btn, false);
    } else {
      const { data, error } = await window.nhSupabase.from('favoritos')
        .insert({ user_id: session.user.id, inmueble_id: inmuebleId }).select('id').single();
      if (error) {
        nhToast('No se pudo guardar. ¿Has iniciado sesión?');
        return;
      }
      if (data) {
        this._cache.add(inmuebleId);
        this._map = this._map || {};
        this._map[inmuebleId] = data.id;
        this.paint(btn, true);
      }
    }
  }
};
