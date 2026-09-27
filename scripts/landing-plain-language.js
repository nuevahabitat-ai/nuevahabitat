/** Sustituye jerga inmobiliaria/local por lenguaje claro en textos de landing. */
function plainLanguage(text) {
  if (!text) return text;
  let s = String(text);
  const rules = [
    [/profesionales del 22@/gi, 'quien trabaja en oficinas de la zona del Fòrum y Poblenou'],
    [/inversor 22@/gi, 'inversor en la zona de oficinas de Poblenou'],
    [/zona 22@/gi, 'zona de oficinas de Poblenou junto al mar'],
    [/distrito 22@/gi, 'polígono de oficinas de Poblenou'],
    [/sector 22@/gi, 'empresas de Poblenou y el Fòrum'],
    [/perfil tech en 22@/gi, 'perfil que trabaja en oficinas de Poblenou'],
    [/Tech en 22@/gi, 'Oficinas en Poblenou'],
    [/22@ y/gi, 'Poblenou y'],
    [/22@,/gi, 'Poblenou,'],
    [/22@ /gi, 'oficinas de Poblenou '],
    [/22@/g, 'oficinas de Poblenou (zona Fòrum)'],
    [/hacia el 22@/gi, 'hacia las oficinas de Poblenou'],
    [/al 22@/gi, 'a las oficinas de Poblenou'],
    [/del 22@/gi, 'de las oficinas de Poblenou'],
    [/en 22@/gi, 'en oficinas de Poblenou'],
  ];
  rules.forEach(([re, rep]) => {
    s = s.replace(re, rep);
  });
  return s;
}

function plainLanguageLanding(L) {
  const pl = plainLanguage;
  const out = { ...L };
  if (out.perfilComprador) out.perfilComprador = pl(out.perfilComprador);
  if (out.tipologiaEdificios) out.tipologiaEdificios = pl(out.tipologiaEdificios);
  if (out.argumento_principal) out.argumento_principal = pl(out.argumento_principal);
  if (out.meta?.description) out.meta = { ...out.meta, description: pl(out.meta.description) };
  if (out.datosMercado) {
    out.datosMercado = { ...out.datosMercado };
    if (out.datosMercado.tendencia) out.datosMercado.tendencia = pl(out.datosMercado.tendencia);
    if (out.datosMercado.precioM2) out.datosMercado.precioM2 = pl(out.datosMercado.precioM2);
  }
  if (out.hero?.lead) out.hero = { ...out.hero, lead: pl(out.hero.lead) };
  if (out.faq?.length) {
    out.faq = out.faq.map((f) => ({ q: pl(f.q), a: pl(f.a) }));
  }
  return out;
}

module.exports = { plainLanguage, plainLanguageLanding };
