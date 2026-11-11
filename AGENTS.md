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

## Inferencia criterios compradores (`presupuesto_min` / migración 068)

- **Docs:** [docs/SYNC-INFER-CRITERIOS.md](docs/SYNC-INFER-CRITERIOS.md)
- **CLI:** `node scripts/sync-infer-compradores.mjs` (`.env.local` con `SUPABASE_SERVICE_ROLE_KEY`)
- **VPS Captador:** `python scripts/run-infer-from-vps-env.py --write-env` (lee `/opt/captador/.env`, no commitear keys)

## Deploy

- Push: cuenta `nuevahabitat-ai`, remote `origin`. Antes de `git push`: `gh auth switch -u nuevahabitat-ai` (o `powershell -File scripts/push-nuevahabitat.ps1`) — si no, GitHub devuelve 403 con otra cuenta activa.
- **Solo producción:** Vercel está configurado para **no construir Preview** en ramas distintas de `main` (`ignoreCommand` + `git.deploymentEnabled` en `vercel.json`). Un push a `cursor/*` **no** publica en `www.nuevahabitat.com`.
- **Producción (`www.nuevahabitat.com`)**: commit en **`main`** + deployment **Production** en Vercel (dominio custom).
- Tras abrir PR y CI verde: **el agente mergea a `main` solo** (`scripts/ship-to-production.sh` o merge git + `git push origin main`). No pedir al usuario que pulse Merge en GitHub salvo fallo persistente de auth.
- Verificar URLs en `https://www.nuevahabitat.com/...` tras el deploy Production.
- Vercel CLI (solo emergencias, checkout `main`): `npx vercel --prod --yes --scope nuevahabitat`
- Tras landings JSON: `node scripts/build-landings.js`

## Secretos (solo Vercel, nunca en repo)

`NH_PANEL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_API_KEY`

**Gemini asistente:** preferible `node scripts/setup-gemini-integration.mjs` → `private_integrations.gemini_api_key` (funciona en Vercel sin `GEMINI_API_KEY` en el dashboard).
