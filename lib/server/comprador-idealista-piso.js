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
  'id,ref,idealista_id,precio,titulo,barrio,municipio,habitaciones,banos,m2_utiles,m2_construidos,ascensor,tipo,balcon,terraza';

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

function parseEuroFromText(text) {
  const found = [];
  for (const m of String(text || '').matchAll(/(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*€/gi)) {
    const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
    if (n >= 40_000 && n <= 15_000_000) found.push(n);
  }
  return found;
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
      if (!snap) {
        snap = {
          precio,
          habitaciones: cached.habitaciones != null ? Number(cached.habitaciones) : null,
          tipo: tipoFromDescripcion(lead.descripcion || cached.titulo),
          zona: zonaFromDescripcion(lead.descripcion || cached.titulo),
          ascensor: null,
          banos: null,
          m2: null,
          balcon: null,
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
    snap = {
      precio,
      habitaciones: null,
      tipo: tipoFromDescripcion(blob),
      zona: zonaFromDescripcion(blob),
      ascensor: null,
      banos: null,
      m2: null,
      balcon: null,
    };
  }

  if (snap && precio != null) snap.precio = precio;
  return { snap, precio };
}

export function buildCompradorPatchFromPiso(comprador, snap, precio, opts = {}) {
  const onlyIfEmpty = opts.onlyIfEmpty !== false;
  const patch = {};

  if (precio != null && precio >= 40_000) {
    const max = Math.round(precio);
    const min = Math.max(0, max - PRESUPUESTO_MARGEN_INFER);
    if (!onlyIfEmpty || comprador.presupuesto_max == null) {
      patch.presupuesto_max = max;
      patch.presupuesto_min = min;
    } else if (onlyIfEmpty && comprador.presupuesto_min == null) {
      patch.presupuesto_min = min;
    }
  }

  if (!snap) return patch;

  if (snap.tipo && (!onlyIfEmpty || !comprador.tipo_inmueble)) patch.tipo_inmueble = snap.tipo;
  if (snap.zona && (!onlyIfEmpty || !comprador.zona_buscada)) patch.zona_buscada = snap.zona;
  if (snap.habitaciones != null && (!onlyIfEmpty || comprador.habitaciones_min == null))
    patch.habitaciones_min = snap.habitaciones;
  if (snap.banos != null && (!onlyIfEmpty || comprador.banos_min == null)) patch.banos_min = snap.banos_min;
  if (snap.m2 != null && (!onlyIfEmpty || comprador.m2_min == null)) patch.m2_min = snap.m2;
  if (snap.ascensor === true && (!onlyIfEmpty || !comprador.ascensor)) patch.ascensor = true;
  if (snap.balcon === true && (!onlyIfEmpty || !comprador.balcon_terraza_indispensable))
    patch.balcon_terraza_indispensable = true;

  return patch;
}

/**
 * Varios intereses del mismo teléfono (import XLS).
 */
export async function patchFromIdealistaInterests(interests, inmByIdealista, inmByRef, existing = null, opts = {}) {
  let bestPrecio = null;
  let bestSnap = null;

  for (const inter of interests) {
    let inm = null;
    if (inter.idealista_id && inmByIdealista?.has(inter.idealista_id))
      inm = inmByIdealista.get(inter.idealista_id);
  const lead = {
      idealista_id: inter.idealista_id,
      descripcion: inter.descripcion,
      precio_anuncio: inter.precio_anuncio ?? inter.precio_inmueble,
      precio_consultado: inter.precio_consultado,
      inmueble: inm,
      mensaje: inter.mensaje,
    };
    const { snap, precio } = await resolveIdealistaLeadPiso(lead, {
      fetchListing: opts.fetchListing !== false,
    });
    if (precio != null && (bestPrecio == null || precio > bestPrecio)) {
      bestPrecio = precio;
      bestSnap = snap;
    }
  }

  const base = existing || {};
  return buildCompradorPatchFromPiso(base, bestSnap, bestPrecio, { onlyIfEmpty: !existing });
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

  if (!leads.length) return { ok: true, skipped: 'sin idealista', patch: {} };

  let bestPrecio = null;
  let bestSnap = null;
  for (const lead of leads) {
    const { snap, precio } = await resolveIdealistaLeadPiso(lead, {
      fetchListing: opts.fetchListing !== false,
    });
    if (precio != null && (bestPrecio == null || precio > bestPrecio)) {
      bestPrecio = precio;
      bestSnap = snap;
    }
  }

  const patch = buildCompradorPatchFromPiso(comprador, bestSnap, bestPrecio, {
    onlyIfEmpty: opts.onlyIfEmpty !== false,
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
