/**
 * Herramientas del agente panel (Supabase service role).
 */
import { SB_URL, svcHeaders } from './supabase-server.js';
import { findCompradorByTelefono } from './compradores-api.js';
import { enrichCompradorFromTextos } from './alfredo-ficha-enrich.js';
import { inferCompradorCriterios } from './comprador-infer-criterios.js';
import { listParticulares } from './particulares-api.js';
import { parseWhatsappCompradorPatch } from './alfredo-comprador-parse.js';
import { listCompradores } from './compradores-api.js';
import { getPanelResumen } from './admin-agent-stats.js';

const COMPRADOR_PATCH_KEYS = new Set([
  'nombre',
  'email',
  'zona_buscada',
  'presupuesto_max',
  'presupuesto_min',
  'habitaciones_min',
  'm2_min',
  'banos_min',
  'ascensor',
  'balcon_terraza_indispensable',
  'exterior_indispensable',
  'tipo_inmueble',
  'activo',
]);

export const ADMIN_AGENT_TOOLS = [
  {
    function: {
      name: 'obtener_resumen_panel',
      description:
        'Cifras reales: total compradores, activos, sin presupuesto, inmuebles publicados, particulares, leads. USAR antes de responder cuántos hay.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    function: {
      name: 'listar_compradores',
      description: 'Lista compradores recientes (activos/inactivos/todos) con límite',
      parameters: {
        type: 'object',
        properties: {
          activo: { type: 'boolean' },
          sin_presupuesto: { type: 'boolean', description: 'Solo sin presupuesto_max' },
          limit: { type: 'number' },
        },
      },
    },
  },
  {
    function: {
      name: 'buscar_inmuebles',
      description: 'Busca inmuebles por ref NH, barrio, municipio o título',
      parameters: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number' },
        },
        required: ['q'],
      },
    },
  },
  {
    function: {
      name: 'enriquecer_comprador_notas',
      description: 'Re-parsea notas e interés Idealista del comprador y rellena criterios vacíos (Alfredo)',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  },
  {
    function: {
      name: 'buscar_compradores',
      description: 'Buscar compradores por nombre, teléfono o texto en zona/notas',
      parameters: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Texto de búsqueda' },
          limit: { type: 'number' },
        },
        required: ['q'],
      },
    },
  },
  {
    function: {
      name: 'ver_comprador',
      description: 'Ficha de un comprador por id uuid o teléfono +34',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          telefono: { type: 'string' },
        },
      },
    },
  },
  {
    function: {
      name: 'actualizar_comprador',
      description: 'Actualiza criterios del comprador (solo campos enviados)',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          patch: { type: 'object' },
        },
        required: ['id', 'patch'],
      },
    },
  },
  {
    function: {
      name: 'anotar_comprador',
      description: 'Añade línea al historial de notas del comprador',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nota: { type: 'string' },
        },
        required: ['id', 'nota'],
      },
    },
  },
  {
    function: {
      name: 'inferir_comprador',
      description: 'Infiere presupuesto min/max y criterios desde pisos consultados',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  },
  {
    function: {
      name: 'parsear_criterios_comprador',
      description: 'Extrae criterios desde texto libre (cuestionario) y opcionalmente guarda',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          texto: { type: 'string' },
          guardar: { type: 'boolean' },
        },
        required: ['id', 'texto'],
      },
    },
  },
  {
    function: {
      name: 'listar_particulares',
      description: 'Lista particulares seguimiento: mode activos|alarmas|hoy',
      parameters: {
        type: 'object',
        properties: {
          mode: { type: 'string', enum: ['activos', 'alarmas', 'hoy'] },
          limit: { type: 'number' },
        },
      },
    },
  },
  {
    function: {
      name: 'anotar_particular',
      description: 'Inserta comentario en particulares_seguimientos y opcional estado',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          comentario: { type: 'string' },
          estado: { type: 'string' },
        },
        required: ['id', 'comentario'],
      },
    },
  },
  {
    function: {
      name: 'panel_ir_seccion',
      description:
        'Cambia la vista del panel del operador (compradores, seguimientos, leads, inmuebles, dashboard…)',
      parameters: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: [
              'dashboard',
              'leads',
              'compradores',
              'inmuebles',
              'seguimientos',
              'visitas',
              'finanzas',
              'configuraciones',
            ],
          },
        },
        required: ['section'],
      },
    },
  },
  {
    function: {
      name: 'panel_abrir_comprador',
      description: 'Abre la ficha modal del comprador en el panel del operador',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  },
  {
    function: {
      name: 'panel_ver_compatibles',
      description: 'Muestra inmuebles compatibles para un comprador en el panel',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  },
  {
    function: {
      name: 'panel_abrir_particular',
      description: 'Abre ficha de particular en seguimientos',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  },
  {
    function: {
      name: 'panel_actualizar_vista',
      description: 'Recarga datos en pantalla (compradores, seguimientos, inmuebles, dashboard, leads)',
      parameters: {
        type: 'object',
        properties: {
          target: {
            type: 'string',
            enum: ['dashboard', 'compradores', 'seguimientos', 'inmuebles', 'leads'],
          },
        },
        required: ['target'],
      },
    },
  },
];

const PANEL_SECTIONS = new Set([
  'dashboard',
  'leads',
  'compradores',
  'inmuebles',
  'seguimientos',
  'visitas',
  'finanzas',
  'configuraciones',
]);

/** @param {string} resultStr @param {{ type: string, [k: string]: unknown }[]} out */
export function collectPanelActionsFromTool(name, args, resultStr, out) {
  let data;
  try {
    data = JSON.parse(resultStr);
  } catch {
    return;
  }
  if (data?.panelAction && data.panelAction.type) out.push(data.panelAction);

  if (!data?.ok) return;
  const id = args?.id || data.comprador?.id;

  if (
    name === 'actualizar_comprador' ||
    name === 'inferir_comprador' ||
    name === 'anotar_comprador' ||
    (name === 'parsear_criterios_comprador' && args?.guardar)
  ) {
    out.push({ type: 'refresh_compradores' });
    if (id) out.push({ type: 'open_comprador', id });
  }
  if (name === 'buscar_compradores' && data.compradores?.length === 1) {
    out.push({ type: 'open_comprador', id: data.compradores[0].id });
  }
  if (name === 'anotar_particular') out.push({ type: 'refresh_particulares' });
  if (name === 'listar_particulares') out.push({ type: 'goto_section', section: 'seguimientos' });
  if (name === 'enriquecer_comprador_notas' || name === 'inferir_comprador') {
    if (id) out.push({ type: 'open_comprador', id });
  }
  if (name === 'panel_actualizar_vista' && args?.target) {
    out.push({ type: 'refresh_view', target: args.target });
    if (args.target !== 'dashboard') out.push({ type: 'goto_section', section: args.target });
  }
  if (name === 'panel_abrir_particular' && args?.id) {
    out.push({ type: 'open_particular', id: args.id });
  }
  if (name === 'obtener_resumen_panel') out.push({ type: 'refresh_view', target: 'dashboard' });
}

async function getCompradorById(id) {
  const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, {
    headers: svcHeaders(),
  });
  const rows = await res.json();
  return rows?.[0] || null;
}

export async function executeAdminAgentTool(name, args) {
  const a = args || {};
  try {
    switch (name) {
      case 'obtener_resumen_panel':
        return JSON.stringify(await getPanelResumen());
      case 'listar_compradores': {
        const limit = Math.min(Number(a.limit) || 25, 50);
        let rows = await listCompradores({
          activo: a.activo === true ? true : a.activo === false ? false : undefined,
          limit,
        });
        if (a.sin_presupuesto) rows = rows.filter((c) => c.presupuesto_max == null);
        return JSON.stringify({ ok: true, total_listado: rows.length, compradores: rows });
      }
      case 'buscar_inmuebles': {
        const q = String(a.q || '').trim().slice(0, 60);
        const limit = Math.min(Number(a.limit) || 15, 25);
        const pat = encodeURIComponent(`%${q}%`);
        const or = [
          `ref.ilike.${pat}`,
          `barrio.ilike.${pat}`,
          `municipio.ilike.${pat}`,
          `titulo.ilike.${pat}`,
        ].join(',');
        const res = await fetch(
          `${SB_URL}/rest/v1/inmuebles?or=(${or})&select=id,ref,titulo,precio,barrio,municipio,publicado,habitaciones&order=created_at.desc&limit=${limit}`,
          { headers: svcHeaders() },
        );
        const rows = await res.json();
        return JSON.stringify({ ok: true, inmuebles: rows });
      }
      case 'enriquecer_comprador_notas': {
        const c = await getCompradorById(a.id);
        if (!c) return JSON.stringify({ ok: false, error: 'No encontrado' });
        const textos = [c.notas].filter(Boolean);
        const interesRes = await fetch(
          `${SB_URL}/rest/v1/comprador_inmueble_interes?comprador_id=eq.${encodeURIComponent(a.id)}&select=mensaje,descripcion&limit=30`,
          { headers: svcHeaders() },
        );
        const interes = await interesRes.json();
        for (const row of interes || []) {
          if (row.mensaje) textos.push(row.mensaje);
          if (row.descripcion) textos.push(row.descripcion);
        }
        const r = await enrichCompradorFromTextos(c, textos, { skipNotaRespuesta: false });
        return JSON.stringify({ ok: true, enrich: r });
      }
      case 'buscar_compradores': {
        const q = String(a.q || '').trim().slice(0, 80);
        const limit = Math.min(Number(a.limit) || 15, 25);
        const pat = encodeURIComponent(`%${q}%`);
        const or = [
          `nombre.ilike.${pat}`,
          `telefono.ilike.${pat}`,
          `zona_buscada.ilike.${pat}`,
        ].join(',');
        const res = await fetch(
          `${SB_URL}/rest/v1/compradores?or=(${or})&select=id,nombre,telefono,presupuesto_max,presupuesto_min,zona_buscada,activo&limit=${limit}`,
          { headers: svcHeaders() },
        );
        const rows = await res.json();
        return JSON.stringify({ ok: true, compradores: rows });
      }
      case 'ver_comprador': {
        let c = null;
        if (a.id) c = await getCompradorById(a.id);
        else if (a.telefono) c = await findCompradorByTelefono(a.telefono);
        if (!c) return JSON.stringify({ ok: false, error: 'No encontrado' });
        const brief = { ...c };
        if (brief.notas) brief.notas = String(brief.notas).slice(-1200);
        return JSON.stringify({ ok: true, comprador: brief });
      }
      case 'actualizar_comprador': {
        const id = a.id;
        const raw = a.patch || {};
        const patch = {};
        for (const [k, v] of Object.entries(raw)) {
          if (COMPRADOR_PATCH_KEYS.has(k)) patch[k] = v;
        }
        if (!Object.keys(patch).length) return JSON.stringify({ ok: false, error: 'patch vacío' });
        const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { ...svcHeaders(), Prefer: 'return=representation' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) return JSON.stringify({ ok: false, error: await res.text() });
        const rows = await res.json();
        return JSON.stringify({ ok: true, comprador: rows?.[0] });
      }
      case 'anotar_comprador': {
        const c = await getCompradorById(a.id);
        if (!c) return JSON.stringify({ ok: false, error: 'No encontrado' });
        const stamp = new Date().toLocaleString('es-ES');
        const nota = `[${stamp}] Asistente NH: ${String(a.nota || '').slice(0, 800)}`;
        const merged = [c.notas, nota].filter(Boolean).join('\n');
        const res = await fetch(`${SB_URL}/rest/v1/compradores?id=eq.${encodeURIComponent(a.id)}`, {
          method: 'PATCH',
          headers: svcHeaders(),
          body: JSON.stringify({ notas: merged, ultimo_contacto_at: new Date().toISOString() }),
        });
        if (!res.ok) return JSON.stringify({ ok: false, error: await res.text() });
        return JSON.stringify({ ok: true });
      }
      case 'inferir_comprador': {
        const c = await getCompradorById(a.id);
        if (!c) return JSON.stringify({ ok: false, error: 'No encontrado' });
        return JSON.stringify(await inferCompradorCriterios(c, {}));
      }
      case 'parsear_criterios_comprador': {
        const c = await getCompradorById(a.id);
        if (!c) return JSON.stringify({ ok: false, error: 'No encontrado' });
        const parsed = parseWhatsappCompradorPatch(String(a.texto || ''));
        if (a.guardar) {
          const r = await enrichCompradorFromTextos(c, [a.texto], { skipNotaRespuesta: false });
          return JSON.stringify({ ok: true, parsed, enrich: r });
        }
        return JSON.stringify({ ok: true, parsed });
      }
      case 'listar_particulares': {
        const rows = await listParticulares({ mode: a.mode || 'activos', limit: a.limit || 20 });
        return JSON.stringify({ ok: true, particulares: rows });
      }
      case 'anotar_particular': {
        const comentario = `Asistente NH: ${String(a.comentario || '').slice(0, 600)}`;
        const ins = await fetch(`${SB_URL}/rest/v1/particulares_seguimientos`, {
          method: 'POST',
          headers: svcHeaders(),
          body: JSON.stringify({
            particular_id: a.id,
            comentario,
            created_at: new Date().toISOString(),
          }),
        });
        if (!ins.ok) return JSON.stringify({ ok: false, error: await ins.text() });
        const up = { ultimo_contacto_at: new Date().toISOString() };
        if (a.estado) up.estado = a.estado;
        await fetch(`${SB_URL}/rest/v1/particulares?id=eq.${encodeURIComponent(a.id)}`, {
          method: 'PATCH',
          headers: svcHeaders(),
          body: JSON.stringify(up),
        });
        return JSON.stringify({ ok: true });
      }
      case 'panel_ir_seccion': {
        const section = String(a.section || '').trim();
        if (!PANEL_SECTIONS.has(section)) {
          return JSON.stringify({ ok: false, error: 'sección no válida' });
        }
        return JSON.stringify({ ok: true, panelAction: { type: 'goto_section', section } });
      }
      case 'panel_abrir_comprador': {
        const cid = String(a.id || '').trim();
        if (!cid) return JSON.stringify({ ok: false, error: 'id requerido' });
        return JSON.stringify({ ok: true, panelAction: { type: 'open_comprador', id: cid } });
      }
      case 'panel_ver_compatibles': {
        const cid = String(a.id || '').trim();
        if (!cid) return JSON.stringify({ ok: false, error: 'id requerido' });
        return JSON.stringify({
          ok: true,
          panelAction: { type: 'compatibles_comprador', id: cid },
        });
      }
      case 'panel_abrir_particular': {
        const pid = String(a.id || '').trim();
        if (!pid) return JSON.stringify({ ok: false, error: 'id requerido' });
        return JSON.stringify({ ok: true, panelAction: { type: 'open_particular', id: pid } });
      }
      case 'panel_actualizar_vista': {
        const target = String(a.target || '').trim();
        if (!['dashboard', 'compradores', 'seguimientos', 'inmuebles', 'leads'].includes(target)) {
          return JSON.stringify({ ok: false, error: 'target inválido' });
        }
        return JSON.stringify({
          ok: true,
          panelAction: { type: 'refresh_view', target },
        });
      }
      default:
        return JSON.stringify({ ok: false, error: `Tool desconocida: ${name}` });
    }
  } catch (e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}
