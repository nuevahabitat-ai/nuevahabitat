/** Auth Bearer + rate limit para /api/compradores (IAs externas) */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const buckets = new Map();

export function verifyPanelApiKey(req) {
  const expected = process.env.NH_PANEL_API_KEY;
  if (!expected) {
    return { ok: false, status: 503, error: 'API no configurada (NH_PANEL_API_KEY)' };
  }
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || token !== expected) {
    return { ok: false, status: 401, error: 'Clave API inválida o ausente' };
  }
  return { ok: true };
}

export function checkRateLimit(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown';
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + RATE_WINDOW_MS };
    buckets.set(ip, bucket);
  }
  bucket.count += 1;
  if (bucket.count > RATE_MAX) {
    return { ok: false, status: 429, error: 'Demasiadas solicitudes. Máximo 60/min por IP.' };
  }
  return { ok: true };
}

export function logApiAction(action, fields) {
  console.log(JSON.stringify({ source: 'api', action, ...fields }));
}
