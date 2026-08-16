const fs = require('fs');
const path = require('path');

const base = fs.readFileSync(path.join(__dirname, '../vender-sants.html'), 'utf8');

const configs = {
  gracia: {
    slug: 'vender-gracia',
    titleShort: 'Gràcia',
    cp: '08012',
    keywords: 'vender piso Gràcia, vender casa Gràcia Barcelona, inmobiliaria Gràcia, vender vivienda 08012, agencia inmobiliaria Gràcia precio fijo, vender piso Vila de Gràcia, vender piso Camp Grassot, comisión inmobiliaria Gràcia',
    areaServed: ['Gràcia', 'Vila de Gràcia', "Camp d'en Grassot", 'Vallcarca', 'Penitents'],
    microzonasShort: "Vila de Gràcia, Camp d'en Grassot, Vallcarca",
    transport: 'Plaça de la Vila de Gràcia, metro L3, L4 y FGC — ambiente de barrio y alta demanda de familias y jóvenes profesionales',
    distrito: 'distrito de Gràcia (08012, 08024, 08006)',
    query: 'Gràcia',
    precio: '480.000',
    comision6: '28.800',
    ahorro: '25.000',
    heroImg: 'agenteinmobiliario3',
    heroWebp: false,
    heroAlt: 'Agente inmobiliario en Gràcia, Barcelona',
    faqZona: "¿Vendéis pisos en Vila de Gràcia, Camp d'en Grassot y Vallcarca?",
    faqZonaA: 'Sí. Trabajamos todo el distrito de Gràcia (08012, 08024, 08006) y el área metropolitana de Barcelona desde nuestras oficinas en Les Corts.',
    kw: 'vender piso Gràcia · vender casa Gràcia Barcelona · inmobiliaria Gràcia precio fijo · vender vivienda 08012 · agencia inmobiliaria Vila de Gràcia · vender piso Vallcarca · comisión inmobiliaria Barcelona · valoración gratuita Gràcia',
    whatsapp: 'Gr%C3%A0cia',
    formPlaceholder: 'Dirección o zona en Gràcia',
  },
  sarria: {
    slug: 'vender-sarria',
    titleShort: 'Sarrià',
    cp: '08017',
    keywords: 'vender piso Sarrià, vender casa Sarrià Barcelona, inmobiliaria Sarrià, vender vivienda 08017, agencia inmobiliaria Sant Gervasi precio fijo, vender piso Bonanova, vender casa Tres Torres, comisión inmobiliaria Sarrià',
    areaServed: ['Sarrià', 'Sant Gervasi', 'Galvany', 'Bonanova', 'Tres Torres'],
    microzonasShort: 'Sarrià, Galvany, Bonanova y Tres Torres',
    transport: 'Bonanova, Tres Torres y FGC — uno de los barrios con mayor precio por m² de Barcelona y demanda estable de compradores premium',
    distrito: 'distrito de Sarrià-Sant Gervasi (08017, 08021, 08022)',
    query: 'Sarrià',
    precio: '750.000',
    comision6: '45.000',
    ahorro: '42.000',
    heroImg: 'interior11',
    heroWebp: true,
    heroAlt: 'Interior de piso en Sarrià, Barcelona',
    faqZona: '¿Vendéis pisos en Sarrià, Galvany, Bonanova y Tres Torres?',
    faqZonaA: 'Sí. Trabajamos Sarrià-Sant Gervasi (08017, 08021, 08022) y el área metropolitana de Barcelona desde nuestras oficinas en Les Corts.',
    kw: 'vender piso Sarrià · vender casa Sarrià Barcelona · inmobiliaria Sarrià precio fijo · vender vivienda 08017 · agencia inmobiliaria Sant Gervasi · vender piso Bonanova · vender casa Tres Torres · valoración gratuita Sarrià',
    whatsapp: 'Sarri%C3%A0',
    formPlaceholder: 'Dirección o zona en Sarrià',
  },
};

const FOOTER_LINKS = '<li><a href="/vender-eixample">Vender en el Eixample</a></li><li><a href="/vender-gracia">Vender en Gràcia</a></li><li><a href="/vender-sarria">Vender en Sarrià</a></li><li><a href="/vender-les-corts">Vender en Les Corts</a></li><li><a href="/vender-sants">Vender en Sants</a></li>';

