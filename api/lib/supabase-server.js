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

export async function markHonorariosPaid({ tipo, recordId, sessionId, paymentIntentId }) {
  const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
  const patch = {
    honorarios_pagado: true,
    honorarios_pagado_at: new Date().toISOString(),
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
