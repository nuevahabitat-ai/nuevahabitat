-- Alinear expedientes integral en BD + listado admin fiable
UPDATE public.propietarios_alquiler p
SET
  servicio = 'integral',
  cuota_mensual = 0,
  integral_tarifa = COALESCE(p.integral_tarifa, 499),
  updated_at = now()
FROM auth.users u
WHERE lower(trim(p.email)) = lower(trim(u.email))
  AND (
    COALESCE(u.raw_user_meta_data->>'tipo', '') IN ('alquiler_integral', 'integral')
    OR COALESCE(u.raw_user_meta_data->>'servicio', '') = 'integral'
  )
  AND COALESCE(p.servicio, 'administracion') <> 'integral';

CREATE OR REPLACE FUNCTION public.admin_list_propietarios_alquiler()
RETURNS SETOF public.propietarios_alquiler
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.*
  FROM public.propietarios_alquiler p
  WHERE public.is_admin_or_agente()
  ORDER BY p.updated_at DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.admin_list_propietarios_alquiler() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_propietarios_alquiler() TO authenticated;

NOTIFY pgrst, 'reload schema';
