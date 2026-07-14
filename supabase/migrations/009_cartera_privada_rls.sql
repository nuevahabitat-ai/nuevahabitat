-- ============================================================
-- NuevaHabitat · Migración 009
-- Cartera privada: anon no puede leer inmuebles privados
-- Ejecutar después de 006, 007 y 008
-- ============================================================

DROP POLICY IF EXISTS "inmuebles_public_read" ON inmuebles;

-- Visitantes anónimos: solo inmuebles públicos (no retirados)
CREATE POLICY "inmuebles_public_read" ON inmuebles
  FOR SELECT
  TO anon
  USING (
    estado <> 'retirado'
    AND COALESCE(cartera_privada, false) = false
  );

-- Usuarios registrados: ven también cartera privada
CREATE POLICY "inmuebles_auth_read" ON inmuebles
  FOR SELECT
  TO authenticated
  USING (estado <> 'retirado');

-- ============================================================
-- FIN
-- ============================================================
