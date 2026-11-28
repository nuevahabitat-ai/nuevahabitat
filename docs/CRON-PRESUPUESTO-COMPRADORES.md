# Presupuesto compradores (sin cron Vercel Hobby)

En plan **Vercel Hobby** no conviene declarar `crons` en `vercel.json` (bloquea el deploy).

**Opciones para rellenar precios:**

1. Panel **Compradores** → **⚡ Forzar precios**
2. Al abrir Compradores, sync automático en segundo plano (`admin-auto-presupuesto-compradores`)
3. Llamada manual (con `CRON_SECRET` en env):

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.nuevahabitat.com/api/cron-presupuesto-compradores"
```

La URL es un **rewrite** a `notify` (no hay fichero `api/cron-*.js` aparte: el plan Hobby solo permite 12 funciones). Ver `docs/VERCEL-HOBBY-LIMITES.md`.