# Prompt: API pública para crear compradores (Gemini, Claude, Cursor Cloud)

## Objetivo

Implementar en el proyecto **nuevahabitat.com** una API HTTP para que asistentes externos (Gemini, Claude Code Desktop / Cowork, Cursor Cloud Agent, scripts) puedan **crear compradores** en la misma base de datos que usa el panel admin (`/admin-panel`), sin abrir el navegador ni usar cookies de sesión.

El operador dirá en lenguaje natural, por ejemplo:

> «Sube comprador: José Francisco Martínez, teléfono 683 48 31 32, zona Hospitalet, presupuesto 220000»

La IA debe traducir eso a un `POST` JSON y el comprador debe aparecer en el dashboard **Últimos compradores**.

## Contexto técnico

- Panel: `https://www.nuevahabitat.com/admin-panel`
- Backend: **Supabase** (PostgreSQL)
- Tabla principal: `compradores`
- Proyecto Captador (repo hermano) ya escribe en esta tabla vía `NH_SUPABASE_SERVICE_KEY` — la API debe usar **la misma tabla y columnas**, no duplicar lógica incompatible.

### Columnas Supabase (tabla `compradores`)

| Campo API (JSON)   | Columna Supabase   | Obligatorio | Notas                          |
|--------------------|--------------------|-------------|--------------------------------|
| `nombre`           | `nombre`           | Sí          |                                |
| `telefono`         | `telefono`         | Sí          | Normalizar a E.164 (+34…)      |
| `presupuesto_max`  | `presupuesto_max`  | No          | Entero euros                   |
| `zona_buscada`     | `zona_buscada`     | No          | Ej. Hospitalet, Eixample       |
| `habitaciones_min` | `habitaciones_min` | No          | Entero                         |
| `email`            | `email`            | No          |                                |
| `notas`            | `notas`            | No          | Ej. «Importado vía API Gemini» |
| —                  | `activo`           | —           | Siempre `true` al crear        |

Referencia de implementación en Captador: `packages/shared/src/nh-panel.ts` → función `upsertNhPanelComprador`.

## Qué implementar

### 1. Endpoint principal

`POST /api/compradores`

**Autenticación:** header obligatorio

```
Authorization: Bearer <NH_PANEL_API_KEY>
```

**Body (JSON):**

```json
{
  "nombre": "José Francisco Martínez",
  "telefono": "+34683483132",
  "presupuesto_max": 220000,
  "zona_buscada": "Hospitalet de Llobregat",
  "habitaciones_min": 3,
  "notas": "Alta vía Claude Code"
}
```

**Respuesta 201:**

```json
{
  "ok": true,
  "comprador": {
    "id": "uuid",
    "nombre": "José Francisco Martínez",
    "telefono": "+34683483132",
    "zona_buscada": "Hospitalet de Llobregat",
    "presupuesto_max": 220000
  }
}
```

**Errores:**

| Código | Cuándo                              |
|--------|-------------------------------------|
| 401    | Falta o clave API inválida          |
| 400    | `nombre` o `telefono` faltan / mal  |
| 409    | Ya existe comprador con ese teléfono |
| 500    | Error Supabase                      |

### 2. Endpoint opcional de listado (útil para IAs)

`GET /api/compradores?activo=true&limit=50`

Misma auth. Devuelve lista para que Gemini/Claude consulten antes de crear duplicados.

### 3. Variables de entorno

```env
NH_PANEL_API_KEY=          # Clave larga aleatoria (solo server-side)
SUPABASE_URL=              # Ya existente en el proyecto
SUPABASE_SERVICE_ROLE_KEY= # Solo en servidor, NUNCA en cliente
```

No exponer `SUPABASE_SERVICE_ROLE_KEY` a Gemini, Claude ni al front.  
Las IAs externas solo reciben `NH_PANEL_API_KEY`.

### 4. Seguridad

- Validar `Authorization: Bearer` en la ruta API.
- Rate limit: ~60 req/min por IP o por API key.
- Log en servidor: `{ source: "api", action: "comprador.create", nombre, telefono }` (sin loguear la clave).
- CORS: permitir solo si hace falta desde otro origen; para IAs server-side normalmente no hace falta CORS.
- Normalizar teléfono español: quitar espacios, prefijo +34 si falta.

### 5. Documentación para IAs

Ver `docs/API-COMPRADORES.md` y `docs/openapi.yaml`.

### 6. OpenAPI

`docs/openapi.yaml` con `POST` y `GET /api/compradores` para function calling.

## Criterios de aceptación

- [ ] `POST /api/compradores` con clave válida crea fila en Supabase `compradores` con `activo=true`.
- [ ] El comprador aparece en `/admin-panel` → «Últimos compradores».
- [ ] Teléfono duplicado → 409 con mensaje claro.
- [ ] Sin clave o clave mala → 401.
- [ ] Prueba manual con curl documentada.
- [ ] No romper el formulario manual existente del panel.

## Fuera de alcance

- Login por cookies para IAs (usan Bearer token).
- Scraping Kelify (eso es José / Captador).
- Modificar repo Captador salvo mencionar compatibilidad de columnas.

## Stack

Vercel Serverless Functions en `api/compradores.js` (mismo patrón que `api/stripe-checkout.js`).

## Orden de implementación sugerido

1. `verifyPanelApiKey()` en `api/lib/panel-api-auth.js`
2. `POST /api/compradores` → insert Supabase
3. `GET /api/compradores` (listado)
4. `.env.example` + `docs/API-COMPRADORES.md`
5. Probar con curl
6. Entregar clave de prueba a Daniel (fuera del repo)

## Notas para el agente

- Responder y documentar en español.
- Daniel no ejecuta comandos: el agente hace build, test y deploy.
- Commits pequeños y descriptivos.
- No commitear secretos reales.

## Estado de implementación

| Componente | Archivo |
|------------|---------|
| POST/GET API | `api/compradores.js` |
| Auth + rate limit | `api/lib/panel-api-auth.js` |
| Normalización teléfono | `api/lib/compradores-api.js` |
| Docs IA | `docs/API-COMPRADORES.md` |
| OpenAPI | `docs/openapi.yaml` |

Tras deploy, configurar `NH_PANEL_API_KEY` en Vercel (Production) y entregar la clave a Daniel por canal seguro.
