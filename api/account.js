/**
 * /api/account — borrado de cuenta (cliente autenticado o admin).
 */
import { getUserFromJwt } from '../lib/server/supabase-server.js';
import { purgeClientAccount } from '../lib/server/account-delete.js';
import {
  deletePropietarioAlquilerAdmin,
  getPropietarioAlquilerById,
} from '../lib/server/propietarios-alquiler-admin-api.js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin.nuevahabitat@gmail.com').trim().toLowerCase();

async function verifySelfOrAdmin(req) {
  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const user = await getUserFromJwt(jwt);
  if (!user?.id) return { ok: false, status: 401, error: 'No autenticado' };
  const email = String(user.email || '').trim().toLowerCase();
  const isAdmin = email === ADMIN_EMAIL;
  return { ok: true, user, isAdmin, email };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = req.body || {};
  const action = body.action || req.query?.action || 'delete-self';

  const auth = await verifySelfOrAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  if (action === 'delete-self') {
    const confirm = String(body.confirm || '').trim().toUpperCase();
    if (confirm !== 'ELIMINAR') {
      return res.status(400).json({ ok: false, error: 'Escribe ELIMINAR para confirmar' });
    }
    const result = await purgeClientAccount({
      userId: auth.user.id,
      email: auth.email,
      deleteAuth: true,
    });
    if (!result.ok) return res.status(500).json({ ok: false, error: result.error });
    return res.status(200).json({ ok: true, deleted: true });
  }

  if (action === 'admin-delete-propietario') {
    if (!auth.isAdmin) return res.status(403).json({ ok: false, error: 'No autorizado' });
    const propId = body.propietarioId || body.id;
    let targetUserId = body.userId || body.perfil_id;
    let targetEmail = body.email ? String(body.email).trim() : '';
    if (propId) {
      const row = await getPropietarioAlquilerById(propId);
      if (!row) return res.status(404).json({ ok: false, error: 'Propietario no encontrado' });
      targetEmail = targetEmail || row.email;
      targetUserId = targetUserId || row.perfil_id;
      const delRow = await deletePropietarioAlquilerAdmin(propId);
      if (!delRow.ok) return res.status(500).json({ ok: false, error: delRow.error || 'No se pudo eliminar expediente' });
    }
    if (!targetEmail) {
      return res.status(400).json({ ok: false, error: 'propietarioId o email requerido' });
    }
    const purge = await purgeClientAccount({
      userId: targetUserId,
      email: targetEmail,
      deleteAuth: body.deleteAuth !== false,
    });
    if (!purge.ok) return res.status(500).json({ ok: false, error: purge.error });
    return res.status(200).json({ ok: true, deleted: true });
  }

  return res.status(400).json({ ok: false, error: 'Acción no válida' });
}
