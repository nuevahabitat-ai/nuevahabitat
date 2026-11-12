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

Requiere migración `supabase/migrations/066_compradores_idealista_import.sql` aplicada en Supabase.

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
