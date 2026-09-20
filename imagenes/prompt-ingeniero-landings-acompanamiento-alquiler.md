# Prompt para el ingeniero — Landings de "Acompañamiento de alquiler" por zona/ciudad

## Contexto
Vamos a crear 4 páginas nuevas basadas en la plantilla de `/servicios/acompanamiento-alquiler`, siguiendo el patrón de URL que ya usamos en otros servicios (`-local/[ciudad]` o `-local/[ciudad-barrio]`).

**Páginas a crear:**
1. `/servicios/acompanamiento-alquiler-local/barcelona-les-corts`
2. `/servicios/acompanamiento-alquiler-local/hospitalet-de-llobregat`
3. `/servicios/acompanamiento-alquiler-local/madrid`
4. `/servicios/acompanamiento-alquiler-local/valencia`

> Nota: L'Hospitalet de Llobregat **no es un barrio de Barcelona**, es un municipio propio (así lo tratamos ya en otras páginas del sitio: contrato-alquiler-habitacion, contrato-arras-local, servicio-completo-compra-local). Mantener esa misma convención aquí — va como ciudad, no como "barcelona-hospitalet".

---

## Estándar técnico común (aplica a las 4 páginas)

- **Plantilla base:** heredar de `/servicios/acompanamiento-alquiler` (hero, qué incluye, qué no incluye, cómo funciona, FAQ, CTA final, footer). No reescribir la estructura, solo el contenido variable descrito abajo.
- **Meta title:** `Acompañamiento de alquiler en [Ciudad/Zona] — 189 € IVA incl. | Livendia` (ajustar si supera 60 caracteres).
- **Meta description:** única por página, debe incluir el precio, el organismo de fianza correcto y la palabra clave local. No reutilizar la misma descripción en dos páginas.
- **Canonical:** self-referencing, cada página apunta a su propia URL.
- **Schema:** `Service` + `FAQPage` + `LocalBusiness` con `areaServed` ajustado a la ciudad/barrio correspondiente.
- **Breadcrumbs:** Inicio > Servicios > Acompañamiento de alquiler > [Ciudad/Zona].
- **Internal linking:** cada página enlaza a la página "hub" (`/servicios/acompanamiento-alquiler`) y a la página de administración de alquiler de esa misma ciudad si existe.
- **Imágenes:** alt text localizado (no genérico), idealmente foto/ilustración distinta por página si el banco de imágenes lo permite.
- **Regla anti-duplicado (importante):** el bloque "Qué incluye" y "Cómo funciona" pueden mantenerse casi iguales (son el servicio en sí, no cambia por ciudad). Lo que **debe ser único en cada página** es:
  1. El bloque legal/regulatorio de fianza y normativa local (ver abajo, ya redactado con datos verificados).
  2. Al menos 2 preguntas del FAQ específicas de esa ciudad/zona.
  3. Testimonio(s) con nombre + esa ciudad/barrio.
  4. Un párrafo de contexto de mercado local (rango de precios, tipo de vivienda predominante) — **pedir estos datos reales a Daniel antes de publicar**, no inventar cifras.

---

## 1. Barcelona — Les Corts

**H1:** Acompañamiento de alquiler en Les Corts, Barcelona

**Bloque legal único (insertar en la página, sección "Normativa y tranquilidad"):**

> En Barcelona la fianza del alquiler no se queda en manos del propietario: debe depositarse en el **INCASÒL** (Institut Català del Sòl), el organismo de la Generalitat que gestiona las fianzas de alquiler en toda Cataluña, en un plazo máximo de dos meses desde la firma del contrato. Además, Barcelona está declarada **zona de mercado residencial tensionado** desde marzo de 2024 (vigente hasta marzo de 2027), lo que significa que los contratos nuevos tienen un tope de renta vinculado al contrato anterior o al índice de referencia, y el anuncio y el contrato deben informar obligatoriamente de la renta previa. Nuestro gestor revisa que tu contrato en Les Corts cumpla con estos límites antes de que firmes.

**FAQ adicionales (mínimo 2):**
- ¿Les Corts está en zona tensionada? → Sí, todo el municipio de Barcelona lo está; explicar qué implica para el precio del nuevo contrato.
- ¿Dónde se deposita la fianza en Barcelona? → INCASÒL, no AVS ni Hacienda.

