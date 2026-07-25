-- Actualizar teléfono corporativo NuevaHabitat: 675704514 → 603656587
-- Ejecutar en Supabase SQL Editor si la BD ya estaba desplegada antes de este cambio.

UPDATE agentes
SET telefono = '603656587'
WHERE telefono IN ('675704514', '675 704 514', '+34675704514', '34675704514')
   OR email = 'admin.nuevahabitat@gmail.com';
