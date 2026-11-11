/**
 * Gemini Flash (servidor) — parseo comprador y futuro agente panel.
 * GEMINI_API_KEY solo en Vercel / .env.local (nunca en repo).
 */

const GEMINI_MODELS = [
  process.env.GEMINI_CHAT_MODEL,
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
].filter(Boolean);

function geminiApiKey() {
  const k = process.env.GEMINI_API_KEY?.trim();
  return k && k.length > 10 ? k : null;
}

export function alfredoBuyerWaLlmEnabled() {
  const v = process.env.ALFREDO_WA_LLM?.trim();
  if (v === '0' || v === 'false') return false;
  return !!geminiApiKey();
}

/**
 * @param {{ system: string, user: string, maxTokens?: number, temperature?: number }} opts
 * @returns {Promise<string|null>}
 */
export async function geminiChatPlain(opts) {
  const apiKey = geminiApiKey();
  if (!apiKey) return null;

  const contents = [{ role: 'user', parts: [{ text: opts.user }] }];

  for (const model of [...new Set(GEMINI_MODELS)]) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: opts.system }] },
            contents,
            generationConfig: {
              temperature: opts.temperature ?? 0.35,
              maxOutputTokens: opts.maxTokens ?? 700,
            },
          }),
          signal: AbortSignal.timeout(28_000),
        },
      );
      if (!res.ok) continue;
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts ?? [];
      const text = parts
        .map((p) => p.text)
        .filter(Boolean)
        .join('\n')
        .trim();
      if (text) return text;
    } catch {
      continue;
    }
  }
  return null;
}

function toFunctionDeclarations(tools) {
  return (tools || []).map((t) => ({
    name: t.function.name,
    description: t.function.description,
    parameters: t.function.parameters,
  }));
}

/**
 * @param {{ system: string, user: string, history?: {role:string,content:string}[], tools: object[], execute: Function, maxTokens?: number, maxRounds?: number, temperature?: number }} opts
 */
export async function geminiChatWithTools(opts) {
  const apiKey = geminiApiKey();
  if (!apiKey || !opts.tools?.length) return null;

  const declarations = toFunctionDeclarations(opts.tools);
  const history = opts.history || [];
  const contents = [];
  for (const turn of history) {
    if (turn.role === 'system') continue;
    contents.push({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    });
  }
  contents.push({ role: 'user', parts: [{ text: opts.user }] });

  const maxRounds = opts.maxRounds ?? 5;
  let lastText = null;

  for (const model of [...new Set(GEMINI_MODELS)]) {
    let roundContents = [...contents];
    try {
      for (let round = 0; round < maxRounds; round++) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: opts.system }] },
              contents: roundContents,
              tools: [{ functionDeclarations: declarations }],
              toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
              generationConfig: {
                temperature: opts.temperature ?? 0.35,
                maxOutputTokens: opts.maxTokens ?? 800,
              },
            }),
            signal: AbortSignal.timeout(35_000),
          },
        );
        if (!res.ok) break;
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts ?? [];
        if (!parts.length) break;

        const fnCalls = parts.filter((p) => p.functionCall?.name);
        const textParts = parts.filter((p) => p.text?.trim()).map((p) => p.text);

        if (!fnCalls.length) {
          const text = textParts.join('\n').trim();
          if (text) return text;
          break;
        }

        roundContents.push({ role: 'model', parts: fnCalls });
        const responseParts = [];
        for (const p of fnCalls) {
          const name = p.functionCall.name;
          const fargs = p.functionCall.args || {};
          const result = await opts.execute(name, fargs);
          lastText = result;
          responseParts.push({
            functionResponse: { name, response: { result: String(result).slice(0, 8000) } },
          });
        }
        roundContents.push({ role: 'user', parts: responseParts });
      }
      if (typeof lastText === 'string' && lastText.length > 20 && !lastText.startsWith('{"ok":false')) {
        const fallbackPlain = await geminiChatPlain({
          system: opts.system,
          user: `Resultados herramientas:\n${lastText}\n\nResume al operador qué pasó y el siguiente paso.`,
          maxTokens: 600,
        });
        if (fallbackPlain) return fallbackPlain;
      }
    } catch {
      continue;
    }
  }
  return null;
}
