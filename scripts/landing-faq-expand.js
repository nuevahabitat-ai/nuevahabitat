function normQ(q) {
  return String(q || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[¿?]/g, '')
    .trim();
}

function venderExtras(barrio) {
  const b = barrio || 'Barcelona';
  return [
    {
      q: `¿Cuánto cuesta vender en ${b} con NuevaHabitat?`,
      a: '3.000 € + IVA de honorarios fijos al vendedor, pagados solo en escritura. Sin venta, no facturamos comisión de agencia.',
    },
    {
      q: '¿Puedo vender sin exclusiva de doce meses?',
      a: 'Sí. Trabajamos con mandatos flexibles: puedes seguir en portal y activamos compradores de cartera cuando el precio encaja.',
    },
    {
      q: `¿Atendéis todo ${b} desde Les Corts?`,
      a: 'Sí. Oficina en Carrer de Mejía Lequerica, 42 (Les Corts). Visitas concertadas en tu barrio y franjas horarias.',
    },
    {
      q: '¿Los compradores tienen financiación contrastada?',
      a: 'Priorizamos visitas con hipoteca preaprobada o liquidez acreditada para no malgastar tu tiempo.',
    },
    {
      q: '¿Qué incluye el panel vendedor?',
      a: 'Calendario de visitas, documentación centralizada, ofertas trazables y comunicación con Daniel o Sebastián.',
    },
    {
      q: '¿Cuánto tarda una venta bien de precio?',
      a: 'Depende de micro-zona y ticket; en la valoración gratuita te damos rango orientativo de semanas, no promesas genéricas.',
    },
    {
      q: '¿Puedo vender con hipoteca pendiente o inquilino?',
      a: 'Sí. Coordinamos timing con el banco o contrato de alquiler y filtramos compradores compatibles con tu situación.',
    },
    {
      q: '¿Publicáis en Idealista o Fotocasa?',
      a: 'Podemos complementar difusión según estrategia acordada; el foco está en pricing local y compradores cualificados.',
    },
    {
      q: '¿Hacéis valoración gratuita?',
      a: 'Sí, en 24 h laborables con comparables de tu entorno, no con la media genérica del distrito.',
    },
    {
      q: '¿Quién es mi gestor?',
      a: 'Daniel Hernández o Sebastián Hernández te atienden por teléfono o WhatsApp en horario comercial lun–sáb 9–20h.',
    },
    {
      q: '¿Qué documentación conviene tener lista?',
      a: 'Nota simple, certificado energético, cédula de habitabilidad, actas de comunidad e ITE si aplica — lo revisamos contigo.',
    },
  ];
}

function compradorExtras(barrio) {
  const b = barrio || 'Barcelona';
  return [
    {
      q: `¿Cuánto cuesta el servicio de comprador en ${b}?`,
      a: '5.000 € + IVA solo en escritura cuando compras. El precio del piso se negocia aparte con el vendedor.',
    },
    {
      q: '¿Necesito hipoteca preaprobada antes de visitar?',
      a: 'Recomendable: cerramos techo de precio con tu banco y evitamos visitas a pisos que no pasarían tasación.',
    },
    {
      q: `¿Buscáis solo en ${b} o en barrios limítrofes?`,
      a: 'Definimos micro-zonas contigo; si el presupuesto lo pide, ampliamos radar a municipios o barrios colindantes.',
    },
    {
      q: '¿Hay pisos off-market o en cartera privada?',
      a: 'Sí. Parte del stock de vendedores NuevaHabitat se ofrece primero a compradores registrados con perfil compatible.',
    },
    {
      q: '¿Revisáis comunidad, ITE y cargas antes de ofertar?',
      a: 'Sí. Pedimos documentación mínima o la contrastamos en visita para no firmar arras con sorpresas.',
    },
    {
      q: '¿Negociáis la oferta con el vendedor?',
      a: 'Preparamos y presentamos la oferta contigo, apoyada en comparables de cierre cuando existen.',
    },
    {
      q: '¿Acompañáis hasta la escritura pública?',
      a: 'Coordinamos banco, notaría y checklist de firma; el honorario se paga al cerrar la compra.',
    },
    {
      q: '¿Trabajáis con compradores extranjeros?',
      a: 'Sí. Gestionamos plazos de NIE, visitas coordinadas y financiación internacional cuando aplica.',
    },
    {
      q: '¿Cuánto tarda encontrar piso?',
      a: 'Depende de presupuesto y criterios; tras el registro te proponemos plan realista en 24 h laborables.',
    },
    {
      q: '¿El registro de búsqueda es gratuito?',
      a: 'Sí. Sin coste inicial; solo pagas honorarios de comprador si cierras operación con nosotros.',
    },
    {
      q: '¿Dónde está la oficina?',
      a: 'Les Corts, Barcelona (Mejía Lequerica 42). Atendemos todo el área metropolitana.',
    },
  ];
}

function intencionExtras() {
  return [
    ...venderExtras('Barcelona'),
    {
      q: '¿NuevaHabitat compite con vender yo mismo en portales?',
      a: 'Complementamos: filtro de solvencia, negociación y panel; tú decides si publicas también como particular.',
    },
    {
      q: '¿La calculadora de ahorro es vinculante?',
      a: 'No. Es orientativa; la valoración personalizada confirma pricing y neto al vendedor.',
    },
  ];
}

function ensureMinFaq(L, min = 10) {
  const faq = [...(L.faq || [])];
  const seen = new Set(faq.map((f) => normQ(f.q)));
  let extras = [];
  if (L.cluster === 'comprador') extras = compradorExtras(L.barrio);
  else if (L.cluster === 'intencion' || L.cluster === 'comparativa' || L.cluster === 'particular') {
    extras = intencionExtras();
  } else {
    extras = venderExtras(L.barrio || L.footerLabel);
  }

  extras.forEach((item) => {
    if (faq.length >= min) return;
    const key = normQ(item.q);
    if (seen.has(key)) return;
    seen.add(key);
    faq.push(item);
  });
  return faq;
}

module.exports = { ensureMinFaq };
