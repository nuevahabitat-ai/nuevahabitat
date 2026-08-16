/**
 * Pagos Stripe — honorarios en panel vendedor / comprador
 */
(function () {
  const DEFAULTS = { comprador: 6050, vendedor: 3630 };
  let paymentState = null;
  let paying = false;

  function formatEur(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
  }

  function splitIva(total) {
    const base = Math.round((total / 1.21) * 100) / 100;
    const iva = Math.round((total - base) * 100) / 100;
    return { base, iva, total };
  }

  function getTipo() {
    return window.userTipo === 'vendedor' ? 'vendedor' : 'comprador';
  }

  async function getSessionToken() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  async function fetchPaymentRow() {
    const tipo = getTipo();
    const email = window.currentUser?.email;
    if (!email || !window.nhSupabase) return null;
    const tabla = tipo === 'vendedor' ? 'vendedores' : 'compradores';
    const { data, error } = await window.nhSupabase
      .from(tabla)
      .select('id,honorarios,honorarios_pagado,honorarios_pagado_at,stripe_payment_intent_id')
      .eq('email', email)
      .maybeSingle();
    if (error) {
      console.warn('nhStripe fetch', error);
      return null;
    }
    return data;
  }

  function renderHonorariosHtml(row) {
    const tipo = getTipo();
    const total = Number(row?.honorarios) || DEFAULTS[tipo];
    const { base, iva } = splitIva(total);
    const paid = !!row?.honorarios_pagado;
    const paidAt = row?.honorarios_pagado_at
      ? new Date(row.honorarios_pagado_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    const subtitle = tipo === 'vendedor'
      ? 'Honorarios fijos por la venta de tu inmueble. Pago seguro con tarjeta.'
      : 'Honorarios por el acompañamiento en la compra. Pago seguro con tarjeta.';

    const note = tipo === 'vendedor'
      ? 'Puedes pagar cuando quieras desde tu panel. Si no vendes, no pagas honorarios.'
      : 'Puedes abonar los honorarios en cualquier momento antes o después de la escritura.';

    return `
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Honorarios transparentes</div>
      <div style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:.25rem">${formatEur(base)} + IVA</div>
      <div style="font-size:.95rem;margin-bottom:.35rem;opacity:.9">${formatEur(iva)} IVA (21%) · ${formatEur(total)} total</div>
      <p style="font-size:.85rem;color:rgba(255,255,255,.65);margin-bottom:1rem;line-height:1.55">${subtitle} ${note}</p>
      ${paid ? `
        <div class="nh-pay-badge nh-pay-badge--done">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          Pagado${paidAt ? ` · ${paidAt}` : ''}
        </div>
      ` : `
        <button type="button" class="btn btn-gold nh-pay-btn" id="nhPayHonorariosBtn" style="font-size:.84rem;width:100%;justify-content:center">
          Pagar ${formatEur(total)} con tarjeta
        </button>
        <p style="font-size:.72rem;color:rgba(255,255,255,.45);margin-top:.65rem;margin-bottom:0">Pago seguro procesado por Stripe</p>
      `}
    `;
  }

  function renderSectionHtml(row) {
    const tipo = getTipo();
    const total = Number(row?.honorarios) || DEFAULTS[tipo];
    const { base, iva } = splitIva(total);
    const paid = !!row?.honorarios_pagado;
    const paidAt = row?.honorarios_pagado_at
      ? new Date(row.honorarios_pagado_at).toLocaleString('es-ES')
      : null;

    return `
      <div class="p-card">
        <div class="p-card-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path stroke-linecap="round" d="M2 10h20"/></svg>
          Pago de honorarios
        </div>
        <div class="nh-pay-summary">
          <div class="nh-pay-row"><span>Base imponible</span><strong>${formatEur(base)}</strong></div>
          <div class="nh-pay-row"><span>IVA (21%)</span><strong>${formatEur(iva)}</strong></div>
          <div class="nh-pay-row nh-pay-row--total"><span>Total</span><strong>${formatEur(total)}</strong></div>
        </div>
        ${paid ? `
          <div class="nh-pay-status nh-pay-status--ok">
            <strong>Honorarios pagados</strong>
            <span>${paidAt || 'Confirmado'}</span>
            ${row?.stripe_payment_intent_id ? `<small>Ref. ${row.stripe_payment_intent_id.slice(-8)}</small>` : ''}
          </div>
        ` : `
          <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:1rem 0">
            Puedes abonar los honorarios en cualquier momento. Te redirigiremos a Stripe para pagar con tarjeta de forma segura.
          </p>
          <button type="button" class="btn btn-gold btn-lg nh-pay-btn" id="nhPayHonorariosBtnMain" style="width:100%;justify-content:center">
            Pagar ${formatEur(total)} con tarjeta
          </button>
        `}
      </div>
      <div class="p-card" style="background:var(--crema)">
        <p style="font-size:.82rem;color:var(--gris-texto);line-height:1.65;margin:0">
          <strong>Factura:</strong> Tras el pago recibirás el comprobante de Stripe por email.
          Si necesitas factura a nombre de empresa, escríbenos antes del pago.
        </p>
      </div>
    `;
  }

  function bindPayButtons() {
    document.querySelectorAll('.nh-pay-btn').forEach((btn) => {
      btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.nh-pay-btn').forEach((btn) => {
      btn.addEventListener('click', startCheckout);
    });
  }

  function setPayLoading(loading) {
    paying = loading;
    document.querySelectorAll('.nh-pay-btn').forEach((btn) => {
      btn.disabled = loading;
      if (loading) btn.dataset.prevText = btn.textContent;
      btn.textContent = loading ? 'Redirigiendo a Stripe…' : (btn.dataset.prevText || btn.textContent);
    });
  }

  async function startCheckout() {
    if (paying || paymentState?.honorarios_pagado) return;
    setPayLoading(true);
    try {
      const token = await getSessionToken();
      if (!token) throw new Error('Sesión expirada. Vuelve a iniciar sesión.');

      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: getTipo() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'No se pudo iniciar el pago');
      }

      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'EUR',
          value: Number(paymentState?.honorarios) || DEFAULTS[getTipo()],
          items: [{ item_name: 'honorarios_' + getTipo() }],
        });
      }

      window.location.href = data.url;
    } catch (err) {
      alert(err.message || 'Error al iniciar el pago');
      setPayLoading(false);
    }
  }

  async function verifyReturnSession() {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) {
      if (params.get('pago') === 'cancel') {
        params.delete('pago');
        history.replaceState({}, '', location.pathname + '?' + params.toString());
      }
      return;
    }

    try {
      const token = await getSessionToken();
      if (!token) return;
      const res = await fetch('/api/stripe-verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.ok && (data.paid || data.alreadyPaid)) {
        params.delete('session_id');
        history.replaceState({}, '', location.pathname + '?' + params.toString());
        if (window.showToast) window.showToast('Pago confirmado. Gracias.', 'success');
        else alert('Pago confirmado. Gracias.');
        if (window.gtag) window.gtag('event', 'purchase', { transaction_id: sessionId });
      }
    } catch (err) {
      console.warn('verify session', err);
    }
  }

  function updateResumenBadge(row) {
    const el = document.getElementById('nhPayResumenBadge');
    if (!el) return;
    if (row?.honorarios_pagado) {
      el.innerHTML = '<span class="nh-pay-chip nh-pay-chip--ok">Honorarios pagados</span>';
    } else {
      const total = Number(row?.honorarios) || DEFAULTS[getTipo()];
      el.innerHTML = `<span class="nh-pay-chip nh-pay-chip--pending">Pendiente · ${formatEur(total)}</span>`;
    }
  }

  async function loadHonorarios() {
    const row = await fetchPaymentRow();
    paymentState = row;

    const cardComprador = document.getElementById('honorariosCardComprador');
    const cardVendedor = document.getElementById('honorariosCardVendedor');
    const section = document.getElementById('honorariosSectionContent');

    if (cardComprador && getTipo() === 'comprador') {
      cardComprador.innerHTML = renderHonorariosHtml(row);
    }
    if (cardVendedor && getTipo() === 'vendedor') {
      cardVendedor.innerHTML = renderHonorariosHtml(row);
    }
    if (section) {
      section.innerHTML = renderSectionHtml(row);
    }

    updateResumenBadge(row);
    bindPayButtons();
  }

  window.nhStripe = {
    loadHonorarios,
    verifyReturnSession,
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('supabase:ready', () => {
      setTimeout(verifyReturnSession, 800);
    });
  });
})();
