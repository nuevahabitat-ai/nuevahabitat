import { adminChatPlain, adminChatWithTools, adminLlmConfigured } from './admin-llm.js';
import {
  ADMIN_AGENT_TOOLS,
  collectPanelActionsFromTool,
  executeAdminAgentTool,
} from './admin-agent-tools.js';

const SYSTEM = `Eres el copiloto operativo del panel admin de Nueva Hábitat (inmobiliaria Barcelona).
Puedes LEER y ESCRIBIR en Supabase con herramientas, y MOVER la pantalla del operador (secciones, fichas, compatibles).

CONDUCTA (obligatorio):
1. Prohibido inventar cifras, nombres o precios. Para "cuántos compradores/leads/…" llama SIEMPRE a obtener_resumen_panel o listar_*.
2. Plan en silencio: 1) datos con herramientas 2) acción (actualizar, anotar, inferir) 3) panel_ir_seccion / panel_abrir_* para que lo vea.
3. Antes de PATCH en comprador, indica qué campos cambiarás; luego ejecuta actualizar_comprador o inferir_comprador.
4. Tras cambios en BD, usa panel_actualizar_vista o panel_abrir_comprador.
5. Estados particulares: nuevo, contactado, visita, negociacion, captado, descartado. No borres registros. No WhatsApp masivo.
6. Responde en español: qué hiciste, números exactos de herramientas, siguiente paso concreto.

Herramientas clave: obtener_resumen_panel, listar_compradores, buscar_compradores, ver_comprador, actualizar_comprador, inferir_comprador, enriquecer_comprador_notas, buscar_inmuebles, listar_particulares, panel_*.`;

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
  if (!(await adminLlmConfigured())) {
    return {
      ok: false,
      error:
        'Sin LLM configurado. Ejecuta: node scripts/setup-gemini-integration.mjs y/o node scripts/setup-minimax-integration.mjs',
    };
  }
  const panelActions = [];
  let toolCallCount = 0;
  const execute = async (name, args) => {
    toolCallCount += 1;
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

  const toolRun = await adminChatWithTools({
    system: SYSTEM,
    user,
    history: (history || []).slice(-16),
    tools: ADMIN_AGENT_TOOLS,
    execute,
    maxRounds: 8,
    maxTokens: 1400,
    temperature: 0.25,
  });

  if (toolRun?.text) {
    return {
      ok: true,
      reply: toolRun.text,
      usedTools: toolCallCount > 0,
      toolCalls: toolCallCount,
      provider: toolRun.provider,
      panelActions: dedupePanelActions(panelActions),
    };
  }

  const fallback = await adminChatPlain({
    system:
      SYSTEM +
      '\n⚠️ No pudiste usar herramientas este turno: no des cifras inventadas; pide al operador reformular o di que falló el tool-calling.',
    user,
    maxTokens: 400,
  });
  if (fallback?.text) {
    return {
      ok: true,
      reply: fallback.text,
      usedTools: false,
      toolCalls: 0,
      provider: fallback.provider,
      panelActions: dedupePanelActions(panelActions),
    };
  }

  const hasMini = await import('./minimax-llm.js').then((m) => m.minimaxLlmConfigured());
  return {
    ok: false,
    error: hasMini
      ? 'MiniMax devolvió error (suele ser 402 sin saldo). Gemini se usa como respaldo.'
      : 'El modelo no respondió (revisa cuota o intenta de nuevo).',
  };
}
