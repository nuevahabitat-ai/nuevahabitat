/**
 * POST /api/stripe-verify-session — Confirma pago tras volver de Stripe Checkout.
 */
import Stripe from 'stripe';
import { SB_SERVICE, getUserFromJwt, fetchClienteRow, markHonorariosPaid } from './lib/supabase-server.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ ok: false, error: 'Pago no completado', status: session.payment_status });
    }

    const meta = session.metadata || {};
    const tipo = meta.nh_tipo === 'vendedor' ? 'vendedor' : 'comprador';
    const metaEmail = (meta.nh_email || '').toLowerCase();
    if (metaEmail && metaEmail !== user.email.toLowerCase()) {
      return res.status(403).json({ ok: false, error: 'Sesión no pertenece a este usuario' });
    }

    const fresh = await fetchClienteRow(tipo, user.email);
    if (!fresh?.id) return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });
    if (fresh.honorarios_pagado) {
      return res.status(200).json({ ok: true, alreadyPaid: true });
    }

    await markHonorariosPaid({
      tipo,
      recordId: fresh.id,
      sessionId: session.id,
      paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
    });

    return res.status(200).json({ ok: true, paid: true });
  } catch (err) {
    console.error('stripe-verify-session:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error al verificar pago' });
  }
}
