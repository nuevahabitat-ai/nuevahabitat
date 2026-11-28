/** IDs alternativos del mismo inmueble NH en Idealista. */
export function idealistaIdsOnInmueble(inm) {
  if (!inm) return [];
  const out = [];
  for (const key of ['idealista_id', 'idealista_id_2']) {
    const n = normalizeIdealistaId(inm[key]);
    if (n && !out.includes(n)) out.push(n);
  }
  return out;
}

/** ID numérico del anuncio Idealista (export Excel / URL / texto). */
export function normalizeIdealistaId(val) {
  if (val == null || val === '') return null;
  const s = String(val).trim();
  const url = s.match(/idealista[^/]*\/inmueble\/(\d{5,})/i);
  if (url) return url[1];
  const pathId = s.match(/\/(\d{6,})\/?(?:\?|$)/);
  if (pathId) return pathId[1];
  const digits = s.match(/\d{6,}/);
  if (digits) return digits[0];
  const n = Number(s.replace(/,/g, '.'));
  if (Number.isFinite(n) && n > 0) return String(Math.trunc(n));
  return s || null;
}

export function idealistaIdVariants(...vals) {
  const out = new Set();
  for (const v of vals) {
    const n = normalizeIdealistaId(v);
    if (n) out.add(n);
    if (v != null && String(v).trim()) out.add(String(v).trim());
  }
  return [...out];
}

/** Todos los IDs detectables en texto de export Idealista (varios anuncios / URLs). */
export function extractIdealistaIdsFromText(...texts) {
  const out = new Set();
  for (const raw of texts) {
    const s = String(raw || '').trim();
    if (!s) continue;
    for (const m of s.matchAll(/idealista[^/]*\/inmueble\/(\d{5,})/gi)) {
      const id = normalizeIdealistaId(m[1]);
      if (id) out.add(id);
    }
    for (const m of s.matchAll(/\bidealista\s*[#:]?\s*(\d{6,})\b/gi)) {
      const id = normalizeIdealistaId(m[1]);
      if (id) out.add(id);
    }
    const lone = normalizeIdealistaId(s);
    if (lone && /^\d{6,12}$/.test(lone)) out.add(lone);
  }
  return [...out];
}

export function mapInmueblesByIdealistaIds(rows) {
  const map = new Map();
  for (const r of rows || []) {
    for (const id of idealistaIdsOnInmueble(r)) {
      map.set(String(id), r);
    }
  }
  return map;
}
