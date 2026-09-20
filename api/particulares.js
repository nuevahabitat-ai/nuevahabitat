/**
 * GET /api/particulares — listar seguimientos de particulares (Alfredo / Captador)
 * Query: mode=activos|alarmas|hoy · limit=1-50
 * Auth: Bearer NH_PANEL_API_KEY
 */
import { verifyPanelApiKey, checkRateLimit } from '../lib/server/panel-api-auth.js';
import { listParticulares, publicParticular } from '../lib/server/particulares-api.js';
import { SB_SERVICE } from '../lib/server/supabase-server.js';

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'Método no permitido' });

  const auth = verifyPanelApiKey(req);
  if (!auth.ok) return json(res, auth.status, { ok: false, error: auth.error });

  const rate = checkRateLimit(req);
  if (!rate.ok) return json(res, rate.status, { ok: false, error: rate.error });

  if (!SB_SERVICE) return json(res, 503, { ok: false, error: 'Supabase service role no configurado' });

  const modeRaw = String(req.query?.mode || 'activos').toLowerCase();
  const mode = ['activos', 'alarmas', 'hoy'].includes(modeRaw) ? modeRaw : 'activos';
  const limitRaw = parseInt(req.query?.limit, 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 30;

  try {
    const rows = await listParticulares({ mode, limit });
    return json(res, 200, {
      ok: true,
      mode,
      count: rows.length,
      particulares: rows.map(publicParticular),
    });
  } catch (err) {
    console.error('particulares.list:', err.message || err);
    return json(res, 500, { ok: false, error: 'Error al listar particulares' });
  }
}
