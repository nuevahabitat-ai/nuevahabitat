-- ============================================================
-- NuevaHabitat · Migración 033
-- Previsión realista: marcar qué clientes entran en previsión
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS incluir_prevision boolean DEFAULT true;

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS incluir_prevision boolean DEFAULT false;

COMMENT ON COLUMN vendedores.incluir_prevision IS 'Si true, entra en Previsión > honorarios vendedores (realista)';
COMMENT ON COLUMN compradores.incluir_prevision IS 'Si true, visible en modal previsión (no suma al total realista)';

-- Por defecto: todos los vendedores pendientes entran en previsión
UPDATE vendedores SET incluir_prevision = true WHERE incluir_prevision IS NULL;
