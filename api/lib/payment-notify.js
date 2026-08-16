/** Notificación email tras pago Stripe (cliente + admin) */
const NOTIFY_URL = process.env.SITE_URL
  ? `${process.env.SITE_URL.replace(/\/$/, '')}/api/notify`
  : 'https://www.nuevahabitat.com/api/notify';

export async function notifyHonorariosPaid({ email, nombre, tipo, amount, sessionId }) {
  try {
    await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'honorarios_pago',
        email,
        nombre: nombre || email?.split('@')[0] || 'Cliente',
        extra: { tipo, amount, sessionId },
      }),
    });
  } catch (err) {
    console.error('notifyHonorariosPaid:', err);
  }
}

export async function notifyTransferenciaPendiente({ email, nombre, tipo, amount, reference, concept }) {
  try {
    await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'honorarios_transferencia_pendiente',
        email,
        nombre: nombre || email?.split('@')[0] || 'Cliente',
        extra: { tipo, amount, reference, concept },
      }),
    });
  } catch (err) {
    console.error('notifyTransferenciaPendiente:', err);
  }
}
