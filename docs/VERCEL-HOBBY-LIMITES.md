# Vercel Hobby — límites que afectan a este repo

## 12 funciones serverless por deploy (causa principal de fallos recientes)

Este sitio **no usa Next.js**: cada `api/*.js` es **una** función serverless.

En plan **Hobby** el máximo es **12 por deployment**. Si hay 13+, el build en GitHub puede estar en verde pero **Vercel falla al final** («Deploying outputs…») con algo equivalente a:

`No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan`

El 28-nov-2026 añadimos `api/cron-presupuesto-compradores.js` → **13ª función** → 5 días sin producción nueva aunque quitáramos los crons de `vercel.json`.

**Solución aplicada:** el cron HTTP va por **rewrite** a `api/notify` (`__action=cron-presupuesto-compradores`). Una ruta nueva = preferible rewrite, no un `.js` nuevo.

**Comprobación local / CI:**

```bash
node scripts/check-vercel-function-count.mjs
```

## Crons en vercel.json

Hobby solo admite expresiones que corren **una vez al día** (`0 7 * * *` OK; `0 */2 * * *` **bloquea** el deploy).

No declarar `crons` frecuentes aquí; usar panel **Forzar precios**, `admin-auto-presupuesto-compradores` o un cron externo (cron-job.org) contra la URL con `CRON_SECRET`.

Ver también `docs/CRON-PRESUPUESTO-COMPRADORES.md`.

## Por qué otros proyectos Hobby van bien

La mayoría usan **Next.js** (varias rutas se empaquetan en pocas funciones) o tienen **menos de 12** archivos en `api/`. Este repo lleva ~12 APIs explícitas + WhatsApp; **cualquier** `api/nuevo.js` sin quitar otro rompe producción.