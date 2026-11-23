/**
 * Cron Vercel: compraventa automática compradores Idealista (cada 2 h).
 */
export default async function handler(req, res) {
  const auth = req.headers.authorization || req.headers['authorization'] || '';
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ ok: false, error: 'Sin Supabase' });
  }
  try {
    const { runAutoPresupuestoCompradores } = await import('../lib/server/auto-presupuesto-compradores.js');
    const result = await runAutoPresupuestoCompradores({ maxScrape: 60, limit: 500 });
    return res.status(200).json(result);
  } catch (err) {
    console.error('cron-presupuesto-compradores', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}