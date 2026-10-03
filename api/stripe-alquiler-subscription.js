/**
 * POST /api/stripe-alquiler-subscription — Checkout suscripción 60 €/mes (admin alquiler)
 * POST ?__action=verify-session — Tras volver de Stripe Checkout
 * POST ?__action=portal — Customer portal (gestionar tarjeta)
 */
import Stripe from 'stripe';
import {
  SB_SERVICE,
  getUserFromJwt,
  fetchPropietarioAlquilerAsUser,
  fetchPropietarioAlquilerRow,
  markAlquilerSubscription,
} from '../lib/server/supabase-server.js';

const DEFAULT_CUOTA_EUR = 60;

function siteOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.nuevahabitat.com';
  return `${proto}://${host}`;
}

function eurosToCents(amount) {
  return Math.round(Number(amount) * 100);
}

async function handleVerifySession(req, res) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'Servicio no configurado' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const sessionId = (req.body?.sessionId || '').trim();
  if (!sessionId) return res.status(400).json({ ok: false, error: 'sessionId required' });

  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    const meta = session.metadata || {};
    const metaEmail = (meta.nh_email || '').toLowerCase();
    if (metaEmail && metaEmail !== user.email.toLowerCase()) {
      return res.status(403).json({ ok: false, error: 'Sesión no pertenece a este usuario' });
    }

    const row = await fetchPropietarioAlquilerRow(user.email);
    if (!row?.id) return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });

    if (row.suscripcion_activa && row.stripe_subscription_id) {
      return res.status(200).json({ ok: true, alreadyActive: true });
    }

    const subId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;
    let sub = session.subscription;
    if (subId && typeof sub !== 'object') {
      sub = await stripe.subscriptions.retrieve(subId);
    }

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const periodEnd = sub?.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;

    await markAlquilerSubscription({
      recordId: row.id,
      customerId,
      subscriptionId: subId,
      status: sub?.status || 'active',
      periodEnd,
      active: sub?.status === 'active' || sub?.status === 'trialing',
    });

    return res.status(200).json({ ok: true, active: true, status: sub?.status });
  } catch (err) {
    console.error('stripe-alquiler verify:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error al verificar' });
  }
}

async function handlePortal(req, res) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'Servicio no configurado' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  try {
    const row = await fetchPropietarioAlquilerAsUser(user.email, jwt);
    if (!row?.stripe_customer_id) {
      return res.status(400).json({ ok: false, error: 'Aún no hay domiciliación activa' });
    }
    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
    const origin = siteOrigin(req);
    const portal = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${origin}/panel-propietario?sec=honorarios`,
    });
    return res.status(200).json({ ok: true, url: portal.url });
  } catch (err) {
    console.error('stripe-alquiler portal:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error portal' });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.query?.__action === 'verify-session') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    return handleVerifySession(req, res);
  }

  if (req.query?.__action === 'portal') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    return handlePortal(req, res);
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'Stripe no configurado', code: 'NO_STRIPE' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email || !jwt) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const email = user.email.trim();

  try {
    const row = await fetchPropietarioAlquilerAsUser(email, jwt);
    if (!row) {
      return res.status(404).json({ ok: false, error: 'Expediente de alquiler no encontrado' });
    }
    if (row.suscripcion_activa && row.stripe_subscription_id) {
      return res.status(400).json({ ok: false, error: 'La domiciliación ya está activa', code: 'ALREADY_ACTIVE' });
    }

    const totalEur = Number(row.cuota_mensual) || DEFAULT_CUOTA_EUR;
    const amountCents = eurosToCents(totalEur);
    const priceId = process.env.STRIPE_ALQUILER_PRICE_ID;

    const stripe = new Stripe(secretKey, { apiVersion: '2024-11-20.acacia' });
    const origin = siteOrigin(req);

    const lineItems = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: amountCents,
          recurring: { interval: 'month' },
          product_data: {
            name: 'Administración de alquiler NuevaHabitat',
            description: `${totalEur.toLocaleString('es-ES')} €/mes IVA incluido · gestión sin contacto con el inquilino`,
          },
        },
      }];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: lineItems,
      metadata: {
        nh_tipo: 'propietario_alquiler',
        nh_record_id: row.id,
        nh_user_id: user.id,
        nh_email: email,
      },
      subscription_data: {
        metadata: {
          nh_tipo: 'propietario_alquiler',
          nh_record_id: row.id,
          nh_email: email,
        },
      },
      success_url: `${origin}/panel-propietario?session_id={CHECKOUT_SESSION_ID}&sec=honorarios`,
      cancel_url: `${origin}/panel-propietario?pago=cancel&sec=honorarios`,
    });

    return res.status(200).json({ ok: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('stripe-alquiler-subscription:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error al crear suscripción' });
  }
}
