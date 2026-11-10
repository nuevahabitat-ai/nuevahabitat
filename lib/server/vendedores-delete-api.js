import { SB_URL, svcHeaders } from './supabase-server.js';

export async function deleteVendedorPermanent(id, inmuebleRef) {
  const ref = inmuebleRef ? String(inmuebleRef).trim() : '';
  if (ref) {
    const body = { inmueble_ref: ref, vendedor_id: id, motivo: 'eliminado_panel' };
    const ex = await fetch(`${SB_URL}/rest/v1/vendedores_inmueble_excluidos?on_conflict=inmueble_ref`, {
      method: 'POST',
      headers: {
        ...svcHeaders('return=minimal'),
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(body),
    });
    if (!ex.ok && ex.status !== 404) {
      const t = await ex.text();
      if (!/vendedores_inmueble_excluidos/.test(t)) throw new Error(t);
    }
  }
  const res = await fetch(`${SB_URL}/rest/v1/vendedores?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: svcHeaders('return=minimal'),
  });
  if (!res.ok) {
    const t = await res.text();
    if (res.status === 404 && /vendedores_inmueble_excluidos/.test(t)) {
      const res2 = await fetch(`${SB_URL}/rest/v1/vendedores?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: svcHeaders('return=minimal'),
      });
      if (!res2.ok) throw new Error(await res2.text());
      return { ok: true, warned: 'Sin tabla excluidos — ejecuta migración 068' };
    }
    throw new Error(t || `DELETE ${res.status}`);
  }
  return { ok: true };
}
