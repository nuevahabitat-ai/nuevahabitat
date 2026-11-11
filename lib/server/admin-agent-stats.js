/**
 * Métricas reales del panel (Supabase count).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';

async function countTable(table, query = '') {
  const q = query ? `?${query}` : '';
  const res = await fetch(`${SB_URL}/rest/v1/${table}${q}`, {
    headers: { ...svcHeaders(), Prefer: 'count=exact' },
    method: 'HEAD',
  });
  if (!res.ok) {
    const r2 = await fetch(`${SB_URL}/rest/v1/${table}${q}&select=id&limit=1`, {
      headers: { ...svcHeaders(), Prefer: 'count=exact' },
    });
    const range = r2.headers.get('content-range') || '';
    const m = range.match(/\/(\d+)$/);
    return m ? Number(m[1]) : null;
  }
  const range = res.headers.get('content-range') || '';
  const m = range.match(/\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

export async function getPanelResumen() {
  const [
    compradoresTotal,
    compradoresActivos,
    compradoresSinPresupuesto,
    inmueblesPublicados,
    particularesActivos,
    leadsFormulario,
  ] = await Promise.all([
    countTable('compradores', 'select=id'),
    countTable('compradores', 'select=id&activo=eq.true'),
    countTable('compradores', 'select=id&presupuesto_max=is.null'),
    countTable('inmuebles', 'select=id&publicado=eq.true'),
    countTable('particulares', 'select=id&estado=neq.descartado'),
    countTable('leads', 'select=id&origen=eq.formulario'),
  ]);

  return {
    ok: true,
    generado_at: new Date().toISOString(),
    compradores: {
      total: compradoresTotal,
      activos: compradoresActivos,
      sin_presupuesto_max: compradoresSinPresupuesto,
    },
    inmuebles_publicados: inmueblesPublicados,
    particulares_activos: particularesActivos,
    leads_formulario: leadsFormulario,
    nota: 'Cifras desde Supabase; el dashboard puede mostrar solo últimos N en widgets.',
  };
}
