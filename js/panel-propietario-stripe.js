/**
 * Honorarios administración alquiler — misma UX que panel comprador/vendedor
 */
(function () {
  let paying = false;
  let transferNotify = false;
  let bankInfo = null;
  let paymentState = null;

  function isIntegral(row) {
    return row?.servicio === 'integral';
  }

  function formatEur(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n) || 60);
  }

  function integralTotal(row) {
    return Number(row?.integral_tarifa) || 499;
  }

  function splitIva(total) {
    const base = Math.round((total / 1.21) * 100) / 100;
    const iva = Math.round((total - base) * 100) / 100;
    return { base, iva, total };
  }

  async function getToken() {
    const { data } = await window.nhSupabase.auth.getSession();
    return data?.session?.access_token || null;
  }

  function copyText(text, label) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.nhToast?.(`${label || 'Copiado'} al portapapeles`, 'success');
      }).catch(() => prompt('Copia manualmente:', text));
    } else {
      prompt('Copia manualmente:', text);
    }
  }

  function renderTransferBlock(row, info) {
    if (!info?.bank) return '';
    const total = Number(row?.cuota_mensual) || 60;
    const pending = !!row?.cuota_transferencia_pendiente;
    const concept = info.payment?.concept || info.payment?.reference || '';
    return `
      <div class="nh-bank-block">
        <div class="nh-bank-title">Pagar por transferencia bancaria</div>
        <p class="nh-bank-note">Cuota mensual de administración. El <strong>beneficiario debe coincidir exactamente</strong> con el titular indicado.</p>
        <dl class="nh-bank-dl">
          <div class="nh-bank-row">
            <dt>Titular(es)</dt>
            <dd>${info.bank.holders}</dd>
          </div>
          <div class="nh-bank-row">
            <dt>IBAN</dt>
            <dd><code class="nh-bank-iban">${info.bank.iban}</code>
              <button type="button" class="nh-bank-copy" data-copy="${info.bank.ibanRaw || info.bank.iban.replace(/\s/g, '')}">Copiar</button></dd>
          </div>
          <div class="nh-bank-row">
            <dt>Importe exacto</dt>
            <dd><strong>${formatEur(total)}</strong> / mes</dd>
          </div>
          <div class="nh-bank-row">
            <dt>Concepto</dt>
            <dd><code>${concept}</code>
              <button type="button" class="nh-bank-copy" data-copy="${concept}">Copiar</button></dd>
          </div>
        </dl>
        ${pending ? `
          <div class="nh-pay-status nh-pay-status--ok" style="margin-top:.75rem;background:rgba(184,147,106,.12);border-color:rgba(184,147,106,.35)">
            <strong style="color:var(--oro-oscuro,#92672a)">Transferencia en revisión</strong>
            <span style="color:var(--gris-texto)">Confirmaremos al recibir el ingreso (1–2 días laborables)</span>
          </div>
        ` : `
          <button type="button" class="btn btn-outline nh-transfer-btn" style="width:100%;justify-content:center;margin-top:.75rem">
            Ya he realizado la transferencia
          </button>
        `}
      </div>
    `;
  }

  function renderIntegralSectionHtml(row) {
    const total = integralTotal(row);
    const { base, iva } = splitIva(total);
    if (row?.integral_pagado) {
      return `
        <div class="nh-pay-summary">
          <div class="nh-pay-row nh-pay-row--total"><span>Alquiler integral pagado</span><strong>${formatEur(total)}</strong></div>
        </div>
        <div class="nh-pay-status nh-pay-status--ok">
          <strong>Servicio contratado</strong>
          <span>${row.integral_pagado_at ? `Confirmado el ${new Date(row.integral_pagado_at).toLocaleDateString('es-ES')}` : 'Pago recibido'}</span>
        </div>
        <p style="font-size:.85rem;color:var(--gris-texto);margin-top:1rem;line-height:1.55">Completa documentación, inmueble y candidato inquilino. Juan Cárdenas te guiará en captación y cierre.</p>
      `;
    }
    if (row?.integral_transferencia_pendiente) {
      return `
        <div class="nh-pay-summary">
          <div class="nh-pay-row nh-pay-row--total"><span>Total servicio integral</span><strong>${formatEur(total)}</strong></div>
        </div>
        <div class="nh-pay-status" style="background:rgba(184,147,106,.12);border-color:rgba(184,147,106,.35)">
          <strong style="color:var(--oro-oscuro,#92672a)">Transferencia en revisión</strong>
          <span>Confirmaremos al recibir los 499 € (1–2 días laborables)</span>
        </div>
        ${bankInfo ? renderIntegralTransferBlock(row, bankInfo) : ''}
      `;
    }
    return `
      <div class="nh-pay-summary">
        <div class="nh-pay-row"><span>Base imponible</span><strong>${formatEur(base)}</strong></div>
        <div class="nh-pay-row"><span>IVA (21%)</span><strong>${formatEur(iva)}</strong></div>
        <div class="nh-pay-row nh-pay-row--total"><span>Total servicio integral</span><strong>${formatEur(total)}</strong></div>
      </div>
      <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:1rem 0 .75rem">
        Pago único por publicación, filtro de inquilinos, visitas, informe top 3 y cierre con contrato LAU.
      </p>
      <button type="button" class="btn btn-gold btn-lg nh-pay-btn" id="integralPayBtn" style="width:100%;justify-content:center;margin-bottom:1rem">
        Pagar ${formatEur(total)} con tarjeta
      </button>
      ${bankInfo ? renderIntegralTransferBlock(row, bankInfo) : '<p style="font-size:.82rem;color:var(--gris-texto)">Cargando datos bancarios…</p>'}
    `;
  }

  function renderIntegralTransferBlock(row, info) {
    if (!info?.bank) return '';
    const total = integralTotal(row);
    const concept = info.payment?.concept || info.payment?.reference || '';
    return `
      <div class="nh-bank-block">
        <div class="nh-bank-title">Pagar por transferencia (499 €)</div>
        <p class="nh-bank-note">Importe exacto · concepto obligatorio</p>
        <dl class="nh-bank-dl">
          <div class="nh-bank-row"><dt>Titular</dt><dd>${info.bank.holders}</dd></div>
          <div class="nh-bank-row"><dt>IBAN</dt><dd><code class="nh-bank-iban">${info.bank.iban}</code>
            <button type="button" class="nh-bank-copy" data-copy="${info.bank.ibanRaw || info.bank.iban.replace(/\s/g, '')}">Copiar</button></dd></div>
          <div class="nh-bank-row"><dt>Importe</dt><dd><strong>${formatEur(total)}</strong></dd></div>
          <div class="nh-bank-row"><dt>Concepto</dt><dd><code>${concept}</code>
            <button type="button" class="nh-bank-copy" data-copy="${concept}">Copiar</button></dd></div>
        </dl>
        <button type="button" class="btn btn-outline nh-transfer-btn nh-transfer-integral" style="width:100%;justify-content:center;margin-top:.75rem">
          Ya he transferido los 499 €
        </button>
      </div>
    `;
  }

  function renderSectionHtml(row) {
    if (isIntegral(row)) return renderIntegralSectionHtml(row);

    const total = Number(row?.cuota_mensual) || 60;
    const { base, iva } = splitIva(total);
    const active = !!row?.suscripcion_activa;
    const periodEnd = row?.suscripcion_periodo_fin
      ? new Date(row.suscripcion_periodo_fin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    if (active) {
      return `
        <div class="nh-pay-summary">
          <div class="nh-pay-row"><span>Cuota mensual (IVA incl.)</span><strong>${formatEur(total)}</strong></div>
          <div class="nh-pay-row"><span>Base imponible</span><strong>${formatEur(base)}</strong></div>
          <div class="nh-pay-row"><span>IVA (21%)</span><strong>${formatEur(iva)}</strong></div>
        </div>
        <div class="nh-pay-status nh-pay-status--ok">
          <strong>Domiciliación activa</strong>
          <span>${row.suscripcion_estado || 'active'}${periodEnd ? ` · Próximo ciclo: ${periodEnd}` : ''}</span>
        </div>
        <button type="button" class="btn btn-gold btn-lg" id="alqPortalBtn" style="width:100%;justify-content:center;margin-top:1rem">
          Gestionar tarjeta y facturas
        </button>
      `;
    }

    return `
      <div class="nh-pay-summary">
        <div class="nh-pay-row"><span>Base imponible</span><strong>${formatEur(base)}</strong></div>
        <div class="nh-pay-row"><span>IVA (21%)</span><strong>${formatEur(iva)}</strong></div>
        <div class="nh-pay-row nh-pay-row--total"><span>Total / mes</span><strong>${formatEur(total)}</strong></div>
      </div>
      <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:1rem 0 .75rem">
        Domicilia la cuota con tarjeta (Stripe, cargo mensual automático) o paga cada mes por transferencia con el concepto indicado.
      </p>
      <button type="button" class="btn btn-gold btn-lg nh-pay-btn" id="alqSubscribeBtn" style="width:100%;justify-content:center;margin-bottom:1rem">
        Domiciliar ${formatEur(total)}/mes con tarjeta
      </button>
      ${bankInfo ? renderTransferBlock(row, bankInfo) : '<p style="font-size:.82rem;color:var(--gris-texto)">Cargando datos bancarios…</p>'}
    `;
  }

  function renderResumenCardHtml(row) {
    if (isIntegral(row)) {
      const total = integralTotal(row);
      if (row?.integral_pagado) {
        return `
          <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Alquiler integral</div>
          <div style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:.35rem">${formatEur(total)} · pagado</div>
          <div class="nh-pay-badge nh-pay-badge--done" style="display:inline-flex;margin-top:.5rem">Servicio activo</div>
        `;
      }
      return `
        <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Alquiler integral</div>
        <div style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:.5rem">${formatEur(total)} precio fijo</div>
        <button type="button" class="btn btn-gold nh-pay-btn-resumen" style="font-size:.84rem;width:100%;justify-content:center">Pagar servicio</button>
      `;
    }

    const total = Number(row?.cuota_mensual) || 60;
    const active = !!row?.suscripcion_activa;
    if (active) {
      return `
        <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Cuota administración</div>
        <div style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:.35rem">${formatEur(total)}/mes</div>
        <div class="nh-pay-badge nh-pay-badge--done" style="display:inline-flex;margin-top:.5rem">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          Domiciliado
        </div>
      `;
    }
    return `
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro);margin-bottom:.5rem">Cuota administración</div>
      <div style="font-family:var(--font-serif);font-size:1.35rem;margin-bottom:.5rem">${formatEur(total)}/mes IVA incl.</div>
      <button type="button" class="btn btn-gold nh-pay-btn-resumen" style="font-size:.84rem;width:100%;justify-content:center">Ir a pagos</button>
    `;
  }

  function bindActions() {
    document.getElementById('alqSubscribeBtn')?.addEventListener('click', startCheckout);
    document.getElementById('alqPortalBtn')?.addEventListener('click', openPortal);
    document.querySelectorAll('.nh-pay-btn').forEach((btn) => {
      btn.addEventListener('click', startCheckout);
    });
    document.querySelectorAll('.nh-pay-btn-resumen').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelector('.p-nav-btn[data-sec="honorarios"]')?.click();
      });
    });
    document.querySelectorAll('.nh-bank-copy').forEach((btn) => {
      btn.addEventListener('click', () => copyText(btn.dataset.copy, btn.dataset.copy?.includes('NH') ? 'Concepto' : 'IBAN'));
    });
    document.querySelectorAll('.nh-transfer-btn.nh-transfer-integral').forEach((btn) => {
      btn.addEventListener('click', () => notifyTransferDone(true));
    });
    document.querySelectorAll('.nh-transfer-btn:not(.nh-transfer-integral)').forEach((btn) => {
      btn.addEventListener('click', () => notifyTransferDone(false));
    });
  }

  async function fetchBankInfo(row) {
    const token = await getToken();
    if (!token) return null;
    const q = isIntegral(row) ? 'transfer=1&alquiler=1&integral=1' : 'transfer=1&alquiler=1';
    try {
      const res = await fetch(`/api/stripe-checkout?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return null;
      return data;
    } catch (e) {
      console.warn('fetchBankInfo alquiler', e);
      return null;
    }
  }

  async function loadHonorarios(row) {
    paymentState = row;
    bankInfo = null;
    const needsBank = row && (
      (isIntegral(row) && !row.integral_pagado && !row.integral_transferencia_pendiente)
      || (!isIntegral(row) && !row.suscripcion_activa)
    );
    if (needsBank) {
      bankInfo = await fetchBankInfo(row);
    }
    const body = document.getElementById('honorariosAlquilerBody');
    if (body) {
      body.innerHTML = renderSectionHtml(row);
    }
    const resumenCard = document.getElementById('honorariosResumenCard');
    if (resumenCard) {
      resumenCard.innerHTML = renderResumenCardHtml(row);
    }
    bindActions();
  }

  async function startCheckout() {
    if (paying) return;
    if (isIntegral(paymentState)) {
      if (paymentState?.integral_pagado) return;
    } else if (paymentState?.suscripcion_activa) return;
    paying = true;
    document.querySelectorAll('.nh-pay-btn, #alqSubscribeBtn, #integralPayBtn').forEach((btn) => {
      btn.disabled = true;
      if (btn.id === 'alqSubscribeBtn') btn.textContent = 'Redirigiendo a Stripe…';
      if (btn.id === 'integralPayBtn') btn.textContent = 'Redirigiendo a Stripe…';
    });
    try {
      const token = await getToken();
      if (!token) throw new Error('Sesión expirada');
      const action = isIntegral(paymentState) ? 'integral-checkout' : 'alquiler-subscribe';
      const res = await fetch(`/api/stripe-checkout?__action=${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo iniciar el pago');
      window.location.href = data.url;
    } catch (err) {
      window.nhToast?.(err.message || 'Error al iniciar el pago', 'error');
      paying = false;
      document.querySelectorAll('.nh-pay-btn, #alqSubscribeBtn').forEach((btn) => { btn.disabled = false; });
      const sub = document.getElementById('alqSubscribeBtn');
      if (sub) sub.textContent = `Domiciliar ${formatEur(paymentState?.cuota_mensual || 60)}/mes con tarjeta`;
    }
  }

  async function notifyTransferDone(integral) {
    if (transferNotify) return;
    if (integral) {
      if (paymentState?.integral_pagado) return;
    } else if (paymentState?.suscripcion_activa) return;
    const msg = integral
      ? '¿Confirmas la transferencia de 499 € con el concepto indicado?'
      : '¿Confirmas que has realizado la transferencia con el importe y concepto indicados?';
    if (!confirm(msg)) return;
    transferNotify = true;
    try {
      const token = await getToken();
      if (!token) throw new Error('Sesión expirada');
      const q = integral ? 'transfer=1&alquiler=1&integral=1' : 'transfer=1&alquiler=1';
      const res = await fetch(`/api/stripe-checkout?${q}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ transfer: true, integral: !!integral }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo registrar');
      window.nhToast?.(data.alreadyPending ? 'Ya teníamos registrado tu aviso.' : 'Aviso enviado. Confirmaremos al recibir el ingreso.', 'success');
      if (window.alqExpediente) {
        if (integral) window.alqExpediente.integral_transferencia_pendiente = true;
        else window.alqExpediente.cuota_transferencia_pendiente = true;
        await loadHonorarios(window.alqExpediente);
      }
    } catch (err) {
      window.nhToast?.(err.message || 'Error', 'error');
    } finally {
      transferNotify = false;
    }
  }

  async function openPortal() {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/stripe-checkout?__action=alquiler-portal', {
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

  async function verifySession(sessionId, opts = {}) {
    const token = await getToken();
    if (!token) return;
    const integral = opts.integral || isIntegral(paymentState) || new URLSearchParams(location.search).get('pago') === 'integral';
    const action = integral ? 'integral-verify-session' : 'alquiler-verify-session';
    try {
      const res = await fetch(`/api/stripe-checkout?__action=${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.ok) {
        window.nhToast?.(integral ? 'Pago del alquiler integral confirmado' : 'Domiciliación activada correctamente', 'success');
        const url = new URL(window.location.href);
        url.searchParams.delete('session_id');
        url.searchParams.delete('pago');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    } catch (e) {
      console.warn('verifySession', e);
    }
  }

  window.nhAlquilerStripe = {
    async render(row) {
      await loadHonorarios(row);
    },
    verifySession,
    reload: loadHonorarios,
  };
})();
