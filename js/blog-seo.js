/** SEO del blog — keywords compradores/vendedores + Schema */
(function () {
  const SITE = 'https://www.nuevahabitat.com';

  const VENDER = [
    'vender piso Barcelona', 'vender casa Barcelona', 'vender vivienda Barcelona',
    'vender piso rápido Barcelona', 'vender piso urgente Barcelona',
    'valoración gratuita piso Barcelona', 'tasación vivienda Barcelona', 'valorar casa Barcelona',
    'inmobiliaria para vender piso Barcelona', 'agencia inmobiliaria Barcelona vender',
    'vender piso sin comisiones ocultas', 'precio fijo inmobiliaria Barcelona',
    'vender piso herencia Barcelona', 'vender piso divorcio Barcelona',
    'documentos para vender piso España', 'documentos vender vivienda Cataluña',
    'plusvalía municipal Barcelona', 'home staging Barcelona', 'vender piso reformado Barcelona',
    'vender piso Eixample', 'vender piso Gràcia', 'vender piso Poblenou', 'vender piso Sarrià',
    'vender piso Sant Gervasi', 'vender piso área metropolitana Barcelona',
    'vender piso L\'Hospitalet', 'vender piso Badalona', 'vender piso Sant Cugat',
    'comisión inmobiliaria Barcelona', 'cuánto cobra inmobiliaria por vender',
    'vender piso con hipoteca pendiente', 'certificado energético vender piso',
    'ITE vivienda Barcelona', 'vender piso comunidad de propietarios',
    'cuánto tarda vender un piso Barcelona', 'mejor inmobiliaria vender Barcelona',
    'vender piso heredado', 'vender apartamento Barcelona', 'vender ático Barcelona',
    'vender piso con inquilino Barcelona', 'valoración mercado inmobiliario Barcelona',
  ];

  const COMPRAR = [
    'comprar piso Barcelona', 'comprar casa Barcelona', 'comprar vivienda Barcelona',
    'primera vivienda Barcelona', 'comprar piso con hipoteca Barcelona',
    'buscar piso Barcelona', 'pisos en venta Barcelona', 'apartamento Barcelona comprar',
    'comprar piso Eixample', 'comprar piso Gràcia', 'comprar piso Poblenou',
    'comprar casa Sant Cugat', 'comprar piso Badalona', 'comprar piso L\'Hospitalet',
    'comprar piso Santa Coloma', 'comprar piso área metropolitana Barcelona',
    'gastos comprar piso Cataluña', 'ITP Barcelona', 'impuesto compra vivienda Cataluña',
    'negociar precio piso Barcelona', 'oferta compra piso Barcelona',
    'contrato arras Barcelona', 'contrato arras Cataluña',
    'comprar piso obra nueva Barcelona', 'comprar piso segunda mano Barcelona',
    'asesoría compra vivienda Barcelona', 'inmobiliaria compradores Barcelona',
    'acompañamiento compra vivienda', 'hipoteca Barcelona primera vivienda',
    'euríbor hipoteca 2026', 'calcular hipoteca Barcelona', 'tasación hipoteca Barcelona',
    'due diligence compra vivienda', 'comprar piso con financiación',
    'cuánto ahorro necesito para comprar piso Barcelona', 'compradores cualificados Barcelona',
    'buscar casa Barcelona familia', 'comprar piso inversión Barcelona',
    'comprar piso certificado energético', 'notaría compraventa Barcelona',
    'gestoría compra vivienda', 'registro propiedad Barcelona',
    'mejor momento comprar piso Barcelona', 'mercado inmobiliario Barcelona comprar',
  ];

  const HIPOTECAS = [
    'hipoteca fija Barcelona', 'hipoteca variable Barcelona', 'hipoteca mixta España 2026',
    'simulador hipoteca Barcelona', 'mejor hipoteca Barcelona', 'TAE hipoteca comparar',
    'financiación 80 por ciento vivienda', 'aval hipoteca joven Barcelona',
    'subrogación hipoteca', 'amortizar hipoteca anticipadamente',
  ];

  const MERCADO = [
    'precio m2 Barcelona 2026', 'precio pisos Barcelona por barrios',
    'mercado inmobiliario Barcelona', 'inmobiliaria tecnológica Barcelona',
    'NuevaHabitat Barcelona', 'inmobiliaria precio fijo Barcelona',
  ];

  const ALL = [...new Set([...VENDER, ...COMPRAR, ...HIPOTECAS, ...MERCADO])];

  function keywordsForPost(post, slug) {
    const cat = (post.categoria || post.cat || '').toLowerCase();
    const base = post.keywords || [];
    let pool = MERCADO;
    if (cat.includes('vender')) pool = [...VENDER.slice(0, 12), ...MERCADO];
    else if (cat.includes('comprar')) pool = [...COMPRAR.slice(0, 12), ...MERCADO];
    else if (cat.includes('hipoteca')) pool = [...HIPOTECAS, ...COMPRAR.slice(0, 6)];
    else if (cat.includes('jurídico') || cat.includes('juridico')) pool = [...COMPRAR.slice(8, 18), ...VENDER.slice(8, 14)];
    else if (cat.includes('mercado')) pool = [...MERCADO, ...VENDER.slice(0, 6), ...COMPRAR.slice(0, 6)];
    const merged = [...new Set([...base, ...pool])];
    return merged.slice(0, 25);
  }

  function metaDescription(post) {
    if (post.metaDescription) return post.metaDescription.slice(0, 160);
    const ex = (post.extracto || post.excerpt || '').slice(0, 140);
    const cat = post.categoria || post.cat || '';
    const suffix = cat === 'Vender'
      ? ' Guía para vender en Barcelona con NuevaHabitat.'
      : cat === 'Comprar'
        ? ' Consejos para comprar vivienda en Barcelona.'
        : ' Blog inmobiliario NuevaHabitat Barcelona.';
    return (ex + suffix).slice(0, 160);
  }

  function applyArticleMeta(post, slug) {
    const title = post.titulo || post.title || 'Artículo';
    const desc = metaDescription(post);
    const kw = keywordsForPost(post, slug);
    const url = SITE + '/blog-articulo?slug=' + encodeURIComponent(slug || post.slug || '');
    const img = post.imagen_url || post.image || SITE + '/imagenes/interior2.jpg';
    const absImg = /^https?:\/\//.test(img) ? img : SITE + '/' + img.replace(/^\//, '');

    document.title = (post.seoTitle || title) + ' · NuevaHabitat Barcelona';

    function setMeta(attr, key, val) {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = val;
    }

    setMeta('name', 'description', desc);
    setMeta('name', 'keywords', kw.join(', '));
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', title + ' · NuevaHabitat');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', absImg);
    setMeta('property', 'og:locale', 'es_ES');
    setMeta('property', 'article:section', post.categoria || post.cat || 'Inmobiliaria');
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    kw.slice(0, 8).forEach(k => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.content = k;
      document.head.appendChild(el);
    });
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', absImg);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  function blogCollectionSchema(posts) {
    const items = (posts || []).slice(0, 30).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: SITE + '/blog-articulo?slug=' + encodeURIComponent(p.slug),
      name: p.titulo || p.title || 'Artículo',
    }));
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': SITE + '/blog#blog',
        name: 'Blog inmobiliario NuevaHabitat Barcelona',
        description: 'Guías para vender y comprar vivienda en Barcelona y área metropolitana. Valoraciones, hipotecas, mercado y consejos legales.',
        url: SITE + '/blog',
        inLanguage: 'es-ES',
        publisher: { '@id': SITE + '/#organization' },
        keywords: ALL.slice(0, 40).join(', '),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Blog inmobiliario · Comprar y vender en Barcelona',
        description: 'Artículos sobre comprar piso, vender casa, hipotecas y mercado inmobiliario en Barcelona.',
        url: SITE + '/blog',
        isPartOf: { '@id': SITE + '/#website' },
        about: [
          { '@type': 'Thing', name: 'Comprar vivienda Barcelona' },
          { '@type': 'Thing', name: 'Vender piso Barcelona' },
        ],
      },
      items.length ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Artículos del blog NuevaHabitat',
        numberOfItems: items.length,
        itemListElement: items,
      } : null,
    ].filter(Boolean);
  }

  function parseArticleDate(post) {
    const raw = post.publicado_at || post.publicado_en || post.created_at || post._date || post.date;
    if (!raw) return undefined;
    if (/^\d{4}-\d{2}-\d{2}/.test(String(raw))) return raw.slice(0, 10);
    const months = { ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06', jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12' };
    const m = String(raw).match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/i);
    if (m && months[m[2].toLowerCase()]) return `${m[3]}-${months[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`;
    return undefined;
  }

  function enhancedArticleSchema(post, slug, keywords) {
    const title = post.titulo || post.title || '';
    const desc = metaDescription(post).slice(0, 160);
    const img = post.imagen_url || post.image || SITE + '/imagenes/interior2.jpg';
    const absImg = /^https?:\/\//.test(img) ? img : SITE + '/' + img.replace(/^\//, '');
    const url = SITE + '/blog-articulo?slug=' + encodeURIComponent(slug || post.slug || '');
    const text = (post.contenido || post.body || '').replace(/<[^>]+>/g, ' ');
    const published = parseArticleDate(post);
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: desc,
      image: absImg,
      url,
      inLanguage: 'es-ES',
      articleSection: post.categoria || post.cat || 'Inmobiliaria',
      keywords: (keywords || []).join(', '),
      wordCount: (text.match(/\S+/g) || []).length,
      datePublished: published,
      dateModified: post.updated_at ? String(post.updated_at).slice(0, 10) : published,
      author: {
        '@type': 'Organization',
        name: 'NuevaHabitat',
        url: SITE + '/',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer de Mejía Lequerica, 42',
          addressLocality: 'Barcelona',
          postalCode: '08028',
          addressCountry: 'ES',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'NuevaHabitat',
        logo: { '@type': 'ImageObject', url: SITE + '/imagenes/Logo/logosinfondo2.png' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      isPartOf: { '@id': SITE + '/blog#blog' },
    };
  }

  function faqSchema(faqItems, slug) {
    if (!faqItems || !faqItems.length) return null;
    const url = SITE + '/blog-articulo?slug=' + encodeURIComponent(slug || '');
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
      url,
    };
  }

  window.NH_BLOG_SEO = {
    venderKeywords: VENDER,
    comprarKeywords: COMPRAR,
    allKeywords: ALL,
    keywordsForPost,
    metaDescription,
    applyArticleMeta,
    blogCollectionSchema,
    enhancedArticleSchema,
    faqSchema,
  };
})();
