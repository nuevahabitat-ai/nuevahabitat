-- ============================================================
-- NuevaHabitat · Migración 023
-- Calendario de disponibilidad en panel (vendedor / comprador)
-- ============================================================

ALTER TABLE visitas ALTER COLUMN inmueble_id DROP NOT NULL;

ALTER TABLE visitas
  ADD COLUMN IF NOT EXISTS tipo_solicitud text NOT NULL DEFAULT 'visita';

COMMENT ON COLUMN visitas.tipo_solicitud IS
  'visita | disponibilidad_vendedor | disponibilidad_comprador';

CREATE INDEX IF NOT EXISTS visitas_tipo_solicitud_idx ON visitas (tipo_solicitud);
CREATE INDEX IF NOT EXISTS visitas_perfil_id_idx ON visitas (perfil_id);

-- ============================================================
-- FIN
-- ============================================================
