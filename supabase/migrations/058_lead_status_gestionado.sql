-- Estado «gestionado» en leads (vendedores y pipeline general; cualificado reservado a compradores en UI)
DO $$
BEGIN
  ALTER TYPE lead_status ADD VALUE 'gestionado';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
