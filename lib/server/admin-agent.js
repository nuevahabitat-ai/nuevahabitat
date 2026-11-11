import { geminiChatWithTools, geminiChatPlain, geminiLlmConfigured } from './gemini-llm.js';
import {
  ADMIN_AGENT_TOOLS,
  collectPanelActionsFromTool,
  executeAdminAgentTool,
} from './admin-agent-tools.js';

const SYSTEM = `Eres el asistente del panel admin de Nueva Hábitat (inmobiliaria Barcelona).
Ayudas al operador con compradores, particulares (seguimientos captación), criterios de búsqueda y notas.
REGLAS:
- Usa las herramientas para leer o escribir datos; no inventes teléfonos ni precios.
- Antes de actualizar una ficha, resume qué vas a cambiar.
- Estados particulares válidos: nuevo, contactado, visita, negociacion, captado, descartado.
- No elimines registros. No envíes WhatsApp masivo.
- Puedes usar panel_ir_seccion, panel_abrir_comprador y panel_ver_compatibles para que el operador vea los cambios en pantalla.
- Responde en español, breve y operativo.`;

function dedupePanelActions(actions) {
  const seen = new Set();
  return (actions || []).filter((a) => {
    const k = JSON.stringify(a);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function runAdminAgentChat({ message, history, context }) {
  if (!(await geminiLlmConfigured())) {
    return {
      ok: false,
      error:
        'GEMINI_API_KEY no configurada (Vercel o Supabase private_integrations). Ejecuta: node scripts/setup-gemini-integration.mjs',
    };
  }
  const panelActions = [];
  const execute = async (name, args) => {
    const result = await executeAdminAgentTool(name, args);
    collectPanelActionsFromTool(name, args, result, panelActions);
    return result;
  };
  const user = [
    context?.section ? `Sección panel: ${context.section}` : '',
    context?.compradorId ? `Comprador abierto: ${context.compradorId}` : '',
    context?.particularId ? `Particular abierto: ${context.particularId}` : '',
    `Mensaje operador: ${String(message || '').slice(0, 4000)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const reply = await geminiChatWithTools({
    system: SYSTEM,
    user,
    history: (history || []).slice(-12),
    tools: ADMIN_AGENT_TOOLS,
    execute,
    maxRounds: 4,
    maxTokens: 900,
    temperature: 0.35,
  });

  if (reply) return { ok: true, reply, usedTools: true, panelActions: dedupePanelActions(panelActions) };

  const fallback = await geminiChatPlain({
    system: SYSTEM + '\nNo tienes herramientas en este turno; solo orienta.',
    user,
    maxTokens: 600,
  });
  if (fallback)
    return { ok: true, reply: fallback, usedTools: false, panelActions: dedupePanelActions(panelActions) };

  return {
    ok: false,
    error:
      'Gemini no respondió (revisa modelo o cuota). Por defecto usamos gemini-3-flash-preview.',
  };
}
