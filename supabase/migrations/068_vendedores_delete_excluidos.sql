-- Operación eliminada a mano: no recrear desde inmueble (sync / trigger)

CREATE TABLE IF NOT EXISTS vendedores_inmueble_excluidos (
  inmueble_ref text PRIMARY KEY,
  vendedor_id  uuid,
  motivo       text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE vendedores_inmueble_excluidos IS 'Refs NH cuyas operaciones auto no deben recrearse tras eliminar en panel';

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS probable_cierre boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN vendedores.probable_cierre IS 'false = ocultar en cartera (salvo inmueble publicado)';

ALTER TABLE vendedores_inmueble_excluidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS vendedores_inmueble_excluidos_admin ON vendedores_inmueble_excluidos;
CREATE POLICY vendedores_inmueble_excluidos_admin ON vendedores_inmueble_excluidos
  FOR ALL TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

CREATE OR REPLACE FUNCTION public.upsert_vendedor_from_inmueble(
  p_ref text,
  p_nombre text,
  p_tel text,
  p_email text,
  p_precio numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre text := NULLIF(trim(COALESCE(p_nombre, '')), '');
  v_email  text := NULLIF(trim(COALESCE(p_email, '')), '');
  v_tel    text := NULLIF(trim(COALESCE(p_tel, '')), '');
BEGIN
  IF p_ref IS NOT NULL AND trim(p_ref) <> '' AND EXISTS (
    SELECT 1 FROM vendedores_inmueble_excluidos e WHERE e.inmueble_ref = trim(p_ref)
  ) THEN
    RETURN;
  END IF;

  IF v_nombre IS NULL AND v_email IS NULL THEN
    RETURN;
  END IF;

  IF v_email IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM vendedores WHERE lower(trim(email)) = lower(v_email)) THEN
      UPDATE vendedores SET
        nombre        = COALESCE(v_nombre, nombre),
        telefono      = COALESCE(v_tel, telefono),
        inmueble_ref  = p_ref,
        precio_minimo = COALESCE(p_precio, precio_minimo),
        descripcion   = 'Vinculado al inmueble ' || p_ref,
        updated_at    = now()
      WHERE lower(trim(email)) = lower(v_email);
    ELSE
      INSERT INTO vendedores (nombre, email, telefono, inmueble_ref, precio_minimo, descripcion)
      VALUES (
        COALESCE(v_nombre, split_part(v_email, '@', 1), 'Propietario'),
        v_email, v_tel, p_ref, p_precio,
        'Vinculado al inmueble ' || p_ref
      );
    END IF;
  ELSIF EXISTS (SELECT 1 FROM vendedores WHERE inmueble_ref = p_ref) THEN
    UPDATE vendedores SET
      nombre        = COALESCE(v_nombre, nombre),
      telefono      = COALESCE(v_tel, telefono),
      precio_minimo = COALESCE(p_precio, precio_minimo),
      descripcion   = 'Vinculado al inmueble ' || p_ref,
      updated_at    = now()
    WHERE inmueble_ref = p_ref;
  ELSE
    INSERT INTO vendedores (nombre, telefono, inmueble_ref, precio_minimo, descripcion)
    VALUES (
      COALESCE(v_nombre, 'Propietario'), v_tel, p_ref, p_precio,
      'Vinculado al inmueble ' || p_ref
    );
  END IF;
END;
$$;
