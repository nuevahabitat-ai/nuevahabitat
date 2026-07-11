-- ══════════════════════════════════════════════════════════════
-- Migración 004 · Añadir campo honorarios a compradores
-- Ejecutar en: Supabase → SQL Editor
-- ══════════════════════════════════════════════════════════════

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS honorarios numeric(10,2) DEFAULT 6050.00;

COMMENT ON COLUMN compradores.honorarios IS
  'Honorarios pactados con el comprador (por defecto 5.000 € + 21% IVA = 6.050 €)';
