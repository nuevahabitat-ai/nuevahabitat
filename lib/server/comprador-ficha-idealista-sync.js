/**
 * Ficha comprador = características del anuncio / inmueble NH consultado.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import {
  compradorTieneIdealista,
  fetchCompradorIdsConInteresIdealista,
} from './compradores-idealista-candidates.js';
import { idealistaIdsFromNotas } from './comprador-idealista-piso.js';
import { finalizeIdealistaCompradorFichas } from './idealista-compradores-post-import.js';
import { warmIdealistaPrecioCache } from './idealista-listing-snapshot.js';

const SELECT =
  'id,nombre,telefono,notas,activo,presupuesto_max,presupuesto_min,tipo_inmueble,zona_buscada,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable,exterior_indispensable,planta_max_sin_ascensor';

export function compradorFichaIdealistaIncompleta(c) {
  if (!c || c.activo === false) return false;
  if (!compradorTieneIdealista(c, null)) return false;
  if (c.presupuesto_max == null || c.presupuesto_min == null) return true;
  if (!c.tipo_inmueble || !c.zona_buscada) return true;
  if (c.habitaciones_min == null || c.m2_min == null || c.banos_min == null) return true;
  if (c.ascensor == null) return true;
  return false;
}

async function fetchCompradoresActivosIdealista(limit) {
  const byId = new Map();
  const push = (rows) => {
    for (const r of rows || []) {
      if (r?.id && r.activo !== false) byId.set(r.id, r);
    }
  };

  const r1 = await fetch(
    `${SB_URL}/rest/v1/compradores?activo=eq.true&notas=ilike.*Idealista*&select=${SELECT}&order=created_at.desc&limit=${limit}`,
    { headers: svcHeaders() },
  );
  if (r1.ok) push(await r1.json());

  const interesIds = [...(await fetchCompradorIdsConInteresIdealista())];
  const chunk = 60;
  for (let i = 0; i < interesIds.length; i += chunk) {
    const slice = interesIds.slice(i, i + chunk);
    const inList = slice.map((id) => encodeURIComponent(id)).join(',');
    const res = await fetch(
      `${SB_URL}/rest/v1/compradores?id=in.(${inList})&activo=eq.true&select=${SELECT}&limit=${chunk}`,
      { headers: svcHeaders() },
    );
    if (res.ok) push(await res.json());
  }

  return [...byId.values()];
}

/**
 * Warm caché + rellenar todas las columnas de búsqueda desde el piso Idealista/NH.
 */
export async function syncCompradorFichasDesdeAnuncio(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 500, 500);
  const rows = await fetchCompradoresActivosIdealista(limit);
  const targets = opts.compradorIds?.length
    ? rows.filter((c) => opts.compradorIds.includes(c.id))
    : rows.filter((c) => compradorFichaIdealistaIncompleta(c));

  if (!targets.length) {
    return { ok: true, total: 0, fichas: { total: 0, actualizadas: 0, completadas: 0 } };
  }

  const idealistaIds = new Set();
  for (const c of targets) {
    for (const id of idealistaIdsFromNotas(c.notas)) idealistaIds.add(id);
  }

  const warm =
    idealistaIds.size && opts.dryRun !== true
      ? await warmIdealistaPrecioCache([...idealistaIds], {
          maxScrape: Math.min(Number(opts.maxScrape) || 80, 120),
          delayMs: 240,
        })
      : null;

  const fichas = await finalizeIdealistaCompradorFichas(
    targets.map((c) => c.id),
    {
      fetchListing: opts.fetchListing !== false && opts.dryRun !== true,
      onlyIfEmpty: false,
      fillAllFromPiso: true,
      alwaysPresupuesto: true,
    },
  );

  return {
    ok: true,
    candidatos: rows.length,
    total: targets.length,
    warm,
    fichas,
    actualizadas: fichas.actualizadas ?? 0,
  };
}