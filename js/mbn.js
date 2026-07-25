/** Bottom nav móvil — inyecta si la página no lo incluye */
(function () {
  if (document.getElementById('mbn')) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const tabMap = {
    'index.html': 'inicio', 'inmuebles.html': 'inmuebles', 'inmueble-detalle.html': 'inmuebles',
    'vender.html': 'vender', 'vender-les-corts': 'vender', 'vender-eixample': 'vender', 'vender-sants': 'vender', 'vender-gracia': 'vender', 'vender-sarria': 'vender', 'vender-piso-gotic-barcelona': 'vender', 'vender-piso-born-barcelona': 'vender', 'vender-piso-raval-barcelona': 'vender', 'vender-piso-barceloneta': 'vender', 'vender-piso-alquilado-barcelona': 'vender', 'vender-piso-rapido-barcelona': 'vender', 'comprar.html': 'comprar',
    'login.html': 'cuenta', 'registro.html': 'cuenta', 'confirmar-cuenta.html': 'cuenta', 'panel.html': 'cuenta'
  };
  const active = tabMap[path] || '';

  document.body.insertAdjacentHTML('beforeend', `
<nav class="mbn" id="mbn">
  <a href="index.html" class="mbn-tab${active === 'inicio' ? ' active' : ''}" data-tab="inicio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Inicio</span></a>
  <a href="inmuebles.html" class="mbn-tab${active === 'inmuebles' ? ' active' : ''}" data-tab="inmuebles"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35"/></svg><span>Inmuebles</span></a>
  <a href="vender.html" class="mbn-tab${active === 'vender' ? ' active' : ''}" data-tab="vender"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg><span>Vender</span></a>
  <a href="comprar.html" class="mbn-tab${active === 'comprar' ? ' active' : ''}" data-tab="comprar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg><span>Comprar</span></a>
  <a href="login.html" class="mbn-tab${active === 'cuenta' ? ' active' : ''}" data-tab="cuenta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span>Cuenta</span></a>
</nav>`);
})();
