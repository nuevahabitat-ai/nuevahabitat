# Alta de compradores desde cualquier dispositivo (sin proyecto local)

No necesitas el repositorio en tu PC. Todo pasa por HTTPS contra producción.

**Base URL:** `https://www.nuevahabitat.com`

---

## Opción 1 — Formulario móvil (recomendada en campo)

Abre en el móvil, tablet o cualquier navegador:

**https://www.nuevahabitat.com/captar-comprador**

1. Introduce el **PIN de captación** (te lo da el administrador; se recuerda en el navegador).
2. Rellena nombre y teléfono (obligatorios) y el resto si lo tienes.
3. Guardar → el comprador aparece al instante en `/admin-panel`.

La página no está indexada en Google (`noindex`). Solo sirve para el equipo.

---

## Opción 2 — API con clave Bearer (IAs y automatización)

Para **Gemini, Claude, Cursor Cloud, Postman, Shortcuts iOS**, etc.:

```http
POST https://www.nuevahabitat.com/api/compradores
Authorization: Bearer <NH_PANEL_API_KEY>
Content-Type: application/json

{
  "nombre": "Ana López",
  "telefono": "600111222",
  "zona_buscada": "Eixample",
  "presupuesto_max": 200000,
  "notas": "Alta vía asistente"
}
```

- La clave `NH_PANEL_API_KEY` **no** va en la web pública; guárdala en secretos del asistente o en tu gestor de contraseñas.
- Documentación completa: [API-COMPRADORES.md](./API-COMPRADORES.md)
- OpenAPI: [openapi.yaml](./openapi.yaml)

### Claude / Gemini (web o app)

Pega en las instrucciones del proyecto o en un mensaje fijo:

> Cuando deba dar de alta un comprador, haz POST a `https://www.nuevahabitat.com/api/compradores` con header `Authorization: Bearer <clave>` y JSON con al menos `nombre` y `telefono` (móvil español). Si responde 409, el teléfono ya existe.

Configura la clave como **secreto** en Cursor Cloud, Claude Projects o similar — nunca en el chat visible.

### Atajo iOS (Shortcuts)

1. Acción **Obtener contenidos de URL** → POST  
2. URL: `https://www.nuevahabitat.com/api/compradores`  
3. Cabeceras: `Authorization: Bearer …`, `Content-Type: application/json`  
4. Cuerpo JSON con nombre y teléfono.

---

## Opción 3 — API con PIN (solo crear, sin Bearer)

Equivalente al formulario móvil vía JSON:

```http
POST https://www.nuevahabitat.com/api/compradores
Content-Type: application/json

{
  "pin": "TU_PIN",
  "nombre": "Ana López",
  "telefono": "600111222"
}
```

- Solo válido en **POST** (crear). Listar compradores (`GET`) sigue requiriendo Bearer.
- Mismo límite: 60 peticiones/min por IP.

---

## Opción 4 — Panel admin (login Supabase)

**https://www.nuevahabitat.com/admin-panel**

Login con usuario del equipo y alta manual en **Últimos compradores**. No requiere API key.

---

## Resumen

| Método | Dispositivo | Auth | Listar |
|--------|-------------|------|--------|
| `/captar-comprador` | Móvil / navegador | PIN | No |
| POST + PIN en JSON | Script / integración ligera | PIN | No |
| POST/GET + Bearer | IA / Postman / CI | API key | Sí (GET) |
| `/admin-panel` | Cualquiera | Login Supabase | Sí (UI) |

---

## Errores habituales

| HTTP | Qué hacer |
|------|-----------|
| 401 | Bearer incorrecto o falta |
| 403 | Clave inválida |
| 409 | Teléfono ya registrado (comprador existente en la respuesta) |
| 429 | Espera un minuto (rate limit) |
| 503 | Entorno sin configurar (avisar al admin) |
