"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALFREDO_HELP = void 0;
exports.isCompradorAltaText = isCompradorAltaText;
exports.parseCompradorFromText = parseCompradorFromText;
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
    mil: 1000,
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
    nueve: "9",
};
const KNOWN_ZONES = [
    "hospitalet de llobregat",
    "l'hospitalet de llobregat",
    "hospitalet",
    "barcelona",
    "eixample",
    "gràcia",
    "gracia",
    "sants",
    "badalona",
    "cornellà",
    "cornella",
    "esplugues",
    "les corts",
    "poblenou",
    "sarrià",
    "sarria",
    "valencia",
    "madrid",
];
function isCompradorAltaText(text) {
    const t = text.toLowerCase();
    return /(?:nuevo|nueva|agrega|agregar|a[nñ]ade|a[nñ]adir|crea|crear|registra|alta|alta de)\s+(?:un\s+)?(?:nuevo\s+)?comprador/.test(t);
}
function parseSpokenEuroAmount(text) {
    const lower = text.toLowerCase();
    const presIdx = lower.search(/presupuesto|hasta|m[aá]ximo|maximo|euros?|€/);
    const slice = presIdx >= 0 ? lower.slice(Math.max(0, presIdx - 40)) : lower;
    const tokens = slice.match(/([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,5})\s*(?:mil|euros?|€)/);
    if (!tokens?.[1])
        return undefined;
    const words = tokens[1]
        .replace(/\s+y\s+/g, " ")
        .split(/\s+/)
        .filter((w) => w && !/^(de|presupuesto|hasta|euros?|€|mil)$/.test(w));
    if (!words.length)
        return undefined;
    let total = 0;
    let current = 0;
    for (const w of words) {
        if (w === "mil") {
            current = current === 0 ? 1000 : current * 1000;
            total += current;
            current = 0;
            continue;
        }
        const n = SPANISH_NUMBER_WORDS[w];
        if (n === undefined)
            return undefined;
        if (n >= 100) {
            current = current === 0 ? n : current * n;
        }
        else {
            current += n;
        }
    }
    total += current;
    return total > 0 ? total : undefined;
}
function parseEuroAmount(text) {
    const lower = text.toLowerCase();
    // 250.000 euros / 250000€
    const dotted = text.match(/(\d{1,3}(?:\.\d{3})+|\d{4,7})\s*(?:€|euros?)/i);
    if (dotted) {
        const n = Number(dotted[1].replace(/\./g, ""));
        if (Number.isFinite(n) && n > 0)
            return n;
    }
    const spoken = parseSpokenEuroAmount(lower);
    if (spoken)
        return spoken;
    const milMatch = lower.match(/(\d[\d.]*)?\s*mil(?:\s+euros?)?/);
    if (milMatch) {
        const base = milMatch[1] ? parseFloat(milMatch[1].replace(/\./g, "")) : 1;
        if (Number.isFinite(base))
            return Math.round(base * 1000);
    }
    const presupuestoMatch = lower.match(/(?:presupuesto|hasta|m[aá]ximo|maximo)\s*(?:de\s*)?(\d[\d.\s]*)\s*(?:mil|euros?|€)?/);
    if (presupuestoMatch) {
        let raw = presupuestoMatch[1].replace(/\s/g, "").replace(/\./g, "");
        if (/mil/i.test(presupuestoMatch[0]) && raw.length <= 3) {
            return Number(raw) * 1000;
        }
        const n = Number(raw);
        if (Number.isFinite(n) && n > 0)
            return n < 10000 ? n * 1000 : n;
    }
    const bare = lower.match(/\b(\d{5,7})\b/);
    if (bare)
        return Number(bare[1]);
    return undefined;
}
function spokenDigitsToPhone(text) {
    const lower = text.toLowerCase();
    const telIdx = lower.search(/tel[eé]fono|m[oó]vil|n[uú]mero/);
    const slice = telIdx >= 0 ? lower.slice(telIdx) : lower;
    const digitRun = slice.match(/(?:tel[eé]fono|m[oó]vil|n[uú]mero)?\s*((?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)){8,})/);
    if (!digitRun?.[1])
        return undefined;
    const digits = digitRun[1]
        .split(/\s+/)
        .map((w) => DIGIT_WORDS[w])
        .join("");
    if (digits.length >= 9)
        return digits.slice(-9);
    return undefined;
}
function parseTelefono(text) {
    const spoken = spokenDigitsToPhone(text);
    if (spoken)
        return spoken;
    const plus = text.match(/\+34[\s-]?\d[\d\s-]{8,}/);
    if (plus)
        return plus[0].replace(/[\s-]/g, "");
    const spaced = text.match(/\b(\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})\b/);
    if (spaced)
        return spaced[1].replace(/[\s-]/g, "");
    const nine = text.match(/\b([6789]\d{8})\b/);
    if (nine)
        return nine[1];
    return undefined;
}
function parseHabitaciones(text) {
    const lower = text.toLowerCase();
    const numMatch = lower.match(/(\d)\s*(?:habitaciones?|dormitorios?|hab\.?)/);
    if (numMatch)
        return Number(numMatch[1]);
    const deMatch = lower.match(/(?:de|con)\s+(cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\s+(?:habitaciones?|dormitorios?|hab\.?)/);
    if (deMatch) {
        const w = deMatch[1];
        if (/^\d+$/.test(w))
            return Number(w);
        const n = SPANISH_NUMBER_WORDS[w];
        if (n !== undefined)
            return n;
    }
    for (const [word, n] of Object.entries(SPANISH_NUMBER_WORDS)) {
        if (new RegExp(`\\b${word}\\s+(?:habitaciones?|dormitorios?)`).test(lower)) {
            return n;
        }
    }
    return undefined;
}
function titleCaseZona(z) {
    return z
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
        .replace(/Llobregat/i, "Llobregat")
        .replace(/L'hospitalet/i, "L'Hospitalet");
}
function parseZona(text) {
    const lower = text.toLowerCase();
    const buscaEn = text.match(/(?:busca(?:r)?(?:\s+piso|\s+vivienda|\s+casa|\s+inmueble)?\s*(?:en|por|zona)?)\s+([A-Za-zÀ-ÿ'’\s-]{3,50}?)(?:,|\s+de\s+(?:cero|uno|un|una|dos|tres|\d+)\s+hab|\s+con\s+|\s+y\s+|$)/i);
    if (buscaEn?.[1]) {
        const z = buscaEn[1].trim();
        if (z.length >= 3)
            return titleCaseZona(z);
    }
    const afterZona = text.match(/(?:zona|en|barrio|municipio)\s+([A-Za-zÀ-ÿ'’\s-]{3,50}?)(?:,|\s+de\s+(?:cero|uno|un|dos|tres|\d+)\s+hab|\s+con\s+|$)/i);
    if (afterZona?.[1]) {
        return titleCaseZona(afterZona[1]);
    }
    for (const c of KNOWN_ZONES) {
        if (lower.includes(c)) {
            if (c.includes("hospitalet"))
                return "Hospitalet de Llobregat";
            return titleCaseZona(c);
        }
    }
    return undefined;
}
function looksLikeNameLoose(s) {
    const t = s.trim();
    const lower = t.toLowerCase();
    if (!t || t.length < 2)
        return false;
    if (/^\d/.test(t))
        return false;
    if (/^(lista|listado|listar|cu[aá]ntos|cu[aá]ntas|dime|dame|hazme|mu[eé]strame|seguimientos?|compradores?|alarmas?|clientes?|particulares?)\b/.test(lower))
        return false;
    if (/euros?|€|habitacion|ascensor|busca|presupuesto|tel[eé]fono|hospitalet|barcelona/i.test(t))
        return false;
    return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]+$/.test(t);
}
function titleCaseName(name) {
    return name
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}
function parseNombre(text) {
    const patterns = [
        /(?:nuevo|nueva|agrega|agregar|a[nñ]ade|crea|crear|registra|alta de)\s+(?:un\s+)?(?:nuevo\s+)?comprador[a]?\s*,?\s*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]{1,40}?)(?:\s*,|\s+\d|\s+tel|\s+presupuesto|\s+\d{3}[.\s]\d|$)/i,
        /(?:nuevo\s+)?comprador[:\s,]+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]{1,40}?)(?:\s*,|\s+\d|\s+tel|\s+\d{3}[.\s]\d|$)/i,
        /(?:nombre[:\s]+)([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\s-]+)/i,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m?.[1]?.trim()) {
            const name = m[1].trim().replace(/\s+(?:de|en)\s+$/i, "");
            if (looksLikeNameLoose(name))
                return titleCaseName(name);
        }
    }
    // Comas: «nuevo comprador, José Martínez, 250.000 euros, …»
    const stripped = text.replace(/^(?:\/nuevo\s+|(?:nuevo|nueva|agrega|agregar|a[nñ]ade|crea|crear|registra|alta de)\s+(?:un\s+)?(?:nuevo\s+)?comprador[a]?\s*,?\s*)/i, "");
    const firstPart = stripped.split(",")[0]?.trim();
    if (firstPart && looksLikeNameLoose(firstPart))
        return titleCaseName(firstPart);
    return undefined;
}
function parseNotasExtras(text) {
    const parts = [];
    const lower = text.toLowerCase();
    if (/\bascensor\b/.test(lower))
        parts.push("Con ascensor");
    if (/\bsin ascensor\b/.test(lower))
        parts.push("Sin ascensor");
    if (/\bterraza\b/.test(lower))
        parts.push("Terraza");
    if (/\bgaraje\b/.test(lower))
        parts.push("Garaje");
    if (/\bmascotas?\b/.test(lower))
        parts.push("Mascotas");
    const notasMatch = text.match(/(?:nota[s]?|observaciones?)[:\s]+(.+)$/i);
    if (notasMatch?.[1]?.trim())
        parts.push(notasMatch[1].trim());
    return parts.length ? parts.join(". ") : undefined;
}
function parseCompradorFromText(text) {
    const raw = text.trim();
    if (!raw)
        return null;
    const lower = raw.toLowerCase();
    if (/(?:lista|listado|listar|cu[aá]ntos|cu[aá]ntas|dame|dime|mu[eé]strame|hazme|quiero ver|necesito ver|ver los|ver las)\b/.test(lower) &&
        /(?:seguimientos?|compradores?|alarmas?|clientes?|particulares?)/.test(lower) &&
        !isCompradorAltaText(raw)) {
        return null;
    }
    const nombre = parseNombre(raw);
    if (!nombre)
        return null;
    const telefono = parseTelefono(raw);
    const presupuesto_max = parseEuroAmount(raw);
    const habitaciones_min = parseHabitaciones(raw);
    const zona_buscada = parseZona(raw);
    const extras = parseNotasExtras(raw);
    const notas = extras ?? "Importado por Alfredo (Telegram)";
    return {
        nombre,
        telefono: telefono ?? "",
        presupuesto_max,
        zona_buscada,
        habitaciones_min,
        notas,
    };
}
exports.ALFREDO_HELP = "Alfredo — Compradores Nueva Habitat\n\n" +
    "Texto o nota de voz:\n" +
    "«Nuevo comprador José Martínez, 250.000 euros, busca piso en Hospitalet de Llobregat, tres habitaciones con ascensor, teléfono 612345678»\n\n" +
    "/comprador nombre | teléfono | presupuesto | zona | habitaciones\n" +
    "/listar — últimos compradores activos\n" +
    "/ayuda — esta lista";
