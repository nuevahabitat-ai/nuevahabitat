# NuevaHabitat · Supabase

## Configuración

1. Crea un proyecto en https://supabase.com
2. Ve a **SQL Editor** y ejecuta en orden:
   - `migrations/001_initial_schema.sql`
3. Copia las credenciales en `.env.local`:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...   (solo en servidor/admin)
```

## Tablas

| Tabla | Descripción |
|---|---|
| `agentes` | Agentes inmobiliarios |
| `inmuebles` | Cartera de propiedades con todos sus datos |
| `perfiles` | Perfiles de usuario vinculados a `auth.users` |
| `leads` | Solicitudes de contacto desde cualquier formulario |
| `favoritos` | Inmuebles guardados por cada usuario |
| `visitas` | Visitas programadas a inmuebles |
| `valoraciones` | Solicitudes de valoración para vender |
| `blog_posts` | Artículos del blog |
| `newsletter` | Suscriptores del boletín |

## Storage Buckets (crear manualmente)

- `imagenes-inmuebles` — fotos de propiedades (público)
- `documentos` — contratos y fichas (privado, solo agentes)
- `logos` — logos y assets de marca (público)

## Auth

Se usa Supabase Auth (email+password y OAuth Google).
El trigger `on auth.users insert` crea automáticamente un perfil en `perfiles`.

```sql
-- Añadir en Supabase Dashboard > Database > Functions
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into perfiles (id, nombre, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

## RLS (Row Level Security)

Ya configurada en la migración:
- Inmuebles: lectura pública (excepto `retirado`), escritura solo `agente`/`admin`
- Perfiles: cada usuario ve y edita el suyo; agentes ven todos sus clientes
- Leads: solo agentes y admins + el propio usuario
- Favoritos: cada usuario ve los suyos
- Blog: lectura pública de publicados; escritura solo `admin`
