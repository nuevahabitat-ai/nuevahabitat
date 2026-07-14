-- ============================================================
-- Eliminar inmuebles de prueba (seed) — conservar solo publicaciones reales
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Borra los 6 inmuebles de muestra del seed inicial (refs NH-*)
DELETE FROM inmuebles
WHERE ref IN (
  'NH-EIX-001',
  'NH-GRA-002',
  'NH-SGV-003',
  'NH-SAR-004',
  'NH-POB-005',
  'NH-SCU-006'
);

-- También elimina por slug de las páginas estáticas de prueba
DELETE FROM inmuebles
WHERE slug IN (
  'inmueble-eixample',
  'inmueble-gracia',
  'inmueble-sant-gervasi',
  'inmueble-sarria',
  'inmueble-poblenou',
  'inmueble-sant-cugat'
);

-- El inmueble publicado manualmente (ej. Piso en Carrer valencia 32) NO se toca
-- porque tiene ref/slug propios generados desde el panel admin.
