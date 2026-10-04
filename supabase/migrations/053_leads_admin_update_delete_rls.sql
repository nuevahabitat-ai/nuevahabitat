-- Leads: admin puede actualizar y eliminar sin consultar auth.users en políticas
DROP POLICY IF EXISTS "leads_admin_update" ON leads;
CREATE POLICY "leads_admin_update" ON leads
  FOR UPDATE TO authenticated
  USING (public.is_admin_or_agente())
  WITH CHECK (public.is_admin_or_agente());

DROP POLICY IF EXISTS "leads_admin_delete" ON leads;
CREATE POLICY "leads_admin_delete" ON leads
  FOR DELETE TO authenticated
  USING (public.is_admin_or_agente());

NOTIFY pgrst, 'reload schema';
