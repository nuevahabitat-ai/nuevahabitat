/**
 * Importa datos Nota de Encargo Livendia → propietarios_alquiler + lead + seguimiento + PDF.
 * node scripts/import-adrian-mateo-maeso-livendia.js [ruta-pdf]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEFAULT_PDF =
  process.env.ADRIAN_PDF ||
  'C:\\Users\\Daniel HDZ\\Desktop\\Nota_de_Encargo_Adrian_Mateo_Maeso_firmado.pdf';

function loadEnvLocal() {
  const p = path.join(ROOT, '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvLocal();

const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

const EMAIL = 'adrianmateomaeso@gmail.com';

const EXPEDIENTE = {
  nombre: 'Adrián Mateo Maeso',
  dni: '47956564T',
  telefono: '648612727',
  email: EMAIL,
  procedencia: 'livendia',
  servicio: 'administracion',
  estado_gestion: 'activo',
  activo: true,
  cuota_mensual: 59,
  inmueble_direccion:
    "Piso sobreático, puerta 2, C/ Rosa de Alejandría nº 35, 08906 L'Hospitalet de Llobregat (Barcelona)",
  inmueble_ref_catastral: '4906932DF2840F0020FF',
  renta_mensual: 780,
  inquilino_nombre: 'Oussama Mahdaoui y Mohamed Mahdaoui Akouch',
  inquilino_telefono: null,
  inquilino_email: null,
  contrato_inicio: '2024-03-12',
  contrato_fin: '2029-03-11',
  inmueble_notas:
    'Incidencia en curso: humedades/filtraciones desde terrado comunitario (techo). Livendia reclama a comunidad/administrador y coordina técnico/seguro.',
  notas_propietario: `Nota de encargo Livendia firmada 19/10/2026. Administración desde 20/10/2026. Contrato arrendamiento firmado 11/03/2024, vigente desde 12/03/2024 (5 años). Renta 780 €/mes actualizable IPC. Cuota Livendia 59 €/mes IVA incl. Agentes Livendia: Juan Cardenas y Daniel Hernández. Cobro renta vía encargo Livendia — sin panel NH propietario.`,
};

const SEGUIMIENTO = `Importado nota de encargo Livendia (19/10/2026). Administración alquiler desde 20/10/2026. Inmueble: ${EXPEDIENTE.inmueble_direccion}. Ref. catastral ${EXPEDIENTE.inmueble_ref_catastral}. Inquilinos: ${EXPEDIENTE.inquilino_nombre}. Renta 780 €/mes. Incidencia humedades terrado en gestión.`;

async function sb(method, resource, body, prefer) {
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${SB_URL}/rest/v1/${resource}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${method} ${resource}: ${res.status} ${text}`);
  return data;
}

async function uploadPdf(pdfPath, propId) {
  if (!fs.existsSync(pdfPath)) {
    console.warn('PDF no encontrado:', pdfPath);
    return null;
  }
  const buf = fs.readFileSync(pdfPath);
  const safe = EMAIL.toLowerCase();
  const objectPath = `${safe}/nota-encargo-livendia-2026-10-19-firmado.pdf`;
  const res = await fetch(`${SB_URL}/storage/v1/object/documentos-clientes/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!res.ok) {
    console.warn('Upload PDF:', res.status, await res.text());
    return null;
  }
  await sb('POST', 'cliente_documentos', {
    cliente_email: EMAIL,
    tipo: 'contrato',
    nombre: 'Nota de encargo Livendia – firmada 19/10/2026',
    url: objectPath,
    estado: 'firmado',
  });
  return objectPath;
}

async function main() {
  if (!SB_URL || !SB_KEY) {
    console.error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
    process.exit(1);
  }
  const pdfPath = process.argv[2] || DEFAULT_PDF;

  let rows = await sb('GET', `propietarios_alquiler?email=ilike.${encodeURIComponent(EMAIL)}&select=id&limit=1`);
  let propId = rows?.[0]?.id;

  if (propId) {
    await sb('PATCH', `propietarios_alquiler?id=eq.${propId}`, EXPEDIENTE, 'return=representation');
    console.log('Expediente actualizado:', propId);
  } else {
    const created = await sb('POST', 'propietarios_alquiler', EXPEDIENTE, 'return=representation');
    propId = created?.[0]?.id || created?.id;
    console.log('Expediente creado:', propId);
  }

  if (propId) {
    await sb('POST', 'propietarios_alquiler_seguimientos', {
      propietario_id: propId,
      comentario: SEGUIMIENTO,
    });
  }

  const leads = await sb(
    'GET',
    `leads?email=ilike.${encodeURIComponent(EMAIL)}&select=id&order=created_at.desc&limit=1`
  );
  const leadId = leads?.[0]?.id;
  if (leadId) {
    await sb('PATCH', `leads?id=eq.${leadId}`, {
      propietario_alquiler_id: propId,
      procedencia: 'livendia',
      origen: 'manual_alquiler_admin',
      zona: EXPEDIENTE.inmueble_direccion,
      ultimo_contacto_at: new Date().toISOString(),
    });
    await sb('POST', 'leads_seguimientos', {
      lead_id: leadId,
      comentario: SEGUIMIENTO,
    });
    console.log('Lead vinculado:', leadId);
  }

  const docPath = await uploadPdf(pdfPath, propId);
  if (docPath) console.log('PDF archivado:', docPath);

  console.log('OK — Revisa Administración de alquileres y ficha Adrian.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