**Contexto de mercado a rellenar (pedir dato real, no inventar):** rango de renta media en Les Corts, tipo de vivienda predominante (familiar, cercanía Camp Nou/Diagonal), perfil de inquilino habitual.

**Nota de oportunidad:** la oficina de Livendia está en Les Corts (Carrer de Mejía Lequerica, 44). Se puede mencionar de forma natural ("nuestro equipo trabaja desde Les Corts") para reforzar señal de proximidad local sin sonar forzado.

---

## 2. L'Hospitalet de Llobregat

**H1:** Acompañamiento de alquiler en L'Hospitalet de Llobregat

**Bloque legal único:**

> Al igual que en Barcelona capital, en L'Hospitalet de Llobregat la fianza del alquiler se deposita en el **INCASÒL**, con un plazo máximo de dos meses desde la firma del contrato. L'Hospitalet forma parte de los 302 municipios catalanes declarados **zona de mercado residencial tensionado**, por lo que los contratos nuevos también están sujetos a tope de renta y a la obligación de informar de la renta del contrato anterior. Nuestro gestor comprueba estos límites antes de que cierres el contrato.

**FAQ adicionales:**
- ¿L'Hospitalet tiene zona tensionada igual que Barcelona? → Sí, está incluido en el listado ampliado de municipios catalanes.
- ¿Es el mismo trámite de fianza que en Barcelona? → Sí, mismo organismo (INCASÒL), mismo plazo.

**Contexto de mercado a rellenar:** rango de renta media, diferencia de precio respecto a Barcelona capital (suele ser un argumento de venta: alternativa más económica bien conectada).

---

## 3. Madrid

**H1:** Acompañamiento de alquiler en Madrid

**Bloque legal único:**

> En la Comunidad de Madrid la fianza del alquiler se deposita en la **Agencia de Vivienda Social (AVS)**. A diferencia de Barcelona, Madrid **no está declarada zona de mercado residencial tensionado**, por lo que no existe tope legal de renta en los contratos nuevos — el precio se fija libremente entre las partes. Aun así, nuestro gestor revisa que el resto de cláusulas (duración, actualización de renta, gastos) cumplan con la LAU.

**FAQ adicionales:**
- ¿Hay zona tensionada en Madrid? → No, a fecha de hoy no está declarada; el propietario puede fijar el precio libremente, aunque conviene revisar otras cláusulas.
- ¿Dónde se deposita la fianza en Madrid? → AVS, a través del trámite correspondiente.

**Contexto de mercado a rellenar:** rango de renta media por distrito relevante, tipo de contrato más habitual (LAU vs. temporada).

---

## 4. Valencia

**H1:** Acompañamiento de alquiler en Valencia

**Bloque legal único:**

> En la Comunidad Valenciana la fianza se deposita a través de los registros de la Dirección Territorial de Hacienda (en la ciudad de Valencia, en el Registro General de la Consellería de Hacienda), en un plazo de **15 días hábiles** desde la firma del contrato — bastante más corto que en Cataluña o Madrid, por lo que conviene no dejarlo pasar. Valencia, igual que Madrid, **no está declarada zona de mercado residencial tensionado** a día de hoy, así que no hay tope legal de renta en los contratos nuevos.

**FAQ adicionales:**
- ¿Cuánto tiempo tiene el propietario para depositar la fianza en Valencia? → 15 días hábiles, plazo más corto que en otras comunidades.
- ¿Hay zona tensionada en Valencia? → No, a día de hoy no está declarada.

**Contexto de mercado a rellenar:** rango de renta media, zonas de mayor demanda (ej. Ruzafa, Ciutat Vella).

---

## Checklist final antes de publicar cada página
- [ ] Meta title y description únicos (no copiar/pegar entre páginas)
- [ ] Bloque legal correcto según la tabla de arriba
- [ ] Mínimo 2 FAQ específicas de la ciudad/zona
- [ ] Testimonio local (nombre + ciudad/barrio)
- [ ] Datos de mercado reales (confirmar con Daniel, no usar cifras de ejemplo)
- [ ] Schema Service + FAQPage + LocalBusiness actualizado
- [ ] Canonical self-referencing
- [ ] Enlace a la página hub `/servicios/acompanamiento-alquiler` y a administración de alquiler de la misma ciudad si existe
