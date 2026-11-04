/**
 * Meta, hero y bloques visibles únicos por barrio (datos del JSON barrio).
 */
const fs = require('fs');
const path = require('path');

const BARRIO_DIR = path.join(__dirname, '..', 'content', 'landings', 'barrio');

const ZONE_TO_BARRIO = {
  'el-clot': 'vender-el-clot-la-sagrera-barcelona',
  'el-clot-la-sagrera': 'vender-el-clot-la-sagrera-barcelona',
  'ciutat-vella': 'vender-piso-ciutat-vella-barcelona',
};

/** Argumentos reescritos a mano — no regenerar cuerpo. */
const MANUAL_ARGUMENTO_SLUGS = new Set([
  'inmobiliaria-precio-fijo-poblenou-barcelona',
  'inmobiliaria-precio-fijo-vila-olimpica-barcelona',
]);

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function zoneFromIntSlug(intSlug) {
  if (intSlug.startsWith('venta-piso-economica-')) {
    return intSlug.slice('venta-piso-economica-'.length).replace(/-barcelona$/, '');
  }
  return intSlug
    .replace(/^inmobiliaria-(precio-fijo|para-particulares)-/, '')
    .replace(/-barcelona$/, '');
}

function resolveBarrioSlug(intSlug) {
  const zone = zoneFromIntSlug(intSlug);
  if (ZONE_TO_BARRIO[zone]) {
    const ali = ZONE_TO_BARRIO[zone];
    if (fs.existsSync(path.join(BARRIO_DIR, ali + '.json'))) return ali;
  }
  const tries = [
    `vender-piso-${zone}-barcelona`,
    `vender-piso-${zone}`,
    `vender-${zone}-barcelona`,
    `vender-${zone}`,
  ];
  for (const t of tries) {
    if (fs.existsSync(path.join(BARRIO_DIR, t + '.json'))) return t;
  }
  return null;
}

function kindFromIntSlug(intSlug) {
  if (intSlug.startsWith('venta-piso-economica-')) return 'econ';
  if (intSlug.includes('para-particulares')) return 'pp';
  if (intSlug.includes('precio-fijo')) return 'pf';
  return null;
}

function needsArgumentoRebuild(html, slug) {
  if (MANUAL_ARGUMENTO_SLUGS.has(slug)) return false;
  if (!html || html.length < 200) return true;
  if (/Esta es una <strong>landing nueva/i.test(html)) return true;
  if (/eombre|ilencio absoluto|Si ya eNova|> la Rambla del Poblenou y el frente/i.test(html)) return true;
  if (/Slug inmobiliaria-[^\s]+-z\d/i.test(html)) return true;
  if ((html.match(/Lofts industriales/g) || []).length > 1) return true;
  if ((html.match(/Honorarios fijos y proceso transparente/g) || []).length > 1) return true;
  return false;
}

