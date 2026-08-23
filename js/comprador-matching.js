/** Matching comprador ↔ inmueble con scoring (panel + admin) */
window.nhMatching = {
  /** Alias y zonas vecinas para matching flexible */
  ZONA_GROUPS: {
    eixample: ['eixample', 'sagrada familia', 'dreta', 'esquerra', '08007', '08009'],
    gracia: ['gracia', 'gràcia', 'vila de gracia', 'camp d en grassa'],
    les_corts: ['les corts', 'numancia', 'zona universitaria', 'camp nou', '08028'],
    sant_marti: ['sant marti', 'sant martí', 'poblenou', 'clot', 'sagrera', '22@', 'diagonal mar', 'el besos'],
    sant_andreu: ['sant andreu', 'bon pastor', 'la sagrera', 'trinitat vella'],
    horta: ['horta', 'guinardo', 'guinardó', 'montbau', 'valldaura'],
    nou_barris: ['nou barris', 'roquetes', 'verdum', 'trinitat vella', 'porta'],
    l_hospitalet: ['hospitalet', "l'hospitalet", 'bellvitge', 'pubilla cases', '08901', '08902'],
    badalona: ['badalona', 'montgat', 'litoral norte', '08911', '08912', '08915'],
    cornella: ['cornella', 'cornellà', '08940'],
    area_metro: ['area metropolitana', 'área metropolitana', 'metro barcelona', 'baix llobregat', 'besos'],
  },

  METRO_MUNICIPIOS: ['badalona', "l'hospitalet", 'hospitalet', 'cornella', 'cornellà', 'esplugues', 'sant just', 'santa coloma'],

  normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  },

  expandZonaTerms(zonaBuscada) {
    const base = this.normalize(zonaBuscada);
    if (!base) return [];
    const terms = new Set([base]);
    base.split(/[,·/\s]+/).filter((t) => t.length >= 3).forEach((t) => terms.add(t));
    Object.entries(this.ZONA_GROUPS).forEach(([, aliases]) => {
      const hit = aliases.some((a) => base.includes(this.normalize(a)) || this.normalize(a).includes(base));
      if (hit) aliases.forEach((a) => terms.add(this.normalize(a)));
    });
    if (/area metropolitana|metro barcelona|baix llobregat/.test(base)) {
      this.METRO_MUNICIPIOS.forEach((m) => terms.add(this.normalize(m)));
    }
    return [...terms];
  },

  zonaCoincide(zonaBuscada, barrio, municipio) {
    if (!zonaBuscada || !String(zonaBuscada).trim()) return true;
    const haystack = this.normalize(`${barrio || ''} ${municipio || ''}`);
    if (!haystack || haystack.length < 2) return this.normalize(zonaBuscada).length < 3;
    const terms = this.expandZonaTerms(zonaBuscada);
    return terms.some((t) => {
      if (t.length < 3) return false;
      return haystack.includes(t) || t.includes(haystack)
        || (barrio && t.includes(this.normalize(barrio)))
        || (municipio && t.includes(this.normalize(municipio)));
    });
  },

  tipoCoincide(tipoBuscado, tipoInmueble) {
    if (!tipoBuscado || !String(tipoBuscado).trim()) return true;
    const want = this.normalize(tipoBuscado);
    const have = this.normalize(tipoInmueble || 'piso');
    if (want === have) return true;
    const map = {
      piso: ['piso', 'atico', 'ático', 'duplex', 'dúplex', 'estudio'],
      casa: ['casa', 'chalet', 'adosado', 'unifamiliar'],
      local: ['local', 'comercial', 'negocio'],
    };
    const group = Object.entries(map).find(([, vals]) => vals.some((v) => want.includes(v)));
    if (!group) return have.includes(want) || want.includes(have);
    return group[1].some((v) => have.includes(v));
  },

  scorePresupuesto(presupuestoMax, precio) {
    if (presupuestoMax == null || precio == null) return 20;
    const max = Number(presupuestoMax);
    const p = Number(precio);
    if (!Number.isFinite(max) || !Number.isFinite(p)) return 15;
    if (p <= max) {
      const ratio = p / max;
      return ratio >= 0.75 ? 30 : 25;
    }
    const over = (p - max) / max;
    if (over > 0.12) return -999;
    if (over <= 0.05) return 18;
    if (over <= 0.08) return 10;
    return 4;
  },

  scoreZona(zonaBuscada, barrio, municipio) {
    if (!zonaBuscada || !String(zonaBuscada).trim()) return 15;
    if (!this.zonaCoincide(zonaBuscada, barrio, municipio)) return -999;
    const terms = this.expandZonaTerms(zonaBuscada);
    const hay = this.normalize(`${barrio || ''} ${municipio || ''}`);
    const exact = terms.some((t) => t.length >= 4 && (hay === t || hay.includes(` ${t}`) || hay.startsWith(`${t} `)));
    return exact ? 25 : 18;
  },

  scoreCompradorInmueble(comprador, inmueble) {
    const reasons = [];
    if (!comprador || !inmueble) return { match: false, score: 0, reasons: ['Datos incompletos'] };
    if (comprador.activo === false) return { match: false, score: 0, reasons: ['Comprador inactivo'] };

    const estado = inmueble.estado || 'disponible';
    if (!['disponible', 'reservado'].includes(estado)) {
      return { match: false, score: 0, reasons: ['Inmueble no disponible'] };
    }

    let score = 0;

    const sp = this.scorePresupuesto(comprador.presupuesto_max, inmueble.precio);
    if (sp === -999) return { match: false, score: 0, reasons: ['Fuera de presupuesto'] };
    score += sp;
    if (sp >= 25) reasons.push('Dentro de presupuesto');
    else if (sp >= 10) reasons.push('Ligeramente por encima del presupuesto');

    const sz = this.scoreZona(comprador.zona_buscada, inmueble.barrio, inmueble.municipio);
    if (sz === -999) return { match: false, score: 0, reasons: ['Zona no coincide'] };
    score += sz;
    if (sz >= 20) reasons.push('Zona buscada');

    if (comprador.habitaciones_min != null) {
      const hab = Number(inmueble.habitaciones);
      const min = Number(comprador.habitaciones_min);
      if (!hab || hab < min) return { match: false, score: 0, reasons: ['Menos habitaciones de las requeridas'] };
      score += hab >= min + 1 ? 15 : 10;
      reasons.push(`${hab} habitaciones`);
    } else {
      score += 5;
    }

    if (comprador.ascensor && !inmueble.ascensor) {
      return { match: false, score: 0, reasons: ['Sin ascensor'] };
    }
    if (comprador.ascensor && inmueble.ascensor) {
      score += 8;
      reasons.push('Con ascensor');
    }

    if (!this.tipoCoincide(comprador.tipo_inmueble, inmueble.tipo)) {
      return { match: false, score: 0, reasons: ['Tipo de inmueble distinto'] };
    }
    if (comprador.tipo_inmueble) {
      score += 7;
      reasons.push('Tipo compatible');
    }

    if (inmueble.m2_utiles != null && Number(inmueble.m2_utiles) >= 70) {
      score += 5;
    }

    score = Math.min(100, Math.max(0, score));
    const minScore = 45;
    return { match: score >= minScore, score, reasons, label: this.scoreLabel(score) };
  },

  scoreLabel(score) {
    if (score >= 85) return 'Excelente';
    if (score >= 70) return 'Muy bueno';
    if (score >= 55) return 'Bueno';
    return 'Compatible';
  },

  matchCompradorInmueble(comprador, inmueble) {
    return this.scoreCompradorInmueble(comprador, inmueble).match;
  },

  rankMatches(comprador, inmuebles, opts = {}) {
    const limit = opts.limit ?? 12;
    const minScore = opts.minScore ?? 45;
    return (inmuebles || [])
      .map((inmueble) => ({ inmueble, ...this.scoreCompradorInmueble(comprador, inmueble) }))
      .filter((r) => r.match && r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },

  filterMatches(comprador, inmuebles) {
    return this.rankMatches(comprador, inmuebles).map((r) => r.inmueble);
  },
};
