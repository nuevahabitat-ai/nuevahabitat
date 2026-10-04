COMMENT ON COLUMN public.propietarios_alquiler.estado_gestion IS 'alta|documentacion|contrato|activo|renovacion|baja|descartado';

NOTIFY pgrst, 'reload schema';
