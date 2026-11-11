# Inferir criterios compradores (pisos consultados)

Rellena `presupuesto_max`, `presupuesto_min` (migración `068`) y criterios derivados del interés Idealista / NH en notas.

## CLI local (recomendado)

Con service role en `.env.local`:

```bash
node scripts/sync-infer-compradores.mjs
node scripts/sync-infer-compradores.mjs --dry-run
```

Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (también acepta `SUPABASE_SERVICE_ROLE` o `NH_SUPABASE_SERVICE_KEY`).

### Sin key local — VPS Captador

Si la key vive en el VPS (`/opt/captador/.env` → `NH_SUPABASE_SERVICE_KEY`), un solo comando descarga la key al `.env.local` y lanza la inferencia:

```bash
python scripts/run-infer-from-vps-env.py --write-env
```

Requiere `VPS_HOST`, `VPS_PASS` en `D:\Proyectos\Captador\.env` (gitignored).

Solo ejecutar sin escribir `.env.local`:

```bash
python scripts/run-infer-from-vps-env.py
```

## Panel / API

`POST /api/notify?__action=admin-infer-comprador-criterios`

- Un comprador: `{ "compradorId": "uuid" }`
- Todos (límite servidor): sin id o desde el botón «Criterios desde pisos» en compradores.

## Reglas

- **Máximo** = mayor precio de pisos señalados; **mínimo** = máximo − 50 000 € (`PRESUPUESTO_MARGEN_INFER`).
- Compradores sin precio en interés/notas/inmueble vinculado quedan en `skipped` (vincular `idealista_id` en `inmuebles` mejora cobertura).
