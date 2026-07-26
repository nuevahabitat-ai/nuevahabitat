const {
  nhServicioBlock,
  nhCompradoresEcosystemBlock,
  nhPanelDemoBlock,
  nhPlatformStyles,
} = require('./landing-nh-blocks');
const {
  nhBuyerEcosystemBlock,
  nhBuyerPanelDemoBlock,
  nhBuyerPlatformStyles,
} = require('./landing-nh-buyer-blocks');

function nhEcosystemIntroBlock() {
  return `<section class="lc-section lc-nh-ecosistema-intro" style="background:var(--crema);padding:5rem 0 4rem">
  <div class="container">
    <div class="text-center fade-up" style="max-width:820px;margin:0 auto 2.5rem">
      <span class="overline">El ecosistema NuevaHabitat</span>
      <h2 class="section-title">Dos plataformas, un mismo objetivo: cerrar operaciones reales en Barcelona</h2>
      <p style="color:var(--gris-texto);line-height:1.75;font-size:1.0625rem">NuevaHabitat no es un portal ni una agencia que publica y espera. Somos un <strong>ecosistema inmobiliario</strong> con <strong>compradores cualificados registrados</strong> en un lado y <strong>vendedores con panel propio</strong> en el otro. El equipo de NuevaHabitat conecta ambos mundos: filtramos solvencia, registramos cada visita y acompañamos hasta la escritura — con transparencia total en cada panel.</p>
    </div>
    <div class="lc-nh-eco-dual fade-up">
      <a href="#ecosistema-vendedor" class="lc-nh-eco-card">
        <span class="lc-nh-eco-label">Para vendedores</span>
        <h3>Encuentra comprador cualificado</h3>
        <p>Publicamos tu inmueble entre compradores con hipoteca verificada. Panel vendedor con visitas, ofertas y contratos.</p>
        <span class="lc-nh-eco-link">Ver plataforma vendedor →</span>
      </a>
      <a href="#ecosistema-comprador" class="lc-nh-eco-card lc-nh-eco-card--dark">
        <span class="lc-nh-eco-label">Para compradores</span>
        <h3>Encuentra tu hogar en Barcelona</h3>
        <p>Cartera privada, inmuebles off-market y gestor dedicado. Panel comprador con búsqueda, visitas y documentación.</p>
        <span class="lc-nh-eco-link">Ver plataforma comprador →</span>
      </a>
    </div>
  </div>
</section>`;
}

function nhHomeEcosystemBundle() {
  const L = { footerLabel: 'Barcelona' };
  return nhEcosystemIntroBlock()
    + `<div id="ecosistema-vendedor">`
    + nhServicioBlock(L)
    + nhCompradoresEcosystemBlock(L)
    + nhPanelDemoBlock(L)
    + `</div>`
    + `<div id="ecosistema-comprador">`
    + nhBuyerEcosystemBlock()
    + nhBuyerPanelDemoBlock()
    + `</div>`;
}

function nhHomeEcosystemStyles() {
  return `
    ${nhPlatformStyles().trim()}
    ${nhBuyerPlatformStyles().trim()}
    .lc-nh-eco-dual{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
    .lc-nh-eco-card{display:block;background:#fff;border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.75rem;text-decoration:none;color:inherit;transition:border-color .2s,box-shadow .2s;height:100%}
    .lc-nh-eco-card:hover{border-color:var(--oro);box-shadow:var(--shadow-md)}
    .lc-nh-eco-card--dark{background:var(--negro);border-color:var(--negro);color:#fff}
    .lc-nh-eco-card--dark:hover{border-color:var(--oro)}
    .lc-nh-eco-card--dark p{color:rgba(255,255,255,.7)}
    .lc-nh-eco-label{display:inline-block;font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--oro);margin-bottom:.5rem}
    .lc-nh-eco-card h3{font-family:var(--font-serif);font-size:1.25rem;margin:0 0 .5rem}
    .lc-nh-eco-card p{font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:0 0 1rem}
    .lc-nh-eco-link{font-size:.875rem;font-weight:600;color:var(--oro)}
    .lc-nh-eco-card--dark .lc-nh-eco-link{color:var(--oro-claro)}
    #ecosistema-vendedor,#ecosistema-comprador{scroll-margin-top:100px}
    @media(max-width:768px){.lc-nh-eco-dual{grid-template-columns:1fr}}
  `;
}

module.exports = { nhHomeEcosystemBundle, nhHomeEcosystemStyles };
