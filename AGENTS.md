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
- **Solo producción:** Vercel está configurado para **no construir Preview** en ramas distintas de `main` (`ignoreCommand` + `git.deploymentEnabled` en `vercel.json`). Un push a `cursor/*` **no** publica en `www.nuevahabitat.com`.
- **Producción (`www.nuevahabitat.com`)**: commit en **`main`** + deployment **Production** en Vercel (dominio custom).
- Tras abrir PR: **mergear a `main`** para que el usuario vea cambios en producción (no basta con push a la rama ni URLs preview).
- Vercel CLI (solo emergencias, checkout `main`): `npx vercel --prod --yes --scope nuevahabitat`
- Tras landings JSON: `node scripts/build-landings.js`

## Secretos (solo Vercel, nunca en repo)

`NH_PANEL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`, `RESEND_API_KEY`