/** Aplica títulos, badges, H1, lead, calculadora y mitos localizados. */
function applyVisibleDifferentiators(L, B, kind) {
  const barrio = B.barrio || L.slug;
  const cp = (B.postalCodes && B.postalCodes[0]) || '';
  const z1 = (B.zonas && B.zonas[0]) || barrio;
  const z2 = (B.zonas && B.zonas[1]) || '';
  const m2 = (B.datosMercado && B.datosMercado.precioM2) || '';
  const tiempo = (B.datosMercado && B.datosMercado.tiempoVenta) || '60 – 90 días';
  const tend = (B.datosMercado && B.datosMercado.tendencia) || '';
  const precio = B.ejemploPrecio || L.calculadora?.precioDefault || 400000;
  const ticketK = Math.round(precio / 1000);
  const com6 = Math.round(precio * 0.06 * 1.21);

  if (kind === 'pf') {
    L.meta.title = `Inmobiliaria precio fijo ${barrio}${cp ? ' (' + cp + ')' : ''} · ${z1} · 3.500 € + IVA · NuevaHabitat`;
    L.meta.description = `Agencia honorarios fijos en ${barrio}, ${z1}: ${m2}. ${tend} 3.500 € + IVA, panel vendedor y calculadora vs 6%.`;
    L.hero.badge = `${z1}${cp ? ' · ' + cp : ''} · Precio fijo · Panel`;
    L.hero.h1 = `Precio fijo en ${barrio} (${z1}): 3.500 € + IVA, no 6% sobre ~${ticketK}.000 €`;
    L.hero.lead = `¿Agencia en <strong>${z1}</strong>${z2 ? ' / ' + z2 : ''} (${barrio})? <strong>${m2}</strong>, plazos ~${tiempo}. <strong>3.500 € + IVA</strong> solo al vender, panel vendedor y calculadora. <a href="/${B.slug}">Vender en ${barrio}</a>.`;
    L.calculadora = L.calculadora || {};
    L.calculadora.precioDefault = precio;
    L.calculadora.titulo = `Calculadora ${barrio} · ${z1}: 6% vs 3.500 € + IVA`;
    L.calculadora.subtitulo = `Ticket orientativo ${fmtEuro(precio)} € (${m2}). Solo cobro en escritura.`;
    if (L.como_ayudamos) {
      L.como_ayudamos.title = `${barrio}: valoración en ${z1} y precio fijo`;
      L.como_ayudamos.description = tend || `Honorarios cerrados en ${barrio}.`;
    }
    if (L.comparativa_modelos) {
      L.comparativa_modelos.title = `Vender en ${z1} (${barrio}): portal, 6% o precio fijo`;
    }
    if (L.mitos?.items?.[2]) {
      L.mitos.items[2] = {
        mito: `Publicar en ${z1} sin agencia basta`,
        realidad: `En ${barrio} filtrar solvencia y documentación cierra más ventas que otro anuncio genérico.`,
      };
    }
    if (L.checklist) {
      L.checklist.title = `Checklist precio fijo · ${z1}`;
      L.checklist.intro = `Antes de firmar mandato en ${barrio}.`;
    }
    L.footerLabel = `Precio fijo ${barrio}`;
    L.breadcrumbCurrent = `Precio fijo ${barrio}`;
  } else if (kind === 'pp') {
    L.meta.title = `Inmobiliaria para particulares ${barrio} · ${z1}${cp ? ' · ' + cp : ''} · 3.500 € + IVA · NuevaHabitat`;
    L.meta.description = `Particular en ${barrio} (${z1}): ${tend} ${m2}. agencia 3.500 € + IVA en escritura, panel, Idealista + cartera cualificada.`;
    L.hero.badge = `${barrio} · Particular · ${z1}`;
    L.hero.h1 = `Inmobiliaria para particulares en ${barrio}: ${z1}, 3.500 € + IVA y panel (no 6%)`;
    L.hero.lead = `Eres <strong>particular</strong> en <strong>${z1}</strong> (${barrio}). ${m2}, ~${tiempo}. <strong>3.500 € + IVA</strong> solo en escritura, visitas con hipoteca contrastada y panel vendedor.`;
    L.calculadora = L.calculadora || {};
    L.calculadora.precioDefault = precio;
    L.calculadora.titulo = `Particular ${barrio} (${z1}): neto vs comisión 6%`;
    L.calculadora.subtitulo = `Sobre ${fmtEuro(precio)} € en ${barrio}. Compara con 3.500 € + IVA en escritura.`;
    L.cardTeaser = `Particular ${barrio}, ${z1}: agencia 3.500 € + IVA, panel y compradores filtrados (${m2}).`;
    if (L.como_ayudamos) {
      L.como_ayudamos.title = `Particular en ${z1}: de portal a escritura`;
      L.como_ayudamos.description = tend || `Proceso claro en ${barrio}.`;
    }
    if (L.comparativa_modelos) {
      L.comparativa_modelos.title = `${z1}: particular en portal vs 6% vs NuevaHabitat`;
    }
    if (L.mitos?.items?.[0]) {
      L.mitos.items[0] = {
        mito: `Como particular en ${z1} no necesito filtrar visitas`,
        realidad: `Curiosos sin hipoteca alargan meses; en ${barrio} el filtro ahorra fines de semana.`,
      };
    }
    if (L.checklist) L.checklist.title = `Checklist particular · ${z1}`;
    L.footerLabel = `Particulares ${barrio}`;
    L.breadcrumbCurrent = `Particulares ${barrio}`;
  } else if (kind === 'econ') {
    L.meta.title = `Venta piso económica ${barrio}${cp ? ' (' + cp + ')' : ''} · ${z1} · 3.500 € + IVA · NuevaHabitat`;
    L.meta.description = `Honorarios bajos en ${barrio} (${z1}): ahorra vs ${fmtEuro(com6)} € de comisión 6%. ${m2}. 3.500 € + IVA, panel y cartera.`;
    L.hero.badge = `${z1} · Venta económica · ${cp || barrio}`;
    L.hero.h1 = `Venta económica en ${barrio} (${z1}): 3.500 € + IVA, no ~${fmtEuro(com6)} € de comisión`;
    L.hero.lead = `¿Vendes en <strong>${z1}</strong>? Evita regalar ~<strong>${fmtEuro(com6)} €</strong> (6% + IVA). <strong>3.500 € + IVA</strong> fijos solo al vender · ${m2} · <a href="/${B.slug}">Vender ${barrio}</a>.`;
    if (L.heroStats && L.heroStats[1]) {
      L.heroStats[1].value = `~${fmtEuro(com6)} €`;
      L.heroStats[1].note = `6% + IVA sobre ${fmtEuro(precio)} €`;
    }
    L.calculadora = L.calculadora || {};
    L.calculadora.precioDefault = precio;
    L.calculadora.titulo = `Venta económica ${barrio} · ${z1}: 6% vs 3.500 € + IVA`;
    L.calculadora.subtitulo = `${fmtEuro(precio)} € orientativo (${m2}).`;
    if (L.como_ayudamos) {
      L.como_ayudamos.title = `Venta económica en ${z1} (${barrio})`;
      L.como_ayudamos.description = tend || `Honorarios fijos, no vender barato.`;
    }
    if (L.comparativa_modelos) {
      L.comparativa_modelos.title = `${z1}: ¿portal, 6% o venta económica NH?`;
    }
    if (L.mitos?.items?.[2]) {
      L.mitos.items[2] = {
        mito: `En ${z1} el portal es más barato que agencia`,
        realidad: `El coste real es tiempo + comisión si cierras mal; filtramos solvencia en ${barrio}.`,
      };
    }
    L.footerLabel = `Venta económica ${barrio}`;
    L.breadcrumbCurrent = `Venta económica ${barrio}`;
  }

  if (B.heroImage) L.hero.image = B.heroImage;
  if (B.heroImageAlt && L.hero) {
    L.hero.imageAlt =
      kind === 'pp'
        ? `Particular vendiendo en ${barrio} — ${z1}`
        : B.heroImageAlt;
  }
  return L;
}

function slugsFromGscIndexFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('https://'))
    .map((u) => u.replace('https://www.nuevahabitat.com/', '').replace(/\/$/, '').replace(/\r$/, ''));
}

module.exports = {
  resolveBarrioSlug,
  zoneFromIntSlug,
  kindFromIntSlug,
  applyVisibleDifferentiators,
  needsArgumentoRebuild,
  MANUAL_ARGUMENTO_SLUGS,
  slugsFromGscIndexFile,
  BARRIO_DIR,
};
