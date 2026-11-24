# Migraciones Idealista (compradores) en Supabase

Abre **Supabase → SQL Editor** y ejecuta **en este orden** el contenido de cada archivo (copiar/pegar o adjuntar):

1. `supabase/migrations/066_compradores_idealista_import.sql`
2. `supabase/migrations/067_interes_inmueble_ref.sql`
3. `supabase/migrations/068_compradores_presupuesto_min.sql`
4. `supabase/migrations/069_idealista_anuncio_cache.sql`
5. `supabase/migrations/070_interes_precio_consultado.sql`

Opcionales recientes (descartados / backfill): **071**, **072**.

## Kelify

No hay migración Kelify pendiente para esta importación. Kelify usa la tabla `particulares` (migración **021** y siguientes de seguimientos).

## Después de aplicar

1. Vuelve a importar el Excel Idealista, **o**
2. En panel (si tienes acción admin): `admin-finalize-idealista-fichas` para rellenar presupuestos desde notas/caché.

Los compradores con notas `[Idealista import]` sin precio suelen necesitar columna **PRECIO** en el export o migraciones **066–070** aplicadas.