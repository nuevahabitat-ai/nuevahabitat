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
