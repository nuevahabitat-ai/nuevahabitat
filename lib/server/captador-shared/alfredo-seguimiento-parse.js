"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALFREDO_SEGUIMIENTO_HELP = void 0;
exports.isSeguimientoRegistroText = isSeguimientoRegistroText;
exports.parseSeguimientoFromText = parseSeguimientoFromText;
const SPANISH_NUM = {
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
    quince: 15,
    veinte: 20,
    treinta: 30,
};
const KNOWN_MUNICIPIOS = [
    "hospitalet de llobregat",
    "hospitalet",
    "barcelona",
    "badalona",
    "cornellà",
    "cornella",
    "esplugues",
    "sants",
    "eixample",
    "gràcia",
    "gracia",
];
function parseTelefono(text) {
    const plus = text.match(/\+34[\s-]?\d[\d\s-]{8,}/);
    if (plus)
        return plus[0].replace(/[\s-]/g, "");
    const nine = text.match(/\b([6789]\d{8})\b/);
    if (nine)
        return nine[1];
    const afterTel = text.match(/(?:tel[eé]fono|m[oó]vil|n[uú]mero)\s*[:\s]*(\+?\d[\d\s-]{8,})/i);
    if (afterTel)
        return afterTel[1].replace(/[\s-]/g, "");
    return undefined;
}
function looksLikeName(s) {
    const t = s.trim();
    if (!t || /^\d/.test(t))
        return false;
    if (/euros?|€|habitacion|ascensor|busca|alarma|tel[eé]fono|contactado|llam/i.test(t))
        return false;
    return /^[A-ZÀ-ÿ][a-zà-ÿ'’-]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ'’-]+)*$/.test(t);
}
function titleCase(s) {
    return s
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
        .replace(/Llobregat/i, "Llobregat");
}
function parseZona(text) {
    const lower = text.toLowerCase();
    const enMatch = text.match(/(?:en|zona|barrio|municipio)\s+([A-Za-zÀ-ÿ'’\s-]{3,45}?)(?:,|\s+(?:contactado|llam|alarma|tel[eé]fono|de\s+\d)|$)/i);
    if (enMatch?.[1]) {
        const place = titleCase(enMatch[1]);
        if (place.toLowerCase().includes("hospitalet"))
            return { municipio: "Hospitalet de Llobregat", zona: place };
        return { municipio: place, zona: place };
    }
    for (const m of KNOWN_MUNICIPIOS) {
        if (lower.includes(m)) {
            if (m.includes("hospitalet"))
                return { municipio: "Hospitalet de Llobregat" };
            return { municipio: titleCase(m) };
        }
    }
    return {};
}
function parseAlarmaDias(text) {
    const lower = text.toLowerCase();
    if (/\bma[nñ]ana\b/.test(lower))
        return 1;
    if (/\bpasado\s+ma[nñ]ana\b/.test(lower))
        return 2;
    if (/\buna\s+semana\b|\ben\s+7\s+d[ií]as\b/.test(lower))
        return 7;
    if (/\bdos\s+semanas\b/.test(lower))
        return 14;
    const enDias = lower.match(/(?:alarma|volver|llamar|contactar|seguir)\s+(?:en|dentro de|para)\s+(?:(\d+)|(cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|quince|veinte|treinta))\s+d[ií]as?/);
    if (enDias) {
        const n = enDias[1] ? Number(enDias[1]) : SPANISH_NUM[enDias[2] ?? ""];
        if (Number.isFinite(n) && n > 0)
            return n;
    }
    const alarmaEn = lower.match(/alarma\s+en\s+(\d+)\s+d[ií]as?/);
    if (alarmaEn)
        return Number(alarmaEn[1]);
    return undefined;
}
function parseEstado(text) {
    const lower = text.toLowerCase();
    if (/\bcontactado\b/.test(lower))
        return "contactado";
    if (/\bvisita\b|\bvisita\s+programada\b/.test(lower))
        return "visita";
    if (/\bnegociaci[oó]n\b/.test(lower))
        return "negociacion";
    if (/\bnuevo\b/.test(lower))
        return "nuevo";
    return undefined;
}
function parseNombre(text) {
    const patterns = [
        /(?:nuevo|nueva|agrega|agregar|a[nñ]ade|registra|crea|crear|actualiza)\s+(?:un\s+)?(?:nuevo\s+)?(?:seguimiento|particular)\s*,?\s*(?:de\s+|para\s+|a\s+)?([A-ZÀ-ÿ][a-zà-ÿ'’-]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ'’-]+)*)/i,
        /(?:seguimiento|particular)\s+(?:de\s+|para\s+|a\s+)?([A-ZÀ-ÿ][a-zà-ÿ'’-]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ'’-]+)*)/i,
        /(?:nota\s+(?:de\s+)?particular\s+)([A-ZÀ-ÿ][a-zà-ÿ'’-]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ'’-]+)*)/i,
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m?.[1]?.trim() && looksLikeName(m[1]))
            return m[1].trim();
    }
    const stripped = text.replace(/^(?:nuevo|nueva|agrega|registra|crea|actualiza)\s+(?:un\s+)?(?:nuevo\s+)?(?:seguimiento|particular)\s*,?\s*/i, "");
    const first = stripped.split(",")[0]?.trim();
    if (first && looksLikeName(first))
        return first;
    return undefined;
}
function parseComentario(text) {
    const phrases = [
        /(llam[eé]\s+sin\s+respuesta[^,.]*)/i,
        /(no\s+contesta[^,.]*)/i,
        /(hay\s+que\s+cualificar[^,.]*)/i,
        /(interesad[oa][^,.]*)/i,
        /(pendiente\s+de\s+llamar[^,.]*)/i,
        /(visita\s+programada[^,.]*)/i,
        /(volver\s+a\s+llamar[^,.]*)/i,
    ];
    for (const p of phrases) {
        const m = text.match(p);
        if (m?.[1]?.trim())
            return m[1].trim();
    }
    const colon = text.match(/(?:seguimiento|particular|nota)\s*(?:de\s+)?[^:,\n]+[:,-]\s*(.+)$/i);
    if (colon?.[1]?.trim())
        return colon[1].trim();
    const parts = text.split(",").map((p) => p.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (/llam|contact|respuesta|cualificar|visita|interes|volver|pendiente/i.test(part) && !/^\d/.test(part)) {
            return part;
        }
    }
    return undefined;
}
/** ¿Es alta/registro de seguimiento (no consulta de lista)? */
function isSeguimientoRegistroText(text) {
    const t = text.toLowerCase();
    if (/(?:nuevo|nueva|agrega|agregar|a[nñ]ade|a[nñ]adir|registra|crear|crea|actualiza|actualizar)\s+(?:un\s+)?(?:nuevo\s+)?(?:seguimiento|particular)/.test(t))
        return true;
    if (/seguimiento\s+particular/.test(t))
        return true;
    if (/nota\s+(?:de\s+)?particular/.test(t))
        return true;
    if (/particular\s+.+\s*[:,-]\s*.+/.test(t))
        return true;
    if (/seguimiento\s+.+\s*[:,-]\s*.+/.test(t))
        return true;
    if (/(?:llam[eé]|contact|sin respuesta|volver a llamar|alarma en)/.test(t) && /(?:particular|seguimiento|carmen|contacto)/i.test(text))
        return true;
    return false;
}
function parseSeguimientoFromText(text) {
    const raw = text.trim();
    if (!raw)
        return null;
    if (!isSeguimientoRegistroText(raw))
        return null;
    const contacto_nombre = parseNombre(raw);
    const telefono = parseTelefono(raw);
    const { zona, municipio } = parseZona(raw);
    const comentario = parseComentario(raw);
    const estado = parseEstado(raw);
    const alarma_dias = parseAlarmaDias(raw);
    if (!contacto_nombre && !telefono)
        return null;
    return {
        contacto_nombre,
        telefono,
        zona,
        municipio,
        comentario: comentario ?? (estado ? `Estado: ${estado}` : "Seguimiento registrado vía Alfredo"),
        estado,
        alarma_dias: alarma_dias ?? 7,
        titulo: contacto_nombre ? `Particular ${contacto_nombre}` : undefined,
    };
}
exports.ALFREDO_SEGUIMIENTO_HELP = "Seguimientos — habla natural:\n" +
    "«Nuevo seguimiento Carmen, teléfono 612345678, Hospitalet, contactado, llamé sin respuesta, alarma en 3 días»\n" +
    "«Seguimiento particular José: hay que cualificar financieramente»\n" +
    "«Nota particular Carmen en Hospitalet, volver a llamar en una semana»";
