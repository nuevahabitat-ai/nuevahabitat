-- Reparar contacto en compradores con WhatsApp en notas (ejecutar una vez tras 037)
UPDATE compradores
SET
  ultimo_contacto_at = COALESCE(ultimo_contacto_at, now()),
  proxima_alarma_at = COALESCE(
    proxima_alarma_at,
    now() + interval '7 days'
  )
WHERE notas ~* 'whatsapp'
  AND (ultimo_contacto_at IS NULL OR proxima_alarma_at IS NULL);

-- Recalcular alarma desde último contacto (ajusta 7 días si usas otro valor en panel)
UPDATE compradores
SET proxima_alarma_at = ultimo_contacto_at + interval '7 days'
WHERE ultimo_contacto_at IS NOT NULL
  AND notas ~* 'whatsapp'
  AND (proxima_alarma_at IS NULL OR proxima_alarma_at <= ultimo_contacto_at);
