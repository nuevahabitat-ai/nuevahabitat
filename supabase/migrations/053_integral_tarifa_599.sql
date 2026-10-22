-- Alquiler integral: tarifa 599 € IVA incl. (oct 2025)
ALTER TABLE propietarios_alquiler
  ALTER COLUMN integral_tarifa SET DEFAULT 599;

COMMENT ON COLUMN propietarios_alquiler.integral_pagado IS 'Pago único 599 € confirmado (Stripe o manual)';

-- Expedientes integral sin pago aún: alinear tarifa publicada
UPDATE propietarios_alquiler
SET integral_tarifa = 599
WHERE servicio = 'integral'
  AND integral_tarifa = 499
  AND integral_pagado IS NOT TRUE;

CREATE OR REPLACE FUNCTION public.sync_propietario_alquiler()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  unombre text;
  utel text;
  utipo text;
  vservicio text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT u.email,
         COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nombre'), ''), split_part(u.email, '@', 1)),
         NULLIF(trim(u.raw_user_meta_data->>'telefono'), ''),
         COALESCE(NULLIF(trim(u.raw_user_meta_data->>'tipo'), ''), NULLIF(trim(u.raw_user_meta_data->>'servicio'), ''))
  INTO uemail, unombre, utel, utipo
  FROM auth.users u
  WHERE u.id = uid;

  IF uemail IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF lower(trim(uemail)) = 'admin.nuevahabitat@gmail.com' THEN
    RETURN;
  END IF;

  vservicio := CASE
    WHEN utipo IN ('alquiler_integral', 'integral') THEN 'integral'
    WHEN COALESCE(NULLIF(trim((SELECT raw_user_meta_data->>'servicio' FROM auth.users WHERE id = uid)), ''), '') = 'integral' THEN 'integral'
    ELSE 'administracion'
  END;

  INSERT INTO public.perfiles (id, nombre, rol, telefono)
  VALUES (uid, unombre, 'cliente', utel)
  ON CONFLICT (id) DO UPDATE SET
    nombre   = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  IF NOT EXISTS (
    SELECT 1 FROM public.propietarios_alquiler p
    WHERE lower(trim(p.email)) = lower(trim(uemail))
  ) THEN
    INSERT INTO public.propietarios_alquiler (perfil_id, nombre, email, telefono, servicio, cuota_mensual, integral_tarifa)
    VALUES (uid, unombre, uemail, utel, vservicio,
      CASE WHEN vservicio = 'integral' THEN 0 ELSE 60 END,
      599);
  ELSE
    UPDATE public.propietarios_alquiler
    SET perfil_id = COALESCE(perfil_id, uid),
        nombre = COALESCE(NULLIF(trim(nombre), ''), unombre),
        telefono = COALESCE(telefono, utel),
        servicio = vservicio,
        cuota_mensual = CASE WHEN vservicio = 'integral' THEN 0 ELSE COALESCE(NULLIF(cuota_mensual, 0), 60) END,
        integral_tarifa = COALESCE(integral_tarifa, 599)
    WHERE lower(trim(email)) = lower(trim(uemail));
  END IF;
END;
$$;

NOTIFY pgrst, 'reload schema';
