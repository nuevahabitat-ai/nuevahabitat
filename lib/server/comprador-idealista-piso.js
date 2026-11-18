/**
 * Regla Idealista: presupuesto max = precio venta del piso; min = max - 50k;
 * criterios = características de ese inmueble (NH, caché o descripción).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { PRESUPUESTO_MARGEN_INFER, snapshotFromInmueble } from './comprador-infer-criterios.js';
import { getIdealistaPrecioCache } from './idealista-precio-cache.js';
import { normalizeIdealistaId } from './idealista-id.js';
import { fetchIdealistaListingSnapshot } from './idealista-listing-snapshot.js';

const INM_SELECT =
  'id,ref,idealista_id,precio,titulo,barrio,municipio,direccion,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,balcon,terraza,planta,orientacion';

export function tipoFromDescripcion(desc) {
  const s = String(desc || '').toLowerCase();
  if (/\bático\b|\batico\b/.test(s)) return 'atico';
  if (/\bdúplex\b|\bduplex\b/.test(s)) return 'duplex';
  if (/\bcasa\b|\bchalet\b|\badosado\b/.test(s)) return 'casa';
  if (/\blocal\b/.test(s)) return 'local';
  if (/\bgaraje\b/.test(s)) return 'garaje';
  if (/\bpiso\b|\bapartamento\b|\btownhouse\b/.test(s)) return 'piso';
  return null;
}

export function zonaFromDescripcion(desc) {
  const s = String(desc || '').trim();
  if (!s) return null;
  const m = s.match(/en venta en\s+(.+)/i);
  if (m) return m[1].replace(/\s*·.*$/, '').trim().slice(0, 240);
  return s.slice(0, 240);
}

export function parseEuroFromText(text) {
  const found = [];
  for (const m of String(text || '').matchAll(/(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*€/gi)) {
    const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
    if (n >= 40_000 && n <= 15_000_000) found.push(n);
  }
  return found;
}

export function parseHabitacionesFromText(text) {
  const s = String(text || '');
  const m = s.match(/(\d+)\s*(?:hab(?:itaciones?)?\.?|dormitorios?)/i);
  if (m) return Math.min(10, Math.max(1, parseInt(m[1], 10)));
  const m2 = s.match(/\b([1-9])\s*hab\b/i);
  return m2 ? parseInt(m2[1], 10) : null;
}

export function parseM2FromText(text) {
  const m = String(text || '').match(/(\d{2,3})\s*m[²2]\b/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 25 && n <= 800 ? n : null;
}

export function parseBanosFromText(text) {
  const m = String(text || '').match(/(\d+)\s*(?:ba[ñn]os?\.?)/i);
  if (m) return Math.min(5, Math.max(1, parseInt(m[1], 10)));
  return null;
}

/** Completa huecos del snapshot con texto Idealista (DESCRIPCIÓN). */
export function enrichSnapFromText(snap, text) {
  const s = snap ? { ...snap } : {};
  const blob = String(text || '');
  if (s.habitaciones == null) s.habitaciones = parseHabitacionesFromText(blob);
  if (s.m2 == null) s.m2 = parseM2FromText(blob);
  if (s.banos == null) s.banos = parseBanosFromText(blob);
  if (s.tipo == null) s.tipo = tipoFromDescripcion(blob);
  if (!s.zona) s.zona = zonaFromDescripcion(blob);
  if (s.ascensor == null && /\bascensor\b/i.test(blob)) s.ascensor = true;
  if (!s.balcon && /\b(bal[có]n|terraza)\b/i.test(blob)) s.balcon = true;
  if (!s.exterior && /\bexterior\b/i.test(blob)) s.exterior = true;
  return Object.keys(s).length ? s : null;
}

