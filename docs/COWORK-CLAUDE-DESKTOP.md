# Claude Cowork (Desktop) — Alta de compradores NuevaHabitat

Tu captura es **Claude Desktop → modo Cowork**, no Cursor Cloud. Cowork no conoce la API hasta que se lo configuras.

## Opción A — La más fácil (script local)

Cowork puede ejecutar comandos en tu PC. El repo incluye:

```bash
node scripts/alta-comprador-cli.js --nombre "Ana López" --telefono 612345678 --zona Eixample --presupuesto 250000
```

La clave se lee sola de `.nh-panel-api-key.local` (ya creada en tu máquina).

### Configurar Cowork (una vez)

1. Abre **Personalizar** (barra lateral) o **Proyecto → NuevaHabitat**
2. Pega estas instrucciones:

```
Cuando pida subir o crear un comprador en NuevaHabitat, ejecuta en terminal desde la carpeta del repo:

node scripts/alta-comprador-cli.js --nombre "NOMBRE" --telefono TELEFONO --zona "ZONA" --presupuesto NUMERO

Opcional: --habitaciones 3 --notas "texto"
Para listar: node scripts/alta-comprador-cli.js --list

Confirma el JSON de respuesta. Si ok:true, el comprador está en admin-panel → Últimos compradores.
```

3. En Cowork, abre el **proyecto/carpeta** `Nueva habitat` (File → Open folder) para que tenga acceso al script y a la clave local.

4. Escribe en natural:

> Sube comprador: Ana López, teléfono 612 345 678, zona Eixample, presupuesto 250000

---

## Opción B — HTTP directo (Claude Pro + conector)

Si tu plan permite **Custom tool / HTTP API** en Cowork:

| Campo | Valor |
|-------|--------|
| Nombre | NuevaHabitat compradores |
| Tipo credencial | Bearer |
| Host permitido | `www.nuevahabitat.com` |
| Token | valor de `NH_PANEL_API_KEY` (Vercel o `.nh-panel-api-key.local`) |
| POST | `https://www.nuevahabitat.com/api/compradores` |
| GET | `https://www.nuevahabitat.com/api/compradores?activo=true&limit=50` |

Header: `Authorization: Bearer <token>`

Documentación: [API-COMPRADORES.md](./API-COMPRADORES.md)

---

## Opción C — Cursor Cloud (otro producto)

Si quieres usar **Cursor Cloud Agent** (no Claude):

1. [cursor.com/dashboard/cloud-agents](https://cursor.com/dashboard/cloud-agents) → Secrets → `NH_PANEL_API_KEY`
2. El agente lee `AGENTS.md` del repo y hace curl a la API.

---

## Errores frecuentes

| Problema | Solución |
|----------|----------|
| Cowork no hace nada | Modo **Cowork** activo + carpeta del repo abierta |
| 401 | Clave incorrecta en `.nh-panel-api-key.local` |
| 409 | Teléfono ya existe (correcto, no duplica) |
| No encuentra script | `cd` a `D:\Proyectos\Nueva habitat` |