function build(cfg) {
  let h = base;
  const rep = (from, to) => { h = h.split(from).join(to); };

  rep('vender-sants', cfg.slug);
  rep('Sants · 08014 · Barcelona', `${cfg.titleShort} · ${cfg.cp} · Barcelona`);
  rep('Sants · Barcelona', `${cfg.titleShort} · Barcelona`);
  rep('Vender piso en Sants', `Vender piso en ${cfg.titleShort}`);
  rep('¿Vendes tu piso en Sants?', `¿Vendes tu piso en ${cfg.titleShort}?`);
  rep('vendedores en Sants', `vendedores en ${cfg.titleShort}`);
  rep('Valoración gratuita en Sants', `Valoración gratuita en ${cfg.titleShort}`);
  rep('Vender en Sants', `Vender en ${cfg.titleShort}`);
  rep('vender piso en Sants', `vender piso en ${cfg.titleShort}`);
  rep('Si buscas <strong>vender piso en Sants</strong>, Hostafrancs, La Bordeta o el Carrer de Sants', `Si buscas <strong>vender piso en ${cfg.titleShort}</strong>, ${cfg.microzonasShort}`);
  rep('Atendemos Sants y todo Barcelona', `Atendemos ${cfg.titleShort} y todo Barcelona`);
  rep('a pocos minutos en metro.', 'desde nuestras oficinas en Barcelona.');
  rep('Valorar mi piso en Sants', `Valorar mi piso en ${cfg.titleShort}`);
  rep('Dirección o zona en Sants', cfg.formPlaceholder);
  rep('Valoración piso Sants', `Valoración piso ${cfg.titleShort}`);
  rep("zona: 'Sants', barrio: dir || 'Sants'", `zona: '${cfg.titleShort}', barrio: dir || '${cfg.titleShort}'`);
  rep("origen: 'vender-sants'", `origen: '${cfg.slug}'`);
  rep('piso en Sants vendido a <strong>380.000 €</strong>', `piso en ${cfg.titleShort} vendido a <strong>${cfg.precio} €</strong>`);
  rep('22.800 € + IVA (6% de 380.000 €)', `${cfg.comision6} € + IVA (6% de ${cfg.precio} €)`);
  rep('En un piso de 380.000 € te ahorras más de <strong>19.000 €</strong>', `En un piso de ${cfg.precio} € te ahorras más de <strong>${cfg.ahorro} €</strong>`);
  rep('para vender en Sants', `para vender en ${cfg.titleShort}`);
  rep('Cómo vendemos tu piso en Sants', `Cómo vendemos tu piso en ${cfg.titleShort}`);
  rep('tu piso en Sants y fijamos', `tu piso en ${cfg.titleShort} y fijamos`);
  rep('Inmuebles en venta en Sants', `Inmuebles en venta en ${cfg.titleShort}`);
  rep('/inmuebles?q=Sants', `/inmuebles?q=${encodeURIComponent(cfg.query)}`);
  rep('Ver inmuebles en Sants', `Ver inmuebles en ${cfg.titleShort}`);
  rep('Vender piso en Sants — FAQ', `Vender piso en ${cfg.titleShort} — FAQ`);
  rep('vender un piso en Sants con', `vender un piso en ${cfg.titleShort} con`);
  rep('¿Vendéis pisos en Hostafrancs, La Bordeta y cerca de la Estació de Sants?', cfg.faqZona);
  rep('todo el barrio de Sants y el distrito Sants-Montjuïc (08014, 08038), además del área metropolitana de Barcelona desde nuestras oficinas en Les Corts.', cfg.faqZonaA);
  rep('inmuebles en Sants se venden', `inmuebles en ${cfg.titleShort} se venden`);
  rep('vender piso Sants · vender casa Sants Barcelona · inmobiliaria Sants precio fijo · vender vivienda 08014 · agencia inmobiliaria Hostafrancs · vender piso La Bordeta · comisión inmobiliaria Barcelona · vender piso Estació de Sants · valoración gratuita Sants', cfg.kw);
  rep('¿Listo para vender tu piso en Sants?', `¿Listo para vender tu piso en ${cfg.titleShort}?`);
  rep('Atendemos Sants desde nuestras oficinas', `Atendemos ${cfg.titleShort} desde nuestras oficinas`);
  rep('¿Vendes en Sants?', `¿Vendes en ${cfg.titleShort}?`);
  rep('vender%20mi%20piso%20en%20Sants', `vender%20mi%20piso%20en%20${cfg.whatsapp}`);
  rep('<span class="bc-current">Sants</span>', `<span class="bc-current">${cfg.titleShort}</span>`);
  rep('"name": "Sants"', `"name": "${cfg.titleShort}"`);
  rep('content="Vende tu piso en Sants con', `content="Vende tu piso en ${cfg.titleShort} con`);
  rep('vender piso Sants, vender casa Sants Barcelona, inmobiliaria Sants, vender vivienda 08014, agencia inmobiliaria Sants precio fijo, vender piso Hostafrancs, vender piso La Bordeta, comisión inmobiliaria Sants', cfg.keywords);
  rep('Sants combina excelente conexión de transporte — Estació de Sants, metro L3, L5 y cercanías — con demanda estable de familias y profesionales.', `${cfg.titleShort} combina ${cfg.transport}.`);
  rep('¿Vendes tu piso en Sants? NuevaHabitat:', `¿Vendes tu piso en ${cfg.titleShort}? NuevaHabitat:`);
  rep('Vende tu piso en Sants con precio fijo.', `Vende tu piso en ${cfg.titleShort} con precio fijo.`);

  rep('["Sants", "Hostafrancs", "La Bordeta", "Estació de Sants"]', JSON.stringify(cfg.areaServed));

  if (cfg.heroWebp) {
    rep('interior12.webp', `${cfg.heroImg}.webp`);
    rep('interior12.jpg', `${cfg.heroImg}.jpg`);
    rep('https://www.nuevahabitat.com/imagenes/interior12.jpg', `https://www.nuevahabitat.com/imagenes/${cfg.heroImg}.jpg`);
  } else {
    rep('<source srcset="imagenes/interior12.webp" type="image/webp"/>\n    ', '');
    rep('imagenes/interior12.jpg', `imagenes/${cfg.heroImg}.jpg`);
    rep('imagenes/interior12.webp', `imagenes/${cfg.heroImg}.jpg`);
    rep('https://www.nuevahabitat.com/imagenes/interior12.jpg', `https://www.nuevahabitat.com/imagenes/${cfg.heroImg}.jpg`);
  }
  rep('Interior de piso en Sants, Barcelona', cfg.heroAlt);

  rep('<li><a href="/vender-eixample">Vender en el Eixample</a></li><li><a href="/vender-les-corts">Vender en Les Corts</a></li><li><a href="/vender-sants">Vender en Sants</a></li>', FOOTER_LINKS);

  fs.writeFileSync(path.join(__dirname, '..', `${cfg.slug}.html`), h);
  console.log('OK', cfg.slug);
}

Object.values(configs).forEach(build);
