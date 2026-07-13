/**
 * Vercel Serverless Function — /api/notify
 * Envía un email de notificación a admin.nuevahabitat@gmail.com
 * cuando se recibe un nuevo lead desde cualquier formulario del sitio.
 *
 * Requiere: RESEND_API_KEY en las variables de entorno de Vercel.
 * Setup: https://resend.com (plan gratuito: 3.000 emails/mes)
 */

const ADMIN_EMAIL = 'admin.nuevahabitat@gmail.com';
const FROM_EMAIL  = 'noreply@nuevahabitat.com';   // dominio verificado en Resend

const TIPO_LABELS = {
  visita:    'Solicitud de visita',
  contacto:  'Contacto general',
  hipoteca:  'Consulta hipoteca',
  vender:    'Quiero vender',
  valoracion:'Solicitud de valoración',
  comprar:   'Quiero comprar',
  newsletter:'Suscripción newsletter',
};

export default async function handler(req, res) {
  // CORS para llamadas desde el frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin API key configurada → OK silencioso (el lead ya se guardó en Supabase)
    return res.status(200).json({ ok: true, skipped: true });
  }

  const { nombre, telefono, email, mensaje, tipo, inmueble } = req.body || {};
  const tipoLabel = TIPO_LABELS[tipo] || tipo || 'Nuevo contacto';

  const html = `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0d0d0d">
  <div style="background:#0d0d0d;padding:24px 32px;border-radius:8px 8px 0 0">
    <span style="color:#b8936a;font-size:1.1rem;font-weight:700;letter-spacing:.05em">NH · NUEVA HABITAT</span>
  </div>
  <div style="background:#f9f5ef;padding:32px;border-radius:0 0 8px 8px;border:1px solid #efe9e0">
    <h2 style="margin:0 0 4px;font-size:1.2rem">${tipoLabel}</h2>
    <p style="margin:0 0 24px;color:#888;font-size:.85rem">Recibido el ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>

    <table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <tr><td style="padding:8px 0;color:#555;width:120px">Nombre</td><td style="padding:8px 0;font-weight:600">${nombre || '–'}</td></tr>
      <tr><td style="padding:8px 0;color:#555">Teléfono</td><td style="padding:8px 0"><a href="tel:${telefono}" style="color:#b8936a">${telefono || '–'}</a></td></tr>
      <tr><td style="padding:8px 0;color:#555">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#b8936a">${email || '–'}</a></td></tr>
      ${inmueble ? `<tr><td style="padding:8px 0;color:#555">Inmueble</td><td style="padding:8px 0">${inmueble}</td></tr>` : ''}
      ${mensaje  ? `<tr><td style="padding:8px 0;color:#555;vertical-align:top">Mensaje</td><td style="padding:8px 0">${mensaje}</td></tr>` : ''}
    </table>

    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #efe9e0;display:flex;gap:12px">
      ${telefono ? `<a href="tel:${telefono}" style="background:#0d0d0d;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:.85rem">Llamar</a>` : ''}
      ${telefono ? `<a href="https://wa.me/34${telefono.replace(/\D/g,'')}" style="background:#25d366;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:.85rem">WhatsApp</a>` : ''}
      ${email    ? `<a href="mailto:${email}" style="background:#b8936a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:.85rem">Responder</a>` : ''}
    </div>
  </div>
</div>`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    `NuevaHabitat <${FROM_EMAIL}>`,
        to:      [ADMIN_EMAIL],
        subject: `[NH] ${tipoLabel} — ${nombre || 'Desconocido'}`,
        html,
      }),
    });
    const data = await resp.json();
    return res.status(resp.ok ? 200 : 500).json(data);
  } catch (err) {
    console.error('notify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
