import { alfredoBuyerWaLlmEnabled, geminiChatPlain } from './gemini-llm.js';
const SPANISH_NUMBER_WORDS = {
  cero: 0,
  uno: 1,
  un: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  veinte: 20,
  treinta: 30,
  cuarenta: 40,
  cincuenta: 50,
  sesenta: 60,
  setenta: 70,
  ochenta: 80,
  noventa: 90,
  cien: 100,
  ciento: 100,
  doscientos: 200,
  doscientas: 200,
  trescientos: 300,
  trescientas: 300,
  cuatrocientos: 400,
  cuatrocientas: 400,
  quinientos: 500,
  quinientas: 500,
  seiscientos: 600,
  seiscientas: 600,
  setecientos: 700,
  setecientas: 700,
  ochocientos: 800,
  ochocientas: 800,
  novecientos: 900,
  novecientas: 900,
  mil: 1e3
};
const DIGIT_WORDS = {
  cero: "0",
  uno: "1",
  un: "1",
  una: "1",
  dos: "2",
  tres: "3",
  cuatro: "4",
  cinco: "5",
  seis: "6",
  siete: "7",
  ocho: "8",
  nueve: "9"
};
const KNOWN_ZONES = [
  "hospitalet de llobregat",
  "l'hospitalet de llobregat",
  "hospitalet",
  "la torrassa",
  "torrassa",
  "torrasa",
  "florida",
  "la florida",
  "collblanc",
  "pubilla cases",
  "pobilla casas",
  "camp vidalet",
  "barcelona",
  "arc de triomf",
  "hospital cl\xEDnic",
  "hospital clinic",
  "ciutat vella",
  "eixample",
  "gr\xE0cia",
  "gracia",
  "sants",
  "badalona",
  "cornell\xE0",
  "cornella",
  "esplugues",
  "les corts",
  "poblenou",
  "sarri\xE0",
  "sarria",
  "valencia",
  "madrid"
];
const FLOOR_WORDS = {
  bajo: 0,
  "planta baja": 0,
  entresuelo: 0,
  primero: 1,
  primer: 1,
  "1er": 1,
  "1\xBA": 1,
  segundo: 2,
  "2\xBA": 2,
  "2do": 2,
  tercero: 3,
  tercer: 3,
  "3er": 3,
  "3\xBA": 3,
  cuarto: 4,
  "4\xBA": 4
};
const ZONE_ALIASES = {
  torrasa: "La Torrassa",
  torrassa: "La Torrassa",
  florida: "La Florida",
  "santa eulalia": "Santa Eulalia",
  "sant josep": "Sant Josep",
  "el prat": "El Prat de Llobregat",
  "el prat de llobregat": "El Prat de Llobregat",
  "pobilla casas": "Pubilla Cases",
  "pubilla cases": "Pubilla Cases",
  "camp vidalet": "Camp Vidalet",
  "hospital clinic": "Hospital Cl\xEDnic",
  "hospital cl\xEDnic": "Hospital Cl\xEDnic",
  "arc de triomf": "Arc de Triomf",
  "ciutat vella": "Ciutat Vella"
};
const ZONE_MENTION_PATTERNS = [
  { re: /\bsanta\s+eul[aà]lia\b/i, label: "Santa Eulalia" },
  { re: /\bsant\s+josep\b/i, label: "Sant Josep" },
  { re: /\btorrass?[ae]\b/i, label: "La Torrassa" },
  { re: /\bcoll\s*blanc\b/i, label: "Collblanc" },
  { re: /\bpubilla\b|\bpobilla\b/i, label: "Pubilla Cases" },
  { re: /\bcamp\s+vidalet\b/i, label: "Camp Vidalet" },
  { re: /\bla\s+florida\b/i, label: "La Florida" },
  { re: /\bhospitalet(?:\s+de\s+llobregat)?\b|\bl['']hospitalet\b/i, label: "Hospitalet de Llobregat" },
  { re: /\bel\s+prat(?:\s+de\s+llobregat)?\b/i, label: "El Prat de Llobregat" },
  { re: /\bsants\b/i, label: "Sants" },
  { re: /\bbadalona\b/i, label: "Badalona" },
  { re: /\bbarcelona\b/i, label: "Barcelona" },
  { re: /\bcornell[aà]\b/i, label: "Cornell\xE0" },
  { re: /\besplugues\b/i, label: "Esplugues" },
  { re: /\beixample\b/i, label: "Eixample" },
  { re: /\bgr[aà]cia\b/i, label: "Gr\xE0cia" },
  { re: /\bles\s+corts\b/i, label: "Les Corts" },
  { re: /\bpoblenou\b/i, label: "Poblenou" },
  { re: /\bsarri[aà]\b/i, label: "Sarri\xE0" },
  { re: /\b(?:arc\s+de\s+triomf)\b/i, label: "Arc de Triomf" },
  { re: /\bhospital\s+cl[ií]nic\b/i, label: "Hospital Cl\xEDnic" },
  { re: /\bciutat\s+vella\b/i, label: "Ciutat Vella" }
];
const HOSPITALET_BARRIOS = /* @__PURE__ */ new Set([
  "Santa Eulalia",
  "Sant Josep",
  "La Torrassa",
  "Collblanc",
  "Pubilla Cases",
  "Camp Vidalet",
  "La Florida"
]);
export function isCompradorAltaText(text) {
  const t = text.toLowerCase();
  if (/(?:nuevo\s+)+(?:comprador[a]?|contacto|cliente)|(?:nuevo|nueva|agrega|agregar|a[nñ]ade|a[nñ]adir|crea|crear|registra|alta|alta de)\s+(?:un\s+)?(?:nuevo\s+)?(?:comprador[a]?|contacto|cliente)/.test(
    t
  )) {
    return true;
  }
  return /^[,.\s]*(?:oh[,.\s]+)?[a-záéíóúñà-ÿ][a-záéíóúñà-ÿ'’\s-]{2,40}?\s*,?\s*(?:n[uú]mero(?:\s+de)?\s+tel[eé]fono|tel[eé]fono|m[oó]vil)/i.test(
    text.trim()
  );
}
function parseSpokenEuroAmount(text) {
  const lower = text.toLowerCase();
  const presIdx = lower.search(/presupuesto|hasta|m[aá]ximo|maximo|euros?|€/);
  const slice = presIdx >= 0 ? lower.slice(Math.max(0, presIdx - 40)) : lower;
  const tokens = slice.match(
    /([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,5})\s*(?:mil|euros?|€)/
  );
  if (!tokens?.[1]) return void 0;
  const words = tokens[1].replace(/\s+y\s+/g, " ").split(/\s+/).filter((w) => w && !/^(de|presupuesto|hasta|euros?|€|mil)$/.test(w));
  if (!words.length) return void 0;
  let total = 0;
  let current = 0;
  for (const w of words) {
    if (w === "mil") {
      current = current === 0 ? 1e3 : current * 1e3;
      total += current;
      current = 0;
      continue;
    }
    const n = SPANISH_NUMBER_WORDS[w];
    if (n === void 0) return void 0;
    if (n >= 100) {
      current = current === 0 ? n : current * n;
    } else {
      current += n;
    }
  }
  total += current;
  return total > 0 ? total : void 0;
}
export function parseEuroAmount(text) {
  const lower = text.toLowerCase();
  const phoneDigits = parseTelefonoFromText(text)?.replace(/\D/g, "");
  const kMatch = lower.match(/(\d{2,4})\s*k(?:\s*(?:€|euros?))?\b/);
  if (kMatch) {
    const n = Number(kMatch[1]) * 1e3;
    if (Number.isFinite(n) && n >= 2e4) return n;
  }
  for (const m of text.matchAll(/(\d{1,3}(?:\.\d{3})+|\d{5,9})\s*(?:€|euros?\b)/gi)) {
    const compact = m[1].replace(/\./g, "");
    const n = Number(compact);
    if (phoneDigits && compact.length >= 7 && phoneDigits.includes(compact)) continue;
    if (Number.isFinite(n) && n >= 2e4 && n <= 9e6) return n;
  }
  const dotted = text.match(/(\d{1,3}(?:\.\d{3})+|\d{4,7})\s*(?:€|euros?)?/i);
  if (dotted) {
    const compact = dotted[1].replace(/\./g, "");
    const looksLikePhoneChunk = phoneDigits && compact.length >= 7 && phoneDigits.includes(compact);
    if (!(compact.length === 9 && /^[67]/.test(compact)) && !looksLikePhoneChunk) {
      const n = Number(compact);
      if (Number.isFinite(n) && n >= 2e4 && n <= 9e6) return n;
    }
  }
  const spoken = parseSpokenEuroAmount(lower);
  if (spoken) return spoken;
  const milMatch = lower.match(/(\d[\d.]*)?\s*mil(?:\s+euros?)?/);
  if (milMatch) {
    const base = milMatch[1] ? parseFloat(milMatch[1].replace(/\./g, "")) : 1;
    if (Number.isFinite(base)) return Math.round(base * 1e3);
  }
  const presupuestoMatch = lower.match(
    /(?:presupuesto|hasta|m[aá]ximo|maximo)\s*(?:de\s*)?(\d[\d.\s]*)\s*(?:mil|euros?|€)?/
  );
  if (presupuestoMatch) {
    let raw = presupuestoMatch[1].replace(/\s/g, "").replace(/\./g, "");
    if (/mil/i.test(presupuestoMatch[0]) && raw.length <= 3) {
      return Number(raw) * 1e3;
    }
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n < 1e4 ? n * 1e3 : n;
  }
  const rangeMatch = text.match(
    /(\d{2,3}(?:\.\d{3})?|\d{5,7})\s*(?:€|euros?)?\s*[-–—]\s*(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*(?:€|euros?)?/i
  );
  if (rangeMatch) {
    const a = Number(rangeMatch[1].replace(/\./g, ""));
    const b = Number(rangeMatch[2].replace(/\./g, ""));
    const hi = Math.max(a, b);
    if (Number.isFinite(hi) && hi >= 2e4 && hi <= 9e6) return hi;
  }
  const maxGasto = lower.match(
    /(\d{1,3}(?:\.\d{3})+|\d{5,7})\s*(?:€|euros?).{0,40}(?:maximo|m[aá]ximo)\s+que\s+puedo/i
  );
  if (maxGasto) {
    const n = Number(maxGasto[1].replace(/\./g, ""));
    if (Number.isFinite(n) && n >= 2e4) return n;
  }
  const bare = lower.match(/\b(\d{5,7})\b/);
  if (bare) return Number(bare[1]);
  return void 0;
}
function spokenDigitsToPhone(text) {
  const lower = text.toLowerCase();
  const telIdx = lower.search(/tel[eé]fono|m[oó]vil|n[uú]mero/);
  const slice = telIdx >= 0 ? lower.slice(telIdx) : lower;
  const digitRun = slice.match(
    /(?:tel[eé]fono|m[oó]vil|n[uú]mero)?\s*((?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)){8,})/
  );
  if (!digitRun?.[1]) return void 0;
  const digits = digitRun[1].split(/\s+/).map((w) => DIGIT_WORDS[w]).join("");
  if (digits.length >= 9) return digits.slice(-9);
  return void 0;
}
export function parseTelefonoFromText(text) {
  const spoken = spokenDigitsToPhone(text);
  if (spoken) return spoken;
  const digitByDigit = text.match(
    /(?:tel[eé]fono|n[uú]mero(?:\s+de\s+tel[eé]fono)?)?[\s,:]*((?:\d[\s,]+){8,}\d)/
  );
  if (digitByDigit) {
    const digits = digitByDigit[1].replace(/\D/g, "");
    if (digits.length >= 9) return digits.slice(-9);
  }
  const plus = text.match(/\+34[\s.-]?\d[\d\s.-]{8,}/);
  if (plus) return plus[0].replace(/[\s.-]/g, "");
  const grouped = text.match(/\b([6789](?:[\s.-]?\d){8})\b/);
  if (grouped) return grouped[1].replace(/[\s.-]/g, "");
  const spaced = text.match(/\b(\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})\b/);
  if (spaced) return spaced[1].replace(/[\s.-]/g, "");
  const nine = text.match(/\b([6789]\d{8})\b/);
  if (nine) return nine[1];
  return void 0;
}
export function isPhoneOnlyReply(text) {
  const t = text.trim();
  if (!parseTelefonoFromText(t)) return false;
  const rest = t.replace(/\+34/gi, "").replace(/[\d\s+\-().]/g, "").replace(/tel[eé]fonos?|m[oó]viles?|n[uú]meros?|es|el|del|toma|vale|ok|vale/gi, "").replace(/[¿?¡!,.:;«»"']/g, "").trim();
  return rest.length <= 6;
}
function wordToRooms(word) {
  if (/^\d+$/.test(word)) return Number(word);
  return SPANISH_NUMBER_WORDS[word.toLowerCase()];
}
export function parseHabitaciones(text) {
  const lower = text.toLowerCase();
  const buscanMatch = lower.match(
    /(?:que\s+)?busquen?\s+(?:(\d+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+)?(?:habitaciones?|dormitorios?|hab\.?|pisos?)/
  );
  if (buscanMatch?.[1]) {
    const n = wordToRooms(buscanMatch[1]);
    if (n !== void 0) return n;
  }
  const clientesDe = lower.match(
    /clientes?\s+(?:que\s+)?(?:buscan?|de)\s+(?:(\d+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+)?(?:habitaciones?|dormitorios?|hab\.?)/
  );
  if (clientesDe?.[1]) {
    const n = wordToRooms(clientesDe[1]);
    if (n !== void 0) return n;
  }
  const minMatch = lower.match(
    /(cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+(?:habitaciones?|dormitorios?|hab\.?)\s+m[ií]nimas?/
  );
  if (minMatch?.[1]) {
    const n = wordToRooms(minMatch[1]);
    if (n !== void 0) return n;
  }
  const oMasMatch = lower.match(/(\d+)\s*o\s*m[aá]s/);
  if (oMasMatch) return Number(oMasMatch[1]);
  const rangeHab = lower.match(/(\d)\s*a\s*\d+\s*(?:habitaciones?|dormitorios?|hab\.?)/);
  if (rangeHab) return Number(rangeHab[1]);
  const siPosible = lower.match(/(?:si\s+es\s+posible|preferible)\s*,?\s*(\d+)\s*(?:habitaciones?|dormitorios?)/);
  if (siPosible) return Number(siPosible[1]);
  const numMatch = lower.match(/(\d)\s*(?:habitaciones?|dormitorios?|hab\.?)/);
  if (numMatch) return Number(numMatch[1]);
  const deMatch = lower.match(
    /(?:de|con)\s+(cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+(?:habitaciones?|dormitorios?|hab\.?)/
  );
  if (deMatch) {
    const n = wordToRooms(deMatch[1]);
    if (n !== void 0) return n;
  }
  for (const [word, n] of Object.entries(SPANISH_NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\s+(?:habitaciones?|dormitorios?)`).test(lower)) {
      return n;
    }
  }
  return void 0;
}
function titleCaseZona(z) {
  return z.trim().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ").replace(/Llobregat/i, "Llobregat").replace(/L'hospitalet/i, "L'Hospitalet");
}
function normalizeZoneToken(z) {
  const trimmed = z.trim().replace(/^(?:mas\s+que\s+todo|tambien|también|y\s+tambien|y\s+también|por|de|en|la|el|las|los|del|d')\s+/i, "").trim();
  const key = trimmed.toLowerCase();
  if (ZONE_ALIASES[key]) return ZONE_ALIASES[key];
  return titleCaseZona(trimmed);
}
function splitZoneList(raw) {
  const cleaned = raw.replace(/\.\s*$/, "").replace(/\b(?:mas\s+que\s+todo|tambien|también|y\s+tambien|y\s+también)\b/gi, ", ").replace(/\s+\bpor\b\s+/gi, ", ").trim();
  const parts = cleaned.split(/\s*,\s*|\s+y\s+|\s+,\s+y\s+/i);
  const out = [];
  for (const part of parts) {
    const z = normalizeZoneToken(part);
    if (z.length < 2) continue;
    if (/^(de|en|la|el|las|los|por|tambien|también|mas|que|todo)$/i.test(z)) continue;
    if (!out.some((x) => x.toLowerCase() === z.toLowerCase())) out.push(z);
  }
  return out;
}
function collectMentionedZones(text) {
  const found = [];
  for (const { re, label } of ZONE_MENTION_PATTERNS) {
    const m = re.exec(text);
    if (m == null) continue;
    if (found.some((f) => f.label.toLowerCase() === label.toLowerCase())) continue;
    found.push({ label, idx: m.index ?? 0 });
  }
  found.sort((a, b) => a.idx - b.idx);
  return found.map((f) => f.label);
}
function formatCollectedZones(labels) {
  if (!labels.length) return void 0;
  const parts = [];
  const hasHospitalet = labels.includes("Hospitalet de Llobregat") || labels.some((l) => HOSPITALET_BARRIOS.has(l));
  if (hasHospitalet) {
    parts.push("Hospitalet de Llobregat");
    for (const b of labels) {
      if (HOSPITALET_BARRIOS.has(b)) parts.push(b);
    }
  }
  for (const label of labels) {
    if (label === "Hospitalet de Llobregat") continue;
    if (HOSPITALET_BARRIOS.has(label)) continue;
    if (!parts.some((p) => p.toLowerCase() === label.toLowerCase())) parts.push(label);
  }
  return parts.length ? parts.join(", ") : void 0;
}
function looksLikeMultiZoneReply(text) {
  return /,|\b(?:y|también|tambien|mas\s+que\s+todo)\b/i.test(text);
}
function extractBuscoPorZoneList(text) {
  const m = text.match(
    /\bbusco\b(?:\s+por)?\s+(.+?)(?=\d+\s+hab|\bhabitacion|\bpresupuesto|\bminimo\s+\d|\bm2\b|\bm²\b|\bhasta\s+\d|\bmetros\b|$)/i
  );
  if (!m?.[1]) return [];
  return splitZoneList(m[1]);
}
function detectMunicipio(text) {
  const lower = text.toLowerCase();
  if (/hospitalet(?:\s+de\s+llobregat)?|l'hospitalet/.test(lower)) return "Hospitalet de Llobregat";
  if (/\bbarcelona\b/.test(lower)) return "Barcelona";
  if (/\bbadalona\b/.test(lower)) return "Badalona";
  if (/cornell[aà]/.test(lower)) return "Cornell\xE0";
  if (/esplugues/.test(lower)) return "Esplugues";
  return void 0;
}
const MUNICIPIO_ZONE_LABELS = [
  [/hospitalet(?:\s+de\s+llobregat)?|l'hospitalet/i, "Hospitalet de Llobregat"],
  [/cornell[aà](?:\s+de\s+llobregat)?/i, "Cornell\xE0 de Llobregat"],
  [/badalona/i, "Badalona"],
  [/sant\s+boi(?:\s+de\s+llobregat)?/i, "Sant Boi de Llobregat"],
  [/esplugues(?:\s+de\s+llobregat)?/i, "Esplugues de Llobregat"],
  [/sant\s+feliu(?:\s+de\s+llobregat)?/i, "Sant Feliu de Llobregat"],
  [/\bbarcelona\b/i, "Barcelona"]
];
function parseMultiMunicipioZona(text) {
  const found = [];
  for (const [re, label] of MUNICIPIO_ZONE_LABELS) {
    if (re.test(text) && !found.includes(label)) found.push(label);
  }
  return found.length >= 2 ? found.join(", ") : found.length === 1 ? found[0] : void 0;
}
const ZONA_PALABRAS_VAGAS = /* @__PURE__ */ new Set([
  "la",
  "las",
  "el",
  "els",
  "les",
  "de",
  "del",
  "l",
  "los",
  "d",
  "en",
  "a",
  "al",
  "zonas",
  "zona",
  "barrios",
  "barrio",
  "sitio",
  "sitios",
  "lugar",
  "lugares"
]);
const ZONA_FRASES_VAGAS = /^(las?\s+zonas?|cualquiera|cualquier|cualquira|donde\s+sea|me\s+es\s+indiferente|me\s+da\s+igual|no\s+me\s+importa|no\s+importa|en\s+general|todas\s+las\s+zonas|cuant[oa]\s+a\s+las\s+zonas|sin\s+restricci[oó]n|zonas?\s+en\s+general|abierto\s+a\s+zonas?)/i;
const ZONA_RUIDO = /(numero|telefono|precio|presupuesto|habitacion|habitaciones|\bm2\b|metros?|euros?|eur\b|\d{3,})/i;
const ZONA_EXCEPCIONES_DIRECCION = /^(paseo|passeig|passatge)\s+de\s+gr[ac]cia$/i;
const DIRECCION_PREFIJO = /^(calle|c\/|c\.|carrer|avinguda|avda\.?|av\.|paseo|passeig|plaza|pla[çc]a|carretera|via|diagonal|gran\s+via|travessera|passatge|mol[ií]|pol[ií]gono|pol[ií]gons?|ronda|traves[íi]a|boulevard|alameda|parque|residencial|urbanizaci[oó]n|edificio|bloque|manzana|camino|sendero|finca|naves?|nau)\b/i;
const DIRECCION_FINAL_NUMERO = /\d{1,4}\s*,\s*\d{1,4}\s*$/;
const DIRECCION_RANGO = /\b\d{1,3}\s*[-–]\s*\d{1,3}\b/;
const DIRECCION_PUERTO = /^(n[ºo]\.?|num\.?|piso|planta|puerta|bajo|entrepiso|local|despacho)\s*\d+/i;
export function esDireccionPostular(z) {
  const s = (z ?? "").trim().replace(/\s+/g, " ");
  if (!s) return false;
  if (ZONA_EXCEPCIONES_DIRECCION.test(s)) return false;
  if (DIRECCION_PREFIJO.test(s)) return true;
  if (DIRECCION_FINAL_NUMERO.test(s)) return true;
  if (DIRECCION_RANGO.test(s)) return true;
  if (DIRECCION_PUERTO.test(s)) return true;
  return false;
}
function esZonaDireccionPostalInline(z) {
  const s = (z ?? "").trim().replace(/\s+/g, " ");
  if (!s) return false;
  if (/^(paseo|passeig|passatge)\s+de\s+gr[ac]cia$/i.test(s)) return false;
  if (/^(calle|c\/|c\.|carrer|avinguda|avda\.?|av\.|paseo|passeig|plaza|pla[çc]a|carretera|via|diagonal|gran\s+via|travessera|passatge|mol[ií]|pol[ií]gono|pol[ií]gons?|ronda|traves[íi]a|boulevard|alameda|parque|residencial|urbanizaci[oó]n|edificio|bloque|manzana|camino|sendero|finca|naves?|nau)\b/i.test(s))
    return true;
  if (/\d{1,4}\s*,\s*\d{1,4}\s*$/.test(s)) return true;
  if (/\b\d{1,3}\s*[-–]\s*\d{1,3}\b/.test(s)) return true;
  if (/^(n[ºo]\.?|num\.?|piso|planta|puerta|bajo|entrepiso|local|despacho)\s*\d+/i.test(s)) return true;
  return false;
}
export function isSensibleZonaBuscada(zona) {
  const z = (zona ?? "").trim().replace(/\s+/g, " ");
  if (!z || z.length > 70) return false;
  if (ZONA_FRASES_VAGAS.test(z)) return false;
  if (ZONA_RUIDO.test(z)) return false;
  if (esZonaDireccionPostalInline(z)) return false;
  const words = z.split(/[\s,]+/).filter(Boolean);
  if (!words.length || words.length > 5) return false;
  const significativas = words.filter((w) => !ZONA_PALABRAS_VAGAS.has(w.toLowerCase()));
  if (!significativas.length) return false;
  const cap = significativas.filter((w) => /^[A-ZÀ-Þ][\p{L}'’.-]+$/u.test(w));
  return cap.length >= Math.ceil(significativas.length / 2);
}
export function zonaMencionadaEnTexto(zona, text) {
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const z = norm(zona ?? "");
  if (!z) return false;
  const palabras = new Set(norm(text).split(" "));
  const significativas = z.split(/[\s,]+/).filter((p) => p && !ZONA_PALABRAS_VAGAS.has(p));
  if (!significativas.length) return false;
  return significativas.some((p) => palabras.has(p));
}
export function parseZonasFromText(text) {
  const multi = parseMultiMunicipioZona(text);
  if (multi?.includes(",")) return multi;
  const mentioned = collectMentionedZones(text);
  if (mentioned.length >= 2) {
    return formatCollectedZones(mentioned);
  }
  if (mentioned.length === 1 && looksLikeMultiZoneReply(text)) {
    const fromBusco = extractBuscoPorZoneList(text);
    if (fromBusco.length >= 2) {
      const municipio2 = detectMunicipio(text);
      return municipio2 ? `${municipio2}, ${fromBusco.join(", ")}` : fromBusco.join(", ");
    }
  }
  const buscoList = extractBuscoPorZoneList(text);
  if (buscoList.length >= 2) {
    const municipio2 = detectMunicipio(text);
    return municipio2 ? `${municipio2}, ${buscoList.join(", ")}` : buscoList.join(", ");
  }
  if (mentioned.length === 1) {
    return formatCollectedZones(mentioned);
  }
  const municipio = detectMunicipio(text);
  const multiBarrios = text.match(
    /(?:en\s+)?(?:las?\s+)?zonas?\s+(?:de\s+|en\s+)([^.]+?)(?:\.|n[uú]mero|tel[eé]fono|precio|hasta|\d+\s+hab|$)/i
  );
  if (multiBarrios?.[1]) {
    const zones = splitZoneList(multiBarrios[1]);
    if (zones.length) {
      return municipio ? `${municipio}, ${zones.join(", ")}` : zones.join(", ");
    }
  }
  const enZonaDe = text.match(
    /(?:busca(?:r)?\s+(?:un\s+)?(?:piso|vivienda|casa)\s+)?en\s+(Barcelona|Hospitalet(?:\s+de\s+Llobregat)?|Badalona|Cornell[aà]|Esplugues)[^,.]*?(?:,\s*)?(?:en\s+)?(?:la\s+)?zona\s+(?:de\s+)?(.+?)(?:\.\s|precio|hasta|tel[eé]fono|n[uú]mero|\d+\s*hab|$)/i
  );
  if (enZonaDe?.[2]) {
    const city = titleCaseZona(enZonaDe[1].trim());
    const zones = splitZoneList(enZonaDe[2]);
    if (zones.length) return `${city}, ${zones.join(", ")}`;
    return city;
  }
  const zonaDeLista = text.match(
    /(?:la\s+)?zona\s*,?\s*(?:busca\s+)?zona\s+de\s+([^,]+?),\s*(?:en\s+)?(?:las?\s+)?zonas?\s+(?:de\s+)([^.]+)/i
  );
  if (zonaDeLista?.[1] && zonaDeLista?.[2]) {
    const city = normalizeZoneToken(zonaDeLista[1]);
    const zones = splitZoneList(zonaDeLista[2]);
    if (zones.length) return `${city}, ${zones.join(", ")}`;
  }
  return parseZonaSingleFromText(text);
}
function parseZonaSingleFromText(text) {
  const lower = text.toLowerCase();
  const notZone = /^(seguimiento|seguimientos|comprador|compradores|alarma|alarmas|lista|listado|teléfono|telefono|contactado|particular|particulares|(?:un[oa]?\s+)?(?:piso|vivienda|casa|inmueble))$/i;
  const compradoresEn = text.match(
    /(?:busca(?:r)?\s+)?compradores?\s+(?:en|de)\s+([A-Za-zÀ-ÿ'’\s-]{3,50}?)(?:,|\s+de\s+(?:cero|uno|un|una|dos|tres|\d+)\s+hab|\s+hasta|\s+con\s+|$)/i
  );
  if (compradoresEn?.[1]) {
    const z = compradoresEn[1].trim();
    if (z.length >= 3 && !notZone.test(z)) return titleCaseZona(z);
  }
  const buscaEn = text.match(
    /\bbusca(?:r|ndo|co)?\b(?:\s+piso|\s+vivienda|\s+casa|\s+inmueble)?\s*(?:en|por|zona)?\s+([A-Za-zÀ-ÿ'’\s-]{3,50}?)(?:,|\s+de\s+(?:cero|uno|un|una|dos|tres|\d+)\s+hab|\s+con\s+|\s+y\s+|$)/i
  );
  if (buscaEn?.[1]) {
    const zones = splitZoneList(buscaEn[1]);
    if (zones.length >= 2) {
      const municipio = detectMunicipio(text);
      return municipio ? `${municipio}, ${zones.join(", ")}` : zones.join(", ");
    }
    const z = zones[0] ?? buscaEn[1].trim();
    if (z.length >= 3 && !notZone.test(z)) return titleCaseZona(z);
  }
  const afterZona = text.match(
    /\b(?:zona|en|barrio|municipio)\b\s+([A-Za-zÀ-ÿ'’\s-]{3,50}?)(?:,|\s+de\s+(?:cero|uno|un|dos|tres|\d+)\s+hab|\s+con\s+|$)/i
  );
  if (afterZona?.[1]) {
    const rawZ = afterZona[1].trim();
    if (!notZone.test(rawZ) && !/^por\b/i.test(rawZ)) return titleCaseZona(rawZ);
  }
  const collected = collectMentionedZones(text);
  if (collected.length) return formatCollectedZones(collected);
  for (const c of KNOWN_ZONES) {
    if (lower.includes(c)) {
      if (c.includes("hospitalet")) {
        const barrios = [];
        if (/santa\s+eul[aà]lia/.test(lower)) barrios.push("Santa Eulalia");
        if (/sant\s+josep/.test(lower)) barrios.push("Sant Josep");
        if (/torrasa|torrassa/.test(lower)) barrios.push("La Torrassa");
        if (/\bflorida\b/.test(lower)) barrios.push("La Florida");
        if (/collblanc|coll blanc/.test(lower)) barrios.push("Collblanc");
        if (/pubilla|pobilla/.test(lower)) barrios.push("Pubilla Cases");
        if (/camp vidalet/.test(lower)) barrios.push("Camp Vidalet");
        if (barrios.length) return `Hospitalet de Llobregat, ${barrios.join(", ")}`;
        return "Hospitalet de Llobregat";
      }
      if (c.includes("torras")) return "Hospitalet de Llobregat, La Torrassa";
      if (c === "barcelona") {
        const barrios = [];
        if (/arc de triomf/.test(lower)) barrios.push("Arc de Triomf");
        if (/hospital cl[ií]nic/.test(lower)) barrios.push("Hospital Cl\xEDnic");
        if (/ciutat vella/.test(lower)) barrios.push("Ciutat Vella");
        if (barrios.length) return `Barcelona, ${barrios.join(", ")}`;
      }
      return normalizeZoneToken(c);
    }
  }
  return void 0;
}
export function parseZonaFromText(text) {
  return parseZonasFromText(text);
}
function parseFloorWord(word) {
  const w = word.toLowerCase().trim();
  if (FLOOR_WORDS[w] !== void 0) return FLOOR_WORDS[w];
  if (/^\d+$/.test(w)) return Number(w);
  return void 0;
}
export function parsePlantaMaxSinAscensor(text) {
  const lower = text.toLowerCase();
  if (/ascensor\s+indispensable|ascensor\s+obligatorio|necesita\s+ascensor/.test(lower)) return void 0;
  const patterns = [
    /m[aá]ximo\s+(?:el\s+|la\s+)?(bajo|entresuelo|primero|primer|1er|1º|segundo|2º|2do|tercero|3er|3º|\d+)/i,
    /(?:hasta|m[aá]x\.?)\s+(?:planta\s+)?(bajo|entresuelo|primero|primer|1er|segundo|2º|tercero|\d+)/i,
    /sin ascensor[^.]{0,50}?m[aá]ximo\s+(?:el\s+|la\s+)?(segundo|2º|primero|1er|bajo|\d+)/i,
    /m[aá]ximo\s+(segundo|2º|primero|1er|bajo|\d+)\s+sin ascensor/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const n = parseFloorWord(m[1]);
      if (n !== void 0) return n;
    }
  }
  return void 0;
}
export function parseAscensorIndispensable(text) {
  const lower = text.toLowerCase();
  if (/\bsin\s+ascensor\b|no\s+(?:hace falta|necesito)\s+ascensor|ascensor\s+no\b/.test(lower)) {
    return false;
  }
  if (/cota\s*cero|cota\s*0|sin\s+escalones|entra\s+en\s+el\s+ascensor|silla\s+de\s+ruedas|accesibilidad|pmr\b/.test(
    lower
  )) {
    return true;
  }
  if (/ascensor\s+indispensable|ascensor\s+obligatorio|con\s+ascensor\s+indispensable|necesita\s+ascensor|ascensor\s+si\s+o\s+si|\bcon\s+ascensor\b|\bascensor\s*(?:s[ií]|yes|ok|vale)\b|indispensable.{0,35}ascensor/.test(
    lower
  )) {
    return true;
  }
  if (/m[aá]ximo\s+\w+\s+sin ascensor|acepta\s+sin ascensor|m[aá]ximo\s+(?:segundo|2|primero|1|bajo)\s+sin/.test(lower)) {
    return false;
  }
  return void 0;
}
function formatPlantaLabel(n) {
  if (n === 0) return "bajo/entresuelo";
  if (n === 1) return "1\xAA";
  if (n === 2) return "2\xAA";
  if (n === 3) return "3\xAA";
  return `${n}\xAA`;
}
export function parseBalconTerrazaIndispensable(text) {
  const lower = text.toLowerCase();
  if (/\bsin\s+(?:balc[oó]n|terraza)\b|no\s+(?:necesito|hace falta)\s+(?:balc[oó]n|terraza)/.test(lower)) {
    return false;
  }
  if (/balc[oó]n\s*(?:\/|o\s+)?terraza\s+indispensable|terraza\s+indispensable|balc[oó]n\s+indispensable|balc[oó]n\s+obligatorio/.test(
    lower
  )) {
    return true;
  }
  if (/(?:con|que tenga|necesita|un)\s+(?:peque[nñ]o\s+)?(?:balc[oó]n|terraza)|piso\s+con\s+balc[oó]n|piso\s+con\s+terraza|\bbalc[oó]n\b|\bterraza\b/.test(
    lower
  )) {
    return true;
  }
  return void 0;
}
export function parsePlantaAltaPreferencia(text) {
  const lower = text.toLowerCase();
  return /planta\s+alta|piso\s+alto|(?:no|nunca)\s+(?:en\s+)?(?:un\s+)?bajo|no\s+bajo|(?:^|[\s,.])ático|ultima\s+planta|última\s+planta|planta\s+intermedia,\s*alta/.test(
    lower
  ) && !/planta\s+baja/.test(lower);
}
export function parseM2Minimos(text) {
  const patterns = [
    /(?:m[ií]nimo|m[ií]n\.?|al menos|desde)\s*(?:de\s*)?(\d{2,4})\s*(?:m²|m2|metros?(?:\s+cuadrados?)?)/i,
    /(\d{2,4})\s*(?:m²|m2|metros?(?:\s+cuadrados?)?)\s*(?:m[ií]nimo|m[ií]n\.?|como m[ií]nimo)/i,
    /(?:de|con)\s+(\d{2,4})\s*(?:m²|m2)\s*(?:como m[ií]nimo|m[ií]nimo)?/i,
    /(\d{2,3})\s*(?:m²|m2|metros?(?:\s+cuadrados?)?)/i
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n >= 20 && n <= 500) return n;
    }
  }
  return void 0;
}
function wordToBanos(word) {
  if (/^\d+$/.test(word)) return Number(word);
  return SPANISH_NUMBER_WORDS[word.toLowerCase()];
}
export function parseBanosMin(text) {
  const lower = text.toLowerCase();
  if (/3\s*\+?\s*ba[nñ]os?|tres\s+ba[nñ]os?\s*(?:o\s+m[aá]s|m[ií]n)/.test(lower)) return 3;
  const minMatch = lower.match(
    /(uno|un|una|dos|tres|cuatro|\d+)\s+ba[nñ]os?\s+m[ií]nimos?/
  );
  if (minMatch?.[1]) {
    const n = wordToBanos(minMatch[1]);
    if (n != null && n >= 1 && n <= 5) return n;
  }
  const deMatch = lower.match(
    /(?:m[ií]nimo|al menos|con)\s+(?:de\s+)?(uno|un|una|dos|tres|cuatro|\d+)\s+ba[nñ]os?/
  );
  if (deMatch?.[1]) {
    const n = wordToBanos(deMatch[1]);
    if (n != null && n >= 1 && n <= 5) return n;
  }
  const plain = lower.match(/(?:con|de)\s+(dos|tres|cuatro|\d+)\s+ba[nñ]os?/);
  if (plain?.[1]) {
    const n = wordToBanos(plain[1]);
    if (n != null && n >= 2 && n <= 5) return n;
  }
  const any = lower.match(/\b(uno|un|una|dos|tres|cuatro|\d)\s*ba[nñ]os?\b/);
  if (any?.[1]) {
    const n = wordToBanos(any[1]);
    if (n != null && n >= 1 && n <= 5) return n;
  }
  return void 0;
}
export function parseExteriorIndispensable(text) {
  const lower = text.toLowerCase();
  if (/me da igual|indiferente|interior (?:tambi[eé]n )?vale|podr[ií]a ser interior|interior a patio/.test(
    lower
  )) {
    return false;
  }
  if (/exterior\s+indispensable|que sea exterior|solo exterior|tiene que ser exterior|indispensable\s+exterior/.test(
    lower
  )) {
    return true;
  }
  if (/(?:que\s+)?d[eé]\s+(?:el\s+)?sol|solead|mucha\s+luz|luminos|orientaci[oó]n\s+sur/.test(lower)) {
    return true;
  }
  if (/\bexterior\b/.test(lower) && !/\binterior\b/.test(lower)) return true;
  if (/\binterior\b/.test(lower) && !/\bexterior\b/.test(lower)) return false;
  if (/\bexterior\b/.test(lower) && /indispensable|obligatorio|necesita|solo|tiene que/.test(lower)) {
    return true;
  }
  return void 0;
}
export function parseTipoInmueble(text) {
  const lower = text.toLowerCase();
  if (/\b[aá]tico\b/.test(lower)) return "atico";
  if (/\bd[uú]plex\b/.test(lower)) return "duplex";
  if (/\bnave\b/.test(lower)) return "nave";
  if (/\bterreno\b|\bsolar\b/.test(lower)) return "terreno";
  if (/\blocal\b/.test(lower)) return "local";
  if (/\bcasa\b|\bchalet\b|\bunifamiliar\b/.test(lower)) return "casa";
  if (/\bpiso\b|\bapartamento\b|\bvivienda\b/.test(lower)) return "piso";
  return void 0;
}
export function parseCuestionarioStructuredReply(text) {
  const out = {};
  const lines = text.split(/\n+/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const kv = line.match(/^\s*[-•*]?\s*([^:]{2,40}):\s*(.+)$/i);
    if (kv) {
      const key = kv[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const val = kv[2].trim();
      if (/zona|barrio|ubicacion/.test(key)) out.zona_buscada = val.replace(/\.$/, "");
      else if (/habitacion|dormitorio/.test(key)) {
        const h = parseHabitaciones(val);
        if (h != null) out.habitaciones_min = h;
      } else if (/ba[nñ]o/.test(key)) {
        const b = parseBanosMin(val);
        if (b != null) out.banos_min = b;
      } else if (/presupuesto|precio|budget/.test(key)) {
        const p = parseEuroAmount(val);
        if (p != null) out.presupuesto_max = p;
      } else if (/metro|m2|m²/.test(key)) {
        const m = parseM2Minimos(val);
        if (m != null) out.m2_minimos = m;
      } else if (/ascensor/.test(key)) {
        if (/^(si|sí|yes|con|obligatorio|indispensable)/i.test(val)) out.ascensor_indispensable = true;
        else if (/^(no|sin)/i.test(val)) out.ascensor_indispensable = false;
      } else if (/balc[oó]n|terraza/.test(key)) {
        if (/^(si|sí|yes|con)/i.test(val)) out.balcon_terraza_indispensable = true;
        else if (/^(no|sin)/i.test(val)) out.balcon_terraza_indispensable = false;
      } else if (/exterior|orientacion|orientaci[oó]n/.test(key)) {
        const ext = parseExteriorIndispensable(val);
        if (ext != null) out.exterior_indispensable = ext;
      }
      continue;
    }
    if (/^con ascensor\s+(si|sí)\.?$/i.test(line)) out.ascensor_indispensable = true;
    if (/^sin ascensor/i.test(line)) out.ascensor_indispensable = false;
  }
  if (!out.zona_buscada) {
    const z = parseZonasFromText(text);
    if (z) out.zona_buscada = z;
  }
  if (out.presupuesto_max == null) {
    const p = parseEuroAmount(text);
    if (p != null) out.presupuesto_max = p;
  }
  if (out.habitaciones_min == null) {
    const h = parseHabitaciones(text);
    if (h != null) out.habitaciones_min = h;
  }
  for (const seg of text.split(/\s*[•·|]\s*/)) {
    const s = seg.trim();
    if (!s) continue;
    const sl = s.toLowerCase();
    if (/^\d+\s*(?:m²|m2|metros)/i.test(s) || /m²\s*útil/i.test(sl)) {
      const m = parseM2Minimos(s);
      if (m != null) out.m2_minimos = m;
    }
    if (/habitacion|dormitorio/i.test(sl)) {
      const h = parseHabitaciones(s);
      if (h != null) out.habitaciones_min = h;
    }
    if (/ascensor/i.test(sl) && !/sin\s+ascensor/.test(sl)) out.ascensor_indispensable = true;
    if (/balc[oó]n|terraza/i.test(sl)) out.balcon_terraza_indispensable = true;
    if (/ba[nñ]o/i.test(sl)) {
      const b = parseBanosMin(s);
      if (b != null) out.banos_min = b;
    }
    if (/exterior|interior|patio\s+de\s+manzana/i.test(sl)) {
      const ext = parseExteriorIndispensable(s);
      if (ext != null) out.exterior_indispensable = ext;
    }
    if (/precio\s*:/i.test(sl)) {
      const p = parseEuroAmount(s);
      if (p != null) out.presupuesto_max = p;
    }
  }
  return out;
}
function parsePresupuestoRango(text) {
  const re = /(?:entre|de)\s*([\d][\d.]{2,12})\s*(?:€|euros?)?\s*(?:y|a|hasta)\s*([\d][\d.]{2,12})\s*(?:€|euros?)?/gi;
  let mejor;
  for (const m of text.matchAll(re)) {
    const a = parseEuroAmount(m[1]);
    const b = parseEuroAmount(m[2]);
    if (a == null || b == null) continue;
    if (a < 2e4 || a > 9e6 || b < 2e4 || b > 9e6) continue;
    const max = Math.max(a, b);
    if (max > (mejor ?? 0)) mejor = max;
  }
  return mejor;
}
export function parseWhatsappCompradorPatch(text) {
  const structured = parseCuestionarioStructuredReply(text);
  const extras = parseCompradorCriteriosExtras(text);
  const patch = {};
  const labels = [];
  const extraBits = [];
  const zonaCandidata = structured.zona_buscada ?? parseZonasFromText(text);
  const zona = zonaCandidata && isSensibleZonaBuscada(zonaCandidata) && zonaMencionadaEnTexto(zonaCandidata, text) ? zonaCandidata : void 0;
  if (zona) {
    patch.zona_buscada = zona;
    labels.push(`zona ${zona}`);
  }
  const presupuesto = structured.presupuesto_max ?? parsePresupuestoRango(text) ?? parseEuroAmount(text);
  if (presupuesto != null) {
    patch.presupuesto_max = presupuesto;
    labels.push(`${presupuesto.toLocaleString("es-ES")} \u20AC`);
  }
  const hab = structured.habitaciones_min ?? parseHabitaciones(text);
  if (hab != null) {
    patch.habitaciones_min = hab;
    labels.push(`${hab} hab`);
  }
  if (structured.banos_min != null) {
    patch.banos_min = structured.banos_min;
    labels.push(`${structured.banos_min} ba\xF1os`);
  } else if (extras.banos_min != null) {
    patch.banos_min = extras.banos_min;
    labels.push(`${extras.banos_min} ba\xF1os`);
  }
  const m2 = structured.m2_minimos ?? extras.m2_minimos ?? parseM2Minimos(text);
  if (m2 != null) {
    patch.m2_minimos = m2;
    labels.push(`${m2} m\xB2`);
  }
  const asc = structured.ascensor_indispensable ?? extras.ascensor_indispensable ?? parseAscensorIndispensable(text);
  if (asc != null) {
    patch.ascensor_indispensable = asc;
    labels.push(asc ? "ascensor" : "sin ascensor");
    if (asc && extras.planta_max_sin_ascensor != null) {
      patch.planta_max_sin_ascensor = null;
    }
  }
  if (extras.planta_max_sin_ascensor != null && patch.ascensor_indispensable !== true) {
    patch.planta_max_sin_ascensor = extras.planta_max_sin_ascensor;
  }
  const balcon = structured.balcon_terraza_indispensable ?? extras.balcon_terraza_indispensable ?? parseBalconTerrazaIndispensable(text);
  if (balcon != null) {
    patch.balcon_terraza_indispensable = balcon;
    labels.push(balcon ? "balc\xF3n/terraza" : "sin balc\xF3n");
  }
  const ext = structured.exterior_indispensable ?? extras.exterior_indispensable ?? parseExteriorIndispensable(text);
  if (ext != null) {
    patch.exterior_indispensable = ext;
    labels.push(ext ? "exterior/luz" : "acepta interior");
  }
  const tipo = parseTipoInmueble(text);
  if (tipo) {
    patch.tipo_inmueble = tipo;
    labels.push(`tipo ${tipo}`);
  }
  if (parsePlantaAltaPreferencia(text)) extraBits.push("planta alta (no bajo)");
  if (extras.garaje) extraBits.push("garaje");
  if (extras.parking) extraBits.push("parking");
  if (extras.mascotas) extraBits.push("mascotas");
  extraBits.push(...extras.otros);
  return { patch, labels, extras: extraBits.filter(Boolean) };
}
export function parsePartnerBuyerHint(text) {
  const t = text.replace(/\s+/g, " ");
  const m = t.match(/pareja\s+de\s+([A-ZÁÉÍÓÚÑ][\p{L}'’-]{2,24})/iu) ?? t.match(/socio\s+de\s+([A-ZÁÉÍÓÚÑ][\p{L}'’-]{2,24})/iu) ?? t.match(/perfil\s+compartido(?:\s+(?:con|de))?\s+([A-ZÁÉÍÓÚÑ][\p{L}'’-]{2,24})/iu);
  return m?.[1]?.trim() ?? null;
}
const GEMINI_PATCH_SCHEMA = `Devuelve SOLO JSON (sin markdown) con campos opcionales:
zona_buscada (string), presupuesto_max (number euros), habitaciones_min, banos_min, m2_minimos,
ascensor_indispensable (boolean), balcon_terraza_indispensable (boolean), exterior_indispensable (boolean),
tipo_inmueble (piso|atico|duplex|local|casa), notas_extras (string[]).
Extrae TODO lo que el cliente diga en castellano o catal\xE1n. Si no hay dato, omite la clave.`;
export async function mergeWhatsappCompradorPatchWithGemini(text, base) {
  if (!alfredoBuyerWaLlmEnabled() || text.trim().length < 12) return base;
  const baseKeys = Object.keys(base).length;
  if (baseKeys >= 6) return base;
  const llm = await geminiChatPlain({
    system: GEMINI_PATCH_SCHEMA,
    user: `Mensaje del comprador:
${text.slice(0, 4e3)}`,
    maxTokens: 700,
    temperature: 0.15
  });
  if (!llm) return base;
  let parsed;
  try {
    const raw = llm.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
    parsed = JSON.parse(raw);
  } catch {
    return base;
  }
  const out = { ...base };
  if (typeof parsed.zona_buscada === "string" && parsed.zona_buscada.trim()) {
    const zonaGemini = parsed.zona_buscada.trim();
    if (isSensibleZonaBuscada(zonaGemini) && zonaMencionadaEnTexto(zonaGemini, text)) {
      out.zona_buscada = zonaGemini;
    }
  }
  if (typeof parsed.presupuesto_max === "number" && parsed.presupuesto_max > 1e4) {
    out.presupuesto_max = Math.round(parsed.presupuesto_max);
  }
  if (typeof parsed.habitaciones_min === "number") out.habitaciones_min = parsed.habitaciones_min;
  if (typeof parsed.banos_min === "number") out.banos_min = parsed.banos_min;
  if (typeof parsed.m2_minimos === "number") out.m2_minimos = parsed.m2_minimos;
  if (typeof parsed.ascensor_indispensable === "boolean") {
    out.ascensor_indispensable = parsed.ascensor_indispensable;
  }
  if (typeof parsed.balcon_terraza_indispensable === "boolean") {
    out.balcon_terraza_indispensable = parsed.balcon_terraza_indispensable;
  }
  if (typeof parsed.exterior_indispensable === "boolean") {
    out.exterior_indispensable = parsed.exterior_indispensable;
  }
  if (typeof parsed.tipo_inmueble === "string") out.tipo_inmueble = parsed.tipo_inmueble;
  return out;
}
export function mergeZonaBuscada(existing, incoming) {
  const esDireccion = (z) => {
    const s = z.trim().replace(/\s+/g, " ");
    if (!s) return false;
    if (/^(paseo|passeig|passatge)\s+de\s+gr[ac]cia$/i.test(s)) return false;
    if (/^(calle|c\/|c\.|carrer|avinguda|avda\.?|av\.|paseo|passeig|plaza|pla[çc]a|carretera|via|diagonal|gran\s+via|travessera|passatge|mol[ií]|pol[ií]gono|pol[ií]gons?|ronda|traves[íi]a|boulevard|alameda|parque|residencial|urbanizaci[oó]n|edificio|bloque|manzana|camino|sendero|finca|naves?|nau)\b/i.test(s))
      return true;
    if (/\d{1,4}\s*,\s*\d{1,4}\s*$/.test(s)) return true;
    if (/\b\d{1,3}\s*[-–]\s*\d{1,3}\b/.test(s)) return true;
    if (/^(n[ºo]\.?|num\.?|piso|planta|puerta|bajo|entrepiso|local|despacho)\s*\d+/i.test(s)) return true;
    return false;
  };
  const base = esDireccion(existing ?? "") ? "" : existing ?? "";
  if (!base.trim()) return incoming;
  const parts = [...base.split(/,\s*/), ...incoming.split(/,\s*/)].map((p) => p.trim()).filter(Boolean).filter((p) => !esDireccion(p));
  const unique = [];
  for (const p of parts) {
    if (!unique.some((u) => u.toLowerCase() === p.toLowerCase())) unique.push(p);
  }
  return unique.join(", ");
}
export function parseCompradorCriteriosExtras(text) {
  const lower = text.toLowerCase();
  const ascensor_indispensable = parseAscensorIndispensable(text);
  const planta_max_sin_ascensor = ascensor_indispensable === false ? parsePlantaMaxSinAscensor(text) : void 0;
  const extras = {
    ascensor_indispensable,
    planta_max_sin_ascensor,
    balcon_terraza_indispensable: parseBalconTerrazaIndispensable(text),
    m2_minimos: parseM2Minimos(text),
    banos_min: parseBanosMin(text),
    exterior_indispensable: parseExteriorIndispensable(text),
    garaje: /\bgaraje\b|\bplaza de garaje\b/.test(lower),
    parking: /\bparking\b|\baparcamiento\b/.test(lower),
    mascotas: /\bmascotas?\b|\bacepta\s+mascotas?\b/.test(lower),
    reformado: /\breformad[oa]\b|\ba reformar\b/.test(lower),
    amueblado: /\bamueblad[oa]\b|\bsin amueblar\b/.test(lower),
    trastero: /\btrastero\b/.test(lower),
    piscina: /\bpiscina\b/.test(lower),
    otros: []
  };
  const notasMatch = text.match(/(?:nota[s]?|observaciones?)[:\s]+(.+)$/i);
  if (notasMatch?.[1]?.trim()) extras.otros.push(notasMatch[1].trim());
  return extras;
}
export function buildCompradorNotas(extras) {
  const lines = ["Importado por Alfredo (Telegram)"];
  const criterios = [];
  if (extras.ascensor_indispensable === true) criterios.push("Ascensor indispensable");
  else if (extras.ascensor_indispensable === false) {
    if (extras.planta_max_sin_ascensor != null) {
      criterios.push(`Sin ascensor: acepta hasta ${formatPlantaLabel(extras.planta_max_sin_ascensor)} planta`);
    } else {
      criterios.push("Sin ascensor");
    }
  }
  if (extras.balcon_terraza_indispensable) criterios.push("Balc\xF3n/terraza indispensable");
  if (extras.m2_minimos) criterios.push(`${extras.m2_minimos} m\xB2 m\xEDnimos`);
  if (extras.banos_min) criterios.push(`${extras.banos_min}+ ba\xF1os`);
  if (extras.exterior_indispensable) criterios.push("Exterior indispensable");
  if (extras.garaje) criterios.push("Garaje");
  if (extras.parking) criterios.push("Parking");
  if (extras.mascotas) criterios.push("Mascotas");
  if (extras.reformado) criterios.push("Reformado");
  if (extras.amueblado) criterios.push("Amueblado");
  if (extras.trastero) criterios.push("Trastero");
  if (extras.piscina) criterios.push("Piscina");
  if (criterios.length) lines.push(`Criterios: ${criterios.join(" \xB7 ")}`);
  if (extras.otros.length) lines.push(extras.otros.join(". "));
  return lines.join("\n");
}
export function parsePresupuestoMax(text) {
  return parseEuroAmount(text);
}
export function parseCompradorSearchFilters(text) {
  return {
    rooms: parseHabitaciones(text),
    zone: parseZonasFromText(text),
    budgetMax: parseEuroAmount(text)
  };
}
const WA_NAME_STOP = /^(las|los|un|una|el|la|le|les|lo|whatsapp|wasap|wassap|mensaje|ella|ellos|ambas|ambos|dos|tambien|también|que|quiero|envie|envía|envia|saber|para|piso|busca)$/i;
export function parseWaTargetNames(text) {
  const raw = text.trim();
  const names = [];
  const patterns = [
    /(?:env[ií]a(?:le|les)?|m[aá]ndale|d[eé]jale|escr[ií]bele)\s+(?:un\s+)?(?:whats?app|wasap|mensaje)\s+a\s+([A-Za-zÀ-ÿ'’-]{3,})/gi,
    /(?:whats?app|wasap)\s+a\s+([A-Za-zÀ-ÿ'’-]{3,})/gi,
    /\ba\s+([A-Za-zÀ-ÿ'’-]{3,})\b/g
  ];
  for (const re of patterns) {
    for (const m of raw.matchAll(re)) {
      const name = m[1]?.trim();
      if (!name || WA_NAME_STOP.test(name.toLowerCase())) continue;
      if (!names.some((n) => n.toLowerCase() === name.toLowerCase())) names.push(name);
    }
  }
  return names;
}
function looksLikeNameLoose(s) {
  const t = s.trim();
  const lower = t.toLowerCase();
  if (!t || t.length < 2) return false;
  if (/^\d/.test(t)) return false;
  if (/^(lista|listado|listar|cu[aá]ntos|cu[aá]ntas|dime|dame|hazme|mu[eé]strame|seguimientos?|compradores?|alarmas?|clientes?|particulares?|tenemos|ningun|hay|que|algun|piso)\b/.test(
    lower
  ))
    return false;
  if (/\b(tenemos|ningun|algun|busque|busca|cliente|habitacion|piso de)\b/.test(lower)) return false;
  if (/^(en\s+)?seguimientos?$/.test(lower)) return false;
  if (/^(los|las|el|la)\s+(seguimientos?|compradores?|alarmas?)$/.test(lower)) return false;
  if (/euros?|€|habitacion|ascensor|busca|busque|presupuesto|tel[eé]fono|hospitalet|barcelona|tenemos|ningun|alg[uú]n/i.test(t))
    return false;
  return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]+$/.test(t);
}
function titleCaseName(name) {
  return name.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
function parseNombre(text) {
  const patterns = [
    /(?:nuevo\s+)+(?:comprador[a]?|contacto|cliente)\s*[.,]?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]{1,40}?)(?:\s*[.,]|\s+busca|\s+n[uú]mero|\s+tel|\s+\d|\s+presupuesto|$)/i,
    /(?:nuevo|nueva|agrega|agregar|a[nñ]ade|crea|crear|registra|alta de)\s+(?:un\s+)?(?:nuevo\s+)?(?:comprador[a]?|contacto|cliente)\s*,?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]{1,40}?)(?:\s*,|\s+\d|\s+tel|\s+presupuesto|\s+\d{3}[.\s]\d|$)/i,
    /^[,.\s]*(?:oh[,.\s]+)?([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]{2,40}?)\s*,?\s*(?:n[uú]mero(?:\s+de)?\s+tel[eé]fono|tel[eé]fono|m[oó]vil)/i,
    /(?:nombre[:\s]+)([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]+)/i
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]?.trim()) {
      const name = m[1].trim().replace(/\s+(?:de|en)\s+$/i, "");
      if (looksLikeNameLoose(name)) return titleCaseName(name);
    }
  }
  const stripped = text.replace(
    /^(?:alfredo[,.\s]+)?(?:\/nuevo\s+|(?:nuevo\s+)+(?:comprador[a]?|contacto|cliente)\s*[.,]?\s*|(?:nuevo|nueva|agrega|agregar|a[nñ]ade|crea|crear|registra|alta de)\s+(?:un\s+)?(?:nuevo\s+)?(?:comprador[a]?|contacto|cliente)\s*,?\s*)/i,
    ""
  );
  const firstPart = stripped.split(/[.,]/)[0]?.trim();
  if (firstPart && looksLikeNameLoose(firstPart)) return titleCaseName(firstPart);
  return void 0;
}
export function parseCompradorFromText(text) {
  const raw = text.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if ((/[?]/.test(raw) || /(?:^|\b)(?:no\s+)?(?:tenemos|hay|existe)|ningun[oa]?\s+(?:cliente|comprador)|que busquen?\b/.test(lower)) && !isCompradorAltaText(raw)) {
    return null;
  }
  if (/(?:lista|listado|listar|cu[aá]ntos|cu[aá]ntas|dame|dime|mu[eé]strame|hazme|quiero ver|necesito ver|ver los|ver las)\b/.test(
    lower
  ) && /(?:seguimientos?|compradores?|alarmas?|clientes?|particulares?)/.test(lower) && !isCompradorAltaText(raw)) {
    return null;
  }
  const nombre = parseNombre(raw);
  if (!nombre) return null;
  const telefono = parseTelefonoFromText(raw);
  const presupuesto_max = parseEuroAmount(raw);
  const habitaciones_min = parseHabitaciones(raw);
  const zona_buscada = parseZonasFromText(raw);
  const extras = parseCompradorCriteriosExtras(raw);
  const notas = buildCompradorNotas(extras);
  return {
    nombre,
    telefono: telefono ?? "",
    presupuesto_max,
    zona_buscada,
    habitaciones_min,
    ascensor_indispensable: extras.ascensor_indispensable,
    planta_max_sin_ascensor: extras.planta_max_sin_ascensor,
    balcon_terraza_indispensable: extras.balcon_terraza_indispensable,
    m2_minimos: extras.m2_minimos,
    banos_min: extras.banos_min,
    exterior_indispensable: extras.exterior_indispensable,
    tipo_inmueble: parseTipoInmueble(raw),
    notas
  };
}
export const ALFREDO_HELP = "Alfredo \u2014 Compradores Nueva Habitat\n\nTexto o nota de voz:\n\xABNuevo comprador Jos\xE9 Mart\xEDnez, 250.000 euros, busca piso en Hospitalet \u2014 Camp Vidalet y Florida, tres habitaciones, m\xE1ximo segundo sin ascensor, tel\xE9fono 612345678\xBB\n\xABJos\xE9 Mart\xEDnez, tel\xE9fono 673483132, Barcelona Arc de Triomf y Ciutat Vella, hasta 300.000 \u20AC, 3 hab m\xEDnimas, ascensor indispensable, exterior indispensable, 80 m\xB2 m\xEDnimos, 2 ba\xF1os, piso con balc\xF3n\xBB\n\n/comprador nombre | tel\xE9fono | presupuesto | zona | habitaciones\n/listar \u2014 \xFAltimos compradores activos\n/ayuda \u2014 esta lista";
