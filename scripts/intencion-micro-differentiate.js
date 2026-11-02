/**
 * Meta, hero y bloques visibles únicos por barrio (datos del JSON barrio).
 */
const fs = require('fs');
const path = require('path');

const BARRIO_DIR = path.join(__dirname, '..', 'content', 'landings', 'barrio');

function fmtEuro(n) {
  return Math.round(n).toLocaleString('es-ES');
}

function resolveBarrioSlug(intSlug) {
  const zone = intSlug
    .replace(/^inmobiliaria-(precio-fijo|para-particulares)-/, '')
    .replace(/-barcelona$/, '');
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
  return intSlug.includes('para-particulares') ? 'pp' : 'pf';
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

  if (kind === 'pf') {
    L.meta.title = `Inmobiliaria precio fijo ${barrio}${cp ? ' (' + cp + ')' : ''} · ${z1} · 3.630 € · NuevaHabitat`;
    L.meta.description = `Agencia honorarios fijos en ${barrio}, ${z1}: ${m2}. ${tend} 3.630 € solo en escritura, panel vendedor y calculadora vs 6%.`;
    L.hero.badge = `${z1}${cp ? ' · ' + cp : ''} · Precio fijo · Panel`;
    L.hero.h1 = `Precio fijo en ${barrio} (${z1}): 3.630 € en escritura, no 6% sobre ~${ticketK}.000 €`;
    L.hero.lead = `¿Agencia en <strong>${z1}</strong>${z2 ? ' / ' + z2 : ''} (${barrio})? <strong>${m2}</strong>, plazos ~${tiempo}. <strong>3.630 €</strong> solo al vender, panel vendedor y calculadora. <a href="/${B.slug}">Vender en ${barrio}</a>.`;
    if (B.heroImage) L.hero.image = B.heroImage;
    if (B.heroImageAlt) L.hero.imageAlt = B.heroImageAlt;
    L.calculadora = L.calculadora || {};
    L.calculadora.precioDefault = precio;
    L.calculadora.titulo = `Calculadora ${barrio} · ${z1}: 6% vs 3.630 €`;
    L.calculadora.subtitulo = `Ticket orientativo ${fmtEuro(precio)} € (${m2}). Solo cobro en escritura.`;
    if (L.como_ayudamos) {
      L.como_ayudamos.title = `${barrio}: valoración en ${z1} y precio fijo`;
      L.como_ayudamos.description = tend || `Honorarios cerrados en ${barrio}.`;
    }
    if (L.comparativa_modelos) {
      L.comparativa_modelos.title = `Vender en ${z1} (${barrio}): portal, 6% o precio fijo`;
    }
    if (L.mitos && L.mitos.items && L.mitos.items.length >= 3) {
      L.mitos.items[2] = {
        mito: `Publicar en ${z1} sin agencia basta`,
        realidad: `En ${barrio} filtrar solvencia y documentación cierra más ventas que otro anuncio genérico.`,
      };
    }
    if (L.checklist) {
      L.checklist.title = `Checklist precio fijo · ${z1}`;
      L.checklist.intro = `Antes de firmar mandato en ${barrio}.`;
    }
  } else {
    L.meta.title = `Inmobiliaria para particulares ${barrio} · ${z1}${cp ? ' · ' + cp : ''} · 3.630 € · NuevaHabitat`;
    L.meta.description = `Particular en ${barrio} (${z1}): ${tend} ${m2}. Agencia 3.630 € en escritura, panel, Idealista + cartera cualificada.`;
    L.hero.badge = `${barrio} · Particular · ${z1}`;
    L.hero.h1 = `Inmobiliaria para particulares en ${barrio}: ${z1}, 3.630 € y panel (no 6%)`;
    L.hero.lead = `Eres <strong>particular</strong> en <strong>${z1}</strong> (${barrio}). ${m2}, ~${tiempo}. <strong>3.630 €</strong> solo en escritura, visitas con hipoteca contrastada y panel vendedor.`;
    if (B.heroImage) L.hero.image = B.heroImage;
    if (B.heroImageAlt) L.hero.imageAlt = `Particular vendiendo en ${barrio} — ${z1}`;
    L.calculadora = L.calculadora || {};
    L.calculadora.precioDefault = precio;
    L.calculadora.titulo = `Particular ${barrio} (${z1}): neto vs comisión 6%`;
    L.calculadora.subtitulo = `Sobre ${fmtEuro(precio)} € en ${barrio}. Compara con 3.630 € fijos en escritura.`;
    L.cardTeaser = `Particular ${barrio}, ${z1}: agencia 3.630 €, panel y compradores filtrados (${m2}).`;
    if (L.como_ayudamos) {
      L.como_ayudamos.title = `Particular en ${z1}: de portal a escritura`;
      L.como_ayudamos.description = tend || `Proceso claro en ${barrio}.`;
    }
    if (L.comparativa_modelos) {
      L.comparativa_modelos.title = `${z1}: particular en portal vs 6% vs NuevaHabitat`;
    }
    if (L.mitos && L.mitos.items && L.mitos.items.length >= 1) {
      L.mitos.items[0] = {
        mito: `Como particular en ${z1} no necesito filtrar visitas`,
        realidad: `Curiosos sin hipoteca alargan meses; en ${barrio} el filtro ahorra fines de semana.`,
      };
    }
    if (L.checklist) {
      L.checklist.title = `Checklist particular · ${z1}`;
    }
  }

  L.footerLabel = kind === 'pf' ? `Precio fijo ${barrio}` : `Particulares ${barrio}`;
  L.breadcrumbCurrent = kind === 'pf' ? `Precio fijo ${barrio}` : `Particulares ${barrio}`;
  return L;
}

function slugsFromGscIndexFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('https://'))
    .map((u) => u.replace('https://www.nuevahabitat.com/', '').replace(/\/$/, ''));
}

module.exports = {
  resolveBarrioSlug,
  kindFromIntSlug,
  applyVisibleDifferentiators,
  slugsFromGscIndexFile,
  BARRIO_DIR,
};
