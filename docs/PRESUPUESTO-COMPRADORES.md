# Presupuesto máximo compradores

Regla: **presupuesto_max** = precio del piso que consultaron (Idealista / NH), salvo que el cuestionario Alfredo indique otro rango mayor.

## Automático

1. `node scripts/sync-presupuesto-compradores.mjs` — backfill interés + inferencia.
2. Panel **Compradores → € Presupuestos Idealista** (misma lógica vía API).

Fuentes (en orden): inmueble NH vinculado · `precio_consultado` en interés · mensaje con rango € · caché Idealista · scrape (suele fallar 403).

## Import Idealista (.xls)

Si el export incluye columna **PRECIO** / **PRECIO ANUNCIO**, el import la usa para `presupuesto_max` y `precio_consultado` y alimenta la **caché** por `idealista_id`. Sin columna, intenta leer € en descripción/mensaje.

## Colocación en wizard (inmuebles)

Campo **Ref. Idealista**: al salir del campo rellena **precio** desde caché/NH; al **publicar/guardar**, un script externo persiste `idealista_id` en el inmueble (sin tocar `admin-panel.html`).

## Pendientes («Sin vincular NH»)

Idealista bloquea lectura automática del anuncio. Opciones:

1. En el wizard de **inmuebles**, publicar (o borrador) con **idealista_id** + **precio** y volver a sincronizar.
2. Re-importar contactos Idealista con columna de precio.
3. Migraciones SQL: `070_interes_precio_consultado.sql` (y opcional `069_idealista_anuncio_cache.sql`).

## Nota UI

**Pendiente · 6.050 €** en la tarjeta son **honorarios**, no presupuesto de compra.