/** Elige el piso principal (precio más alto) y fusiona datos que falten en otros contactos. */
export function mergeLeadSnaps(pairs) {
  const items = (pairs || []).filter((p) => p && (p.snap || p.precio != null));
  if (!items.length) return { snap: null, precio: null };
  let best = items[0];
  for (const p of items) {
    const pr = p.precio ?? p.snap?.precio ?? 0;
    const bestPr = best.precio ?? best.snap?.precio ?? 0;
    if (pr > bestPr) best = p;
  }
  const primary = best.snap ? { ...best.snap } : {};
  if (best.precio != null) primary.precio = best.precio;
  for (const p of items) {
    const s = p.snap;
    if (!s) continue;
    for (const k of [
      'habitaciones',
      'banos',
      'm2',
      'tipo',
      'zona',
      'ascensor',
      'balcon',
      'exterior',
      'planta_max_sin_ascensor',
    ]) {
      if (primary[k] == null && s[k] != null) primary[k] = s[k];
      if (k === 'ascensor' || k === 'balcon' || k === 'exterior') {
        if (s[k] === true) primary[k] = true;
      }
      if (k === 'habitaciones' || k === 'banos' || k === 'm2') {
        const a = Number(primary[k]);
        const b = Number(s[k]);
        if (!Number.isNaN(b) && (Number.isNaN(a) || b > a)) primary[k] = b;
      }
    }
  }
  const precio =
    best.precio ?? primary.precio ?? Math.max(...items.map((p) => p.precio ?? p.snap?.precio ?? 0).filter(Boolean));
  return { snap: primary, precio: precio > 0 ? precio : null };
}

export function idealistaIdsFromNotas(notas) {
  const ids = new Set();
  const text = String(notas || '');
  for (const m of text.matchAll(/Idealista\s+(\d{6,})/gi)) {
    const id = normalizeIdealistaId(m[1]);
    if (id) ids.add(id);
  }
  return [...ids];
}

export function nhRefsFromNotas(notas) {
  const refs = new Set();
  const text = String(notas || '');
  for (const m of text.matchAll(/\b(NH-\d{4}-\d+)\b/gi)) refs.add(m[1].toUpperCase());
  for (const m of text.matchAll(/NH-NH-(\d{4}-\d+)/gi)) refs.add(`NH-${m[1]}`);
  return [...refs];
}

