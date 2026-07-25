/** NuevaHabitat — SEO, Schema.org y GA4 (consent-aware) */
(function () {
  const SITE = 'https://www.nuevahabitat.com';

  window.NH_SEO = {
    site: SITE,
    name: 'NuevaHabitat',
    /** Sustituir por tu ID real de GA4 (Admin → Flujos de datos → ID de medición) */
    gaId: window.NH_GA_ID || 'G-XXXXXXXXXX',
    phone: '+34603656587',
    phoneDisplay: '603 656 587',
    email: window.NH_CONTACT_EMAIL || 'info@nuevahabitat.com',
    logo: SITE + '/imagenes/Logo/logosinfondo2.png',
    defaultImage: SITE + '/imagenes/interior2.jpg',
    address: {
      streetAddress: 'Carrer de Mejía Lequerica, 42',
      locality: 'Barcelona',
      region: 'Cataluña',
      postalCode: '08028',
      country: 'ES',
      neighborhood: 'Les Corts',
    },
    geo: { latitude: 41.3874, longitude: 2.1686 },
    hours: ['Mo-Fr 09:00-20:00', 'Sa 10:00-14:00'],
    areaServed: 'Área Metropolitana de Barcelona',
    sameAs: [
      'https://www.google.com/maps/search/?api=1&query=Carrer+de+Mej%C3%ADa+Lequerica,+42,+08028+Barcelona',
      'https://wa.me/34603656587',
    ],
  };

  function absUrl(path) {
    if (!path) return SITE + '/';
    if (/^https?:\/\//i.test(path)) return path;
    let p = path.replace(/^\//, '');
    if (p === 'index.html') p = '';
    else if (p.endsWith('.html')) p = p.slice(0, -5);
    return p ? SITE + '/' + p : SITE + '/';
  }

  function pageKey() {
    let p = location.pathname.replace(/^\//, '').split('?')[0] || '';
    if (!p || p === 'index.html') return 'index';
    return p.replace(/\.html$/, '');
  }

  function injectJsonLd(schemas) {
    const list = (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean);
    if (!list.length) return;
    let el = document.getElementById('nh-seo-jsonld');
    if (!el) {
      el = document.createElement('script');
      el.id = 'nh-seo-jsonld';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(list.length === 1 ? list[0] : list);
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  }

  function orgSchema(opts) {
    const o = opts || {};
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': SITE + '/#organization',
      name: NH_SEO.name,
      url: o.pageUrl ? absUrl(o.pageUrl) : SITE + '/',
      logo: NH_SEO.logo,
      image: o.image || NH_SEO.logo,
      telephone: NH_SEO.phone,
      email: NH_SEO.email,
      priceRange: '€€',
      areaServed: o.areaServed || NH_SEO.areaServed,
      address: {
        '@type': 'PostalAddress',
        streetAddress: NH_SEO.address.streetAddress,
        addressLocality: NH_SEO.address.locality,
        addressRegion: NH_SEO.address.region,
        postalCode: NH_SEO.address.postalCode,
        addressCountry: NH_SEO.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: NH_SEO.geo.latitude,
        longitude: NH_SEO.geo.longitude,
      },
      openingHours: NH_SEO.hours,
      sameAs: NH_SEO.sameAs,
    };
  }

  function webSiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': SITE + '/#website',
      name: NH_SEO.name,
      url: SITE + '/',
      publisher: { '@id': SITE + '/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: SITE + '/inmuebles.html?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  function webPageSchema(name, description, url) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name,
      description,
      url: absUrl(url || location.pathname),
      isPartOf: { '@id': SITE + '/#website' },
      about: { '@id': SITE + '/#organization' },
    };
  }

  function breadcrumbSchema(items) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: absUrl(item.url),
      })),
    };
  }

  function listingSchema(p) {
    const precio = parseFloat(p.precio) || 0;
    const loc = [p.barrio, p.municipio].filter(Boolean).join(', ') || 'Barcelona';
    const imgs = [];
    if (p.imagen_principal) imgs.push(absUrl(p.imagen_principal));
    if (Array.isArray(p.imagenes)) p.imagenes.filter(Boolean).slice(0, 5).forEach(u => imgs.push(absUrl(u)));
    const uniqueImgs = [...new Set(imgs)];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: p.titulo || 'Inmueble',
      description: (p.descripcion || '').slice(0, 500),
      url: location.href,
      datePosted: p.created_at || undefined,
      image: uniqueImgs.length ? uniqueImgs : NH_SEO.defaultImage,
      address: {
        '@type': 'PostalAddress',
        addressLocality: p.municipio || 'Barcelona',
        addressRegion: p.barrio || '',
        addressCountry: 'ES',
      },
    };
    if (precio) {
      schema.offers = {
        '@type': 'Offer',
        price: precio,
        priceCurrency: 'EUR',
        availability: p.estado === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
      };
    }
    if (p.habitaciones) schema.numberOfRooms = parseInt(p.habitaciones, 10) || undefined;
    const m2 = p.m2_utiles || p.m2_construidos;
    if (m2) schema.floorSize = { '@type': 'QuantitativeValue', value: m2, unitCode: 'MTK' };
    return schema;
  }

  function itemListSchema(items, listName) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: listName || 'Inmuebles en venta',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absUrl('inmueble-detalle.html?id=' + p.id),
        name: p.titulo || 'Inmueble',
      })),
    };
  }

  function articleSchema(post, slug) {
    const title = post.titulo || post.title || '';
    const desc = (post.extracto || post.excerpt || '').slice(0, 160);
    const img = post.imagen_url || post.image || NH_SEO.defaultImage;
    const url = absUrl('blog-articulo.html?slug=' + encodeURIComponent(slug || post.slug || ''));
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', title + ' · NuevaHabitat');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', absUrl(img));
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'description', desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: desc,
      image: absUrl(img),
      url,
      datePublished: post.publicado_at || post.created_at || undefined,
      dateModified: post.updated_at || undefined,
      author: { '@type': 'Organization', name: NH_SEO.name, url: SITE + '/' },
      publisher: {
        '@type': 'Organization',
        name: NH_SEO.name,
        logo: { '@type': 'ImageObject', url: NH_SEO.logo },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    };
  }

  function track(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params || {});
  }

  function faqSchemaFromDom(root) {
    const list = (root || document).querySelector('.faq-list');
    if (!list) return null;
    const items = [];
    list.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q')?.textContent?.trim();
      const a = item.querySelector('.faq-a-inner')?.textContent?.trim();
      if (q && a) items.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
    });
    if (!items.length) return null;
    return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
  }

  function ensureCanonical() {
    let path = location.pathname.replace(/^\//, '').split('?')[0] || '';
    if (path === 'index.html') path = '';
    else if (path.endsWith('.html')) path = path.slice(0, -5);
    const href = absUrl(path);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = href;
  }

  const PAGE_SEO = {
    index: () => [orgSchema(), webSiteSchema()],
    'vender': () => [
      orgSchema(),
      webPageSchema('Vender tu vivienda en Barcelona', 'Vende tu piso por 3.000€ + IVA. Precio fijo, cobro solo en escritura.', 'vender'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Vender', url: 'vender' }]),
    ],
    'vender-les-corts': () => [
      orgSchema({
        pageUrl: 'vender-les-corts',
        image: NH_SEO.logo,
        areaServed: ['Les Corts', 'Zona Universitaria', 'Numància', 'Pedralbes'],
      }),
      webPageSchema(
        'Vender piso en Les Corts, Barcelona · Precio fijo',
        'Vende tu piso en Les Corts con NuevaHabitat: 3.000€ + IVA, panel vendedor, compradores con hipoteca preaprobada y visitas en tu horario.',
        'vender-les-corts'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Les Corts', url: 'vender-les-corts' },
      ]),
    ],
    'vender-sants': () => [
      orgSchema({
        pageUrl: 'vender-sants',
        image: NH_SEO.logo,
        areaServed: ['Sants', 'Hostafrancs', 'La Bordeta', 'Estació de Sants'],
      }),
      webPageSchema(
        'Vender piso en Sants, Barcelona · Precio fijo',
        'Vende tu piso en Sants con NuevaHabitat: 3.000€ + IVA, panel vendedor, compradores con hipoteca preaprobada y visitas en tu horario.',
        'vender-sants'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Sants', url: 'vender-sants' },
      ]),
    ],
    'vender-gracia': () => [
      orgSchema({
        pageUrl: 'vender-gracia',
        image: NH_SEO.logo,
        areaServed: ['Gràcia', 'Vila de Gràcia', "Camp d'en Grassot", 'Vallcarca', 'Penitents'],
      }),
      webPageSchema(
        'Vender piso en Gràcia, Barcelona · Precio fijo',
        'Vende tu piso en Gràcia con NuevaHabitat: 3.000€ + IVA, panel vendedor, compradores con hipoteca preaprobada y visitas en tu horario.',
        'vender-gracia'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Gràcia', url: 'vender-gracia' },
      ]),
    ],
    'vender-sarria': () => [
      orgSchema({
        pageUrl: 'vender-sarria',
        image: NH_SEO.logo,
        areaServed: ['Sarrià', 'Sant Gervasi', 'Galvany', 'Bonanova', 'Tres Torres'],
      }),
      webPageSchema(
        'Vender piso en Sarrià, Barcelona · Precio fijo',
        'Vende tu piso en Sarrià con NuevaHabitat: 3.000€ + IVA, panel vendedor, compradores con hipoteca preaprobada y visitas en tu horario.',
        'vender-sarria'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Sarrià', url: 'vender-sarria' },
      ]),
    ],
    'vender-eixample': () => [
      orgSchema({
        pageUrl: 'vender-eixample',
        image: NH_SEO.logo,
        areaServed: ['Eixample', 'Eixample Derecho', 'Eixample Esquerre', 'Sagrada Família', 'Passeig de Gràcia'],
      }),
      webPageSchema(
        'Vender piso en el Eixample, Barcelona · Precio fijo',
        'Vende tu piso en el Eixample con NuevaHabitat: 3.000€ + IVA, panel vendedor, compradores con hipoteca preaprobada y visitas en tu horario.',
        'vender-eixample'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Eixample', url: 'vender-eixample' },
      ]),
    ],
    'vender-poblenou': () => [
      orgSchema({
        pageUrl: 'vender-poblenou',
        image: NH_SEO.logo,
        areaServed: ['Poblenou', 'Vila Olímpica', 'Diagonal Mar', 'Rambla del Poblenou'],
      }),
      webPageSchema(
        'Vender piso en Poblenou, Barcelona · Precio fijo',
        'Vende tu piso en Poblenou con NuevaHabitat: 3.000€ + IVA, compradores cualificados y visitas en tu horario.',
        'vender-poblenou'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Poblenou', url: 'vender-poblenou' },
      ]),
    ],
    'vender-horta': () => [
      orgSchema({
        pageUrl: 'vender-horta',
        image: NH_SEO.logo,
        areaServed: ['Horta-Guinardó', 'Montbau', 'Vall d\'Hebron', 'La Teixonera', 'El Carmel'],
      }),
      webPageSchema(
        'Vender piso en Horta-Guinardó, Barcelona · Precio fijo',
        'Vende tu piso en Horta-Guinardó con NuevaHabitat: 3.000€ + IVA, compradores cualificados y visitas en tu horario.',
        'vender-horta'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Horta-Guinardó', url: 'vender-horta' },
      ]),
    ],
    'vender-nou-barris': () => [
      orgSchema({
        pageUrl: 'vender-nou-barris',
        image: NH_SEO.logo,
        areaServed: ['Nou Barris', 'Verdum', 'Roquetes', 'Trinitat Vella', 'Porta'],
      }),
      webPageSchema(
        'Vender piso en Nou Barris, Barcelona · Precio fijo',
        'Vende tu piso en Nou Barris con NuevaHabitat: 3.000€ + IVA, valoración con datos del distrito y compradores filtrados.',
        'vender-nou-barris'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Nou Barris', url: 'vender-nou-barris' },
      ]),
    ],
    'vender-l-hospitalet': () => [
      orgSchema({
        pageUrl: 'vender-l-hospitalet',
        image: NH_SEO.logo,
        areaServed: ['L\'Hospitalet de Llobregat', 'Centre', 'Bellvitge', 'Pubilla Cases', 'Granvia L\'H'],
      }),
      webPageSchema(
        'Vender piso en L\'Hospitalet de Llobregat · Precio fijo',
        'Vende tu piso en L\'Hospitalet con NuevaHabitat: 3.000€ + IVA, valoración local y compradores filtrados desde Les Corts.',
        'vender-l-hospitalet'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'L\'Hospitalet', url: 'vender-l-hospitalet' },
      ]),
    ],
    'vender-esplugues': () => [
      orgSchema({
        pageUrl: 'vender-esplugues',
        image: NH_SEO.logo,
        areaServed: ['Esplugues de Llobregat', 'Can Vidalet', 'Can Sant Joan', 'Centre', 'Finestrelles'],
      }),
      webPageSchema(
        'Vender piso en Esplugues de Llobregat · Precio fijo',
        'Vende tu piso en Esplugues con NuevaHabitat: 3.000€ + IVA, valoración local y compradores filtrados desde Les Corts.',
        'vender-esplugues'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Esplugues', url: 'vender-esplugues' },
      ]),
    ],
    'nuevahabitat-vs-idealista-particular': () => [
      orgSchema({
        pageUrl: 'nuevahabitat-vs-idealista-particular',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'NuevaHabitat vs Idealista (particular) en Barcelona',
        'Comparativa honesta: vender en Idealista como particular vs NuevaHabitat. Coste real, filtro de compradores y plazos. Precio fijo 3.000€ + IVA.',
        'nuevahabitat-vs-idealista-particular'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'vs Idealista', url: 'nuevahabitat-vs-idealista-particular' },
      ]),
    ],
    'vender-piso-ciutat-vella-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-piso-ciutat-vella-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Ciutat Vella', 'Gòtic', 'Born', 'Raval', 'Barceloneta'],
      }),
      webPageSchema(
        'Vender piso en Ciutat Vella, Barcelona · Precio fijo',
        'Vende tu piso en Ciutat Vella (Gòtic, Born, Raval, Barceloneta) con NuevaHabitat: 3.000€ + IVA, valoración gratuita.',
        'vender-piso-ciutat-vella-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Ciutat Vella', url: 'vender-piso-ciutat-vella-barcelona' },
      ]),
    ],
    'vender-piso-sin-exclusividad-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-piso-sin-exclusividad-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender piso sin exclusividad en Barcelona · Particular',
        'Vende tu piso en Barcelona sin exclusiva ni comisión del 6%. Guía para particulares. Precio fijo 3.000€ + IVA.',
        'vender-piso-sin-exclusividad-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Sin exclusividad', url: 'vender-piso-sin-exclusividad-barcelona' },
      ]),
    ],
    'nuevahabitat-vs-fotocasa-particular': () => [
      orgSchema({
        pageUrl: 'nuevahabitat-vs-fotocasa-particular',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'NuevaHabitat vs Fotocasa (particular) en Barcelona',
        'Comparativa: vender en Fotocasa como particular vs NuevaHabitat. Coste, filtro de compradores y plazos. Precio fijo 3.000€ + IVA.',
        'nuevahabitat-vs-fotocasa-particular'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'vs Fotocasa', url: 'nuevahabitat-vs-fotocasa-particular' },
      ]),
    ],
    'nuevahabitat-vs-agencia-tradicional-barcelona': () => [
      orgSchema({
        pageUrl: 'nuevahabitat-vs-agencia-tradicional-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Agencia tradicional 6% vs NuevaHabitat en Barcelona',
        '¿Cuánto cobra una inmobiliaria en Barcelona? Compara comisión 6% vs precio fijo 3.000€ + IVA.',
        'nuevahabitat-vs-agencia-tradicional-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'vs agencia 6%', url: 'nuevahabitat-vs-agencia-tradicional-barcelona' },
      ]),
    ],
    'vender-por-tu-cuenta-vs-nuevahabitat-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-por-tu-cuenta-vs-nuevahabitat-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender por tu cuenta vs NuevaHabitat en Barcelona',
        'Comparativa honesta: vender el piso solo vs con NuevaHabitat. Tiempo, riesgos y precio fijo 3.000€ + IVA.',
        'vender-por-tu-cuenta-vs-nuevahabitat-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Por tu cuenta vs NH', url: 'vender-por-tu-cuenta-vs-nuevahabitat-barcelona' },
      ]),
    ],
    'vender-piso-inquilino-vencer-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-piso-inquilino-vencer-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender piso en Barcelona cuando vence el contrato del inquilino',
        'Planifica venta al fin del alquiler en Barcelona. Visitas, precio y compradores. Precio fijo 3.000€ + IVA.',
        'vender-piso-inquilino-vencer-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Inquilino vence', url: 'vender-piso-inquilino-vencer-barcelona' },
      ]),
    ],
    'vender-piso-antes-comprar-otro-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-piso-antes-comprar-otro-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender piso antes de comprar otro en Barcelona',
        'Cadena compraventa: sincroniza venta y compra en Barcelona. Precio fijo 3.000€ + IVA.',
        'vender-piso-antes-comprar-otro-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Antes de comprar', url: 'vender-piso-antes-comprar-otro-barcelona' },
      ]),
    ],
    'vender-segunda-residencia-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-segunda-residencia-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender segunda residencia o piso vacío en Barcelona',
        'Venta de piso vacío o segunda vivienda en Barcelona. Precio fijo 3.000€ + IVA.',
        'vender-segunda-residencia-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Segunda residencia', url: 'vender-segunda-residencia-barcelona' },
      ]),
    ],
    'vender-piso-traslado-barcelona': () => [
      orgSchema({
        pageUrl: 'vender-piso-traslado-barcelona',
        image: NH_SEO.logo,
        areaServed: ['Barcelona', 'Área metropolitana de Barcelona'],
      }),
      webPageSchema(
        'Vender piso por traslado o cambio de ciudad · Barcelona',
        'Vende en Barcelona si te mudas por trabajo o expatriación. Venta a distancia. Precio fijo 3.000€ + IVA.',
        'vender-piso-traslado-barcelona'
      ),
      breadcrumbSchema([
        { name: 'Inicio', url: '/' },
        { name: 'Vender', url: 'vender' },
        { name: 'Traslado', url: 'vender-piso-traslado-barcelona' },
      ]),
    ],
    gracias: () => [
      orgSchema(),
      webPageSchema(
        'Solicitud recibida · NuevaHabitat',
        'Gracias por contactar con NuevaHabitat. Te respondemos en menos de 24 horas.',
        'gracias'
      ),
    ],
    comprar: () => [
      orgSchema(),
      webPageSchema('Comprar vivienda en Barcelona', 'Acompañamiento personalizado a 5.000€ + IVA. Cartera propia y compradores cualificados.', 'comprar'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Comprar', url: 'comprar' }]),
    ],
    inmuebles: () => [
      orgSchema(),
      webPageSchema('Inmuebles en venta · Barcelona', 'Pisos y casas en el área metropolitana de Barcelona.', 'inmuebles'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Inmuebles', url: 'inmuebles' }]),
    ],
    hipotecas: () => [
      orgSchema(),
      webPageSchema('Asesoría hipotecaria Barcelona', 'Calculadora y asesoría hipotecaria para tu compra en Barcelona.', 'hipotecas'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Hipotecas', url: 'hipotecas' }]),
    ],
    nosotros: () => [
      orgSchema(),
      webPageSchema('Quiénes somos · NuevaHabitat', 'Inmobiliaria tecnológica en el área metropolitana de Barcelona.', 'nosotros'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Nosotros', url: 'nosotros' }]),
    ],
    contacto: () => [
      orgSchema(),
      webPageSchema('Contacto · NuevaHabitat', 'Contacta con NuevaHabitat. Teléfono, WhatsApp y formulario.', 'contacto'),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Contacto', url: 'contacto' }]),
    ],
    blog: () => [
      orgSchema(),
      webPageSchema(
        'Blog inmobiliario Barcelona · Comprar y vender vivienda',
        'Guías para vender piso y comprar casa en Barcelona. Valoración gratuita, hipotecas, comisiones inmobiliarias y mercado 2026.',
        'blog'
      ),
      breadcrumbSchema([{ name: 'Inicio', url: '/' }, { name: 'Blog', url: 'blog' }]),
    ],
  };

  function initPageSeo() {
    const skip = ['admin-panel', 'panel', 'admin-panel.html', 'panel.html'];
    const page = pageKey();
    if (skip.includes(page)) return;
    ensureCanonical();
    if (document.getElementById('nh-seo-static')) return;
    const fn = PAGE_SEO[page];
    const schemas = fn ? fn() : (page !== 'inmueble-detalle' && page !== 'blog-articulo' ? [orgSchema()] : []);
    const faq = faqSchemaFromDom();
    if (faq) schemas.push(faq);
    if (schemas.length) injectJsonLd(schemas);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const meta = {
      landing_slug: pageKey(),
      page_location: location.pathname,
      cluster: document.body?.dataset?.nhCluster || '',
    };
    if (href.includes('wa.me')) track('whatsapp_click', { link_url: href, ...meta });
    else if (href.startsWith('tel:')) {
      track('click_to_call', { link_url: href, call_placement: a.dataset.nhCall || 'global', ...meta });
      track('phone_click', { link_url: href, ...meta });
    }
  });

  window.nhSeo = {
    injectJsonLd,
    orgSchema,
    webSiteSchema,
    webPageSchema,
    breadcrumbSchema,
    listingSchema,
    itemListSchema,
    articleSchema,
    track,
    absUrl,
    faqSchemaFromDom,
    ensureCanonical,
    initPageSeo,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageSeo);
  } else {
    initPageSeo();
  }
})();
