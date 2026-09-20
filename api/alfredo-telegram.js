/**

 * POST /api/alfredo-telegram — Webhook Telegram Alfredo (compradores + seguimientos)

 * Env: ALFREDO_TELEGRAM_BOT_TOKEN, GROQ_API_KEY, SUPABASE_SERVICE_ROLE_KEY, NH_PANEL_API_KEY

 */

import { SB_SERVICE } from '../lib/server/supabase-server.js';

import {

  normalizeAlfredoVoice,

  executeAlfredoCommand,

  WHISPER_ALFREDO_PROMPT,

} from '../lib/server/alfredo-voice.js';



async function tg(method, body) {

  const token = process.env.ALFREDO_TELEGRAM_BOT_TOKEN;

  if (!token) throw new Error('ALFREDO_TELEGRAM_BOT_TOKEN no configurado');

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(body),

  });

  const data = await res.json();

  if (!data.ok) throw new Error(data.description || `Telegram ${method} failed`);

  return data.result;

}



async function transcribeVoice(fileId) {

  const key = process.env.GROQ_API_KEY;

  if (!key) return null;

  const file = await tg('getFile', { file_id: fileId });

  const token = process.env.ALFREDO_TELEGRAM_BOT_TOKEN;

  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  const audioRes = await fetch(url);

  if (!audioRes.ok) return null;

  const buf = Buffer.from(await audioRes.arrayBuffer());

  const form = new FormData();

  form.append('file', new Blob([buf]), 'voice.ogg');

  form.append('model', process.env.GROQ_WHISPER_MODEL || 'whisper-large-v3');

  form.append('language', 'es');

  form.append('prompt', WHISPER_ALFREDO_PROMPT);

  form.append('response_format', 'json');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {

    method: 'POST',

    headers: { Authorization: `Bearer ${key}` },

    body: form,

  });

  if (!res.ok) return null;

  const data = await res.json();

  return data.text?.trim() || null;

}



async function reaffirmTelegramWebhook(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers?.authorization || '';
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const token = process.env.ALFREDO_TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: 'Token no configurado' });

  const url = 'https://www.nuevahabitat.com/api/alfredo-telegram';
  const setRes = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, allowed_updates: ['message'] }),
  });
  const setData = await setRes.json();
  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await infoRes.json();

  return res.status(200).json({
    ok: setData.ok && info.result?.url === url,
    webhook: info.result?.url || '',
    pending: info.result?.pending_update_count ?? 0,
    last_error: info.result?.last_error_message || null,
  });
}

export default async function handler(req, res) {
  const keepalive =
    req.method === 'GET' &&
    (req.query?.__keepalive === '1' || req.url?.includes('__keepalive=1'));
  if (keepalive) return reaffirmTelegramWebhook(req, res);

  if (req.method !== 'POST') return res.status(405).json({ ok: false });



  if (!SB_SERVICE) return res.status(503).json({ ok: false, error: 'Supabase no configurado' });



  const update = req.body;

  const msg = update?.message;

  if (!msg) return res.status(200).json({ ok: true });



  const chatId = msg.chat?.id;

  if (!chatId) return res.status(200).json({ ok: true });



  try {

    let text = msg.text?.trim() || '';



    if (msg.voice || msg.audio) {

      await tg('sendMessage', { chat_id: chatId, text: '🎤 Oí…' });

      const fileId = msg.voice?.file_id || msg.audio?.file_id;

      const transcribed = fileId ? await transcribeVoice(fileId) : null;

      if (!transcribed) {

        await tg('sendMessage', { chat_id: chatId, text: 'No se entendió el audio.' });

        return res.status(200).json({ ok: true });

      }

      const normalized = normalizeAlfredoVoice(transcribed);

      await tg('sendMessage', {
        chat_id: chatId,
        text: `Oí: «${transcribed}»${transcribed !== normalized ? `\n→ «${normalized}»` : ''}`,
      });

      text = transcribed;
    }

    if (!text) return res.status(200).json({ ok: true });

    const reply = await executeAlfredoCommand(text);

    await tg('sendMessage', { chat_id: chatId, text: reply });

  } catch (err) {

    console.error('alfredo-telegram:', err);

    try {

      await tg('sendMessage', { chat_id: chatId, text: `Error: ${err.message || err}` });

    } catch (_) { /* ignore */ }

  }



  return res.status(200).json({ ok: true });

}


