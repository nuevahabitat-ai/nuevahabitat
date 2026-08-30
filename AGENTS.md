# Agentes Cursor / Cloud — NuevaHabitat

## API compradores (IAs externas)

Para crear compradores desde Gemini, Claude o scripts sin abrir el admin:

- **Spec completa:** [PROMPT-API-COMPRADORES.md](../PROMPT-API-COMPRADORES.md)
- **Docs copiables:** [docs/API-COMPRADORES.md](docs/API-COMPRADORES.md)
- **OpenAPI:** [docs/openapi.yaml](docs/openapi.yaml)
- **Endpoint:** `POST https://www.nuevahabitat.com/api/compradores`
- **Auth:** `Authorization: Bearer $NH_PANEL_API_KEY`
- **Campos obligatorios:** `nombre`, `telefono` (+34…)

Traducir lenguaje natural del operador a JSON y hacer POST. Consultar `GET /api/compradores?activo=true&limit=50` antes de crear para evitar duplicados por teléfono.

## Deploy

- Push: cuenta `nuevahabitat-ai`, remote `origin`
- Vercel: `npx vercel --prod --yes --scope nuevahabitat`
- Tras landings JSON: `node scripts/build-landings.js`

## Secretos (solo Vercel, nunca en repo)

`NH_PANEL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_API_KEY`
