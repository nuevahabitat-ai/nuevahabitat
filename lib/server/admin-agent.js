import { geminiChatWithTools, geminiChatPlain } from './gemini-llm.js';
import { ADMIN_AGENT_TOOLS, executeAdminAgentTool } from './admin-agent-tools.js';

const SYSTEM = `Eres el asistente del panel admin de Nueva Hábitat (inmobiliaria Barcelona).
Ayudas al operador con compradores, particulares (seguimientos captación), criterios de búsqueda y notas.
REGLAS:
- Usa las herramientas para leer o escribir datos; no inventes teléfonos ni precios.
- Antes de actualizar una ficha, resume qué vas a cambiar.
- Estados particulares válidos: nuevo, contactado, visita, negociacion, captado, descartado.
- No elimines registros. No envíes WhatsApp masivo.
- Responde en español, breve y operativo.`;

export async function runAdminAgentChat({ message, history, context }) {
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
    execute: (name, args) => executeAdminAgentTool(name, args),
    maxRounds: 4,
    maxTokens: 900,
    temperature: 0.35,
  });

  if (reply) return { ok: true, reply, usedTools: true };

  const fallback = await geminiChatPlain({
    system: SYSTEM + '\nNo tienes herramientas en este turno; solo orienta.',
    user,
    maxTokens: 600,
  });
  if (fallback) return { ok: true, reply: fallback, usedTools: false };

  return {
    ok: false,
    error: 'GEMINI_API_KEY no configurada en el servidor o modelo no disponible.',
  };
}
