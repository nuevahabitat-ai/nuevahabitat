/**
 * POST /api/import-particular
 * Importa datos básicos desde URL Kelify / Idealista / Fotocasa / Habitaclia (best-effort).
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const IDEALISTA_MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const IDEALISTA_BLOCKLIST_PHONES = new Set(['900423525', '917014030', '900400400']);

const FETCH_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  Referer: 'https://www.google.com/',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Upgrade-Insecure-Requests': '1',
};

function detectFuente(url) {
  const u = String(url || '').toLowerCase();
  if (u.includes('kelify.com')) return 'kelify';
  if (u.includes('idealista.com')) return 'idealista';
  if (u.includes('fotocasa.es')) return 'fotocasa';
  if (u.includes('habitaclia.com')) return 'habitaclia';
  return 'otro';
}

function emptyResult(fuente, url) {
  return {
    fuente,
    url,
    titulo: '',
    precio: null,
    m2: null,
    habitaciones: null,
    banos: null,
    direccion: '',
    zona: '',
    barrio: '',
    municipio: 'Barcelona',
    contacto_nombre: '',
    telefono: '',
    email: '',
    descripcion: '',
    imagen_url: '',
  };
}

function parseJsonLd(html) {
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    try {
      const raw = block.replace(/<\/?script[^>]*>/gi, '').trim();
      const data = JSON.parse(raw);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'RealEstateListing' || item['@type'] === 'Product' || item['@type'] === 'Apartment') {
          return item;
        }
        if (item['@graph']) {
          const found = item['@graph'].find(g => /Apartment|House|Product|RealEstate/i.test(g['@type'] || ''));
          if (found) return found;
        }
      }
    } catch (_) { /* next block */ }
  }
  return null;
}

function meta(html, prop) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m = html.match(re) || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'));
  return m ? decodeHtml(m[1]) : '';
}

function decodeHtml(s) {
  const named = {
    oacute: 'ó', Oacute: 'Ó', ntilde: 'ñ', Ntilde: 'Ñ',
    aacute: 'á', Aacute: 'Á', eacute: 'é', Eacute: 'É',
    iacute: 'í', Iacute: 'Í', uacute: 'ú', Uacute: 'Ú',
    nbsp: ' ', euro: '€',
  };
  return String(s || '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => named[name] ?? m)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function firstMatch(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeHtml(m[1]).trim();
  }
  return '';
}

