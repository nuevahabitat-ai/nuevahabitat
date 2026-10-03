# Agentes Cursor / Cloud — NuevaHabitat

## Integración Captador (José + Alfredo)

Los bots del proyecto hermano **Captador** escriben en la misma Supabase que el admin-panel:

- **Spec integración:** [PROMPT-INTEGRACION-CAPTADOR.md](../PROMPT-INTEGRACION-CAPTADOR.md) ← leer antes de tocar Seguimientos, particulares o APIs
- **José:** captación Kelify auto → tabla `particulares` (fuente `kelify`, estado `nuevo`)
- **Alfredo:** compradores + consulta seguimientos vía API

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
- **Producción (`www.nuevahabitat.com`)**: solo cuando el commit está en **`main`** y Vercel termina el deployment **Production** (dominio custom). Los pushes a ramas `cursor/*` generan **Preview** (`*.vercel.app`) — **no** llevan el dominio principal.
- Tras abrir PR: **marcar ready for review y mergear a `main`** para que el usuario vea cambios en producción (no basta con push a la rama).
- Vercel CLI (opcional): `npx vercel --prod --yes --scope nuevahabitat` desde `main`
- Tras landings JSON: `node scripts/build-landings.js`

## Secretos (solo Vercel, nunca en repo)

`NH_PANEL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_API_KEY`
