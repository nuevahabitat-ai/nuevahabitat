# Leads desde correo (admin.nuevahabitat@gmail.com)

## Cómo funciona hoy

| Origen | ¿Entra solo en Leads? |
|--------|------------------------|
| Formularios web | Sí (automático) |
| Resend → aviso a admin | **No** — solo email de notificación |
| Correo directo a Gmail | **Sí, con import** — botón **📥 Importar correos Gmail** en Leads |

No leemos el buzón en tiempo real cada segundo (límite plan Hobby): se **importa bajo demanda** o al abrir Leads si activas sync automático en el panel.

## Activar Gmail (una vez)

El panel ya usa **Google OAuth** para calendario. Hay que **añadir permiso de lectura de Gmail** al mismo refresh token:

1. [OAuth Playground](https://developers.google.com/oauthplayground/)
2. ⚙ **Use your own OAuth credentials** (Client ID / Secret de Google Cloud, proyecto nuevahabitat).
3. En **Step 1**, marca:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/gmail.readonly`
4. Inicia sesión con **admin.nuevahabitat@gmail.com** y autoriza.
5. **Step 2** → *Exchange authorization code for tokens* → copia el **refresh token**.
6. Guárdalo en Vercel (`GOOGLE_REFRESH_TOKEN`) y/o en **Configuraciones → Google Calendar** del admin (mismo trío Client ID + Secret + Refresh).

## Uso en el panel

**Leads → 📥 Importar correos Gmail**

- Lee la bandeja de entrada (últimos ~14 días).
- Crea un lead por mensaje nuevo (`origen: gmail_inbound`).
- Extrae teléfono del cuerpo si puede; si no, deja un teléfono técnico y el **email** del remitente.
- Ignora avisos internos, noreply y correos desde @nuevahabitat.com que parecen avisos de formulario.
- No duplica: cada mensaje usa `procedencia: gmail_msg:<id>`.

## Automatizar (opcional)

En [cron-job.org](https://cron-job.org) u otro scheduler, cada 15–30 min:

```bash
curl -sS -X POST 'https://www.nuevahabitat.com/api/notify?__action=admin-sync-gmail-leads' \
  -H "Authorization: Bearer <JWT admin>" \
  -H "Content-Type: application/json" \
  -d '{"maxMessages":25}'
```

(Necesitas un JWT de sesión admin o ampliar con `CRON_SECRET` si lo pedís.)

## Alternativa: Resend Inbound

Si más adelante recepcionáis en `leads@nuevahabitat.com` (dominio verificado en Resend), se puede enganchar webhook `email.received` al mismo insertador. El Gmail de `@gmail.com` no pasa por Resend Inbound.