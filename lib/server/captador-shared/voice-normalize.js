"use strict";
/**
 * Normalización de texto hablado (Whisper) → comandos reconocibles.
 * Diccionarios amplios para Alfredo (NH) y José (Captador/Kelify).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOSE_VOICE_ALIASES_WITH_ARGS = exports.JOSE_VOICE_ALIASES = exports.ALFREDO_VOICE_ALIASES = exports.PHRASE_CORRECTIONS = void 0;
exports.normalizeSpokenText = normalizeSpokenText;
exports.applyPhraseCorrections = applyPhraseCorrections;
exports.normalizeVoiceToAlfredoCommand = normalizeVoiceToAlfredoCommand;
exports.normalizeVoiceToJoseCommand = normalizeVoiceToJoseCommand;
/** Limpieza base de cualquier transcripción de voz. */
function normalizeSpokenText(text) {
    let out = String(text ?? "")
        .normalize("NFKC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[«»""''`´]/g, "")
        .trim();
    // Formato bot «Oí: «texto»» o comillas Telegram
    out = out.replace(/^o[ií]\s*[,:]?\s*/gi, "");
    out = out.replace(/^[«""']+|[«""']+$/g, "");
    // Nombres de bot al inicio
    out = out.replace(/^(?:alfredo|jos[eé]|jose|captador|kelify)\s*[,:]?\s*/gi, "");
    // Puntuación final (causa principal de fallos: «Lista de seguimientos.»)
    out = out.replace(/[.,;:!?¿¡…]+$/g, "").trim();
    out = out.replace(/^[.,;:!?¿¡…]+/g, "").trim();
    return out.replace(/\s{2,}/g, " ").trim();
}
function buildHomophoneCorrections() {
    const terms = [
        // —— Alfredo: compradores ——
        [/\bcompador\b/gi, "comprador"],
        [/\bcommprador\b/gi, "comprador"],
        [/\bcompradors\b/gi, "comprador"],
        [/\bcomprador es\b/gi, "comprador"],
        [/\bcompradore\b/gi, "comprador"],
        [/\bcompradora\b/gi, "compradora"],
        [/\bcompradores\b/gi, "compradores"],
        [/\bcompradoras\b/gi, "compradoras"],
        [/\bcomprador activo\b/gi, "comprador activo"],
        [/\bcompradores activos\b/gi, "compradores activos"],
        [/\bnuevo comprador\b/gi, "nuevo comprador"],
        [/\bnueva compradora\b/gi, "nueva compradora"],
        [/\bagrega comprador\b/gi, "agrega comprador"],
        [/\bagregar comprador\b/gi, "agregar comprador"],
        [/\bañade comprador\b/gi, "agrega comprador"],
        [/\banade comprador\b/gi, "agrega comprador"],
        [/\banadir comprador\b/gi, "agrega comprador"],
        [/\bcrear comprador\b/gi, "nuevo comprador"],
        [/\bcrea comprador\b/gi, "nuevo comprador"],
        [/\bregistra comprador\b/gi, "nuevo comprador"],
        [/\bclientes activos\b/gi, "clientes activos"],
        [/\bcliente activo\b/gi, "cliente activo"],
        // —— Alfredo: seguimientos / alarmas ——
        [/\bse\s+guimiento\b/gi, "seguimiento"],
        [/\bsegui\s+miento\b/gi, "seguimiento"],
        [/\bseguimientos\b/gi, "seguimientos"],
        // No convertir «nuevo seguimiento» → «nuevo seguimientos»
        [/\bnuevo\s+seguimientos\b/gi, "nuevo seguimiento"],
        [/\bnueva\s+seguimientos\b/gi, "nueva seguimiento"],
        [/\bagrega\s+seguimientos\b/gi, "agrega seguimiento"],
        [/\bseguimiento s\b/gi, "seguimientos"],
        [/\bseguimiento es\b/gi, "seguimientos"],
        [/\bseguimiento activo\b/gi, "seguimiento activo"],
        [/\bseguimientos activos\b/gi, "seguimientos activos"],
        [/\bparticulares en seguimiento\b/gi, "particulares en seguimiento"],
        [/\bparticular en seguimiento\b/gi, "particular en seguimiento"],
        [/\blista de seguimiento\b/gi, "lista de seguimientos"],
        [/\blistar seguimientos\b/gi, "lista de seguimientos"],
        [/\blistado de seguimientos\b/gi, "lista de seguimientos"],
        [/\blistado seguimientos\b/gi, "lista de seguimientos"],
        [/\blista seguimientos\b/gi, "lista de seguimientos"],
        [/\blista de seguimiento\b/gi, "lista de seguimientos"],
        [/\bcu[aá]ntos seguimientos\b/gi, "cuántos seguimientos"],
        [/\bcu[aá]ntas seguimientos\b/gi, "cuántos seguimientos"],
        [/\bcuanto seguimientos\b/gi, "cuántos seguimientos"],
        [/\bcuanta seguimientos\b/gi, "cuántos seguimientos"],
        [/\bque seguimientos\b/gi, "qué seguimientos"],
        [/\bqu[eé] seguimientos tenemos\b/gi, "cuántos seguimientos tenemos"],
        [/\btenemos seguimientos\b/gi, "cuántos seguimientos tenemos"],
        [/\bseguimientos hoy\b/gi, "seguimientos hoy"],
        [/\bseguimientos de hoy\b/gi, "seguimientos hoy"],
        [/\bseguimientos para hoy\b/gi, "seguimientos hoy"],
        [/\bhoy seguimientos\b/gi, "seguimientos hoy"],
        [/\bseguimientos pendientes\b/gi, "seguimientos pendientes"],
        [/\bseguimientos vencidos\b/gi, "alarmas"],
        [/\balarmas de contacto\b/gi, "alarmas"],
        [/\balarmas vencidas\b/gi, "alarmas"],
        [/\balarmas pendientes\b/gi, "alarmas"],
        [/\bque hay que seguir\b/gi, "qué hay que seguir"],
        [/\bque tengo que seguir\b/gi, "qué hay que seguir"],
        [/\bhay que seguir\b/gi, "qué hay que seguir"],
        [/\bcompatibles\b/gi, "compatibles"],
        [/\bparticulares\b/gi, "particulares"],
        [/\bparticular\b/gi, "particular"],
        [/\bcontactado\b/gi, "contactado"],
        [/\bcualificar\b/gi, "cualificar"],
        [/\bcualificar financieramente\b/gi, "cualificar financieramente"],
        [/\bfinancieramente\b/gi, "financieramente"],
        // —— Alfredo: datos comprador ——
        [/\bpre\s+supuesto\b/gi, "presupuesto"],
        [/\bpresupuestos\b/gi, "presupuesto"],
        [/\bpresupuesto m[aá]ximo\b/gi, "presupuesto"],
        [/\btel[eé]fono\b/gi, "teléfono"],
        [/\btelefono\b/gi, "teléfono"],
        [/\btel[eé]fono m[oó]vil\b/gi, "teléfono móvil"],
        [/\bn[uú]mero de tel[eé]fono\b/gi, "teléfono"],
        [/\bnumero de telefono\b/gi, "teléfono"],
        [/\bhabitaciones\b/gi, "habitaciones"],
        [/\bhabitaci[oó]n\b/gi, "habitaciones"],
        [/\bhab\b/gi, "habitaciones"],
        [/\bdormitorios\b/gi, "dormitorios"],
        [/\bdormitorio\b/gi, "dormitorios"],
        [/\bascensor\b/gi, "ascensor"],
        [/\bzona\b/gi, "zona"],
        [/\bbarrio\b/gi, "zona"],
        [/\bnota comprador\b/gi, "nota comprador"],
        [/\bnota para comprador\b/gi, "nota comprador"],
        [/\bseguimiento comprador\b/gi, "seguimiento comprador"],
        [/\bseguimiento particular\b/gi, "seguimiento particular"],
        // —— José / Kelify ——
        [/\bo un padre\b/gi, "o listado"],
        [/\blos padres\b/gi, "los listados"],
        [/\bun padre\b/gi, "listado"],
        [/\bun padr[eé]\b/gi, "listado"],
        [/\blistados?\s+de\s+particulares\b/gi, "listado de particulares"],
        [/\blistado de particulares\b/gi, "listado de particulares"],
        [/\blista de particulares\b/gi, "listado de particulares"],
        [/\blistar particulares\b/gi, "listado de particulares"],
        [/\bcallify\b/gi, "Kelify"],
        [/\bkelifi\b/gi, "Kelify"],
        [/\bcalifi\b/gi, "Kelify"],
        [/\bcalify\b/gi, "Kelify"],
        [/\bque lifi\b/gi, "Kelify"],
        [/\bque lify\b/gi, "Kelify"],
        [/\bkell?ify\b/gi, "Kelify"],
        [/\bkellyfy\b/gi, "Kelify"],
        [/\bkelly\s+fi\b/gi, "Kelify"],
        [/\bkelly\s+files?\b/gi, "Kelify"],
        [/\bkellify\b/gi, "Kelify"],
        [/\bkelify\b/gi, "Kelify"],
        [/\bque\s*lify\b/gi, "Kelify"],
        [/\bkelifi\s+files?\b/gi, "Kelify"],
        [/\bcaptador\b/gi, "Captador"],
        [/\bleads?\b/gi, "leads"],
        [/\bpisos?\b/gi, "pisos"],
        [/\bactiva\b(?=\s|$)/gi, "activar"],
        [/\bactivar kelify\b/gi, "activar"],
        [/\bactivar captador\b/gi, "activar"],
        [/\bextraer kelify\b/gi, "activar"],
        [/\bextrae kelify\b/gi, "activar"],
        [/\bponte en funcionamiento\b/gi, "ponte en funcionamiento"],
        [/\barrancar captador\b/gi, "activar"],
        [/\bbuscar en kelify\b/gi, "buscar"],
        [/\bbusca en kelify\b/gi, "buscar"],
        [/\benviar whatsapp\b/gi, "enviar"],
        [/\benv[ií]a whatsapp\b/gi, "enviar"],
        [/\blanzar whatsapp\b/gi, "enviar"],
        [/\blanzar tanda\b/gi, "enviar"],
        [/\benviar tanda\b/gi, "enviar"],
        [/\bpendientes\b/gi, "pendientes"],
        [/\ben cola\b/gi, "pendientes"],
        [/\binforme diario\b/gi, "informe"],
        [/\binforme semanal\b/gi, "informe semana"],
        [/\bestado del sistema\b/gi, "estado"],
        [/\bestado captador\b/gi, "estado"],
        [/\bveinticuatro horas\b/gi, "24 horas"],
        [/\b24 horas\b/gi, "24 horas"],
        [/\bdos d[ií]as\b/gi, "2 días"],
        [/\btres d[ií]as\b/gi, "3 días"],
        [/\bauto on\b/gi, "auto on"],
        [/\bauto off\b/gi, "auto off"],
        [/\bautomatizaci[oó]n on\b/gi, "auto on"],
        [/\bautomatizaci[oó]n off\b/gi, "auto off"],
        // —— Marcas / agencia ——
        [/\bidealista\b/gi, "Idealista"],
        [/\bfotocasa\b/gi, "Fotocasa"],
        [/\bnueva habitat\b/gi, "Nueva Habitat"],
        [/\bnueva h[aá]bitat\b/gi, "Nueva Habitat"],
        [/\bnuev[aá] habitat\b/gi, "Nueva Habitat"],
        // —— Importes hablados ——
        [/\bdoscientos\s+diez\s+mil\b/gi, "210000 euros"],
        [/\bdoscientos\s+veinte\s+mil\b/gi, "220000 euros"],
        [/\bdoscientos\s+mil\b/gi, "200000 euros"],
        [/\btrescientos\s+mil\b/gi, "300000 euros"],
        [/\bciento\s+cincuenta\s+mil\b/gi, "150000 euros"],
        [/\bciento\s+ochenta\s+mil\b/gi, "180000 euros"],
        [/\bveinticuatro\s+mil\b/gi, "240000 euros"],
        [/\b239\s+mil\b/gi, "239000 euros"],
        [/\b210\s+mil\b/gi, "210000 euros"],
        [/\b220\s+mil\b/gi, "220000 euros"],
        [/\b150\s+mil\b/gi, "150000 euros"],
        [/\b180\s+mil\b/gi, "180000 euros"],
        [/\b200\s+mil\b/gi, "200000 euros"],
        [/\b300\s+mil\b/gi, "300000 euros"],
        // —— Zonas Barcelona ——
        [/\bllobregar\b/gi, "Llobregat"],
        [/\bllobregat\b/gi, "Llobregat"],
        [/\bl['']?hospitalet\b/gi, "Hospitalet"],
        [/\bhospitalet\b/gi, "Hospitalet"],
        [/\beixample\b/gi, "Eixample"],
        [/\bgr[aà]cia\b/gi, "Gràcia"],
        [/\bsants\b/gi, "Sants"],
        [/\bbadalona\b/gi, "Badalona"],
        [/\bcornell[aà]\b/gi, "Cornellà"],
        [/\bpoblenou\b/gi, "Poblenou"],
        [/\bsarri[aà]\b/gi, "Sarrià"],
        [/\bpedralbes\b/gi, "Pedralbes"],
        [/\bvallecas\b/gi, "Vallecas"],
        [/\bcuatro vientos\b/gi, "Cuatro Vientos"],
        [/\bla florida\b/gi, "La Florida"],
        [/\bles corts\b/gi, "Les Corts"],
        [/\btorrasa\b/gi, "Torrasa"],
        [/\besplugues\b/gi, "Esplugues"],
        [/\bbarcelona\b/gi, "Barcelona"],
        // —— Inmobiliaria general ——
        [/\bhonorario\b/gi, "honorarios"],
        [/\bcomisi[oó]n\b/gi, "comisión"],
        [/\bvisitas\b/gi, "visitas"],
        [/\bvisita\b/gi, "visita"],
        [/\barras\b/gi, "arras"],
        [/\bescritura\b/gi, "escritura"],
        [/\bhipoteca\b/gi, "hipoteca"],
        [/\bfinanciaci[oó]n\b/gi, "financiación"],
        [/\bactivo\b/gi, "activo"],
        [/\bactivos\b/gi, "activos"],
        [/\blistar\b/gi, "listar"],
        [/\balarmas\b/gi, "alarmas"],
    ];
    // Variantes con errores típicos de Whisper (1 letra)
    const typoBases = [
        ["seguimientos", ["seguimientoss", "seguimienntos", "seguimeintos", "seguimeintos"]],
        ["compradores", ["compradores", "compradoress", "compradore", "compradorres", "compradoores"]],
        ["comprador", ["comprador", "comprado", "compradoor", "compradoor"]],
        ["particulares", ["particulares", "particulares", "particularess", "particulares"]],
        ["alarmas", ["alarmas", "allarmas", "alarrmas", "alarmass"]],
        ["presupuesto", ["presupuesto", "presupuestos", "presupuesto", "presupuesto"]],
        ["teléfono", ["telefono", "telefonos", "teléfonos", "telefono"]],
        ["habitaciones", ["habitaciones", "habitacion", "habitacions", "avitciones"]],
        ["listado", ["listado", "listados", "listao", "listados"]],
        ["activar", ["activar", "activa", "activar", "activar"]],
        ["Kelify", ["kelify", "kelifi", "callify", "calify", "califi", "quelifi", "kellyfy", "kellify", "kellyfi"]],
    ];
    const typoCorrections = [];
    for (const [correct, variants] of typoBases) {
        for (const v of variants) {
            if (v.toLowerCase() === correct.toLowerCase())
                continue;
            typoCorrections.push({
                pattern: new RegExp(`\\b${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
                replacement: correct,
            });
        }
    }
    return [...terms.map(([pattern, replacement]) => ({ pattern, replacement })), ...typoCorrections];
}
exports.PHRASE_CORRECTIONS = buildHomophoneCorrections();
/** Mapeo frase hablada → comando canónico Alfredo (prioridad: más específico primero). */
exports.ALFREDO_VOICE_ALIASES = [
    // Seguimientos — listas
    {
        pattern: /^(?:dime|dame|hazme|h[aá]zme|mu[eé]strame|ens[eé][aá]me|quiero|necesito|puedes?\s+(?:darme|decirme|mostrarme)?)\s*(?:me\s+)?(?:una\s+)?(?:la\s+)?(?:lista|listado)\s+(?:de\s+)?seguimientos?\.?$/i,
        replacement: "lista de seguimientos",
    },
    { pattern: /^(?:hazme|h[aá]zme|dame|dime)\s+(?:una\s+)?lista\s+(?:de\s+)?seguimientos?\.?$/i, replacement: "lista de seguimientos" },
    { pattern: /^(?:lista|listado|listar)\s+(?:de\s+)?seguimientos?\.?$/i, replacement: "lista de seguimientos" },
    { pattern: /^seguimientos?\s+(?:activos?|en\s+curso)$/i, replacement: "lista de seguimientos" },
    { pattern: /^(?:particulares|particular)\s+(?:en\s+)?seguimientos?$/i, replacement: "lista de seguimientos" },
    { pattern: /^(?:mu[eé]strame|dame|dime)\s+(?:los\s+)?seguimientos?$/i, replacement: "lista de seguimientos" },
    { pattern: /^seguimientos?\.?$/i, replacement: "lista de seguimientos" },
    // Seguimientos — conteos
    { pattern: /^(?:cu[aá]ntos?|cu[aá]ntas?|n[uú]mero\s+de)\s+seguimientos?\s+(?:tenemos|hay|llevamos|tengo)?\.?$/i, replacement: "cuántos seguimientos tenemos" },
    { pattern: /^(?:qu[eé]|que)\s+seguimientos?\s+(?:tenemos|hay)\.?$/i, replacement: "cuántos seguimientos tenemos" },
    { pattern: /^tenemos\s+seguimientos?\.?$/i, replacement: "cuántos seguimientos tenemos" },
    // Seguimientos — hoy / alarmas
    { pattern: /^(?:seguimientos?\s+)?(?:de\s+)?hoy\.?$/i, replacement: "seguimientos hoy" },
    { pattern: /^(?:qu[eé]|que)\s+hay\s+(?:que\s+)?seguir\s+hoy\.?$/i, replacement: "seguimientos hoy" },
    { pattern: /^(?:dime|dame|mu[eé]strame)\s+(?:las\s+)?alarmas\.?$/i, replacement: "alarmas" },
    { pattern: /^alarmas?\s+(?:vencidas?|pendientes?|de\s+contacto)\.?$/i, replacement: "alarmas" },
    { pattern: /^alarmas?\.?$/i, replacement: "alarmas" },
    { pattern: /^(?:qu[eé]|que)\s+hay\s+que\s+seguir\.?$/i, replacement: "qué hay que seguir" },
    { pattern: /^compatibles?\.?$/i, replacement: "compatibles" },
    // Compradores — listas
    {
        pattern: /^(?:dime|dame|hazme|h[aá]zme|mu[eé]strame|ens[eé][aá]me)\s*(?:me\s+)?(?:una\s+)?(?:la\s+)?(?:lista|listado)\s+(?:de\s+)?compradores?\s*(?:activos?)?\.?$/i,
        replacement: "lista de compradores",
    },
    { pattern: /^(?:lista|listado|listar)\s+(?:de\s+)?compradores?\s*(?:activos?)?\.?$/i, replacement: "lista de compradores" },
    { pattern: /^compradores?\s+activos?\.?$/i, replacement: "compradores activos" },
    { pattern: /^(?:mu[eé]strame|dame|dime|quiero\s+ver|necesito\s+ver)\s+(?:los\s+|las\s+)?compradores?\.?$/i, replacement: "lista de compradores" },
    { pattern: /^(?:mu[eé]strame|dame|dime|quiero\s+ver|necesito\s+ver)\s+(?:los\s+|las\s+)?seguimientos?\.?$/i, replacement: "lista de seguimientos" },
    { pattern: /^(?:quiero|necesito)\s+(?:ver|saber)\s+(?:los\s+|las\s+)?seguimientos?\.?$/i, replacement: "lista de seguimientos" },
    // Compradores — conteos
    { pattern: /^(?:cu[aá]ntos?|cu[aá]ntas?|n[uú]mero\s+de)\s+compradores?\s*(?:activos?)?(?:\s+tenemos|\s+hay)?\.?$/i, replacement: "cuántos compradores activos" },
    { pattern: /^(?:qu[eé]|que)\s+clientes?\s+(?:tenemos|hay)\.?$/i, replacement: "qué clientes tenemos" },
    { pattern: /^clientes?\s+activos?\.?$/i, replacement: "clientes activos" },
    // Alta comprador — solo normaliza prefijo, NO borrar el resto del mensaje
    {
        pattern: /^(?:agrega|agregar|a[nñ]ade|a[nñ]adir|crea|crear|registra)\s+(?:un\s+)?(?:nuevo\s+)?comprador[a]?\s*[,.]?\s*/i,
        replacement: "nuevo comprador ",
    },
    // Alta / registro seguimiento — solo prefijo
    {
        pattern: /^(?:nuevo|nueva|agrega|agregar|a[nñ]ade|registra|crea|crear|actualiza)\s+(?:un\s+)?(?:nuevo\s+)?seguimiento\s*[,.]?\s*/i,
        replacement: "nuevo seguimiento ",
    },
    { pattern: /^seguimiento\s+particular\s+/i, replacement: "seguimiento particular " },
    { pattern: /^nota\s+particular\s+/i, replacement: "nota particular " },
    // Ayuda
    { pattern: /^(?:ayuda|help|qu[eé]\s+puedes\s+hacer|comandos?)\.?$/i, replacement: "/ayuda" },
];
/** Mapeo frase hablada → comando José (/activar, /enviar…). */
exports.JOSE_VOICE_ALIASES = [
    { pattern: /^ponte en funcionamiento\.?$/i, replacement: "ponte en funcionamiento" },
    { pattern: /^(?:activa|activar|arranca|arrancar|extrae|extraer|lanza|lanzar)\s+(?:el\s+)?(?:captador|kelify|listado)\.?$/i, replacement: "activar" },
    { pattern: /^(?:busca|buscar)\s+(?:en\s+)?kelify\.?$/i, replacement: "/buscar" },
    { pattern: /^(?:listado|lista)\s+(?:de\s+)?particulares\.?$/i, replacement: "/buscar" },
    { pattern: /^(?:env[ií]a|enviar|lanza|lanzar)\s+(?:la\s+)?(?:tanda|whatsapp)\.?$/i, replacement: "/enviar" },
    { pattern: /^pendientes\.?$/i, replacement: "/pendientes" },
    {
        pattern: /^(?:cu[aá]ntos?|cu[aá]ntas?)\s+(?:pisos?|leads?|particulares?|listados?|contactos?)\b/i,
        replacement: "/pendientes",
    },
    {
        pattern: /^(?:cu[aá]ntos?\s+leads?\s+hay|qu[eé]\s+leads?\s+hay|qu[eé]\s+hay\s+en\s+cola)\.?$/i,
        replacement: "/pendientes",
    },
    {
        pattern: /^(?:dime|dame)\s+(?:cu[aá]ntos?\s+)?(?:pisos?|leads?)\s+(?:tenemos|hay)\.?$/i,
        replacement: "/pendientes",
    },
    { pattern: /^(?:leads?\s+)?(?:en\s+)?cola\.?$/i, replacement: "/pendientes" },
    { pattern: /^(?:informe|reporte)\s*(?:diario|de\s+hoy)?\.?$/i, replacement: "/informe" },
    { pattern: /^(?:informe|reporte)\s+semana(?:l)?\.?$/i, replacement: "/informe semana" },
    { pattern: /^(?:estado|status)\s*(?:del\s+sistema|captador)?\.?$/i, replacement: "/estado" },
    { pattern: /^ayuda\.?$/i, replacement: "/ayuda" },
    { pattern: /^horario\.?$/i, replacement: "/horario" },
    { pattern: /^excel\.?$/i, replacement: "/excel" },
    { pattern: /^hot\.?$/i, replacement: "/hot" },
    { pattern: /^captar\.?$/i, replacement: "/captar" },
];
/** Aliases José con argumentos (activar 24h venta barcelona…). */
const JOSE_SPOKEN_NUM = {
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
    diez: "10",
};
function parseJoseExtraerKelify(text) {
    const m = text.match(/^(?:extrae|extraer|activa|activar)\s+(?:(\d+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+)?(?:pisos?\s+)?(?:de\s+)?(?:kelify|particulares|listados?)?(?:\s+(.*))?$/i);
    if (!m)
        return null;
    const rawLimit = m[1]?.toLowerCase();
    const limit = rawLimit ? (JOSE_SPOKEN_NUM[rawLimit] ?? rawLimit) : "5";
    const rest = (m[2] ?? "venta barcelona").trim();
    return `/activar ${limit}${rest ? ` ${rest}` : ""}`.replace(/\s+/g, " ").trim();
}
exports.JOSE_VOICE_ALIASES_WITH_ARGS = [
    {
        pattern: /^(?:extrae|extraer|activa|activar)\s+(?:(?:\d+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+)?(?:pisos?\s+)?(?:de\s+)?(?:kelify|particulares|listados?)?/i,
        replacement: (m) => parseJoseExtraerKelify(m) ?? `/activar ${m.replace(/^(?:extrae|extraer|activa|activar)\s+/i, "")}`,
    },
    {
        pattern: /^(?:activa|activar)\s+(?!cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+\s+pisos?\s+de).+/i,
        replacement: (m) => `/activar ${m.replace(/^(?:activa|activar)\s+/i, "")}`,
    },
    {
        pattern: /^(?:busca|buscar)\s+.+/i,
        replacement: (m) => `/buscar ${m.replace(/^(?:busca|buscar)\s+/i, "")}`,
    },
    {
        pattern: /^(?:filtro|filtrar)\s+.+/i,
        replacement: (m) => `/filtro ${m.replace(/^(?:filtro|filtrar)\s+/i, "")}`,
    },
    {
        pattern: /^auto\s+(?:on|off|encendido|apagado)\.?$/i,
        replacement: (m) => `/auto ${/\boff\b|apagado/i.test(m) ? "off" : "on"}`,
    },
];
function applyAliases(text, aliases, fullReplace = false) {
    for (const { pattern, replacement } of aliases) {
        if (!pattern.test(text))
            continue;
        if (replacement.startsWith("/"))
            return replacement;
        const rest = text.replace(pattern, replacement).trim();
        if (fullReplace && rest === replacement.trim())
            return replacement;
        return rest;
    }
    return text.trim();
}
function applyFnAliases(text, aliases) {
    for (const { pattern, replacement } of aliases) {
        const m = text.match(pattern);
        if (m)
            return replacement(m[0]).trim();
    }
    return text;
}
function applyPhraseCorrections(text) {
    let out = normalizeSpokenText(text);
    for (const { pattern, replacement } of exports.PHRASE_CORRECTIONS) {
        out = out.replace(pattern, replacement);
    }
    return out.replace(/\s{2,}/g, " ").trim();
}
function normalizeVoiceToAlfredoCommand(text) {
    let out = applyPhraseCorrections(text);
    out = applyAliases(out, exports.ALFREDO_VOICE_ALIASES, true);
    return normalizeSpokenText(out);
}
const JOSE_CMD_PREFIX = /^(activar|buscar|captar|enviar|pendientes|hot|excel|informe|estado|ayuda|filtro|auto|horario|start)\b/i;
function normalizeVoiceToJoseCommand(text) {
    let out = applyPhraseCorrections(text);
    out = applyFnAliases(out, exports.JOSE_VOICE_ALIASES_WITH_ARGS);
    out = applyAliases(out, exports.JOSE_VOICE_ALIASES);
    if (!out)
        return out;
    if (/^\/\w+/i.test(out))
        return out;
    if (/ponte en funcionamiento/i.test(out))
        return out;
    if (JOSE_CMD_PREFIX.test(out))
        return `/${out}`;
    return out;
}