function parseNumber(s) {
  if (s == null || s === '') return null;
  const n = parseFloat(String(s).replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function trimText(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function normalizeDescription(s) {
  return String(s || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parsePhoneFromHtml(html, chunk) {
  const scope = chunk || html;
  const tel = firstMatch(scope, [/href=["']tel:(\+?\d[\d\s-]{8,})["']/i]);
  if (tel) return trimText(tel.replace(/\s/g, ''));
  const jsonPhone = firstMatch(scope, [/"phone"\s*:\s*"(\+?\d{9,15})"/i, /"telefono"\s*:\s*"(\+?\d{9,15})"/i]);
  if (jsonPhone) return trimText(jsonPhone);
  return '';
}

function parseM2FromHtml(html) {
  const fromTitle = firstMatch(html, [/de\s+(\d+)\s+metros/i, /(\d+)\s*m²/i]);
  if (fromTitle) {
    const n = parseInt(fromTitle, 10);
    if (n >= 15 && n <= 2000) return n;
  }

  const fromFeature = firstMatch(html, [
    /id="js-feature-container"[\s\S]{0,800}?<strong>(\d+)<\/strong>\s*m<sup>2/i,
    /class="feature-container"[\s\S]{0,800}?<strong>(\d+)<\/strong>\s*m<sup>2/i,
  ]);
  if (fromFeature) return parseInt(fromFeature, 10);

  const fromSuperficie = firstMatch(html, [/Superficie\s+(\d+)(?:&nbsp;|\s)*m/i]);
  if (fromSuperficie) return parseInt(fromSuperficie, 10);

  return null;
}

function listingIdFromIdealistaUrl(url) {
  return String(url || '').match(/\/inmueble\/(\d{5,12})/i)?.[1] || null;
}

function idealistaFetchUrl(url) {
  const id = listingIdFromIdealistaUrl(url);
  return id ? `https://www.idealista.com/es/inmueble/${id}/` : url;
}

function isBlockedHtml(html) {
  const len = String(html || '').length;
  return len < 5000 || /captcha-delivery\.com|Please enable JS and disable any ad blocker/i.test(html);
}

function stripTags(html) {
  return decodeHtml(String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ''));
}

function normalizePhone(raw) {
  const t = trimText(raw);
  if (!t || t.includes('{{')) return '';
  const digits = t.replace(/\D/g, '');
  if (digits.length < 9 || IDEALISTA_BLOCKLIST_PHONES.has(digits)) return '';
  if (digits.length === 9 && /^[67]/.test(digits)) return `+34${digits}`;
  if (t.startsWith('+')) return t.replace(/\s/g, '');
  if (digits.startsWith('34') && digits.length >= 11) return `+${digits}`;
  return t.replace(/\s/g, '');
}

function parseIdealistaPhone(html) {
  const scope = html.match(/class="sticky-contact-user-info"[\s\S]{0,4000}/i)?.[0]
    || html.match(/class="about-advertiser"[\s\S]{0,4000}/i)?.[0]
    || html;

  for (const m of scope.matchAll(/href=["']tel:([^"']+)["']/gi)) {
    const phone = normalizePhone(m[1]);
    if (phone) return phone;
  }

  for (const pat of [
    /"formattedPhoneWithPrefix"\s*:\s*"([^"]+)"/,
    /"phoneNumber"\s*:\s*"([^"]+)"/,
    /data-contact-phone=["']([^"']+)["']/,
    /class="hidden-contact-phones_text"[^>]*>([^<]+)</,
  ]) {
    const m = scope.match(pat);
    if (m) {
      const phone = normalizePhone(m[1]);
      if (phone) return phone;
    }
  }

  return '';
}

function parseIdealistaFeatures(html) {
  const out = { m2: null, habitaciones: null, banos: null };
  const featureBlock = html.match(/class="info-features"[\s\S]{0,1200}?<\/div>/i)?.[0] || '';

  const m2 = featureBlock.match(/(\d+)\s*m²/i);
  const hab = featureBlock.match(/(\d+)\s*hab/i);
  if (m2) out.m2 = parseInt(m2[1], 10);
  if (hab) out.habitaciones = parseInt(hab[1], 10);

  const detailsBlock = html.match(/class="details-property[\s\S]{0,5000}/i)?.[0] || '';
  if (!out.m2) {
    const m2d = detailsBlock.match(/(\d+)\s*m²\s*construidos/i) || html.match(/(\d+)\s*m²\s*construidos/i);
    if (m2d) out.m2 = parseInt(m2d[1], 10);
  }
  if (!out.habitaciones) {
    const hd = detailsBlock.match(/(\d+)\s*habitaci/i);
    if (hd) out.habitaciones = parseInt(hd[1], 10);
  }
  const ban = detailsBlock.match(/(\d+)\s*baño/i) || featureBlock.match(/(\d+)\s*baño/i);
  if (ban) out.banos = parseInt(ban[1], 10);

  if (!out.m2) {
    const og = meta(html, 'og:description');
    const m2og = og.match(/(\d+)\s*m²/i);
    if (m2og) out.m2 = parseInt(m2og[1], 10);
  }

  return out;
}

function parseIdealistaLocation(html) {
  const minor = trimText(firstMatch(html, [/class="main-info__title-minor"[^>]*>([^<]+)/i]));
  if (!minor) return { zona: '', barrio: '', municipio: 'Barcelona' };

  const parts = minor.split(',').map(trimText).filter(Boolean);
  const barrio = parts[0] || '';
  const municipio = parts[1] || 'Barcelona';
  return { zona: barrio, barrio, municipio: municipio || 'Barcelona' };
}

function parseIdealista(html, url) {
  const out = emptyResult('idealista', url);

  out.titulo = trimText(firstMatch(html, [
    /class="main-info__title-main"[^>]*>([^<]+)/i,
    /<h1[^>]*>[\s\S]*?class="main-info__title-main"[^>]*>([^<]+)/i,
  ]));

  const loc = parseIdealistaLocation(html);
  out.zona = loc.zona;
  out.barrio = loc.barrio;
  out.municipio = loc.municipio;

  out.precio = parseNumber(firstMatch(html, [
    /class="info-data-price"[\s\S]{0,180}?txt-bold[^>]*>([\d.]+)/i,
    /class="info-data-price"[^>]*>[\s\S]{0,200}?([\d.]+)\s*€/i,
    /itemprop="price"[^>]+content="([^"]+)"/i,
  ]));

  const feats = parseIdealistaFeatures(html);
  out.m2 = feats.m2;
  out.habitaciones = feats.habitaciones;
  out.banos = feats.banos;

  out.contacto_nombre = trimText(firstMatch(html, [
    /class="about-advertiser-name"[^>]*>([^<]+)/i,
    /class="professional-name"[^>]*>([^<]+)/i,
  ]));

  out.telefono = parseIdealistaPhone(html);
  out.email = '';

  const commentHtml = firstMatch(html, [
    /class="comment"[\s\S]{0,4000}?<p>([\s\S]*?)<\/p>/i,
    /class="adCommentsLanguage[\s\S]{0,4000}?<p>([\s\S]*?)<\/p>/i,
  ]);
  out.descripcion = normalizeDescription(stripTags(commentHtml));
  if (!out.descripcion) out.descripcion = normalizeDescription(meta(html, 'og:description'));

  out.direccion = out.titulo
    ? trimText(out.titulo.replace(/^(?:Piso|Ático|Chalet|Casa|Estudio|Local|Oficina|Garaje|Dúplex|Loft)\s+en\s+(?:venta|alquiler)\s+en\s+/i, ''))
    : [out.barrio, out.municipio].filter(Boolean).join(', ');
  if (!out.direccion) out.direccion = out.titulo;

  let img = meta(html, 'og:image');
  if (img && img.startsWith('//')) img = `https:${img}`;
  out.imagen_url = img || '';

  return out;
}

function zoneFromHabitacliaUrl(url) {
  const slug = String(url || '').match(/comprar-piso-([^/?#]+)/i)?.[1] || '';
  const parts = slug.split('_').filter(Boolean);
  if (parts[0] === 'sagrada' && parts[1] === 'familia') return 'Sagrada Família';
  if (parts[0] === 'barceloneta') return 'Barceloneta';
  if (parts[0] === 'eixample') return 'Eixample';
  if (parts[0] === 'gracia' || parts[0] === 'gràcia') return 'Gràcia';
  if (parts[0] === 'poblenou') return 'Poblenou';
  if (parts.length >= 2 && parts[1].length > 2) {
    return `${parts[0]} ${parts[1]}`.replace(/\b\w/g, c => c.toUpperCase());
  }
  if (parts[0]) return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return '';
}

function parseHabitaclia(html, url) {
  const out = emptyResult('habitaclia', url);

  out.titulo = firstMatch(html, [
    /<section class="summary[\s\S]{0,4000}?<h1>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
  ]);
  out.titulo = trimText(out.titulo.replace(/\s*-\s*habitaclia\s*$/i, ''));

  out.precio = parseNumber(firstMatch(html, [
    /itemprop="price">([\d.]+)/i,
    /class="price"[\s\S]{0,200}?([\d.]{3,})\s*€/i,
  ]));

  out.m2 = parseM2FromHtml(html);

  const featureBlock = html.match(/id="js-feature-container"[\s\S]{0,900}/i)?.[0] || '';
  if (featureBlock) {
    const hab = featureBlock.match(/<strong>(\d+)<\/strong>\s*hab/i);
    const ban = featureBlock.match(/<strong>(\d+)<\/strong>\s*ba/i);
    if (hab) out.habitaciones = parseInt(hab[1], 10);
    if (ban) out.banos = parseInt(ban[1], 10);
  }
  if (!out.habitaciones) {
    const hab = firstMatch(html, [/<li>\s*(\d+)\s*habitaciones/i]);
    out.habitaciones = hab ? parseInt(hab, 10) : null;
  }
  if (!out.banos) {
    const ban = firstMatch(html, [/<li>\s*(\d+)\s*Ba/i]);
    out.banos = ban ? parseInt(ban, 10) : null;
  }

  out.barrio = trimText(firstMatch(html, [
    /class="link-map-location"[^>]*>([^<]+)</i,
    /id="js-ver-mapa-zona"[^>]*>([^<]+)</i,
  ])) || zoneFromHabitacliaUrl(url);
  out.zona = out.barrio;
  out.municipio = trimText(firstMatch(html, [
    /<h1[^>]*>[\s\S]*?\s+en\s+([^<]+)<\/h1>/i,
  ])) || 'Barcelona';
  out.municipio = out.municipio.replace(/\s*-\s*habitaclia\s*$/i, '').trim() || 'Barcelona';

  const street = trimText(firstMatch(html, [
    /article class="location"[\s\S]{0,500}?-\s*([^<\n]+)/i,
  ]));
  out.direccion = [street, out.barrio, out.municipio].filter(Boolean).join(', ');

  out.descripcion = normalizeDescription(firstMatch(html, [
    /id="js-detail-description"[^>]*>([\s\S]*?)<\/p>/i,
  ]));
  if (!out.descripcion) out.descripcion = normalizeDescription(meta(html, 'description'));

  let img = meta(html, 'og:image');
  if (img && img.startsWith('//')) img = `https:${img}`;
  out.imagen_url = img || '';

  // Teléfono oculto tras botón "ver teléfono" (AJAX) — no inventar números
  out.telefono = '';
  out.contacto_nombre = '';
  out.email = '';

  return out;
}

function listingIdFromFotocasaUrl(url) {
  const m = String(url || '').match(/\/(\d{5,12})(?:\/|[?#]|$)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Extrae el objeto JSON del anuncio embebido en el HTML de Fotocasa. */
function extractFotocasaListing(html, listingId) {
  const idNum = parseInt(String(listingId).replace(/\D/g, ''), 10);
  if (!idNum) return null;

  const marker = `"id":${idNum}`;
  let pos = html.indexOf(marker);
  while (pos >= 0) {
    const next = html[pos + marker.length];
    if (next === ',' || next === '}') {
      let depth = 0;
      for (let i = pos; i >= Math.max(0, pos - 50000); i--) {
        const c = html[i];
        if (c === '}') depth++;
        else if (c === '{') {
          if (depth === 0) {
            let d2 = 0;
            let end = i;
            for (let j = i; j < html.length && j < i + 80000; j++) {
              const c2 = html[j];
              if (c2 === '{') d2++;
              else if (c2 === '}') {
                d2--;
                if (d2 === 0) { end = j + 1; break; }
              }
            }
            try {
              const obj = JSON.parse(html.slice(i, end));
              if (obj.id === idNum && obj.price != null) return obj;
            } catch (_) { /* siguiente candidato */ }
          }
          depth--;
        }
      }
    }
    pos = html.indexOf(marker, pos + 1);
  }
  return null;
}

function pickDescription(descriptions) {
  if (!descriptions || typeof descriptions !== 'object') return '';
  return descriptions['es-ES'] || descriptions['es'] || descriptions['ca-ES']
    || Object.values(descriptions).find(v => typeof v === 'string' && v.length > 40) || '';
}

function buildFotocasaTitle(listing) {
  const addr = listing.address || {};
  const barrio = trimText(addr.neighborhood || addr.upperLevel || '');
  const distrito = trimText(addr.district || '');
  const tipo = listing.buildingSubtype === 'Flat' || listing.buildingType === 'Flat' ? 'Piso' : 'Vivienda';
  const parts = [tipo];
  if (barrio) parts.push(`en ${barrio}`);
  if (distrito && distrito !== barrio) parts.push(`(${distrito})`);
  const built = parts.join(' ');
  if (built.length > 8) return built;
  const og = trimText(listing.seo?.title || '').replace(/\s*\|\s*fotocasa\s*$/i, '');
  return og || built;
}

function buildFotocasaDireccion(listing) {
  const addr = listing.address || {};
  const parts = [
    addr.neighborhood || addr.upperLevel,
    addr.district,
    trimText(addr.municipality || addr.city),
    addr.zipCode,
  ].filter(Boolean).map(trimText);
  return parts.join(', ');
}

function extrasFromListing(listing) {
  const bits = [];
  if (Array.isArray(listing.extras)) bits.push(...listing.extras.filter(Boolean));
  if (listing.otherFeatures && typeof listing.otherFeatures === 'object') {
    bits.push(...Object.values(listing.otherFeatures).filter(Boolean));
  }
  if (Array.isArray(listing.featuresList)) {
    for (const f of listing.featuresList) {
      if (f.label === 'elevator' && String(f.value).toUpperCase() === 'YES') bits.push('Ascensor');
    }
  }
  return [...new Set(bits.map(trimText).filter(Boolean))];
}

function parseFotocasa(html, url) {
  const out = emptyResult('fotocasa', url);
  const listingId = listingIdFromFotocasaUrl(url);
  const listing = listingId ? extractFotocasaListing(html, listingId) : null;

  if (listing) {
    const addr = listing.address || {};
    const feats = listing.features || {};

    out.precio = listing.price != null ? Number(listing.price) : null;
    out.m2 = feats.surface != null ? Number(feats.surface) : null;
    out.habitaciones = feats.rooms != null ? parseInt(feats.rooms, 10) : null;
    out.banos = feats.bathrooms != null ? parseInt(feats.bathrooms, 10) : null;
    out.telefono = trimText(listing.phone || listing.agency?.phone || '');
    out.contacto_nombre = trimText(listing.contactName || listing.clientName || listing.agency?.name || '');
    out.email = trimText(listing.clientContactEmail || listing.clientEmail || listing.agency?.email || '');

    out.barrio = trimText(addr.neighborhood || addr.upperLevel || listing.relatedGeoInfo?.zoneSlug?.replace(/-/g, ' ') || '');
    out.zona = trimText(addr.district || out.barrio);
    out.municipio = trimText(addr.municipality || addr.city || addr.province || 'Barcelona') || 'Barcelona';

    out.titulo = buildFotocasaTitle(listing);
    out.direccion = buildFotocasaDireccion(listing) || out.titulo;

    let desc = normalizeDescription(pickDescription(listing.descriptions));
    if (!desc) desc = normalizeDescription(meta(html, 'og:description'));
    const extras = extrasFromListing(listing);
    if (extras.length) {
      const extraLine = `Extras: ${extras.join(', ')}.`;
      desc = desc ? `${desc}\n\n${extraLine}` : extraLine;
    }
    out.descripcion = desc;

    const img = listing.multimedia?.find(m => m.type === 'image' || m.src)?.src
      || listing.multimedia?.[0]?.src
      || meta(html, 'og:image');
    out.imagen_url = img || '';

    return out;
  }

  // Fallback parcial con meta tags y regex cercano al ID
  out.titulo = trimText(meta(html, 'og:title')).replace(/\s*\|\s*fotocasa\s*$/i, '');
  out.descripcion = normalizeDescription(meta(html, 'og:description'));
  out.imagen_url = meta(html, 'og:image');

  if (listingId) {
    const pos = html.indexOf(`"id":${listingId}`);
    const chunk = pos >= 0 ? html.slice(pos - 2000, pos + 12000) : html;
    out.precio = parseNumber(firstMatch(chunk, [/"price"\s*:\s*(\d+)/]));
    const feat = chunk.match(/"features"\s*:\s*\{[^}]+\}/);
    if (feat) {
      try {
        const f = JSON.parse(feat[0].replace(/^"features"\s*:\s*/, ''));
        out.m2 = f.surface ?? out.m2;
        out.habitaciones = f.rooms ?? out.habitaciones;
        out.banos = f.bathrooms ?? out.banos;
      } catch (_) { /* ignore */ }
    }
    out.telefono = firstMatch(chunk, [/"phone"\s*:\s*"([^"]+)"/]);
    out.contacto_nombre = firstMatch(chunk, [/"contactName"\s*:\s*"([^"]+)"/, /"clientName"\s*:\s*"([^"]+)"/]);
    out.barrio = firstMatch(chunk, [/"neighborhood"\s*:\s*"([^"]+)"/, /"upperLevel"\s*:\s*"([^"]+)"/]);
    out.zona = firstMatch(chunk, [/"district"\s*:\s*"([^"]+)"/]) || out.barrio;
    out.municipio = trimText(firstMatch(chunk, [/"municipality"\s*:\s*"([^"]+)"/, /"city"\s*:\s*"([^"]+)"/])) || out.municipio;
  }

  if (!out.direccion && out.titulo) out.direccion = out.titulo;
  return out;
}

function parseFromHtml(html, fuente, url) {
  if (fuente === 'fotocasa') {
    return parseFotocasa(html, url);
  }
  if (fuente === 'habitaclia') {
    return parseHabitaclia(html, url);
  }
  if (fuente === 'idealista') {
    return parseIdealista(html, url);
  }

  const out = emptyResult(fuente, url);

  const ld = parseJsonLd(html);
  if (ld) {
    out.titulo = ld.name || ld.headline || out.titulo;
    out.descripcion = ld.description || out.descripcion;
    out.imagen_url = (Array.isArray(ld.image) ? ld.image[0] : ld.image) || out.imagen_url;
    if (ld.offers?.price) out.precio = parseNumber(ld.offers.price);
    if (ld.floorSize?.value) out.m2 = parseNumber(ld.floorSize.value);
    if (ld.numberOfRooms) out.habitaciones = parseInt(ld.numberOfRooms, 10) || null;
    if (ld.address) {
      out.direccion = [ld.address.streetAddress, ld.address.addressLocality].filter(Boolean).join(', ');
      out.municipio = ld.address.addressLocality || out.municipio;
      out.barrio = ld.address.addressRegion || ld.address.addressLocality || '';
    }
  }

  out.titulo = out.titulo || meta(html, 'og:title') || firstMatch(html, [/<h1[^>]*>([^<]+)</i]);
  out.descripcion = out.descripcion || meta(html, 'og:description');
  out.imagen_url = out.imagen_url || meta(html, 'og:image');

  if (!out.precio) {
    out.precio = parseNumber(firstMatch(html, [
      /(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*€/,
      /"price"\s*:\s*"?(\d+)/i,
      /precio[^>]*>[\s\S]*?(\d{1,3}(?:\.\d{3})*)\s*€/i,
    ]));
  }

  if (!out.m2) {
    out.m2 = parseM2FromHtml(html);
  }

  if (!out.habitaciones) {
    const hab = firstMatch(html, [/(\d+)\s*hab/i, /(\d+)\s*habitaci/i]);
    out.habitaciones = hab ? parseInt(hab, 10) : null;
  }

  if (!out.banos) {
    const ban = firstMatch(html, [/(\d+)\s*ba(?:ñ|n)?/i]);
    out.banos = ban ? parseInt(ban, 10) : null;
  }

  if (!out.telefono) {
    out.telefono = parsePhoneFromHtml(html);
  }

  if (!out.direccion && out.titulo.toLowerCase().includes(' en ')) {
    const parts = out.titulo.split(/\s+en\s+/i);
    if (parts[1]) out.direccion = parts.slice(1).join(' en ').trim();
  }

  if (fuente === 'kelify' && url.includes('/barcelona/')) {
    out.municipio = out.municipio || 'Barcelona';
    out.zona = out.zona || out.barrio;
  }

  return out;
}

function countCompletitud(data) {
  let filled = 0;
  ['titulo', 'precio', 'm2', 'habitaciones', 'banos', 'telefono', 'direccion', 'zona', 'barrio', 'municipio', 'descripcion', 'contacto_nombre', 'imagen_url'].forEach(k => {
    if (data[k]) filled++;
  });
  return filled;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Método no permitido' });

  try {
    const { url } = req.body || {};
    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).json({ ok: false, error: 'URL no válida' });
    }

    const fuente = detectFuente(url);
    const fetchUrl = fuente === 'idealista' ? idealistaFetchUrl(url) : url;
    const fetchHeaders = fuente === 'idealista'
      ? { ...FETCH_HEADERS, 'User-Agent': IDEALISTA_MOBILE_UA }
      : FETCH_HEADERS;

    const response = await fetch(fetchUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: `No se pudo acceder al anuncio (${response.status})`, fuente });
    }

    const html = await response.text();
    if (isBlockedHtml(html)) {
      return res.status(502).json({
        ok: false,
        error: 'El portal bloqueó la importación automática. Rellena teléfono y datos manualmente.',
        fuente,
      });
    }

    const data = parseFromHtml(html, fuente, url);
    const filled = countCompletitud(data);

    return res.status(200).json({
      ok: true,
      fuente,
      data,
      completitud: filled,
      aviso: filled < 5 ? 'Importación parcial. Teléfono y contacto suelen rellenarse manualmente.' : null,
    });
  } catch (err) {
    console.error('import-particular:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Error al importar' });
  }
}

export { parseFotocasa, parseHabitaclia, parseIdealista, extractFotocasaListing, parseFromHtml, listingIdFromFotocasaUrl, listingIdFromIdealistaUrl };
