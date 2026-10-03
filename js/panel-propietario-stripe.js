/**
 * Domiciliación Stripe — administración alquiler 60 €/mes
 */
(function () {
  let paying = false;

  function formatEur(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n) || 60);
  }

  async function getToken() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  function renderHtml(row) {
    const total = Number(row?.cuota_mensual) || 60;
    const active = !!row?.suscripcion_activa;
    const status = row?.suscripcion_estado || '';
    const periodEnd = row?.suscripcion_periodo_fin
      ? new Date(row.suscripcion_periodo_fin).toLocaleDateString('es-ES')
      : null;

    if (active) {
      return `
        <div class="nh-pay-badge nh-pay-badge--ok" style="margin-bottom:1rem">Suscripción activa${status ? ' · ' + status : ''}</div>
        <p style="font-size:.875rem;opacity:.9;margin-bottom:1rem">Cuota: <strong>${formatEur(total)}</strong>/mes (IVA incluido)${periodEnd ? ` · Próximo ciclo: ${periodEnd}` : ''}</p>
        <button type="button" class="btn btn-gold" id="alqPortalBtn" style="width:100%;justify-content:center">Gestionar tarjeta y facturas</button>
      `;
    }

    return `
      <div class="nh-pay-badge nh-pay-badge--pending" style="margin-bottom:1rem">Pendiente de domiciliar</div>
      <p style="font-size:.875rem;opacity:.9;margin-bottom:1rem">Importe mensual: <strong>${formatEur(total)}</strong> (IVA incluido)</p>
      <button type="button" class="btn btn-gold" id="alqSubscribeBtn" style="width:100%;justify-content:center">Domiciliar con tarjeta (Stripe)</button>
      <p style="font-size:.75rem;opacity:.75;margin-top:.75rem">Pago seguro procesado por Stripe. No almacenamos los datos de tu tarjeta.</p>
    `;
  }

  function bindActions(row) {
    document.getElementById('alqSubscribeBtn')?.addEventListener('click', () => startCheckout());
    document.getElementById('alqPortalBtn')?.addEventListener('click', () => openPortal());
  }

  async function startCheckout() {
    if (paying) return;
    const token = await getToken();
    if (!token) {
      window.nhToast?.('Inicia sesión de nuevo', 'error');
      return;
    }
    paying = true;
    const btn = document.getElementById('alqSubscribeBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Redirigiendo a Stripe…'; }
    try {
      const res = await fetch('/api/stripe-alquiler-subscription', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        window.nhToast?.(data.error || 'No se pudo iniciar el pago', 'error');
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      console.warn(e);
      window.nhToast?.('Error de conexión', 'error');
    } finally {
      paying = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Domiciliar con tarjeta (Stripe)'; }
    }
  }

  async function openPortal() {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/stripe-alquiler-subscription?__action=portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else window.nhToast?.(data.error || 'Portal no disponible', 'error');
    } catch (e) {
      window.nhToast?.('Error de conexión', 'error');
    }
  }

  async function verifySession(sessionId) {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/stripe-alquiler-subscription?__action=verify-session', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.ok) {
        window.nhToast?.('Domiciliación activada correctamente', 'success');
        const url = new URL(window.location.href);
        url.searchParams.delete('session_id');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    } catch (e) {
      console.warn('verifySession', e);
    }
  }

  window.nhAlquilerStripe = {
    render(row) {
      const root = document.getElementById('honorariosAlquilerBody');
      if (!root) return;
      root.innerHTML = renderHtml(row);
      bindActions(row);
    },
    verifySession,
  };
})();
