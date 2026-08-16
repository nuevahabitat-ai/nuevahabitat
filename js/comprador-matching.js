/** Matching comprador ↔ inmueble (misma lógica que admin-panel) */
window.nhMatching = {
  zonaCoincide(zonaBuscada, barrio, municipio) {
    if (!zonaBuscada || !String(zonaBuscada).trim()) return true;
    const needle = String(zonaBuscada).toLowerCase().trim();
    const haystack = `${barrio || ''} ${municipio || ''}`.toLowerCase().trim();
    if (!haystack) return needle.length < 3;
    if (haystack.includes(needle) || needle.includes(haystack)) return true;
    const terms = needle.split(/[,·\s]+/).filter((t) => t.length >= 3);
    return terms.some(
      (t) => haystack.includes(t)
        || needle.includes((barrio || '').toLowerCase())
        || needle.includes((municipio || '').toLowerCase())
    );
  },

  matchCompradorInmueble(comprador, inmueble) {
    if (!comprador || !inmueble) return false;
    if (comprador.activo === false) return false;
    const estado = inmueble.estado || 'disponible';
    if (!['disponible', 'reservado'].includes(estado)) return false;
    if (comprador.presupuesto_max != null && inmueble.precio != null) {
      if (Number(inmueble.precio) > Number(comprador.presupuesto_max)) return false;
    }
    if (comprador.habitaciones_min != null) {
      if (!inmueble.habitaciones || Number(inmueble.habitaciones) < Number(comprador.habitaciones_min)) return false;
    }
    if (comprador.ascensor && !inmueble.ascensor) return false;
    if (!this.zonaCoincide(comprador.zona_buscada, inmueble.barrio, inmueble.municipio)) return false;
    return true;
  },

  filterMatches(comprador, inmuebles) {
    return (inmuebles || []).filter((p) => this.matchCompradorInmueble(comprador, p));
  },
};
