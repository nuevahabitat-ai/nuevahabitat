/**
 * MiniMax — API OpenAI-compatible (chat + tools).
 * MINIMAX_API_KEY en env o private_integrations.minimax_api_key
 */
import { getIntegrationSecret } from './integration-secrets.js';

const DEFAULT_BASE = 'https://api.minimax.io/v1';
const DEFAULT_MODELS = [
  'MiniMax-M3.1-Flash',
  'MiniMax-M2.5',
  'MiniMax-M2.5-highspeed',
];

let _keyCache = { at: 0, key: null };

function baseUrl() {
  const b = String(process.env.MINIMAX_API_BASE || DEFAULT_BASE).trim().replace(/\/$/, '');
  return b || DEFAULT_BASE;
}

function modelList() {
  const extra = [process.env.MINIMAX_MODEL, process.env.MINIMAX_CHAT_MODEL].filter(Boolean);
  return [...new Set([...extra, ...DEFAULT_MODELS])];
}

export async function resolveMiniMaxApiKey() {
  const fromEnv = process.env.MINIMAX_API_KEY?.trim();
  if (fromEnv && fromEnv.length > 10) return fromEnv;
  const now = Date.now();
  if (now - _keyCache.at < 30_000 && _keyCache.key) return _keyCache.key;
  const fromDb = await getIntegrationSecret('MINIMAX_API_KEY');
  _keyCache = { at: now, key: fromDb && fromDb.length > 10 ? fromDb : null };
  return _keyCache.key;
}

export async function minimaxLlmConfigured() {
  return !!(await resolveMiniMaxApiKey());
}

function openAiTools(declarations) {
  return (declarations || []).map((fn) => ({
    type: 'function',
    function: fn,
  }));
}

function toOpenAiMessages({ system, user, history }) {
  const messages = [{ role: 'system', content: system }];
  for (const turn of history || []) {
    if (turn.role === 'system') continue;
    messages.push({
      role: turn.role === 'assistant' ? 'assistant' : 'user',
      content: turn.content,
    });
  }
  messages.push({ role: 'user', content: user });
  return messages;
}

function toFunctionDeclarations(tools) {
  return (tools || []).map((t) => ({
    name: t.function.name,
    description: t.function.description,
    parameters: t.function.parameters,
  }));
}

async function postChat(apiKey, body) {
  const res = await fetch(`${baseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45_000),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/**
 * @param {{ system: string, user: string, maxTokens?: number, temperature?: number, history?: object[] }} opts
 */
export async function minimaxChatPlain(opts) {
  const apiKey = await resolveMiniMaxApiKey();
  if (!apiKey) return null;

  const messages = toOpenAiMessages(opts);

  for (const model of modelList()) {
    try {
      const { res, data } = await postChat(apiKey, {
        model,
        messages,
        temperature: opts.temperature ?? 0.35,
        max_completion_tokens: opts.maxTokens ?? 700,
      });
      if (!res.ok) continue;
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * @param {{ system: string, user: string, history?: object[], tools: object[], execute: Function, maxTokens?: number, maxRounds?: number, temperature?: number }} opts
 */
export async function minimaxChatWithTools(opts) {
  const apiKey = await resolveMiniMaxApiKey();
  if (!apiKey || !opts.tools?.length) return null;

  const declarations = toFunctionDeclarations(opts.tools);
  const openaiTools = openAiTools(declarations);
  const messages = toOpenAiMessages(opts);
  const maxRounds = opts.maxRounds ?? 5;

  for (const model of modelList()) {
    let roundMessages = [...messages];
    try {
      for (let round = 0; round < maxRounds; round++) {
        const { res, data } = await postChat(apiKey, {
          model,
          messages: roundMessages,
          tools: openaiTools,
          tool_choice: 'auto',
          temperature: opts.temperature ?? 0.35,
          max_completion_tokens: opts.maxTokens ?? 900,
        });
        if (!res.ok) break;

        const msg = data.choices?.[0]?.message;
        if (!msg) break;

        const toolCalls = msg.tool_calls;
        if (!toolCalls?.length) {
          const text = String(msg.content || '').trim();
          if (text) return text;
          break;
        }

        roundMessages.push({
          role: 'assistant',
          content: msg.content || null,
          tool_calls: toolCalls,
        });

        for (const tc of toolCalls) {
          const name = tc.function?.name;
          let fargs = {};
          try {
            fargs = JSON.parse(tc.function?.arguments || '{}');
          } catch {
            fargs = {};
          }
          const result = await opts.execute(name, fargs);
          roundMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: String(result).slice(0, 8000),
          });
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}
