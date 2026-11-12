/**
 * Fetch anuncio Idealista vía /api/import-particular (mismo scrape que el panel).
 */
import { upsertIdealistaPrecioCache } from './idealista-precio-cache.js';

function parseEuroFromTitle(text) {
  const m = String(text || '').match(/(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*€/);
  if (!m) return null;
  const n = parseInt(String(m[1]).replace(/\./g, ''), 10);
  return n >= 40_000 && n <= 15_000_000 ? n : null;
}

export async function fetchIdealistaListingSnapshot(idealistaId) {
  const id = String(idealistaId || '').trim();
  if (!id) return null;
  try {
    const origin =
      process.env.NH_PUBLIC_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.nuevahabitat.com');
    const res = await fetch(`${origin}/api/import-particular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `https://www.idealista.com/es/inmueble/${id}/` }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok || !json.data) return null;
    const d = json.data;
    const precio =
      d.precio != null
        ? Number(d.precio)
        : parseEuroFromTitle(d.titulo) ?? parseEuroFromTitle(json.data?.descripcion);
    return {
      idealista_id: id,
      precio: Number.isFinite(precio) ? precio : null,
      habitaciones: d.habitaciones != null ? Number(d.habitaciones) : null,
      banos: d.banos != null ? Number(d.banos) : null,
      m2: d.m2 != null ? Number(d.m2) : d.m2_utiles != null ? Number(d.m2_utiles) : null,
      ascensor: d.ascensor === true || d.ascensor === 'si' || d.ascensor === 'Sí',
      tipo: d.tipo || 'piso',
      zona: [d.barrio, d.municipio, d.zona].filter(Boolean).join(', '),
      titulo: d.titulo || null,
    };
  } catch (e) {
    console.warn('fetchIdealistaListingSnapshot', id, e.message);
    return null;
  }
}

export async function warmIdealistaPrecioCache(ids, opts = {}) {
  const maxScrape = Math.min(Number(opts.maxScrape) || 35, 50);
  const delayMs = Number(opts.delayMs) || 350;
  const { getIdealistaPreciosBulk } = await import('./idealista-precios-bulk.js');
  const unique = [...new Set((ids || []).map((x) => String(x).trim()).filter(Boolean))];
  if (!unique.length) return { ok: true, solicitados: 0, enCache: 0, scrapeOk: 0, scrapeFail: 0 };

  const bulk = await getIdealistaPreciosBulk(unique);
  const missing = unique.filter((id) => !bulk.precios?.[id]);
  let scrapeOk = 0;
  let scrapeFail = 0;

  for (const id of missing.slice(0, maxScrape)) {
    const snap = await fetchIdealistaListingSnapshot(id);
    if (snap?.precio >= 40_000) {
      await upsertIdealistaPrecioCache({
        idealista_id: id,
        precio: snap.precio,
        habitaciones: snap.habitaciones,
        titulo: snap.titulo,
      });
      scrapeOk++;
    } else scrapeFail++;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }

  const after = await getIdealistaPreciosBulk(unique);
  return {
    ok: true,
    solicitados: unique.length,
    enCache: after.resueltos ?? Object.keys(after.precios || {}).length,
    scrapeOk,
    scrapeFail,
    sinPrecio: unique.filter((id) => !after.precios?.[id]).length,
  };
}
