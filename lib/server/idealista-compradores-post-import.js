/**
 * Tras import Idealista: completar presupuesto y criterios en todas las fichas tocadas.
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { applyIdealistaPisoDefaultsForComprador, idealistaIdsFromNotas } from './comprador-idealista-piso.js';
import { warmIdealistaPrecioCache } from './idealista-listing-snapshot.js';

const SELECT =
  'id,nombre,telefono,notas,presupuesto_max,presupuesto_min,tipo_inmueble,zona_buscada,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable';

export async function finalizeIdealistaCompradorFichas(compradorIds, opts = {}) {
  const ids = [...new Set((compradorIds || []).filter(Boolean))].slice(0, 500);
  if (!ids.length) return { ok: true, total: 0, completadas: 0, actualizadas: 0 };

  const inList = ids.map((id) => encodeURIComponent(id)).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=${SELECT}&limit=${ids.length}`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();

  let actualizadas = 0;
  let completadas = 0;

  for (const c of rows) {
    const r = await applyIdealistaPisoDefaultsForComprador(c, {
      onlyIfEmpty: true,
      fetchListing: opts.fetchListing === true,
    });
    if (r.ok && r.patch && Object.keys(r.patch).length) actualizadas++;
    const max = r.precio ?? c.presupuesto_max;
    if (max != null && Number(max) >= 40_000) completadas++;
  }

  return {
    ok: true,
    total: rows.length,
    actualizadas,
    completadas,
    incompletas: rows.length - completadas,
  };
}

/** Compradores Idealista sin presupuesto: caché anuncios + rellenar ficha (máx/min/criterios). */
export async function warmYCompletarFichasIdealista(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 350, 500);
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?presupuesto_max=is.null&notas=ilike.*Idealista*&select=id,notas&order=created_at.desc&limit=${limit}`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();

  const idealistaIds = new Set();
  const compradorIds = [];
  for (const c of rows) {
    compradorIds.push(c.id);
    for (const iid of idealistaIdsFromNotas(c.notas)) idealistaIds.add(iid);
  }

  const warm = idealistaIds.size
    ? await warmIdealistaPrecioCache([...idealistaIds], {
        maxScrape: opts.maxScrape ?? 50,
        delayMs: 280,
      })
    : { ok: true, solicitados: 0, enCache: 0 };

  const fichas = await finalizeIdealistaCompradorFichas(compradorIds, { fetchListing: false });
  return { compradoresSinPresupuesto: rows.length, warm, fichas };
}
