# Sincronizar cuestionarios Alfredo → fichas compradores

Alfredo guarda respuestas en **notas** (`WhatsApp comprador: «…»`) y en criterios parseados (`Ficha: zona · presupuesto · …`). El Excel `fichas-compradores-noviembre-2026.xlsx` (Captador) lista lo respondido y lo que falta en columnas.

## CLI (local)

Requiere `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`.

```bash
# Hoja 1 + 3 del Excel (respuestas y pendientes de campo)
node scripts/sync-alfredo-fichas.mjs --xlsx "D:\Proyectos\Captador\fichas-compradores-noviembre-2026.xlsx"

# Simular
node scripts/sync-alfredo-fichas.mjs --xlsx "..." --dry-run

# Re-parsear TODOS los compradores desde notas + comprador_inmueble_interes
node scripts/sync-alfredo-fichas.mjs --all
```

## API (panel autenticado)

`POST /api/notify?__action=admin-enrich-alfredo-fichas`

- Bearer sesión admin (JWT Supabase), igual que otros `admin-*`.
- Sin body: enriquece todos los compradores con texto en notas/interés.
- Con `{ "rows": [ ... ] }`: filas como las del Excel (parseadas en el cliente).

## Qué hace

1. Parsea el texto con la misma lógica que Captador (`alfredo-comprador-parse.js`).
2. Rellena **solo huecos** en `presupuesto_max`, `zona_buscada`, habitaciones, m², baños, ascensor, balcón, exterior, tipo.
3. Añade notas si faltan la respuesta literal o una línea `Ficha: …` nueva.

No borra datos existentes.
