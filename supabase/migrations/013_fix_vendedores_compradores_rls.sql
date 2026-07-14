-- ============================================================
-- NuevaHabitat · Migración 013
-- Fix: vendedor auto al publicar inmueble + RLS admin + backfill
-- Ejecutar en Supabase → SQL Editor (después de la 012)
-- ============================================================

-- ── 1. Helper: admin/agente (incluye email admin como respaldo) ──
CREATE OR REPLACE FUNCTION public.is_admin_or_agente()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid() AND rol IN ('admin', 'agente')
  )
  OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
  );
$$;


-- ── 2. Asegurar rol admin en cuenta principal ─────────────────
UPDATE perfiles
SET rol = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
);


-- ── 3. RLS compradores / vendedores (admin por rol o email) ───
DROP POLICY IF EXISTS "compradores_admin_rw" ON compradores;
CREATE POLICY "compradores_admin_rw" ON compradores
  FOR ALL
  TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "vendedores_admin_rw" ON vendedores;
CREATE POLICY "vendedores_admin_rw" ON vendedores
  FOR ALL
  TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());


-- ── 4. TRIGGER: vendedor automático al crear/editar inmueble ─
CREATE OR REPLACE FUNCTION public.sync_vendedor_from_inmueble()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre text;
  v_email  text;
  v_tel    text;
BEGIN
  v_nombre := NULLIF(trim(COALESCE(new.propietario_nombre, '')), '');
  v_email  := NULLIF(trim(COALESCE(new.propietario_email, '')), '');
  v_tel    := NULLIF(trim(COALESCE(new.propietario_telefono, '')), '');

  IF v_nombre IS NULL AND v_email IS NULL THEN
    RETURN new;
  END IF;

  IF v_email IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM vendedores v
      WHERE lower(trim(v.email)) = lower(v_email)
    ) THEN
      UPDATE vendedores SET
        nombre        = COALESCE(v_nombre, nombre),
        telefono      = COALESCE(v_tel, telefono),
        inmueble_ref  = new.ref,
        precio_minimo = COALESCE(new.precio, precio_minimo),
        descripcion   = 'Vinculado al inmueble ' || new.ref,
        updated_at    = now()
      WHERE lower(trim(email)) = lower(v_email);
    ELSE
      INSERT INTO vendedores (nombre, email, telefono, inmueble_ref, precio_minimo, descripcion)
      VALUES (
        COALESCE(v_nombre, split_part(v_email, '@', 1), 'Propietario'),
        v_email,
        v_tel,
        new.ref,
        new.precio,
        'Vinculado al inmueble ' || new.ref
      );
    END IF;
  ELSIF EXISTS (SELECT 1 FROM vendedores v WHERE v.inmueble_ref = new.ref) THEN
    UPDATE vendedores SET
      nombre        = COALESCE(v_nombre, nombre),
      telefono      = COALESCE(v_tel, telefono),
      precio_minimo = COALESCE(new.precio, precio_minimo),
      descripcion   = 'Vinculado al inmueble ' || new.ref,
      updated_at    = now()
    WHERE inmueble_ref = new.ref;
  ELSE
    INSERT INTO vendedores (nombre, telefono, inmueble_ref, precio_minimo, descripcion)
    VALUES (
      COALESCE(v_nombre, 'Propietario'),
      v_tel,
      new.ref,
      new.precio,
      'Vinculado al inmueble ' || new.ref
    );
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_vendedor_inmueble ON inmuebles;
CREATE TRIGGER trg_sync_vendedor_inmueble
  AFTER INSERT OR UPDATE OF propietario_nombre, propietario_telefono, propietario_email, ref, precio
  ON inmuebles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vendedor_from_inmueble();


-- ── 5. BACKFILL: compradores desde usuarios registrados ───────
INSERT INTO compradores (nombre, email, telefono, activo)
SELECT
  COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email, '@', 1)),
  u.email,
  u.raw_user_meta_data->>'telefono',
  true
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'tipo', 'comprar') NOT IN ('vender', 'vendedor')
  AND lower(trim(u.email)) <> 'admin.nuevahabitat@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM compradores c
    WHERE lower(trim(c.email)) = lower(trim(u.email))
  );


-- ── 6. BACKFILL: vendedores desde inmuebles existentes ───────
INSERT INTO vendedores (nombre, email, telefono, inmueble_ref, precio_minimo, descripcion)
SELECT DISTINCT ON (lower(trim(i.propietario_email)))
  COALESCE(NULLIF(trim(i.propietario_nombre), ''), split_part(i.propietario_email, '@', 1), 'Propietario'),
  i.propietario_email,
  NULLIF(trim(i.propietario_telefono), ''),
  i.ref,
  i.precio,
  'Vinculado al inmueble ' || i.ref
FROM inmuebles i
WHERE i.propietario_email IS NOT NULL
  AND trim(i.propietario_email) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM vendedores v
    WHERE lower(trim(v.email)) = lower(trim(i.propietario_email))
  )
ORDER BY lower(trim(i.propietario_email)), i.updated_at DESC NULLS LAST, i.created_at DESC;

INSERT INTO vendedores (nombre, telefono, inmueble_ref, precio_minimo, descripcion)
SELECT
  COALESCE(NULLIF(trim(i.propietario_nombre), ''), 'Propietario'),
  NULLIF(trim(i.propietario_telefono), ''),
  i.ref,
  i.precio,
  'Vinculado al inmueble ' || i.ref
FROM inmuebles i
WHERE (i.propietario_email IS NULL OR trim(i.propietario_email) = '')
  AND i.propietario_nombre IS NOT NULL
  AND trim(i.propietario_nombre) <> ''
  AND NOT EXISTS (
    SELECT 1 FROM vendedores v WHERE v.inmueble_ref = i.ref
  );


-- ── 7. Índices de rendimiento ─────────────────────────────────
CREATE INDEX IF NOT EXISTS compradores_created_at_idx ON compradores (created_at DESC);
CREATE INDEX IF NOT EXISTS vendedores_created_at_idx  ON vendedores  (created_at DESC);
CREATE INDEX IF NOT EXISTS compradores_email_lower_idx ON compradores (lower(trim(email)));
CREATE INDEX IF NOT EXISTS vendedores_email_lower_idx  ON vendedores  (lower(trim(email)));

-- ============================================================
-- FIN · Verifica:
--   SELECT count(*) FROM compradores;
--   SELECT count(*) FROM vendedores;
--   SELECT ref, propietario_nombre FROM inmuebles;
-- ============================================================
