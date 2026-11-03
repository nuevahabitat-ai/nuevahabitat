-- Planes de venta + pagos 50 % contrato / 50 % escritura (vendedores)

ALTER TABLE vendedores
  ADD COLUMN IF NOT EXISTS plan_venta text DEFAULT 'clasico',
  ADD COLUMN IF NOT EXISTS honorarios_base numeric(10,2),
  ADD COLUMN IF NOT EXISTS honorarios_pago_inicial_pagado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_pago_inicial_pagado_at timestamptz,
  ADD COLUMN IF NOT EXISTS honorarios_pago_final_pagado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS honorarios_pago_final_pagado_at timestamptz,
  ADD COLUMN IF NOT EXISTS pago_final_habilitado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_session_id_inicial text,
  ADD COLUMN IF NOT EXISTS stripe_session_id_final text;

ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_plan_venta_check;
ALTER TABLE vendedores ADD CONSTRAINT vendedores_plan_venta_check
  CHECK (plan_venta IN ('clasico', 'digital', 'digital_comercial_bcn'));

COMMENT ON COLUMN vendedores.plan_venta IS 'clasico | digital | digital_comercial_bcn';
COMMENT ON COLUMN vendedores.honorarios_base IS 'Base imponible del plan (€) sin IVA';
COMMENT ON COLUMN vendedores.pago_final_habilitado IS 'Admin o estado escritura: habilita 2.º pago en panel';

-- Legacy: quien ya pagó todo el importe de una vez
UPDATE vendedores
SET
  honorarios_pago_inicial_pagado = true,
  honorarios_pago_final_pagado = true,
  honorarios_pago_inicial_pagado_at = COALESCE(honorarios_pago_inicial_pagado_at, honorarios_pagado_at),
  honorarios_pago_final_pagado_at = COALESCE(honorarios_pago_final_pagado_at, honorarios_pagado_at)
WHERE COALESCE(honorarios_pagado, false) = true
  AND COALESCE(honorarios_pago_inicial_pagado, false) = false;

UPDATE vendedores SET plan_venta = 'clasico' WHERE plan_venta IS NULL;
UPDATE vendedores SET honorarios_base = 3500 WHERE honorarios_base IS NULL AND plan_venta = 'clasico';
