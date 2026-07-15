-- ============================================================
-- NuevaHabitat · TODO EN UNO CORREGIDO
-- Fix permisos + vendedores auto + backfill + verificación
-- Seguro de ejecutar varias veces (idempotente)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- ── 1) Funciones seguras (sin auth.users en políticas) ────────
CREATE OR REPLACE FUNCTION public.auth_user_email()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.auth_user_email_lower()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(trim(COALESCE(email, ''))) FROM auth.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_agente()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin','agente')
  )
  OR lower(trim(COALESCE(auth.jwt() ->> 'email', ''))) = 'admin.nuevahabitat@gmail.com';
$$;

GRANT EXECUTE ON FUNCTION public.auth_user_email() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.auth_user_email_lower() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_agente() TO authenticated, anon;

UPDATE perfiles SET rol = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE lower(trim(email)) = 'admin.nuevahabitat@gmail.com'
);

-- ── 2) RLS compradores / vendedores ───────────────────────────
DROP POLICY IF EXISTS "compradores_admin_rw" ON compradores;
CREATE POLICY "compradores_admin_rw" ON compradores FOR ALL TO authenticated
  USING (public.is_admin_or_agente()) WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "compradores_own_read" ON compradores;
CREATE POLICY "compradores_own_read" ON compradores FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "compradores_self_insert" ON compradores;
CREATE POLICY "compradores_self_insert" ON compradores FOR INSERT TO authenticated
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "compradores_self_update" ON compradores;
CREATE POLICY "compradores_self_update" ON compradores FOR UPDATE TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower())
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "vendedores_admin_rw" ON vendedores;
CREATE POLICY "vendedores_admin_rw" ON vendedores FOR ALL TO authenticated
  USING (public.is_admin_or_agente()) WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "vendedores_own_read" ON vendedores;
CREATE POLICY "vendedores_own_read" ON vendedores FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "vendedores_self_insert" ON vendedores;
CREATE POLICY "vendedores_self_insert" ON vendedores FOR INSERT TO authenticated
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "vendedores_self_update" ON vendedores;
CREATE POLICY "vendedores_self_update" ON vendedores FOR UPDATE TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower())
  WITH CHECK (lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "leads_admin_read" ON leads;
CREATE POLICY "leads_admin_read" ON leads FOR SELECT TO authenticated
  USING (public.is_admin_or_agente() OR perfil_id = auth.uid() OR lower(trim(email)) = public.auth_user_email_lower());

DROP POLICY IF EXISTS "leads_own" ON leads;
CREATE POLICY "leads_own" ON leads FOR SELECT TO authenticated
  USING (lower(trim(email)) = public.auth_user_email_lower() OR perfil_id = auth.uid());

DROP POLICY IF EXISTS "inmuebles_admin_write" ON inmuebles;
CREATE POLICY "inmuebles_admin_write" ON inmuebles FOR ALL TO authenticated
  USING (public.is_admin_or_agente()) WITH CHECK (public.is_admin_or_agente());

-- ── 3) Upsert vendedor + trigger automático ───────────────────
CREATE OR REPLACE FUNCTION public.upsert_vendedor_from_inmueble(
  p_ref text, p_nombre text, p_tel text, p_email text, p_precio numeric
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_nombre text := NULLIF(trim(COALESCE(p_nombre, '')), '');
  v_email  text := NULLIF(trim(COALESCE(p_email, '')), '');
  v_tel    text := NULLIF(trim(COALESCE(p_tel, '')), '');
BEGIN
  IF v_nombre IS NULL AND v_email IS NULL THEN RETURN; END IF;
  IF v_email IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM vendedores WHERE lower(trim(email)) = lower(v_email)) THEN
      UPDATE vendedores SET
        nombre = COALESCE(v_nombre, nombre), telefono = COALESCE(v_tel, telefono),
        inmueble_ref = p_ref, precio_minimo = COALESCE(p_precio, precio_minimo),
        descripcion = 'Vinculado al inmueble ' || p_ref, updated_at = now()
      WHERE lower(trim(email)) = lower(v_email);
    ELSE
      INSERT INTO vendedores (nombre, email, telefono, inmueble_ref, precio_minimo, descripcion)
      VALUES (COALESCE(v_nombre, split_part(v_email,'@',1), 'Propietario'), v_email, v_tel, p_ref, p_precio, 'Vinculado al inmueble ' || p_ref);
    END IF;
  ELSIF EXISTS (SELECT 1 FROM vendedores WHERE inmueble_ref = p_ref) THEN
    UPDATE vendedores SET
      nombre = COALESCE(v_nombre, nombre), telefono = COALESCE(v_tel, telefono),
      precio_minimo = COALESCE(p_precio, precio_minimo),
      descripcion = 'Vinculado al inmueble ' || p_ref, updated_at = now()
    WHERE inmueble_ref = p_ref;
  ELSE
    INSERT INTO vendedores (nombre, telefono, inmueble_ref, precio_minimo, descripcion)
    VALUES (COALESCE(v_nombre,'Propietario'), v_tel, p_ref, p_precio, 'Vinculado al inmueble ' || p_ref);
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.sync_vendedor_from_inmueble()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.upsert_vendedor_from_inmueble(
    new.ref, new.propietario_nombre, new.propietario_telefono, new.propietario_email, new.precio
  );
  RETURN new;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_vendedor_inmueble ON inmuebles;
