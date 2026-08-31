# Prompt: Integración Captador (José + Alfredo) con el panel admin Nueva Hábitat

Usa este documento cuando trabajes en **nuevahabitat.com** — especialmente `admin-panel.html`, APIs en `/api/*` y esquema Supabase — para que las mejoras del panel **encajen con los bots José y Alfredo** del proyecto hermano **Captador** (`D:\Proyectos\Captador` / VPS `/opt/captador`).

---

## Objetivo

El panel admin (`https://www.nuevahabitat.com/admin-panel`) no es la única vía de entrada de datos. **José** y **Alfredo** escriben y leen la misma base Supabase vía API o service role. Cualquier cambio en UI, columnas, estados o endpoints debe **mantener compatibilidad** con esos flujos automáticos.

---

## Arquitectura (quién hace qué)

```
┌─────────────────────────────────────────────────────────────────┐
│  nuevahabitat.com (Vercel)                                      │
│  • admin-panel.html  → UI manual (import URL, editar, estados)  │
│  • /api/compradores  → POST/GET compradores (Bearer API key)    │
│  • /api/particulares → GET listado seguimientos (Bearer)        │
│  • /api/import-particular → POST scrape URL Kelify/Idealista…   │
│  • Supabase (PostgreSQL) ← fuente de verdad                     │
└───────────────────────────────▲─────────────────────────────────┘
                                │ NH_SUPABASE_SERVICE_KEY / API
┌───────────────────────────────┴─────────────────────────────────┐
│  Captador (VPS 75.119.130.152, /opt/captador)                   │
│                                                                 │
│  JOSÉ (@Jose_nuevahabitat_bot)                                  │
│  • Captación Kelify → leads locales + sync particulares NH      │
│  • Auto: 9:00–20:00 cada 30 min, 1 piso/slot                   │
│  • Sin WhatsApp auto (Meta API pendiente)                       │
│  • Código: worker/, kelify-scraper/, packages/shared/nh-panel   │
│                                                                 │
│  ALFREDO (@Alfredo_nuevahabitat_bot)                            │
│  • Compradores (alta/listado/notas) → POST /api/compradores     │
│  • Seguimientos particulares (consulta/alta manual por Telegram)│
│  • Código: telegram/src/alfredo-bot.ts, alfredo-commands.ts     │
└─────────────────────────────────────────────────────────────────┘
```

| Bot | Rol | Escribe en NH | Lee de NH |
|-----|-----|---------------|-----------|
| **José** | Captación automática Kelify | `particulares` + `particulares_seguimientos` | — |
| **Alfredo** | Compradores + seguimiento operativo | `compradores`, notas, algunos `particulares` | `GET /api/compradores`, `GET /api/particulares` |
| **Admin panel** | Revisión humana, estados, publicar | Mismo esquema vía Supabase client | Todo |

---

## Tablas Supabase relevantes

### `compradores` (Alfredo + API)

Referencia: [PROMPT-API-COMPRADORES.md](./PROMPT-API-COMPRADORES.md)

- Alta vía `POST /api/compradores` con `Authorization: Bearer NH_PANEL_API_KEY`
- Campos clave: `nombre`, `telefono` (+34), `presupuesto_max`, `zona_buscada`, `habitaciones_min`, `notas`, `activo=true`
- Alfredo puede añadir notas con `appendCompradorNota` (PATCH Supabase directo)
- **No renombrar columnas** sin actualizar `packages/shared/src/nh-panel.ts` en Captador

### `particulares` (José + panel Seguimientos)

Migración: `supabase/migrations/021_particulares_seguimientos.sql`

| Columna | José auto | Panel manual | Notas |
|---------|-----------|--------------|-------|
| `url` | ✓ Kelify URL | ✓ | **Índice único** por URL — dedup |
| `fuente` | `kelify` | kelify/idealista/fotocasa/manual | CHECK enum |
| `titulo`, `direccion` | ✓ desde zona/título | ✓ | |
| `precio`, `m2`, `habitaciones`, `banos` | ✓ parse + import API | ✓ | José enriquece vía scraper + `/api/import-particular` |
| `zona`, `barrio`, `municipio` | ✓ | ✓ | Default municipio `Barcelona` |
| `contacto_nombre`, `telefono`, `email` | teléfono si Kelify lo expone | ✓ | |
| `descripcion`, `imagen_url` | ✓ | ✓ | |
| `estado` | **`nuevo`** al crear | nuevo/contactado/… | Ver estados abajo |
| `proxima_alarma_at` | +7 días | ✓ | Alarmas en pestaña panel |
| `activo` | `true` | ✓ | |

