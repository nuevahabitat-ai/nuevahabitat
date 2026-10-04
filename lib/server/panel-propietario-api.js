/**
 * Panel propietario alquiler — ensure expediente, bucket, upload (service role).
 */
import { notifyDocumentoSubidoCliente } from './payment-notify.js';
import {
  getUserFromJwt,
  ensurePropietarioAlquilerRow,
  ensureDocumentosBucket,
  uploadDocumentoClienteService,
  insertClienteDocumentoService,
  savePropietarioExpedienteForUser,
  patchPropietarioAlquiler,
  SB_SERVICE,
} from './supabase-server.js';
import { purgeClientAccount } from './account-delete.js';

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

function storageFolder(email) {
  return email.toLowerCase().replace(/[^a-z0-9@._+-]/g, '_');
}

export async function handlePanelPropietarioApi(req, res) {
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
      if (!SB_SERVICE) {
        return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
      }
      const row = await ensurePropietarioAlquilerRow(user);
      if (!row) return res.status(500).json({ ok: false, error: 'No se pudo crear el expediente' });
      return res.status(200).json({ ok: true, row });
    }

    if (action === 'align-servicio') {
      if (!SB_SERVICE) {
        return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
      }
      const body = req.body || {};
      const servicio = body.servicio === 'integral' ? 'integral' : 'administracion';
      let row = await ensurePropietarioAlquilerRow(user);
      if (!row?.id) return res.status(500).json({ ok: false, error: 'Sin expediente' });
      row = await patchPropietarioAlquiler(row.id, {
        servicio,
        cuota_mensual: servicio === 'integral' ? 0 : (Number(row.cuota_mensual) || 60),
        integral_tarifa: Number(row.integral_tarifa) || 499,
      });
      return res.status(200).json({ ok: true, row });
    }

    if (action === 'save-expediente') {
      if (!SB_SERVICE) {
        return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
      }
      const body = req.body || {};
      const row = await savePropietarioExpedienteForUser(user, body.data || body);
      if (!row) return res.status(500).json({ ok: false, error: 'No se pudo guardar' });
      return res.status(200).json({ ok: true, row });
    }

    if (action === 'delete-account') {
      if (!SB_SERVICE) {
        return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
      }
      const confirm = String((req.body || {}).confirm || '').trim().toUpperCase();
      if (confirm !== 'ELIMINAR') {
        return res.status(400).json({ ok: false, error: 'Escribe ELIMINAR para confirmar' });
      }
      const result = await purgeClientAccount({
        userId: user.id,
        email,
        deleteAuth: true,
      });
      if (!result.ok) return res.status(500).json({ ok: false, error: result.error });
      return res.status(200).json({ ok: true, deleted: true });
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

      await ensurePropietarioAlquilerRow(user);

      const rolHint = String(body.rol || user.user_metadata?.tipo || '').toLowerCase();
      if (rolHint === 'vendedor' || rolHint === 'comprador') {
        await notifyDocumentoSubidoCliente({
          email,
          nombre: user.user_metadata?.nombre || user.user_metadata?.full_name,
          rol: rolHint === 'vendedor' ? 'Vendedor' : 'Comprador',
          documentoNombre: label || safeName,
          documentoTipo: tipo,
        });
      }

      return res.status(200).json({ ok: true, path, doc });
    }

    return res.status(400).json({ ok: false, error: 'Acción no válida' });
  } catch (err) {
    console.error('panel-propietario api', action, err);
    return res.status(500).json({ ok: false, error: err.message || 'Error interno' });
  }
}
