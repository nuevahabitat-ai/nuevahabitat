/**
 * POST /api/panel-propietario?action=ensure|ensure-storage|upload
 * Expediente propietario alquiler + subida documentos (service role si hace falta).
 */
import {
  getUserFromJwt,
  ensurePropietarioAlquilerRow,
  ensureDocumentosBucket,
  uploadDocumentoClienteService,
  insertClienteDocumentoService,
} from '../lib/server/supabase-server.js';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

function storageFolder(email) {
  return email.toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const action = req.query?.action || 'ensure';
  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const email = user.email.trim();

  try {
    if (action === 'ensure-storage') {
      const ok = await ensureDocumentosBucket();
      return res.status(200).json({ ok: true, bucketReady: ok });
    }

    if (action === 'ensure') {
      const row = await ensurePropietarioAlquilerRow(user);
      if (!row) return res.status(500).json({ ok: false, error: 'No se pudo crear el expediente' });
      return res.status(200).json({ ok: true, row });
    }

    if (action === 'upload') {
      const body = req.body || {};
      const { tipo, label, fileName, mimeType, base64 } = body;
      if (!tipo || !fileName || !base64) {
        return res.status(400).json({ ok: false, error: 'Faltan tipo, fileName o base64' });
      }

      const buf = Buffer.from(base64, 'base64');
      if (buf.length > MAX_UPLOAD_BYTES) {
        return res.status(400).json({ ok: false, error: 'Archivo demasiado grande (máx. 50 MB)' });
      }

      const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${storageFolder(email)}/${Date.now()}-${safeName}`;

      await uploadDocumentoClienteService({
        email,
        path,
        bytes: buf,
        contentType: mimeType || 'application/octet-stream',
      });

      const doc = await insertClienteDocumentoService({
        email,
        perfilId: user.id,
        tipo,
        nombre: label || safeName,
        url: path,
      });

      return res.status(200).json({ ok: true, path, doc });
    }

    return res.status(400).json({ ok: false, error: 'Acción no válida' });
  } catch (err) {
    console.error('panel-propietario api', action, err);
    return res.status(500).json({ ok: false, error: err.message || 'Error interno' });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '52mb' } },
};
