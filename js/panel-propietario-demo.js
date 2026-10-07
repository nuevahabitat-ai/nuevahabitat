/**
 * Demo interactiva — panel propietario administración de alquiler (datos simulados).
 * Misma estructura DOM que panel-propietario.html; sin Supabase ni API.
 */
(function () {
  const ESTADOS_ADMIN = [
    { key: 'alta', title: 'Alta en el servicio', desc: 'Cuenta creada y expediente abierto con Nueva Habitat.' },
    { key: 'documentacion', title: 'Documentación del inmueble', desc: 'Revisión de contrato, seguros, certificados y datos de cobro.' },
    { key: 'contrato', title: 'Contrato de administración', desc: 'Firma del encargo de gestión a 60 €/mes IVA incluido.' },
    { key: 'activo', title: 'Gestión activa', desc: 'Incidencias, mediación y seguimiento de renta en curso.' },
    { key: 'renovacion', title: 'Renovación / LAU', desc: 'Prórrogas, actualización de renta o fin de contrato.' },
    { key: 'baja', title: 'Baja del servicio', desc: 'Cierre de la administración (con preaviso acordado).' },
  ];

  const ESTADOS_INTEGRAL = [
    { key: 'solicitud', title: 'Solicitud y alta (499 €)', desc: 'Abres expediente, asignamos gestor y acordamos renta objetivo y calendario de visitas.' },
    { key: 'documentacion', title: 'Checklist documental', desc: 'DNI, nota simple, certificado energético, suministros e inventario fotográfico antes de publicar.' },
    { key: 'publicacion', title: 'Anuncio y difusión', desc: 'Texto orientado a particulares solventes, fotos y publicación en canales acordados contigo.' },
    { key: 'visitas', title: 'Criba y visitas', desc: 'Filtramos mensajes; visitas solo en tus franjas. Nueva Habitat representa al propietario.' },
    { key: 'informe', title: 'Informe top 3', desc: 'Hasta tres perfiles recomendados con solvencia básica revisada para que elijas con datos.' },
    { key: 'seleccion', title: 'Reserva e inquilino elegido', desc: 'Reserva, verificación de documentación del inquilino y envío a tu aseguradora de impago si aplica.' },
    { key: 'contrato', title: 'Contrato LAU e INCASÒL', desc: 'Redacción LAU, inventario firmado, depósito de fianza y garantías adicionales si procede.' },
    { key: 'llaves', title: 'Suministros y llaves', desc: 'Cambio de titularidad de suministros, acta de entrega y opción de pasar a administración 60 €/mes.' },
  ];

  const ZONA_PRESETS = {
    barcelona: {
      inmueble_direccion: 'Carrer de Balmes, 120 · 3r 1a · 08008 Barcelona (Eixample)',
      inmueble_ref: 'NH-INT-BCN-4102',
      renta_mensual: 1450,
      zonaLabel: 'Barcelona',
    },
    lescorts: {
      inmueble_direccion: 'Carrer de Numància, 45 · 3r 1a · 08029 Barcelona (Les Corts)',
      inmueble_ref: 'NH-INT-LC-2847',
      renta_mensual: 1150,
      zonaLabel: 'Les Corts',
    },
    eixample: {
      inmueble_direccion: 'Carrer de Pau Claris, 88 · 2n 2a · 08010 Barcelona (Eixample Dret)',
      inmueble_ref: 'NH-INT-EX-3310',
      renta_mensual: 1680,
      zonaLabel: 'Eixample',
    },
    hospitalet: {
      inmueble_direccion: 'Carrer de la Granvia, 52 · 4t · 08902 L\'Hospitalet (Centre)',
      inmueble_ref: 'NH-INT-LH-1922',
      renta_mensual: 980,
      zonaLabel: 'L\'Hospitalet',
    },
    gracia: {
      inmueble_direccion: 'Carrer de Verdi, 58 · 2n 1a · 08012 Barcelona (Vila de Gràcia)',
      inmueble_ref: 'NH-INT-GR-2208',
      renta_mensual: 1280,
      zonaLabel: 'Gràcia',
    },
    sants: {
      inmueble_direccion: 'Carrer de Sants, 180 · 3r 2a · 08028 Barcelona (Hostafrancs)',
      inmueble_ref: 'NH-INT-ST-3011',
      renta_mensual: 1050,
      zonaLabel: 'Sants',
    },
    poblenou: {
      inmueble_direccion: 'Carrer de Pujades, 24 · 4t 1a · 08005 Barcelona (Poblenou)',
      inmueble_ref: 'NH-INT-PB-4410',
      renta_mensual: 1380,
      zonaLabel: 'Poblenou',
    },
    sarria: {
      inmueble_direccion: 'Carrer Major de Sarrià, 102 · 2n · 08017 Barcelona',
      inmueble_ref: 'NH-INT-SR-5102',
      renta_mensual: 1750,
      zonaLabel: 'Sarrià',
    },
    badalona: {
      inmueble_direccion: 'Carrer de Martí i Julià, 8 · 2n · 08912 Badalona (Centre)',
      inmueble_ref: 'NH-INT-BD-8801',
      renta_mensual: 920,
      zonaLabel: 'Badalona',
    },
    horta: {
      inmueble_direccion: 'Passeig de Maragall, 120 · 3r 1a · 08031 Barcelona (Horta)',
      inmueble_ref: 'NH-ADM-HO-6102',
      renta_mensual: 1080,
      zonaLabel: 'Horta-Guinardó',
    },
    santandreu: {
      inmueble_direccion: 'Carrer de Sant Antoni Maria Claret, 88 · 2n · 08030 Barcelona (Congrés)',
      inmueble_ref: 'NH-ADM-SA-6201',
      renta_mensual: 1020,
      zonaLabel: 'Sant Andreu',
    },
    noubarris: {
      inmueble_direccion: 'Via Júlia, 180 · 4t · 08042 Barcelona (La Porta)',
      inmueble_ref: 'NH-ADM-NB-6304',
      renta_mensual: 890,
      zonaLabel: 'Nou Barris',
    },
    ciutatvella: {
      inmueble_direccion: 'Carrer del Rec, 12 · 2n 1a · 08003 Barcelona (El Born)',
      inmueble_ref: 'NH-ADM-CV-6402',
      renta_mensual: 1250,
      zonaLabel: 'Ciutat Vella',
    },
    santantoni: {
      inmueble_direccion: 'Carrer de Floridablanca, 55 · 3r 2a · 08015 Barcelona (Sant Antoni)',
      inmueble_ref: 'NH-ADM-AN-6508',
      renta_mensual: 1180,
      zonaLabel: 'Sant Antoni',
    },
    poblesec: {
      inmueble_direccion: 'Carrer de Blai, 42 · 2n 1a · 08004 Barcelona (Poble-sec)',
      inmueble_ref: 'NH-INT-PS-7101',
      renta_mensual: 1150,
      zonaLabel: 'Poble-sec',
    },
    elclot: {
      inmueble_direccion: 'Passeig del Clot, 180 · 4t · 08018 Barcelona (El Clot)',
      inmueble_ref: 'NH-INT-EC-7102',
      renta_mensual: 1080,
      zonaLabel: 'El Clot',
    },
    fortpienc: {
      inmueble_direccion: 'Carrer de Nàpols, 220 · 3r 1a · 08013 Barcelona (Fort Pienc)',
      inmueble_ref: 'NH-INT-FP-7103',
      renta_mensual: 1420,
      zonaLabel: 'Fort Pienc',
    },
    esplugues: {
      inmueble_direccion: 'Carrer de Montserrat, 12 · 2n · 08950 Esplugues (Centre)',
      inmueble_ref: 'NH-INT-EP-7104',
      renta_mensual: 980,
      zonaLabel: 'Esplugues',
    },
    santgervasi: {
      inmueble_direccion: 'Carrer de Santaló, 45 · 1r · 08021 Barcelona (Galvany)',
      inmueble_ref: 'NH-INT-SG-7105',
      renta_mensual: 1880,
      zonaLabel: 'Sant Gervasi',
    },
    cornella: {
      inmueble_direccion: 'Avinguda del Parc, 12 · 3r · 08940 Cornellà (Centre)',
      inmueble_ref: 'NH-INT-CR-7201',
      renta_mensual: 920,
      zonaLabel: 'Cornellà',
    },
    diagonalmar: {
      inmueble_direccion: 'Carrer de la Marina, 88 · 8è · 08019 Barcelona (Diagonal Mar)',
      inmueble_ref: 'NH-INT-DM-7202',
      renta_mensual: 1580,
      zonaLabel: 'Diagonal Mar',
    },
    pedralbes: {
      inmueble_direccion: 'Avinguda de Pedralbes, 60 · 2n · 08034 Barcelona',
      inmueble_ref: 'NH-INT-PD-7203',
      renta_mensual: 2100,
      zonaLabel: 'Pedralbes',
    },
    barceloneta: {
      inmueble_direccion: 'Carrer de la Maquinista, 8 · 1r · 08003 Barcelona',
      inmueble_ref: 'NH-INT-BC-7204',
      renta_mensual: 1250,
      zonaLabel: 'La Barceloneta',
    },
    sagradafamilia: {
      inmueble_direccion: 'Carrer de Provença, 420 · 4t 2a · 08025 Barcelona',
      inmueble_ref: 'NH-INT-SF-7205',
      renta_mensual: 1480,
      zonaLabel: 'Sagrada Família',
    },
  };

  let demoContext = { mode: 'admin', zona: 'lescorts' };
  let timelineSteps = ESTADOS_ADMIN;

  const ESTADO_LABEL = {
    alta: 'Alta',
    documentacion: 'Documentación',
    contrato: 'Contrato',
    activo: 'Activo',
    renovacion: 'Renovación',
    baja: 'Baja',
  };

  const PROP_DOC_SLOTS = [
    { tipo: 'prop_dni', label: 'DNI / NIE del propietario' },
    { tipo: 'prop_nota_simple', label: 'Nota simple registral' },
    { tipo: 'prop_certificado_energetico', label: 'Certificado energético (CEE)' },
    { tipo: 'prop_cedula_habitabilidad', label: 'Cédula de habitabilidad' },
  ];

  const INQ_DOC_SLOTS = [
    { tipo: 'inquilino_dni', label: 'DNI / NIE del inquilino' },
    { tipo: 'inquilino_contrato', label: 'Contrato de arrendamiento firmado' },
  ];

  const MOCK = {
    nombre: 'Elena Vidal',
    email: 'elena.vidal.demo@email.com',
    dni: '45678901K',
    telefono: '+34 612 345 678',
    direccion_propietario: 'Passeig de Gràcia 120, 08008 Barcelona',
    iban_cobro: 'ES91 2100 0418 4502 0005 1332',
    notas_propietario: 'Contactar por email entre 10–18h. Segunda titular: Miguel Vidal.',
    inquilino_nombre: 'Laura Méndez Ruiz',
    inquilino_telefono: '+34 698 112 334',
    inquilino_email: 'l.mendez.demo@email.com',
    contrato_inicio: '2024-09-01',
    contrato_fin: '2027-08-31',
    inmueble_direccion: 'Carrer de Numància, 45 · 3r 1a · 08029 Barcelona (Les Corts)',
    inmueble_ref: 'NH-ALQ-LC-2847',
    inmueble_ref_catastral: '7928601DF2870H0001WX',
    renta_mensual: 1150,
    inmueble_notas: 'Finca 1972, ascensor. Parking comunitario nº 12. Mascotas no.',
    estado_gestion: 'activo',
    servicio: 'administracion',
    suscripcion_activa: true,
    cuota_mensual: 60,
  };

  const MOCK_INCIDENCIAS = [
    {
      estado: 'en_curso',
      titulo: 'Caldera — presión baja',
      descripcion: 'Inquilina reporta error E03. Fontanería acordada para mié 16 · 10:30. Presupuesto enviado al propietario.',
      responsable: 'Propietario (conservación LAU)',
      created_at: '2026-10-01T09:15:00Z',
    },
    {
      estado: 'resuelta',
      titulo: 'Persiana dormitorio atascada',
      descripcion: 'Reparación cerrada. Parte firmado · cargo inquilino por mal uso documentado.',
      responsable: 'Inquilino',
      created_at: '2026-09-12T14:00:00Z',
    },
    {
      estado: 'resuelta',
      titulo: 'Consulta actualización IBI',
      descripcion: 'Enviado recibo actualizado al inquilino vía canal NH.',
      responsable: 'Nueva Habitat',
      created_at: '2026-08-20T11:00:00Z',
    },
  ];

  const MOCK_DOCS = [
    { id: '1', tipo: 'alquiler_administracion', nombre: 'Contrato administración NH · firmado', estado: 'firmado' },
    { id: '2', tipo: 'alquiler_contrato', nombre: 'Contrato arrendamiento LAU', estado: 'firmado' },
    { id: '3', tipo: 'alquiler_incasol', nombre: 'Justificante depósito fianza INCASÒL', estado: 'subido' },
    { id: '4', tipo: 'prop_nota_simple', nombre: 'Nota simple · Numància 45', estado: 'subido' },
    { id: '5', tipo: 'prop_certificado_energetico', nombre: 'CEE · etiqueta D', estado: 'subido' },
    { id: '6', tipo: 'inquilino_dni', nombre: 'DNI Laura Méndez', estado: 'subido' },
    { id: '7', tipo: 'inquilino_contrato', nombre: 'Anexo inventario y llaves', estado: 'subido' },
  ];

  const MOCK_ACTIVITY = [
    { when: 'Hoy · 08:42', text: 'Renta octubre confirmada en tu IBAN (1.150 €).' },
    { when: 'Ayer', text: 'Incidencia caldera: visita fontanería agendada mié 16/10.' },
    { when: '28 sept', text: 'Informe trimestral enviado a tu email (sin contacto inquilino).' },
  ];

  function fmtEur(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);
  }

  function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function toast(msg) {
    if (window.nhToast) window.nhToast(msg, 'info');
    else console.info(msg);
  }

  function demoToastSave() {
    toast('Modo demo: los cambios no se guardan. Crea tu cuenta en acceso-alquileres.');
  }

  function showSection(id) {
    document.querySelectorAll('.p-section').forEach((el) => el.classList.remove('active'));
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sec === id);
    });
    const sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
  }

  function bindNav() {
    document.querySelectorAll('.p-nav-btn[data-sec]').forEach((btn) => {
      btn.addEventListener('click', () => showSection(btn.dataset.sec));
    });
    const q = new URLSearchParams(location.search);
    const sec = q.get('sec');
    if (sec) showSection(sec);

    document.getElementById('pLogout')?.addEventListener('click', () => {
      location.href = demoContext.mode === 'integral' ? '/alquiler-integral' : '/administracion-alquileres';
    });
  }

  function getQueryContext() {
    const q = new URLSearchParams(location.search);
    const mode = q.get('context') === 'integral' ? 'integral' : 'admin';
    const zona = (q.get('zona') || 'lescorts').toLowerCase();
    return { mode, zona: ZONA_PRESETS[zona] ? zona : 'lescorts' };
  }

  function applyZonaPreset(zonaKey) {
    const preset = ZONA_PRESETS[zonaKey] || ZONA_PRESETS.lescorts;
    Object.assign(MOCK, preset);
  }

  function applyIntegralPresentation() {
    if (demoContext.mode !== 'integral') return;

    timelineSteps = ESTADOS_INTEGRAL;
    applyZonaPreset(demoContext.zona);
    MOCK.estado_gestion = 'visitas';
    MOCK.servicio = 'integral';
    MOCK.suscripcion_activa = false;
    MOCK.cuota_mensual = 0;
    MOCK.inquilino_nombre = '— (informe top 3 en preparación)';
    MOCK.inquilino_telefono = '';
    MOCK.inquilino_email = '';
    MOCK.contrato_inicio = '';
    MOCK.contrato_fin = '';

    const preset = ZONA_PRESETS[demoContext.zona] || ZONA_PRESETS.lescorts;
    MOCK_ACTIVITY.length = 0;
    MOCK_ACTIVITY.push(
      { when: 'Hoy · 11:20', text: `Anuncio activo · ${preset.zonaLabel}. 12 mensajes filtrados, 4 visitas concertadas esta semana.` },
      { when: 'Ayer', text: 'Documentación validada: CE, nota simple e inventario fotográfico completos.' },
      { when: '24 sept', text: 'Expediente alquiler integral abierto · tarifa 499 € acordada.' },
    );

    MOCK_DOCS.length = 0;
    MOCK_DOCS.push(
      { id: 'i1', tipo: 'prop_dni', nombre: 'DNI / NIE propietario · validado', estado: 'subido' },
      { id: 'i2', tipo: 'prop_nota_simple', nombre: `Nota simple · ${preset.zonaLabel}`, estado: 'subido' },
      { id: 'i3', tipo: 'prop_certificado_energetico', nombre: 'CEE · etiqueta D', estado: 'subido' },
      { id: 'i4', tipo: 'prop_cedula_habitabilidad', nombre: 'Cédula de habitabilidad', estado: 'subido' },
      { id: 'i5', tipo: 'alquiler_integral', nombre: 'Encargo alquiler integral · 499 €', estado: 'firmado' },
    );

    document.getElementById('logoSubPanel')?.replaceChildren(document.createTextNode('Panel alquiler integral (demo)'));
    document.getElementById('panelServicioBadge')?.replaceChildren(document.createTextNode('Alquiler integral · 499 €'));
    document.getElementById('alqResumenTitle')?.replaceChildren(document.createTextNode('Tu expediente de captación'));
    document.getElementById('gestionProcesoTitle')?.replaceChildren(document.createTextNode('Proceso alquiler integral (499 €)'));
    const copy = document.getElementById('alqResumenCopy');
    if (copy) {
      copy.textContent = 'Así ves el avance en la cuenta real: documentación, publicación, visitas, informe top 3 y cierre LAU. Datos simulados para que pruebes el menú.';
    }
    document.querySelectorAll('.p-nav-btn[data-only-admin]').forEach((btn) => {
      btn.style.display = 'none';
    });
    const incNote = document.getElementById('gestionIncludesList');
    if (incNote) {
      incNote.innerHTML = `
        <li>Visibilidad del estado en cada paso hasta la firma del contrato.</li>
        <li>Chat y avisos con tu gestor (no con curiosos de portales).</li>
        <li>Subida de documentos del inmueble desde el expediente.</li>
        <li>Tras firmar, puedes contratar <strong>administración 60 €/mes</strong> con el mismo diseño de panel.</li>`;
    }
    const banner = document.getElementById('pDemoBanner');
    if (banner) {
      banner.innerHTML = `<strong>Demo alquiler integral</strong> — ${esc(preset.zonaLabel)} · datos simulados. Navega por «Gestión y proceso» y «Documentación».
        <a href="/acceso-alquiler-integral">Cuenta real integral</a> · <a href="/alquiler-integral">Volver al servicio</a>`;
    }
    document.querySelector('.p-brand')?.setAttribute('href', '/alquiler-integral');
  }

  function renderTimeline(estado) {
    const idx = timelineSteps.findIndex((e) => e.key === estado);
    const cur = idx >= 0 ? idx : (demoContext.mode === 'integral' ? 3 : 3);
    const el = document.getElementById('timelineAlquiler');
    if (!el) return;
    el.innerHTML = timelineSteps.map((step, i) => {
      let dotClass = 'dot-pend';
      let inner = String(i + 1);
      if (i < cur) { dotClass = 'dot-done'; inner = '✓'; }
      else if (i === cur) dotClass = 'dot-now';
      return `<div class="p-step">
        <div class="p-step-dot ${dotClass}">${inner}</div>
        <div class="p-step-body">
          <h4>${esc(step.title)}</h4>
          <p>${esc(step.desc)}</p>
        </div>
      </div>`;
    }).join('');
  }

  function fillForms() {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? '';
    };
    set('fPropNombre', MOCK.nombre);
    set('fPropDni', MOCK.dni);
    set('fPropTel', MOCK.telefono);
    set('fPropEmail', MOCK.email);
    set('fPropDir', MOCK.direccion_propietario);
    set('fPropIban', MOCK.iban_cobro);
    set('fPropNotas', MOCK.notas_propietario);
    set('fInqNombre', MOCK.inquilino_nombre);
    set('fInqTel', MOCK.inquilino_telefono);
    set('fInqEmail', MOCK.inquilino_email);
    set('fContratoInicio', MOCK.contrato_inicio);
    set('fContratoFin', MOCK.contrato_fin);
    set('fInmDir', MOCK.inmueble_direccion);
    set('fInmRef', MOCK.inmueble_ref);
    set('fInmCatastro', MOCK.inmueble_ref_catastral);
    set('fInmRenta', String(MOCK.renta_mensual));
    set('fInmNotas', MOCK.inmueble_notas);
  }

  function renderSummary() {
    document.getElementById('pUserName').textContent = MOCK.nombre;
    document.getElementById('pAvatar').textContent = 'EV';
    const estadoLabel = demoContext.mode === 'integral'
      ? (ESTADOS_INTEGRAL.find((e) => e.key === MOCK.estado_gestion)?.title || 'En curso')
      : ESTADO_LABEL[MOCK.estado_gestion];
    document.getElementById('statEstado').textContent = estadoLabel.length > 22 ? 'En curso' : estadoLabel;
    document.getElementById('statRenta').textContent = fmtEur(MOCK.renta_mensual);
    const abiertas = demoContext.mode === 'integral'
      ? 0
      : MOCK_INCIDENCIAS.filter((i) => !['resuelta', 'cerrada'].includes(i.estado)).length;
    document.getElementById('statIncidencias').textContent = demoContext.mode === 'integral' ? '—' : String(abiertas);
    const badge = document.getElementById('alqResumenBadge');
    if (badge) {
      badge.innerHTML = demoContext.mode === 'integral'
        ? '<span class="nh-pay-badge nh-pay-badge--pending">499 € · captación</span>'
        : '<span class="nh-pay-badge nh-pay-badge--done">Cuota domiciliada</span>';
    }
    document.getElementById('cfgPropEmail').textContent = MOCK.email;
    document.getElementById('cfgPropServicio').textContent = demoContext.mode === 'integral'
      ? 'Alquiler integral (499 € fijo)'
      : 'Administración de alquiler (60 €/mes)';

    const actEl = document.getElementById('demoActivityList');
    if (actEl) {
      actEl.innerHTML = MOCK_ACTIVITY.map((a) => `<div class="p-lead-row" style="align-items:center">
        <div style="font-size:.72rem;color:var(--gris-medio);min-width:5.5rem">${esc(a.when)}</div>
        <div style="font-size:.875rem;color:var(--gris-texto);flex:1">${esc(a.text)}</div>
      </div>`).join('');
    }
  }

  function renderHonorarios() {
    const card = document.getElementById('honorariosResumenCard');
    const body = document.getElementById('honorariosAlquilerBody');
    if (demoContext.mode === 'integral') {
      const htmlInt = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;align-items:flex-end">
        <div>
          <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro-claro);margin-bottom:.35rem">Tarifa alquiler integral</div>
          <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:#fff">499 €<span style="font-size:1rem;font-weight:500;opacity:.75"> · fijo</span></div>
          <p style="font-size:.8125rem;color:rgba(255,255,255,.72);margin:.5rem 0 0;max-width:340px">Captación y cierre: anuncio, visitas, top 3, LAU e INCASÒL. Sin comisión de un mes de renta.</p>
        </div>
        <span class="nh-pay-badge nh-pay-badge--pending">Pago al contratar servicio</span>
      </div>`;
      if (card) card.innerHTML = htmlInt;
      if (body) {
        body.innerHTML = `
        <div class="nh-pay-summary">
          <div class="nh-pay-row"><span>Servicio captación + cierre</span><strong>499,00 €</strong></div>
          <div class="nh-pay-row nh-pay-row--total"><span>Total integral (ejemplo demo)</span><strong>499,00 €</strong></div>
        </div>
        <p style="font-size:.85rem;color:var(--gris-texto);margin-top:1rem;line-height:1.55">Después de firmar con el inquilino puedes activar la <strong>administración 60 €/mes</strong> en el mismo panel.</p>
        <a href="/administracion-alquileres" class="btn btn-outline" style="margin-top:.75rem;font-size:.82rem">Ver administración (demo admin)</a>`;
      }
      return;
    }
    const html = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;align-items:flex-end">
        <div>
          <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--oro-claro);margin-bottom:.35rem">Cuota administración</div>
          <div style="font-family:var(--font-serif);font-size:2rem;font-weight:700;color:#fff">60 €<span style="font-size:1rem;font-weight:500;opacity:.75">/mes</span></div>
          <p style="font-size:.8125rem;color:rgba(255,255,255,.72);margin:.5rem 0 0;max-width:320px">IVA incluido · alquiler larga duración · Les Corts</p>
        </div>
        <span class="nh-pay-badge nh-pay-badge--done">Domiciliación activa</span>
      </div>`;
    if (card) card.innerHTML = html;
    if (body) {
      body.innerHTML = `
        <div class="nh-pay-summary">
          <div class="nh-pay-row"><span>Base imponible</span><strong>49,59 €</strong></div>
          <div class="nh-pay-row"><span>IVA (21%)</span><strong>10,41 €</strong></div>
          <div class="nh-pay-row nh-pay-row--total"><span>Total mensual</span><strong>60,00 €</strong></div>
        </div>
        <div class="nh-pay-status nh-pay-status--ok">
          <strong>Domiciliación SEPA activa</strong>
          <span>Próximo cargo: 1 nov 2026 · IBAN terminado en ···1332</span>
        </div>
        <p style="font-size:.85rem;color:var(--gris-texto);margin-top:1rem;line-height:1.55">En la cuenta real puedes domiciliar la cuota o pagar por transferencia. La renta del inquilino <strong>no pasa por Nueva Habitat</strong>: la cobras tú.</p>
        <button type="button" class="btn btn-outline demo-noop" style="margin-top:.75rem;font-size:.82rem">Gestionar domiciliación (demo)</button>`;
    }
  }

  function renderIncidencias() {
    const el = document.getElementById('incidenciasList');
    if (!el) return;
    el.innerHTML = MOCK_INCIDENCIAS.map((i) => `<div class="p-lead-row">
      <span class="p-lead-tipo">${esc(i.estado.replace('_', ' '))}</span>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.9rem">${esc(i.titulo)}</div>
        <div style="font-size:.8125rem;color:var(--gris-texto);margin-top:.25rem">${esc(i.descripcion)}</div>
        ${i.responsable ? `<div style="font-size:.72rem;color:var(--gris-medio);margin-top:.35rem">Responsable: ${esc(i.responsable)}</div>` : ''}
      </div>
      <div style="font-size:.75rem;color:var(--gris-medio);white-space:nowrap">${fmtDate(i.created_at)}</div>
    </div>`).join('');
  }

  function docsForTipo(tipo) {
    return MOCK_DOCS.filter((d) => d.tipo === tipo);
  }

  function renderUploadSlots() {
    const renderBlock = (containerId, slots) => {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = slots.map((slot) => {
        const existing = docsForTipo(slot.tipo);
        const chip = existing.length
          ? `<span class="p-doc-chip ok">${existing.length} archivo(s)</span>`
          : '<span class="p-doc-chip">Sin subir</span>';
        return `<div class="p-doc-upload">
          <div class="p-doc-upload-head">
            <strong>${esc(slot.label)}</strong>
            ${chip}
          </div>
          <input type="file" disabled title="Demo: subida desactivada"/>
          <p class="p-form-hint">Demo — en tu cuenta real puedes subir PDF aquí.</p>
        </div>`;
      }).join('');
    };
    renderBlock('docsPropietarioUpload', PROP_DOC_SLOTS);
    renderBlock('docsInquilinoUpload', INQ_DOC_SLOTS);
  }

  function renderDocsList() {
    const inq = MOCK_DOCS.filter((d) => d.tipo.startsWith('inquilino'));
    const alq = MOCK_DOCS.filter((d) => !d.tipo.startsWith('inquilino'));
    const row = (d) => `<div class="p-doc-row">
      <div class="p-doc-name">${esc(d.nombre)}</div>
      <div style="font-size:.75rem;color:var(--gris-medio);text-transform:capitalize">${esc(d.estado)}</div>
      <button type="button" class="btn btn-outline demo-doc-btn" style="font-size:.78rem;padding:.4rem .9rem">Ver PDF</button>
    </div>`;
    const inqEl = document.getElementById('docsInquilino');
    const alqEl = document.getElementById('docsAlquiler');
    if (inqEl) inqEl.innerHTML = inq.map(row).join('');
    if (alqEl) alqEl.innerHTML = alq.map(row).join('');
    document.querySelectorAll('.demo-doc-btn').forEach((btn) => {
      btn.addEventListener('click', () => toast('Demo: vista previa PDF no disponible en la demostración.'));
    });
  }

  function bindForms() {
    ['formPropietario', 'formInquilino', 'formInmueble'].forEach((id) => {
      document.getElementById(id)?.addEventListener('submit', (e) => {
        e.preventDefault();
        demoToastSave();
      });
    });
    document.querySelectorAll('.demo-noop').forEach((btn) => {
      btn.addEventListener('click', () => demoToastSave());
    });
    document.querySelectorAll('[onclick*="nhPanel"], [onclick*="nhAuth"]').forEach((btn) => {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', () => demoToastSave());
    });
  }

  function applyEmbedMode() {
    const embed = new URLSearchParams(location.search).get('embed') === '1';
    if (!embed) return;
    document.body.classList.add('p-demo-embed');
    const banner = document.getElementById('pDemoBanner');
    if (banner) banner.style.display = 'none';
  }

  function init() {
    demoContext = getQueryContext();
    applyIntegralPresentation();
    bindNav();
    fillForms();
    renderSummary();
    renderTimeline(MOCK.estado_gestion);
    if (demoContext.mode === 'admin') renderIncidencias();
    renderUploadSlots();
    renderDocsList();
    renderHonorarios();
    bindForms();
    applyEmbedMode();
    document.querySelectorAll('.demo-noop').forEach((btn) => {
      btn.addEventListener('click', () => demoToastSave());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
