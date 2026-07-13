/**
 * notify.js — Helper para enviar notificaciones por email al admin.
 * Se llama después de guardar un lead en Supabase.
 */
window.nhNotify = async function(payload) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    // Silencioso: el lead ya se guardó en Supabase
  }
};
