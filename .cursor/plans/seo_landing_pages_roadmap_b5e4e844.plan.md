---
name: SEO Landing Pages Roadmap
overview: Auditoría completa del SEO actual de las landing pages de venta y hoja de ruta para contenido rico, nuevas páginas por zona y mejoras técnicas que ayuden a Google a indexar y posicionar NuevaHabitat para "vender piso Barcelona" y "vender piso particular Barcelona".
todos:
  - id: fase0
    content: "Fase 0: subir MIN_WORDS/bajar SIMILARITY_THRESHOLD y ampliar plantillas (render-barrio.js, situacion/intencion/comparativa) con bloques nuevos (precio/m2, perfil comprador, checklist, mas FAQs)"
    status: completed
  - id: fase1-pilar
    content: "Fase 1: reescribir vender.html (angulo particular vs agencia + grid de guias)"
    status: completed
  - id: fase1-comparativas
    content: "Fase 1: ampliar las 4 comparativas + 2 paginas de intencion (particular/sin exclusividad/rapido) a 900-1200 palabras"
    status: completed
  - id: fase1-barrios-top
    content: "Fase 1: ampliar barrios prioritarios (Eixample, Gracia, Sants, Les Corts, Sarria, Ciutat Vella, Poblenou)"
    status: completed
  - id: fase1-situacion
    content: "Fase 1: ampliar las 5 paginas de situacion restantes"
    status: completed
  - id: fase1-resto-barrios
    content: "Fase 1: ampliar barrios restantes (Horta, Nou Barris, L'Hospitalet, Esplugues)"
    status: completed
  - id: fase2-nuevos-barrios
    content: "Fase 2: crear landings nuevas de zona (Sant Andreu, Poble Sec, Sant Antoni, Sant Gervasi, Sant Marti/El Clot, Cornella, Sant Just/Sant Joan Despi)"
    status: completed
  - id: fase3-valoracion
    content: "Fase 3: crear landing de valoracion 'cuanto vale mi piso en Barcelona'"
    status: completed
  - id: fase3-situacion-nueva
    content: "Fase 3: crear landings de hipoteca pendiente, herencia, separacion/divorcio, okupas"
    status: completed
  - id: fase3-comparativas-nuevas
    content: "Fase 3: crear comparativas vs Housfy y vs Clikalia"
    status: completed
  - id: fase4-tecnico
    content: "Fase 4: interlinking contextual, limpieza de js/seo.js, imagenes diferenciadas, verificacion GSC/GA4/Google Business"
    status: completed
isProject: false
---

# Auditoría SEO de las landing pages (estado actual)

## Cómo funciona hoy el sistema (para que quede documentado)

`content/landings/{barrio,situacion,intencion,comparativa}/*.json` → `scripts/build-landings.js` (usa `render-barrio.js` / `render-pilar.js` / plantillas internas para situación e intención) → genera cada `{slug}.html` en la raíz + actualiza `js/landings.js` (usado por `js/landings-ui.js` para el footer y el grid de zonas de `vender.html`) + regenera `content/landings-index.json` (fuente del sitemap dinámico en `api/sitemap.js`).

Puntos fuertes que ya existen y hay que conservar:
- `vender.html` ya tiene un grid `data-nh-zona-local` (`vender.html:522`) que lista automáticamente TODAS las páginas de barrio — al añadir un JSON nuevo en `content/landings/barrio/`, aparece solo tras rebuild. No hace falta tocar `vender.html` a mano para nuevas zonas.
- `scripts/build-landings.js` ya valida longitud mínima (`MIN_WORDS=120`) y similitud entre páginas (Jaccard, `SIMILARITY_THRESHOLD=0.45`) antes de construir — es la barrera contra contenido duplicado, pero los umbrales actuales son demasiado permisivos.
- El JSON-LD (Organization, WebPage, Breadcrumb, FAQPage) ya se inyecta de forma estática por página vía `buildJsonLd()` en `build-landings.js`. Los bloques hardcodeados en `js/seo.js` (`PAGE_SEO`, líneas 270-616) son redundantes para landings generadas (se ignoran porque `initPageSeo()` corta si ya existe `#nh-seo-static`) — no hace falta tocarlos para páginas nuevas, y a medio plazo se pueden limpiar.

## Hallazgos críticos (por qué no posiciona bien)

