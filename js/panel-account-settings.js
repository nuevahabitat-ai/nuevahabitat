/**
 * Borrado de cuenta desde paneles cliente (comprador, vendedor, propietario).
 */
window.nhPanelDeleteAccount = async function nhPanelDeleteAccount(opts = {}) {
  const {
    endpoint = '/api/notify?__action=account',
    body = { action: 'delete-self', confirm: 'ELIMINAR' },
    redirect = '/',
  } = opts;

  const phrase = window.prompt(
    'Esta acción borra tu panel, expediente, documentos subidos y tu cuenta de acceso.\n\nEscribe ELIMINAR (en mayúsculas) para confirmar:'
  );
  if (phrase !== 'ELIMINAR') {
    if (phrase != null) window.alert('Cancelado: debes escribir exactamente ELIMINAR.');
    return false;
  }

  const { data: { session } } = await window.nhSupabase.auth.getSession();
  if (!session?.access_token) {
    window.alert('Sesión no disponible. Vuelve a iniciar sesión.');
    return false;
  }

  const payload = { ...body, confirm: 'ELIMINAR' };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) {
    window.alert(json.error || 'No se pudo eliminar la cuenta.');
    return false;
  }

  if (window.nhAuth?.signOutClear) await window.nhAuth.signOutClear();
  window.location.href = redirect;
  return true;
};

window.nhPanelRequestPasswordReset = async function nhPanelRequestPasswordReset() {
  const { data: { session } } = await window.nhSupabase.auth.getSession();
  const email = session?.user?.email;
  if (!email) {
    window.alert('No hay email en sesión.');
    return;
  }
  if (!window.nhAuth?.resetPassword) {
    window.alert('Función no disponible.');
    return;
  }
  const { error } = await window.nhAuth.resetPassword(email);
  if (error) window.alert(error.message);
  else window.alert('Te hemos enviado un enlace para cambiar la contraseña a ' + email);
};
