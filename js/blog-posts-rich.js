/** Contenido ampliado para artículos del blog NuevaHabitat (merge sobre NH_BLOG_POSTS) */
(function () {
  const PATCHES = {
    'precio-pisos-barcelona': {
      readMin: 12,
      faq: [
        { q: '¿Cuánto vale un piso de 80 m² en Eixample en 2026?', a: 'En Eixample Derecho o Esquerra, un piso de 80 m² reformado suele cotizar entre 440.000 y 560.000 € (5.500–7.000 €/m²). Sin reforma o en planta baja, el rango baja a 400.000–480.000 €. La valoración exacta depende de orientación, ITE de la finca y comparables cerrados en los últimos seis meses.' },
        { q: '¿Qué barrios de Barcelona tienen el precio por m² más bajo?', a: 'Nou Barris, parte de Sant Andreu y tramos de L\'Hospitalet concentran los precios más accesibles del área metropolitana, con medias de 2.800–3.500 €/m² en vivienda usada. Badalona y Santa Coloma ofrecen alternativas similares con buena conexión en transporte público.' },
        { q: '¿Los precios de Idealista reflejan el valor real de venta?', a: 'No del todo. Los anuncios suelen estar inflados un 5–12% respecto al precio de cierre. Para fijar un precio de salida realista hay que cruzar datos de operaciones registradas, visitas recibidas y estado real del inmueble, no solo el precio publicado en portales.' },
        { q: '¿La ITE afecta al precio de venta de un piso en Barcelona?', a: 'Sí. Si el edificio tiene ITE desfavorable o pendiente de obras, el comprador puede exigir descuento o condicionar la operación. En edificios pre-1960 de Ciutat Vella o el Gòtic, la situación de la finca pesa tanto como la reforma interior del piso.' },
        { q: '¿Cómo puedo saber cuánto vale mi piso sin compromiso?', a: 'NuevaHabitat ofrece valoración gratuita con visita presencial en Barcelona y área metropolitana. El informe incluye rango de precio, tiempo estimado de venta y comparables del barrio. Solicítala en /vender sin coste ni exclusiva.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Barcelona sube de media un 8% interanual en 2026, pero la dispersión entre distritos supera los 2.000 €/m².</li>
          <li>Eixample y Sarrià-Sant Gervasi lideran con 5.500–7.000 €/m²; Nou Barris y Sant Andreu ofrecen rangos de 3.200–4.000 €/m².</li>
          <li>El precio final depende de planta, orientación, ITE, certificado energético y operaciones cerradas, no solo de anuncios.</li>
          <li>Una valoración profesional evita meses de sobreprecio o pérdidas por vender por debajo del mercado.</li>
          <li>NuevaHabitat realiza valoraciones gratuitas con datos de micro-mercado por barrio.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#panorama-2026">Panorama del mercado en 2026</a></li>
          <li><a href="#precios-distritos">Precios por distritos y barrios</a></li>
          <li><a href="#factores-valor">Factores que mueven el precio</a></li>
          <li><a href="#area-metropolitana">Área metropolitana: alternativas</a></li>
          <li><a href="#tabla-precios">Tabla orientativa de precios</a></li>
          <li><a href="#valoracion-real">Cómo calcular el valor real</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>El mercado residencial de Barcelona en 2026 no se explica con una cifra única. La subida media del 8% interanual oculta realidades muy distintas: un piso reformado en el Eixample Derecho no compite con un tercer sin ascensor en Nou Barris, aunque ambos estén dentro del mismo municipio. Para vendedores y compradores, entender esa micro-geografía es la diferencia entre cerrar en semanas o arrastrar un anuncio durante meses.</p>
      <h2 id="panorama-2026">Panorama del mercado en 2026</h2>
      <p>El primer semestre de 2026 confirma un mercado activo pero más selectivo que en 2024. La demanda se concentra en viviendas reformadas o actualizables, bien comunicadas y con certificado energético favorable (clase C o superior). Los compradores con hipoteca preaprobada negocian con más fuerza; los que llegan sin financiación clara encuentran menos margen. En distritos prime como Les Corts, Gràcia y Poblenou, el stock de calidad es limitado y los tiempos de venta se acortan cuando el precio de salida es realista desde el primer día.</p>
      <p>La oferta de obra nueva sigue siendo escasa en el centro urbano, lo que sostiene la presión al alza en Eixample y el 22@. En cambio, en L'Hospitalet, Badalona y Sant Andreu hay más rotación y mayor margen de negociación, especialmente en pisos que necesitan actualización.</p>
      <h2 id="precios-distritos">Precios por distritos y barrios</h2>
      <p><strong>Eixample</strong> (Dreta, Esquerra, Sagrada Família): entre 5.000 y 7.000 €/m² en pisos reformados de 70–90 m². La orientación y la altura de planta pueden mover el precio final más de 50.000 € en una misma finca.</p>
      <p><strong>Sarrià-Sant Gervasi</strong>: el tramo más caro de la ciudad, con medias de 6.000–7.500 €/m². Familias y expatriados buscan colegios, espacio y calidad constructiva.</p>
      <p><strong>Gràcia</strong> y <strong>Poblenou</strong>: rangos de 4.200–5.500 €/m² según calle y estado. Poblenou gana tracción por la proximidad al 22@ y la mejora del entorno.</p>
      <p><strong>Les Corts</strong> (Numància, Zona Universitaria, entorno Camp Nou): 4.200–5.800 €/m². Demanda estable de familias y profesionales vinculados al sector sanitario y universitario. Si tu vivienda está en este distrito, consulta la guía específica en <a href="/vender-les-corts">vender piso en Les Corts</a>.</p>
      <p><strong>Nou Barris</strong> y tramos de <strong>Sant Andreu</strong>: 3.200–4.000 €/m². Mayor oferta, más negociación y compradores sensibles al precio por metro cuadrado.</p>
      <h2 id="factores-valor">Factores que mueven el precio más allá del barrio</h2>
      <p>Dos pisos en la misma calle pueden diferir un 20% en valor. Los elementos que más pesan en Barcelona son: orientación (exterior vs patio de manzana), planta (bajos y áticos tienen reglas propias), estado de la finca (ITE favorable o no), certificado energético, reforma integral vs parcial, cargas hipotecarias visibles en la nota simple y situación de la comunidad (derramas, obras pendientes).</p>
      <p>En edificios anteriores a 1960 — frecuentes en Ciutat Vella — la ITE y las posibles intervenciones en fachada o instalaciones comunes condicionan tanto el precio como el perfil de comprador. Ocultar esta información solo retrasa la operación hasta la due diligence previa a arras.</p>
      <h2 id="area-metropolitana">Área metropolitana: Sant Cugat, L'Hospitalet y Badalona</h2>
      <p>Quienes buscan más metros por euro miran fuera del perímetro urbano estricto. <strong>Sant Cugat del Vallès</strong> cotiza entre 4.500 y 6.000 €/m² con fuerte demanda familiar. <strong>L'Hospitalet</strong> concentra stock accesible (2.800–3.800 €/m²) con metro directo a Barcelona. <strong>Badalona</strong> y el litoral norte ofrecen alternativas similares para primeras viviendas. La clave es calcular el coste total: precio de compra más ITP Cataluña (10–11%), gastos de notaría y tiempo de desplazamiento diario.</p>
      <h2 id="tabla-precios">Tabla orientativa de precios por zona (2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Zona</th><th>€/m² (vivienda usada)</th><th>Perfil de demanda</th></tr></thead>
        <tbody>
          <tr><td>Eixample / Sarrià</td><td>5.500 – 7.500</td><td>Reformado, familias, inversión prime</td></tr>
          <tr><td>Gràcia / Poblenou / Les Corts</td><td>4.200 – 5.800</td><td>Profesionales, familias, 22@</td></tr>
          <tr><td>Sant Andreu / Horta</td><td>3.800 – 4.500</td><td>Primera vivienda, inversión moderada</td></tr>
          <tr><td>Nou Barris</td><td>3.200 – 4.000</td><td>Compradores sensibles al precio</td></tr>
          <tr><td>L'Hospitalet / Badalona</td><td>2.800 – 3.800</td><td>Área metropolitana, metro cercano</td></tr>
          <tr><td>Sant Cugat</td><td>4.500 – 6.000</td><td>Familias, colegios, calidad de vida</td></tr>
        </tbody>
      </table>
      <h2 id="valoracion-real">Cómo calcular el valor real de tu vivienda</h2>
      <p>Los estimadores online sirven como primera aproximación, pero no contemplan el estado de tu edificio, las operaciones cerradas en tu portal ni la demanda actual de compradores filtrados. Una valoración profesional combina comparables reales (no solo anuncios activos), visita presencial y conocimiento del micro-mercado.</p>
      <p>En NuevaHabitat la valoración es gratuita y sin compromiso. Si decides vender, el servicio cuesta <strong>3.000 € + IVA</strong>, cobrados únicamente en escritura. Incluye reportaje fotográfico, publicación, filtrado de compradores y negociación. <a href="/vender">Solicita tu valoración</a> o explora <a href="/inmuebles">inmuebles de referencia</a> en tu zona.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto vale un piso de 80 m² en Eixample en 2026?</summary><p>En Eixample Derecho o Esquerra, un piso de 80 m² reformado suele cotizar entre 440.000 y 560.000 € (5.500–7.000 €/m²). Sin reforma o en planta baja, el rango baja a 400.000–480.000 €. La valoración exacta depende de orientación, ITE de la finca y comparables cerrados en los últimos seis meses.</p></details>
        <details class="blog-faq-item"><summary>¿Qué barrios de Barcelona tienen el precio por m² más bajo?</summary><p>Nou Barris, parte de Sant Andreu y tramos de L'Hospitalet concentran los precios más accesibles del área metropolitana, con medias de 2.800–3.500 €/m² en vivienda usada. Badalona y Santa Coloma ofrecen alternativas similares con buena conexión en transporte público.</p></details>
        <details class="blog-faq-item"><summary>¿Los precios de Idealista reflejan el valor real de venta?</summary><p>No del todo. Los anuncios suelen estar inflados un 5–12% respecto al precio de cierre. Para fijar un precio de salida realista hay que cruzar datos de operaciones registradas, visitas recibidas y estado real del inmueble, no solo el precio publicado en portales.</p></details>
        <details class="blog-faq-item"><summary>¿La ITE afecta al precio de venta de un piso en Barcelona?</summary><p>Sí. Si el edificio tiene ITE desfavorable o pendiente de obras, el comprador puede exigir descuento o condicionar la operación. En edificios pre-1960 de Ciutat Vella o el Gòtic, la situación de la finca pesa tanto como la reforma interior del piso.</p></details>
        <details class="blog-faq-item"><summary>¿Cómo puedo saber cuánto vale mi piso sin compromiso?</summary><p>NuevaHabitat ofrece valoración gratuita con visita presencial en Barcelona y área metropolitana. El informe incluye rango de precio, tiempo estimado de venta y comparables del barrio. Solicítala en /vender sin coste ni exclusiva.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres saber cuánto vale tu piso en Barcelona con datos reales de mercado?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Agentes inmobiliarios especializados en Barcelona y área metropolitana desde 2026. Analizamos operaciones por distrito — Eixample, Gràcia, Les Corts, Poblenou, Sarrià — para ofrecer valoraciones y estrategias de venta basadas en datos, no en suposiciones.</p>
        </div>
      </aside>
      `,
    },
    'contrato-arras': {
      readMin: 10,
      faq: [
        { q: '¿Cuánto suelen pedir de arras en Barcelona?', a: 'Lo habitual es entre el 5% y el 10% del precio de compraventa. En un piso de 400.000 €, las arras suelen oscilar entre 20.000 y 40.000 €. El importe exacto se negocia y debe quedar reflejado en el contrato con el tipo de arras elegido.' },
        { q: '¿Qué diferencia hay entre arras penitenciales y penales?', a: 'Las penitenciales permiten desistir: el comprador pierde las arras y el vendedor las devuelve duplicadas si él incumple. Las penales fijan una indemnización concreta por incumplimiento, sin derecho unilateral a desistir. En operaciones de alto valor en Barcelona se usan más las penitenciales.' },
        { q: '¿Puedo incluir condición suspensiva de hipoteca en las arras?', a: 'Sí, y es muy recomendable si financias la compra. La cláusula debe especificar plazo para obtener la aprobación bancaria, documentación necesaria y qué ocurre con las arras si la hipoteca se deniega. Sin esta cláusula, pierdes las arras si el banco no financia.' },
        { q: '¿Cuánto tiempo suele pasar entre arras y escritura en Cataluña?', a: 'Entre 30 y 90 días es lo habitual. Operaciones con herencia, ITE pendiente o cancelación de hipoteca pueden alargarse a 120 días. El plazo debe ser realista y constar expresamente en el contrato para evitar disputas.' },
        { q: '¿Necesito abogado para firmar un contrato de arras?', a: 'No es obligatorio, pero en Barcelona recomendamos revisión profesional cuando hay condiciones suspensivas, cargas, usufructo o varios compradores. NuevaHabitat revisa la documentación previa y coordina la firma para proteger a ambas partes.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Las arras convierten una oferta aceptada en compromiso con consecuencias jurídicas.</li>
          <li>Existen tres tipos: penitenciales, confirmatorias y penales; el más habitual en Barcelona son las penitenciales.</li>
          <li>El importe suele ser del 5–10% del precio; págalo siempre por transferencia trazable.</li>
          <li>Incluye condiciones suspensivas de hipoteca, ITE o licencias si aplican.</li>
          <li>El plazo hasta escritura debe ser realista: 30–90 días en operaciones estándar.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#que-son-arras">Qué son las arras y cuándo se firman</a></li>
          <li><a href="#tipos-arras">Tipos de contrato de arras</a></li>
          <li><a href="#clausulas-clave">Cláusulas que no pueden faltar</a></li>
          <li><a href="#incumplimiento">Qué pasa si alguien incumple</a></li>
          <li><a href="#checklist-arras">Checklist antes de firmar</a></li>
          <li><a href="#barcelona-practica">Práctica habitual en Barcelona</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>En una compraventa de vivienda en Barcelona, el contrato de arras es el punto de inflexión: hasta ese momento, tanto comprador como vendedor pueden retirarse sin coste significativo. Después de firmarlo, la operación adquiere peso legal y económico. Comprender los tipos de arras, las cláusulas imprescindibles y las consecuencias del incumplimiento evita pérdidas que en el mercado barcelonés pueden superar fácilmente los 30.000 €.</p>
      <h2 id="que-son-arras">Qué son las arras y cuándo se firman</h2>
      <p>Las arras son un contrato privado — anterior a la escritura pública — mediante el cual comprador y vendedor se comprometen a formalizar la compraventa en un plazo determinado. En Cataluña es habitual firmarlo entre 2 y 4 semanas después de aceptar la oferta, una vez verificada la documentación básica: nota simple, certificado energético, situación de la comunidad e ITE si el edificio lo exige.</p>
      <p>El comprador entrega una cantidad en concepto de señal (normalmente 5–10% del precio). Ese pago no es un simple depósito: su tratamiento jurídico depende del tipo de arras pactado en el contrato.</p>
      <h2 id="tipos-arras">Tipos de contrato de arras</h2>
      <p><strong>Arras penitenciales</strong> (art. 1454 CC): cualquiera de las partes puede desistir. Si lo hace el comprador, pierde las arras entregadas. Si lo hace el vendedor, debe devolver el doble. Es el modelo más frecuente en operaciones de piso en Eixample, Gràcia o L'Hospitalet.</p>
      <p><strong>Arras confirmatorias</strong>: refuerzan el compromiso de comprar y vender, pero no otorgan derecho unilateral de desistir con pérdida o devolución duplicada. El incumplimiento abre la vía de exigir el cumplimiento o indemnización por daños.</p>
      <p><strong>Arras penales</strong>: fijan una cantidad determinada como indemnización por incumplimiento. Se usan menos en vivienda habitual, pero pueden aparecer en operaciones comerciales o de inversión.</p>
      <h2 id="clausulas-clave">Cláusulas que no pueden faltar</h2>
      <p>Identificación completa de las partes y del inmueble (referencia catastral, registro). Precio total, importe de arras y forma de pago. Fecha límite para la escritura pública. Descripción del estado del piso y de los muebles incluidos, si los hay. Condiciones suspensivas: aprobación de hipoteca (con plazo y consecuencias), licencias, informes técnicos favorables o cancelación de cargas previas.</p>
      <p>En Barcelona, donde muchos edificios tienen ITE pendiente o derrama en comunidad, conviene reflejar quién asume qué coste si aparece un problema entre arras y escritura. También debe indicarse quién paga la plusvalía municipal, los gastos de notaría y el ITP (10–11% en Cataluña, a cargo del comprador en vivienda usada).</p>
      <h2 id="incumplimiento">Qué pasa si alguien incumple</h2>
      <p>Con arras penitenciales, el desistimiento tiene un coste claro: pierdes las arras o las devuelves duplicadas. Si una parte incumple sin derecho a desistir (por ejemplo, el vendedor vende a un tercero), la otra puede exigir cumplimiento forzoso o indemnización por daños y perjuicios, además de las arras.</p>
      <p>Los conflictos más frecuentes en Barcelona surgen por plazos irreales, hipotecas denegadas sin cláusula suspensiva bien redactada o sorpresas documentales (cargas no declaradas, ITE desfavorable). Una due diligence previa reduce estos riesgos de forma drástica.</p>
      <h2 id="checklist-arras">Checklist antes de firmar</h2>
      <table class="blog-table">
        <thead><tr><th>Documento / aspecto</th><th>Comprador</th><th>Vendedor</th></tr></thead>
        <tbody>
          <tr><td>Nota simple actualizada</td><td>Verificar titularidad y cargas</td><td>Facilitar antes de arras</td></tr>
          <tr><td>Certificado energético</td><td>Comprobar validez</td><td>Obligatorio para vender</td></tr>
          <tr><td>ITE del edificio</td><td>Revisar si afecta al valor</td><td>Informar situación real</td></tr>
          <tr><td>Preaprobación hipoteca</td><td>Conseguir antes de comprometerse</td><td>—</td></tr>
          <tr><td>Condición suspensiva hipoteca</td><td>Incluir en contrato</td><td>Aceptar plazo razonable</td></tr>
          <tr><td>Importe y tipo de arras</td><td>Transferencia trazable</td><td>Recibo detallado</td></tr>
        </tbody>
      </table>
      <h2 id="barcelona-practica">Práctica habitual en Barcelona</h2>
      <p>En operaciones de 300.000–500.000 € — habituales en distritos como Les Corts, Poblenou o Sant Andreu — las arras suelen situarse en 25.000–40.000 €. Compradores con financiación incluyen casi siempre cláusula suspensiva de hipoteca a 30–45 días. Vendedores que aún tienen hipoteca pendiente deben coordinar la cancelación registral antes o simultáneamente a la escritura.</p>
      <p>En NuevaHabitat acompañamos a compradores y vendedores en todo el proceso: revisión documental, redacción de condiciones y coordinación hasta la firma en notaría. Servicio de compra desde <strong>5.000 € + IVA</strong>; venta desde <strong>3.000 € + IVA</strong>, cobrados solo en escritura. <a href="/comprar">Comprar con asesoramiento</a> · <a href="/vender">Vender con precio fijo</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto suelen pedir de arras en Barcelona?</summary><p>Lo habitual es entre el 5% y el 10% del precio de compraventa. En un piso de 400.000 €, las arras suelen oscilar entre 20.000 y 40.000 €. El importe exacto se negocia y debe quedar reflejado en el contrato con el tipo de arras elegido.</p></details>
        <details class="blog-faq-item"><summary>¿Qué diferencia hay entre arras penitenciales y penales?</summary><p>Las penitenciales permiten desistir: el comprador pierde las arras y el vendedor las devuelve duplicadas si él incumple. Las penales fijan una indemnización concreta por incumplimiento, sin derecho unilateral a desistir. En operaciones de alto valor en Barcelona se usan más las penitenciales.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo incluir condición suspensiva de hipoteca en las arras?</summary><p>Sí, y es muy recomendable si financias la compra. La cláusula debe especificar plazo para obtener la aprobación bancaria, documentación necesaria y qué ocurre con las arras si la hipoteca se deniega. Sin esta cláusula, pierdes las arras si el banco no financia.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto tiempo suele pasar entre arras y escritura en Cataluña?</summary><p>Entre 30 y 90 días es lo habitual. Operaciones con herencia, ITE pendiente o cancelación de hipoteca pueden alargarse a 120 días. El plazo debe ser realista y constar expresamente en el contrato para evitar disputas.</p></details>
        <details class="blog-faq-item"><summary>¿Necesito abogado para firmar un contrato de arras?</summary><p>No es obligatorio, pero en Barcelona recomendamos revisión profesional cuando hay condiciones suspensivas, cargas, usufructo o varios compradores. NuevaHabitat revisa la documentación previa y coordina la firma para proteger a ambas partes.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Vas a firmar arras pronto? Revisamos tu contrato y documentación antes de comprometerte.</p>
        <a href="/contacto" class="btn">Consulta gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Especialistas en compraventa en Barcelona desde 2026. Hemos coordinado operaciones en Eixample, Gràcia, Les Corts y área metropolitana, gestionando arras, due diligence y escritura con transparencia total.</p>
        </div>
      </aside>
      `,
    },
    'guia-hipotecas': {
      readMin: 12,
      faq: [
        { q: '¿Qué hipoteca conviene más en 2026: fija, variable o mixta?', a: 'Depende de tu perfil de riesgo. Si priorizas certeza de cuota, la fija encaja mejor con tipos del 2,8–3,5% TIN. Si toleras variación y el euríbor se mantiene estable, la variable puede ser más barata. La mixta equilibra: fija 5–10 años y variable después.' },
        { q: '¿Cuánto puedo pedir prestado para comprar en Barcelona?', a: 'Los bancos financian hasta el 80% del valor de tasación. Con ingresos netos de 3.000 €/mes, la cuota máxima ronda 1.000 €, permitiendo hipotecas de 180.000–220.000 € según plazo. Necesitas ahorro para el 20% restante, ITP Cataluña (10–11%) y gastos de compraventa.' },
        { q: '¿Qué diferencia hay entre TIN y TAE en una hipoteca?', a: 'El TIN es el tipo de interés nominal; la TAE incluye comisiones, seguros vinculados y gastos, reflejando el coste real anual. Dos hipotecas con el mismo TIN pueden tener TAE muy distinta. Compara siempre TAE antes de firmar.' },
        { q: '¿Puedo cambiar de hipoteca variable a fija en 2026?', a: 'Sí, mediante subrogación o novación. Evalúa comisiones de cancelación o modificación y compara el ahorro real. Muchos bancos ofrecen productos de conversión si prevés subidas del euríbor.' },
        { q: '¿NuevaHabitat ayuda a conseguir hipoteca al comprar?', a: 'Sí. La asesoría hipotecaria está incluida en el servicio de compra por 5.000 € + IVA, cobrado solo en escritura. Comparamos ofertas de varios bancos y gestionamos la preaprobación antes de hacer ofertas.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>En 2026 el euríbor se estabiliza en torno al 2,5–3%; fija, variable y mixta compiten en condiciones similares.</li>
          <li>Compara TAE, no solo TIN: comisiones y vinculaciones pueden añadir miles de euros al coste total.</li>
          <li>El banco financia hasta el 80% de tasación; necesitas ahorro para entrada, ITP Cataluña (10–11%) y gastos.</li>
          <li>Consigue preaprobación antes de visitar pisos en Eixample, Gràcia o el área metropolitana.</li>
          <li>NuevaHabitat negocia con varios bancos como parte del servicio de compra (5.000 € + IVA, solo en escritura).</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#contexto-2026">Contexto hipotecario en 2026</a></li>
          <li><a href="#tipos-hipoteca">Fija, variable y mixta</a></li>
          <li><a href="#capacidad-financiera">Capacidad de endeudamiento</a></li>
          <li><a href="#comparar-ofertas">Cómo comparar ofertas bancarias</a></li>
          <li><a href="#tabla-tipos">Tabla orientativa de tipos</a></li>
          <li><a href="#barcelona-practica">Práctica en Barcelona</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Elegir hipoteca en 2026 ya no es elegir entre extremos: el euríbor estabilizado y la competencia bancaria han acortado la brecha entre fija y variable. Pero en Barcelona — donde un piso de 75 m² supera los 350.000 € en Eixample o Les Corts — una decisión mal tomada puede costarte decenas de miles de euros en 25 años. Esta guía te ayuda a decidir con criterios claros y datos reales del mercado catalán.</p>
      <h2 id="contexto-2026">Contexto hipotecario en 2026</h2>
      <p>Tras la volatilidad de 2023–2024, el euríbor a 12 meses se sitúa en torno al 2,5–3% en el primer semestre de 2026. El BCE mantiene un tono cauteloso: posibles recortes graduales si la inflación sigue moderándose, pero sin volver a tipos negativos. Para compradores en Barcelona, esto significa cuotas más predecibles que hace dos años, pero notablemente superiores a los mínimos históricos de 2020–2021.</p>
      <p>En vivienda usada — la mayoría del stock en la ciudad — recuerda que además de la hipoteca pagarás ITP en Cataluña (10–11% según tramo), notaría, registro y gestoría. Un piso de 400.000 € implica unos 40.000–44.000 € solo en impuesto de transmisiones, más 1.500–2.000 € en gastos de formalización. Tu ahorro debe cubrir todo eso además del 20% no financiado.</p>
      <h2 id="tipos-hipoteca">Fija, variable y mixta: cuándo elegir cada una</h2>
      <p><strong>Hipoteca fija</strong>: cuota constante durante todo el plazo. Ideal si tu margen de ingresos es ajustado o si vienes de alquilar en Sarrià o Gràcia y no quieres sorpresas. En 2026, tipos fijos a 25 años rondan el 2,8–3,5% TIN según perfil y vinculaciones.</p>
      <p><strong>Hipoteca variable</strong>: revisión periódica según euríbor más diferencial. Puede ser más barata si el euríbor se mantiene bajo, pero expone a subidas futuras. Compradores jóvenes con capacidad de ahorro a veces la prefieren en L'Hospitalet o Badalona, donde el precio de entrada es menor.</p>
      <p><strong>Hipoteca mixta</strong>: tipo fijo los primeros 5–10 años y variable después. Muy popular entre parejas que compran en Poblenou o Sant Andreu y esperan mejorar ingresos en la fase variable.</p>
      <h2 id="capacidad-financiera">Capacidad de endeudamiento y ahorro necesario</h2>
      <p>Los bancos aplican dos filtros: que la cuota no supere el 30–35% de tus ingresos netos y que la financiación no exceda el 80% de la tasación. Si tasas un piso en 420.000 € pero el banco lo valora en 400.000 €, solo financiará 320.000 €. La diferencia sale de tu bolsillo. Pide un estudio de viabilidad antes de buscar inmuebles.</p>
      <p>Revisa la nota simple del inmueble: cargas, usufructos o problemas registrales pueden reducir la financiación. En edificios con ITE desfavorable o certificado energético bajo, la tasación suele ser conservadora, especialmente en Ciutat Vella y el Eixample antiguo.</p>
      <h2 id="comparar-ofertas">Cómo comparar ofertas bancarias</h2>
      <p>Compara al menos tres entidades en: TIN y TAE, comisión de apertura, vinculación de seguros, periodo de carencia y penalización por amortización anticipada. Una diferencia de 0,3 puntos sobre 300.000 € a 25 años supone más de 15.000 € de diferencia total. Exige simulación por escrito con cuota mensual y coste total.</p>
      <p>Si el banco condiciona el tipo a domiciliar nómina o contratar seguros, calcula el coste real de esas vinculaciones frente a contratarlas por separado. No te quedes con la primera oferta de tu banco habitual.</p>
      <h2 id="tabla-tipos">Tabla orientativa de tipos en 2026</h2>
      <table class="blog-table">
        <thead><tr><th>Modalidad</th><th>TIN orientativo</th><th>TAE orientativa</th><th>Perfil recomendado</th></tr></thead>
        <tbody>
          <tr><td>Fija 25 años</td><td>2,8 – 3,5%</td><td>3,0 – 3,8%</td><td>Busca estabilidad, ingresos ajustados</td></tr>
          <tr><td>Variable (euríbor + 0,6–1,0)</td><td>2,5 – 3,2% inicial</td><td>3,1 – 3,9%</td><td>Tolera riesgo, horizonte largo</td></tr>
          <tr><td>Mixta 10 años fija + variable</td><td>2,9 – 3,4% fase fija</td><td>3,2 – 4,0%</td><td>Primera vivienda, ingresos en crecimiento</td></tr>
        </tbody>
      </table>
      <h2 id="barcelona-practica">Práctica en Barcelona y área metropolitana</h2>
      <p>En distritos prime (Eixample, Sarrià, Les Corts) los bancos son exigentes con la tasación. En Nou Barris, Sant Andreu, L'Hospitalet o Badalona la relación precio/tasación suele ser más favorable. Sant Cugat concentra demanda familiar con precios altos pero tasaciones generalmente alineadas con el mercado.</p>
      <p>En NuevaHabitat integramos la búsqueda de hipoteca en el servicio de compra: preaprobación, comparativa entre entidades y coordinación con arras y escritura. Todo por <strong>5.000 € + IVA</strong>, cobrado únicamente en escritura. <a href="/hipotecas">Calcula tu cuota</a> · <a href="/comprar">Activar búsqueda</a> · <a href="/inmuebles">Ver inmuebles</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Qué hipoteca conviene más en 2026: fija, variable o mixta?</summary><p>Depende de tu perfil de riesgo. Si priorizas certeza de cuota, la fija encaja mejor con tipos del 2,8–3,5% TIN. Si toleras variación y el euríbor se mantiene estable, la variable puede ser más barata. La mixta equilibra: fija 5–10 años y variable después.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto puedo pedir prestado para comprar en Barcelona?</summary><p>Los bancos financian hasta el 80% del valor de tasación. Con ingresos netos de 3.000 €/mes, la cuota máxima ronda 1.000 €, permitiendo hipotecas de 180.000–220.000 € según plazo. Necesitas ahorro para el 20% restante, ITP Cataluña (10–11%) y gastos de compraventa.</p></details>
        <details class="blog-faq-item"><summary>¿Qué diferencia hay entre TIN y TAE en una hipoteca?</summary><p>El TIN es el tipo de interés nominal; la TAE incluye comisiones, seguros vinculados y gastos, reflejando el coste real anual. Dos hipotecas con el mismo TIN pueden tener TAE muy distinta. Compara siempre TAE antes de firmar.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo cambiar de hipoteca variable a fija en 2026?</summary><p>Sí, mediante subrogación o novación. Evalúa comisiones de cancelación o modificación y compara el ahorro real. Muchos bancos ofrecen productos de conversión si prevés subidas del euríbor.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat ayuda a conseguir hipoteca al comprar?</summary><p>Sí. La asesoría hipotecaria está incluida en el servicio de compra por 5.000 € + IVA, cobrado solo en escritura. Comparamos ofertas de varios bancos y gestionamos la preaprobación antes de hacer ofertas.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Buscas la mejor hipoteca para comprar en Barcelona? Comparamos bancos por ti.</p>
        <a href="/hipotecas" class="btn">Asesoría hipotecaria</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Especialistas en financiación y compraventa en Barcelona desde 2026. Hemos negociado hipotecas para operaciones en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana, comparando siempre TAE real y no solo el tipo nominal.</p>
        </div>
      </aside>
      `,
    },
    'como-vender-rapido': {
      readMin: 10,
      faq: [
        { q: '¿Cuánto tarda de media vender un piso en Barcelona?', a: 'Un piso bien posicionado y con precio realista se vende en 45–75 días en 2026. Si el precio está inflado un 10% o más, el tiempo puede triplicarse. Distritos prime como Eixample o Sarrià cierran más rápido cuando el inmueble está reformado y documentado.' },
        { q: '¿Qué es lo primero que debo hacer para vender rápido?', a: 'Solicita una valoración profesional con comparables reales, no estimadores online. Fija un precio de salida alineado con operaciones cerradas en tu edificio y barrio. Es el factor que más impacta en el tiempo de venta.' },
        { q: '¿Merece la pena hacer home staging antes de vender?', a: 'Sí. Despersonalizar, pintar en tonos neutros y mejorar la luz puede reducir el tiempo de venta un 30–50% y mejorar ofertas un 5–10%. No hace falta reformar: presentar bien cuesta poco y rinde mucho en mercados competitivos como Gràcia o Poblenou.' },
        { q: '¿Debo aceptar todas las visitas que me pidan?', a: 'No. Filtra compradores con capacidad financiera verificada antes de abrir tu casa. Visitas sin perfil financiero consumen tiempo y generan falsas expectativas. Un agente profesional pre-califica antes de agendar.' },
        { q: '¿Cuánto cuesta vender con NuevaHabitat?', a: '3.000 € + IVA, cobrados únicamente en escritura. Incluye valoración, fotografía profesional, publicación, filtrado de compradores, visitas, negociación y acompañamiento legal. Sin exclusivas abusivas ni comisiones porcentuales.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>El precio correcto desde el día uno es la clave: un 10% de sobreprecio puede triplicar el tiempo de venta.</li>
          <li>Fotografía profesional, home staging básico y documentación transparente aceleran cierres en Eixample, Les Corts o Sant Andreu.</li>
          <li>Filtra compradores con financiación verificada antes de abrir tu piso a visitas.</li>
          <li>Disponibilidad amplia para visitas (incluidos fines de semana) multiplica las oportunidades de oferta.</li>
          <li>NuevaHabitat vende por 3.000 € + IVA, solo en escritura, con estrategia activa desde la valoración.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#precio-realista">Precio realista: el factor decisivo</a></li>
          <li><a href="#presentacion">Presentación y home staging</a></li>
          <li><a href="#compradores">Filtrar compradores cualificados</a></li>
          <li><a href="#documentacion">Documentación lista desde el inicio</a></li>
          <li><a href="#visitas-negociacion">Visitas y negociación</a></li>
          <li><a href="#tabla-tiempos">Tiempos de venta por distrito</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Vender un piso en Barcelona en menos de 60 días es posible, pero no con la estrategia por defecto: publicar a ojo en un portal y esperar. En 2026 el comprador está informado, compara decenas de anuncios y descarta en segundos lo que no encaja en precio, fotos o documentación. Estas siete claves — aplicadas en cada operación que gestionamos en Eixample, Nou Barris, L'Hospitalet y área metropolitana — marcan la diferencia entre cerrar en semanas o arrastrar un anuncio seis meses.</p>
      <h2 id="precio-realista">Precio realista: el factor decisivo</h2>
      <p>La valoración basada en comparables cerrados — no en anuncios activos de Idealista — es el primer paso. Un piso de 80 m² en Les Corts publicado a 450.000 € cuando el mercado cierra a 410.000–420.000 € recibirá visitas, pero no ofertas serias. Tras 90 días de exclusiva con una agencia tradicional, acabarás bajando el precio por debajo del valor inicial realista.</p>
      <p>En NuevaHabitat la valoración gratuita incluye rango de precio, tiempo estimado de venta y plan de acción. Si decides vender, el servicio cuesta <strong>3.000 € + IVA</strong>, cobrado solo en escritura. Sin porcentajes sobre el precio final.</p>
      <h2 id="presentacion">Presentación y home staging</h2>
      <p>La primera impresión se decide en tres segundos online. Reportaje fotográfico profesional, luz natural maximizada, espacios despersonalizados y superficies despejadas. Pintar paredes en blanco roto o gris claro, ordenar armarios y retirar muebles que estrechen estancias cuesta poco y rinde mucho en distritos competitivos como Gràcia o Poblenou.</p>
      <p>El certificado energético favorable (clase C o superior) también acelera: compradores con hipoteca preaprobada prefieren inmuebles sin sorpresas energéticas que impliquen reformas a corto plazo.</p>
      <h2 id="compradores">Filtrar compradores cualificados</h2>
      <p>Abrir tu piso a cualquiera genera visitas curiosas pero pocas ofertas. Antes de agendar, verifica capacidad financiera: preaprobación bancaria, carta de viabilidad o acreditación de fondos propios. En operaciones de 350.000–500.000 € — habituales en Sarrià o el Eixample — este filtro ahorra semanas de negociaciones que no llegan a arras.</p>
      <p>En NuevaHabitat pre-calificamos a cada comprador interesado. Solo agendamos visitas con perfil real de cierre.</p>
      <h2 id="documentacion">Documentación lista desde el inicio</h2>
      <p>Reúne antes de publicar: nota simple actualizada, certificado energético, ITE si aplica, certificado de comunidad al corriente, último IBI y contrato de alquiler si hay inquilino. Un comprador serio lo pedirá en la primera visita. Tenerlo listo transmite profesionalidad y evita retrasos entre oferta y arras.</p>
      <p>En edificios pre-1960 de Ciutat Vella o Sant Andreu, la situación de la ITE pesa especialmente. Informar desde el principio evita descuentos de última hora o compradores que se echan atrás tras la due diligence.</p>
      <h2 id="visitas-negociacion">Visitas y negociación profesional</h2>
      <p>Ofrece franjas amplias: tardes entre semana y sábados por la mañana. Cada visita cancelada por falta de disponibilidad es una oportunidad perdida. Durante la visita, destaca puntos fuertes (orientación, reforma, ubicación) sin ocultar defectos: la transparencia genera confianza y acelera la decisión.</p>
      <p>La negociación debe basarse en datos, no en emociones. Si recibes una oferta razonable (5–8% por debajo del precio de salida) con comprador financiado, valórala seriamente. Regatear por 5.000 € y perder tres semanas suele salir más caro que cerrar.</p>
      <h2 id="tabla-tiempos">Tiempos de venta orientativos por distrito (2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Distrito / zona</th><th>Tiempo medio (precio correcto)</th><th>Factor clave</th></tr></thead>
        <tbody>
          <tr><td>Eixample / Sarrià</td><td>45 – 60 días</td><td>Reforma, certificado energético, ITE favorable</td></tr>
          <tr><td>Gràcia / Poblenou / Les Corts</td><td>50 – 70 días</td><td>Presentación, precio alineado con comparables</td></tr>
          <tr><td>Sant Andreu / Horta</td><td>55 – 75 días</td><td>Relación calidad-precio, transporte</td></tr>
          <tr><td>Nou Barris / L'Hospitalet</td><td>60 – 90 días</td><td>Precio competitivo, financiación del comprador</td></tr>
          <tr><td>Badalona / Sant Cugat</td><td>50 – 80 días</td><td>Perfil comprador (familias vs inversión)</td></tr>
        </tbody>
      </table>
      <p><a href="/vender">Solicita valoración gratuita</a> · <a href="/vender-les-corts">Vender en Les Corts</a> · <a href="/inmuebles">Ver comparables en tu zona</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto tarda de media vender un piso en Barcelona?</summary><p>Un piso bien posicionado y con precio realista se vende en 45–75 días en 2026. Si el precio está inflado un 10% o más, el tiempo puede triplicarse. Distritos prime como Eixample o Sarrià cierran más rápido cuando el inmueble está reformado y documentado.</p></details>
        <details class="blog-faq-item"><summary>¿Qué es lo primero que debo hacer para vender rápido?</summary><p>Solicita una valoración profesional con comparables reales, no estimadores online. Fija un precio de salida alineado con operaciones cerradas en tu edificio y barrio. Es el factor que más impacta en el tiempo de venta.</p></details>
        <details class="blog-faq-item"><summary>¿Merece la pena hacer home staging antes de vender?</summary><p>Sí. Despersonalizar, pintar en tonos neutros y mejorar la luz puede reducir el tiempo de venta un 30–50% y mejorar ofertas un 5–10%. No hace falta reformar: presentar bien cuesta poco y rinde mucho en mercados competitivos como Gràcia o Poblenou.</p></details>
        <details class="blog-faq-item"><summary>¿Debo aceptar todas las visitas que me pidan?</summary><p>No. Filtra compradores con capacidad financiera verificada antes de abrir tu casa. Visitas sin perfil financiero consumen tiempo y generan falsas expectativas. Un agente profesional pre-califica antes de agendar.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta vender con NuevaHabitat?</summary><p>3.000 € + IVA, cobrados únicamente en escritura. Incluye valoración, fotografía profesional, publicación, filtrado de compradores, visitas, negociación y acompañamiento legal. Sin exclusivas abusivas ni comisiones porcentuales.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres vender tu piso en Barcelona en menos de 60 días?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Agentes inmobiliarios en Barcelona desde 2026. Hemos cerrado operaciones en Eixample, Gràcia, Les Corts, Poblenou, Nou Barris y área metropolitana aplicando estrategias de venta rápida con precio fijo transparente.</p>
        </div>
      </aside>
      `,
    },
    'home-staging': {
      readMin: 9,
      faq: [
        { q: '¿Qué es el home staging y en qué se diferencia de una reforma?', a: 'El home staging prepara la vivienda para la venta sin obras estructurales: despersonaliza, ordena, pinta y optimiza la luz. Una reforma cambia instalaciones o distribución. El staging cuesta una fracción y puede acelerar la venta un 30–50%.' },
        { q: '¿Cuánto cuesta el home staging en Barcelona?', a: 'Un staging básico (pintura, despersonalización, pequeños retoques) puede costar 500–2.000 €. Staging profesional con mobiliario temporal sube a 3.000–8.000 € según metros. En pisos de Eixample o Sarrià, el retorno suele superar la inversión.' },
        { q: '¿Puedo hacer home staging yo mismo?', a: 'Sí, para staging básico: retira objetos personales, ordena armarios, pinta en tonos neutros, maximiza luz natural y despeja superficies. Para pisos vacíos o de alto valor, un profesional aporta mobiliario y composición que marcan diferencia en fotos.' },
        { q: '¿El home staging funciona en pisos antiguos de Barcelona?', a: 'Especialmente. En edificios del Eixample o Gràcia con estancias irregulares, el staging enfatiza puntos fuertes (techos altos, balcones) y minimiza debilidades (cocinas pequeñas, patios internos). La presentación compensa limitaciones que no justifican reforma integral.' },
        { q: '¿NuevaHabitat incluye home staging en el servicio de venta?', a: 'Incluimos reportaje fotográfico profesional y orientación de staging básico. Te indicamos qué merece invertir y qué no antes de publicar. Servicio completo de venta: 3.000 € + IVA, solo en escritura.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>El home staging presenta tu vivienda para que el comprador se visualice viviendo en ella.</li>
          <li>Cambios simples — despersonalizar, pintar neutro, mejorar luz — pueden acelerar la venta un 30–50%.</li>
          <li>No es reformar: es optimizar lo que ya tienes con inversión mínima (500–2.000 € en staging básico).</li>
          <li>Las fotos profesionales amplifican el efecto del staging; juntos definen la primera impresión online.</li>
          <li>NuevaHabitat incluye fotografía y orientación de staging en el servicio de venta (3.000 € + IVA).</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#que-es-staging">Qué es y por qué funciona</a></li>
          <li><a href="#cambios-impacto">Cambios de mayor impacto</a></li>
          <li><a href="#estancia-estancia">Staging estancia por estancia</a></li>
          <li><a href="#barcelona-casos">Casos en Barcelona por tipo de piso</a></li>
          <li><a href="#tabla-inversion">Tabla de inversión vs retorno</a></li>
          <li><a href="#errores">Errores que restan valor</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>El home staging no consiste en reformar: consiste en presentar tu vivienda de forma que el comprador potencial se visualice viviendo en ella. En un mercado visual como Barcelona — donde la decisión de visitar se toma en tres segundos frente a una miniatura en el móvil — la presentación puede marcar la diferencia entre una oferta al precio de salida y meses de regateo. Estudios del sector estiman que un buen staging acelera la venta un 30–50% y mejora el precio final un 5–15%.</p>
      <h2 id="que-es-staging">Qué es el home staging y por qué funciona</h2>
      <p>El comprador no adquiere metros cuadrados: adquiere una sensación de hogar. Fotos familiares, muebles personalizados, colores intensos y el desorden cotidiano impiden esa proyección. El staging crea un escenario neutro pero acogedor donde cualquier perfil — pareja joven en Poblenou, familia en Les Corts, inversor en Eixample — puede imaginarse viviendo.</p>
      <p>Funciona porque reduce la fricción cognitiva: el comprador no tiene que "ver más allá" del caos o la personalidad del vendedor. Ve directamente el potencial del espacio.</p>
      <h2 id="cambios-impacto">Cambios de mayor impacto con mínima inversión</h2>
      <p><strong>Despersonalizar</strong>: retira fotos, trofeos, colecciones y objetos religiosos o políticos. <strong>Pintar</strong> en blanco roto, gris perla o beige claro; evita paredes de acento salvo que estén impecables. <strong>Maximizar luz</strong>: cortinas ligeras, bombillas cálidas homogéneas, espejos estratégicos en estancias oscuras típicas del Eixample interior.</p>
      <p><strong>Ordenar y despejar</strong>: vacía el 30% del contenido de armarios (se ven pequeños si están llenos), retira muebles que estrechen pasillos y libera encimeras de cocina y baño. <strong>Pequeños retoques</strong>: grifos modernos, tiradores de armario, lámparas de diseño sencillo. Nada de reforma integral: retorno decreciente rápido.</p>
      <h2 id="estancia-estancia">Staging estancia por estancia</h2>
      <p><strong>Salón</strong>: sofá como punto focal, mesa de centro despejada, una planta verde, mantas en tonos neutros. <strong>Cocina</strong>: encimera vacía salvo un electrodoméstico decorativo; toallas limpias colgadas. <strong>Dormitorio</strong>: cama bien hecha con ropa de cama hotelera, mesillas simétricas, armario ordenado con puertas semiabiertas. <strong>Baño</strong>: toallas blancas dobladas, jabón decorativo, ningún producto personal visible.</p>
      <p>En pisos con patio de manzana — frecuentes en Gràcia o Sant Antoni — limpia el balcón, coloca una silla y una maceta: exterior vende, aunque sea pequeño.</p>
      <h2 id="barcelona-casos">Casos en Barcelona por tipo de piso</h2>
      <p><strong>Piso señorial en Eixample</strong>: enfatiza techos altos, suelos hidráulicos y carpintería original. Staging clásico-contemporáneo, no minimalismo frío. <strong>Ático en Poblenou</strong>: terraza como protagonista; mobiliario exterior si hace falta. <strong>Piso pequeño en Nou Barris o L'Hospitalet</strong>: menos es más; multiplica sensación de espacio con espejos y colores claros.</p>
      <p><strong>Piso con ITE pendiente</strong>: no ocultes el estado de la finca, pero presenta el interior impecable. La transparencia sobre ITE y certificado energético genera confianza; el staging demuestra que el piso es habitable mientras se resuelven temas comunitarios.</p>
      <h2 id="tabla-inversion">Tabla de inversión vs retorno estimado</h2>
      <table class="blog-table">
        <thead><tr><th>Acción</th><th>Inversión orientativa</th><th>Impacto en venta</th></tr></thead>
        <tbody>
          <tr><td>Despersonalizar y ordenar</td><td>0 – 200 €</td><td>Alto: primera impresión inmediata</td></tr>
          <tr><td>Pintura paredes neutras (80 m²)</td><td>800 – 1.500 €</td><td>Alto: fotos y visitas</td></tr>
          <tr><td>Pequeños retoques (grifos, tiradores)</td><td>300 – 800 €</td><td>Medio: sensación de actualizado</td></tr>
          <tr><td>Staging profesional con mobiliario</td><td>3.000 – 8.000 €</td><td>Muy alto en pisos vacíos prime</td></tr>
          <tr><td>Reportaje fotográfico profesional</td><td>Incluido en NH</td><td>Crítico: define clics en portales</td></tr>
        </tbody>
      </table>
      <h2 id="errores">Errores que restan valor</h2>
      <p>Reformar la cocina entera semanas antes de vender (retorno incierto). Perfumes intensos o ambientadores (generan desconfianza). Fotos con móvil y poca luz. Ocultar defectos que saldrán en la visita. Muebles de más en estancias pequeñas. Personalizar el staging con un estilo demasiado marcado que no conecte con el comprador medio.</p>
      <p>En NuevaHabitat incluimos reportaje fotográfico y orientación de staging en el servicio de venta por <strong>3.000 € + IVA</strong>, cobrado solo en escritura. <a href="/vender">Solicita valoración gratuita</a> · <a href="/inmuebles">Ver ejemplos de presentación</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Qué es el home staging y en qué se diferencia de una reforma?</summary><p>El home staging prepara la vivienda para la venta sin obras estructurales: despersonaliza, ordena, pinta y optimiza la luz. Una reforma cambia instalaciones o distribución. El staging cuesta una fracción y puede acelerar la venta un 30–50%.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta el home staging en Barcelona?</summary><p>Un staging básico (pintura, despersonalización, pequeños retoques) puede costar 500–2.000 €. Staging profesional con mobiliario temporal sube a 3.000–8.000 € según metros. En pisos de Eixample o Sarrià, el retorno suele superar la inversión.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo hacer home staging yo mismo?</summary><p>Sí, para staging básico: retira objetos personales, ordena armarios, pinta en tonos neutros, maximiza luz natural y despeja superficies. Para pisos vacíos o de alto valor, un profesional aporta mobiliario y composición que marcan diferencia en fotos.</p></details>
        <details class="blog-faq-item"><summary>¿El home staging funciona en pisos antiguos de Barcelona?</summary><p>Especialmente. En edificios del Eixample o Gràcia con estancias irregulares, el staging enfatiza puntos fuertes (techos altos, balcones) y minimiza debilidades (cocinas pequeñas, patios internos). La presentación compensa limitaciones que no justifican reforma integral.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat incluye home staging en el servicio de venta?</summary><p>Incluimos reportaje fotográfico profesional y orientación de staging básico. Te indicamos qué merece invertir y qué no antes de publicar. Servicio completo de venta: 3.000 € + IVA, solo en escritura.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres presentar tu piso para venderlo más rápido y mejor?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Especialistas en venta en Barcelona desde 2026. Combinamos staging, fotografía profesional y estrategia de precio para operaciones en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'primera-vivienda': {
      readMin: 11,
      faq: [
        { q: '¿Cuánto dinero necesito ahorrado para comprar mi primera vivienda en Barcelona?', a: 'Como mínimo el 20% del precio de compra más un 12–15% adicional para ITP (10–11% en Cataluña), notaría, registro y gestoría. Para un piso de 300.000 € necesitas unos 96.000–105.000 € entre entrada y gastos. En L\'Hospitalet o Nou Barris el importe baja, pero la proporción se mantiene.' },
        { q: '¿Puedo comprar sin aportar el 20% de entrada?', a: 'En condiciones normales, no. Los bancos financian hasta el 80% de la tasación. Exceceniones puntuales (100% con avalistas o productos específicos) son raras y caras. Planifica el ahorro antes de buscar.' },
        { q: '¿Qué ayudas existen para primera vivienda en Cataluña en 2026?', a: 'Consulta convocatorias de la Generalitat y el ayuntamiento: bonificaciones ITP para jóvenes, avales públicos o programas de alquiler con opción a compra. Cambian cada ejercicio; verifica requisitos de edad, ingresos y límite de precio antes de contar con ellas.' },
        { q: '¿Qué documentos debo revisar antes de hacer una oferta?', a: 'Nota simple, certificado energético, ITE si aplica, situación de la comunidad, cargas hipotecarias y cargas urbanísticas. Un piso barato en papel puede encarecerse con derramas pendientes o ITE desfavorable.' },
        { q: '¿Cuánto cuesta el servicio de compra con NuevaHabitat?', a: '5.000 € + IVA, cobrados únicamente en escritura. Incluye búsqueda activa, negociación, due diligence, coordinación de hipoteca, arras y acompañamiento hasta la firma.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Necesitas ahorro para el 20% no financiado más 12–15% en impuestos y gastos (ITP Cataluña 10–11%).</li>
          <li>Consigue preaprobación hipotecaria antes de buscar; define tu techo real de precio.</li>
          <li>Revisa nota simple, ITE, certificado energético y comunidad antes de ofertar.</li>
          <li>Barcelona ciudad es cara; L'Hospitalet, Badalona, Sant Andreu y Nou Barris ofrecen alternativas.</li>
          <li>NuevaHabitat acompaña todo el proceso por 5.000 € + IVA, solo en escritura.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#ahorro-necesario">Cuánto ahorro necesitas</a></li>
          <li><a href="#financiacion">Financiación y preaprobación</a></li>
          <li><a href="#donde-comprar">Dónde comprar en Barcelona y área</a></li>
          <li><a href="#due-diligence">Due diligence antes de ofertar</a></li>
          <li><a href="#tabla-costes">Tabla de costes ocultos</a></li>
          <li><a href="#pasos-proceso">Pasos del proceso de compra</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Comprar tu primera vivienda en Barcelona es emocionante, pero los costes que nadie te cuenta pueden tumbar una operación a última hora. Más allá del precio del anuncio, necesitarás aproximadamente un 12–15% adicional en impuestos y gastos, además del 20% que el banco no financia. Esta guía recorre lo esencial — desde el ahorro hasta la escritura — con datos concretos del mercado catalán en 2026.</p>
      <h2 id="ahorro-necesario">Cuánto ahorro necesitas realmente</h2>
      <p>Para un piso de 300.000 € en Sant Andreu o L'Hospitalet: 60.000 € de entrada (20%) + unos 30.000–33.000 € de ITP (10–11%) + 1.500–2.000 € en notaría, registro y gestoría. Total: <strong>91.500–95.000 €</strong> antes de firmar. En Eixample, con pisos de 450.000–500.000 €, el ahorro necesario supera fácilmente los 140.000 €.</p>
      <p>Regla práctica: multiplica el precio objetivo por 0,32–0,35 para obtener el ahorro total necesario. Si no lo tienes, ajusta zona (Nou Barris, Badalona) o espera; hacer ofertas sin fondos confirmados solo frustra a vendedores y agentes.</p>
      <h2 id="financiacion">Financiación y preaprobación</h2>
      <p>El banco financia hasta el 80% del valor de tasación, no siempre del precio de compra. Si pagas 350.000 € pero tasas en 330.000 €, la financiación máxima es 264.000 € (80% de 330.000), no 280.000 €. La diferencia sale de tu ahorro.</p>
      <p>Pide preaprobación o carta de viabilidad antes de visitar decenas de pisos. Compara TAE, no solo TIN. Revisa vinculaciones de seguros. NuevaHabitat incluye asesoría hipotecaria en el servicio de compra. <a href="/hipotecas">Calcula tu cuota</a>.</p>
      <h2 id="donde-comprar">Dónde comprar en Barcelona y área metropolitana</h2>
      <p><strong>Eixample y Sarrià</strong>: máxima demanda, precios de 5.000–7.000 €/m², poca negociación en pisos reformados. <strong>Gràcia, Poblenou, Les Corts</strong>: equilibrio entre precio y calidad de vida, 4.200–5.500 €/m². <strong>Sant Andreu, Horta, Nou Barris</strong>: opciones de 3.200–4.200 €/m² con buena conexión.</p>
      <p>Fuera del perímetro: <strong>L'Hospitalet</strong> (2.800–3.800 €/m²), <strong>Badalona</strong> (similar), <strong>Sant Cugat</strong> (4.500–6.000 €/m², perfil familiar). Calcula tiempo de desplazamiento y coste total, no solo precio/m².</p>
      <h2 id="due-diligence">Due diligence antes de ofertar</h2>
      <p>Solicita nota simple (titularidad y cargas), certificado energético, ITE del edificio si aplica, certificado de comunidad al corriente y acta de obras pendientes. En edificios pre-1960 de Ciutat Vella o el Gòtic, la ITE puede implicar derramas futuras que encarecen tu coste real de propiedad.</p>
      <p>Visita con checklist: humedades, ruido, orientación, estado de instalaciones. Una segunda visita a diferente hora revela problemas de luz o vecindad que la primera oculta.</p>
      <h2 id="tabla-costes">Tabla de costes ocultos (piso 350.000 €, Cataluña)</h2>
      <table class="blog-table">
        <thead><tr><th>Concepto</th><th>Importe orientativo</th><th>Responsable</th></tr></thead>
        <tbody>
          <tr><td>Entrada (20% no financiado)</td><td>70.000 €</td><td>Comprador</td></tr>
          <tr><td>ITP (10–11%)</td><td>35.000 – 38.500 €</td><td>Comprador</td></tr>
          <tr><td>Notaría + registro + gestoría</td><td>1.500 – 2.000 €</td><td>Comprador</td></tr>
          <tr><td>Tasación hipoteca</td><td>300 – 500 €</td><td>Comprador</td></tr>
          <tr><td>Total ahorro necesario</td><td>106.800 – 111.000 €</td><td>Comprador</td></tr>
        </tbody>
      </table>
      <h2 id="pasos-proceso">Pasos del proceso de compra</h2>
      <p>Define presupuesto real → preaprobación bancaria → búsqueda activa → visitas con due diligence → oferta razonable (5–8% bajo precio de salida si hay margen) → arras con condición suspensiva de hipoteca → escritura en 30–90 días. NuevaHabitat acompaña cada fase por <strong>5.000 € + IVA</strong>, cobrado solo en escritura. <a href="/comprar">Activar búsqueda</a> · <a href="/inmuebles">Ver inmuebles</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto dinero necesito ahorrado para comprar mi primera vivienda en Barcelona?</summary><p>Como mínimo el 20% del precio de compra más un 12–15% adicional para ITP (10–11% en Cataluña), notaría, registro y gestoría. Para un piso de 300.000 € necesitas unos 96.000–105.000 € entre entrada y gastos. En L'Hospitalet o Nou Barris el importe baja, pero la proporción se mantiene.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo comprar sin aportar el 20% de entrada?</summary><p>En condiciones normales, no. Los bancos financian hasta el 80% de la tasación. Excepciones puntuales (100% con avalistas o productos específicos) son raras y caras. Planifica el ahorro antes de buscar.</p></details>
        <details class="blog-faq-item"><summary>¿Qué ayudas existen para primera vivienda en Cataluña en 2026?</summary><p>Consulta convocatorias de la Generalitat y el ayuntamiento: bonificaciones ITP para jóvenes, avales públicos o programas de alquiler con opción a compra. Cambian cada ejercicio; verifica requisitos de edad, ingresos y límite de precio antes de contar con ellas.</p></details>
        <details class="blog-faq-item"><summary>¿Qué documentos debo revisar antes de hacer una oferta?</summary><p>Nota simple, certificado energético, ITE si aplica, situación de la comunidad, cargas hipotecarias y cargas urbanísticas. Un piso barato en papel puede encarecerse con derramas pendientes o ITE desfavorable.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta el servicio de compra con NuevaHabitat?</summary><p>5.000 € + IVA, cobrados únicamente en escritura. Incluye búsqueda activa, negociación, due diligence, coordinación de hipoteca, arras y acompañamiento hasta la firma.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Compras tu primera vivienda en Barcelona? Te guiamos de la búsqueda a la escritura.</p>
        <a href="/comprar" class="btn">Empezar búsqueda</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Acompañamos primeras compras en Barcelona y área metropolitana desde 2026. Conocemos las particularidades de Eixample, Gràcia, Les Corts, Nou Barris, L'Hospitalet y Badalona para orientarte con datos, no con promesas.</p>
        </div>
      </aside>
      `,
    },
    'mercado-2026': {
      readMin: 10,
      faq: [
        { q: '¿Suben o bajan los precios en Barcelona en 2026?', a: 'De media suben un 8% interanual, pero con gran dispersión entre distritos. Eixample y Sarrià mantienen presión al alza; Nou Barris y L\'Hospitalet muestran más estabilidad y margen de negociación.' },
        { q: '¿Es buen momento para comprar en 2026?', a: 'Sí si tienes financiación preaprobada y horizonte de medio-largo plazo. Hay más margen de negociación que en 2024 en zonas no prime. Calcula coste total incluyendo ITP Cataluña (10–11%) y compara con alquiler equivalente.' },
        { q: '¿Es buen momento para vender en 2026?', a: 'Sí si tu piso está bien posicionado, documentado (nota simple, ITE, certificado energético) y con precio realista. La demanda es selectiva: reformados y bien comunicados se venden rápido; sobreprecio se estanca.' },
        { q: '¿Qué distritos lideran la demanda en 2026?', a: 'Eixample, Gràcia, Poblenou, Les Corts y Sarrià concentran demanda de familias y profesionales. Sant Andreu y Poblenou ganan por relación calidad-precio. L\'Hospitalet y Badalona atraen primeras viviendas.' },
        { q: '¿Cómo afecta el euríbor al mercado inmobiliario barcelonés?', a: 'Con euríbor estabilizado en 2,5–3%, las cuotas son más predecibles que en 2023–2024. Compradores con hipoteca recuperan capacidad de negociación. Tipos altos reducen techo de precio en zonas accesibles.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Barcelona cierra S1 2026 con subida media del 8%, pero mercado más selectivo que en 2024.</li>
          <li>Demanda concentrada en reformados, bien comunicados y con certificado energético favorable.</li>
          <li>Oferta limitada en centro; más rotación en L'Hospitalet, Badalona y Sant Andreu.</li>
          <li>Compradores con financiación negocian mejor; vendedores con precio realista cierran en 45–75 días.</li>
          <li>Micro-mercado por distrito: Eixample no es comparable a Nou Barris ni a Sant Cugat.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#panorama-s1">Panorama primer semestre 2026</a></li>
          <li><a href="#oferta-demanda">Oferta y demanda por zonas</a></li>
          <li><a href="#compradores-vendedores">Compradores vs vendedores</a></li>
          <li><a href="#factores-clave">Factores que mueven el mercado</a></li>
          <li><a href="#tabla-distritos">Tabla por distritos</a></li>
          <li><a href="#perspectivas">Perspectivas segundo semestre</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>El mercado inmobiliario de Barcelona en el primer semestre de 2026 confirma un escenario activo pero exigente. La subida media del 8% interanual oculta realidades muy distintas entre Eixample y Nou Barris, entre un ático reformado en Poblenou y un tercer sin ascensor en Sant Andreu. Este análisis recorre oferta, demanda y perspectivas con datos por distrito y consejos accionables para compradores y vendedores.</p>
      <h2 id="panorama-s1">Panorama del primer semestre 2026</h2>
      <p>Barcelona mantiene atracción demográfica y laboral: sector tech en 22@, turismo estabilizado, universidades y sanidad atraen compradores nacionales e internacionales. Pero el comprador de 2026 es más informado y más selectivo que hace dos años: compara decenas de anuncios, exige certificado energético favorable y penaliza sobreprecios con silencio (visitas sin ofertas).</p>
      <p>La obra nueva sigue siendo escasa en el centro urbano, lo que sostiene precios en Eixample, Gràcia y Sarrià. En el área metropolitana — L'Hospitalet, Badalona, Santa Coloma — hay más stock y mayor margen de negociación, especialmente en pisos que necesitan actualización.</p>
      <h2 id="oferta-demanda">Oferta y demanda por zonas</h2>
      <p><strong>Alta demanda, stock limitado</strong>: Eixample Derecho, Sarrià-Sant Gervasi, Les Corts (Numància, Zona Universitaria). Pisos reformados con ITE favorable y clase energética C+ se venden en 45–60 días. <strong>Demanda creciente</strong>: Poblenou (22@), Sant Andreu (conexión con Sagrera), Gràcia (calidad de vida).</p>
      <p><strong>Oferta amplia, negociación posible</strong>: Nou Barris, tramos de Horta, L'Hospitalet centro, Badalona playa. Compradores sensibles al precio/m² tienen ventaja si presentan financiación clara. <strong>Área premium metropolitana</strong>: Sant Cugat mantiene demanda familiar con precios de 4.500–6.000 €/m².</p>
      <h2 id="compradores-vendedores">Momento comprador vs momento vendedor</h2>
      <p><strong>Compradores</strong>: euríbor estabilizado (2,5–3%) mejora previsibilidad de cuotas. Preaprobación hipotecaria antes de buscar es imprescindible. Negocia con comparables reales, no solo con precio de anuncio. Revisa nota simple, ITE y comunidad antes de ofertar. ITP Cataluña 10–11% sigue siendo el mayor gasto post-compra.</p>
      <p><strong>Vendedores</strong>: precio realista desde el día uno es la clave. Documentación completa (nota simple, certificado energético, ITE) acelera cierres. Home staging básico y fotografía profesional marcan diferencia. NuevaHabitat vende por 3.000 € + IVA, solo en escritura. <a href="/vender">Valoración gratuita</a>.</p>
      <h2 id="factores-clave">Factores que mueven el mercado en 2026</h2>
      <p>Certificado energético e ITE pesan más que en ciclos anteriores: edificios con intervenciones pendientes pierden compradores financiados. Tipos de interés estables favorecen operaciones con hipoteca frente al pico de 2023–2024. Regulación de alquiler y licencias turísticas redistribuyen demanda hacia compra en algunos barrios. Teletrabajo híbrido mantiene interés en zonas con espacio exterior (Gràcia, Sarrià, Sant Cugat).</p>
      <h2 id="tabla-distritos">Tabla resumen por distritos (S1 2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Distrito / zona</th><th>€/m² orientativo</th><th>Tendencia</th><th>Tiempo venta (precio OK)</th></tr></thead>
        <tbody>
          <tr><td>Eixample / Sarrià</td><td>5.500 – 7.500</td><td>Alza moderada</td><td>45 – 60 días</td></tr>
          <tr><td>Gràcia / Poblenou / Les Corts</td><td>4.200 – 5.800</td><td>Estable-alza</td><td>50 – 70 días</td></tr>
          <tr><td>Sant Andreu / Horta</td><td>3.800 – 4.500</td><td>Estable</td><td>55 – 75 días</td></tr>
          <tr><td>Nou Barris</td><td>3.200 – 4.000</td><td>Estable</td><td>60 – 90 días</td></tr>
          <tr><td>L'Hospitalet / Badalona</td><td>2.800 – 3.800</td><td>Estable</td><td>60 – 90 días</td></tr>
          <tr><td>Sant Cugat</td><td>4.500 – 6.000</td><td>Alza moderada</td><td>50 – 80 días</td></tr>
        </tbody>
      </table>
      <h2 id="perspectivas">Perspectivas segundo semestre 2026</h2>
      <p>Analistas prevén estabilización de tipos de interés y moderación de subidas en zonas no prime. El centro urbano mantendrá presión por escasez de suelo. Compradores deberían actuar con due diligence completa; vendedores, con precio alineado al mercado desde el inicio. <a href="/comprar">Comprar con asesoramiento</a> · <a href="/inmuebles">Explorar inmuebles</a> · <a href="/contacto">Informe personalizado por barrio</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Suben o bajan los precios en Barcelona en 2026?</summary><p>De media suben un 8% interanual, pero con gran dispersión entre distritos. Eixample y Sarrià mantienen presión al alza; Nou Barris y L'Hospitalet muestran más estabilidad y margen de negociación.</p></details>
        <details class="blog-faq-item"><summary>¿Es buen momento para comprar en 2026?</summary><p>Sí si tienes financiación preaprobada y horizonte de medio-largo plazo. Hay más margen de negociación que en 2024 en zonas no prime. Calcula coste total incluyendo ITP Cataluña (10–11%) y compara con alquiler equivalente.</p></details>
        <details class="blog-faq-item"><summary>¿Es buen momento para vender en 2026?</summary><p>Sí si tu piso está bien posicionado, documentado (nota simple, ITE, certificado energético) y con precio realista. La demanda es selectiva: reformados y bien comunicados se venden rápido; sobreprecio se estanca.</p></details>
        <details class="blog-faq-item"><summary>¿Qué distritos lideran la demanda en 2026?</summary><p>Eixample, Gràcia, Poblenou, Les Corts y Sarrià concentran demanda de familias y profesionales. Sant Andreu y Poblenou ganan por relación calidad-precio. L'Hospitalet y Badalona atraen primeras viviendas.</p></details>
        <details class="blog-faq-item"><summary>¿Cómo afecta el euríbor al mercado inmobiliario barcelonés?</summary><p>Con euríbor estabilizado en 2,5–3%, las cuotas son más predecibles que en 2023–2024. Compradores con hipoteca recuperan capacidad de negociación. Tipos altos reducen techo de precio en zonas accesibles.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres un informe personalizado de tu barrio en Barcelona?</p>
        <a href="/contacto" class="btn">Consulta gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Analizamos el mercado inmobiliario barcelonés desde 2026 con datos por distrito: Eixample, Gràcia, Les Corts, Poblenou, Nou Barris, Sant Andreu y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'gastos-compraventa': {
      readMin: 9,
      faq: [
        { q: '¿Cuánto es el ITP en Cataluña en 2026?', a: 'El Impuesto de Transmisiones Patrimoniales en Cataluña se sitúa entre el 10% y el 11% del precio de compra en vivienda usada, según tramo. Es el gasto más importante del comprador y debe calcularse antes de hacer ofertas.' },
        { q: '¿Quién paga la notaría y el registro en una compraventa?', a: 'En la práctica, el comprador paga notaría (300–800 €), registro (400–650 €) y gestoría (300–500 €). Es negociable en contrato de arras, pero lo habitual en Barcelona es que los asuma el comprador.' },
        { q: '¿Qué gastos tiene el vendedor al vender un piso?', a: 'Plusvalía municipal (si aplica), certificado energético, posibles deudas de comunidad, cancelación de hipoteca si existe y comisión de agencia si la hay. NuevaHabitat cobra 3.000 € + IVA fijos, solo en escritura.' },
        { q: '¿Hay diferencia de gastos entre Barcelona ciudad y área metropolitana?', a: 'El ITP es el mismo en Cataluña (10–11%). Notaría y registro varían poco. La plusvalía depende del municipio: Barcelona, L\'Hospitalet, Badalona y Sant Cugat tienen ordenanzas distintas.' },
        { q: '¿NuevaHabitat desglosa los gastos antes de firmar?', a: 'Sí. Tanto en compra (5.000 € + IVA) como en venta (3.000 € + IVA) preparamos un desglose completo de impuestos y gastos antes de arras, sin sorpresas en escritura.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>En vivienda usada en Cataluña, el comprador paga ITP (10–11%), notaría, registro y gestoría.</li>
          <li>Regla práctica: añade un 12–15% al precio de compra para calcular desembolso total.</li>
          <li>El vendedor asume plusvalía municipal, certificado energético y deudas de comunidad.</li>
          <li>Negocia en arras quién paga qué; lo habitual favorece al comprador en gastos de formalización.</li>
          <li>NuevaHabitat entrega desglose completo antes de firmar en compra y venta.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#itp-cataluna">ITP en Cataluña 2026</a></li>
          <li><a href="#gastos-comprador">Gastos del comprador</a></li>
          <li><a href="#gastos-vendedor">Gastos del vendedor</a></li>
          <li><a href="#hipoteca-gastos">Gastos adicionales con hipoteca</a></li>
          <li><a href="#tabla-desglose">Tabla desglose por precio</a></li>
          <li><a href="#negociar-arras">Negociar gastos en arras</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>En una compraventa de vivienda usada en Barcelona, el precio del anuncio es solo el punto de partida. Entre impuestos, notaría, registro y gestoría, el comprador desembolsa un 12–15% adicional sobre el precio de compra. El vendedor, por su parte, debe calcular plusvalía municipal, certificado energético y posibles deudas pendientes. Este desglose te permite planificar la operación sin sorpresas en escritura.</p>
      <h2 id="itp-cataluna">ITP en Cataluña 2026</h2>
      <p>El Impuesto de Transmisiones Patrimoniales grava la compra de vivienda usada. En Cataluña, los tramos oscilan entre el 10% y el 11% según el precio de la operación. En un piso de 400.000 €, el ITP supone 40.000–44.000 € — el mayor gasto del comprador. Debe pagarse en el plazo legal tras la escritura; retrasos generan recargos.</p>
      <p>Existen bonificaciones puntuales (primera vivienda joven, familias numerosas) sujetas a convocatoria y requisitos. Verifica si aplican antes de calcular tu presupuesto. En obra nueva se paga IVA (10%) en lugar de ITP.</p>
      <h2 id="gastos-comprador">Gastos del comprador en detalle</h2>
      <p><strong>ITP</strong>: 10–11% del precio. <strong>Notaría</strong>: 300–800 € según importe de operación. <strong>Registro de la Propiedad</strong>: 400–650 €. <strong>Gestoría</strong>: 300–500 € por tramitación de impuestos y registro. <strong>Tasación</strong> (si hay hipoteca): 300–500 €.</p>
      <p>En operaciones en Eixample o Sarrià de 500.000 €, el desembolso adicional del comprador supera fácilmente los 65.000 € entre ITP y gastos. Planifica antes de buscar inmuebles.</p>
      <h2 id="gastos-vendedor">Gastos del vendedor en detalle</h2>
      <p><strong>Plusvalía municipal</strong> (IIVTNU): grava el incremento del valor del suelo. Varía según municipio (Barcelona, L'Hospitalet, Badalona tienen ordenanzas distintas) y tiempo de propiedad. <strong>Certificado energético</strong>: obligatorio, 100–200 €. <strong>Comunidad</strong>: debe estar al corriente; deudas se descuentan o se abonan antes de escritura. <strong>Cancelación hipoteca</strong>: si existe, coste de cancelación registral.</p>
      <p>Comisión de agencia: en modelo tradicional, 3–5% del precio. NuevaHabitat cobra <strong>3.000 € + IVA</strong> fijos, solo en escritura, sin porcentaje sobre venta.</p>
      <h2 id="hipoteca-gastos">Gastos adicionales si hay hipoteca</h2>
      <p>Tasación oficial (300–500 €), comisión de apertura (negociable, 0–1%), seguros vinculados (hogar, vida), posibles gastos de cancelación de hipoteca previa del vendedor si se acuerda así en arras. Compara TAE de varias entidades; la diferencia en coste total puede superar los 10.000 € en 25 años. <a href="/hipotecas">Calculadora hipotecaria</a>.</p>
      <h2 id="tabla-desglose">Tabla desglose por precio de compra (Cataluña)</h2>
      <table class="blog-table">
        <thead><tr><th>Precio compra</th><th>ITP (10–11%)</th><th>Notaría + registro + gestoría</th><th>Total comprador (aprox.)</th></tr></thead>
        <tbody>
          <tr><td>250.000 €</td><td>25.000 – 27.500 €</td><td>1.200 – 1.800 €</td><td>26.200 – 29.300 €</td></tr>
          <tr><td>350.000 €</td><td>35.000 – 38.500 €</td><td>1.400 – 2.000 €</td><td>36.400 – 40.500 €</td></tr>
          <tr><td>450.000 €</td><td>45.000 – 49.500 €</td><td>1.600 – 2.200 €</td><td>46.600 – 51.700 €</td></tr>
          <tr><td>550.000 €</td><td>55.000 – 60.500 €</td><td>1.800 – 2.400 €</td><td>56.800 – 62.900 €</td></tr>
        </tbody>
      </table>
      <h2 id="negociar-arras">Negociar gastos en el contrato de arras</h2>
      <p>En Barcelona es habitual que el comprador asuma ITP y gastos de formalización. Pero plusvalía, estado de la comunidad o costes de cancelación hipotecaria son negociables. Refleja en arras quién paga qué y qué ocurre si aparece una derrama o ITE desfavorable entre firma de arras y escritura. NuevaHabitat prepara desglose completo en compra (<strong>5.000 € + IVA</strong>) y venta (<strong>3.000 € + IVA</strong>), cobrados solo en escritura. <a href="/comprar">Comprar</a> · <a href="/vender">Vender</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto es el ITP en Cataluña en 2026?</summary><p>El Impuesto de Transmisiones Patrimoniales en Cataluña se sitúa entre el 10% y el 11% del precio de compra en vivienda usada, según tramo. Es el gasto más importante del comprador y debe calcularse antes de hacer ofertas.</p></details>
        <details class="blog-faq-item"><summary>¿Quién paga la notaría y el registro en una compraventa?</summary><p>En la práctica, el comprador paga notaría (300–800 €), registro (400–650 €) y gestoría (300–500 €). Es negociable en contrato de arras, pero lo habitual en Barcelona es que los asuma el comprador.</p></details>
        <details class="blog-faq-item"><summary>¿Qué gastos tiene el vendedor al vender un piso?</summary><p>Plusvalía municipal (si aplica), certificado energético, posibles deudas de comunidad, cancelación de hipoteca si existe y comisión de agencia si la hay. NuevaHabitat cobra 3.000 € + IVA fijos, solo en escritura.</p></details>
        <details class="blog-faq-item"><summary>¿Hay diferencia de gastos entre Barcelona ciudad y área metropolitana?</summary><p>El ITP es el mismo en Cataluña (10–11%). Notaría y registro varían poco. La plusvalía depende del municipio: Barcelona, L'Hospitalet, Badalona y Sant Cugat tienen ordenanzas distintas.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat desglosa los gastos antes de firmar?</summary><p>Sí. Tanto en compra (5.000 € + IVA) como en venta (3.000 € + IVA) preparamos un desglose completo de impuestos y gastos antes de arras, sin sorpresas en escritura.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres un desglose exacto de gastos para tu operación en Barcelona?</p>
        <a href="/contacto" class="btn">Consulta gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Gestionamos compraventas en Barcelona y área metropolitana desde 2026 con transparencia total en impuestos y gastos: ITP, notaría, plusvalía y documentación (nota simple, ITE, certificado energético).</p>
        </div>
      </aside>
      `,
    },
    'negociar-precio': {
      readMin: 8,
      faq: [
        { q: '¿Cuánto se puede negociar el precio de un piso en Barcelona?', a: 'En zonas con rotación alta (Nou Barris, L\'Hospitalet, Badalona) es habitual lograr 5–10% de descuento sobre precio de anuncio. En Eixample o Sarrià con pisos reformados, el margen baja a 3–5% o menos si hay demanda.' },
        { q: '¿Cómo hacer una oferta sin ofender al vendedor?', a: 'Presenta una oferta razonable (5–8% bajo precio de salida) con justificación: comparables de mercado, estado del inmueble, ITE o certificado energético desfavorable, tiempo publicado. Acompaña de preaprobación hipotecaria y plazo corto para arras.' },
        { q: '¿El tiempo publicado afecta a la negociación?', a: 'Sí. Un piso lleva más de 90 días en mercado en Gràcia o Les Corts sugiere sobreprecio. Es argumento sólido para negociar. Por debajo de 30 días, el margen es menor.' },
        { q: '¿Debo negociar personalmente o con agente?', a: 'Un agente profesional negocia con datos, no con emociones, y evita romper la operación por regateos mal planteados. NuevaHabitat incluye negociación en el servicio de compra (5.000 € + IVA, solo en escritura).' },
        { q: '¿Qué errores matan una negociación?', a: 'Ofertas insultantes (más del 15% bajo sin justificación), demoras en responder, llegar sin financiación clara, criticar la vivienda durante la visita o pedir exclusiones excesivas en arras sin contrapartida.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Negociar no es regatear: es justificar con comparables, estado del inmueble y tiempo en mercado.</li>
          <li>Oferta razonable: 5–8% bajo precio de salida con preaprobación hipotecaria y plazo corto.</li>
          <li>ITE desfavorable, certificado energético bajo o derramas pendientes son palancas legítimas.</li>
          <li>En Eixample prime el margen es estrecho; en Nou Barris o L'Hospitalet, más amplio.</li>
          <li>NuevaHabitat negocia con datos de mercado como parte del servicio de compra.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#preparacion">Preparación antes de negociar</a></li>
          <li><a href="#argumentos">Argumentos que funcionan</a></li>
          <li><a href="#oferta-inicial">Cómo estructurar la oferta</a></li>
          <li><a href="#contraoferta">Gestión de contraofertas</a></li>
          <li><a href="#tabla-margen">Margen de negociación por zona</a></li>
          <li><a href="#errores">Errores que queman la operación</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Negociar el precio de un piso en Barcelona no consiste en pedir un 20% de descuento porque sí. Consiste en presentar argumentos sólidos — comparables de mercado, defectos detectados, tiempo publicado, situación de la finca — que justifiquen una rebaja razonable sin que el vendedor cierre la puerta. Los agentes profesionales usan datos, no emociones. Esta guía te da las herramientas para negociar como ellos.</p>
      <h2 id="preparacion">Preparación antes de negociar</h2>
      <p>Investiga comparables cerrados en el edificio y calle, no solo anuncios activos (inflados un 5–12%). Revisa nota simple, ITE, certificado energético y actas de comunidad. Calcula tu techo real incluyendo ITP Cataluña (10–11%) y gastos. Consigue preaprobación hipotecaria: una oferta sin financiación clara no se toma en serio en Eixample, Poblenou o Sant Andreu.</p>
      <h2 id="argumentos">Argumentos que funcionan en Barcelona</h2>
      <p><strong>Comparables</strong>: "Pisos similares en este portal han cerrado a X €/m² en los últimos seis meses." <strong>Estado técnico</strong>: ITE desfavorable, certificado energético E o F, humedades, instalaciones obsoletas. <strong>Tiempo en mercado</strong>: más de 90 días publicado sugiere sobreprecio. <strong>Cargas y derramas</strong>: deudas de comunidad o intervenciones pendientes en la finca. <strong>Rapidez</strong>: ofrece arras en 7–14 días y escritura en 30–45 si la documentación está limpia.</p>
      <h2 id="oferta-inicial">Cómo estructurar la oferta inicial</h2>
      <p>Oferta por escrito con: precio propuesto, importe de arras, plazo para escritura, condiciones suspensivas (hipoteca a 30 días), y breve justificación. En un piso de 420.000 € en Les Corts, una oferta de 390.000–400.000 € con preaprobación y cierre rápido es razonable. Por debajo de 380.000 € sin argumentos técnicos sólidos probablemente sea rechazada.</p>
      <h2 id="contraoferta">Gestión de contraofertas</h2>
      <p>El vendedor contraatacará. Evalúa si la contraoferta sigue dentro de tu presupuesto total (precio + ITP + gastos). Subir 5.000–10.000 € para cerrar suele ser mejor que perder el piso y reiniciar búsqueda durante meses. Si la brecha es grande, justifica con nuevos datos o retírate con elegancia: quemar puentes cierra futuras negociaciones.</p>
      <h2 id="tabla-margen">Margen de negociación orientativo por zona</h2>
      <table class="blog-table">
        <thead><tr><th>Zona</th><th>Margen típico sobre anuncio</th><th>Condición</th></tr></thead>
        <tbody>
          <tr><td>Eixample / Sarrià (reformado)</td><td>0 – 5%</td><td>Alta demanda, poco stock</td></tr>
          <tr><td>Gràcia / Poblenou / Les Corts</td><td>3 – 8%</td><td>Depende de tiempo publicado</td></tr>
          <tr><td>Sant Andreu / Horta</td><td>5 – 10%</td><td>Mayor oferta, más negociación</td></tr>
          <tr><td>Nou Barris / L'Hospitalet</td><td>5 – 12%</td><td>Compradores sensibles al precio</td></tr>
          <tr><td>Badalona / Sant Cugat</td><td>3 – 10%</td><td>Variable según subzona</td></tr>
        </tbody>
      </table>
      <h2 id="errores">Errores que queman la operación</h2>
      <p>Oferta insultante sin datos. Criticar la decoración o el gusto del vendedor en visita. Llegar sin saber tu capacidad financiera. Demorar respuestas más de 48 horas. Pedir muebles incluidos sin reflejarlo en precio. Ignorar que el vendedor también tiene alternativas.</p>
      <p>NuevaHabitat negocia en tu nombre con comparables reales. Servicio de compra: <strong>5.000 € + IVA</strong>, solo en escritura. <a href="/comprar">Activar búsqueda</a> · <a href="/inmuebles">Ver inmuebles</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto se puede negociar el precio de un piso en Barcelona?</summary><p>En zonas con rotación alta (Nou Barris, L'Hospitalet, Badalona) es habitual lograr 5–10% de descuento sobre precio de anuncio. En Eixample o Sarrià con pisos reformados, el margen baja a 3–5% o menos si hay demanda.</p></details>
        <details class="blog-faq-item"><summary>¿Cómo hacer una oferta sin ofender al vendedor?</summary><p>Presenta una oferta razonable (5–8% bajo precio de salida) con justificación: comparables de mercado, estado del inmueble, ITE o certificado energético desfavorable, tiempo publicado. Acompaña de preaprobación hipotecaria y plazo corto para arras.</p></details>
        <details class="blog-faq-item"><summary>¿El tiempo publicado afecta a la negociación?</summary><p>Sí. Un piso lleva más de 90 días en mercado en Gràcia o Les Corts sugiere sobreprecio. Es argumento sólido para negociar. Por debajo de 30 días, el margen es menor.</p></details>
        <details class="blog-faq-item"><summary>¿Debo negociar personalmente o con agente?</summary><p>Un agente profesional negocia con datos, no con emociones, y evita romper la operación por regateos mal planteados. NuevaHabitat incluye negociación en el servicio de compra (5.000 € + IVA, solo en escritura).</p></details>
        <details class="blog-faq-item"><summary>¿Qué errores matan una negociación?</summary><p>Ofertas insultantes (más del 15% bajo sin justificación), demoras en responder, llegar sin financiación clara, criticar la vivienda durante la visita o pedir exclusiones excesivas en arras sin contrapartida.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres que negociemos por ti con datos reales de mercado?</p>
        <a href="/comprar" class="btn">Servicio de compra</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Negociamos compraventas en Barcelona desde 2026 con comparables por distrito: Eixample, Gràcia, Les Corts, Poblenou, Nou Barris y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'euribor-2026': {
      readMin: 9,
      faq: [
        { q: '¿A cuánto está el euríbor en 2026?', a: 'El euríbor a 12 meses se sitúa en torno al 2,5–3% en el primer semestre de 2026, tras estabilizarse desde los picos de 2023–2024. La mayoría de analistas prevén mantenerlo en ese rango durante la segunda mitad del año.' },
        { q: '¿Subirá o bajará el euríbor en los próximos meses?', a: 'Las previsiones apuntan a estabilidad o ligeros recortes si la inflación sigue moderándose y el BCE relaja tipos. Escenarios de subida brusca son poco probables en el contexto actual, pero la hipoteca variable siempre conlleva riesgo.' },
        { q: '¿Me conviene hipoteca fija o variable con el euríbor actual?', a: 'Con euríbor en 2,5–3%, fija y variable compiten en condiciones similares. Si priorizas certeza, fija. Si toleras variación y crees que el euríbor no subirá mucho, variable. La mixta equilibra ambos perfiles.' },
        { q: '¿Cómo afecta el euríbor a mi cuota mensual?', a: 'En una hipoteca variable de 250.000 € a 25 años, cada 0,25 puntos de euríbor mueve la cuota unos 30–35 €/mes. Revisa la cláusula de revisión (anual o semestral) y simula escenarios de subida antes de contratar.' },
        { q: '¿NuevaHabitat compara hipotecas fijas y variables?', a: 'Sí. Incluimos comparativa de TAE entre entidades y modalidades en el servicio de compra (5.000 € + IVA, solo en escritura) y en asesoría hipotecaria independiente.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Euríbor a 12 meses en torno al 2,5–3% en S1 2026, estabilizado respecto a 2023–2024.</li>
          <li>Previsiones: mantenerse en rango o ligeros recortes si inflación sigue bajando.</li>
          <li>Con tipos actuales, fija y variable compiten; la decisión depende de tu perfil de riesgo.</li>
          <li>Cada 0,25 puntos de euríbor mueve la cuota unos 30–35 € en hipotecas de 250.000 €.</li>
          <li>Compara TAE, no solo euríbor + diferencial; vinculaciones alteran el coste real.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#situacion-2026">Situación del euríbor en 2026</a></li>
          <li><a href="#previsiones">Previsiones segunda mitad del año</a></li>
          <li><a href="#impacto-hipoteca">Impacto en hipotecas variables</a></li>
          <li><a href="#fija-vs-variable">Fija vs variable con euríbor actual</a></li>
          <li><a href="#tabla-escenarios">Tabla de escenarios de cuota</a></li>
          <li><a href="#barcelona">Euríbor y mercado inmobiliario barcelonés</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Tras la volatilidad de 2023–2024, el euríbor a 12 meses se ha estabilizado en torno al 2,5–3% en 2026. Para quienes tienen hipoteca variable en Barcelona, esto significa cuotas más predecibles. Para quienes van a comprar en Eixample, Gràcia, Les Corts o el área metropolitana, la decisión fija vs variable depende más del perfil de riesgo que del tipo en sí. Este análisis recoge previsiones, impacto en cuotas y consejos prácticos.</p>
      <h2 id="situacion-2026">Situación del euríbor en 2026</h2>
      <p>El euríbor a 12 meses — referencia de la mayoría de hipotecas variables en España — pasó de mínimos históricos negativos en 2020–2021 a picos superiores al 4% en 2023–2024. En el primer semestre de 2026 se estabiliza en 2,5–3%, reflejando la moderación inflacionaria y el tono cauteloso del BCE.</p>
      <p>Para una hipoteca variable con diferencial del 0,8%, el tipo efectivo inicial ronda el 3,3–3,8% TIN — competitivo frente a muchas fijas a 25 años en el mismo rango.</p>
      <h2 id="previsiones">Previsiones para la segunda mitad de 2026</h2>
      <p>Analistas de grandes bancos y consultoras prevén: escenario base con euríbor en 2,3–3% hasta fin de año; escenario optimista con recortes graduales del BCE que podrían llevarlo a 2–2,5%; escenario pesimista con repuntes leves si la inflación se reactiva (poco probable según consenso actual).</p>
      <p>Ninguna previsión es garantía. Si eliges variable, simula cuota con euríbor +1 y +2 puntos para verificar que puedes afrontar subidas.</p>
      <h2 id="impacto-hipoteca">Impacto en hipotecas variables existentes</h2>
      <p>Si revisaste hipoteca en 2024 con euríbor alto, tu cuota bajará en la próxima revisión. Si firmaste en 2020–2021 con diferencial bajo, estás en niveles intermedios. Revisa fecha de revisión (cada 6 o 12 meses) y capital pendiente. Puede compensar subrogación o novación a fija si la cuota actual supera tu comodidad financiera.</p>
      <h2 id="fija-vs-variable">Fija vs variable con euríbor en 2,5–3%</h2>
      <p><strong>Fija</strong>: certeza total, ideal si tu margen de ingresos es ajustado o compras en zona cara (Sarrià, Eixample) con cuota alta. <strong>Variable</strong>: puede ser ligeramente más barata hoy, pero expone a subidas futuras. <strong>Mixta</strong>: fija 5–10 años, variable después; popular en primeras compras en Poblenou, Sant Andreu o L'Hospitalet.</p>
      <h2 id="tabla-escenarios">Tabla de escenarios de cuota (250.000 €, 25 años, dif. 0,8%)</h2>
      <table class="blog-table">
        <thead><tr><th>Euríbor</th><th>TIN efectivo</th><th>Cuota mensual (aprox.)</th><th>vs euríbor 2,5%</th></tr></thead>
        <tbody>
          <tr><td>2,0%</td><td>2,8%</td><td>1.155 €</td><td>−65 €/mes</td></tr>
          <tr><td>2,5%</td><td>3,3%</td><td>1.220 €</td><td>Referencia</td></tr>
          <tr><td>3,0%</td><td>3,8%</td><td>1.288 €</td><td>+68 €/mes</td></tr>
          <tr><td>3,5%</td><td>4,3%</td><td>1.358 €</td><td>+138 €/mes</td></tr>
          <tr><td>4,0%</td><td>4,8%</td><td>1.430 €</td><td>+210 €/mes</td></tr>
        </tbody>
      </table>
      <h2 id="barcelona">Euríbor y mercado inmobiliario barcelonés</h2>
      <p>Tipos estables favorecen compradores con hipoteca: más previsibilidad y mayor capacidad de negociación que en el pico de 2023–2024. En zonas accesibles (Nou Barris, Badalona), compradores sensibles a la cuota vuelven al mercado. En prime (Eixample, Sarrià), la demanda es menos elástica al tipo de interés.</p>
      <p>NuevaHabitat compara ofertas fijas, variables y mixtas entre bancos. <a href="/hipotecas">Calculadora hipotecaria</a> · <a href="/comprar">Servicio de compra</a> (5.000 € + IVA, solo en escritura).</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿A cuánto está el euríbor en 2026?</summary><p>El euríbor a 12 meses se sitúa en torno al 2,5–3% en el primer semestre de 2026, tras estabilizarse desde los picos de 2023–2024. La mayoría de analistas prevén mantenerlo en ese rango durante la segunda mitad del año.</p></details>
        <details class="blog-faq-item"><summary>¿Subirá o bajará el euríbor en los próximos meses?</summary><p>Las previsiones apuntan a estabilidad o ligeros recortes si la inflación sigue moderándose y el BCE relaja tipos. Escenarios de subida brusca son poco probables en el contexto actual, pero la hipoteca variable siempre conlleva riesgo.</p></details>
        <details class="blog-faq-item"><summary>¿Me conviene hipoteca fija o variable con el euríbor actual?</summary><p>Con euríbor en 2,5–3%, fija y variable compiten en condiciones similares. Si priorizas certeza, fija. Si toleras variación y crees que el euríbor no subirá mucho, variable. La mixta equilibra ambos perfiles.</p></details>
        <details class="blog-faq-item"><summary>¿Cómo afecta el euríbor a mi cuota mensual?</summary><p>En una hipoteca variable de 250.000 € a 25 años, cada 0,25 puntos de euríbor mueve la cuota unos 30–35 €/mes. Revisa la cláusula de revisión (anual o semestral) y simula escenarios de subida antes de contratar.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat compara hipotecas fijas y variables?</summary><p>Sí. Incluimos comparativa de TAE entre entidades y modalidades en el servicio de compra (5.000 € + IVA, solo en escritura) y en asesoría hipotecaria independiente.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres comparar hipotecas fijas y variables con el euríbor actual?</p>
        <a href="/hipotecas" class="btn">Calculadora hipotecaria</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Asesoramos en financiación hipotecaria en Barcelona desde 2026. Comparamos TAE real entre entidades para compradores en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'vender-piso-barcelona-precio-fijo': {
      readMin: 10,
      faq: [
        { q: '¿Cuánto cuesta vender un piso en Barcelona con NuevaHabitat?', a: '3.000 € + IVA, cobrados únicamente en el momento de la escritura. Si no vendes, no pagas. Sin comisiones porcentuales ni exclusivas abusivas.' },
        { q: '¿Qué incluye el servicio de venta a precio fijo?', a: 'Valoración de mercado, reportaje fotográfico profesional, publicación en portales, filtrado de compradores cualificados, visitas, negociación, revisión documental (nota simple, ITE, certificado energético) y acompañamiento hasta escritura.' },
        { q: '¿Cuánto ahorro respecto a una agencia tradicional al 5%?', a: 'En un piso de 400.000 €, una agencia al 5% + IVA cobra unos 24.200 €. NuevaHabitat: 3.630 € (3.000 + IVA). Ahorro superior a 20.000 € independientemente del tiempo de venta.' },
        { q: '¿Hay permanencia o exclusiva obligatoria?', a: 'No aplicamos exclusivas abusivas ni permanencias. Trabajamos con transparencia: precio fijo acordado desde el inicio, cobro solo si cierras la venta en escritura.' },
        { q: '¿Funciona el precio fijo en todos los distritos de Barcelona?', a: 'Sí. Operamos en Eixample, Gràcia, Les Corts, Poblenou, Sarrià, Nou Barris, Sant Andreu, L\'Hospitalet, Badalona, Sant Cugat y resto del área metropolitana.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Modelo tradicional: 3–5% del precio de venta (hasta 20.000 €+ en pisos de 400.000 €).</li>
          <li>NuevaHabitat: 3.000 € + IVA fijos, cobrados solo en escritura. Si no vendes, no pagas.</li>
          <li>Todo incluido: valoración, fotos, publicación, filtrado, visitas, negociación y acompañamiento legal.</li>
          <li>Sin exclusivas abusivas ni comisiones ocultas.</li>
          <li>Ahorro de más de 20.000 € en operaciones habituales de Barcelona.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#modelo-tradicional">El modelo tradicional y sus costes</a></li>
          <li><a href="#precio-fijo-nh">Precio fijo NuevaHabitat</a></li>
          <li><a href="#que-incluye">Qué incluye el servicio</a></li>
          <li><a href="#tabla-comparativa">Tabla comparativa de costes</a></li>
          <li><a href="#distritos">Operamos en todos los distritos</a></li>
          <li><a href="#cuando-conviene">Cuándo conviene el precio fijo</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Si buscas vender piso en Barcelona, la primera pregunta es cuánto te costará la inmobiliaria. En el modelo tradicional, las comisiones oscilan entre el 3% y el 5% del precio de venta más IVA — en un piso de 400.000 €, eso supone hasta 24.200 € independientemente de si tarda tres meses o doce. NuevaHabitat cambia las reglas con un precio fijo de 3.000 € + IVA, cobrado únicamente en escritura. Esta guía desglosa costes, servicios incluidos y ahorro real.</p>
      <h2 id="modelo-tradicional">El modelo tradicional y sus costes ocultos</h2>
      <p>Agencias al 3–5% cobran proporcionalmente al precio, no al servicio. ¿Publicación en portales? A menudo extra. ¿Fotografía profesional? Extra. ¿Negociación y arras? A veces extra. Exclusivas de 6–12 meses te atan aunque no vendan. Y si no cierras, has pagado meses de exclusiva sin resultado.</p>
      <p>En Les Corts, Eixample o Sarrià, donde los precios medios superan 400.000 €, la comisión tradicional al 5% supera fácilmente los 20.000 €.</p>
      <p>Además, el incentivo del agente tradicional no siempre está alineado contigo: cobra más si subes el precio de anuncio, aunque eso alargue la venta seis meses. Con precio fijo, el interés compartido es vender bien y rápido, no inflar el precio para aumentar comisión porcentual.</p>
      <h2 id="precio-fijo-nh">Precio fijo NuevaHabitat: cómo funciona</h2>
      <p><strong>3.000 € + IVA</strong> (3.630 € total). Cobrados solo en escritura, cuando la venta se ha cerrado. Si no vendes, no pagas nada. Sin porcentaje sobre precio final. Sin sorpresas. Transparencia desde la valoración inicial.</p>
      <p>Comparamos con agencias tradicionales en nuestra landing de <a href="/vender-les-corts">venta en Les Corts</a>: un piso de 400.000 € supone ahorro de más de 21.000 € frente a agencia al 6%.</p>
      <h2 id="que-incluye">Qué incluye el servicio completo</h2>
      <p>Valoración gratuita con comparables de mercado. Reportaje fotográfico profesional y orientación de home staging. Publicación en principales portales. Filtrado de compradores con capacidad financiera verificada. Gestión de visitas. Negociación profesional. Revisión documental: nota simple, certificado energético, ITE, comunidad. Coordinación de arras y escritura.</p>
      <p>En operaciones con ITE pendiente, inquilino en situación de arrendamiento o herencia en curso, la gestión documental incluida evita retrasos que en el modelo tradicional a menudo se facturan aparte. Todo el ciclo — desde la valoración inicial hasta la firma en notaría — queda cubierto por el precio fijo acordado al inicio.</p>
      <h2 id="tabla-comparativa">Tabla comparativa de costes (2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Precio venta</th><th>Agencia 3% + IVA</th><th>Agencia 5% + IVA</th><th>NuevaHabitat</th><th>Ahorro vs 5%</th></tr></thead>
        <tbody>
          <tr><td>300.000 €</td><td>10.890 €</td><td>18.150 €</td><td>3.630 €</td><td>14.520 €</td></tr>
          <tr><td>400.000 €</td><td>14.520 €</td><td>24.200 €</td><td>3.630 €</td><td>20.570 €</td></tr>
          <tr><td>500.000 €</td><td>18.150 €</td><td>30.250 €</td><td>3.630 €</td><td>26.620 €</td></tr>
          <tr><td>600.000 €</td><td>21.780 €</td><td>36.300 €</td><td>3.630 €</td><td>32.670 €</td></tr>
        </tbody>
      </table>
      <h2 id="distritos">Operamos en todos los distritos de Barcelona</h2>
      <p>Eixample, Gràcia, Les Corts, Poblenou, Sarrià-Sant Gervasi, Nou Barris, Sant Andreu, Horta, Ciutat Vella, y área metropolitana: L'Hospitalet, Badalona, Sant Cugat. Conocemos el micro-mercado de cada zona para valorar y vender con precio realista desde el primer día.</p>
      <h2 id="cuando-conviene">Cuándo conviene el precio fijo</h2>
      <p>Siempre que quieras saber de antemano cuánto pagarás, independientemente del precio final de venta. Especialmente ventajoso en operaciones de 300.000 €+. Si tu prioridad es minimizar coste y maximizar transparencia, el precio fijo gana al porcentaje. <a href="/vender">Solicita valoración gratuita</a> · <a href="/inmuebles">Ver comparables</a>.</p>
      <p>En distritos como Nou Barris o Sant Andreu, donde el precio medio ronda 300.000–350.000 €, el ahorro frente a agencia al 4% sigue superando los 10.000 €. En Sarrià o Eixample, con operaciones de 500.000–600.000 €, la diferencia puede superar los 30.000 € — dinero que permanece en tu bolsillo, no en comisión inmobiliaria.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta vender un piso en Barcelona con NuevaHabitat?</summary><p>3.000 € + IVA, cobrados únicamente en el momento de la escritura. Si no vendes, no pagas. Sin comisiones porcentuales ni exclusivas abusivas.</p></details>
        <details class="blog-faq-item"><summary>¿Qué incluye el servicio de venta a precio fijo?</summary><p>Valoración de mercado, reportaje fotográfico profesional, publicación en portales, filtrado de compradores cualificados, visitas, negociación, revisión documental (nota simple, ITE, certificado energético) y acompañamiento hasta escritura.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto ahorro respecto a una agencia tradicional al 5%?</summary><p>En un piso de 400.000 €, una agencia al 5% + IVA cobra unos 24.200 €. NuevaHabitat: 3.630 € (3.000 + IVA). Ahorro superior a 20.000 € independientemente del tiempo de venta.</p></details>
        <details class="blog-faq-item"><summary>¿Hay permanencia o exclusiva obligatoria?</summary><p>No aplicamos exclusivas abusivas ni permanencias. Trabajamos con transparencia: precio fijo acordado desde el inicio, cobro solo si cierras la venta en escritura.</p></details>
        <details class="blog-faq-item"><summary>¿Funciona el precio fijo en todos los distritos de Barcelona?</summary><p>Sí. Operamos en Eixample, Gràcia, Les Corts, Poblenou, Sarrià, Nou Barris, Sant Andreu, L'Hospitalet, Badalona, Sant Cugat y resto del área metropolitana.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres vender tu piso en Barcelona sin comisiones porcentuales?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Pioneros del modelo precio fijo en Barcelona desde 2026. Hemos vendido en Eixample, Gràcia, Les Corts, Poblenou, Nou Barris y área metropolitana con transparencia total: 3.000 € + IVA, solo en escritura.</p>
        </div>
      </aside>
      `,
    },
    'valoracion-gratis-barcelona': {
      readMin: 9,
      faq: [
        { q: '¿La valoración gratuita de NuevaHabitat tiene compromiso?', a: 'No. La valoración es gratuita y sin compromiso de exclusiva. Recibes informe con rango de precio, tiempo estimado de venta y comparables. Tú decides si contratar el servicio de venta después.' },
        { q: '¿En qué se diferencia de los estimadores online?', a: 'Los estimadores online no visitan el inmueble ni conocen el micro-mercado. No contemplan ITE, certificado energético, orientación, planta ni operaciones cerradas en tu edificio. Nuestra valoración combina visita presencial y datos reales.' },
        { q: '¿Cuánto tarda la valoración?', a: 'Tras solicitarla en /vender, concertamos visita en 24–48 horas. El informe se entrega en 24–72 horas tras la visita, según complejidad del inmueble y disponibilidad de comparables.' },
        { q: '¿Hacéis valoraciones en toda el área metropolitana?', a: 'Sí. Barcelona ciudad, L\'Hospitalet, Badalona, Sant Cugat, Sant Adrià y resto del área metropolitana. Conocemos las particularidades de cada distrito y municipio.' },
        { q: '¿Qué pasa si decido vender con NuevaHabitat?', a: 'El servicio cuesta 3.000 € + IVA, cobrados solo en escritura. Incluye todo: fotografía, publicación, filtrado, visitas, negociación y acompañamiento legal.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Estimadores online sirven como orientación, pero no sustituyen valoración profesional.</li>
          <li>Factores clave: orientación, planta, ITE, certificado energético, comparables cerrados.</li>
          <li>Eixample no se valora igual que Nou Barris, Les Corts o L'Hospitalet.</li>
          <li>NuevaHabitat ofrece valoración gratuita con visita presencial y sin compromiso.</li>
          <li>El informe incluye rango de precio, tiempo de venta y plan de acción.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#limites-online">Límites de los estimadores online</a></li>
          <li><a href="#factores-valor">Factores que mueven el valor real</a></li>
          <li><a href="#micro-mercado">Micro-mercado por distrito</a></li>
          <li><a href="#proceso-valoracion">Proceso de valoración NuevaHabitat</a></li>
          <li><a href="#tabla-diferencias">Online vs profesional</a></li>
          <li><a href="#despues-valoracion">Qué hacer después de valorar</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Buscar "valoración gratuita piso Barcelona" devuelve cifras muy dispares. Los estimadores automáticos procesan datos agregados por código postal, pero no entran en tu piso, no conocen la ITE de tu edificio ni las operaciones cerradas en tu portal. Para fijar un precio de salida que atraiga ofertas reales — y no meses de visitas infructuosas — necesitas una valoración profesional con visita presencial y comparables del micro-mercado.</p>
      <h2 id="limites-online">Límites de los estimadores online</h2>
      <p>Idealista, Fotocasa y herramientas bancarias dan un rango amplio basado en precios de anuncio (inflados 5–12% respecto a cierres reales). No distinguen planta baja de ático, patio de manzana de fachada, reforma integral de pintura reciente. No penalizan ITE desfavorable ni certificado energético E/F. Resultado: estimaciones con margen de error del 15–20% en Barcelona, donde la dispersión por calle es enorme.</p>
      <p>Un vendedor que confía ciegamente en el estimador y publica 15% por encima del valor real en Gràcia o Poblenou acumula visitas de curiosos pero no ofertas. Peor aún: cada mes de anuncio estancado refuerza la percepción de "piso problemático" y obliga a rebajas mayores que si hubiera salido al precio correcto desde el inicio.</p>
      <h2 id="factores-valor">Factores que mueven el valor real</h2>
      <p><strong>Ubicación micro</strong>: misma calle, distinto tramo, distinto precio. <strong>Orientación y planta</strong>: exterior vs interior, bajo vs alto. <strong>Estado del inmueble</strong>: reforma, cocina, baños. <strong>Finca</strong>: ITE favorable o no, ascensor, portal. <strong>Certificado energético</strong>: clase A-C vs E-G. <strong>Registro</strong>: cargas visibles en nota simple. <strong>Comunidad</strong>: derramas, obras pendientes. <strong>Comparables cerrados</strong>: operaciones reales en 6–12 meses, no anuncios activos.</p>
      <h2 id="micro-mercado">Micro-mercado por distrito en Barcelona</h2>
      <p><strong>Eixample / Sarrià</strong>: 5.500–7.500 €/m² según estado y planta. <strong>Gràcia / Poblenou / Les Corts</strong>: 4.200–5.800 €/m². <strong>Sant Andreu / Horta</strong>: 3.800–4.500 €/m². <strong>Nou Barris</strong>: 3.200–4.000 €/m². <strong>L'Hospitalet / Badalona</strong>: 2.800–3.800 €/m². <strong>Sant Cugat</strong>: 4.500–6.000 €/m². Un estimador que devuelve "4.500 €/m²" para todo Barcelona es inútil para fijar precio.</p>
      <h2 id="proceso-valoracion">Proceso de valoración NuevaHabitat</h2>
      <p>Solicitas en <a href="/vender">/vender</a> sin compromiso. Concertamos visita presencial en 24–48 horas. Analizamos estado, orientación, finca (ITE, certificado energético), comparables cerrados en edificio y barrio. Entregamos informe con rango de precio recomendado, tiempo estimado de venta y acciones sugeridas (staging, documentación pendiente). Si decides vender: 3.000 € + IVA, solo en escritura. Si tu piso está en Les Corts: <a href="/vender-les-corts">guía específica del distrito</a>.</p>
      <h2 id="tabla-diferencias">Estimador online vs valoración profesional</h2>
      <table class="blog-table">
        <thead><tr><th>Criterio</th><th>Estimador online</th><th>Valoración NuevaHabitat</th></tr></thead>
        <tbody>
          <tr><td>Visita presencial</td><td>No</td><td>Sí</td></tr>
          <tr><td>Comparables cerrados</td><td>Raro</td><td>Sí, por edificio y barrio</td></tr>
          <tr><td>ITE y certificado energético</td><td>No contempla</td><td>Evalúa impacto</td></tr>
          <tr><td>Nota simple y cargas</td><td>No</td><td>Revisión documental</td></tr>
          <tr><td>Micro-mercado por calle</td><td>No</td><td>Sí</td></tr>
          <tr><td>Coste</td><td>Gratis (limitado)</td><td>Gratis, sin compromiso</td></tr>
        </tbody>
      </table>
      <h2 id="despues-valoracion">Qué hacer después de valorar</h2>
      <p>Si el rango encaja con tus expectativas, prepara documentación (nota simple, certificado energético, ITE) y decide si vendes por tu cuenta o con agente. Si NuevaHabitat gestiona la venta: precio fijo 3.000 € + IVA, fotografía, publicación, filtrado y negociación incluidos. <a href="/vender">Solicitar valoración</a> · <a href="/inmuebles">Ver comparables en tu zona</a>.</p>
      <p>Si el rango está por debajo de lo esperado, analiza si conviene invertir en mejoras puntuales (pintura, certificado energético actualizado) antes de publicar o ajustar expectativas al mercado actual. En Nou Barris y Sant Andreu, una rebaja de 5% bien justificada puede generar múltiples ofertas en dos semanas; en Eixample, el margen de maniobra es menor pero la demanda de pisos bien presentados sigue siendo sólida en 2026.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿La valoración gratuita de NuevaHabitat tiene compromiso?</summary><p>No. La valoración es gratuita y sin compromiso de exclusiva. Recibes informe con rango de precio, tiempo estimado de venta y comparables. Tú decides si contratar el servicio de venta después.</p></details>
        <details class="blog-faq-item"><summary>¿En qué se diferencia de los estimadores online?</summary><p>Los estimadores online no visitan el inmueble ni conocen el micro-mercado. No contemplan ITE, certificado energético, orientación, planta ni operaciones cerradas en tu edificio. Nuestra valoración combina visita presencial y datos reales.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto tarda la valoración?</summary><p>Tras solicitarla en /vender, concertamos visita en 24–48 horas. El informe se entrega en 24–72 horas tras la visita, según complejidad del inmueble y disponibilidad de comparables.</p></details>
        <details class="blog-faq-item"><summary>¿Hacéis valoraciones en toda el área metropolitana?</summary><p>Sí. Barcelona ciudad, L'Hospitalet, Badalona, Sant Cugat, Sant Adrià y resto del área metropolitana. Conocemos las particularidades de cada distrito y municipio.</p></details>
        <details class="blog-faq-item"><summary>¿Qué pasa si decido vender con NuevaHabitat?</summary><p>El servicio cuesta 3.000 € + IVA, cobrados solo en escritura. Incluye todo: fotografía, publicación, filtrado, visitas, negociación y acompañamiento legal.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres saber cuánto vale tu piso con datos reales de mercado?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Realizamos valoraciones gratuitas en Barcelona y área metropolitana desde 2026. Analizamos operaciones por distrito — Eixample, Gràcia, Les Corts, Poblenou, Nou Barris — con datos de mercado, no suposiciones.</p>
        </div>
      </aside>
      `,
    },
    'comision-inmobiliaria-barcelona': {
      readMin: 8,
      faq: [
        { q: '¿Cuánto cobra una inmobiliaria en Barcelona por vender?', a: 'La comisión media oscila entre el 3% y el 5% del precio de venta más IVA. En un piso de 400.000 €, eso supone 14.520–24.200 €. NuevaHabitat cobra 3.000 € + IVA fijos, solo en escritura.' },
        { q: '¿Qué debe incluir la comisión de una agencia?', a: 'Valoración, fotografía profesional, publicación en portales, filtrado de compradores, visitas, negociación y acompañamiento hasta escritura. Muchas agencias cobran extras por cada servicio; pregunta antes de firmar exclusiva.' },
        { q: '¿Es obligatorio firmar exclusiva con una inmobiliaria?', a: 'No es legalmente obligatorio, pero muchas agencias lo exigen. Revisa duración (6–12 meses habitual), condiciones de rescisión y qué pasa si no venden en plazo. NuevaHabitat no aplica exclusivas abusivas.' },
        { q: '¿Puedo negociar la comisión inmobiliaria?', a: 'A veces, especialmente en pisos de alto valor o en mercados con poca rotación. Pero negociar del 5% al 4% sigue siendo mucho más caro que un precio fijo de 3.000 € + IVA en operaciones de 300.000 €+.' },
        { q: '¿Cuánto ahorro con el modelo precio fijo de NuevaHabitat?', a: 'En un piso de 400.000 € vendido al 5% tradicional pagarías 24.200 €. Con NuevaHabitat: 3.630 €. Ahorro superior a 20.000 € con servicio completo incluido.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Comisión tradicional en Barcelona: 3–5% del precio de venta + IVA (hasta 24.000 €+ en pisos de 400.000 €).</li>
          <li>Verifica qué incluye: fotos, portales, negociación y arras suelen ser extras en muchas agencias.</li>
          <li>Exclusivas de 6–12 meses te atan aunque no vendan.</li>
          <li>NuevaHabitat: 3.000 € + IVA fijos, todo incluido, cobro solo en escritura.</li>
          <li>En Les Corts, un piso de 400.000 € ahorra más de 21.000 € vs agencia al 6%.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#comision-media">Comisión media en Barcelona</a></li>
          <li><a href="#que-incluye">Qué debe incluir la comisión</a></li>
          <li><a href="#exclusivas">Exclusivas y permanencias</a></li>
          <li><a href="#tabla-costes">Tabla de costes por precio</a></li>
          <li><a href="#modelo-fijo">Alternativa: precio fijo</a></li>
          <li><a href="#preguntas-agencia">Preguntas antes de firmar</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>La comisión inmobiliaria en Barcelona es uno de los costes más opacos para quien vende. "El 3%" suena razonable hasta que calculas sobre 450.000 € y descubres que son 16.335 € (con IVA) — y que la fotografía, la publicación premium o la gestión de arras van aparte. Esta guía desglosa cuánto cobran las agencias, qué debes exigir incluido y por qué el modelo de precio fijo de NuevaHabitat cambia la ecuación.</p>
      <h2 id="comision-media">Comisión media en Barcelona 2026</h2>
      <p>El rango habitual es 3–5% del precio de venta + IVA (21%). En operaciones de 300.000–500.000 € — frecuentes en Les Corts, Poblenou, Sant Andreu o Gràcia — el coste para el vendedor oscila entre 10.890 € y 30.250 €. La comisión se paga al cierre, pero te atas con exclusiva meses antes, a veces sin garantía de resultado.</p>
      <h2 id="que-incluye">Qué debe incluir la comisión (y qué suele ser extra)</h2>
      <p><strong>Debe incluir</strong>: valoración, reportaje fotográfico, publicación en portales principales, gestión de visitas, filtrado de compradores, negociación, coordinación de arras y acompañamiento a escritura. <strong>Suele ser extra</strong>: fotografía "profesional" (200–500 €), publicación destacada en portales, home staging, revisión legal de contratos, gestión de certificado energético o nota simple.</p>
      <p>Pregunta por escrito qué incluye antes de firmar. Una comisión al 4% sin servicios completos puede salir más cara que 3.000 € + IVA con todo incluido.</p>
      <h2 id="exclusivas">Exclusivas y permanencias: letra pequeña</h2>
      <p>La exclusiva obliga a vender solo con esa agencia durante 6–12 meses. Si no venden, has perdido tiempo y posiblemente debes pagar penalización o renovar. Algunas exclusivas incluyen cláusulas de comisión doble si vendes por tu cuenta a alguien que visitó con la agencia. Lee el contrato completo antes de firmar.</p>
      <h2 id="tabla-costes">Tabla de costes por precio de venta</h2>
      <table class="blog-table">
        <thead><tr><th>Precio venta</th><th>3% + IVA</th><th>4% + IVA</th><th>5% + IVA</th><th>NuevaHabitat (fijo)</th></tr></thead>
        <tbody>
          <tr><td>250.000 €</td><td>9.075 €</td><td>12.100 €</td><td>15.125 €</td><td>3.630 €</td></tr>
          <tr><td>350.000 €</td><td>12.705 €</td><td>16.940 €</td><td>21.175 €</td><td>3.630 €</td></tr>
          <tr><td>450.000 €</td><td>16.335 €</td><td>21.780 €</td><td>27.225 €</td><td>3.630 €</td></tr>
          <tr><td>550.000 €</td><td>19.965 €</td><td>26.620 €</td><td>33.275 €</td><td>3.630 €</td></tr>
        </tbody>
      </table>
      <h2 id="modelo-fijo">Alternativa: precio fijo NuevaHabitat</h2>
      <p><strong>3.000 € + IVA</strong>, cobrados solo en escritura. Todo incluido: valoración, fotografía, publicación, filtrado, visitas, negociación, revisión documental (nota simple, ITE, certificado energético) y acompañamiento legal. Sin exclusivas abusivas. Si no vendes, no pagas. Compara en <a href="/vender-les-corts">Les Corts</a>: ahorro de más de 21.000 € en piso de 400.000 € vs agencia al 6%.</p>
      <h2 id="preguntas-agencia">Preguntas antes de firmar con cualquier agencia</h2>
      <p>¿Qué incluye la comisión exactamente? ¿Duración de exclusiva y condiciones de rescisión? ¿Qué pasa si no venden en plazo? ¿Publicación en qué portales? ¿Quién paga fotografía y certificado energético? ¿Cómo filtran compradores? ¿Acompañan arras y escritura? <a href="/vender">Consulta condiciones NuevaHabitat</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto cobra una inmobiliaria en Barcelona por vender?</summary><p>La comisión media oscila entre el 3% y el 5% del precio de venta más IVA. En un piso de 400.000 €, eso supone 14.520–24.200 €. NuevaHabitat cobra 3.000 € + IVA fijos, solo en escritura.</p></details>
        <details class="blog-faq-item"><summary>¿Qué debe incluir la comisión de una agencia?</summary><p>Valoración, fotografía profesional, publicación en portales, filtrado de compradores, visitas, negociación y acompañamiento hasta escritura. Muchas agencias cobran extras por cada servicio; pregunta antes de firmar exclusiva.</p></details>
        <details class="blog-faq-item"><summary>¿Es obligatorio firmar exclusiva con una inmobiliaria?</summary><p>No es legalmente obligatorio, pero muchas agencias lo exigen. Revisa duración (6–12 meses habitual), condiciones de rescisión y qué pasa si no venden en plazo. NuevaHabitat no aplica exclusivas abusivas.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo negociar la comisión inmobiliaria?</summary><p>A veces, especialmente en pisos de alto valor o en mercados con poca rotación. Pero negociar del 5% al 4% sigue siendo mucho más caro que un precio fijo de 3.000 € + IVA en operaciones de 300.000 €+.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto ahorro con el modelo precio fijo de NuevaHabitat?</summary><p>En un piso de 400.000 € vendido al 5% tradicional pagarías 24.200 €. Con NuevaHabitat: 3.630 €. Ahorro superior a 20.000 € con servicio completo incluido.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres vender sin comisiones porcentuales? Precio fijo transparente.</p>
        <a href="/vender" class="btn">Consultar condiciones</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Desde 2026 ofrecemos en Barcelona el modelo precio fijo que elimina comisiones porcentuales: 3.000 € + IVA, solo en escritura. Operamos en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'comprar-piso-barcelona-guia': {
      readMin: 12,
      faq: [
        { q: '¿Cuáles son los pasos para comprar un piso en Barcelona?', a: 'Define presupuesto real (precio + ITP 10–11% + gastos), consigue preaprobación hipotecaria, busca en zonas objetivo, visita con due diligence (nota simple, ITE, certificado energético), negocia, firma arras con condición suspensiva de hipoteca y cierra en escritura en 30–90 días.' },
        { q: '¿Cuánto dinero extra necesito además del precio?', a: 'Aproximadamente 12–15% adicional: ITP Cataluña (10–11%), notaría (300–800 €), registro (400–650 €), gestoría (300–500 €) y tasación si hay hipoteca. Para 350.000 €, unos 42.000–52.000 € extra.' },
        { q: '¿Qué zonas recomendáis para comprar en 2026?', a: 'Depende de presupuesto y perfil. Eixample y Sarrià (prime), Gràcia/Poblenou/Les Corts (equilibrio), Sant Andreu/Nou Barris (accesible), L\'Hospitalet/Badalona (área metropolitana), Sant Cugat (familiar).' },
        { q: '¿Debo revisar la ITE antes de comprar?', a: 'Sí, especialmente en edificios pre-1960. ITE desfavorable puede implicar derramas futuras que encarecen tu coste real. Pide informe de finca y revisa actas de comunidad.' },
        { q: '¿Cuánto cuesta el servicio de compra NuevaHabitat?', a: '5.000 € + IVA, cobrados solo en escritura. Incluye búsqueda activa, negociación, due diligence, asesoría hipotecaria, coordinación de arras y acompañamiento hasta firma.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Presupuesto real = precio + 12–15% (ITP Cataluña 10–11%, notaría, registro, gestoría).</li>
          <li>Preaprobación hipotecaria antes de buscar; el banco financia hasta 80% de tasación.</li>
          <li>Due diligence: nota simple, ITE, certificado energético, comunidad al corriente.</li>
          <li>Arras con condición suspensiva de hipoteca; plazo escritura 30–90 días.</li>
          <li>NuevaHabitat acompaña todo el proceso por 5.000 € + IVA, solo en escritura.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#presupuesto">Presupuesto y ahorro necesario</a></li>
          <li><a href="#financiacion">Financiación y preaprobación</a></li>
          <li><a href="#busqueda">Búsqueda por zonas</a></li>
          <li><a href="#visitas-due-diligence">Visitas y due diligence</a></li>
          <li><a href="#oferta-arras">Oferta, arras y escritura</a></li>
          <li><a href="#tabla-pasos">Tabla resumen de pasos</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Comprar piso en Barcelona en 2026 requiere planificación rigurosa: mercado activo pero selectivo, precios dispersos entre Eixample y Nou Barris, y costes ocultos que pueden superar el 12% del precio de compra. Esta guía recorre cada fase — desde el ahorro hasta la escritura — con consejos accionables y datos del mercado catalán.</p>
      <h2 id="presupuesto">Presupuesto y ahorro necesario</h2>
      <p>Regla práctica: multiplica el precio objetivo por 1,32–1,35 para obtener el desembolso total. Piso de 350.000 € en Sant Andreu o L'Hospitalet: 70.000 € entrada (20%) + 35.000–38.500 € ITP + 1.500–2.000 € gastos = <strong>106.500–110.500 €</strong> de ahorro necesario. En Eixample, con pisos de 450.000–550.000 €, supera fácilmente los 140.000 €.</p>
      <p>No olvides reservar colchón para imprevistos: reformas menores tras la compra, mobiliario, mudanza y primer mes de comunidad. Compradores primerizos en Barcelona suelen subestimar estos costes en 5.000–10.000 €. Calcula con el tramo alto del ITP (11%) para no quedarte corto si el precio de compra supera ciertos umbrales en Cataluña.</p>
      <h2 id="financiacion">Financiación y preaprobación</h2>
      <p>Bancos financian hasta 80% de tasación, no siempre de precio de compra. Si pagas por encima de tasación, la diferencia es ahorro propio adicional. Pide preaprobación antes de visitar; compara TAE entre entidades. NuevaHabitat incluye asesoría hipotecaria. <a href="/hipotecas">Calculadora</a>.</p>
      <h2 id="busqueda">Búsqueda por zonas en Barcelona y área</h2>
      <p><strong>Eixample / Sarrià</strong> (5.000–7.500 €/m²): máxima demanda, poca negociación. <strong>Gràcia / Poblenou / Les Corts</strong> (4.200–5.800 €/m²): equilibrio calidad-precio. <strong>Sant Andreu / Nou Barris</strong> (3.200–4.500 €/m²): accesible. <strong>L'Hospitalet / Badalona</strong> (2.800–3.800 €/m²): área metropolitana. <strong>Sant Cugat</strong> (4.500–6.000 €/m²): perfil familiar. <a href="/inmuebles">Ver inmuebles disponibles</a>.</p>
      <h2 id="visitas-due-diligence">Visitas y due diligence</h2>
      <p>Checklist por visita: humedades, ruido, orientación, estado instalaciones. Solicita nota simple (titularidad, cargas), certificado energético, ITE del edificio, certificado comunidad al corriente, acta de obras pendientes. En Ciutat Vella y Eixample antiguo, ITE desfavorable implica derramas futuras. Segunda visita a distinta hora revela problemas de luz o vecindad.</p>
      <p>Pregunta por reformas recientes en fachada o instalaciones comunes: en edificios del Eixample y Gràcia con más de 80 años, las actuaciones de rehabilitación pueden generar derramas de 3.000–15.000 € por vivienda. Verifica también si hay locales comerciales en planta baja que puedan afectar al ruido o tráfico de vecinos.</p>
      <h2 id="oferta-arras">Oferta, arras y escritura</h2>
      <p>Oferta razonable (5–8% bajo precio de salida si hay margen) con preaprobación y plazo corto. Arras con condición suspensiva de hipoteca a 30–45 días. Verifica tipo de arras (penitenciales habituales), importe (5–10%) y plazo hasta escritura (30–90 días). ITP Cataluña 10–11% lo paga el comprador en vivienda usada.</p>
      <p>En mercados competitivos como Poblenou o Les Corts, una oferta acompañada de carta de preaprobación bancaria y flexibilidad en fecha de escritura puede compensar un descuento moderado. Evita condiciones vagas en las arras: especifica qué documentos debe entregar el vendedor y qué ocurre si la tasación bancaria es inferior al precio pactado.</p>
      <h2 id="tabla-pasos">Tabla resumen del proceso de compra</h2>
      <table class="blog-table">
        <thead><tr><th>Fase</th><th>Acción</th><th>Plazo orientativo</th></tr></thead>
        <tbody>
          <tr><td>1. Preparación</td><td>Presupuesto, ahorro, preaprobación hipoteca</td><td>2–8 semanas</td></tr>
          <tr><td>2. Búsqueda</td><td>Visitas con due diligence documental</td><td>4–12 semanas</td></tr>
          <tr><td>3. Oferta</td><td>Negociación con comparables de mercado</td><td>1–2 semanas</td></tr>
          <tr><td>4. Arras</td><td>Contrato con condición suspensiva hipoteca</td><td>1–2 semanas post-oferta</td></tr>
          <tr><td>5. Escritura</td><td>Firma notarial, ITP, registro</td><td>30–90 días post-arras</td></tr>
        </tbody>
      </table>
      <p>NuevaHabitat acompaña cada fase por <strong>5.000 € + IVA</strong>, cobrado solo en escritura. <a href="/comprar">Activar búsqueda</a> · <a href="/contacto">Consulta gratuita</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuáles son los pasos para comprar un piso en Barcelona?</summary><p>Define presupuesto real (precio + ITP 10–11% + gastos), consigue preaprobación hipotecaria, busca en zonas objetivo, visita con due diligence (nota simple, ITE, certificado energético), negocia, firma arras con condición suspensiva de hipoteca y cierra en escritura en 30–90 días.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto dinero extra necesito además del precio?</summary><p>Aproximadamente 12–15% adicional: ITP Cataluña (10–11%), notaría (300–800 €), registro (400–650 €), gestoría (300–500 €) y tasación si hay hipoteca. Para 350.000 €, unos 42.000–52.000 € extra.</p></details>
        <details class="blog-faq-item"><summary>¿Qué zonas recomendáis para comprar en 2026?</summary><p>Depende de presupuesto y perfil. Eixample y Sarrià (prime), Gràcia/Poblenou/Les Corts (equilibrio), Sant Andreu/Nou Barris (accesible), L'Hospitalet/Badalona (área metropolitana), Sant Cugat (familiar).</p></details>
        <details class="blog-faq-item"><summary>¿Debo revisar la ITE antes de comprar?</summary><p>Sí, especialmente en edificios pre-1960. ITE desfavorable puede implicar derramas futuras que encarecen tu coste real. Pide informe de finca y revisa actas de comunidad.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta el servicio de compra NuevaHabitat?</summary><p>5.000 € + IVA, cobrados solo en escritura. Incluye búsqueda activa, negociación, due diligence, asesoría hipotecaria, coordinación de arras y acompañamiento hasta firma.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Compras piso en Barcelona? Te acompañamos de la búsqueda a la escritura.</p>
        <a href="/comprar" class="btn">Empezar búsqueda</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Acompañamos compras en Barcelona y área metropolitana desde 2026: Eixample, Gràcia, Les Corts, Poblenou, Nou Barris, L'Hospitalet, Badalona y Sant Cugat.</p>
        </div>
      </aside>
      `,
    },
    'comprar-casa-area-metropolitana': {
      readMin: 10,
      faq: [
        { q: '¿Dónde comprar en el área metropolitana de Barcelona con mejor relación calidad-precio?', a: 'L\'Hospitalet y Badalona ofrecen los precios más accesibles (2.800–3.800 €/m²) con metro directo. Sant Cugat atrae familias (4.500–6.000 €/m²). Sant Andreu y Nou Barris dentro de Barcelona también son alternativas competitivas.' },
        { q: '¿Compensa comprar fuera de Barcelona ciudad?', a: 'Sí si calculas coste total: precio/m² + ITP (10–11%) + tiempo y coste de desplazamiento diario. Ahorrar 1.000 €/m² en L\'Hospitalet puede compensar 30 minutos extra de transporte, según tu situación laboral.' },
        { q: '¿El ITP es igual en todos los municipios de Cataluña?', a: 'Sí, el ITP es autonómico: 10–11% en Cataluña independientemente del municipio. La plusvalía municipal y algunos impuestos locales sí varían entre Barcelona, L\'Hospitalet, Badalona y Sant Cugat.' },
        { q: '¿Qué municipios tienen mejor conexión con Barcelona?', a: 'L\'Hospitalet (L1, L5, L9), Badalona (L2, Rodalies), Sant Adrià (L2, tram), Santa Coloma (L1, L9). Sant Cugat (Ferrocarrils) orienta a perfil familiar con coche o tren.' },
        { q: '¿NuevaHabitat trabaja fuera de Barcelona ciudad?', a: 'Sí. Cubrimos toda el área metropolitana con datos de mercado actualizados. Servicio de compra: 5.000 € + IVA, solo en escritura.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>El área metropolitana ofrece más metros por euro que Barcelona ciudad.</li>
          <li>L'Hospitalet y Badalona: 2.800–3.800 €/m² con metro directo.</li>
          <li>Sant Cugat: 4.500–6.000 €/m², perfil familiar y colegios.</li>
          <li>ITP Cataluña 10–11% igual en todos los municipios; plusvalía varía.</li>
          <li>Calcula coste total: precio + impuestos + desplazamiento diario.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#por-que-area">Por qué mirar fuera de Barcelona</a></li>
          <li><a href="#hospitalet-badalona">L'Hospitalet y Badalona</a></li>
          <li><a href="#sant-cugat">Sant Cugat del Vallès</a></li>
          <li><a href="#barcelona-periferia">Sant Andreu y Nou Barris</a></li>
          <li><a href="#tabla-precios">Tabla precios por municipio</a></li>
          <li><a href="#como-elegir">Cómo elegir municipio según perfil</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>No todo el mundo puede o quiere comprar piso en Barcelona ciudad. El área metropolitana concentra el 60% de la población metropolitana y ofrece alternativas con mejor relación calidad-precio, especialmente para primeras viviendas. Pero elegir municipio no es solo comparar €/m²: transporte, servicios, perspectiva de revalorización y coste total (ITP Cataluña 10–11%, desplazamientos) determinan la decisión correcta.</p>
      <h2 id="por-que-area">Por qué mirar fuera de Barcelona ciudad</h2>
      <p>Barcelona ciudad concentra demanda en Eixample, Gràcia, Sarrià y Poblenou, empujando precios a 4.000–7.500 €/m². Familias jóvenes, teletrabajadores híbridos e inversores moderados encuentran en el área metropolitana más metros, zonas verdes y precios un 20–40% inferiores según municipio. La clave es no comprar "barato" sin calcular coste de desplazamiento y servicios.</p>
      <h2 id="hospitalet-badalona">L'Hospitalet y Badalona</h2>
      <p><strong>L'Hospitalet</strong>: segundo municipio más poblado de Cataluña. Precios de 2.800–3.800 €/m². Metro L1, L5 y L9 conectan con centro en 15–25 minutos. Zonas como Collblanc, Can Serra o Centre tienen stock variado. <strong>Badalona</strong>: litoral, L2 y Rodalies. Precios similares, ambiente más residencial en algunos tramos. Ambos municipios concentran primera vivienda e inversión moderada.</p>
      <h2 id="sant-cugat">Sant Cugat del Vallès</h2>
      <p>Referencia para familias: colegios privados y concertados, espacios verdes, Ferrocarrils a Barcelona (20–25 min). Precios de 4.500–6.000 €/m², comparables a Gràcia o Les Corts pero con perfil más residencial. Demanda estable; menos negociación que en L'Hospitalet. Ideal si priorizas calidad de vida y tienes flexibilidad de transporte (coche o tren).</p>
      <h2 id="barcelona-periferia">Sant Andreu y Nou Barris (dentro de Barcelona)</h2>
      <p>Antes de salir del término municipal, considera distritos barceloneses con precios accesibles. <strong>Sant Andreu</strong>: 3.800–4.500 €/m², mejora con Sagrera y conexiones. <strong>Nou Barris</strong>: 3.200–4.000 €/m², máxima accesibilidad dentro de Barcelona. Mantienes ventajas fiscales y servicios de capital sin precios de Eixample.</p>
      <h2 id="tabla-precios">Tabla precios orientativos por municipio (2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Municipio / zona</th><th>€/m² orientativo</th><th>Transporte a Barcelona</th><th>Perfil</th></tr></thead>
        <tbody>
          <tr><td>Barcelona (Eixample / Sarrià)</td><td>5.500 – 7.500</td><td>—</td><td>Prime, profesionales</td></tr>
          <tr><td>Barcelona (Gràcia / Les Corts / Poblenou)</td><td>4.200 – 5.800</td><td>—</td><td>Familias, jóvenes profesionales</td></tr>
          <tr><td>Barcelona (Sant Andreu / Nou Barris)</td><td>3.200 – 4.500</td><td>—</td><td>Primera vivienda</td></tr>
          <tr><td>L'Hospitalet</td><td>2.800 – 3.800</td><td>Metro 15–25 min</td><td>Accesible, metro directo</td></tr>
          <tr><td>Badalona</td><td>2.800 – 3.800</td><td>Metro/Rodalies 20–30 min</td><td>Litoral, familias</td></tr>
          <tr><td>Sant Cugat</td><td>4.500 – 6.000</td><td>Ferrocarrils 20–25 min</td><td>Familias, colegios</td></tr>
        </tbody>
      </table>
      <h2 id="como-elegir">Cómo elegir municipio según tu perfil</h2>
      <p><strong>Primera vivienda con presupuesto ajustado</strong>: L'Hospitalet, Badalona, Nou Barris. <strong>Familia con niños</strong>: Sant Cugat, Sant Andreu, Les Corts. <strong>Teletrabajo híbrido</strong>: municipios con buena conexión pero más espacio (Sant Cugat, Badalona). <strong>Inversión</strong>: zonas con revalorización proyectada (Poblenou, Sant Andreu, tramos de L'Hospitalet).</p>
      <p>NuevaHabitat trabaja toda el área metropolitana con datos actualizados. Servicio de compra: <strong>5.000 € + IVA</strong>, solo en escritura. <a href="/inmuebles">Ver inmuebles</a> · <a href="/comprar">Activar búsqueda personalizada</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Dónde comprar en el área metropolitana de Barcelona con mejor relación calidad-precio?</summary><p>L'Hospitalet y Badalona ofrecen los precios más accesibles (2.800–3.800 €/m²) con metro directo. Sant Cugat atrae familias (4.500–6.000 €/m²). Sant Andreu y Nou Barris dentro de Barcelona también son alternativas competitivas.</p></details>
        <details class="blog-faq-item"><summary>¿Compensa comprar fuera de Barcelona ciudad?</summary><p>Sí si calculas coste total: precio/m² + ITP (10–11%) + tiempo y coste de desplazamiento diario. Ahorrar 1.000 €/m² en L'Hospitalet puede compensar 30 minutos extra de transporte, según tu situación laboral.</p></details>
        <details class="blog-faq-item"><summary>¿El ITP es igual en todos los municipios de Cataluña?</summary><p>Sí, el ITP es autonómico: 10–11% en Cataluña independientemente del municipio. La plusvalía municipal y algunos impuestos locales sí varían entre Barcelona, L'Hospitalet, Badalona y Sant Cugat.</p></details>
        <details class="blog-faq-item"><summary>¿Qué municipios tienen mejor conexión con Barcelona?</summary><p>L'Hospitalet (L1, L5, L9), Badalona (L2, Rodalies), Sant Adrià (L2, tram), Santa Coloma (L1, L9). Sant Cugat (Ferrocarrils) orienta a perfil familiar con coche o tren.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat trabaja fuera de Barcelona ciudad?</summary><p>Sí. Cubrimos toda el área metropolitana con datos de mercado actualizados. Servicio de compra: 5.000 € + IVA, solo en escritura.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Buscas casa en el área metropolitana de Barcelona?</p>
        <a href="/comprar" class="btn">Activar búsqueda</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Conocemos el área metropolitana barcelonesa desde 2026: L'Hospitalet, Badalona, Sant Cugat, Sant Andreu, Nou Barris y Barcelona ciudad. Datos de mercado por municipio, no generalizaciones.</p>
        </div>
      </aside>
      `,
    },
    'documentos-vender-piso': {
      readMin: 10,
      faq: [
        { q: '¿Qué documentos necesito para vender un piso en Cataluña?', a: 'Nota simple del Registro, certificado de eficiencia energético (obligatorio), ITE si el edificio lo exige, certificado de comunidad al corriente, último recibo de IBI, plano si existe, y contrato de alquiler si hay inquilino.' },
        { q: '¿Cuánto cuesta el certificado energético?', a: 'Entre 100 y 200 € según metros y tipología. Es obligatorio para vender; sin él no puedes formalizar la operación. Tiene validez de 10 años si no hay reformas que cambien la calificación.' },
        { q: '¿Qué es la nota simple y dónde se solicita?', a: 'Documento del Registro de la Propiedad que acredita titularidad, cargas y descripción del inmueble. Se solicita online en sede electrónica del Registro o presencialmente. Imprescindible antes de arras.' },
        { q: '¿La ITE es obligatoria para vender?', a: 'La ITE es obligatoria para el edificio, no para el piso individual. Pero el comprador la pedirá: si es desfavorable, puede negociar descuento o condicionar la operación. Informa desde el inicio.' },
        { q: '¿NuevaHabitat ayuda a preparar la documentación?', a: 'Sí. Te guiamos en la recopilación documental antes de publicar para acelerar la venta. Servicio de venta: 3.000 € + IVA, solo en escritura.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Reúne documentación antes de publicar: acelera ventas y evita sorpresas en arras.</li>
          <li>Obligatorios: nota simple, certificado energético. ITE si aplica al edificio.</li>
          <li>Comunidad al corriente, IBI y contrato de alquiler (si hay inquilino) son imprescindibles.</li>
          <li>En Barcelona, edificios pre-1960 suelen tener requisitos ITE más estrictos.</li>
          <li>NuevaHabitat guía la preparación documental como parte del servicio de venta.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#documentos-obligatorios">Documentos obligatorios</a></li>
          <li><a href="#nota-simple">Nota simple del Registro</a></li>
          <li><a href="#certificado-energetico">Certificado energético</a></li>
          <li><a href="#ite-finca">ITE y estado de la finca</a></li>
          <li><a href="#tabla-checklist">Checklist completo</a></li>
          <li><a href="#comunidad-ibi">Comunidad, IBI y alquiler</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Vender vivienda en Barcelona sin documentación preparada es la receta para meses de retrasos. Un comprador serio — especialmente si viene con hipoteca preaprobada — pedirá nota simple, certificado energético e informe de finca en la primera visita. Tenerlo listo transmite profesionalidad, acelera arras y evita descuentos de última hora por sorpresas documentales. Este checklist recorre todo lo necesario en Cataluña en 2026.</p>
      <h2 id="documentos-obligatorios">Documentos obligatorios para vender</h2>
      <p><strong>Certificado de eficiencia energético</strong>: obligatorio por ley para vender o alquilar. Sin él, la operación no puede formalizarse. <strong>Nota simple</strong>: acredita que eres titular y revela cargas (hipotecas, embargos). El comprador y su banco la exigirán. <strong>ITE</strong> (Inspección Técnica de Edificios): obligatoria para el edificio según antigüedad; aunque no es del piso individual, el comprador la revisará.</p>
      <h2 id="nota-simple">Nota simple del Registro de la Propiedad</h2>
      <p>Solicítala en la sede electrónica del Registro o presencialmente. Debe estar actualizada (menos de 3 meses recomendable). Verifica: titularidad correcta, superficie registral, cargas hipotecarias pendientes, usufructos o servidumbres. Si hay hipoteca, coordina cancelación registral antes o simultáneamente a la escritura. Cargas no declaradas son causa frecuente de ruptura de operaciones en Eixample y Gràcia.</p>
      <h2 id="certificado-energetico">Certificado energético</h2>
      <p>Lo emite un técnico certificador. Coste: 100–200 € según metros. Validez: 10 años si no hay reformas que alteren la calificación. Clases A–C facilitan venta y financiación; E–G pueden generar negociación de descuento. En Barcelona, con normativa europea cada vez más exigente, el certificado energético pesa más en la decisión del comprador.</p>
      <h2 id="ite-finca">ITE y estado de la finca</h2>
      <p>En Cataluña, edificios de más de 45 años deben pasar ITE periódica. Si el resultado es desfavorable o hay obras pendientes en fachada, instalaciones o estructura, el comprador puede exigir descuento o condicionar arras. En Ciutat Vella, Eixample antiguo y Sant Andreu hay muchos edificios pre-1960: informa la situación real desde el inicio. Ocultar ITE desfavorable solo retrasa hasta la due diligence.</p>
      <h2 id="tabla-checklist">Checklist documental completo</h2>
      <table class="blog-table">
        <thead><tr><th>Documento</th><th>Obligatorio</th><th>Quién lo pide</th><th>Plazo recomendado</th></tr></thead>
        <tbody>
          <tr><td>Nota simple</td><td>Sí (práctica)</td><td>Comprador, banco, notaría</td><td>Antes de publicar</td></tr>
          <tr><td>Certificado energético</td><td>Sí (legal)</td><td>Notaría, comprador</td><td>Antes de publicar</td></tr>
          <tr><td>ITE del edificio</td><td>Sí (edificio)</td><td>Comprador, banco</td><td>Antes de arras</td></tr>
          <tr><td>Certificado comunidad</td><td>No (práctica)</td><td>Comprador</td><td>Antes de arras</td></tr>
          <tr><td>Último recibo IBI</td><td>No</td><td>Comprador, gestoría</td><td>Antes de escritura</td></tr>
          <tr><td>Contrato alquiler vigente</td><td>Si hay inquilino</td><td>Comprador</td><td>Antes de arras</td></tr>
          <tr><td>Plano de la vivienda</td><td>No</td><td>Comprador (opcional)</td><td>Si disponible</td></tr>
        </tbody>
      </table>
      <h2 id="comunidad-ibi">Comunidad, IBI y situación de alquiler</h2>
      <p>Certificado de la comunidad de propietarios acreditando que estás al corriente de pagos. Deudas se descuentan en escritura o se abonan antes. Revisa actas: derramas aprobadas, obras pendientes. Último recibo de IBI para verificar referencia catastral. Si hay inquilino, facilita contrato de alquiler vigente: afecta a posession y precio (vender ocupado vs vacío).</p>
      <p>NuevaHabitat te guía en la preparación documental antes de publicar. Servicio de venta: <strong>3.000 € + IVA</strong>, solo en escritura. <a href="/vender">Solicita valoración gratuita</a> · <a href="/vender-les-corts">Vender en Les Corts</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Qué documentos necesito para vender un piso en Cataluña?</summary><p>Nota simple del Registro, certificado de eficiencia energético (obligatorio), ITE si el edificio lo exige, certificado de comunidad al corriente, último recibo de IBI, plano si existe, y contrato de alquiler si hay inquilino.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta el certificado energético?</summary><p>Entre 100 y 200 € según metros y tipología. Es obligatorio para vender; sin él no puedes formalizar la operación. Tiene validez de 10 años si no hay reformas que cambien la calificación.</p></details>
        <details class="blog-faq-item"><summary>¿Qué es la nota simple y dónde se solicita?</summary><p>Documento del Registro de la Propiedad que acredita titularidad, cargas y descripción del inmueble. Se solicita online en sede electrónica del Registro o presencialmente. Imprescindible antes de arras.</p></details>
        <details class="blog-faq-item"><summary>¿La ITE es obligatoria para vender?</summary><p>La ITE es obligatoria para el edificio, no para el piso individual. Pero el comprador la pedirá: si es desfavorable, puede negociar descuento o condicionar la operación. Informa desde el inicio.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat ayuda a preparar la documentación?</summary><p>Sí. Te guiamos en la recopilación documental antes de publicar para acelerar la venta. Servicio de venta: 3.000 € + IVA, solo en escritura.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Preparas la documentación para vender tu piso en Barcelona?</p>
        <a href="/vender" class="btn">Valoración gratuita</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Gestionamos ventas en Barcelona desde 2026 con documentación completa desde el inicio: nota simple, ITE, certificado energético y comunidad. Operamos en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'buscar-piso-hipoteca-barcelona': {
      readMin: 11,
      faq: [
        { q: '¿Debo conseguir la hipoteca antes o después de buscar piso?', a: 'Antes. Consigue preaprobación o carta de viabilidad bancaria antes de visitar intensivamente. Así sabrás tu techo real de precio y podrás hacer ofertas creíbles. Buscar sin financiación clara desperdicia tiempo tuyo y del vendedor.' },
        { q: '¿El banco financia el 80% del precio de compra?', a: 'No necesariamente. Financia hasta el 80% del valor de tasación. Si el precio de compra supera la tasación — frecuente en Barcelona — la diferencia sale de tu ahorro. En Eixample prime, tasaciones conservadoras son habituales.' },
        { q: '¿Qué revisar además del TIN en una hipoteca?', a: 'TAE (coste real), comisión de apertura, vinculaciones de seguros (hogar, vida), periodo de carencia, penalización por amortización anticipada y cláusula de revisión si es variable.' },
        { q: '¿Cómo hacer una oferta competitiva con hipoteca?', a: 'Presenta preaprobación bancaria, oferta por escrito con importe de arras y plazo corto para escritura (30–45 días), incluye condición suspensiva de hipoteca bien redactada y justifica el precio con comparables.' },
        { q: '¿NuevaHabitat incluye asesoría hipotecaria al comprar?', a: 'Sí. Comparamos entidades, gestionamos preaprobación y estructuramos la oferta. Incluido en servicio de compra: 5.000 € + IVA, solo en escritura.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Primero viabilidad bancaria, después búsqueda intensiva de piso.</li>
          <li>Financiación hasta 80% de tasación, no siempre de precio de compra.</li>
          <li>Compara TAE, no solo TIN; vinculaciones alteran el coste real.</li>
          <li>Oferta creíble = preaprobación + arras rápidas + condición suspensiva hipoteca.</li>
          <li>NuevaHabitat incluye asesoría hipotecaria en compra (5.000 € + IVA, solo en escritura).</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#orden-correcto">El orden correcto: hipoteca antes que piso</a></li>
          <li><a href="#financiacion-80">Financiación al 80% y tasación</a></li>
          <li><a href="#comparar-bancos">Comparar bancos: TIN vs TAE</a></li>
          <li><a href="#oferta-competitiva">Estructurar una oferta competitiva</a></li>
          <li><a href="#tabla-requisitos">Requisitos bancarios orientativos</a></li>
          <li><a href="#barcelona-particularidades">Particularidades en Barcelona</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Buscar piso con hipoteca en Barcelona exige disciplina: quien visita veinte pisos sin saber si el banco le financiará pierde semanas y quema oportunidades. El orden correcto es viabilidad bancaria primero, búsqueda después. Esta guía cubre requisitos de financiación, comparativa de ofertas, estructura de oferta de compra y particularidades del mercado barcelonés en 2026.</p>
      <h2 id="orden-correcto">El orden correcto: hipoteca antes que piso</h2>
      <p>Paso 1: calcula ahorro disponible (20% no financiado + ITP Cataluña 10–11% + gastos). Paso 2: solicita estudio de viabilidad o preaprobación en 2–3 bancos. Paso 3: define techo real de precio. Paso 4: busca solo inmuebles dentro de ese rango. Paso 5: visita con checklist documental (nota simple, ITE, certificado energético).</p>
      <p>Con preaprobación en mano, el vendedor te toma en serio. En mercados competitivos como Gràcia, Poblenou o Les Corts, una oferta sin financiación clara queda descartada.</p>
      <h2 id="financiacion-80">Financiación al 80% y el papel de la tasación</h2>
      <p>El banco financia hasta el 80% del valor de tasación, no del precio pactado. Ejemplo: compras en 400.000 €, tasación en 380.000 € → financiación máxima 304.000 € (80% de 380.000), no 320.000 €. Los 16.000 € de diferencia más el 20% no financiado salen de tu ahorro. En Eixample y Sarrià, tasaciones conservadoras en edificios con ITE pendiente son frecuentes.</p>
      <h2 id="comparar-bancos">Comparar bancos: TIN vs TAE</h2>
      <p>No te quedes con el primer banco. Compara al menos tres entidades: TIN, TAE, comisión de apertura, seguros vinculados, carencia, amortización anticipada. Una diferencia de 0,3 puntos en TAE sobre 280.000 € a 25 años supone más de 14.000 € de coste total. <a href="/hipotecas">Calculadora hipotecaria NuevaHabitat</a>.</p>
      <h2 id="oferta-competitiva">Estructurar una oferta competitiva</h2>
      <p>Oferta por escrito: precio, arras (5–10%), plazo escritura (30–45 días), condición suspensiva de hipoteca a 30 días, adjuntar preaprobación bancaria. Justifica precio con comparables si ofreces por debajo del anuncio. Rapidez y solvencia valen más que regateos agresivos en mercados con demanda.</p>
      <h2 id="tabla-requisitos">Requisitos bancarios orientativos (2026)</h2>
      <table class="blog-table">
        <thead><tr><th>Requisito</th><th>Valor orientativo</th><th>Notas</th></tr></thead>
        <tbody>
          <tr><td>Financiación máxima</td><td>80% tasación</td><td>No siempre 80% precio compra</td></tr>
          <tr><td>Cuota / ingresos netos</td><td>Máx. 30–35%</td><td>Incluye otras deudas</td></tr>
          <tr><td>Ahorro mínimo</td><td>20% + 12–15% gastos</td><td>ITP, notaría, registro</td></tr>
          <tr><td>Estabilidad laboral</td><td>Indefinido o >2 años</td><td>Autónomos: 2–3 años declaraciones</td></tr>
          <tr><td>Edad + plazo</td><td>Máx. 75 años al final</td><td>Plazo máximo 30 años habitual</td></tr>
        </tbody>
      </table>
      <h2 id="barcelona-particularidades">Particularidades del mercado barcelonés</h2>
      <p>Edificios antiguos (Eixample, Ciutat Vella, Gràcia): tasaciones afectadas por ITE y certificado energético. Zonas prime: precio de compra puede superar tasación. Área metropolitana (L'Hospitalet, Badalona): relación precio/tasación más alineada. Operaciones con inquilino: bancos pueden reducir financiación o exigir condiciones.</p>
      <p>NuevaHabitat incluye asesoría hipotecaria y estructuración de oferta en servicio de compra: <strong>5.000 € + IVA</strong>, solo en escritura. <a href="/comprar">Activar búsqueda</a> · <a href="/inmuebles">Ver inmuebles</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Debo conseguir la hipoteca antes o después de buscar piso?</summary><p>Antes. Consigue preaprobación o carta de viabilidad bancaria antes de visitar intensivamente. Así sabrás tu techo real de precio y podrás hacer ofertas creíbles. Buscar sin financiación clara desperdicia tiempo tuyo y del vendedor.</p></details>
        <details class="blog-faq-item"><summary>¿El banco financia el 80% del precio de compra?</summary><p>No necesariamente. Financia hasta el 80% del valor de tasación. Si el precio de compra supera la tasación — frecuente en Barcelona — la diferencia sale de tu ahorro. En Eixample prime, tasaciones conservadoras son habituales.</p></details>
        <details class="blog-faq-item"><summary>¿Qué revisar además del TIN en una hipoteca?</summary><p>TAE (coste real), comisión de apertura, vinculaciones de seguros (hogar, vida), periodo de carencia, penalización por amortización anticipada y cláusula de revisión si es variable.</p></details>
        <details class="blog-faq-item"><summary>¿Cómo hacer una oferta competitiva con hipoteca?</summary><p>Presenta preaprobación bancaria, oferta por escrito con importe de arras y plazo corto para escritura (30–45 días), incluye condición suspensiva de hipoteca bien redactada y justifica el precio con comparables.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat incluye asesoría hipotecaria al comprar?</summary><p>Sí. Comparamos entidades, gestionamos preaprobación y estructuramos la oferta. Incluido en servicio de compra: 5.000 € + IVA, solo en escritura.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Buscas piso con hipoteca en Barcelona? Te ayudamos con financiación y búsqueda.</p>
        <a href="/hipotecas" class="btn">Asesoría hipotecaria</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Asesoramos compras con hipoteca en Barcelona desde 2026. Comparamos bancos, gestionamos preaprobación y estructuramos ofertas en Eixample, Gràcia, Les Corts, Poblenou y área metropolitana.</p>
        </div>
      </aside>
      `,
    },
    'vender-piso-herencia-barcelona': {
      readMin: 11,
      faq: [
        { q: '¿Qué pasos legales hay antes de vender un piso heredado?', a: 'Aceptación de herencia (ante notario), pago del Impuesto de Sucesiones, inscripción registral a nombre del heredero y acuerdo entre coherederos sobre precio mínimo y reparto si hay varios titulares. Sin inscripción registral no puedes vender formalmente.' },
        { q: '¿Cuánto tarda el proceso de herencia antes de poder vender?', a: 'Entre 3 y 9 meses según complejidad: número de herederos, testamentos, bienes en varios registros, deudas del causante. Planifica antes de publicar el piso.' },
        { q: '¿Hay que pagar plusvalía al vender un piso heredado?', a: 'Sí, si ha habido incremento del valor catastral del suelo desde la adquisición (herencia) hasta la venta. El sujeto pasivo suele ser el vendedor (heredero). Varía según municipio: Barcelona, L\'Hospitalet y Badalona tienen ordenanzas distintas.' },
        { q: '¿Puedo vender si hay varios herederos?', a: 'Sí, pero todos deben estar de acuerdo en la venta y firmar. Si hay desacuerdo, puede requerirse partición judicial. Acuerda precio mínimo y reparto de proventos antes de publicar.' },
        { q: '¿NuevaHabitat gestiona ventas por herencia?', a: 'Sí, con discreción y precio fijo de 3.000 € + IVA, cobrado solo en escritura. Coordinamos valoración, documentación y venta cuando la herencia esté inscrita registralmente.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Antes de vender: aceptación de herencia, Impuesto de Sucesiones e inscripción registral.</li>
          <li>Plazo habitual: 3–9 meses según complejidad y número de herederos.</li>
          <li>Plusvalía municipal aplica si subió el valor catastral del suelo desde la herencia.</li>
          <li>Varios herederos requieren acuerdo unánime antes de publicar o firmar arras.</li>
          <li>NuevaHabitat acompaña ventas por herencia: 3.000 € + IVA, solo en escritura.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#pasos-previos">Pasos legales previos a la venta</a></li>
          <li><a href="#impuesto-sucesiones">Impuesto de Sucesiones</a></li>
          <li><a href="#inscripcion-registral">Inscripción registral</a></li>
          <li><a href="#coherederos">Varios herederos: acuerdos necesarios</a></li>
          <li><a href="#plusvalia-fiscalidad">Plusvalía y fiscalidad de la venta</a></li>
          <li><a href="#tabla-plazos">Tabla de plazos orientativos</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Vender un piso heredado en Barcelona añade capas legales y fiscales a una operación ya compleja. Antes de publicar en Idealista o firmar con una agencia, necesitas aceptación de herencia, pago de impuestos e inscripción registral a tu nombre. Si hay varios herederos, el consenso previo evita bloqueos. Esta guía recorre pasos, plazos y fiscalidad con enfoque práctico para el mercado catalán en 2026.</p>
      <h2 id="pasos-previos">Pasos legales previos a la venta</h2>
      <p>1. <strong>Certificado de defunción</strong> y localización de testamento (si existe) en el Registro de Últimas Voluntades. 2. <strong>Aceptación de herencia</strong> ante notario (puede ser a beneficio de inventario para limitar responsabilidad por deudas del causante). 3. <strong>Pago del Impuesto de Sucesiones</strong> en la Generalitat de Catalunya. 4. <strong>Inscripción en el Registro de la Propiedad</strong> a nombre del heredero. Solo entonces eres titular registral apto para vender.</p>
      <p>Publicar antes de completar estos pasos genera expectativas frustradas: compradores serios esperarán titularidad clara y nota simple sin incidencias.</p>
      <h2 id="impuesto-sucesiones">Impuesto de Sucesiones en Cataluña</h2>
      <p>Grava la adquisición mortis causa. Tipo y bonificaciones dependen del parentesco con el causante, valor de la herencia y convocatorias vigentes. Cónyuges y descendientes suelen tener bonificaciones; hermanos y sobrinos, tipos más altos. Calcula el impuesto antes de decidir si retener o vender el inmueble: en pisos de Eixample o Sarrià de alto valor, la carga fiscal puede ser significativa.</p>
      <h2 id="inscripcion-registral">Inscripción registral: requisito para vender</h2>
      <p>Tras aceptación e impuesto pagado, inscribe la herencia en el Registro de la Propiedad. Obtendrás nota simple a tu nombre, libre de cargas del causante (salvo hipoteca que deba cancelarse). Reúne también certificado energético e informa situación de ITE del edificio: el comprador lo pedirá igual que en cualquier venta.</p>
      <h2 id="coherederos">Varios herederos: acuerdos necesarios</h2>
      <p>Si sois varios titulares, acordad antes de publicar: precio mínimo de venta, reparto de proventos, quién firma arras y escritura, y qué ocurre si uno no quiere vender. La indivisión puede bloquear la operación; la partición judicial es lenta y costosa. Un mediador o agente con experiencia en herencias facilita consenso.</p>
      <h2 id="plusvalia-fiscalidad">Plusvalía y fiscalidad de la venta</h2>
      <p>Al vender, el heredero puede deber: <strong>plusvalía municipal</strong> (IIVTNU) si el valor catastral del suelo subió desde la fecha de adquisición por herencia hasta la venta; <strong>IRPF</strong> por ganancia patrimonial (precio venta menos valor de adquisición en herencia más gastos). Consulta con asesor fiscal: el timing de venta puede optimizar carga tributaria.</p>
      <h2 id="tabla-plazos">Tabla de plazos orientativos</h2>
      <table class="blog-table">
        <thead><tr><th>Trámite</th><th>Plazo orientativo</th><th>Depende de</th></tr></thead>
        <tbody>
          <tr><td>Localización testamento / declaración herederos</td><td>2 – 6 semanas</td><td>Existencia de testamento</td></tr>
          <tr><td>Aceptación de herencia notarial</td><td>1 – 2 semanas</td><td>Cita notaría, documentación</td></tr>
          <tr><td>Impuesto de Sucesiones</td><td>6 meses (plazo legal)</td><td>Valor herencia, bonificaciones</td></tr>
          <tr><td>Inscripción registral</td><td>2 – 8 semanas</td><td>Cargas del Registro</td></tr>
          <tr><td>Venta (post-inscripción)</td><td>45 – 90 días</td><td>Precio, documentación, mercado</td></tr>
        </tbody>
      </table>
      <p>Cuando la herencia esté inscrita, NuevaHabitat gestiona valoración, documentación (nota simple, certificado energético, ITE) y venta por <strong>3.000 € + IVA</strong>, solo en escritura. Operamos en Eixample, Gràcia, Les Corts, Nou Barris, Sant Andreu, L'Hospitalet y área metropolitana. <a href="/vender">Solicita valoración</a> · <a href="/contacto">Consulta tu caso</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Qué pasos legales hay antes de vender un piso heredado?</summary><p>Aceptación de herencia (ante notario), pago del Impuesto de Sucesiones, inscripción registral a nombre del heredero y acuerdo entre coherederos sobre precio mínimo y reparto si hay varios titulares. Sin inscripción registral no puedes vender formalmente.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto tarda el proceso de herencia antes de poder vender?</summary><p>Entre 3 y 9 meses según complejidad: número de herederos, testamentos, bienes en varios registros, deudas del causante. Planifica antes de publicar el piso.</p></details>
        <details class="blog-faq-item"><summary>¿Hay que pagar plusvalía al vender un piso heredado?</summary><p>Sí, si ha habido incremento del valor catastral del suelo desde la adquisición (herencia) hasta la venta. El sujeto pasivo suele ser el vendedor (heredero). Varía según municipio: Barcelona, L'Hospitalet y Badalona tienen ordenanzas distintas.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo vender si hay varios herederos?</summary><p>Sí, pero todos deben estar de acuerdo en la venta y firmar. Si hay desacuerdo, puede requerirse partición judicial. Acuerda precio mínimo y reparto de proventos antes de publicar.</p></details>
        <details class="blog-faq-item"><summary>¿NuevaHabitat gestiona ventas por herencia?</summary><p>Sí, con discreción y precio fijo de 3.000 € + IVA, cobrado solo en escritura. Coordinamos valoración, documentación y venta cuando la herencia esté inscrita registralmente.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Vendes un piso heredado en Barcelona? Te acompañamos con discreción.</p>
        <a href="/contacto" class="btn">Consulta tu caso</a>
      </aside>
      <aside class="blog-author">
        <div>
          <strong>Equipo NuevaHabitat</strong>
          <p>Acompañamos familias en ventas por herencia en Barcelona desde 2026. Conocemos los trámites previos, la fiscalidad catalana y el mercado por distrito: Eixample, Gràcia, Les Corts, Nou Barris y área metropolitana.</p>
        </div>
      </aside>
      `,
    },

    'guia-valoracion-piso-barcelona-2026': {
      readMin: 9,
      faq: [
        { q: '¿Cuánto cuesta una valoración de piso en Barcelona?', a: 'NuevaHabitat ofrece valoración gratuita con visita presencial en Barcelona y área metropolitana. Agencias tradicionales suelen incluirla en la comisión; tasadores independientes pueden cobrar 200–400 €.' },
        { q: '¿Qué diferencia hay entre valoración y tasación hipotecaria?', a: 'La valoración de mercado orienta el precio de venta. La tasación hipotecaria la encarga el banco del comprador y puede ser inferior si el tasador aplica criterios más conservadores.' },
        { q: '¿Puedo fiarme del precio de Idealista para valorar?', a: 'No como única fuente. Los anuncios suelen estar 5–12% por encima del precio de cierre. Hay que cruzar operaciones reales, estado del inmueble y demanda actual.' },
        { q: '¿Cuánto tarda una valoración profesional?', a: 'Entre 24 y 72 horas desde la visita presencial, según complejidad del inmueble y disponibilidad de comparables en el barrio.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Una valoración seria combina comparables cerrados, visita presencial y factores del edificio (ITE, certificado energético).</li>
          <li>Los estimadores online son orientativos; no sustituyen el análisis de micro-mercado por barrio.</li>
          <li>Fijar un precio de salida realista reduce el tiempo en mercado y evita rebajas posteriores.</li>
          <li>NuevaHabitat incluye valoración gratuita antes de decidir vender. Consulta la <a href="/cuanto-vale-mi-piso-barcelona">guía de valoración en Barcelona</a>.</li>
        </ul>
      </aside>
      <nav class="blog-toc">
        <p>Contenido del artículo</p>
        <ol>
          <li><a href="#metodo">Método de valoración profesional</a></li>
          <li><a href="#comparables">Comparables: qué mirar</a></li>
          <li><a href="#edificio">Edificio e ITE</a></li>
          <li><a href="#rango">Cómo fijar el rango de precio</a></li>
          <li><a href="#faq">Preguntas frecuentes</a></li>
        </ol>
      </nav>
      <p>Si te preguntas <strong>cuánto vale tu piso en Barcelona</strong>, la respuesta no está en una cifra única de portal inmobiliario. En 2026, la dispersión entre Eixample y Nou Barris supera los 2.000 €/m²; dentro del mismo barrio, planta, orientación e ITE pueden mover el valor más de un 15%.</p>
      <h2 id="metodo">Método de valoración profesional</h2>
      <p>Una valoración rigurosa sigue cuatro pasos: recopilar comparables de operaciones cerradas (no solo anuncios activos), inspeccionar el inmueble in situ, analizar la situación registral y de la finca, y proponer un rango de precio con tiempo estimado de venta. En NuevaHabitat entregamos ese informe sin coste ni exclusiva.</p>
      <h2 id="comparables">Comparables: qué mirar</h2>
      <p>Filtra por misma tipología (piso, ático, bajo), superficie ±10%, estado de reforma y distancia máxima de 500 m. Ajusta por ascensor, parking, terraza y certificado energético. Un comparable en la misma finca pesa más que uno en la calle paralela.</p>
      <h2 id="edificio">Edificio, ITE y certificado energético</h2>
      <p>En edificios anteriores a 1960 — habituales en Ciutat Vella, Gràcia o Horta — la ITE favorable o pendiente condiciona el precio y el perfil de comprador. El certificado energético clase E o inferior suele exigir descuento o inversión previa.</p>
      <h2 id="rango">Cómo fijar el rango de precio</h2>
      <p>Define precio objetivo (cierre esperado), precio de salida (publicación) y suelo mínimo (arras). Publicar un 5–8% por encima del objetivo es habitual, pero sobreprecios superiores al 10% generan estancamiento. Usa la <a href="/vender#calc">calculadora de ahorro</a> para comparar honorarios antes de elegir agencia.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto cuesta una valoración de piso en Barcelona?</summary><p>NuevaHabitat ofrece valoración gratuita con visita presencial en Barcelona y área metropolitana. Agencias tradicionales suelen incluirla en la comisión; tasadores independientes pueden cobrar 200–400 €.</p></details>
        <details class="blog-faq-item"><summary>¿Qué diferencia hay entre valoración y tasación hipotecaria?</summary><p>La valoración de mercado orienta el precio de venta. La tasación hipotecaria la encarga el banco del comprador y puede ser inferior si el tasador aplica criterios más conservadores.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo fiarme del precio de Idealista para valorar?</summary><p>No como única fuente. Los anuncios suelen estar 5–12% por encima del precio de cierre. Hay que cruzar operaciones reales, estado del inmueble y demanda actual.</p></details>
        <details class="blog-faq-item"><summary>¿Cuánto tarda una valoración profesional?</summary><p>Entre 24 y 72 horas desde la visita presencial, según complejidad del inmueble y disponibilidad de comparables en el barrio.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Quieres saber cuánto vale tu piso con datos reales de tu barrio?</p>
        <a href="/cuanto-vale-mi-piso-barcelona" class="btn">Guía valoración Barcelona</a>
        <a href="/vender" class="btn btn-outline" style="margin-left:.5rem">Valoración gratuita</a>
      </aside>
      `,
    },

    'housfy-vs-precio-fijo-barcelona': {
      readMin: 8,
      faq: [
        { q: '¿Housfy cobra comisión al vendedor en Barcelona?', a: 'Housfy trabaja con modelo de comisión porcentual sobre el precio de venta, con tramos variables según servicios. Conviene calcular el coste total en tu precio concreto, no solo el porcentaje publicitado.' },
        { q: '¿Qué ventaja tiene el precio fijo de NuevaHabitat?', a: 'Sabes desde el primer día que pagarás 3.000 € + IVA en escritura, con servicios incluidos. En ventas de 350.000 € o más, el ahorro frente a comisiones del 3–6% es muy significativo.' },
        { q: '¿Puedo vender sin exclusiva con NuevaHabitat?', a: 'Sí. No exigimos exclusividad abusiva. Puedes comparar modelos y decidir con información completa.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Housfy compite por comisión variable; NuevaHabitat por precio fijo en escritura.</li>
          <li>En un piso de 450.000 €, una comisión del 5% + IVA supera los 27.000 €.</li>
          <li>Compara coste total, servicios incluidos y compradores filtrados, no solo el titular del anuncio.</li>
          <li>Análisis detallado en <a href="/nuevahabitat-vs-housfy-barcelona">NuevaHabitat vs Housfy Barcelona</a>.</li>
        </ul>
      </aside>
      <p>Al comparar <strong>Housfy vs NuevaHabitat</strong> en Barcelona, la pregunta no es quién publica más rápido, sino <em>cuánto pagas al cerrar</em> y qué servicios recibes de verdad: valoración, fotografía, filtrado de compradores, negociación y acompañamiento hasta escritura.</p>
      <h2>Comisión variable vs precio fijo</h2>
      <p>Las plataformas porcentuales encajan cuando el precio de venta es bajo o el vendedor prioriza pagar solo si cierra. En viviendas de 350.000–600.000 € — el rango habitual en Eixample, Gràcia, Les Corts o Sarrià — el coste porcentual crece linealmente con el precio, aunque el esfuerzo operativo sea similar.</p>
      <p>NuevaHabitat cobra <strong>3.000 € + IVA</strong>, únicamente en escritura. Si no vendes, no pagas. Incluye reportaje fotográfico, panel vendedor, gestor dedicado y acceso a compradores cualificados de cartera.</p>
      <h2>Tabla orientativa de coste total</h2>
      <table class="blog-table">
        <thead><tr><th>Precio venta</th><th>Comisión ~5% + IVA</th><th>NuevaHabitat</th><th>Ahorro orientativo</th></tr></thead>
        <tbody>
          <tr><td>300.000 €</td><td>~18.150 €</td><td>3.630 €</td><td>~14.500 €</td></tr>
          <tr><td>450.000 €</td><td>~27.225 €</td><td>3.630 €</td><td>~23.600 €</td></tr>
          <tr><td>600.000 €</td><td>~36.300 €</td><td>3.630 €</td><td>~32.700 €</td></tr>
        </tbody>
      </table>
      <p>Usa la <a href="/vender#calc">calculadora de ahorro</a> con tu precio estimado. Para el comparativo completo de servicios, visita <a href="/nuevahabitat-vs-housfy-barcelona">NuevaHabitat vs Housfy</a> o <a href="/nuevahabitat-vs-agencia-tradicional-barcelona">vs agencia tradicional</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Housfy cobra comisión al vendedor en Barcelona?</summary><p>Housfy trabaja con modelo de comisión porcentual sobre el precio de venta, con tramos variables según servicios. Conviene calcular el coste total en tu precio concreto.</p></details>
        <details class="blog-faq-item"><summary>¿Qué ventaja tiene el precio fijo de NuevaHabitat?</summary><p>Sabes desde el primer día que pagarás 3.000 € + IVA en escritura. En ventas de 350.000 € o más, el ahorro frente a comisiones del 3–6% es muy significativo.</p></details>
        <details class="blog-faq-item"><summary>¿Puedo vender sin exclusiva con NuevaHabitat?</summary><p>Sí. No exigimos exclusividad abusiva. Puedes comparar modelos y decidir con información completa.</p></details>
      </section>
      <aside class="blog-cta">
        <p>Compara el coste real de vender tu piso en Barcelona.</p>
        <a href="/nuevahabitat-vs-housfy-barcelona" class="btn">Ver comparativa Housfy</a>
      </aside>
      `,
    },

    'vender-piso-horta-guia': {
      readMin: 8,
      faq: [
        { q: '¿Cuánto tarda vender un piso en Horta-Guinardó?', a: 'Con precio ajustado y documentación al día, entre 45 y 90 días es habitual. Pisos en Montbau o Vall d\'Hebron con buena orientación suelen moverse más rápido que bajos interiores en La Teixonera.' },
        { q: '¿Qué comprador busca piso en Horta?', a: 'Familias que priorizan metros, terraza y precio por m² por debajo del Eixample. También profesionales del entorno Vall d\'Hebron y Montbau.' },
        { q: '¿Afecta el desnivel al precio en Horta?', a: 'Sí. Calles con pendiente pronunciada o acceso complicado pueden restar 5–10% frente a fincas en zonas planas bien comunicadas con metro L5.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>Horta-Guinardó cotiza en 2026 entre 3.900 y 4.300 €/m² según sub-zona.</li>
          <li>Demanda familiar estable: metros, terraza y metro L5.</li>
          <li>Montbau y Vall d\'Hebron concentran compradores de perfil profesional sanitario.</li>
          <li>Guía específica del distrito: <a href="/vender-horta">vender piso en Horta-Guinardó</a>.</li>
        </ul>
      </aside>
      <p><strong>Vender piso en Horta-Guinardó</strong> exige entender que no es un mercado único: Horta centre, Montbau, La Teixonera y el entorno del Vall d\'Hebron tienen compradores, precios y tiempos de venta distintos. Publicar con un precio pensado para "Barcelona genérico" suele alargar la operación.</p>
      <h2>Precios por micro-zona en 2026</h2>
      <p>En Horta centre y zonas planas bien comunicadas, pisos de 3 habitaciones reformados se mueven entre 320.000 y 480.000 €. En Montbau, la demanda de familias con vinculación al hospital empuja los precios en fincas con parking y orientación exterior. La Teixonera y calles con fuerte desnivel requieren ajuste fino del precio de salida.</p>
      <h2>Cómo preparar la venta en Horta</h2>
      <p>Revisa ITE de la finca, certificado energético y estado de terrazas comunitarias. En edificios de los 60–70, los compradores preguntan por ascensor, fachada y derramas. Un reportaje fotográfico que muestre luminosidad y vistas — cuando las hay — compensa la distancia al centro frente a compradores que comparan con Eixample.</p>
      <h2>Vender con precio fijo en el distrito</h2>
      <p>NuevaHabitat trabaja Horta-Guinardó desde nuestras oficinas en Les Corts, con metro directo. Honorarios: <strong>3.000 € + IVA</strong>, solo en escritura. Consulta la landing <a href="/vender-horta">vender piso en Horta</a> o pide <a href="/vender">valoración gratuita</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Cuánto tarda vender un piso en Horta-Guinardó?</summary><p>Con precio ajustado y documentación al día, entre 45 y 90 días es habitual.</p></details>
        <details class="blog-faq-item"><summary>¿Qué comprador busca piso en Horta?</summary><p>Familias que priorizan metros, terraza y precio por m² por debajo del Eixample.</p></details>
        <details class="blog-faq-item"><summary>¿Afecta el desnivel al precio en Horta?</summary><p>Sí. Calles con pendiente pronunciada pueden restar 5–10% frente a zonas planas bien comunicadas.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Vendes en Horta, Montbau o Vall d\'Hebron?</p>
        <a href="/vender-horta" class="btn">Guía vender en Horta</a>
      </aside>
      `,
    },

    'vender-hipoteca-pendiente-guia': {
      readMin: 9,
      faq: [
        { q: '¿Se cancela la hipoteca en la misma escritura de venta?', a: 'Sí, es lo habitual. El notario destina parte del precio a cancelar la hipoteca pendiente y el comprador recibe el inmueble libre de cargas.' },
        { q: '¿Qué pasa si la venta no cubre la deuda hipotecaria?', a: 'Debes aportar la diferencia (dación en pago parcial no es automática). Valora deuda pendiente antes de fijar precio mínimo.' },
        { q: '¿El banco del comprador retrasa la operación?', a: 'Puede alargar plazos si la cancelación no está preparada. Solicita certificado de deuda y autorización de venta con antelación.' },
      ],
      body: `
      <aside class="blog-summary">
        <strong>Lo esencial</strong>
        <ul>
          <li>La hipoteca pendiente no impide vender; debe cancelarse en escritura o antes.</li>
          <li>Pide al banco certificado de deuda actualizado y autorización de venta.</li>
          <li>En arras, deja claro quién gestiona la cancelación y en qué plazo.</li>
          <li>Guía completa: <a href="/vender-piso-hipoteca-pendiente-barcelona">vender con hipoteca pendiente en Barcelona</a>.</li>
        </ul>
      </aside>
      <p><strong>Vender piso con hipoteca pendiente</strong> es habitual en Barcelona: la mayoría de vendedores aún tienen préstamo vigente. El proceso es estándar si la documentación bancaria está preparada antes de firmar arras; se complica cuando la deuda supera el precio de venta o hay varias cargas registrales.</p>
      <h2>Pasos previos con tu banco</h2>
      <p>Solicita certificado de deuda con desglose de capital pendiente, intereses y comisión de cancelación anticipada si aplica. Pide autorización de venta y confirma si el banco exige cancelación total en escritura o admite subrogación del comprador.</p>
      <h2>Arras y escritura con hipoteca</h2>
      <p>En el contrato de arras, incluye cláusula sobre cancelación hipotecaria, plazo hasta escritura y consecuencias si el banco retrasa la operación. El notario, en escritura, retiene del precio lo necesario para cancelar la carga y entrega el resto al vendedor.</p>
      <h2>Cuando la deuda supera el valor de venta</h2>
      <p>Si el precio de mercado no cubre la hipoteca, valora aportación adicional, negociación con la entidad o venta asistida. Ocultar la deuda al comprador solo genera fallos en due diligence y pérdida de arras.</p>
      <p>NuevaHabitat coordina valoración, compradores filtrados y documentación bancaria por <strong>3.000 € + IVA</strong>, solo en escritura. Más detalle en <a href="/vender-piso-hipoteca-pendiente-barcelona">vender piso con hipoteca pendiente</a>.</p>
      <section class="blog-faq" id="faq">
        <h2>Preguntas frecuentes</h2>
        <details class="blog-faq-item"><summary>¿Se cancela la hipoteca en la misma escritura de venta?</summary><p>Sí, es lo habitual. El notario destina parte del precio a cancelar la hipoteca pendiente.</p></details>
        <details class="blog-faq-item"><summary>¿Qué pasa si la venta no cubre la deuda hipotecaria?</summary><p>Debes aportar la diferencia. Valora deuda pendiente antes de fijar precio mínimo.</p></details>
        <details class="blog-faq-item"><summary>¿El banco del comprador retrasa la operación?</summary><p>Puede alargar plazos si la cancelación no está preparada. Solicita certificado de deuda con antelación.</p></details>
      </section>
      <aside class="blog-cta">
        <p>¿Vendes con hipoteca pendiente en Barcelona?</p>
        <a href="/vender-piso-hipoteca-pendiente-barcelona" class="btn">Guía hipoteca pendiente</a>
      </aside>
      `,
    },
  };
  for (const [slug, patch] of Object.entries(PATCHES)) {
    if (window.NH_BLOG_POSTS && NH_BLOG_POSTS[slug]) Object.assign(NH_BLOG_POSTS[slug], patch);
  }
})();
