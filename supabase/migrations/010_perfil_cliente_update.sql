-- ============================================================
-- NuevaHabitat · Migración 010
-- Cliente puede actualizar su fila en compradores/vendedores
-- Ejecutar después de 009
-- ============================================================

DROP POLICY IF EXISTS "compradores_self_update" ON compradores;
CREATE POLICY "compradores_self_update" ON compradores
  FOR UPDATE
  TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  )
  WITH CHECK (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );

DROP POLICY IF EXISTS "vendedores_self_update" ON vendedores;
CREATE POLICY "vendedores_self_update" ON vendedores
  FOR UPDATE
  TO authenticated
  USING (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  )
  WITH CHECK (
    lower(trim(email)) = lower(trim((SELECT email FROM auth.users WHERE id = auth.uid())))
  );

-- ============================================================
-- FIN
-- ============================================================
