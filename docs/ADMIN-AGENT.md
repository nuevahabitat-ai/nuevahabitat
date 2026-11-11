# Asistente IA panel (Gemini)

- **UI:** pestaña **✦ IA** arriba a la derecha (como leads); al pulsar, modal compacto para chatear.
- **API:** `POST /api/notify?__action=admin-agent-chat` (JWT admin).
- **Env:** `GEMINI_API_KEY` en Vercel **o** en Supabase (`private_integrations.gemini_api_key`):
  ```bash
  node scripts/setup-gemini-integration.mjs
  ```
  Modelo por defecto: `gemini-3-flash-preview` (Google AI Studio / clave `AQ.…`).

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
