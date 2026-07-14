-- ============================================================
-- NuevaHabitat · Migración 014
-- TODO EN UNO: RLS + trigger + RPC sync + backfill
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1) Permisos admin
CREATE OR REPLACE FUNCTION public.is_admin_or_agente()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin','agente')
  )
  OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
  );
$$;

UPDATE perfiles SET rol = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE lower(trim(email)) = 'admin.nuevahabitat@gmail.com');

DROP POLICY IF EXISTS "compradores_admin_rw" ON compradores;
CREATE POLICY "compradores_admin_rw" ON compradores FOR ALL TO authenticated
  USING (public.is_admin_or_agente()) WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "vendedores_admin_rw" ON vendedores;
CREATE POLICY "vendedores_admin_rw" ON vendedores FOR ALL TO authenticated
  USING (public.is_admin_or_agente()) WITH CHECK (public.is_admin_or_agente());

-- 2) Función upsert vendedor
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

-- Trigger simplificado (delega en la función)
CREATE OR REPLACE FUNCTION public.sync_vendedor_from_inmueble()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.upsert_vendedor_from_inmueble(
    new.ref,
    new.propietario_nombre,
    new.propietario_telefono,
    new.propietario_email,
    new.precio
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_vendedor_inmueble ON inmuebles;
CREATE TRIGGER trg_sync_vendedor_inmueble
  AFTER INSERT OR UPDATE
  ON inmuebles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vendedor_from_inmueble();

-- RPC: sincronizar TODOS los inmuebles → vendedores (desde panel admin)
CREATE OR REPLACE FUNCTION public.admin_sync_vendedores()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_synced int := 0;
  v_skipped int := 0;
BEGIN
  IF NOT public.is_admin_or_agente() THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  FOR r IN
    SELECT ref, propietario_nombre, propietario_telefono, propietario_email, precio
    FROM inmuebles
    ORDER BY created_at
  LOOP
    IF COALESCE(trim(r.propietario_nombre), '') = ''
       AND COALESCE(trim(r.propietario_email), '') = '' THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;
    PERFORM public.upsert_vendedor_from_inmueble(
      r.ref, r.propietario_nombre, r.propietario_telefono, r.propietario_email, r.precio
    );
    v_synced := v_synced + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'synced', v_synced,
    'skipped', v_skipped,
    'total_vendedores', (SELECT count(*) FROM vendedores)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_sync_vendedores() TO authenticated;

-- 3) Backfill compradores
INSERT INTO compradores (nombre, email, telefono, activo)
SELECT COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email,'@',1)), u.email, u.raw_user_meta_data->>'telefono', true
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'tipo','comprar') NOT IN ('vender','vendedor')
  AND lower(trim(u.email)) <> 'admin.nuevahabitat@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM compradores c WHERE lower(trim(c.email)) = lower(trim(u.email)));

-- 4) Backfill vendedores desde inmuebles
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT ref, propietario_nombre, propietario_telefono, propietario_email, precio FROM inmuebles LOOP
    IF COALESCE(trim(r.propietario_nombre), '') <> '' OR COALESCE(trim(r.propietario_email), '') <> '' THEN
      PERFORM public.upsert_vendedor_from_inmueble(
        r.ref, r.propietario_nombre, r.propietario_telefono, r.propietario_email, r.precio
      );
    END IF;
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS compradores_created_at_idx ON compradores (created_at DESC);
CREATE INDEX IF NOT EXISTS vendedores_created_at_idx  ON vendedores  (created_at DESC);

-- 5) Resultado
SELECT 'compradores' AS tabla, count(*)::text AS total FROM compradores
UNION ALL SELECT 'vendedores', count(*)::text FROM vendedores
UNION ALL SELECT 'inmuebles_con_propietario', count(*)::text FROM inmuebles
  WHERE propietario_nombre IS NOT NULL OR propietario_email IS NOT NULL;

SELECT nombre, email, inmueble_ref FROM vendedores ORDER BY created_at DESC;
