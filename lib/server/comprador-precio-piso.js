/**
 * Precio de compraventa del piso consultado (Idealista / NH / interés).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import {
  collectCompradorPropertySignals,
  PRESUPUESTO_MARGEN_INFER,
} from './comprador-infer-criterios.js';

function maxPrecioFromSignals(signals) {
  const precios = (signals || []).map((s) => s.precio).filter((p) => Number.isFinite(p) && p >= 40_000);
  if (!precios.length) return null;
  return Math.max(...precios);
}

export async function precioPisoForComprador(comprador, opts = {}) {
  const cur = comprador.presupuesto_max != null ? Number(comprador.presupuesto_max) : null;
  if (cur != null && cur > 0 && opts.preferDb !== false) return cur;

  const { signals } = await collectCompradorPropertySignals(comprador, {
    skipScrape: opts.skipScrape !== false,
    minSignals: 0,
  });
  const fromSignals = maxPrecioFromSignals(signals);
  if (fromSignals != null) return fromSignals;
  if (cur != null && cur > 0) return cur;
  return null;
}

async function fetchCompradoresByIds(ids) {
  if (!ids.length) return [];
  const inList = ids.map((id) => encodeURIComponent(id)).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=id,notas,presupuesto_max,presupuesto_min&limit=${ids.length}`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function persistPresupuestoIfEmpty(comprador, precio) {
  if (comprador.presupuesto_max != null && Number(comprador.presupuesto_max) > 0) return false;
  if (precio == null || precio < 40_000) return false;
  const body = {
    presupuesto_max: precio,
    presupuesto_min: Math.max(0, precio - PRESUPUESTO_MARGEN_INFER),
  };
  const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
    method: 'PATCH',
    headers: { ...svcHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const res2 = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(comprador.id)}`, {
      method: 'PATCH',
      headers: { ...svcHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({ presupuesto_max: precio }),
    });
    return res2.ok;
  }
  return true;
}

async function resolveBatch(rows, opts) {
  const precios = {};
  let updated = 0;
  const concurrency = 6;
  let i = 0;

  async function worker() {
    while (i < rows.length) {
      const idx = i++;
      const c = rows[idx];
      try {
        const precio = await precioPisoForComprador(c, { skipScrape: opts.skipScrape, preferDb: false });
        if (precio != null) {
          precios[c.id] = precio;
          if (opts.persist) {
            const ok = await persistPresupuestoIfEmpty(c, precio);
            if (ok) updated++;
          }
        } else if (c.presupuesto_max != null) {
          precios[c.id] = Number(c.presupuesto_max);
        }
      } catch (e) {
        console.warn('precioPiso', c.id, e.message);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return { ok: true, total: rows.length, conPrecio: Object.keys(precios).length, updated, precios };
}

export async function batchPrecioPisoCompradores(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 120, 200);
  const persist = opts.persist === true;

  if (opts.ids?.length) {
    const rows = await fetchCompradoresByIds(opts.ids.slice(0, limit));
    return resolveBatch(rows, { persist, skipScrape: opts.skipScrape });
  }

  let url = `${SB_URL}/rest/v1/compradores?select=id,notas,presupuesto_max,presupuesto_min&order=created_at.desc&limit=${limit}`;
  if (opts.onlySinPresupuesto !== false) url += '&presupuesto_max=is.null';

  const res = await fetch(url, { headers: svcHeaders() });
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return resolveBatch(rows, { persist, skipScrape: opts.skipScrape });
}
