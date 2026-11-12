/** Bloques HTML reutilizables · landings Patrimonial por zona */

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function patrimonialAssetGrid() {
  return `<div class="nh-pat-asset-grid fade-up">
      <div class="nh-pat-asset"><strong>Viviendas</strong> Pisos en cartera de alquiler o venta</div>
      <div class="nh-pat-asset"><strong>Locales</strong> Comercio, hostelería y planta baja</div>
      <div class="nh-pat-asset"><strong>Oficinas</strong> Planta en edificio de oficinas o mixto</div>
      <div class="nh-pat-asset"><strong>Naves y solares</strong> Activo productivo o desarrollo</div>
    </div>`;
}

function patrimonialServicesNav() {
  return `<div class="nh-pat-alq-nav fade-up" style="margin-top:1.5rem">
      <a href="/administracion-alquileres">
        <strong>Administración de alquileres</strong>
        <span>59 €/mes IVA incl. por unidad · contrato en curso · escalable en cartera</span>
      </a>
      <a href="/alquiler-integral">
        <strong>Alquiler integral</strong>
        <span>599 € IVA incl. · pago único · de vacío a contrato LAU</span>
      </a>
    </div>`;
}

function patrimonialFormBlock(z) {
  const zoneLabel = esc(z.zoneName);
  return `<div class="nh-pat-form-card" id="pat-contacto">
        <form id="patForm" data-nh-zone="${esc(z.slug)}">
          <input type="hidden" name="zona_landing" value="${esc(z.slug)}"/>
          <p style="font-size:.82rem;color:var(--gris-medio);margin:0 0 1rem;line-height:1.5">Consulta patrimonial · <strong>${zoneLabel}</strong>. Origen <code>web_patrimonial</code> en panel.</p>
          <div class="form-group">
            <label for="pat-empresa">Empresa o patrimonial *</label>
            <input id="pat-empresa" name="empresa" required autocomplete="organization"/>
          </div>
          <div class="form-group">
            <label for="pat-nombre">Persona de contacto *</label>
            <input id="pat-nombre" name="nombre" required autocomplete="name"/>
          </div>
          <div class="form-group">
            <label for="pat-tel">Teléfono *</label>
            <input id="pat-tel" name="telefono" type="tel" required autocomplete="tel"/>
          </div>
          <div class="form-group">
            <label for="pat-email">Email</label>
            <input id="pat-email" name="email" type="email" autocomplete="email"/>
          </div>
          <div class="form-group">
            <label for="pat-activos">N.º aproximado de inmuebles</label>
            <select id="pat-activos" name="activos">
              <option value="">Seleccionar</option>
              <option value="1-5">1 – 5</option>
              <option value="6-20">6 – 20</option>
              <option value="21-50">21 – 50</option>
              <option value="50+">Más de 50</option>
            </select>
          </div>
          <div class="form-group">
            <label for="pat-tipos">Tipos de activo</label>
            <input id="pat-tipos" name="tipos" placeholder="Viviendas, locales, naves…"/>
          </div>
          <div class="form-group">
            <label for="pat-msg">Objetivo (administración, vacíos, venta…)</label>
            <textarea id="pat-msg" name="mensaje" rows="4" placeholder="Activo en ${zoneLabel}, plazos, inquilinos actuales…"></textarea>
          </div>
          <button type="submit" class="btn btn-gold btn-lg" id="pat-submit" style="width:100%;justify-content:center">Solicitar reunión de cartera</button>
          <p id="pat-ok" hidden style="margin-top:1rem;color:#15803d;font-size:.9rem">✓ Consulta enviada. Te contactamos pronto.</p>
        </form>
      </div>`;
}

function patrimonialFormScript(z) {
  return `<script>
document.getElementById('patForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('pat-submit');
  const empresa = document.getElementById('pat-empresa').value.trim();
  const nombre = document.getElementById('pat-nombre').value.trim();
  const telefono = document.getElementById('pat-tel').value.trim();
  const email = document.getElementById('pat-email').value.trim();
  const activos = document.getElementById('pat-activos').value;
  const tipos = document.getElementById('pat-tipos')?.value.trim();
  const msg = document.getElementById('pat-msg').value.trim();
  if (!empresa || !nombre || !telefono) {
    if (window.nhToast) window.nhToast('Completa empresa, contacto y teléfono.', 'error');
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  const mensaje = [
    'Patrimonial · ${esc(z.zoneName)} · landing ${esc(z.slug)}',
  ' · ' + empresa,
    activos ? 'Activos: ' + activos : '',
    tipos ? 'Tipos: ' + tipos : '',
    msg
  ].filter(Boolean).join(' · ');
  const ok = await nhSubmitLead({
    nombre: nombre + ' (' + empresa + ')',
    telefono,
    email: email || undefined,
    mensaje,
    tipo: 'info',
    origen: 'web_patrimonial',
    template: 'contacto',
    extra: { landing: '${esc(z.slug)}', cluster: 'patrimonial', zona: '${esc(z.zoneName)}' },
    onSuccess() {
      document.getElementById('pat-ok').hidden = false;
      btn.style.display = 'none';
      e.target.querySelectorAll('input,textarea,select').forEach(el => { el.disabled = true; });
    },
    onError() {
      btn.disabled = false;
      btn.textContent = 'Solicitar reunión de cartera';
    }
  });
  if (!ok) { btn.disabled = false; btn.textContent = 'Solicitar reunión de cartera'; }
});
</script>`;
}

function otherZonaLinks(currentSlug, zonas) {
  return zonas
    .filter((z) => z.slug !== currentSlug)
    .slice(0, 12)
    .map(
      (z) =>
        `<a href="/${z.slug}"><strong>${esc(z.zoneName)}</strong><span>Patrimonial · cartera empresas</span></a>`
    )
    .join('\n      ');
}

module.exports = {
  esc,
  patrimonialAssetGrid,
  patrimonialServicesNav,
  patrimonialFormBlock,
  patrimonialFormScript,
  otherZonaLinks,
};
