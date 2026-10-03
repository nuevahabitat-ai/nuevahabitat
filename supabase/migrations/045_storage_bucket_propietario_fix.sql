-- ============================================================
-- NuevaHabitat · Migración 045 — Bucket documentos + expediente propietario
-- Ejecutar si aparece "Bucket not found" o no hay fila en propietarios_alquiler
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documentos-clientes', 'documentos-clientes', false, 52428800)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800;

DROP POLICY IF EXISTS docs_client_upload ON storage.objects;
CREATE POLICY docs_client_upload ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documentos-clientes'
    AND (
      lower(name) LIKE lower((SELECT email FROM auth.users WHERE id = auth.uid())) || '/%'
      OR lower(name) LIKE lower(replace((SELECT email FROM auth.users WHERE id = auth.uid()), '@', '_at_')) || '/%'
    )
  );

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
