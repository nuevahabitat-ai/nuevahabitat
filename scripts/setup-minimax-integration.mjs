#!/usr/bin/env node
/**
 * Guarda MINIMAX_API_KEY en Supabase private_integrations.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['.env.local', '.env']) {
  const p = path.join(root, name);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}

const argKey = process.argv.find((a) => a.startsWith('--key='))?.slice(6)?.trim();
const apiKey = argKey || process.env.MINIMAX_API_KEY;
if (!apiKey || apiKey.length < 10) {
  console.error('Define MINIMAX_API_KEY en .env.local o pasa --key=...');
  process.exit(1);
}

const { saveMiniMaxIntegration } = await import('../lib/server/integration-secrets.js');
const r = await saveMiniMaxIntegration(apiKey);
if (!r.ok) {
  console.error(r.error || 'Error guardando');
  process.exit(1);
}
console.log('OK: minimax_api_key en private_integrations.');
