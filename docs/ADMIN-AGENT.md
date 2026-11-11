# Asistente IA panel (Gemini)

- **UI:** botón **✦ Asistente** (abajo derecha) en admin-panel.
- **API:** `POST /api/notify?__action=admin-agent-chat` (JWT admin).
- **Env:** `GEMINI_API_KEY` en Vercel (producción) y `.env.local` (local).

Body:

```json
{
  "message": "Busca Ramon Ros y infiere criterios",
  "context": { "section": "compradores", "compradorId": "uuid-opcional" },
  "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }]
}
```

Herramientas: buscar/ver/actualizar comprador, notas, inferencia criterios, listar/anotar particulares.

No sustituye a Alfredo/José en VPS; mismo Supabase con reglas de no borrar.
