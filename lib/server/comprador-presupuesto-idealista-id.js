/**
 * Rellena presupuesto_max / presupuesto_min cuando ya hay idealista_id (notas o interés).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { patchCompradorRow } from './compradores-api.js';
import { PRESUPUESTO_MARGEN_INFER } from './comprador-infer-criterios.js';
import { idealistaIdsFromNotas } from './comprador-idealista-piso.js';
import { getIdealistaPreciosBulk } from './idealista-precios-bulk.js';
import { warmIdealistaPrecioCache } from './idealista-listing-snapshot.js';
import { normalizeIdealistaId } from './idealista-id.js';

import {
  compradorTieneIdealista,
  fetchCompradoresPendientesCompraventa,
} from './compradores-idealista-candidates.js';

const SELECT = 'id,notas,presupuesto_max,presupuesto_min';

async function patchInteresPrecioConsultado(compradorId, idealistaId, precio) {
  if (!compradorId || !idealistaId || precio == null || precio < 40_000) return;
  const res = await fetch(
    `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(compradorId)}&idealista_id=eq.${encodeURIComponent(idealistaId)}&precio_consultado=is.null`,
    {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify({ precio_consultado: Math.round(Number(precio)) }),
    },
  );
  if (!res.ok && res.status !== 404) {
    const t = await res.text();
    if (!/precio_consultado|column/.test(t)) console.warn('patchInteresPrecio', t);
  }
}

async function fetchInteresPorComprador(compradorIds) {
  if (!compradorIds.length) return new Map();
  const map = new Map();
  const chunk = 80;
  for (let i = 0; i < compradorIds.length; i += chunk) {
    const slice = compradorIds.slice(i, i + chunk);
    const inList = slice.map((id) => encodeURIComponent(id)).join(',');
    const res = await fetch(
      `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=in.(${inList})&idealista_id=not.is.null&select=comprador_id,idealista_id,precio_consultado&limit=500`,
      { headers: svcHeaders() },
    );
    if (!res.ok) continue;
    for (const row of await res.json()) {
      const cid = row.comprador_id;
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid).push(row);
    }
  }
  return map;
}

function idealistaIdsForComprador(c, interesRows) {
  const ids = new Set(idealistaIdsFromNotas(c.notas));
  let precioInteres = null;
  for (const row of interesRows || []) {
    const id = normalizeIdealistaId(row.idealista_id);
    if (id) ids.add(id);
    if (row.precio_consultado != null && Number(row.precio_consultado) >= 40_000) {
      const p = Number(row.precio_consultado);
      if (precioInteres == null || p > precioInteres) precioInteres = p;
    }
  }
  return { ids: [...ids], precioInteres };
}

function bestPrecioFromIds(ids, preciosMap, precioInteres) {
  let best = precioInteres != null ? Number(precioInteres) : 0;
  for (const id of ids) {
    const p = preciosMap[id];
    if (p != null && Number(p) > best) best = Number(p);
  }
  return best >= 40_000 ? best : null;
}

/**
 * @param {{ limit?: number, maxScrape?: number, dryRun?: boolean }} opts
 */
export async function backfillPresupuestoByIdealistaIds(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 400, 500);
  const rowsRaw = await fetchCompradoresPendientesCompraventa({
    limit,
    compradorIds: opts.compradorIds,
    select: SELECT,
  });
  if (!rowsRaw.length) {
    return { ok: true, total: 0, actualizados: 0, idsEnCache: 0, scrape: null };
  }

  const interesMap = await fetchInteresPorComprador(rowsRaw.map((c) => c.id));
  const rows = rowsRaw.filter((c) => compradorTieneIdealista(c, interesMap.get(c.id)));
  if (!rows.length) {
    return { ok: true, total: 0, actualizados: 0, idsEnCache: 0, scrape: null, candidatos: rowsRaw.length };
  }

  const allIds = new Set();
  const plan = [];

  for (const c of rows) {
    const { ids, precioInteres } = idealistaIdsForComprador(c, interesMap.get(c.id));
    if (!ids.length) continue;
    ids.forEach((id) => allIds.add(id));
    plan.push({ comprador: c, ids, precioInteres });
  }

  let bulk = await getIdealistaPreciosBulk([...allIds]);
  const missing = [...allIds].filter((id) => !bulk.precios?.[id]);
  let scrape = null;
  if (missing.length && opts.dryRun !== true) {
    scrape = await warmIdealistaPrecioCache(missing, {
      maxScrape: Math.min(Number(opts.maxScrape) || 100, 120),
      delayMs: 220,
    });
    bulk = await getIdealistaPreciosBulk([...allIds]);
  }

  let actualizados = 0;
  let sinPrecio = 0;
  const sinPrecioIds = new Set();

  for (const { comprador: c, ids, precioInteres } of plan) {
    let best = bestPrecioFromIds(ids, bulk.precios || {}, precioInteres);
    if (best == null && c.presupuesto_max != null && Number(c.presupuesto_max) >= 40_000) {
      best = Number(c.presupuesto_max);
    }
    if (best == null) {
      sinPrecio++;
      ids.forEach((id) => {
        if (!bulk.precios?.[id]) sinPrecioIds.add(id);
      });
      continue;
    }
    const max = Math.round(best);
    const min = Math.max(0, max - PRESUPUESTO_MARGEN_INFER);
    const patch = {};
    const curMax = c.presupuesto_max != null ? Number(c.presupuesto_max) : null;
    if (curMax == null || curMax < max) patch.presupuesto_max = max;
    if (c.presupuesto_min == null || Number(c.presupuesto_min) > min) patch.presupuesto_min = min;
    if (!Object.keys(patch).length) continue;

    if (opts.dryRun === true) {
      actualizados++;
      continue;
    }
    try {
      await patchCompradorRow(c.id, patch);
      actualizados++;
      for (const id of ids) {
        const p = bulk.precios?.[id];
        if (p != null) await patchInteresPrecioConsultado(c.id, id, p);
      }
    } catch (e) {
      console.warn('backfillPresupuestoByIdealistaIds', c.id, e.message);
    }
  }

  return {
    ok: true,
    total: rows.length,
    conIdealistaId: plan.length,
    actualizados,
    sinPrecio,
    idsUnicos: allIds.size,
    idsConPrecio: bulk.resueltos ?? Object.keys(bulk.precios || {}).length,
    idsSinPrecioMuestra: [...sinPrecioIds].slice(0, 15),
    scrape,
  };
}