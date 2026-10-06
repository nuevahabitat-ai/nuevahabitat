#!/usr/bin/env python3
"""Inject shared proceso + demo sections into alquiler integral HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def block(zona: str, zona_label: str, local_note: str) -> str:
    demo_src = f"/demo-panel-propietario-alquiler.html?embed=1&amp;context=integral&amp;zona={zona}"
    return f'''
<section class="alq-guide" id="proceso-detallado" style="padding:5rem 0;background:var(--blanco)">
  <div class="container alq-guide-inner fade-up">
    <span class="overline">Paso a paso</span>
    <h2 class="section-title">Cómo funciona el alquiler integral, explicado al detalle</h2>
    <p>El alquiler integral (499 € precio fijo) concentra <strong>todo lo que ocurre desde que el piso está vacío hasta que el inquilino firma y entra</strong>. {local_note} Tú conservas la decisión final (renta orientativa, horarios de visita e inquilino); Nueva Habitat ejecuta captación, filtro, visitas y formalización LAU.</p>

    <h3>Los 8 pasos del servicio</h3>
    <ol style="margin:1.25rem 0;padding-left:1.35rem;line-height:1.75;color:var(--gris-texto)">
      <li style="margin-bottom:1rem"><strong>Solicitud y alta.</strong> Recogemos datos del inmueble, contacto y plazo. Asignamos gestor y abres expediente (portal o email).</li>
      <li style="margin-bottom:1rem"><strong>Checklist documental.</strong> Revisamos DNI/NIE, nota simple, certificado energético, IBI/suministros recientes y fotos para inventario. Si falta algo, te lo indicamos en una lista cerrada.</li>
      <li style="margin-bottom:1rem"><strong>Precio y anuncio.</strong> Fijamos renta con comparables del barrio (no genéricos de toda la ciudad). Redactamos anuncio orientado a <strong>particulares solventes</strong> y acordamos canales de difusión.</li>
      <li style="margin-bottom:1rem"><strong>Criba de mensajes.</strong> Filtramos curiosos, perfiles que no encajan con la renta o solicitudes incompletas. Tú no atiendes decenas de llamadas de portales.</li>
      <li style="margin-bottom:1rem"><strong>Visitas discretas.</strong> Concertamos franjas contigo; Nueva Habitat visita el piso y representa al propietario con profesionalidad.</li>
      <li style="margin-bottom:1rem"><strong>Informe top 3.</strong> Tras las visitas, entregamos hasta <strong>tres perfiles recomendados</strong> con observaciones de solvencia básica y encaje con la vivienda.</li>
      <li style="margin-bottom:1rem"><strong>Reserva, seguro e inquilino.</strong> Gestionamos reserva del elegido, documentación para tu <strong>seguro de impago</strong> (póliza a tu nombre) y coordinación de fecha de firma.</li>
      <li style="margin-bottom:1rem"><strong>Contrato, INCASÒL y llaves.</strong> Contrato LAU, inventario firmado, depósito de fianza ante <strong>INCASÒL</strong>, cambio de suministros y acta de entrega. Opcional: <a href="/administracion-alquileres">administración 60 €/mes</a> con el mismo panel.</li>
    </ol>

    <h3>Tú vs Nueva Habitat</h3>
    <div style="overflow-x:auto;margin-top:1rem">
      <table class="alq-compare-table">
        <thead><tr><th scope="col">Tú (propietario)</th><th scope="col">Nueva Habitat</th></tr></thead>
        <tbody>
          <tr><td>Decides renta final e inquilino entre los recomendados</td><td>Propone comparables de mercado y filtra candidatos</td></tr>
          <tr><td>Indicas franjas horarias para visitas</td><td>Publica, visita y informa sin saturarte de mensajes</td></tr>
          <tr><td>Firmas contrato y aporta documentación</td><td>Redacta LAU, INCASÒL, inventario y suministros</td></tr>
          <tr><td>Cobras la renta en tu cuenta</td><td>No retiene rentas; opcional gestión mensual después</td></tr>
        </tbody>
      </table>
    </div>
    <p style="margin-top:1.25rem;font-size:.875rem;color:var(--gris-texto)">Plazo orientativo: con documentación al día y precio alineado al mercado, muchos procesos cierran en <strong>pocas semanas</strong> en {zona_label}.</p>
  </div>
</section>

<section id="demo-panel-alquiler" style="padding:5rem 0;background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="max-width:760px;margin:0 auto 2rem">
      <span class="overline">Panel interactivo</span>
      <h2 class="section-title">Prueba el panel del propietario (datos demo)</h2>
      <p class="section-subtitle" style="margin:0 auto">Mismo diseño que la cuenta real del alquiler integral: expediente, pasos del proceso, documentación y tarifa 499 €. <strong>Datos simulados</strong> — entra en «Gestión y proceso» y «Honorarios».</p>
    </div>
    <div class="fade-up" style="border:1px solid var(--crema-dark);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);background:var(--blanco)">
      <iframe title="Demo panel alquiler integral {zona_label}" src="{demo_src}" style="display:block;width:100%;min-height:920px;border:0" loading="lazy"></iframe>
    </div>
    <div class="text-center fade-up" style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center">
      <a href="/demo-panel-propietario-alquiler.html?context=integral&amp;zona={zona}" target="_blank" rel="noopener" class="btn btn-gold">Demo a pantalla completa</a>
      <a href="/acceso-alquiler-integral" class="btn btn-outline">Entrar al panel real · 499 €</a>
      <a href="/demo-panel-propietario-alquiler.html?zona={zona}" target="_blank" rel="noopener" class="btn btn-outline">Ver demo administración 60 €/mes</a>
    </div>
  </div>
</section>
'''

PAGES = {
    'alquiler-integral.html': ('barcelona', 'Barcelona y área metropolitana', 'Operamos en Barcelona ciudad, L\'Hospitalet, Badalona y municipios habituales del área.'),
    'alquiler-integral-les-corts.html': ('lescorts', 'Les Corts', 'En Les Corts trabajamos desde Mejía Lequerica 42 (Numància, ZU, Pedralbes).'),
    'alquiler-integral-eixample.html': ('eixample', 'el Eixample', 'En el Eixample ajustamos renta y anuncio por micro-zona (Dreta, Esquerre, Sant Antoni, Sagrada Família).'),
    'alquiler-integral-l-hospitalet.html': ('hospitalet', 'L\'Hospitalet', 'En L\'Hospitalet cubrimos Centre, Bellvitge, Pubilla Cases y Gran Via con el mismo pack 499 €.'),
    'alquiler-integral-gracia.html': ('gracia', 'Gràcia', 'En Gràcia ajustamos renta y anuncio por micro-zona (Vila de Gràcia, Camp d\'en Grassot, Vallcarca).'),
    'alquiler-integral-sants.html': ('sants', 'Sants', 'En Sants-Montjuïc ajustamos renta en Hostafrancs, La Bordeta y entorno Estació de Sants.'),
    'alquiler-integral-poblenou.html': ('poblenou', 'Poblenou', 'En Poblenou y 22@ publicamos con comparables de Sant Martí, no medias de toda Barcelona.'),
    'alquiler-integral-sarria.html': ('sarria', 'Sarrià', 'En Sarrià-Sant Gervasi captamos inquilinos solventes en Bonanova, Putxet y Sarrià centre.'),
    'alquiler-integral-badalona.html': ('badalona', 'Badalona', 'En Badalona cubrimos Centre, Gorg, Montigalà y Pep Ventura con el pack 499 €.'),
    'alquiler-integral-horta.html': ('horta', 'Horta-Guinardó', 'En Horta-Guinardó ajustamos renta en Montbau, Vall d\'Hebron, La Clota y el Guinardó.'),
    'alquiler-integral-sant-andreu.html': ('santandreu', 'Sant Andreu', 'En Sant Andreu captamos en Congrés, La Sagrera, Bon Pastor y Gran de Sant Andreu.'),
    'alquiler-integral-nou-barris.html': ('noubarris', 'Nou Barris', 'En Nou Barris publicamos con comparables de Porta, Verdum, Roquetes y Trinitat Vella.'),
    'alquiler-integral-ciutat-vella.html': ('ciutatvella', 'Ciutat Vella', 'En Ciutat Vella filtramos perfiles en Gòtic, Born, Raval y Barceloneta con criterio LAU.'),
    'alquiler-integral-sant-antoni.html': ('santantoni', 'Sant Antoni', 'En Sant Antoni (08015) concertamos visitas junto al mercado y Ronda Sant Antoni.'),
    'alquiler-integral-poble-sec.html': ('poblesec', 'Poble-sec', 'En Poble-sec usamos comparables del Paral·lel y Blai, no medias de todo Sants-Montjuïc.'),
    'alquiler-integral-el-clot.html': ('elclot', 'El Clot', 'En El Clot y Sant Martí ajustamos renta según €/m² del Clot y entorno Glòries.'),
    'alquiler-integral-fort-pienc.html': ('fortpienc', 'Fort Pienc', 'En Fort Pienc publicamos con referencias de Nàpols, Marina y Sagrada Família.'),
    'alquiler-integral-esplugues.html': ('esplugues', 'Esplugues', 'En Esplugues captamos con comparables del Centre, Can Clota y Finestrelles.'),
    'alquiler-integral-sant-gervasi.html': ('santgervasi', 'Sant Gervasi', 'En Galvany y Tres Torres filtramos perfiles acordes a rentas altas por m².'),
}

MARKER = '<!-- NH_INTEGRAL_PROCESO_DEMO -->'

for fname, (zona, label, note) in PAGES.items():
    path = ROOT / fname
    if not path.exists():
        print('skip', fname)
        continue
    text = path.read_text(encoding='utf-8')
    if MARKER in text:
        pat = (
            re.escape(MARKER)
            + r"[\s\S]*?(?=\n<section style=\"padding:5rem 0;background:var\(--crema\)\">\n  <div class=\"container\" style=\"max-width:820px\">\n    <div class=\"text-center\" style=\"margin-bottom:2.5rem\">\n      <span class=\"overline\">FAQ|\n<section id=\"solicitar\"|\n<footer|\Z)"
        )
        repl = MARKER + block(zona, label, note) + "\n"
        text = re.sub(pat, repl, text, count=1)
    else:
        # insert before FAQ section (crema) or before solicitar
        needle = '<section style="padding:5rem 0;background:var(--crema)">\n  <div class="container" style="max-width:820px">\n    <div class="text-center" style="margin-bottom:2.5rem">\n      <span class="overline">FAQ'
        if needle not in text:
            needle = '<section id="solicitar"'
        if needle not in text:
            print('no anchor', fname)
            continue
        insert = MARKER + block(zona, label, note) + '\n\n'
        text = text.replace(needle, insert + needle, 1)
    path.write_text(text, encoding='utf-8')
    print('ok', fname)
