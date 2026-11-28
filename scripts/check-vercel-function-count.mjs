#!/usr/bin/env node
/**
 * Vercel Hobby: máx. 12 Serverless Functions por deploy.
 * Cada .js bajo api/ (salvo segmentos con _) cuenta como una función.
 * @see https://vercel.com/docs/functions/runtimes#functions-created-per-deployment
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const API = path.join(ROOT, 'api');
const HOBBY_LIMIT = 12;

function listApiHandlers(dir, rel = '') {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = rel ? `${rel}/${name.name}` : name.name;
    if (name.isDirectory()) {
      if (name.name.startsWith('_')) continue;
      out.push(...listApiHandlers(path.join(dir, name.name), relPath));
    } else if (name.isFile() && name.name.endsWith('.js') && !name.name.startsWith('_')) {
      out.push(`api/${relPath}`);
    }
  }
  return out;
}

const handlers = listApiHandlers(API).sort();
const n = handlers.length;

if (n > HOBBY_LIMIT) {
  console.error(
    `[vercel-hobby] ${n} funciones en api/ (límite ${HOBBY_LIMIT}). El deploy falla en «Deploying outputs».`
  );
  console.error(handlers.join('\n'));
  console.error('Agrupa rutas en api/notify.js + rewrites en vercel.json.');
  process.exit(1);
}

console.log(`[vercel-hobby] OK: ${n}/${HOBBY_LIMIT} funciones serverless en api/`);