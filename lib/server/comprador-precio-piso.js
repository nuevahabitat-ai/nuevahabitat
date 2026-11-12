/**
 * Backfill precio/criterios Idealista en compradores (panel).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import {
  applyIdealistaPisoDefaultsForComprador,
  idealistaIdsFromNotas,
} from './comprador-idealista-piso.js';

const SELECT =
  'id,notas,presupuesto_max,presupuesto_min,tipo_inmueble,zona_buscada,habitaciones_min,m2_min,banos_min,ascensor,balcon_terraza_indispensable';

async function fetchCompradoresByIds(ids) {
  if (!ids.length) return [];
  const inList = ids.map((id) => encodeURIComponent(id)).join(',');
  const res = await fetch(
    `${SB_URL}/rest/v1/compradores?id=in.(${inList})&select=${SELECT}&limit=${ids.length}`,
    { headers: svcHeaders() },
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function hasIdealistaLead(c) {
  if (idealistaIdsFromNotas(c.notas).length) return true;
  return /\[Idealista\s+import\]/i.test(String(c.notas || ''));
}

async function resolveBatch(rows, opts) {
  const precios = {};
  let updated = 0;
  let skipped = 0;
  const concurrency = 5;
  let i = 0;

  async function worker() {
    while (i < rows.length) {
      const idx = i++;
      const c = rows[idx];
      if (opts.idealistaOnly !== false && !hasIdealistaLead(c)) {
        skipped++;
        if (c.presupuesto_max != null) precios[c.id] = Number(c.presupuesto_max);
        continue;
      }
      try {
        const r = await applyIdealistaPisoDefaultsForComprador(c, {
          onlyIfEmpty: true,
          dryRun: !opts.persist,
          skipScrape: opts.skipScrape,
        });
        const p = r.precio ?? (c.presupuesto_max != null ? Number(c.presupuesto_max) : null);
        if (p != null) precios[c.id] = p;
        if (r.ok && r.patch && Object.keys(r.patch).length && opts.persist) updated++;
      } catch (e) {
        console.warn('idealistaPiso', c.id, e.message);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return { ok: true, total: rows.length, conPrecio: Object.keys(precios).length, updated, skipped, precios };
}

export async function batchPrecioPisoCompradores(opts = {}) {
  const limit = Math.min(Number(opts.limit) || 120, 250);
  const persist = opts.persist === true;

  if (opts.ids?.length) {
    const rows = await fetchCompradoresByIds(opts.ids.slice(0, limit));
    return resolveBatch(rows, { persist, skipScrape: opts.skipScrape, idealistaOnly: opts.idealistaOnly });
  }

  let url = `${SB_URL}/rest/v1/compradores?select=${SELECT}&notas=ilike.*Idealista*&order=created_at.desc&limit=${limit}`;
  if (opts.onlySinPresupuesto !== false) url += '&presupuesto_max=is.null';

  const res = await fetch(url, { headers: svcHeaders() });
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return resolveBatch(rows, { persist, skipScrape: opts.skipScrape, idealistaOnly: true });
}

export async function precioPisoForComprador(comprador) {
  const r = await applyIdealistaPisoDefaultsForComprador(comprador, { onlyIfEmpty: true, dryRun: true });
  return r.precio ?? (comprador.presupuesto_max != null ? Number(comprador.presupuesto_max) : null);
}
