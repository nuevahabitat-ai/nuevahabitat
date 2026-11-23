# Importar contactos Idealista → Compradores

## En el panel (recomendado)

1. Abre [https://www.nuevahabitat.com/admin-import-idealista](https://www.nuevahabitat.com/admin-import-idealista) (o el enlace en **Compradores** del admin).
2. Inicia sesión con tu usuario del panel.
3. Sube **CSV** (`;`) o el Excel original (.xls/.xlsx).
4. Pulsa **Importar compradores**.

Plantilla vacía: [`docs/plantilla-idealista-compradores.csv`](plantilla-idealista-compradores.csv)

## Columnas del export Idealista

`REF. IDEALISTA`, `REF. CLIENTE`, `DESCRIPCIÓN`, `USUARIO`, `ORIGEN`, `ESTADO`, `EMAIL`, `TELÉFONO`, `MENSAJE`, `TIPO DE MENSAJE`, `FECHA`, `IDIOMA`

Opcional (recomendado si Idealista bloquea el scrape): **`PRECIO`** o **`PRECIO ANUNCIO`** (precio de venta del anuncio). Si no viene en columna, el import intenta leer € en descripción/mensaje.

La clave de deduplicación es **teléfono** (comprador activo).

## Vínculo con inmuebles NH

En cada inmueble del panel (wizard **Nuevo inmueble**), coloca **Ref. Idealista** (`idealista_id` en Supabase) igual que la columna `REF. IDEALISTA` del Excel. Si el campo **precio** está vacío, el panel intenta rellenarlo desde la caché Idealista al salir del campo. Así se calcula **presupuesto máximo** en compradores y aparecen en **avisos de rebaja**.

## Presupuesto (compraventa)

En cada import, **siempre** que se conoce el precio del anuncio:

- `presupuesto_max` = precio de venta del piso consultado (columna PRECIO, inmueble NH vinculado, caché o scrape Idealista).
- `presupuesto_min` = `presupuesto_max` − **50.000 €**.

## Migraciones Supabase (no Kelify)

**Kelify** (particulares / José) no tiene migración pendiente: va con `021_particulares_seguimientos.sql`.

Para **import Idealista → compradores**, ejecuta en SQL Editor (en orden):

| Migración | Qué hace |
|-----------|----------|
| **066** | `comprador_inmueble_interes`, `inmuebles.idealista_id` |
| **067** | `inmueble_ref` en intereses |
| **068** | `compradores.presupuesto_min` |
| **069** | caché precios Idealista |
| **070** | `precio_consultado` en intereses |

Si falta la **066**, verás el error en el import y no se guardan intereses (pero los compradores sí pueden crearse). Si falta la **068**, el panel muestra «sin dato» en rango compraventa hasta aplicarla o reimportar.

## Desde tu PC

Convertir Excel a CSV:

```bash
npm run idealista:csv -- "C:\ruta\retert.xls"
```

Import directo a Supabase (con `.env.local` y service role):

```bash
npm run idealista:import -- "C:\ruta\retert-idealista.csv"
```

Dry-run (solo cuenta filas):

```bash
node scripts/import-idealista-compradores-cli.mjs --dry-run "contactos.csv"
```
