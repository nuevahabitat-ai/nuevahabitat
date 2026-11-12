import { SB_URL, svcHeaders } from './supabase-server.js';
import { normalizeIdealistaId } from './idealista-id.js';
import { getIdealistaPrecioCache } from './idealista-precio-cache.js';

export async function getIdealistaPreciosBulk(rawIds) {
  const ids = [...new Set((rawIds || []).map((x) => normalizeIdealistaId(x)).filter(Boolean))].slice(0, 200);
  const precios = {};
  if (!ids.length) return { ok: true, precios, fuentes: {} };

  const inClause = ids.map((id) => encodeURIComponent(id)).join(',');
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/inmuebles?idealista_id=in.(${inClause})&select=idealista_id,precio&limit=200`,
      { headers: svcHeaders() },
    );
    if (res.ok) {
      for (const row of await res.json()) {
        const id = String(row.idealista_id || '');
        const p = row.precio != null ? Number(row.precio) : null;
        if (id && p >= 40_000) precios[id] = p;
      }
    }
  } catch (e) {
    console.warn('bulk inmuebles', e.message);
  }

  const missing = ids.filter((id) => !precios[id]);
  if (missing.length) {
    try {
      const mClause = missing.map((id) => encodeURIComponent(id)).join(',');
      const res = await fetch(
        `${SB_URL}/rest/v1/idealista_anuncio_cache?idealista_id=in.(${mClause})&select=idealista_id,precio&limit=200`,
        { headers: svcHeaders() },
      );
      if (res.ok) {
        for (const row of await res.json()) {
          const id = String(row.idealista_id || '');
          const p = row.precio != null ? Number(row.precio) : null;
          if (id && p >= 40_000) precios[id] = p;
        }
      }
    } catch (e) {
      console.warn('bulk cache table', e.message);
    }
  }

  for (const id of ids.filter((i) => !precios[i])) {
    try {
      const cached = await getIdealistaPrecioCache(id);
      if (cached?.precio >= 40_000) precios[id] = Number(cached.precio);
    } catch (_) {}
  }

  return { ok: true, precios, resueltos: Object.keys(precios).length, solicitados: ids.length };
}
