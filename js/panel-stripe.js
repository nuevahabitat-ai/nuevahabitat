/**
 * Pagos honorarios — tarjeta (Stripe) y transferencia bancaria
 */
(function () {
  const DEFAULTS = { comprador: 6050, vendedor: 3630 };
  let paymentState = null;
  let bankInfo = null;
  let paying = false;
  let transferNotify = false;

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
      .select('id,nombre,honorarios,honorarios_pagado,honorarios_pagado_at,honorarios_metodo_pago,honorarios_transferencia_pendiente,honorarios_transferencia_at,stripe_payment_intent_id')
      .eq('email', email)
      .maybeSingle();
    if (error) {
      console.warn('nhStripe fetch', error);
      return null;
    }
    return data;
  }

  async function fetchBankInfo() {
    const token = await getSessionToken();
    if (!token) return null;
    try {
      const res = await fetch(`/api/honorarios-transferencia?tipo=${encodeURIComponent(getTipo())}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return null;
      return data;
    } catch (err) {
      console.warn('fetchBankInfo', err);
      return null;
    }
  }

  function copyText(text, label) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast(`${label || 'Copiado'} al portapapeles`, 'success');
      }).catch(() => prompt('Copia manualmente:', text));
    } else {
      prompt('Copia manualmente:', text);
    }
  }

  function renderTransferBlock(row, info) {
    if (!info?.bank) return '';
    const total = Number(row?.honorarios) || DEFAULTS[getTipo()];
    const pending = !!row?.honorarios_transferencia_pendiente;
    const concept = info.payment?.concept || info.payment?.reference || '';
    const holders = info.bank.holders;
    const iban = info.bank.iban;

    return `
      <div class="nh-bank-block">
        <div class="nh-bank-title">Pagar por transferencia bancaria</div>
        <p class="nh-bank-note">El <strong>beneficiario debe coincidir exactamente</strong> con el titular de la cuenta (no uses solo «Nueva Habitat»).</p>
        <dl class="nh-bank-dl">
          <div class="nh-bank-row">
            <dt>Titular(es)</dt>
            <dd>${holders}</dd>
          </div>
          <div class="nh-bank-row">
            <dt>IBAN</dt>
            <dd><code class="nh-bank-iban">${iban}</code> <button type="button" class="nh-bank-copy" data-copy="${info.bank.ibanRaw || iban.replace(/\s/g, '')}">Copiar</button></dd>
          </div>
          <div class="nh-bank-row">
            <dt>Importe exacto</dt>
            <dd><strong>${formatEur(total)}</strong></dd>
          </div>
          <div class="nh-bank-row">
            <dt>Concepto</dt>
            <dd><code>${concept}</code> <button type="button" class="nh-bank-copy" data-copy="${concept}">Copiar</button></dd>
          </div>
        </dl>
        ${pending ? `
          <div class="nh-pay-badge nh-pay-badge--pending">
            Transferencia en revisión — confirmaremos al recibir el ingreso (1–2 días laborables)
          </div>
        ` : `
          <button type="button" class="btn btn-outline nh-transfer-btn" id="nhTransferDoneBtn" style="width:100%;justify-content:center;margin-top:.75rem">
            Ya he realizado la transferencia
          </button>
        `}
      </div>
    `;
  }

  function renderHonorariosHtml(row) {
    const tipo = getTipo();
    const total = Number(row?.honorarios) || DEFAULTS[tipo];
    const { base, iva } = splitIva(total);
    const paid = !!row?.honorarios_pagado;
    const paidAt = row?.honorarios_pagado_at
      ? new Date(row.honorarios_pagado_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;
    const metodo = row?.honorarios_metodo_pago === 'transferencia' ? 'transferencia' : 'tarjeta';

    const subtitle = tipo === 'vendedor'
      ? 'Honorarios fijos por la venta de tu inmueble. Tarjeta o transferencia.'
      : 'Honorarios por el acompañamiento en la compra. Tarjeta o transferencia.';

    return `
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Honorarios transparentes</div>
      <div style="font-family:var(--font-serif);font-size:1.5rem;margin-bottom:.25rem">${formatEur(base)} + IVA</div>
      <div style="font-size:.95rem;margin-bottom:.35rem;opacity:.9">${formatEur(iva)} IVA (21%) · ${formatEur(total)} total</div>
      <p style="font-size:.85rem;color:rgba(255,255,255,.65);margin-bottom:1rem;line-height:1.55">${subtitle}</p>
      ${paid ? `
        <div class="nh-pay-badge nh-pay-badge--done">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          Pagado${paidAt ? ` · ${paidAt}` : ''}${metodo === 'transferencia' ? ' · Transferencia' : ''}
        </div>
      ` : `
        <button type="button" class="btn btn-gold nh-pay-btn" id="nhPayHonorariosBtn" style="font-size:.84rem;width:100%;justify-content:center;margin-bottom:.5rem">
          Pagar ${formatEur(total)} con tarjeta
        </button>
        <p style="font-size:.72rem;color:rgba(255,255,255,.45);margin:0 0 .75rem;text-align:center">Pago seguro con Stripe</p>
        ${bankInfo ? renderTransferBlock(row, bankInfo) : ''}
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
    const metodo = row?.honorarios_metodo_pago;

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
            <span>${paidAt || 'Confirmado'}${metodo === 'transferencia' ? ' · Transferencia bancaria' : metodo === 'stripe' ? ' · Tarjeta' : ''}</span>
            ${row?.stripe_payment_intent_id ? `<small>Ref. ${row.stripe_payment_intent_id.slice(-8)}</small>` : ''}
          </div>
        ` : `
          <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:1rem 0 .75rem">
            Elige tarjeta (Stripe) o transferencia bancaria. En transferencia, usa el titular exacto de la cuenta indicado abajo.
          </p>
          <button type="button" class="btn btn-gold btn-lg nh-pay-btn" id="nhPayHonorariosBtnMain" style="width:100%;justify-content:center;margin-bottom:1rem">
            Pagar ${formatEur(total)} con tarjeta
          </button>
          ${bankInfo ? renderTransferBlock(row, bankInfo) : '<p style="font-size:.82rem;color:var(--gris-texto)">Cargando datos bancarios…</p>'}
        `}
      </div>
      <div class="p-card" style="background:var(--crema)">
        <p style="font-size:.82rem;color:var(--gris-texto);line-height:1.65;margin:0">
          <strong>Factura:</strong> Tras confirmar el pago te enviaremos factura por email.
          Si necesitas factura a nombre de empresa, escríbenos antes de pagar a <a href="mailto:info@nuevahabitat.com">info@nuevahabitat.com</a>.
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

    document.querySelectorAll('.nh-bank-copy').forEach((btn) => {
      btn.addEventListener('click', () => copyText(btn.dataset.copy, btn.dataset.copy?.includes('NH') ? 'Concepto' : 'IBAN'));
    });

    document.querySelectorAll('.nh-transfer-btn').forEach((btn) => {
      btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.nh-transfer-btn').forEach((btn) => {
      btn.addEventListener('click', notifyTransferDone);
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

  function setTransferLoading(loading) {
    transferNotify = loading;
    document.querySelectorAll('.nh-transfer-btn').forEach((btn) => {
      btn.disabled = loading;
      btn.textContent = loading ? 'Enviando aviso…' : 'Ya he realizado la transferencia';
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
        const msg = data.code === 'NO_SERVICE_KEY'
          ? 'Configuración del servidor incompleta. Escríbenos por WhatsApp y lo resolvemos en minutos.'
          : (data.error || 'No se pudo iniciar el pago');
        throw new Error(msg);
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

  async function notifyTransferDone() {
    if (transferNotify || paymentState?.honorarios_pagado) return;
    if (!confirm('¿Confirmas que has realizado la transferencia con el importe y concepto indicados?')) return;
    setTransferLoading(true);
    try {
      const token = await getSessionToken();
      if (!token) throw new Error('Sesión expirada.');

      const res = await fetch('/api/honorarios-transferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: getTipo() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo registrar el aviso');

      if (window.showToast) {
        window.showToast(data.alreadyPending ? 'Ya teníamos registrado tu aviso.' : 'Aviso enviado. Confirmaremos al recibir el ingreso.', 'success');
      } else {
        alert('Aviso enviado. Confirmaremos el pago al recibir la transferencia.');
      }
      await loadHonorarios();
    } catch (err) {
      alert(err.message || 'Error al enviar aviso');
    } finally {
      setTransferLoading(false);
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
    } else if (row?.honorarios_transferencia_pendiente) {
      el.innerHTML = '<span class="nh-pay-chip nh-pay-chip--pending">Transferencia en revisión</span>';
    } else {
      const total = Number(row?.honorarios) || DEFAULTS[getTipo()];
      el.innerHTML = `<span class="nh-pay-chip nh-pay-chip--pending">Pendiente · ${formatEur(total)}</span>`;
    }
  }

  async function loadHonorarios() {
    const row = await fetchPaymentRow();
    paymentState = row;
    bankInfo = row && !row.honorarios_pagado ? await fetchBankInfo() : null;

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