1. **Contenido demasiado corto y plantillero** — audité las 26 páginas: el `argumento_principal` medio tiene ~186 palabras (mínimo 120, máximo 424 en una sola página). Páginas de barrio como Sants, Eixample, Les Corts, Sarrià rondan 120-140 palabras. Google en 2026 penaliza explícitamente este patrón como *scaled content abuse / doorway pages*: "misma plantilla, solo cambia el nombre del barrio" (confirmado en fuentes de Google 2026 sobre SEO inmobiliario). El estándar recomendado es 700-1200 palabras únicas por página de zona, con datos reales del barrio.
2. **Cobertura geográfica incompleta** — de los 10 distritos de Barcelona ciudad cubrimos bien Ciutat Vella, Eixample, Les Corts, Gràcia, Horta-Guinardó, Nou Barris, Sants (parcial). Faltan **Sant Andreu** y **Sant Martí** (Poblenou solo cubre una parte), y faltan micro-zonas de alta demanda como **Poble Sec, Sant Antoni y Sant Gervasi** (hoy fundido dentro de la página de Sarrià). En área metropolitana solo están L'Hospitalet y Esplugues, faltando Cornellà, Sant Just Desvern, Sant Joan Despí (todas cerca de la oficina de Les Corts).
3. **Falta la página más buscada de todas**: "cuánto vale mi piso Barcelona" / valoración — es la keyword de mayor volumen e intención media-alta para captar propietarios, y hoy no existe como landing dedicada (solo como CTA dentro de otras páginas).
4. **Ángulo "particular" infrarrepresentado en profundidad** — es el diferenciador real del negocio (precio fijo vs comisión 6%), y las 4 comparativas + 2 páginas de intención que lo tocan son de las más cortas (242-424 palabras). Deberían ser las páginas más ricas del sitio, no de las más pobres.
5. **Huecos de intención de "situación" con alta intención y poca competencia**: falta "vender piso con hipoteca pendiente", "vender piso herencia" (existe solo como entrada de blog, no como landing), "vender piso okupado", "vender piso separación/divorcio".
6. **Interlinking superficial** — más allá del footer y el grid de barrios, no hay enlaces contextuales dentro del cuerpo del texto hacia blog/comparativas relacionadas por keyword.
7. **Imágenes genéricas reutilizadas** (`interior1.jpg`...`interior12.jpg` repetidas en varias páginas) — Google 2026 penaliza reputación cuando no hay fotografía diferenciada; no es bloqueante pero sí una señal de calidad a mejorar con el tiempo.

# Mapa de keywords prioritario (investigación 2026)

Organizado por intención de búsqueda, que es como hay que estructurar el contenido:

- **Captación directa (vendedor decidido)**: vender piso Barcelona, vender piso [barrio] Barcelona, mejor inmobiliaria para vender en [barrio], vender piso rápido Barcelona, vender piso sin comisión Barcelona.
- **Ángulo particular (núcleo del negocio, prioridad máxima)**: vender piso particular Barcelona, vender piso sin agencia Barcelona, vender piso sin exclusividad Barcelona, vender piso por mi cuenta Barcelona, cuánto cobra una inmobiliaria en Barcelona, comisión inmobiliaria Barcelona 2026, diferencia vender con agencia o particular.
- **Valoración (alto volumen, falta cubrir)**: cuánto vale mi piso Barcelona, valoración vivienda gratis Barcelona, tasación online Barcelona, precio m² [barrio] Barcelona.
- **Comparativas de marca/modelo**: nuevahabitat vs idealista particular (existe), vs fotocasa particular (existe), vs agencia tradicional (existe), vs housfy Barcelona (nuevo), vs clikalia Barcelona (nuevo), inmobiliarias de precio fijo Barcelona.
- **Situacionales de alta intención**: vender piso alquilado (existe), vender piso herencia Barcelona (solo blog hoy, falta landing), vender piso con hipoteca pendiente Barcelona (falta), vender piso separación/divorcio Barcelona (falta), vender piso okupado Barcelona (falta), vender piso traslado/mudanza (existe), vender antes de comprar otro (existe), segunda residencia (existe).
- **Informativas / autoridad temática (blog)**: plusvalía municipal Barcelona, gastos de vender un piso, contrato de arras, nota simple, certificado energético, ITE, IRPF por venta de vivienda.
- **Geo (barrio/ciudad)**: las 15 zonas ya existentes + las nuevas del roadmap de abajo.

# Roadmap de ejecución

