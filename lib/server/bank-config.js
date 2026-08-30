/** Datos bancarios para transferencia (override con env en Vercel) */
export function getBankConfig() {
  const ibanRaw = (process.env.NH_BANK_IBAN || 'ES6815632626383264407034').replace(/\s/g, '').toUpperCase();
  return {
    holders: process.env.NH_BANK_HOLDERS || 'Daniel Hernandez y Juan Sebastian Cardenas Puertas',
    iban: ibanRaw,
    ibanFormatted: ibanRaw.replace(/(.{4})/g, '$1 ').trim(),
    bic: process.env.NH_BANK_BIC || '',
    entity: process.env.NH_BANK_ENTITY || 'N26',
    conceptPrefix: process.env.NH_BANK_CONCEPT_PREFIX || 'NuevaHabitat',
  };
}

export function paymentReference(tipo, recordId) {
  const prefix = tipo === 'vendedor' ? 'NH-V' : 'NH-C';
  const short = String(recordId || '').replace(/-/g, '').slice(0, 8).toUpperCase();
  return `${prefix}-${short}`;
}
