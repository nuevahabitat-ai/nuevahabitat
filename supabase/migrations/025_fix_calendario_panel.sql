-- ============================================================
-- NuevaHabitat · Migración 025 — FIX DEFINITIVO calendario panel
-- Ejecutar UNA VEZ en Supabase SQL Editor (producción)
-- ============================================================

-- 1) Esquema visitas (023 reforzado)
ALTER TABLE visitas ALTER COLUMN inmueble_id DROP NOT NULL;

ALTER TABLE visitas
  ADD COLUMN IF NOT EXISTS tipo_solicitud text NOT NULL DEFAULT 'visita';

-- 2) Política INSERT pública (por si faltaba)
DROP POLICY IF EXISTS "visitas_public_insert" ON visitas;
CREATE POLICY "visitas_public_insert" ON visitas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3) RPC panel — inserta con permisos elevados
CREATE OR REPLACE FUNCTION public.registrar_disponibilidad_panel(
  p_fecha_hora timestamptz,
  p_notas text,
  p_tipo_solicitud text DEFAULT 'disponibilidad_vendedor',
  p_inmueble_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  vid uuid;
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
  FROM auth.users WHERE id = uid;

  INSERT INTO perfiles (id, nombre, telefono, rol)
  VALUES (uid, uname, utel, 'cliente')
  ON CONFLICT (id) DO UPDATE SET
    nombre = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    telefono = COALESCE(EXCLUDED.telefono, perfiles.telefono);

  BEGIN
    INSERT INTO visitas (perfil_id, inmueble_id, estado, fecha_hora, notas, tipo_solicitud)
    VALUES (uid, p_inmueble_id, 'pendiente', p_fecha_hora, p_notas, p_tipo_solicitud)
    RETURNING id INTO vid;
  EXCEPTION
    WHEN undefined_column THEN
      INSERT INTO visitas (perfil_id, inmueble_id, estado, fecha_hora, notas)
      VALUES (uid, p_inmueble_id, 'pendiente', p_fecha_hora, p_notas)
      RETURNING id INTO vid;
    WHEN not_null_violation THEN
      INSERT INTO visitas (perfil_id, estado, fecha_hora, notas)
      VALUES (uid, 'pendiente', p_fecha_hora, p_notas)
      RETURNING id INTO vid;
  END;

  RETURN vid;
END;
$$;

REVOKE ALL ON FUNCTION public.registrar_disponibilidad_panel(timestamptz, text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registrar_disponibilidad_panel(timestamptz, text, text, uuid) TO authenticated;

-- 4) Verificación
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'visitas'
  AND column_name IN ('inmueble_id', 'tipo_solicitud');

-- ============================================================
-- FIN · Debe mostrar inmueble_id YES y tipo_solicitud YES
-- ============================================================