CREATE TRIGGER trg_sync_vendedor_inmueble
  AFTER INSERT OR UPDATE ON inmuebles
  FOR EACH ROW EXECUTE FUNCTION public.sync_vendedor_from_inmueble();

CREATE OR REPLACE FUNCTION public.admin_sync_vendedores()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; v_synced int := 0; v_skipped int := 0;
BEGIN
  IF NOT public.is_admin_or_agente() THEN RAISE EXCEPTION 'No autorizado'; END IF;
  FOR r IN SELECT ref, propietario_nombre, propietario_telefono, propietario_email, precio FROM inmuebles ORDER BY created_at LOOP
    IF COALESCE(trim(r.propietario_nombre),'') = '' AND COALESCE(trim(r.propietario_email),'') = '' THEN
      v_skipped := v_skipped + 1; CONTINUE;
    END IF;
    PERFORM public.upsert_vendedor_from_inmueble(r.ref, r.propietario_nombre, r.propietario_telefono, r.propietario_email, r.precio);
    v_synced := v_synced + 1;
  END LOOP;
  RETURN jsonb_build_object('synced', v_synced, 'skipped', v_skipped, 'total_vendedores', (SELECT count(*) FROM vendedores));
END; $$;

GRANT EXECUTE ON FUNCTION public.admin_sync_vendedores() TO authenticated;

-- ── 4) Backfill compradores ───────────────────────────────────
INSERT INTO compradores (nombre, email, telefono, activo)
SELECT COALESCE(u.raw_user_meta_data->>'nombre', split_part(u.email,'@',1)), u.email, u.raw_user_meta_data->>'telefono', true
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'tipo','comprar') NOT IN ('vender','vendedor')
  AND lower(trim(u.email)) <> 'admin.nuevahabitat@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM compradores c WHERE lower(trim(c.email)) = lower(trim(u.email)));

-- ── 5) Backfill vendedores desde inmuebles ────────────────────
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT ref, propietario_nombre, propietario_telefono, propietario_email, precio FROM inmuebles LOOP
    IF COALESCE(trim(r.propietario_nombre),'') <> '' OR COALESCE(trim(r.propietario_email),'') <> '' THEN
      PERFORM public.upsert_vendedor_from_inmueble(r.ref, r.propietario_nombre, r.propietario_telefono, r.propietario_email, r.precio);
    END IF;
  END LOOP;
END $$;

-- ── 6) Índices ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS compradores_created_at_idx ON compradores (created_at DESC);
CREATE INDEX IF NOT EXISTS vendedores_created_at_idx  ON vendedores  (created_at DESC);
CREATE INDEX IF NOT EXISTS compradores_email_lower_idx ON compradores (lower(trim(email)));
CREATE INDEX IF NOT EXISTS vendedores_email_lower_idx  ON vendedores  (lower(trim(email)));

-- ── 7) Verificación ───────────────────────────────────────────
SELECT 'RESUMEN' AS seccion, 'compradores' AS dato, count(*)::text AS valor FROM compradores
UNION ALL SELECT 'RESUMEN', 'vendedores', count(*)::text FROM vendedores
UNION ALL SELECT 'RESUMEN', 'inmuebles', count(*)::text FROM inmuebles
UNION ALL SELECT 'ALERTA', 'sin_propietario', count(*)::text FROM inmuebles
  WHERE propietario_nombre IS NULL AND propietario_email IS NULL;

SELECT 'COMPRADORES' AS tipo, nombre, email, activo::text, created_at::date AS fecha FROM compradores ORDER BY created_at DESC;
SELECT 'VENDEDORES' AS tipo, nombre, email, inmueble_ref, created_at::date AS fecha FROM vendedores ORDER BY created_at DESC;
SELECT 'SIN PROPIETARIO' AS alerta, ref, titulo FROM inmuebles
WHERE propietario_nombre IS NULL AND propietario_email IS NULL;
