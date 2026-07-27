/**
 * POST /api/disponibilidad — Guarda franja de disponibilidad (service role, sin RLS).
 * Requiere SUPABASE_SERVICE_ROLE_KEY en Vercel.
 */
const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
const SB_ANON = process.env.SUPABASE_ANON_KEY || 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function svcHeaders(prefer = 'return=representation') {
  return {
    Authorization: `Bearer ${SB_SERVICE}`,
    apikey: SB_SERVICE,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

function cleanRow(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null && v !== ''));
}

async function ensurePerfil(user, nombre, telefono) {
  await fetch(`${SB_URL}/rest/v1/perfiles?on_conflict=id`, {
    method: 'POST',
    headers: svcHeaders('resolution=merge-duplicates'),
    body: JSON.stringify(cleanRow({
      id: user.id,
      nombre: nombre || user.email?.split('@')[0] || 'Cliente',
      telefono,
      rol: 'cliente',
    })),
  });
}

async function insertVisita(payload) {
  const base = {
    estado: 'pendiente',
    fecha_hora: payload.fecha_hora,
    notas: payload.notas,
  };
  const attempts = [
    { perfil_id: payload.perfil_id, tipo_solicitud: payload.tipo_solicitud, inmueble_id: payload.inmueble_id },
    { perfil_id: payload.perfil_id, tipo_solicitud: payload.tipo_solicitud },
    { perfil_id: payload.perfil_id, inmueble_id: payload.inmueble_id },
    { perfil_id: payload.perfil_id },
    { tipo_solicitud: payload.tipo_solicitud },
    {},
  ];

  let lastErr = 'insert failed';
  for (const extra of attempts) {
    const row = cleanRow({ ...base, ...extra });
    const res = await fetch(`${SB_URL}/rest/v1/visitas`, {
      method: 'POST',
      headers: svcHeaders(),
      body: JSON.stringify(row),
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, visita: Array.isArray(data) ? data[0] : data };
    }
    lastErr = await res.text();
  }
  return { ok: false, error: lastErr };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'SERVICE_ROLE_KEY missing', code: 'NO_SERVICE_KEY' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!jwt) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const userRes = await fetch(`${SB_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${jwt}`, apikey: SB_ANON },
  });
  if (!userRes.ok) return res.status(401).json({ ok: false, error: 'Invalid session' });
  const user = await userRes.json();

  const body = req.body || {};
  const { fecha_hora, notas, tipo_solicitud, inmueble_id, nombre, telefono } = body;
  if (!fecha_hora || !notas) {
    return res.status(400).json({ ok: false, error: 'Missing fecha_hora or notas' });
  }

  try {
    await ensurePerfil(user, nombre, telefono);
    const result = await insertVisita({
      perfil_id: user.id,
      fecha_hora,
      notas,
      tipo_solicitud,
      inmueble_id: inmueble_id || null,
    });

    if (!result.ok) {
      const needsMigration = /inmueble_id|null value|not-null|tipo_solicitud|column/i.test(result.error || '');
      return res.status(500).json({ ok: false, error: result.error, needsMigration });
    }

    return res.status(200).json({ ok: true, visita: result.visita });
  } catch (err) {
    console.error('disponibilidad api', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
