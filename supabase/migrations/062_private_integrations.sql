-- Credenciales de integraciones (solo service role; no expuesto a clientes)
CREATE TABLE IF NOT EXISTS private_integrations (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private_integrations ENABLE ROW LEVEL SECURITY;

-- Sin políticas: anon/authenticated no leen ni escriben (solo service role en API Vercel)

COMMENT ON TABLE private_integrations IS 'Secretos panel (Google Calendar OAuth, etc.). Solo backend con SUPABASE_SERVICE_ROLE_KEY.';
