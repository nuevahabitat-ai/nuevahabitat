/**
 * POST /api/onboarding-vendedor — Registra inmueble del vendedor (service role).
 */
const SB_URL = process.env.SUPABASE_URL || 'https://xxodawayoogthxnjpouq.supabase.co';
const SB_ANON = process.env.SUPABASE_ANON_KEY || 'sb_publishable_fZ9IgW5VfsF_Gf_zFsxqnA_jOaH2yri';
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

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

async function generateRef() {
  const year = new Date().getFullYear();
  for (let i = 0; i < 30; i++) {
    const rnd = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const ref = `NH-${year}-${rnd}`;
    const res = await fetch(
      `${SB_URL}/rest/v1/inmuebles?ref=eq.${encodeURIComponent(ref)}&select=id`,
      { headers: svcHeaders() }
    );
    if (res.ok) {
      const rows = await res.json();
      if (!rows?.length) return ref;
    }
  }
  throw new Error('could not generate ref');
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
  const email = (user.email || '').trim();
  if (!email) return res.status(400).json({ ok: false, error: 'User email missing' });

  const body = req.body || {};
  const nombre = (body.nombre || '').trim();
  const telefono = (body.telefono || '').trim();
  const direccion = (body.direccion || '').trim();
  if (!nombre || !telefono || !direccion) {
    return res.status(400).json({ ok: false, error: 'Missing nombre, telefono or direccion' });
  }

  try {
    const vendRes = await fetch(
      `${SB_URL}/rest/v1/vendedores?email=ilike.${encodeURIComponent(email)}&select=id,inmueble_ref`,
      { headers: svcHeaders() }
    );
    if (!vendRes.ok) throw new Error(await vendRes.text());
    const vendRows = await vendRes.json();
    let vend = vendRows?.[0];

    if (!vend) {
      const ins = await fetch(`${SB_URL}/rest/v1/vendedores`, {
        method: 'POST',
        headers: svcHeaders(),
        body: JSON.stringify(cleanRow({ nombre, email, telefono })),
      });
      if (!ins.ok) throw new Error(await ins.text());
      const created = await ins.json();
      vend = Array.isArray(created) ? created[0] : created;
    }

    if (vend?.inmueble_ref) {
      const inmRes = await fetch(
        `${SB_URL}/rest/v1/inmuebles?ref=eq.${encodeURIComponent(vend.inmueble_ref)}&select=id`,
        { headers: svcHeaders() }
      );
      const inmRows = inmRes.ok ? await inmRes.json() : [];
      return res.status(200).json({
        ok: true,
        ref: vend.inmueble_ref,
        inmueble_id: inmRows?.[0]?.id || null,
        already: true,
      });
    }

    const ref = await generateRef();
    const slug = ref.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const inmPayload = cleanRow({
      ref,
      slug,
      titulo: `Inmueble en venta — ${direccion.slice(0, 120)}`,
      descripcion: 'Alta desde panel vendedor. Pendiente de valoración por el equipo NuevaHabitat.',
      tipo: 'piso',
      estado: 'retirado',
      precio: 0,
      direccion,
      propietario_nombre: nombre,
      propietario_telefono: telefono,
      propietario_email: email,
      cartera_privada: true,
      publicado: false,
    });

    const inmIns = await fetch(`${SB_URL}/rest/v1/inmuebles`, {
      method: 'POST',
      headers: svcHeaders(),
      body: JSON.stringify(inmPayload),
    });
    if (!inmIns.ok) throw new Error(await inmIns.text());
    const inmData = await inmIns.json();
    const inmueble = Array.isArray(inmData) ? inmData[0] : inmData;

    const vendUpd = await fetch(`${SB_URL}/rest/v1/vendedores?id=eq.${vend.id}`, {
      method: 'PATCH',
      headers: svcHeaders('return=minimal'),
      body: JSON.stringify(cleanRow({
        nombre,
        telefono,
        inmueble_ref: ref,
        descripcion: `Inmueble: ${direccion}`,
        estado_expediente: 'valoracion',
        updated_at: new Date().toISOString(),
      })),
    });
    if (!vendUpd.ok) throw new Error(await vendUpd.text());

    return res.status(200).json({
      ok: true,
      ref,
      inmueble_id: inmueble?.id || null,
      already: false,
    });
  } catch (err) {
    console.error('onboarding-vendedor api', err);
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
}
