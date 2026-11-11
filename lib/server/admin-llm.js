/**
 * Proveedor LLM del panel: MiniMax y/o Gemini (fallback).
 * ADMIN_LLM_PROVIDER=auto|minimax|gemini (default auto: MiniMax → Gemini).
 */
import { geminiChatPlain, geminiChatWithTools, geminiLlmConfigured } from './gemini-llm.js';
import { minimaxChatPlain, minimaxChatWithTools, minimaxLlmConfigured } from './minimax-llm.js';

function providerMode() {
  const v = String(process.env.ADMIN_LLM_PROVIDER || 'auto').trim().toLowerCase();
  if (v === 'gemini' || v === 'minimax') return v;
  return 'auto';
}

async function providerOrder() {
  const mode = providerMode();
  if (mode === 'gemini') return ['gemini'];
  if (mode === 'minimax') return ['minimax', 'gemini'];
  return ['gemini', 'minimax'];
}

async function isReady(name) {
  if (name === 'gemini') return geminiLlmConfigured();
  if (name === 'minimax') return minimaxLlmConfigured();
  return false;
}

export async function adminLlmConfigured() {
  return (await geminiLlmConfigured()) || (await minimaxLlmConfigured());
}

export async function adminChatWithTools(opts) {
  for (const p of await providerOrder()) {
    if (!(await isReady(p))) continue;
    const fn = p === 'minimax' ? minimaxChatWithTools : geminiChatWithTools;
    const text = await fn(opts);
    if (text) return { text, provider: p };
  }
  return null;
}

export async function adminChatPlain(opts) {
  for (const p of await providerOrder()) {
    if (!(await isReady(p))) continue;
    const fn = p === 'minimax' ? minimaxChatPlain : geminiChatPlain;
    const text = await fn(opts);
    if (text) return { text, provider: p };
  }
  return null;
}
