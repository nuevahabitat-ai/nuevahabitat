"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertNhPanelComprador = void 0;
exports.createNhComprador = createNhComprador;
exports.listNhCompradores = listNhCompradores;
exports.isNhSupabaseConfigured = isNhSupabaseConfigured;
exports.appendCompradorNota = appendCompradorNota;
exports.listNhParticulares = listNhParticulares;
exports.listNhAlarmas = listNhAlarmas;
exports.addParticularSeguimiento = addParticularSeguimiento;
exports.registerParticularSeguimiento = registerParticularSeguimiento;
const utils_1 = require("./utils");
function apiBase() {
    const base = process.env.NH_PANEL_API_URL ?? "https://www.nuevahabitat.com/api/compradores";
    return base.replace(/\/$/, "");
}
function apiKey() {
    return process.env.NH_PANEL_API_KEY?.trim();
}
async function createNhComprador(input) {
    const key = apiKey();
    if (!key) {
        return { ok: false, status: 500, error: "NH_PANEL_API_KEY no configurada" };
    }
    const telefono = (0, utils_1.normalizePhone)(input.telefono) ?? input.telefono.trim();
    const body = {
        nombre: input.nombre.trim(),
        telefono,
        presupuesto_max: input.presupuesto_max,
        zona_buscada: input.zona_buscada?.trim(),
        habitaciones_min: input.habitaciones_min,
        email: input.email?.trim(),
        notas: input.notas?.trim() ?? "Importado por Alfredo (Telegram)",
    };
    const res = await fetch(apiBase(), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = (await res.json());
    if (!res.ok) {
        return {
            ok: false,
            status: res.status,
            error: data.error ?? data.message ?? `HTTP ${res.status}`,
        };
    }
    if (!data.comprador) {
        return { ok: false, status: 500, error: "Respuesta sin comprador" };
    }
    return { ok: true, comprador: data.comprador };
}
async function listNhCompradores(opts) {
    const key = apiKey();
    if (!key)
        return [];
    const params = new URLSearchParams();
    if (opts?.activo !== false)
        params.set("activo", "true");
    params.set("limit", String(opts?.limit ?? 20));
    const res = await fetch(`${apiBase()}?${params}`, {
        headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok)
        return [];
    const data = (await res.json());
    return data.compradores ?? [];
}
/** Alias documentado en PROMPT-API-COMPRADORES.md */
exports.upsertNhPanelComprador = createNhComprador;
function isNhSupabaseConfigured() {
    return !!sbKey() || !!apiKey();
}
function sbUrl() {
    return (process.env.NH_SUPABASE_URL ??
        process.env.SUPABASE_URL ??
        "https://xxodawayoogthxnjpouq.supabase.co").replace(/\/$/, "");
}
function sbKey() {
    return (process.env.NH_SUPABASE_SERVICE_KEY ??
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.SUPABASE_SERVICE_ROLE)?.trim();
}
function sbHeaders(prefer = "return=representation") {
    const key = sbKey();
    if (!key)
        throw new Error("NH_SUPABASE_SERVICE_KEY no configurada");
    return {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
        Prefer: prefer,
    };
}
async function findCompradorByRef(ref) {
    const list = await listNhCompradores({ limit: 50 });
    if (ref.telefono) {
        const digits = ref.telefono.replace(/\D/g, "").slice(-9);
        const hit = list.find((c) => c.telefono?.replace(/\D/g, "").endsWith(digits));
        if (hit)
            return hit;
    }
    if (ref.nombre) {
        const q = ref.nombre.toLowerCase();
        const hit = list.find((c) => c.nombre.toLowerCase().includes(q) || q.includes(c.nombre.toLowerCase()));
        if (hit)
            return hit;
    }
    return null;
}
function notaRegistraContacto(nota) {
    if (!nota || typeof nota !== "string")
        return false;
    return /\bwhatsapp\b|wa\.me|\bllamad|\bllam[eé]\b|contactad|\bvisita\b|email enviad|\bcontacto\b|seguimiento|telegram/i.test(nota);
}
function compAlarmDateIso(fromDate) {
    const d = fromDate ? new Date(fromDate) : new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString();
}
async function appendCompradorNota(ref) {
    const comprador = await findCompradorByRef(ref);
    if (!comprador)
        return { ok: false, error: "Comprador no encontrado" };
    const stamp = new Date().toLocaleString("es-ES");
    const merged = [comprador.notas, `[${stamp}] ${ref.nota}`].filter(Boolean).join("\n");
    try {
        const key = sbKey();
        if (!key) {
            return { ok: false, error: "NH_SUPABASE_SERVICE_KEY no configurada (necesaria para notas)" };
        }
        const payload = { notas: merged };
        if (notaRegistraContacto(ref.nota)) {
            const now = new Date().toISOString();
            payload.ultimo_contacto_at = now;
            payload.proxima_alarma_at = compAlarmDateIso(now);
        }
        const res = await fetch(`${sbUrl()}/rest/v1/compradores?id=eq.${comprador.id}`, {
            method: "PATCH",
            headers: sbHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok)
            return { ok: false, error: await res.text() };
        const rows = (await res.json());
        return { ok: true, comprador: { ...comprador, ...payload, ...rows[0] } };
    }
    catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
}
async function listNhParticulares(opts) {
    const key = apiKey();
    if (key) {
        try {
            const base = (process.env.NH_PANEL_API_URL ?? "https://www.nuevahabitat.com/api/compradores").replace(/\/compradores\/?$/, "");
            const params = new URLSearchParams({
                mode: opts?.mode ?? "activos",
                limit: String(opts?.limit ?? 30),
            });
            const res = await fetch(`${base}/particulares?${params}`, {
                headers: { Authorization: `Bearer ${key}` },
            });
            if (res.ok) {
                const data = (await res.json());
                return data.particulares ?? [];
            }
        }
        catch {
            /* fallback Supabase directo */
        }
    }
    try {
        const sb = sbKey();
        if (!sb)
            return [];
        const mode = opts?.mode ?? "activos";
        const limit = opts?.limit ?? 30;
        const params = new URLSearchParams({
            select: "id,titulo,telefono,contacto_nombre,zona,municipio,proxima_alarma_at,estado",
            activo: "eq.true",
            estado: "not.in.(captado,descartado)",
            order: "proxima_alarma_at.asc.nullslast,created_at.desc",
            limit: String(limit),
        });
        const now = new Date();
        if (mode === "alarmas") {
            params.set("proxima_alarma_at", `lte.${now.toISOString()}`);
        }
        else if (mode === "hoy") {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            params.set("proxima_alarma_at", `gte.${start.toISOString()}`);
            params.append("proxima_alarma_at", `lte.${end.toISOString()}`);
        }
        const res = await fetch(`${sbUrl()}/rest/v1/particulares?${params}`, { headers: sbHeaders() });
        if (!res.ok)
            return [];
        return (await res.json());
    }
    catch {
        return [];
    }
}
/** Particulares con alarma vencida (proxima_alarma_at <= ahora). */
async function listNhAlarmas(limit = 15) {
    return listNhParticulares({ mode: "alarmas", limit });
}
async function addParticularSeguimiento(input) {
    return registerParticularSeguimiento(input);
}
async function registerParticularSeguimiento(input) {
    try {
        const key = sbKey();
        if (!key)
            return { ok: false, error: "NH_SUPABASE_SERVICE_KEY no configurada" };
        let particular = null;
        let created = false;
        if (input.telefono) {
            const digits = input.telefono.replace(/\D/g, "").slice(-9);
            const q = new URLSearchParams({
                select: "id,titulo,telefono,contacto_nombre,zona,municipio",
                telefono: `ilike.%${digits}`,
                limit: "1",
            });
            const res = await fetch(`${sbUrl()}/rest/v1/particulares?${q}`, { headers: sbHeaders() });
            const rows = (await res.json());
            particular = rows[0] ?? null;
        }
        if (!particular && input.contacto_nombre) {
            const q = new URLSearchParams({
                select: "id,titulo,telefono,contacto_nombre,zona,municipio",
                contacto_nombre: `ilike.%${input.contacto_nombre}%`,
                limit: "1",
            });
            const res = await fetch(`${sbUrl()}/rest/v1/particulares?${q}`, { headers: sbHeaders() });
            const rows = (await res.json());
            particular = rows[0] ?? null;
        }
        if (!particular && input.titulo) {
            const q = new URLSearchParams({
                select: "id,titulo,telefono,contacto_nombre,zona,municipio",
                titulo: `ilike.%${input.titulo}%`,
                limit: "1",
            });
            const res = await fetch(`${sbUrl()}/rest/v1/particulares?${q}`, { headers: sbHeaders() });
            const rows = (await res.json());
            particular = rows[0] ?? null;
        }
        const alarmaDias = input.alarma_dias ?? 7;
        const proxima = new Date();
        proxima.setDate(proxima.getDate() + alarmaDias);
        const proximaIso = proxima.toISOString();
        const nowIso = new Date().toISOString();
        if (!particular) {
            const tel = input.telefono?.replace(/\D/g, "").slice(-9);
            const row = {
                fuente: "manual",
                titulo: input.titulo ?? (input.contacto_nombre ? `Particular ${input.contacto_nombre}` : "Particular Alfredo"),
                contacto_nombre: input.contacto_nombre ?? null,
                telefono: tel ? `+34${tel}` : null,
                zona: input.zona ?? null,
                municipio: input.municipio ?? input.zona ?? "Barcelona",
                estado: input.estado ?? "contactado",
                activo: true,
                ultimo_contacto_at: nowIso,
                proxima_alarma_at: proximaIso,
            };
            const createRes = await fetch(`${sbUrl()}/rest/v1/particulares`, {
                method: "POST",
                headers: sbHeaders(),
                body: JSON.stringify(row),
            });
            if (!createRes.ok)
                return { ok: false, error: await createRes.text() };
            const rows = (await createRes.json());
            particular = rows[0] ?? null;
            created = true;
        }
        if (!particular)
            return { ok: false, error: "No se pudo crear el particular" };
        const segRes = await fetch(`${sbUrl()}/rest/v1/particulares_seguimientos`, {
            method: "POST",
            headers: sbHeaders(),
            body: JSON.stringify({ particular_id: particular.id, comentario: input.comentario }),
        });
        if (!segRes.ok)
            return { ok: false, error: await segRes.text() };
        const patch = {
            ultimo_contacto_at: nowIso,
            proxima_alarma_at: proximaIso,
        };
        if (input.estado)
            patch.estado = input.estado;
        if (input.zona && !particular.zona)
            patch.zona = input.zona;
        if (input.municipio && !particular.municipio)
            patch.municipio = input.municipio;
        if (input.contacto_nombre && !particular.contacto_nombre)
            patch.contacto_nombre = input.contacto_nombre;
        await fetch(`${sbUrl()}/rest/v1/particulares?id=eq.${particular.id}`, {
            method: "PATCH",
            headers: sbHeaders(),
            body: JSON.stringify(patch),
        });
        return {
            ok: true,
            proxima_alarma_at: proxima.toLocaleDateString("es-ES"),
            particular,
            created,
        };
    }
    catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
}
