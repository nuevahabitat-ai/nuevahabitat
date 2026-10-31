/**
 * Sustituye aperturas genéricas en guías vender-como-particular-*.
 * node scripts/diversify-particular-openings.js
 */
const fs = require('fs');
const path = require('path');
const { NH_FEE_LABEL_ESCRITURA } = require('./fee-config');

const DIR = path.join(__dirname, '..', 'content', 'landings', 'particular');

const OPENERS = [
  (c) =>
    `<p>En <strong>${c.barrio}</strong>, vender como <strong>particular</strong> suele significar muchas consultas en portal y ninguna oferta con hipoteca cerrada. Orientativamente 2026: <strong>${c.precioM2}</strong>; ticket habitual <strong>${c.ticket}</strong>. ${c.tendencia} NuevaHabitat trabaja con <strong>${NH_FEE_LABEL_ESCRITURA}</strong> solo en escritura, panel vendedor y filtro de solvencia.</p>`,
  (c) =>
    `<p>Si publicaste en <strong>${c.barrio}</strong> como particular y el teléfono no trae banco al fondo, el problema rara vez es «falta de anuncio»: es <strong>precio por calle</strong> (<strong>${c.precioM2}</strong>, <strong>${c.ticket}</strong>) y visitas sin filtro. ${c.tendencia} Opción con coste cerrado: <strong>${NH_FEE_LABEL_ESCRITURA}</strong> en escritura.</p>`,
  (c) =>
    `<p><strong>Particular en ${c.barrio}</strong>: antes de abrir más puertas conviene anclar <strong>${c.precioM2}</strong> y exigir preaprobación hipotecaria. Ticket orientativo <strong>${c.ticket}</strong>. ${c.tendencia} Guía local + <strong>${NH_FEE_LABEL_ESCRITURA}</strong> solo si hay venta.</p>`,
  (c) =>
    `<p>Esta guía recoge lo que vemos en <strong>${c.barrio}</strong> cuando el propietario vende solo: visitas sin financiación, pricing mezclado con barrios vecinos y WhatsApp sin fin. Referencia 2026: <strong>${c.precioM2}</strong> (ticket <strong>${c.ticket}</strong>). ${c.tendencia} <a href="/vender-como-particular-barcelona">Guía Barcelona</a> · <strong>${NH_FEE_LABEL_ESCRITURA}</strong> en escritura si quieres panel y filtro.</p>`,
];

function ctxFrom(L, name, barrioLabel) {
  const tendencia = (L.datosMercado?.tendencia || L.perfilComprador || '').trim();
  const tendenciaSuffix = tendencia ? `${tendencia.endsWith('.') ? tendencia : tendencia + '.'} ` : '';
  const precioM2 = L.datosMercado?.precioM2 || 'consultar valoración local';
  let ticket = 'según m² y estado';
  const m = (L.argumento_principal || '').match(/ticket habitual <strong>([^<]+)<\/strong>/i);
  if (m) ticket = m[1];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % OPENERS.length;
  return {
    barrio: barrioLabel,
    precioM2,
    ticket,
    tendencia: tendenciaSuffix,
    idx,
  };
}

function tryIdealista(L, name, arg) {
  if (!arg.includes('empieza con consultas en Idealista o Fotocasa')) return null;
  const re =
    /<p>Vender como <strong>particular en ([^<]+)<\/strong> empieza con consultas en Idealista o Fotocasa;[\s\S]*?<\/p>/;
  const m = arg.match(re);
  if (!m) return null;
  const c = ctxFrom(L, name, m[1]);
  return arg.replace(re, OPENERS[c.idx](c));
}

function trySiBuscas(L, name, arg) {
  if (!arg.includes('Si buscas <strong>vender piso siendo particular')) return null;
  const re =
    /<p>Si buscas <strong>vender piso siendo particular en ([^<]+)<\/strong>, esta guía local complementa[\s\S]*?<\/p>/;
  const m = arg.match(re);
  if (!m) return null;
  const c = ctxFrom(L, name, m[1]);
  const hub = L.relacionadas?.find((r) => r.slug?.includes('inmobiliaria-para-particulares'));
  const hubLink = hub
    ? ` <a href="/${hub.slug}">${hub.label || 'inmobiliaria para particulares'}</a>.`
    : '';
  const newP = OPENERS[(c.idx + 1) % OPENERS.length](c).replace(
    '</p>',
    `${hubLink}</p>`
  );
  return arg.replace(re, newP);
}

function tryEstaGuia(L, name, arg) {
  if (!arg.includes('Esta guía es para el <strong>propietario particular</strong>')) return null;
  const re =
    /<p>Esta guía es para el <strong>propietario particular<\/strong> que vende en <strong>([^<]+)<\/strong>[\s\S]*?<\/p>/;
  const m = arg.match(re);
  if (!m) return null;
  const c = ctxFrom(L, name, m[1]);
  const cp = (L.postalCodes && L.postalCodes[0]) || '';
  const zonas = L.zonas?.length ? ` (${L.zonas.slice(0, 3).join(' · ')})` : '';
  const newP = `<p>Guía para el <strong>particular</strong> en <strong>${c.barrio}</strong>${cp ? ` · ${cp}` : ''}${zonas}: mapa de precios <strong>${c.precioM2}</strong>, errores de portal y opción <strong>${NH_FEE_LABEL_ESCRITURA}</strong> con panel vendedor. ${c.tendencia}<a href="/vender-como-particular-barcelona">Particular Barcelona</a>.</p>`;
  return arg.replace(re, newP);
}

let n = 0;
for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const file = path.join(DIR, name);
  const L = JSON.parse(fs.readFileSync(file, 'utf8'));
  let arg = L.argumento_principal || '';
  const next =
    tryIdealista(L, name, arg) || trySiBuscas(L, name, arg) || tryEstaGuia(L, name, arg);
  if (!next || next === arg) continue;
  L.argumento_principal = next;
  fs.writeFileSync(file, JSON.stringify(L, null, 2) + '\n', 'utf8');
  console.log('updated', name);
  n++;
}
console.log('Done.', n, 'particular openings');