### `particulares_seguimientos` (historial)

José inserta comentarios automáticos, por ejemplo:

- `Importado automáticamente por José (Kelify) → juan|daniel`
- `Actualizado por José (Kelify) · lead abc12345`

El panel debe seguir mostrando este historial; no borrar filas que vengan de bots.

---

## APIs existentes (contratos que Captador usa)

### `GET /api/compradores`

- Auth: Bearer `NH_PANEL_API_KEY`
- Query: `activo=true`, `limit=1-50`
- Alfredo lista compradores activos antes de crear duplicados

### `POST /api/compradores`

- Alfredo crea compradores desde Telegram (voz/texto)
- Respuesta `{ ok, comprador }` — documentado en PROMPT-API-COMPRADORES.md

### `GET /api/particulares`

- Auth: Bearer `NH_PANEL_API_KEY`
- Query: `mode=activos|alarmas|hoy`, `limit=1-50`
- Alfredo: listados de seguimiento, alarmas del día
- Implementación: `api/particulares.js` + `lib/server/particulares-api.js`

### `POST /api/import-particular`

- **Sin auth** (solo scrape; el admin rellena formulario después)
- Body: `{ "url": "https://www.kelify.com/venta/..." }`
- Respuesta: `{ ok, data: { titulo, precio, m2, habitaciones, banos, telefono, imagen_url, … } }`
- **José llama a esta API** desde el VPS para enriquecer datos antes de insertar en `particulares`
- Mejoras al parser Kelify/Idealista/Fotocasa **benefician a José y al panel** a la vez

---

## Flujo José → panel (implementado en Captador)

Archivo clave: `packages/shared/src/nh-panel.ts` → `syncNhParticularFromKelifyLead()`

1. Extrae listing en Kelify (Playwright, VPS `kelify-scraper:3002`)
2. Guarda lead en SQLite Captador (`leads`)
3. Opcional: `POST /api/import-particular` con la URL Kelify
4. Parsea m²/hab/baños del texto (`packages/shared/src/kelify-parse.ts`)
5. **Upsert Supabase** `particulares` (match por `url` o teléfono)
6. Inserta fila en `particulares_seguimientos`
7. Notifica Telegram solo si hay novedad

Automatización: **9:00–20:00**, cada **30 min**, **1 piso/slot** (~23/día).

---

## Flujo Alfredo → panel

Archivo clave: `packages/shared/src/alfredo-commands.ts`, `nh-panel.ts`

- Compradores: `createNhComprador()` → `POST /api/compradores`
- Seguimientos: `listNhParticulares()`, `registerParticularSeguimiento()` (Supabase directo)
- Comandos Telegram: `/alfredo compradores`, `/alfredo seguimientos hoy`, importar URL manual
- **Alfredo NO usa el scraper Kelify de José** para captación masiva — roles separados

---

## Reglas para mejoras del admin-panel

Al diseñar o codificar cambios, **cumple siempre**:

### 1. Esquema y estados

- **No eliminar** columnas que José/Alfredo rellenan (`url`, `fuente`, `m2`, `banos`, `imagen_url`, `proxima_alarma_at`, …)
- **No cambiar** valores de `estado` ni `fuente` sin migración + actualizar Captador
- Estados válidos particulares: `nuevo`, `contactado`, `visita`, `negociacion`, `captado`, `descartado`
- Fuentes válidas: `kelify`, `idealista`, `fotocasa`, `habitaclia`, `manual`, `otro`

### 2. Deduplicación

- Un particular con misma `url` (normalizada lower/trim) **no debe duplicarse** — José ya depende del índice único
- Si el panel crea manualmente, comprobar URL/teléfono antes de insert

### 3. Import URL (UI)

- El botón **«Importar datos»** debe seguir llamando `POST /api/import-particular` — es el mismo endpoint que usa José
- Tras importar, el formulario «Nuevo particular» es revisión humana; José inserta directo en BD con estado `nuevo`
- Mejoras UX: previsualizar imagen, resaltar campos vacíos (teléfono suele faltar en Idealista)

### 4. Identificar origen en UI

- Mostrar badge **KELIFY** + etiqueta **«José (auto)»** si `particulares_seguimientos.comentario` contiene `José (Kelify)`
- Mostrar **«Alfredo (Telegram)»** en compradores con `notas` que contengan «Importado por Alfredo»
- Ayuda al operador a distinguir captación auto vs manual

