/**
 * POST /api/compradores — crear comprador (IAs externas, Captador-compatible)
 * GET  /api/compradores — listar compradores
 * Auth: Authorization: Bearer NH_PANEL_API_KEY
 */
import { SB_SERVICE } from './lib/supabase-server.js';
import { verifyPanelApiKey, checkRateLimit, logApiAction } from './lib/panel-api-auth.js';
import {
  buildCompradorRow,
  findCompradorByTelefono,
  insertComprador,
  listCompradores,
  publicComprador,
} from './lib/compradores-api.js';

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

function requireAuth(req, res) {
  const auth = verifyPanelApiKey(req);
  if (!auth.ok) {
    json(res, auth.status, { ok: false, error: auth.error });
    return false;
  }
  const rate = checkRateLimit(req);
  if (!rate.ok) {
    json(res, rate.status, { ok: false, error: rate.error });
    return false;
  }
  if (!SB_SERVICE) {
    json(res, 503, { ok: false, error: 'Supabase service role no configurado' });
    return false;
  }
  return true;
}

async function handlePost(req, res) {
  const body = req.body || {};
  const row = buildCompradorRow(body);

  if (!row.nombre) {
    return json(res, 400, { ok: false, error: 'El campo nombre es obligatorio' });
  }
  if (!row.telefono) {
    return json(res, 400, { ok: false, error: 'El campo telefono es obligatorio y debe ser un móvil español válido (+34…)' });
  }

  const existing = await findCompradorByTelefono(row.telefono);
  if (existing) {
    return json(res, 409, {
      ok: false,
      error: 'Ya existe un comprador con ese teléfono',
      comprador: publicComprador(existing),
    });
  }

  try {
    const created = await insertComprador(row);
    logApiAction('comprador.create', { nombre: row.nombre, telefono: row.telefono });
    return json(res, 201, { ok: true, comprador: publicComprador(created) });
  } catch (err) {
    console.error('compradores.create:', err.message || err);
    return json(res, 500, { ok: false, error: 'Error al crear comprador en Supabase' });
  }
}

async function handleGet(req, res) {
  const activoParam = req.query?.activo;
  let activo;
  if (activoParam === 'true') activo = true;
  else if (activoParam === 'false') activo = false;

  const limitRaw = parseInt(req.query?.limit, 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 50;

  try {
    const rows = await listCompradores({ activo, limit });
    return json(res, 200, {
      ok: true,
      count: rows.length,
      compradores: rows.map(publicComprador),
    });
  } catch (err) {
    console.error('compradores.list:', err.message || err);
    return json(res, 500, { ok: false, error: 'Error al listar compradores' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!requireAuth(req, res)) return;

  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'GET') return handleGet(req, res);

  return json(res, 405, { ok: false, error: 'Método no permitido' });
}
