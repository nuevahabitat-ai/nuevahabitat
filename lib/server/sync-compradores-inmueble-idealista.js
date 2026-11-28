/**
 * Tras vincular idealista_id a un inmueble NH: compradores con interés en ese ID
 * reciben presupuesto desde el precio del piso (máx = precio, mín = máx − 50.000 €).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';
import { backfillPresupuestoByIdealistaIds } from './comprador-presupuesto-idealista-id.js';

async function fetchCompradorIdsForIdealistaIds(idealistaIds) {
  const set = new Set();
  for (const iid of idealistaIds) {
    const res = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(iid)}&select=comprador_id&limit=500`,
      { headers: svcHeaders() },
    );
    if (!res.ok) continue;
    for (const row of await res.json()) {
      if (row.comprador_id) set.add(row.comprador_id);
    }
  }
  return [...set];
}

async function linkInteresesToInmueble(inmuebleId, idealistaIds) {
  if (!inmuebleId || !idealistaIds.length) return 0;
  const inmRes = await fetch(
    `${SB_URL}/rest/v1/inmuebles?id=eq.${encodeURIComponent(inmuebleId)}&select=id,ref,precio&limit=1`,
    { headers: svcHeaders() },
  );
  if (!inmRes.ok) return 0;
  const [inm] = await inmRes.json();
  if (!inm) return 0;
  const precio =
    inm.precio != null && Number(inm.precio) >= 40_000 ? Math.round(Number(inm.precio)) : null;
  let n = 0;
  for (const iid of idealistaIds) {
    const patch = { inmueble_id: inmuebleId };
    if (inm.ref) patch.inmueble_ref = String(inm.ref).trim();
    if (precio != null) patch.precio_consultado = precio;
    const res = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?idealista_id=eq.${encodeURIComponent(iid)}`,
      {
        method: 'PATCH',
        headers: svcHeaders('return=minimal'),
        body: JSON.stringify(patch),
      },
    );
    if (res.ok) n += 1;
  }
  return n;
}

export async function syncCompradoresAfterInmuebleIdealistaLink(opts = {}) {
  const inmuebleId = opts.inmuebleId || null;
  const idealistaIds = [...new Set((opts.idealistaIds || []).map(normalizeIdealistaId).filter(Boolean))];
  if (!idealistaIds.length) {
    return { ok: true, actualizados: 0, compradores: 0, mensaje: 'Sin ID Idealista' };
  }

  const intereses = await linkInteresesToInmueble(inmuebleId, idealistaIds);
  const compradorIds = await fetchCompradorIdsForIdealistaIds(idealistaIds);
  if (!compradorIds.length) {
    return {
      ok: true,
      actualizados: 0,
      compradores: 0,
      intereses,
      idealistaIds,
      mensaje: 'Ningún comprador con interés en este ID',
    };
  }

  const back = await backfillPresupuestoByIdealistaIds({
    compradorIds,
    limit: 500,
    forceAll: true,
    maxScrape: 40,
  });

  return {
    ...back,
    compradores: compradorIds.length,
    compradorIds,
    intereses,
    idealistaIds,
  };
}