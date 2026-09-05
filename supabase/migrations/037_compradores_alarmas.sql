-- Migración 037 · Alarmas de contacto en compradores
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE compradores
  ADD COLUMN IF NOT EXISTS ultimo_contacto_at timestamptz,
  ADD COLUMN IF NOT EXISTS proxima_alarma_at timestamptz;

COMMENT ON COLUMN compradores.ultimo_contacto_at IS 'Último contacto registrado (WhatsApp, llamada, seguimiento)';
COMMENT ON COLUMN compradores.proxima_alarma_at IS 'Alarma: contactar antes de esta fecha si no hay seguimiento';

CREATE INDEX IF NOT EXISTS compradores_proxima_alarma_idx ON compradores (proxima_alarma_at);
