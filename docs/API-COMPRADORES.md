# API Compradores — NuevaHabitat

API HTTP para que asistentes (Gemini, Claude, Cursor Cloud, scripts) creen compradores en Supabase sin sesión del panel admin.

**Base URL:** `https://www.nuevahabitat.com`

## Autenticación

Todas las peticiones requieren:

```
Authorization: Bearer <NH_PANEL_API_KEY>
Content-Type: application/json
```

La clave `NH_PANEL_API_KEY` la proporciona el administrador. **No** uses la service role de Supabase en clientes externos.

---

## Crear comprador

```http
POST /api/compradores
```

### Campos

| Campo              | Tipo    | Obligatorio | Descripción                    |
|----------------------|---------|-------------|--------------------------------|
| `nombre`             | string  | Sí          | Nombre completo                |
| `telefono`           | string  | Sí          | Móvil ES: `683483132` o `+34683483132` |
| `presupuesto_max`    | number  | No          | Euros (entero)                 |
| `zona_buscada`       | string  | No          | Ej. `Hospitalet`, `Eixample`   |
| `habitaciones_min`   | number  | No          | Entero                         |
| `email`              | string  | No          |                                |
| `notas`              | string  | No          | Ej. `Alta vía Gemini`          |

El comprador se crea con `activo: true` y aparece en `/admin-panel` → **Últimos compradores**.

### Ejemplo curl

```bash
curl -X POST https://www.nuevahabitat.com/api/compradores \
  -H "Authorization: Bearer TU_CLAVE" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana López",
    "telefono": "+34600111222",
    "zona_buscada": "Eixample",
    "presupuesto_max": 200000,
    "notas": "Alta vía Claude Code"
  }'
```

### Respuesta 201

```json
{
  "ok": true,
  "comprador": {
    "id": "uuid",
    "nombre": "Ana López",
    "telefono": "+34600111222",
    "zona_buscada": "Eixample",
    "presupuesto_max": 200000,
    "activo": true
  }
}
```

### Errores

| HTTP | Significado |
|------|-------------|
| 401  | Falta `Authorization` o clave incorrecta |
| 400  | Falta `nombre` o `telefono` inválido |
| 409  | Ya existe comprador con ese teléfono |
| 429  | Más de 60 peticiones/min por IP |
| 500  | Error interno / Supabase |

---

## Listar compradores

```http
GET /api/compradores?activo=true&limit=50
```

Útil para comprobar duplicados antes de crear.

### Respuesta 200

```json
{
  "ok": true,
  "count": 2,
  "compradores": [
    {
      "id": "uuid",
      "nombre": "Ana López",
      "telefono": "+34600111222",
      "zona_buscada": "Eixample",
      "presupuesto_max": 200000,
      "activo": true,
      "created_at": "2026-08-30T12:00:00+00:00"
    }
  ]
}
```

---

## Instrucciones para Gems / Cowork / Cursor Agent

Cuando el usuario diga algo como:

> «Sube comprador: José Francisco Martínez, teléfono 683 48 31 32, zona Hospitalet, presupuesto 220000»

1. Opcional: `GET /api/compradores?activo=true&limit=50` y buscar teléfono similar.
2. `POST /api/compradores` con JSON normalizado (`telefono` → `+34683483132`).
3. Confirmar al usuario con `id` y nombre, o explicar 409 si ya existía.

OpenAPI completo: [openapi.yaml](./openapi.yaml)
