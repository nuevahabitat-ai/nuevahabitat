# Leads desde correo con Resend (recomendado)

Ya usáis **Resend** para enviar avisos. Con **Receiving** podéis convertir correos entrantes en **Leads** del panel.

## Arquitectura

```
Cliente escribe → admin@ / info@ / leads@nuevahabitat.com
         ↓
    Resend Receiving (MX del dominio)
         ↓
  Webhook `email.received` (automático)  o  botón / cron (manual)
         ↓
    Tabla `leads` (origen: resend_inbound)
```

**Gmail** (`admin.nuevahabitat@gmail.com`) no puede recibir en Resend directamente: **reenvía** en Gmail a `leads@nuevahabitat.com` (o `info@…`) una vez Receiving esté activo.

---

## 1. Activar Receiving en Resend

1. [Resend Dashboard](https://resend.com) → **Domains** → `nuevahabitat.com`.
2. Activa **Receiving** (registros MX que indica Resend).
3. Cuando esté verificado, cualquier `*@nuevahabitat.com` puede recibir (p. ej. `leads@nuevahabitat.com`).

Variables en **Vercel** (opcional):

```env
RESEND_API_KEY=re_...          # ya la tenéis
RESEND_INBOUND_TO=leads@nuevahabitat.com,info@nuevahabitat.com
```

---

## 2. Reenvío desde Gmail (admin.nuevahabitat@gmail.com)

Gmail → **Configuración** → **Reenvío** → añadir `leads@nuevahabitat.com` → crear filtro “aplicar reenvío” a consultas (o todo el correo entrante).

Así los correos al Gmail del admin también acaban en Resend y entran en Leads.

---

## 3. Panel admin

**Leads → 📥 Importar correos (Resend)**

- Lee la API `GET /emails/receiving` de Resend.
- Crea un lead por mensaje nuevo (sin duplicar).
- Opcionalmente también lee Gmail si tenéis OAuth `gmail.readonly`.

---

## 4. Automático con webhook (recomendado)

1. Resend → **Webhooks** → Add.
2. Evento: **`email.received`**
3. URL:

   `https://www.nuevahabitat.com/api/notify?__action=resend-inbound-webhook`

4. Copia el **signing secret** → Vercel: `RESEND_WEBHOOK_SECRET=whsec_...`
5. Dependencia en el proyecto: `svix` (verificación de firma).

Con esto **cada correo entrante crea el lead al instante** sin pulsar el botón.

---

## 5. Automático con cron (plan Hobby)

Si no usáis webhook, en [cron-job.org](https://cron-job.org) cada 10–15 min:

```bash
curl -sS -X POST 'https://www.nuevahabitat.com/api/notify?__action=admin-sync-resend-inbound' \
  -H 'Authorization: Bearer <JWT admin>' \
  -H 'Content-Type: application/json' \
  -d '{"maxMessages":30}'
```

---

## Qué NO entra como lead

- Avisos internos de formularios web (`@nuevahabitat.com` con “aviso / lead nuevo”).
- `noreply`, mailer-daemon, rebotes.

Ver también: `docs/GMAIL-LEADS.md`