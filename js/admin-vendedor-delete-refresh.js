/**
 * Borrado de operaciones: API + refresco inmediato (debe cargarse DESPUÉS del script inline del panel).
 */
(function () {
  async function deleteVendedorNH(id) {
    if (!id) return;
    if (
      !confirm(
        '¿Eliminar esta operación de forma permanente?\n\nEl inmueble en cartera no se borra. No se recreará al sincronizar (si migración 068 está aplicada).',
      )
    ) {
      return;
    }
    const v = typeof window.vendFindById === 'function' ? window.vendFindById(id) : null;
    try {
      const {
        data: { session },
      } = await window.nhSupabase.auth.getSession();
      if (!session?.access_token) throw new Error('Sesión no válida');

      const res = await fetch('/api/notify?__action=admin-delete-vendedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session.access_token,
        },
        body: JSON.stringify({ id, inmueble_ref: v?.inmueble_ref || null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo eliminar');

      if (typeof window.bustPanelCache === 'function') {
        window.bustPanelCache(['vendedores', 'dashboard']);
      }
      if (Array.isArray(window._vendData)) {
        window._vendData = window._vendData.filter((x) => String(x.id) !== String(id));
      }
      if (Array.isArray(window._vendSeguimientoData)) {
        window._vendSeguimientoData = window._vendSeguimientoData.filter((x) => String(x.id) !== String(id));
      }
      if (typeof window.renderVendedores === 'function') window.renderVendedores();
      if (typeof window.renderVendSeguimientoSection === 'function') window.renderVendSeguimientoSection();

      window.nhToast?.(json.warned || 'Operación eliminada', json.warned ? 'info' : 'success', 2800);

      if (typeof window.loadVendedores === 'function') await window.loadVendedores(true);
      if (typeof window.loadDashboard === 'function') {
        const dashActive = document.querySelector('.adm-nav-item.active[data-sec="dashboard"]');
        if (dashActive) await window.loadDashboard(true);
      }
    } catch (e) {
      window.nhToast?.(e.message || String(e), 'error', 6000);
    }
  }

  window.deleteVendedor = deleteVendedorNH;
})();