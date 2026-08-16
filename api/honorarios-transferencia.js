/**
 * GET  /api/honorarios-transferencia — Datos bancarios + referencia (auth)
 * POST /api/honorarios-transferencia — Cliente avisa que ha transferido
 */
import { getBankConfig, paymentReference } from './lib/bank-config.js';
import {
  SB_SERVICE,
  getUserFromJwt,
  fetchClienteRowAsUser,
  markTransferenciaPendiente,
} from './lib/supabase-server.js';
import { notifyTransferenciaPendiente } from './lib/payment-notify.js';

const DEFAULT_HONORARIOS = { comprador: 6050, vendedor: 3630 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SB_SERVICE) {
    return res.status(503).json({ ok: false, error: 'Servicio no configurado', code: 'NO_SERVICE_KEY' });
  }

  const auth = req.headers.authorization || '';
  const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const user = await getUserFromJwt(jwt);
  if (!user?.email || !jwt) return res.status(401).json({ ok: false, error: 'Not authenticated' });

  const tipoParam = req.method === 'GET'
    ? (req.query?.tipo || 'comprador')
    : (req.body?.tipo || 'comprador');
  const tipo = tipoParam === 'vendedor' ? 'vendedor' : 'comprador';

  try {
    const row = await fetchClienteRowAsUser(tipo, user.email, jwt);
    if (!row) return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });

    const bank = getBankConfig();
    const totalEur = Number(row.honorarios) || DEFAULT_HONORARIOS[tipo];
    const reference = paymentReference(tipo, row.id);
    const concept = `${bank.conceptPrefix} ${reference}`;

    if (req.method === 'GET') {
      return res.status(200).json({
        ok: true,
        bank: {
          holders: bank.holders,
          iban: bank.ibanFormatted,
          ibanRaw: bank.iban,
          bic: bank.bic || null,
          entity: bank.entity,
        },
        payment: {
          totalEur,
          reference,
          concept,
          tipo,
          recordId: row.id,
        },
        status: {
          paid: !!row.honorarios_pagado,
          transferPending: !!row.honorarios_transferencia_pendiente,
          transferAt: row.honorarios_transferencia_at || null,
          metodoPago: row.honorarios_metodo_pago || null,
        },
      });
    }

    if (row.honorarios_pagado) {
      return res.status(400).json({ ok: false, error: 'Los honorarios ya están pagados', code: 'ALREADY_PAID' });
    }
    if (row.honorarios_transferencia_pendiente) {
      return res.status(200).json({ ok: true, alreadyPending: true, reference, concept });
    }

    await markTransferenciaPendiente({ tipo, recordId: row.id });

    await notifyTransferenciaPendiente({
      email: user.email,
      nombre: row.nombre || user.email.split('@')[0],
      tipo,
      amount: totalEur,
      reference,
      concept,
    });

    return res.status(200).json({ ok: true, pending: true, reference, concept });
  } catch (err) {
    console.error('honorarios-transferencia:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error' });
  }
}
