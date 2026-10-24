-- Datos Nota de Encargo Livendia · Adrián Mateo Maeso (19/10/2026)
-- Ejecutar en Supabase SQL Editor si no usas: node scripts/import-adrian-mateo-maeso-livendia.js

DO $$
DECLARE
  pid uuid;
  lid uuid;
BEGIN
  SELECT id INTO pid FROM propietarios_alquiler WHERE lower(trim(email)) = 'adrianmateomaeso@gmail.com' LIMIT 1;

  IF pid IS NULL THEN
    INSERT INTO propietarios_alquiler (
      nombre, dni, telefono, email, procedencia, servicio, estado_gestion, activo, cuota_mensual,
      inmueble_direccion, inmueble_ref_catastral, renta_mensual,
      inquilino_nombre, contrato_inicio, contrato_fin, inmueble_notas, notas_propietario
    ) VALUES (
      'Adrián Mateo Maeso', '47956564T', '648612727', 'adrianmateomaeso@gmail.com',
      'livendia', 'administracion', 'activo', true, 59,
      'Piso sobreático, puerta 2, C/ Rosa de Alejandría nº 35, 08906 L''Hospitalet de Llobregat (Barcelona)',
      '4906932DF2840F0020FF', 780,
      'Oussama Mahdaoui y Mohamed Mahdaoui Akouch',
      '2024-03-12', '2029-03-11',
      'Incidencia humedades/filtraciones terrado comunitario — en gestión Livendia.',
      'Nota encargo Livendia 19/10/2026. Admin desde 20/10/2026. Renta 780 €/mes IPC. Cuota Livendia 59 €/mes. Sin panel NH.'
    ) RETURNING id INTO pid;
  ELSE
    UPDATE propietarios_alquiler SET
      nombre = 'Adrián Mateo Maeso',
      dni = '47956564T',
      telefono = '648612727',
      procedencia = 'livendia',
      servicio = 'administracion',
      estado_gestion = 'activo',
      activo = true,
      cuota_mensual = 59,
      inmueble_direccion = 'Piso sobreático, puerta 2, C/ Rosa de Alejandría nº 35, 08906 L''Hospitalet de Llobregat (Barcelona)',
      inmueble_ref_catastral = '4906932DF2840F0020FF',
      renta_mensual = 780,
      inquilino_nombre = 'Oussama Mahdaoui y Mohamed Mahdaoui Akouch',
      contrato_inicio = '2024-03-12',
      contrato_fin = '2029-03-11',
      inmueble_notas = 'Incidencia humedades/filtraciones terrado comunitario — en gestión Livendia.',
      notas_propietario = 'Nota encargo Livendia 19/10/2026. Admin desde 20/10/2026. Renta 780 €/mes IPC. Cuota Livendia 59 €/mes. Sin panel NH.',
      updated_at = now()
    WHERE id = pid;
  END IF;

  INSERT INTO propietarios_alquiler_seguimientos (propietario_id, comentario)
  VALUES (pid, 'Importado nota encargo Livendia 19/10/2026. Admin desde 20/10/2026. Renta 780 €. Inquilinos Mahdaoui. Humedades terrado en curso.');

  SELECT id INTO lid FROM leads WHERE lower(trim(email)) = 'adrianmateomaeso@gmail.com' ORDER BY created_at DESC LIMIT 1;
  IF lid IS NULL THEN
    INSERT INTO leads (nombre, telefono, email, tipo, origen, procedencia, propietario_alquiler_id, zona, estado, mensaje)
    VALUES (
      'Adrián Mateo Maeso', '648612727', 'adrianmateomaeso@gmail.com', 'info', 'manual_alquiler_admin', 'livendia', pid,
      'Piso sobreático, puerta 2, C/ Rosa de Alejandría nº 35, 08906 L''Hospitalet de Llobregat (Barcelona)',
      'contactado', 'Expediente Livendia — ver Administración de alquileres (no pipeline seguimientos).'
    ) RETURNING id INTO lid;
  ELSE
    UPDATE leads SET
      propietario_alquiler_id = pid,
      procedencia = 'livendia',
      origen = 'manual_alquiler_admin',
      zona = 'Piso sobreático, puerta 2, C/ Rosa de Alejandría nº 35, 08906 L''Hospitalet de Llobregat (Barcelona)',
      ultimo_contacto_at = COALESCE(ultimo_contacto_at, now())
    WHERE id = lid;
  END IF;
END $$;
