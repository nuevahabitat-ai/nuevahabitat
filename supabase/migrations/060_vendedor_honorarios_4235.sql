-- Honorarios venta: 3.500 € + 21% IVA = 4.235 € (total en columna honorarios)
-- Solo operaciones vendedor aún no cobradas que siguen en tarifa antigua (3.630 €).

-- 1) Vista previa (ejecutar solo SELECT antes del UPDATE)
-- SELECT id, nombre, email, honorarios, honorarios_pagado, honorarios_pago_por, estado_operacion
-- FROM vendedores
-- WHERE COALESCE(honorarios_pagado, false) = false
--   AND honorarios IN (3630, 3630.00)
-- ORDER BY created_at DESC;

BEGIN;

UPDATE vendedores
SET honorarios = 4235.00
WHERE COALESCE(honorarios_pagado, false) = false
  AND honorarios IN (3630, 3630.00);

ALTER TABLE vendedores
  ALTER COLUMN honorarios SET DEFAULT 4235.00;

COMMENT ON COLUMN vendedores.honorarios IS
  'Total honorarios vendedor con IVA incluido (por defecto 4.235 € = 3.500 € + 21%)';

COMMIT;
