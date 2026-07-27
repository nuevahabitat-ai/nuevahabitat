-- ============================================================
-- NuevaHabitat · Migración 024
-- Garantiza perfil del usuario autenticado (panel calendario)
-- ============================================================

CREATE OR REPLACE FUNCTION public.ensure_perfil()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uname text;
  utel text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT
    COALESCE(NULLIF(trim(raw_user_meta_data->>'nombre'), ''), split_part(email, '@', 1)),
    NULLIF(trim(raw_user_meta_data->>'telefono'), '')
  INTO uname, utel
  FROM auth.users
  WHERE id = uid;

  INSERT INTO public.perfiles (id, nombre, telefono, rol)
  VALUES (uid, uname, utel, 'cliente')
  ON CONFLICT (id) DO UPDATE SET
    nombre   = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  RETURN uid;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_perfil() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_perfil() TO authenticated;

-- ============================================================
-- FIN
-- ============================================================
