"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAlfredoText = normalizeAlfredoText;
exports.detectAlfredoIntent = detectAlfredoIntent;
exports.parseNotaComprador = parseNotaComprador;
exports.parseSeguimientoParticular = parseSeguimientoParticular;
exports.executeAlfredoCommand = executeAlfredoCommand;
const nh_panel_1 = require("./nh-panel");
const alfredo_seguimiento_parse_1 = require("./alfredo-seguimiento-parse");
const transcription_1 = require("./transcription");
const alfredo_intent_1 = require("./alfredo-intent");
function normalizeAlfredoText(text) {
    return (0, transcription_1.normalizeVoiceToAlfredoCommand)(text);
}
function detectAlfredoIntent(text) {
    return (0, alfredo_intent_1.detectAlfredoIntentScored)(text);
}
function seguimientosMode(text) {
    const t = normalizeAlfredoText(text).toLowerCase();
    if (/\balarmas\b/.test(t) && !/cu[aá]ntos seguimientos|cu[aá]ntas seguimientos/.test(t))
        return "alarmas";
    if (/seguimientos hoy|\bhoy\b/.test(t))
        return "hoy";
    return "activos";
}
function formatParticularLine(p) {
    const label = p.contacto_nombre ?? p.titulo?.slice(0, 40) ?? "—";
    let line = `• ${label} · ${p.telefono ?? "—"}`;
    if (p.zona ?? p.municipio)
        line += ` · ${p.zona ?? p.municipio}`;
    if (p.estado)
        line += ` · ${p.estado}`;
    if (p.proxima_alarma_at) {
        line += ` · alarma ${new Date(p.proxima_alarma_at).toLocaleDateString("es-ES")}`;
    }
    return line;
}
function parseNotaComprador(text) {
    const t = normalizeAlfredoText(text);
    const m = t.match(/(?:seguimiento|nota)\s+(?:comprador\s+)?(.+?)\s*[:,-]\s*(.+)$/i) ||
        t.match(/(?:seguimiento|nota)\s+(?:de\s+)?([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+(.+)$/i) ||
        t.match(/^(.+?)\s*[:,-]\s*(hay que cualificar.+)$/i);
    if (!m)
        return null;
    const ref = m[1].trim();
    const nota = m[2].trim();
    const tel = ref.replace(/\D/g, "");
    if (tel.length >= 9)
        return { telefono: tel, nota };
    return { nombre: ref, nota };
}
function parseSeguimientoParticular(text) {
    const t = normalizeAlfredoText(text);
    const m = t.match(/particular(?:\s+en|\s+tel[eé]fono|\s+)?(.+?)\s*[:,-]\s*(.+)$/i) ||
        t.match(/seguimiento particular\s+(.+?)\s*[:,-]\s*(.+)$/i);
    if (!m)
        return null;
    const ref = m[1].trim();
    const tel = ref.replace(/\D/g, "");
    if (tel.length >= 9)
        return { telefono: tel, comentario: m[2].trim() };
    return { titulo: ref, comentario: m[2].trim() };
}
async function executeAlfredoCommand(text) {
    const intent = await (0, alfredo_intent_1.resolveAlfredoIntent)(text);
    if (intent === "ayuda") {
        return ("Alfredo — Nueva Habitat\n\n" +
            "Habla natural:\n" +
            "• hazme una lista de compradores · cuántos compradores activos · qué clientes tenemos\n" +
            "• cuántos seguimientos tenemos · seguimientos hoy · alarmas · compatibles\n" +
            "• nuevo comprador José Martínez, 250.000 euros, Hospitalet, 3 habitaciones con ascensor, teléfono 612…\n" +
            "• nuevo seguimiento Carmen, teléfono 612…, Hospitalet, contactado, alarma en 3 días\n" +
            "• Seguimiento particular José: hay que cualificar financieramente\n\n" +
            "También: /alfredo ayuda · /listar · /alarmas");
    }
    if (intent === "listar_compradores") {
        if (!process.env.NH_PANEL_API_KEY?.trim()) {
            return "No puedo consultar el panel: falta NH_PANEL_API_KEY en el servidor.";
        }
        const list = await (0, nh_panel_1.listNhCompradores)({ limit: 30 });
        if (!list.length)
            return "Sin compradores activos.";
        const activos = list.filter((c) => c.activo !== false);
        const t = normalizeAlfredoText(text).toLowerCase();
        const countOnly = /cu[aá]ntos|cu[aá]ntas|n[uú]mero de/.test(t) && !/lista|listar|hazme/.test(t);
        if (countOnly) {
            return `Tenemos ${activos.length} comprador${activos.length === 1 ? "" : "es"} activo${activos.length === 1 ? "" : "s"}.`;
        }
        const lines = activos.map((c) => `• ${c.nombre} · ${c.telefono}` +
            (c.presupuesto_max ? ` · ${c.presupuesto_max.toLocaleString("es-ES")} €` : "") +
            (c.zona_buscada ? ` · ${c.zona_buscada}` : ""));
        return `Compradores activos (${activos.length}):\n\n${lines.join("\n")}`;
    }
    if (intent === "listar_alarmas") {
        if (!process.env.NH_PANEL_API_KEY?.trim() && !(0, nh_panel_1.isNhSupabaseConfigured)()) {
            return "No puedo consultar seguimientos: falta NH_PANEL_API_KEY o Supabase en el servidor.";
        }
        const mode = seguimientosMode(text);
        const items = await (0, nh_panel_1.listNhParticulares)({ mode, limit: 50 });
        const t = normalizeAlfredoText(text).toLowerCase();
        const countOnly = /cu[aá]ntos|cu[aá]ntas|n[uú]mero de/.test(t) && !/lista|listar|hazme/.test(t);
        const labels = {
            activos: "seguimiento",
            alarmas: "alarma",
            hoy: "seguimiento para hoy",
        };
        const label = labels[mode];
        if (!items.length) {
            if (mode === "alarmas")
                return "Sin alarmas de contacto vencidas.";
            if (mode === "hoy")
                return "Sin seguimientos programados para hoy.";
            return "Sin particulares en seguimiento activo.";
        }
        if (countOnly) {
            const n = items.length;
            return `Tenemos ${n} ${label}${n === 1 ? "" : "s"} activo${n === 1 ? "" : "s"}.`;
        }
        const header = mode === "alarmas"
            ? `Alarmas vencidas (${items.length})`
            : mode === "hoy"
                ? `Seguimientos hoy (${items.length})`
                : `Particulares en seguimiento (${items.length})`;
        return `${header}:\n\n${items.map(formatParticularLine).join("\n")}`;
    }
    if (intent === "nota_comprador") {
        const parsed = parseNotaComprador(text);
        if (!parsed) {
            return "Di: «Seguimiento Sergi: hay que cualificar financieramente» o «Nota comprador 612345678: en contacto»";
        }
        const res = await (0, nh_panel_1.appendCompradorNota)(parsed);
        if (!res.ok)
            return `Error: ${res.error}`;
        return `Nota guardada en ${res.comprador?.nombre ?? "comprador"}:\n«${parsed.nota}»`;
    }
    if (intent === "seguimiento_particular") {
        const parsed = (0, alfredo_seguimiento_parse_1.parseSeguimientoFromText)(normalizeAlfredoText(text)) ?? parseSeguimientoParticular(text);
        if (!parsed) {
            return ("No entendí el seguimiento. Ejemplos:\n" +
                "«Nuevo seguimiento Carmen, teléfono 612345678, Hospitalet, contactado, llamé sin respuesta, alarma en 3 días»\n" +
                "«Seguimiento particular José: hay que cualificar financieramente»");
        }
        const comentario = "comentario" in parsed && parsed.comentario
            ? parsed.comentario
            : parsed.comentario;
        const input = "alarma_dias" in parsed
            ? {
                telefono: parsed.telefono,
                contacto_nombre: parsed.contacto_nombre,
                titulo: parsed.titulo,
                zona: parsed.zona,
                municipio: parsed.municipio,
                comentario: parsed.comentario ?? comentario,
                alarma_dias: parsed.alarma_dias,
                estado: parsed.estado,
            }
            : {
                telefono: parsed.telefono,
                titulo: parsed.titulo,
                comentario,
            };
        if (!input.telefono && !input.contacto_nombre && !input.titulo) {
            const label = ("contacto_nombre" in parsed && parsed.contacto_nombre) ||
                parsed.titulo ||
                "particular";
            return (`Entendido seguimiento para ${label}` +
                (parsed.comentario ? `: «${parsed.comentario}»` : "") +
                `\n\nFalta teléfono o nombre para guardarlo. Di: «teléfono 612345678» o repite con el móvil incluido.`);
        }
        const res = await (0, nh_panel_1.addParticularSeguimiento)(input);
        if (!res.ok)
            return `Error: ${res.error}`;
        const label = res.particular?.contacto_nombre ?? res.particular?.titulo ?? input.contacto_nombre ?? "particular";
        return (`${res.created ? "Seguimiento creado" : "Seguimiento registrado"} — ${label}\n` +
            `«${input.comentario}»\n` +
            `Próxima alarma: ${res.proxima_alarma_at ?? "7 días"}\n\n` +
            `Panel: https://www.nuevahabitat.com/admin-panel`);
    }
    if (intent === "crear_comprador") {
        const cleaned = text.replace(/^\/nuevo\s+/i, "").trim();
        const slash = cleaned.match(/^\/comprador\s*(.+)$/i);
        let input = null;
        if (slash) {
            const parts = slash[1].split("|").map((p) => p.trim());
            if (parts.length >= 2) {
                input = {
                    nombre: parts[0],
                    telefono: parts[1],
                    presupuesto_max: parts[2] ? Number(parts[2].replace(/\D/g, "")) : undefined,
                    zona_buscada: parts[3],
                    habitaciones_min: parts[4] ? Number(parts[4].replace(/\D/g, "")) : undefined,
                };
            }
        }
        input ??= (0, alfredo_intent_1.parseCompradorForIntent)(cleaned) ?? (0, alfredo_intent_1.parseCompradorForIntent)(text);
        if (!input?.nombre) {
            return ("No entendí el comprador. Ejemplo:\n" +
                "«Nuevo comprador José Martínez, 250.000 euros, busca piso en Hospitalet, tres habitaciones con ascensor, teléfono 612345678»");
        }
        if (!input.telefono) {
            return (`Entendido: ${input.nombre}` +
                (input.presupuesto_max ? ` · ${input.presupuesto_max.toLocaleString("es-ES")} €` : "") +
                (input.zona_buscada ? ` · ${input.zona_buscada}` : "") +
                (input.habitaciones_min ? ` · ${input.habitaciones_min} hab` : "") +
                (input.notas?.includes("ascensor") ? " · ascensor" : "") +
                `\n\nFalta el teléfono para guardarlo en el panel. Dime: «teléfono 612345678» o repite con el móvil incluido.`);
        }
        const result = await (0, nh_panel_1.createNhComprador)(input);
        if (!result.ok) {
            if (result.status === 409) {
                const nota = input.notas ?? `Alta repetida vía Alfredo: ${new Date().toLocaleDateString("es-ES")}`;
                const upd = await (0, nh_panel_1.appendCompradorNota)({ telefono: input.telefono, nota });
                if (upd.ok)
                    return `Ya existía. Nota añadida a ${upd.comprador?.nombre}.`;
                return "Ya existe un comprador con ese teléfono.";
            }
            return `Error: ${result.error}`;
        }
        const c = result.comprador;
        return (`Comprador creado\n\n${c.nombre}\n${c.telefono}` +
            (c.zona_buscada ? `\nZona: ${c.zona_buscada}` : "") +
            (c.presupuesto_max ? `\nPresupuesto: ${c.presupuesto_max.toLocaleString("es-ES")} €` : "") +
            (c.habitaciones_min ? `\nHabitaciones: ${c.habitaciones_min}` : "") +
            (input.notas && input.notas !== "Importado por Alfredo (Telegram)" ? `\nNotas: ${input.notas}` : "") +
            `\n\nPanel: https://www.nuevahabitat.com/admin-panel`);
    }
    return ("No entendí ese mensaje. Usa un comando de la lista.\n\n" +
        "Habla natural: hazme una lista de compradores · cuántos compradores activos · qué clientes tenemos · " +
        "cuántos seguimientos tenemos · seguimientos hoy · alarmas · compatibles · " +
        "agrega comprador Ana teléfono 600… presupuesto 200000 zona Eixample 3 hab\n\n" +
        "También: /alfredo ayuda");
}
