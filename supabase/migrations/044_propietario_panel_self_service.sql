-- ============================================================
-- NuevaHabitat · Migración 044 — Panel propietario autoservicio
-- Formularios, documentos PDF y actualización de expediente
-- ============================================================

-- Propietario: actualizar su fila (sin tocar Stripe)
DROP POLICY IF EXISTS propietarios_alquiler_own_update ON propietarios_alquiler;
CREATE POLICY propietarios_alquiler_own_update ON propietarios_alquiler
  FOR UPDATE TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  )
  WITH CHECK (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );

-- Documentos: el cliente puede crear los suyos (propietario alquiler)
DROP POLICY IF EXISTS documentos_own_insert ON cliente_documentos;
CREATE POLICY documentos_own_insert ON cliente_documentos
  FOR INSERT TO authenticated
  WITH CHECK (
    lower(trim(cliente_email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    AND (perfil_id IS NULL OR perfil_id = auth.uid())
  );

DROP POLICY IF EXISTS documentos_own_delete ON cliente_documentos;
CREATE POLICY documentos_own_delete ON cliente_documentos
  FOR DELETE TO authenticated
  USING (
    lower(trim(cliente_email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
    AND estado IN ('subido', 'pendiente', 'pendiente_revision')
  );

-- Storage: subir PDFs bajo carpeta del email
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

CREATE OR REPLACE FUNCTION public.update_propietario_alquiler_expediente(p_data jsonb)
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
  IF uemail IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  SELECT * INTO row FROM propietarios_alquiler
  WHERE lower(trim(email)) = lower(trim(uemail))
  LIMIT 1;

  IF row.id IS NULL THEN
    RAISE EXCEPTION 'expediente not found';
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
