/**
 * notify.js — Helper para enviar notificaciones por email (admin + info corporativo).
 * Se llama después de guardar un lead en Supabase.
 */
window.nhNotify = async function(payload) {
  const res = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('nhNotify', res.status, json);
    throw new Error(json.error || `Notify falló (${res.status})`);
  }
  if (json.emailSkipped) {
    console.warn('nhNotify: emails omitidos (RESEND_API_KEY ausente en servidor)');
  }
  return json;
};