async function fetchInmuebleByRef(ref) {
  const r = String(ref || '').trim().toUpperCase();
  if (!/^NH-\d{4}-\d+$/.test(r)) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?ref=eq.${encodeURIComponent(r)}&select=${INM_SELECT}&limit=1`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function fetchInmuebleByIdealistaId(idealistaId) {
  const id = normalizeIdealistaId(idealistaId);
  if (!id) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?idealista_id=eq.${encodeURIComponent(id)}&select=${INM_SELECT}&limit=1`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function fetchInmuebleById(inmuebleId) {
  if (!inmuebleId) return null;
  const res = await fetch(
    `${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}&select=${INM_SELECT}&limit=1`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function fetchInteres(compradorId) {
  const res = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&select=idealista_id,descripcion,mensaje,precio_consultado,inmueble_id,inmueble_ref&limit=50`,
    { headers: svcHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * @param {{ idealista_id?: string, descripcion?: string, precio_anuncio?: number, precio_consultado?: number, inmueble?: object }} lead
 */
export async function resolveIdealistaLeadPiso(lead, opts = {}) {
  let inm = lead.inmueble || null;
  if (!inm && lead.inmueble_id) inm = await fetchInmuebleById(lead.inmueble_id);
  if (!inm && lead.idealista_id) inm = await fetchInmuebleByIdealistaId(lead.idealista_id);

  let snap = inm ? snapshotFromInmueble(inm) : null;
  let precio =
    lead.precio_consultado != null
      ? Number(lead.precio_consultado)
      : lead.precio_anuncio != null
        ? Number(lead.precio_anuncio)
        : snap?.precio ?? null;

  if ((precio == null || precio < 40_000) && lead.idealista_id) {
    const cached = await getIdealistaPrecioCache(lead.idealista_id);
    if (cached?.precio) {
      precio = Number(cached.precio);
      const blob = [lead.descripcion, lead.mensaje, cached.titulo].filter(Boolean).join(' ');
      if (!snap) {
        snap = {
          precio,
          habitaciones:
            cached.habitaciones != null
              ? Number(cached.habitaciones)
              : parseHabitacionesFromText(blob),
          tipo: tipoFromDescripcion(blob),
          zona: zonaFromDescripcion(blob),
          ascensor: /\bascensor\b/i.test(blob) ? true : null,
          banos: null,
          m2: parseM2FromText(blob),
          balcon: /\b(bal[có]n|terraza)\b/i.test(blob) ? true : null,
        };
      }
    }
  }

  if ((precio == null || precio < 40_000) && lead.idealista_id && opts.fetchListing !== false) {
    const fetched = await fetchIdealistaListingSnapshot(lead.idealista_id);
    if (fetched?.precio >= 40_000) {
      precio = fetched.precio;
      snap = {
        precio: fetched.precio,
        habitaciones: fetched.habitaciones,
        banos: fetched.banos,
        m2: fetched.m2,
        ascensor: fetched.ascensor === true,
        tipo: fetched.tipo || tipoFromDescripcion(lead.descripcion),
        zona: fetched.zona || zonaFromDescripcion(lead.descripcion),
        balcon: null,
      };
    }
  }

  const blob = [lead.descripcion, lead.mensaje].filter(Boolean).join(' ');
  if (precio == null && blob) {
    const parsed = parseEuroFromText(blob);
    if (parsed.length) precio = Math.max(...parsed);
  }

  if (!snap && (blob || precio != null)) {
    snap = enrichSnapFromText({ precio }, blob) || {
      precio,
      habitaciones: null,
      tipo: tipoFromDescripcion(blob),
      zona: zonaFromDescripcion(blob),
      ascensor: null,
      banos: null,
      m2: null,
      balcon: null,
    };
  } else if (snap && blob) {
    snap = enrichSnapFromText(snap, blob) || snap;
  }

  if (snap && precio != null) snap.precio = precio;
  if (inm && snap) {
    const fromInm = snapshotFromInmueble(inm);
    snap = mergeLeadSnaps([{ snap: fromInm, precio: fromInm?.precio }, { snap, precio }]).snap || snap;
    if (precio != null) snap.precio = precio;
  }
  return { snap, precio };
}

function maySet(opts, comprador, field) {
  if (opts.fillAllFromPiso === true) return true;
  if (opts.onlyIfEmpty === false) return true;
  const v = comprador[field];
  return v == null || v === '' || v === false;
}

export function buildCompradorPatchFromPiso(comprador, snap, precio, opts = {}) {
  const alwaysPresupuesto = opts.alwaysPresupuesto === true;
  const patch = {};

  if (precio != null && precio >= 40_000) {
    const max = Math.round(precio);
    const min = Math.max(0, max - PRESUPUESTO_MARGEN_INFER);
    const needPresupuesto =
      alwaysPresupuesto ||
      opts.fillAllFromPiso === true ||
      comprador.presupuesto_max == null ||
      comprador.presupuesto_max === '' ||
      opts.onlyIfEmpty === false;
    if (needPresupuesto) {
      patch.presupuesto_max = max;
      patch.presupuesto_min = min;
    } else if (comprador.presupuesto_min == null) {
      patch.presupuesto_min = min;
    }
  }

  if (!snap) return patch;

  if (snap.tipo && maySet(opts, comprador, 'tipo_inmueble')) patch.tipo_inmueble = snap.tipo;
  if (snap.zona && maySet(opts, comprador, 'zona_buscada')) patch.zona_buscada = snap.zona;
  if (snap.habitaciones != null && maySet(opts, comprador, 'habitaciones_min'))
    patch.habitaciones_min = snap.habitaciones;
  if (snap.banos != null && maySet(opts, comprador, 'banos_min')) patch.banos_min = snap.banos_min;
  if (snap.m2 != null && maySet(opts, comprador, 'm2_min')) patch.m2_min = snap.m2;
  if (snap.ascensor === true && maySet(opts, comprador, 'ascensor')) patch.ascensor = true;
  if (snap.balcon === true && maySet(opts, comprador, 'balcon_terraza_indispensable'))
    patch.balcon_terraza_indispensable = true;
  if (snap.exterior === true && maySet(opts, comprador, 'exterior_indispensable'))
    patch.exterior_indispensable = true;
  if (
    snap.planta_max_sin_ascensor != null &&
    !snap.ascensor &&
    maySet(opts, comprador, 'planta_max_sin_ascensor')
  ) {
    patch.planta_max_sin_ascensor = snap.planta_max_sin_ascensor;
  }

  return patch;
}

/**
 * Varios intereses del mismo teléfono (import XLS).
 */
export async function patchFromIdealistaInterests(interests, inmByIdealista, inmByRef, existing = null, opts = {}) {
  const pairs = [];

  for (const inter of interests) {
    let inm = null;
    if (inter.idealista_id && inmByIdealista?.has(inter.idealista_id))
      inm = inmByIdealista.get(inter.idealista_id);
    if (!inm && inter.inmueble_ref && inmByRef?.has(String(inter.inmueble_ref).toUpperCase()))
      inm = inmByRef.get(String(inter.inmueble_ref).toUpperCase());
    const lead = {
      idealista_id: inter.idealista_id,
      descripcion: inter.descripcion,
      precio_anuncio: inter.precio_anuncio ?? inter.precio_inmueble,
      precio_consultado: inter.precio_consultado,
      inmueble: inm,
      inmueble_id: inter.inmueble_id,
      mensaje: inter.mensaje,
    };
    const { snap, precio } = await resolveIdealistaLeadPiso(lead, {
      fetchListing: opts.fetchListing !== false,
    });
    pairs.push({ snap, precio });
  }

  const { snap: bestSnap, precio: bestPrecio } = mergeLeadSnaps(pairs);
  const base = existing || {};
  const importMode = opts.fillAllFromPiso === true || opts.onImport === true;
  return buildCompradorPatchFromPiso(base, bestSnap, bestPrecio, {
    onlyIfEmpty: importMode ? false : !existing,
    fillAllFromPiso: importMode,
    alwaysPresupuesto: opts.alwaysPresupuesto === true || importMode,
  });
}

export async function applyIdealistaPisoDefaultsForComprador(comprador, opts = {}) {
  const interes = await fetchInteres(comprador.id);
  const leads = [];

  for (const row of interes) {
    leads.push({
      idealista_id: row.idealista_id,
      descripcion: row.descripcion,
      mensaje: row.mensaje,
      precio_consultado: row.precio_consultado,
      inmueble_id: row.inmueble_id,
    });
  }

  for (const iid of idealistaIdsFromNotas(comprador.notas)) {
    if (!leads.some((l) => String(l.idealista_id) === String(iid))) {
      leads.push({ idealista_id: iid, descripcion: comprador.notas });
    }
  }

  const euros = parseEuroFromText(comprador.notas);
  const precioNotas = euros.length ? Math.max(...euros) : null;
  for (const ref of nhRefsFromNotas(comprador.notas)) {
    const inm = await fetchInmuebleByRef(ref);
    if (!inm) continue;
    const already = leads.some(
      (l) => l.inmueble_id === inm.id || String(l.idealista_id) === String(inm.idealista_id || ''),
    );
    if (!already) {
      leads.push({
        idealista_id: inm.idealista_id,
        descripcion: inm.titulo || comprador.notas,
        precio_consultado: inm.precio ?? precioNotas,
        inmueble_id: inm.id,
        inmueble: inm,
      });
    }
  }

  if (!leads.length) return { ok: true, skipped: 'sin idealista', patch: {} };

  const pairs = [];
  for (const lead of leads) {
    let inm = lead.inmueble;
    if (!inm && lead.inmueble_id) inm = await fetchInmuebleById(lead.inmueble_id);
    const { snap, precio } = await resolveIdealistaLeadPiso(
      { ...lead, inmueble: inm, precio_consultado: lead.precio_consultado ?? precioNotas },
      { fetchListing: opts.fetchListing !== false },
    );
    pairs.push({ snap, precio: precio ?? lead.precio_consultado ?? precioNotas });
  }
  const { snap: bestSnap, precio: bestPrecio } = mergeLeadSnaps(pairs);

  const patch = buildCompradorPatchFromPiso(comprador, bestSnap, bestPrecio, {
    onlyIfEmpty: opts.onlyIfEmpty !== false,
    fillAllFromPiso: opts.fillAllFromPiso === true,
    alwaysPresupuesto: opts.alwaysPresupuesto === true,
  });

  if (!Object.keys(patch).length) {
    return { ok: true, skipped: 'nada que actualizar', precio: bestPrecio };
  }

  if (opts.dryRun) return { ok: true, dryRun: true, patch, precio: bestPrecio };

  let body = { ...patch };
  let res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
    method: 'PATCH',
    headers: { ...svcHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok && body.presupuesto_min != null) {
    delete body.presupuesto_min;
    res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
      method: 'PATCH',
      headers: { ...svcHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify(body),
    });
  }
  if (!res.ok) return { ok: false, error: await res.text() };

  return { ok: true, patch, precio: bestPrecio };
}
