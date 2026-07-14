-- ============================================================
-- NuevaHabitat · Migración 012
-- Storage documentos: admin sube, cliente descarga
-- Ejecutar después de 011
-- ============================================================

DROP POLICY IF EXISTS "docs_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "docs_client_read" ON storage.objects;

-- Admin/agente: gestión completa del bucket
CREATE POLICY "docs_admin_upload" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'documentos-clientes'
    AND (
      EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
      OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com')
    )
  )
  WITH CHECK (
    bucket_id = 'documentos-clientes'
    AND (
      EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
      OR EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND lower(trim(email)) = 'admin.nuevahabitat@gmail.com')
    )
  );

-- Cliente: leer solo archivos bajo su email en la ruta
CREATE POLICY "docs_client_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documentos-clientes'
    AND (
      EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'agente'))
      OR lower(name) LIKE lower(replace((SELECT email FROM auth.users WHERE id = auth.uid()), '@', '_at_')) || '%'
      OR lower(name) LIKE lower((SELECT email FROM auth.users WHERE id = auth.uid())) || '%'
    )
  );

-- ============================================================
-- FIN
-- ============================================================
