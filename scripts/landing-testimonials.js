function hashSlug(slug) {
  let h = 0;
  const s = String(slug || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const SELLER = [
  {
    img: 'imagenes/testimonio1.jpg',
    cover: 'imagenes/familia10.jpg',
    name: 'Laura y Marc Ferrer',
    text: 'Vendimos en pocas semanas con el panel digital: visitas, ofertas y documentos en un solo sitio. El precio fijo nos quitó la incertidumbre del 6%.',
  },
  {
    img: 'imagenes/testimonio8.jpg',
    cover: 'imagenes/familia13.jpg',
    name: 'Jordi y Ana Torres',
    text: 'Sabíamos desde el primer día cuánto íbamos a pagar. Sin comisión sorpresa en escritura. Daniel nos orientó con comparables de la misma calle.',
  },
  {
    img: 'imagenes/testimonio5.jpg',
    cover: 'imagenes/familia14.jpg',
    name: 'Marta Iglesias',
    text: 'Filtraron compradores con hipoteca preaprobada; no perdimos fines de semana con curiosos. Las visitas fueron en nuestro horario.',
  },
  {
    img: 'imagenes/testimonio3.jpg',
    cover: 'imagenes/pexels-kampus-8428067.jpg',
    name: 'Pere Solà',
    text: 'Llevaba meses en un portal sin cerrar. Revisaron pricing y activaron cartera. Cerramos con arras en condiciones claras.',
  },
  {
    img: 'imagenes/testimonio10.jpg',
    cover: 'imagenes/familia12.jpg',
    name: 'Elena Vázquez',
    text: 'Venta por herencia con varios titulares: el panel dejó trazabilidad de ofertas para todos. Trato directo con Sebastián por WhatsApp.',
  },
  {
    img: 'imagenes/testimonio12.jpg',
    cover: 'imagenes/pexels-cottonbro-6814526.jpg',
    name: 'Carlos y Núria Prat',
    text: 'Comparé el ahorro frente al 6% con la calculadora y encajó. Honorarios solo al firmar, como prometían.',
  },
  {
    img: 'imagenes/testimonio4.jpg',
    cover: 'imagenes/familia6.jpg',
    name: 'Montse Riba',
    text: 'Publicamos con fotos reales del piso y compradores llegaron con financiación cerrada. Sin exclusiva de doce meses.',
  },
];

const BUYER = [
  {
    img: 'imagenes/testimonio4.jpg',
    cover: 'imagenes/familia10.jpg',
    name: 'Cristina Soler',
    text: 'Nos propusieron un piso de cartera que no estaba en portales. Visitas con checklist y negociación hasta arras sin prisas.',
  },
  {
    img: 'imagenes/testimonio9.jpg',
    cover: 'imagenes/pexels-a-darmel-7641860.jpg',
    name: 'David Chen',
    text: 'Comprador extranjero: coordinaron visitas, revisión de comunidad y plazos con el banco. 5.000 € + IVA solo en escritura.',
  },
  {
    img: 'imagenes/testimonio6.jpg',
    cover: 'imagenes/familia13.jpg',
    name: 'Aina Roca',
    text: 'Descartaron anuncios incoherentes antes de ocupar nuestro sábado. La oferta salió apoyada en cierres, no en el precio inflado del portal.',
  },
  {
    img: 'imagenes/testimonio1.jpg',
    cover: 'imagenes/familia14.jpg',
    name: 'Roberto M.',
    text: 'Preaprobación alineada con tasación real: evitamos señal en un piso que el banco no habría financiado.',
  },
  {
    img: 'imagenes/testimonio8.jpg',
    cover: 'imagenes/pexels-kampus-8730014.jpg',
    name: 'Sandra y Joel',
    text: 'Registro gratuito, alertas cuando entraba stock compatible y gestor en Les Corts — no un formulario anónimo.',
  },
];

function testimonialsSection(L) {
  const comprador = L.cluster === 'comprador';
  const pool = comprador ? BUYER : SELLER;
  const barrio = L.barrio || L.footerLabel || 'Barcelona';
  const rolBase = comprador ? 'Compradores' : 'Vendedores';
  const start = hashSlug(L.slug) % pool.length;
  const cards = [0, 1, 2].map((i, idx) => {
    const t = pool[(start + i) % pool.length];
    const coverAlt = `Familia cliente NuevaHabitat — ${barrio}`;
    return `<div class="testimonio-card testimonio-card--rich visible">
        <div class="testimonio-card__cover"><img src="${t.cover}" alt="${coverAlt}" loading="lazy" width="640" height="360" decoding="async"/></div>
        <div class="testimonio-card__body">
          <div class="testimonio-stars" aria-hidden="true">★★★★★</div>
          <p class="testimonio-text">${t.text}</p>
          <div class="testimonio-autor">
            <img src="${t.img}" alt="${t.name}" loading="lazy" width="72" height="72" decoding="async"/>
            <div>
              <div class="testimonio-nombre">${t.name}</div>
              <div class="testimonio-rol">${rolBase} · ${barrio}</div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('\n      ');

  return `<section class="testimonios lc-testimonios" id="testimonios" data-nh-testimonials="1">
  <div class="container">
    <div class="text-center section-header">
      <span class="overline">Lo que dicen nuestros clientes</span>
      <h2 class="section-title">Experiencias reales en ${barrio}</h2>
      <p class="lc-testimonios-lead">Vendedores y compradores con foto y nombre — mismo servicio de precio fijo desde Les Corts.</p>
    </div>
    <div class="testimonios-grid">
      ${cards}
    </div>
  </div>
</section>`;
}

module.exports = { testimonialsSection };
