# Google Calendar ↔ Visitas (panel admin)

La sync **solo funciona en Vercel Production** con estas variables (no basta el login Google de Supabase):

| Variable | Ejemplo |
|----------|---------|
| `GOOGLE_CLIENT_ID` | `311723462282-….apps.googleusercontent.com` (cliente OAuth Web **nuevahabitat**) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` |
| `GOOGLE_REFRESH_TOKEN` | `1//0…` (ver abajo) |
| `GOOGLE_CALENDAR_ID` | `admin.nuevahabitat@gmail.com` |

Opcional: `GOOGLE_CALENDAR_ID_INFO`, `GOOGLE_CALENDAR_SYNC_DAYS_BACK` (180), `GOOGLE_CALENDAR_SYNC_DAYS_AHEAD` (120).

## 1. Google Cloud Console

1. Proyecto **My First Project** (o el que tenga el cliente OAuth).
2. **APIs & Services → OAuth consent screen**: añade scope `…/auth/calendar` y usuario de prueba `admin.nuevahabitat@gmail.com` si la app está en modo Testing.
3. **Credentials → OAuth client Web «nuevahabitat»**:
   - **Authorized redirect URIs** debe incluir:  
     `https://developers.google.com/oauthplayground`

## 2. Generar `GOOGLE_REFRESH_TOKEN` (OAuth Playground)

1. Abre [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Icono **⚙ Settings** → activa **Use your own OAuth credentials**.
3. Pega el mismo **Client ID** y **Client secret** que pondrás en Vercel.
4. En **Step 1**, busca **Google Calendar API v3** → marca  
   `https://www.googleapis.com/auth/calendar` → **Authorize APIs**.
5. Inicia sesión con **`admin.nuevahabitat@gmail.com`** y acepta permisos.
6. **Step 2 → Exchange authorization code for tokens**.
7. Copia el **`Refresh token`** (empieza por `1//` o similar).  
   Si no aparece refresh token: revoca acceso en [Google Account → Third-party apps](https://myaccount.google.com/permissions) y repite con consentimiento nuevo.

## 3. Supabase (alternativa — recomendada si Vercel no tiene el refresh token)

1. SQL Editor → pega y ejecuta `supabase/migrations/062_private_integrations.sql`.
2. Tras deploy en producción: **Admin → Visitas** → formulario «Conectar Google Calendar» → client secret + refresh token → **Guardar y probar**.

El backend lee primero variables de Vercel; si faltan, usa `private_integrations` (solo service role).

## 4. Vercel

1. [Vercel → nuevahabitat → Settings → Environment Variables](https://vercel.com/nuevahabitat/nuevahabitat/settings/environment-variables).
2. Crea las cuatro variables anteriores.
3. **Environment**: marca solo **Production** (o también Preview si quieres probar).
4. Sin comillas en el valor; pega el token completo en una sola línea.
5. **Deployments → … → Redeploy** (el último deployment de `main`).

## 5. Comprobar

1. Entra en [admin-panel](https://www.nuevahabitat.com/admin-panel) como `admin.nuevahabitat@gmail.com`.
2. **Visitas** → **Sincronizar calendario**.
3. El banner debe indicar eventos leídos / nuevas filas (no “Faltan GOOGLE_…”).

Si ves **`invalid_grant`**: el refresh token no coincide con el Client ID/Secret de Vercel o fue revocado — regenera en Playground.

Si ves **`invalid_client`**: Client ID o Secret incorrectos en Vercel.
