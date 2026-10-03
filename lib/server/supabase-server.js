/**
 * Helpers Supabase server-side (service role + validación JWT).
 */
export const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
export const SB_ANON = process.env.SUPABASE_ANON_KEY || 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';
export const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

export function svcHeaders(prefer = 'return=representation') {
  return {
    Authorization: `Bearer ${SB_SERVICE}`,
    apikey: SB_SERVICE,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

export async function getUserFromJwt(jwt) {
  if (!jwt) return null;
  const userRes = await fetch(`${SB_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${jwt}`, apikey: SB_ANON },
  });
  if (!userRes.ok) return null;
  return userRes.json();
}

export async function fetchClienteRow(tipo, email) {
  const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
  const res = await fetch(
    `${SB_URL}/rest/v1/${tabla}?email=ilike.${encodeURIComponent(email)}&select=*&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

/** Lectura con JWT del cliente (RLS own_read) — no requiere service role */
export async function fetchClienteRowAsUser(tipo, email, jwt) {
  const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
  const res = await fetch(
    `${SB_URL}/rest/v1/${tabla}?email=ilike.${encodeURIComponent(email)}&select=*&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        apikey: SB_ANON,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function markHonorariosPaid({ tipo, recordId, sessionId, paymentIntentId, metodoPago = 'stripe' }) {
  const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
  const patch = {
    honorarios_pagado: true,
    honorarios_pagado_at: new Date().toISOString(),
    honorarios_transferencia_pendiente: false,
    honorarios_metodo_pago: metodoPago,
    stripe_session_id: sessionId || null,
    stripe_payment_intent_id: paymentIntentId || null,
  };
  const res = await fetch(`${SB_URL}/rest/v1/${tabla}?id=eq.${recordId}`, {
    method: 'PATCH',
    headers: svcHeaders(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function markTransferenciaPendiente({ tipo, recordId }) {
  const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
  const patch = {
    honorarios_transferencia_pendiente: true,
    honorarios_transferencia_at: new Date().toISOString(),
  };
  const res = await fetch(`${SB_URL}/rest/v1/${tabla}?id=eq.${recordId}`, {
    method: 'PATCH',
    headers: svcHeaders(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function fetchPropietarioAlquilerRow(email) {
  const res = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?email=ilike.${encodeURIComponent(email)}&select=*&limit=1`,
    { headers: svcHeaders() }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function fetchPropietarioAlquilerAsUser(email, jwt) {
  const res = await fetch(
    `${SB_URL}/rest/v1/propietarios_alquiler?email=ilike.${encodeURIComponent(email)}&select=*&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        apikey: SB_ANON,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function patchPropietarioAlquiler(recordId, patch) {
  const res = await fetch(`${SB_URL}/rest/v1/propietarios_alquiler?id=eq.${recordId}`, {
    method: 'PATCH',
    headers: svcHeaders(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}

/** Guardar expediente propietario (misma lógica que RPC 046) vía service role */
export async function savePropietarioExpedienteForUser(user, pData) {
  if (!SB_SERVICE) throw new Error('SERVICE_ROLE_KEY missing');
  const email = (user?.email || '').trim();
  if (!email) throw new Error('Sin email');

  let row = await ensurePropietarioAlquilerRow(user);
  if (!row?.id) throw new Error('No se pudo crear el expediente');

  const p = pData && typeof pData === 'object' ? pData : {};
  const has = (k) => Object.prototype.hasOwnProperty.call(p, k);
  const trim = (k) => {
    if (!has(k)) return undefined;
    const v = p[k];
    if (v == null) return null;
    const s = String(v).trim();
    return s === '' ? null : s;
  };

  const patch = {};
  const nombre = trim('nombre');
  if (nombre) patch.nombre = nombre;
  if (has('dni')) patch.dni = trim('dni');
  if (has('telefono')) {
    const t = trim('telefono');
    if (t) patch.telefono = t;
  }
  if (has('direccion_propietario')) patch.direccion_propietario = trim('direccion_propietario');
  if (has('iban_cobro')) patch.iban_cobro = trim('iban_cobro');
  if (has('notas_propietario')) patch.notas_propietario = trim('notas_propietario');
  if (has('inquilino_nombre')) patch.inquilino_nombre = trim('inquilino_nombre');
  if (has('inquilino_telefono')) patch.inquilino_telefono = trim('inquilino_telefono');
  if (has('inquilino_email')) patch.inquilino_email = trim('inquilino_email');
  if (has('contrato_inicio')) patch.contrato_inicio = trim('contrato_inicio');
  if (has('contrato_fin')) patch.contrato_fin = trim('contrato_fin');
  if (has('inmueble_direccion')) patch.inmueble_direccion = trim('inmueble_direccion');
  if (has('inmueble_ref')) patch.inmueble_ref = trim('inmueble_ref');
  if (has('inmueble_ref_catastral')) patch.inmueble_ref_catastral = trim('inmueble_ref_catastral');
  if (has('inmueble_notas')) patch.inmueble_notas = trim('inmueble_notas');
  if (has('renta_mensual')) {
    const r = trim('renta_mensual');
    patch.renta_mensual = r == null ? null : Number(r);
  }

  if (
    row.estado_gestion === 'alta'
    && patch.inmueble_direccion
  ) {
    patch.estado_gestion = 'documentacion';
  }

  if (Object.keys(patch).length) {
    row = (await patchPropietarioAlquiler(row.id, patch)) || (await fetchPropietarioAlquilerRow(email));
  }
  return row;
}

export async function markAlquilerSubscription({
  recordId,
  customerId,
  subscriptionId,
  status,
  periodEnd,
  active,
}) {
  const patch = {
    stripe_customer_id: customerId || null,
    stripe_subscription_id: subscriptionId || null,
    suscripcion_estado: status || null,
    suscripcion_periodo_fin: periodEnd || null,
    suscripcion_activa: !!active,
  };
  return patchPropietarioAlquiler(recordId, patch);
}

export async function markCuotaAlquilerTransferenciaPendiente({ recordId }) {
  return patchPropietarioAlquiler(recordId, {
    cuota_transferencia_pendiente: true,
    cuota_transferencia_at: new Date().toISOString(),
  });
}

export function resolvePropietarioServicio(user) {
  const meta = user?.user_metadata || {};
  const tipo = String(meta.tipo || '').toLowerCase();
  const serv = String(meta.servicio || '').toLowerCase();
  if (tipo === 'alquiler_integral' || tipo === 'integral' || serv === 'integral') return 'integral';
  return 'administracion';
}

export async function markIntegralAlquilerPaid({ recordId, sessionId, paymentIntentId }) {
  return patchPropietarioAlquiler(recordId, {
    integral_pagado: true,
    integral_pagado_at: new Date().toISOString(),
    integral_stripe_session_id: sessionId || null,
    integral_transferencia_pendiente: false,
    estado_gestion: 'documentacion',
  });
}

export async function markIntegralTransferenciaPendiente({ recordId }) {
  return patchPropietarioAlquiler(recordId, {
    integral_transferencia_pendiente: true,
    integral_transferencia_at: new Date().toISOString(),
  });
}

/** Crea fila propietarios_alquiler si no existe (service role) */
export async function ensurePropietarioAlquilerRow(user) {
  const email = (user?.email || '').trim();
  if (!email) return null;
  let row = await fetchPropietarioAlquilerRow(email);
  const servicio = resolvePropietarioServicio(user);
  if (row) {
    const cur = row.servicio || 'administracion';
    if (cur !== servicio) {
      row = await patchPropietarioAlquiler(row.id, {
        servicio,
        cuota_mensual: servicio === 'integral' ? 0 : (Number(row.cuota_mensual) || 60),
        integral_tarifa: Number(row.integral_tarifa) || 499,
      });
    }
    return row;
  }

  const nombre = (user.user_metadata?.nombre || user.user_metadata?.full_name || email.split('@')[0] || 'Propietario').trim();
  const telefono = user.user_metadata?.telefono || null;
  const perfilId = user.id || null;

  const res = await fetch(`${SB_URL}/rest/v1/propietarios_alquiler`, {
    method: 'POST',
    headers: svcHeaders(),
    body: JSON.stringify({
      perfil_id: perfilId,
      nombre,
      email,
      telefono,
      activo: true,
      servicio,
      estado_gestion: 'alta',
      cuota_mensual: servicio === 'integral' ? 0 : 60,
      integral_tarifa: 499,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('duplicate') || errText.includes('unique')) {
      return fetchPropietarioAlquilerRow(email);
    }
    throw new Error(errText);
  }
  const rows = await res.json();
  return rows?.[0] || fetchPropietarioAlquilerRow(email);
}

/** Crea bucket documentos-clientes si falta (50 MB) */
export async function ensureDocumentosBucket() {
  if (!SB_SERVICE) return false;
  const res = await fetch(`${SB_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: svcHeaders(),
    body: JSON.stringify({
      id: 'documentos-clientes',
      name: 'documentos-clientes',
      public: false,
      file_size_limit: 52428800,
    }),
  });
  if (res.ok || res.status === 409) return true;
  const patch = await fetch(`${SB_URL}/storage/v1/bucket/documentos-clientes`, {
    method: 'PUT',
    headers: svcHeaders(),
    body: JSON.stringify({ public: false, file_size_limit: 52428800 }),
  });
  return patch.ok;
}

export async function uploadDocumentoClienteService({ email, path, bytes, contentType }) {
  if (!SB_SERVICE) throw new Error('SERVICE_ROLE_KEY missing');
  await ensureDocumentosBucket();
  const objectPath = path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
  const res = await fetch(`${SB_URL}/storage/v1/object/documentos-clientes/${objectPath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SB_SERVICE}`,
      apikey: SB_SERVICE,
      'Content-Type': contentType || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: bytes,
  });
  if (!res.ok) throw new Error(await res.text());
  return path;
}

export async function insertClienteDocumentoService({ email, perfilId, tipo, nombre, url }) {
  const res = await fetch(`${SB_URL}/rest/v1/cliente_documentos`, {
    method: 'POST',
    headers: svcHeaders(),
    body: JSON.stringify({
      perfil_id: perfilId || null,
      cliente_email: email,
      tipo,
      nombre,
      url,
      estado: 'subido',
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  return rows?.[0] || null;
}
