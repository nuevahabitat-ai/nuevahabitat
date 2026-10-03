-- ============================================================
-- NuevaHabitat · Migración 049 — RPC panel propietario (044/045/046)
-- Error típico: Could not find the function update_propietario_alquiler_expediente
-- Ejecutar en Supabase SQL Editor + recarga schema PostgREST
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_propietario_alquiler_expediente(p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  unombre text;
  utel text;
  row propietarios_alquiler;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT u.email,
         COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nombre'), ''), split_part(u.email, '@', 1)),
         NULLIF(trim(u.raw_user_meta_data->>'telefono'), '')
  INTO uemail, unombre, utel
  FROM auth.users u
  WHERE u.id = uid;

  IF uemail IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  PERFORM public.sync_propietario_alquiler();

  SELECT * INTO row FROM propietarios_alquiler
  WHERE lower(trim(email)) = lower(trim(uemail))
  LIMIT 1;

  IF row.id IS NULL THEN
    INSERT INTO public.propietarios_alquiler (perfil_id, nombre, email, telefono)
    VALUES (uid, unombre, uemail, utel)
    RETURNING * INTO row;
  END IF;

  UPDATE propietarios_alquiler SET
    nombre = COALESCE(NULLIF(trim(p_data->>'nombre'), ''), nombre),
    dni = CASE WHEN p_data ? 'dni' THEN NULLIF(trim(p_data->>'dni'), '') ELSE dni END,
    telefono = COALESCE(NULLIF(trim(p_data->>'telefono'), ''), telefono),
    direccion_propietario = CASE WHEN p_data ? 'direccion_propietario' THEN NULLIF(trim(p_data->>'direccion_propietario'), '') ELSE direccion_propietario END,
    iban_cobro = CASE WHEN p_data ? 'iban_cobro' THEN NULLIF(trim(p_data->>'iban_cobro'), '') ELSE iban_cobro END,
    notas_propietario = CASE WHEN p_data ? 'notas_propietario' THEN NULLIF(trim(p_data->>'notas_propietario'), '') ELSE notas_propietario END,
    inquilino_nombre = CASE WHEN p_data ? 'inquilino_nombre' THEN NULLIF(trim(p_data->>'inquilino_nombre'), '') ELSE inquilino_nombre END,
    inquilino_telefono = CASE WHEN p_data ? 'inquilino_telefono' THEN NULLIF(trim(p_data->>'inquilino_telefono'), '') ELSE inquilino_telefono END,
    inquilino_email = CASE WHEN p_data ? 'inquilino_email' THEN NULLIF(trim(p_data->>'inquilino_email'), '') ELSE inquilino_email END,
    contrato_inicio = CASE WHEN p_data ? 'contrato_inicio' THEN NULLIF(p_data->>'contrato_inicio', '')::date ELSE contrato_inicio END,
    contrato_fin = CASE WHEN p_data ? 'contrato_fin' THEN NULLIF(p_data->>'contrato_fin', '')::date ELSE contrato_fin END,
    inmueble_direccion = CASE WHEN p_data ? 'inmueble_direccion' THEN NULLIF(trim(p_data->>'inmueble_direccion'), '') ELSE inmueble_direccion END,
    inmueble_ref = CASE WHEN p_data ? 'inmueble_ref' THEN NULLIF(trim(p_data->>'inmueble_ref'), '') ELSE inmueble_ref END,
    inmueble_ref_catastral = CASE WHEN p_data ? 'inmueble_ref_catastral' THEN NULLIF(trim(p_data->>'inmueble_ref_catastral'), '') ELSE inmueble_ref_catastral END,
    renta_mensual = CASE WHEN p_data ? 'renta_mensual' THEN NULLIF(p_data->>'renta_mensual', '')::numeric ELSE renta_mensual END,
    inmueble_notas = CASE WHEN p_data ? 'inmueble_notas' THEN NULLIF(trim(p_data->>'inmueble_notas'), '') ELSE inmueble_notas END,
    estado_gestion = CASE
      WHEN estado_gestion = 'alta' AND NULLIF(trim(p_data->>'inmueble_direccion'), '') IS NOT NULL
        THEN 'documentacion'
      ELSE estado_gestion
    END
  WHERE id = row.id
  RETURNING * INTO row;

  RETURN to_jsonb(row);
END;
$$;

REVOKE ALL ON FUNCTION public.update_propietario_alquiler_expediente(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_propietario_alquiler_expediente(jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_my_propietario_alquiler()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  row propietarios_alquiler;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT email INTO uemail FROM auth.users WHERE id = uid;
  PERFORM public.sync_propietario_alquiler();

  SELECT * INTO row FROM public.propietarios_alquiler
  WHERE lower(trim(email)) = lower(trim(uemail))
  LIMIT 1;

  IF row.id IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(row);
END;
$$;

REVOKE ALL ON FUNCTION public.get_my_propietario_alquiler() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_propietario_alquiler() TO authenticated;

NOTIFY pgrst, 'reload schema';