## Fase 0 — Fundamentos de calidad de contenido (antes de escribir nada nuevo)
- Subir `MIN_WORDS` en `scripts/build-landings.js` a un mínimo real por cluster (≈700 barrio/situación, ≈900 comparativa/intención) y bajar `SIMILARITY_THRESHOLD` a ~0.35 para forzar más unicidad real.
- Ampliar el esquema de contenido de cada landing con nuevos bloques que obliguen a variar por página (no solo texto libre): rango de precio/m² orientativo del barrio, tipología de edificio predominante, perfil de comprador típico, checklist "qué mirar antes de vender aquí", y 8-10 FAQs (hoy 6, algunas con respuestas muy cortas).
- Extender `render-barrio.js` / plantillas de situación-intención-comparativa para pintar esos bloques nuevos.
- Los datos de mercado se presentarán como **rangos orientativos 2026 basados en investigación pública**, siempre con lenguaje de "estimación", evitando cifras exactas no verificables.

## Fase 1 — Reescritura en profundidad de páginas existentes (prioridad alta)
Orden de prioridad:
1. `vender.html` (pilar) — reforzar el ángulo "particular vs agencia" en el H1/intro, ampliar contenido, añadir grid propio para las páginas de "Guías vendedor" (situación/intención/comparativa) igual que ya existe para barrios.
2. Las 4 comparativas (`nuevahabitat-vs-idealista-particular`, `vs-fotocasa-particular`, `vs-agencia-tradicional`, `vender-por-tu-cuenta-vs-nuevahabitat`) y las 2 de intención (`vender-piso-rapido`, `vender-piso-sin-exclusividad`) — son el núcleo del negocio, deben llegar a 900-1200 palabras con tablas comparativas más ricas y casos numéricos.
3. Barrios de mayor tráfico/oficina cercana: Eixample, Gràcia, Sants, Les Corts, Sarrià, Ciutat Vella (Gòtic/Born/Raval/Barceloneta), Poblenou.
4. Las 5 páginas de "situación" restantes, ampliadas al nuevo estándar.
5. Resto de barrios (Horta, Nou Barris, L'Hospitalet, Esplugues).

## Fase 2 — Nuevas páginas geográficas ("varios sitios de Barcelona que no tenemos")
Nuevas landings de barrio (usando ya la plantilla mejorada de la Fase 0), priorizadas por demanda real y cercanía a la oficina de Les Corts (L3/L5/FGC):
- Sant Andreu (de Palomar) — distrito completo sin cubrir.
- Poble Sec — Sants-Montjuïc, misma línea L3 que la oficina.
- Sant Antoni — micro-zona de altísima demanda pegada al Eixample.
- Sant Gervasi — separarla de la página de Sarrià (hoy fundida), zona de alto valor con búsqueda propia.
- Sant Martí / El Clot–La Sagrera — el resto del distrito que Poblenou no cubre.
- Cornellà de Llobregat — área metropolitana, conexión directa L5.
- Sant Just Desvern / Sant Joan Despí — muy cerca de la oficina, poca competencia.

## Fase 3 — Nuevas páginas de intención/situación y valoración
- **"Cuánto vale mi piso en Barcelona"** (valoración) — página nueva de alta prioridad, separada del pilar, pensada para el usuario que aún no ha decidido vender.
- Vender piso con hipoteca pendiente Barcelona.
- Vender piso herencia Barcelona (elevar de blog a landing completa).
- Vender piso separación/divorcio Barcelona.
- Vender piso okupado Barcelona.
- Comparativas nuevas: vs Housfy Barcelona, vs Clikalia Barcelona.

## Fase 4 — Interlinking, técnico y medición
- Enlaces contextuales dentro del cuerpo (no solo related-block final) entre landings, comparativas y artículos de blog relevantes por keyword.
- Revisar y, si procede, simplificar `js/seo.js` (quitar el `PAGE_SEO` redundante de landings generadas, ya cubierto por el JSON-LD estático del build).
- Sustituir progresivamente imágenes hero genéricas reutilizadas por fotografía diferenciada por zona; asegurar formato WebP/AVIF y `fetchpriority="high"` en el hero, lazy-load en el resto.
- Tras cada despliegue: `node scripts/build-landings.js` debe pasar la validación de similitud/longitud antes de publicar.
- Fuera de código: confirmar en Vercel que `GA_MEASUREMENT_ID` está configurado, verificar la propiedad en Google Search Console con el sitemap dinámico, y pedir indexación manual de las URLs nuevas/corregidas. Optimizar el perfil de Google Business (Local Pack) — no es código pero es determinante para estas búsquedas locales.

# Notas de alcance
Esta es la hoja de ruta completa; la ejecución se hará por fases dentro de sesiones sucesivas empezando por la Fase 0 y 1 (pilar + comparativas "particular" + barrios prioritarios), ya que reescribir con calidad real las ~26 páginas existentes más crear ~13 páginas nuevas no es un cambio de una sola pasada.
