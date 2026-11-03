/** Planes venta (panel + registro) — mantener alineado con lib/server/venta-planes.js */
(function () {
  const IVA = 0.21;
  function total(base) {
    return Math.round(base * (1 + IVA) * 100) / 100;
  }
  function half(t, fase) {
    const cents = Math.round(t * 100);
    const first = Math.floor(cents / 2);
    return (fase === 1 ? first : cents - first) / 100;
  }
  const plans = {
    clasico: {
      id: 'clasico',
      baseEur: 3500,
      totalIva: total(3500),
      label: 'Venta clásica',
      tagline: 'Acompañamiento integral con equipo NH',
      scope: 'Barcelona y área metropolitana',
    },
    digital: {
      id: 'digital',
      baseEur: 1999,
      totalIva: total(1999),
      label: 'Venta 100 % digital',
      tagline: 'Tú atiendes las visitas cualificadas',
      scope: 'Barcelona · expansión nacional',
    },
    digital_comercial_bcn: {
      id: 'digital_comercial_bcn',
      baseEur: 2500,
      totalIva: total(2500),
      label: 'Digital + comercial Barcelona',
      tagline: 'Un comercial NH hace las visitas',
      scope: 'Exclusivo Barcelona',
    },
  };
  Object.keys(plans).forEach((k) => {
    const p = plans[k];
    p.half1 = half(p.totalIva, 1);
    p.half2 = half(p.totalIva, 2);
    p.baseLabel = `${p.baseEur.toLocaleString('es-ES')} € + IVA`;
    p.totalLabel = `${p.totalIva.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € IVA incl.`;
  });
  window.NH_VENTA_PLANES = plans;
  window.NH_VENTA_PLAN_DEFAULT = 'clasico';
  window.nhVentaPlanFromStorage = function () {
    const id = (localStorage.getItem('nh_venta_plan') || window.NH_VENTA_PLAN_DEFAULT).trim();
    return window.NH_VENTA_PLANES[id] ? id : window.NH_VENTA_PLAN_DEFAULT;
  };
})();
