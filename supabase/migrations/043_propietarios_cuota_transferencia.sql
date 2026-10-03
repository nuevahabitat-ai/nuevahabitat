-- Cuota mensual por transferencia (alternativa a domiciliación Stripe)
ALTER TABLE propietarios_alquiler
  ADD COLUMN IF NOT EXISTS cuota_transferencia_pendiente boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cuota_transferencia_at timestamptz;
