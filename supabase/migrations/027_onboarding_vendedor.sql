-- ============================================================
-- NuevaHabitat · Migración 027 — Onboarding vendedor + inmueble
-- Ejecutar en Supabase SQL Editor (producción)
-- ============================================================

CREATE OR REPLACE FUNCTION public.registrar_inmueble_vendedor(
  p_nombre    text,
  p_telefono  text,
  p_direccion text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
  v_ref text;
  v_slug text;
  v_inm_id uuid;
  v_existing_ref text;
  v_intentos int := 0;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF NULLIF(trim(p_nombre), '') IS NULL THEN
    RAISE EXCEPTION 'nombre required';
  END IF;
  IF NULLIF(trim(p_telefono), '') IS NULL THEN
    RAISE EXCEPTION 'telefono required';
  END IF;
  IF NULLIF(trim(p_direccion), '') IS NULL THEN
    RAISE EXCEPTION 'direccion required';
  END IF;

  SELECT email INTO uemail FROM auth.users WHERE id = uid;
  IF uemail IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF lower(trim(uemail)) = 'admin.nuevahabitat@gmail.com' THEN
    RAISE EXCEPTION 'admin cannot use vendedor onboarding';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM vendedores v WHERE lower(trim(v.email)) = lower(trim(uemail))
  ) THEN
    INSERT INTO vendedores (nombre, email, telefono)
    VALUES (trim(p_nombre), uemail, trim(p_telefono));
  END IF;

  SELECT inmueble_ref INTO v_existing_ref
  FROM vendedores
  WHERE lower(trim(email)) = lower(trim(uemail));

  IF v_existing_ref IS NOT NULL AND trim(v_existing_ref) <> '' THEN
    SELECT id INTO v_inm_id FROM inmuebles WHERE ref = v_existing_ref;
    RETURN jsonb_build_object(
      'ok', true,
      'ref', v_existing_ref,
      'inmueble_id', v_inm_id,
      'already', true
    );
  END IF;

  LOOP
    v_intentos := v_intentos + 1;
    v_ref := 'NH-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random() * 10000))::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM inmuebles i WHERE i.ref = v_ref);
    IF v_intentos > 30 THEN
      RAISE EXCEPTION 'could not generate ref';
    END IF;
  END LOOP;

  v_slug := lower(regexp_replace(v_ref, '[^a-zA-Z0-9]+', '-', 'g'))
         || '-'
         || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);

  INSERT INTO inmuebles (
    ref,
    slug,
    titulo,
    descripcion,
    tipo,
    estado,
    precio,
    direccion,
    propietario_nombre,
    propietario_telefono,
    propietario_email,
    cartera_privada,
    publicado
  ) VALUES (
    v_ref,
    v_slug,
    'Inmueble en venta — ' || left(trim(p_direccion), 120),
    'Alta desde panel vendedor. Pendiente de valoración por el equipo NuevaHabitat.',
    'piso',
    'retirado',
    0,
    trim(p_direccion),
    trim(p_nombre),
    trim(p_telefono),
    uemail,
    true,
    false
  )
  RETURNING id INTO v_inm_id;

  UPDATE vendedores SET
    nombre            = trim(p_nombre),
    telefono          = trim(p_telefono),
    inmueble_ref      = v_ref,
    descripcion       = 'Inmueble: ' || trim(p_direccion),
    estado_expediente = 'valoracion',
    updated_at        = now()
  WHERE lower(trim(email)) = lower(trim(uemail));

  RETURN jsonb_build_object(
    'ok', true,
    'ref', v_ref,
    'inmueble_id', v_inm_id,
    'already', false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.registrar_inmueble_vendedor(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registrar_inmueble_vendedor(text, text, text) TO authenticated;