### 5. APIs nuevas (prioridad sugerida)

Si añades endpoints, alinea con Captador:

| Endpoint propuesto | Método | Para quién | Body / respuesta |
|--------------------|--------|------------|------------------|
| `/api/particulares` | **POST** | José (futuro refactor) | Mismo shape que `saveParticular()` en admin-panel |
| `/api/particulares/:id` | PATCH | Alfredo estados | `{ estado, comentario? }` |
| `/api/particulares/import` | POST | Alias documentado de import-particular | — |

Hoy José escribe **directo a Supabase** con service role; un `POST /api/particulares` autenticado simplificaría permisos y validación centralizada.

### 6. Compatibles comprador ↔ particular

Captador calcula compradores compatibles por zona/precio/habitaciones (`findCompatiblesForSeguimiento`). Mejoras útiles en panel:

- En ficha de particular Kelify: sidebar **«Compradores compatibles»** (query `compradores` con filtros)
- En ficha comprador: **«Particulares en su zona/rango»**
- Datos ya existen en ambas tablas — solo falta UI/API de cruce

### 7. Secretos compartidos

| Variable | Dónde | Uso |
|----------|-------|-----|
| `NH_PANEL_API_KEY` | Vercel + VPS `.env` | GET/POST compradores, GET particulares |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + VPS | José insert particulares; Alfredo notas |
| `NH_SUPABASE_URL` | VPS Captador | Default proyecto xxodawayoogthxnjpouq |

**Nunca** commitear claves. Captador y NH deben apuntar al **mismo proyecto Supabase**.

### 8. Lo que NO hacer

- No mover Alfredo/José a webhook Vercel para Telegram (corren en VPS polling)
- No exigir cookies de sesión admin para APIs que usan los bots
- No romper `POST /api/import-particular` (José depende de él en cada sync)
- No filtrar en panel solo `fuente=manual` — la mayoría nuevos vienen como `kelify` + estado `nuevo`

---

## Checklist antes de merge (panel o API)

- [ ] ¿Los campos de `particulares`/`compradores` siguen alineados con migraciones 021 y PROMPT-API-COMPRADORES?
- [ ] ¿`POST /api/import-particular` sigue funcionando para URLs Kelify reales?
- [ ] ¿GET `/api/particulares?mode=alarmas|hoy` devuelve lo que Alfredo espera?
- [ ] ¿Estados y fuentes respetan CHECK constraints de Postgres?
- [ ] ¿La UI muestra particulares con `fuente=kelify` y `estado=nuevo` (flujo José)?
- [ ] ¿Documentación/OpenAPI actualizada si cambian endpoints?

---

## Referencias cruzadas

| Recurso | Ubicación |
|---------|-----------|
| Cliente NH en Captador | `Captador/packages/shared/src/nh-panel.ts` |
| Automatización José | `Captador/worker/src/automation-slot.ts` |
| Scraper Kelify | `Captador/apps/kelify-scraper/src/index.ts` |
| Bot Alfredo | `Captador/telegram/src/alfredo-bot.ts` |
| Panel seguimientos UI | `Nueva habitat/admin-panel.html` (sección Particulares) |
| Import scraper | `Nueva habitat/api/import-particular.js` |
| API compradores | `Nueva habitat/api/compradores.js` |
| API listado particulares | `Nueva habitat/api/particulares.js` |

---

## Prompt corto (copiar en Cursor / Cloud Agent)

```
Estoy en el repo nuevahabitat.com (panel admin + APIs Vercel + Supabase).

Contexto: Los bots Captador JOSÉ (captación Kelify auto) y ALFREDO (compradores/seguimientos Telegram)
escriben en las mismas tablas Supabase que el admin-panel.

Antes de cambiar admin-panel.html, /api/* o migraciones:
1. Lee PROMPT-INTEGRACION-CAPTADOR.md y PROMPT-API-COMPRADORES.md
2. Mantén compatibilidad con syncNhParticularFromKelifyLead (particulares, url única, estado nuevo, fuente kelify)
3. Mantén GET/POST /api/compradores y GET /api/particulares para Alfredo
4. No rompas POST /api/import-particular — José lo usa para enriquecer datos Kelify
5. Preferir mejoras que ayuden a operador Y bots: badges de origen, compatibles comprador-particular, POST /api/particulares autenticado

Panel: https://www.nuevahabitat.com/admin-panel → Seguimientos - Particulares
```
