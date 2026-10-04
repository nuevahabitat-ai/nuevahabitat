#!/usr/bin/env python3
"""Scaffold missing barrio landings + cross-links for admin (60€) and integral (499€)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ZONAS = [
    {
        "key": "les-corts",
        "label": "Les Corts",
        "label_short": "Les Corts",
        "admin_slug": "administracion-alquileres-les-corts",
        "integral_slug": "alquiler-integral-les-corts",
        "demo_zona": "lescorts",
        "hero_img": "imagenes/inmobiliario1.jpg",
        "vender_slug": "vender-les-corts",
        "admin_overline": "Les Corts · Numància, ZU, Pedralbes",
        "integral_overline": "Les Corts · 499 € fijo · oficina en el distrito",
    },
    {
        "key": "eixample",
        "label": "Eixample",
        "label_short": "el Eixample",
        "admin_slug": "administracion-alquileres-eixample",
        "integral_slug": "alquiler-integral-eixample",
        "demo_zona": "eixample",
        "hero_img": "imagenes/eixample1.jpg",
        "vender_slug": "vender-eixample",
        "admin_overline": "Eixample · Dreta, Esquerre, Sant Antoni",
        "integral_overline": "Eixample · 499 € fijo · delega captación y cierre",
    },
    {
        "key": "gracia",
        "label": "Gràcia",
        "label_short": "Gràcia",
        "admin_slug": "administracion-alquileres-gracia",
        "integral_slug": "alquiler-integral-gracia",
        "demo_zona": "gracia",
        "hero_img": "imagenes/gracia1.jpg",
        "vender_slug": "vender-gracia",
        "admin_overline": "Gràcia · Vila de Gràcia, Camp d'en Grassot, Vallcarca",
        "integral_overline": "Gràcia · 499 € fijo · particulares solventes",
    },
    {
        "key": "l-hospitalet",
        "label": "L'Hospitalet",
        "label_short": "L'Hospitalet",
        "admin_slug": "administracion-alquileres-l-hospitalet",
        "integral_slug": "alquiler-integral-l-hospitalet",
        "demo_zona": "hospitalet",
        "hero_img": "imagenes/hospitalet1.jpg",
        "vender_slug": "vender-l-hospitalet",
        "admin_overline": "L'Hospitalet · Centre, Bellvitge, Pubilla Cases",
        "integral_overline": "L'Hospitalet · 499 € fijo · captación y cierre",
    },
]

SERVICIOS_BLOCK = """
<section class="alq-guide" id="servicios-complementarios" style="padding:4.5rem 0;background:var(--crema)">
  <div class="container alq-guide-inner fade-up">
    <span class="overline">Servicios complementarios</span>
    <h2 class="section-title">Administración e integral en {label}</h2>
    <p style="color:var(--gris-texto);line-height:1.75;max-width:820px">Son el mismo recorrido del propietario particular en dos momentos: si el piso está <strong>vacío</strong>, el <a href="/{integral_slug}">alquiler integral (499 €)</a> publica, visita y cierra contrato; si <strong>ya hay inquilino</strong>, la <a href="/{admin_slug}">administración (60 €/mes)</a> gestiona incidencias, LAU y relación sin que hables con el inquilino. Puedes encadenar ambos con el mismo panel.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin-top:1.75rem">
      <article style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.75rem">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--oro);margin-bottom:.5rem">Piso vacío · captación</div>
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin:0 0 .75rem">Alquiler integral · 499 €</h3>
        <p style="font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Anuncio, criba, visitas, informe top 3, LAU e INCASÒL en {label}.</p>
        <a href="/{integral_slug}" class="btn btn-gold" style="width:100%;justify-content:center">Ver integral {label}</a>
      </article>
      <article style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.75rem">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--oro);margin-bottom:.5rem">Contrato en curso</div>
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin:0 0 .75rem">Administración · 60 €/mes</h3>
        <p style="font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Incidencias, mediación, renovaciones y control de renta (tú cobras en tu cuenta).</p>
        <a href="/{admin_slug}" class="btn btn-outline" style="width:100%;justify-content:center">Ver administración {label}</a>
      </article>
    </div>
    <p style="margin-top:1.5rem;font-size:.875rem;color:var(--gris-texto)">Otros barrios: {other_links} · <a href="/alquiler-integral">Integral Barcelona</a> · <a href="/administracion-alquileres">Administración general</a>.</p>
  </div>
</section>
"""

MARKER = "<!-- NH_SERVICIOS_COMPLEMENTARIOS -->"


def other_links(z: dict) -> str:
    parts = []
    for o in ZONAS:
        if o["key"] == z["key"]:
            continue
        parts.append(
            f'<a href="/{o["admin_slug"]}">{o["label"]} admin</a> · '
            f'<a href="/{o["integral_slug"]}">{o["label"]} integral</a>'
        )
    return " · ".join(parts)


def inject_servicios(path: Path, z: dict) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = MARKER + SERVICIOS_BLOCK.format(
        label=z["label"],
        admin_slug=z["admin_slug"],
        integral_slug=z["integral_slug"],
        other_links=other_links(z),
    )
    if MARKER in text:
        text = re.sub(
            re.escape(MARKER) + r"[\s\S]*?(?=\n<section|\n<footer|\Z)",
            block.strip() + "\n\n",
            text,
            count=1,
        )
    else:
        needle = '<section id="solicitar"'
        if needle not in text:
            needle = "<footer>"
        text = text.replace(needle, block + "\n\n" + needle, 1)
    path.write_text(text, encoding="utf-8")
    print("servicios", path.name)


def admin_body(z: dict) -> str:
    bodies = {
        "eixample": """
    <p>El Eixample concentra edificios de finales del XIX, viviendas reformadas en la Dreta y bloques más asequibles en Sant Antoni. La renta y el perfil de inquilino cambian calle a calle: un piso en Pau Claris no se gestiona igual que uno en Comte Borrell. Nueva Habitat opera con <strong>60 €/mes IVA incluido</strong> en todo el distrito, con visitas desde la oficina de Les Corts (Mejía Lequerica 42).</p>
    <h3>Eixample Dreta y Esquerre (08009–08011)</h3>
    <p>Familias y profesionales con alta exigencia de documentación e inventario. Incidencias frecuentes: ascensores antiguos, filtraciones en terrazas, comunidades con obras. Modelo sin contacto directo propietario–inquilino.</p>
    <h3>Sant Antoni y entorno Mercat (08015)</h3>
    <p>Mezcla de larga duración y pisos recientemente reformados. Conviene vigilar cláusulas de suministros, mobiliario y actualización de renta si aplica <strong>mercado tensionado</strong>.</p>
    <h3>Sagrada Família y Eixample nord</h3>
    <p>Demanda estable de particulares; coordinación con porteros y fincas con locales en planta baja. Seguimiento de pagos sin retener la renta (no somos cobro garantizado).</p>
""",
        "gracia": """
    <p>Gràcia es uno de los distritos con más identidad de barrio de Barcelona: calles estrechas en Vila de Gràcia, fincas sin ascensor en parte del 08012 y edificios más modernos en Camp d'en Grassot (08025). Muchos propietarios viven fuera del distrito y delegan averías de fin de semana, ruidos y plazos LAU por <strong>60 €/mes IVA incluido</strong>.</p>
    <h3>Vila de Gràcia y Plaça de la Vila (08012)</h3>
    <p>Alquileres familiares y parejas jóvenes; inventario detallado y mediación en convivencia vecinal. Coordinación con comunidades pequeñas y fontanería de fincas antiguas.</p>
    <h3>Camp d'en Grassot i Gràcia Nova (08025)</h3>
    <p>Mejor conexión metro y pisos con más metros cuadrados. Perfil de inquilino más estable; renovaciones y actualización de renta con revisión normativa.</p>
    <h3>Vallcarca i Penitents (08023)</h3>
    <p>Vivienda en pendiente, garajes y accesos complicados para obras. Visitas de proveedores y seguimiento documentado para el propietario absentista.</p>
""",
    }
    return bodies.get(z["key"], "")


def write_admin_eixample_gracia() -> None:
    tpl = (ROOT / "administracion-alquileres-les-corts.html").read_text(encoding="utf-8")
    for z in ZONAS:
        if z["key"] not in ("eixample", "gracia"):
            continue
        out = ROOT / f'{z["admin_slug"]}.html'
        if out.exists():
            print("skip exists", out.name)
            continue
        text = tpl
        text = text.replace("administracion-alquileres-les-corts", z["admin_slug"])
        text = text.replace("Administración alquileres Les Corts", f'Administración alquileres {z["label"]}')
        text = text.replace("administración alquileres Les Corts", f'administración alquileres {z["label"]}')
        text = text.replace("Les Corts · Numància, ZU, Pedralbes", z["admin_overline"])
        text = text.replace(
            "Administración en Les Corts<br/>sin hablar con el inquilino.",
            f'Administración en {z["label"]}<br/>sin hablar con el inquilino.',
        )
        text = text.replace(
            "Incidencias, renovaciones y control de renta en Les Corts. El inquilino contacta solo con Nueva Habitat",
            f'Incidencias, renovaciones y control de renta en {z["label"]}. El inquilino contacta solo con Nueva Habitat',
        )
        text = text.replace("imagenes/inmobiliario1.jpg", z["hero_img"])
        text = text.replace("Les Corts", z["label"])
        text = text.replace("les-corts", z["key"])
        text = text.replace("alquiler-integral-les-corts", z["integral_slug"])
        text = text.replace("vender-les-corts", z["vender_slug"])
        text = text.replace("zona=lescorts", f'zona={z["demo_zona"]}')
        text = text.replace("Demo panel propietario Les Corts", f'Demo panel propietario {z["label"]}')
        text = text.replace("Panel propietario · Les Corts", f'Panel propietario · {z["label"]}')
        text = text.replace("FAQ Les Corts", f'FAQ {z["label"]}')
        text = text.replace("Solicitar administración", f'Solicitar administración · {z["label"]}')
        text = text.replace("Admin alquileres Les Corts", f'Admin alquileres {z["label"]}')
        text = text.replace("Dirección / barrio en Les Corts", f'Dirección / barrio en {z["label"]}')
        text = text.replace("Numància, Zona Universitaria, Pedralbes", "barrio y calle")
        # Restore hub link label
        text = text.replace(f'Administración {z["label"]} · {z["label"]}', f'Administración · {z["label"]}')
        micro = admin_body(z)
        if micro and 'id="microzonas"' in text:
            text = re.sub(
                r'(<section class="alq-guide" id="microzonas">[\s\S]*?<p>Google y los propietarios)[\s\S]*?(</section>)',
                lambda m: m.group(1) + micro + m.group(2),
                text,
                count=1,
            )
        # SEO title/description
        if z["key"] == "eixample":
            text = re.sub(
                r"<title>[^<]+</title>",
                f'<title>Administración alquileres Eixample · 60 €/mes · Dreta, Sant Antoni · NuevaHabitat</title>',
                text,
                count=1,
            )
            text = re.sub(
                r'<meta name="description" content="[^"]*"',
                '<meta name="description" content="Administración de alquileres en el Eixample Barcelona: 60 €/mes IVA incl. Incidencias, LAU, renovaciones sin hablar con el inquilino. Dreta, Esquerre, Sant Antoni, Sagrada Família."',
                text,
                count=1,
            )
        if z["key"] == "gracia":
            text = re.sub(
                r"<title>[^<]+</title>",
                f'<title>Administración alquileres Gràcia · 60 €/mes · Vila de Gràcia · NuevaHabitat</title>',
                text,
                count=1,
            )
            text = re.sub(
                r'<meta name="description" content="[^"]*"',
                '<meta name="description" content="Administración de alquileres en Gràcia Barcelona: 60 €/mes IVA incl. Delega incidencias, mediación y control de renta en Vila de Gràcia, Camp d\'en Grassot y Vallcarca."',
                text,
                count=1,
            )
        out.write_text(text, encoding="utf-8")
        print("wrote", out.name)


def write_integral_gracia() -> None:
    tpl = (ROOT / "alquiler-integral-eixample.html").read_text(encoding="utf-8")
    z = next(x for x in ZONAS if x["key"] == "gracia")
    out = ROOT / f'{z["integral_slug"]}.html'
    if out.exists():
        print("skip exists", out.name)
        return
    text = tpl
    text = text.replace("alquiler-integral-eixample", z["integral_slug"])
    text = text.replace("Alquiler integral Eixample", f'Alquiler integral {z["label"]}')
    text = text.replace("alquiler integral Eixample", f'alquiler integral {z["label"]}')
    text = text.replace("alquiler integral en el Eixample", f'alquiler integral en {z["label_short"]}')
    text = text.replace("Eixample · 499 € fijo · delega captación y cierre", z["integral_overline"])
    text = text.replace(
        "No gestiones tú el alquiler en el Eixample:<br/>captamos inquilino y cerramos contrato por ti.",
        f'No gestiones tú el alquiler en {z["label"]}:<br/>captamos inquilino y cerramos contrato por ti.',
    )
    text = text.replace("Eixample Esquerre y Dret, Sant Antoni, Sagrada Família y entorno Passeig de Gràcia", "Vila de Gràcia, Camp d'en Grassot, Vallcarca y Penitents")
    text = text.replace("imagenes/eixample1.jpg", z["hero_img"])
    text = text.replace("Eixample", z["label"])
    text = text.replace("eixample", z["key"])
    text = text.replace("vender-eixample", z["vender_slug"])
    text = text.replace(
        f'administración de alquileres en {z["label"]}',
        f'administración de alquileres en {z["label"]}',  # placeholder for targeted link below
    )
    text = text.replace("zona=eixample", f'zona={z["demo_zona"]}')
    text = text.replace("el Eixample", z["label_short"])
    text = re.sub(
        r"<title>[^<]+</title>",
        f'<title>Alquiler integral Gràcia · 499 € fijo · visitas y contrato · NuevaHabitat</title>',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        "<meta name=\"description\" content=\"Alquiler integral en Gràcia Barcelona: 499 € precio fijo. Anuncio, filtro, visitas, top 3 perfiles, LAU e INCASÒL en Vila de Gràcia y Camp d'en Grassot.\"",
        text,
        count=1,
    )
    text = text.replace(
        f'¿Ya tienes inquilino en {z["label"]} y solo quieres delegar gestión? Mira administración de alquileres en {z["label"]} (60 €/mes).',
        f'¿Ya tienes inquilino en {z["label"]} y solo quieres delegar gestión? Mira <a href="/{z["admin_slug"]}">administración de alquileres en {z["label"]}</a> (60 €/mes).',
    )
    out.write_text(text, encoding="utf-8")
    print("wrote", out.name)


def update_json_index() -> None:
    for fname in ("content/seo-static-landings.json", "content/landings-index.json"):
        path = ROOT / fname
        data = json.loads(path.read_text(encoding="utf-8"))
        entries = data.get("landings", data if isinstance(data, list) else [])
        slugs = {e["slug"] for e in entries}
        new_entries = [
            {
                "slug": "administracion-alquileres-eixample",
                "cluster": "alquileres",
                "footerLabel": "Administración alquileres · Eixample",
                "keyword_principal": "administración alquileres Eixample",
                "priority": 0.86,
                "indexable": True,
                "cardTeaser": "60 €/mes IVA incl. · Dreta, Esquerre, Sant Antoni · cero contacto con inquilino.",
            },
            {
                "slug": "administracion-alquileres-gracia",
                "cluster": "alquileres",
                "footerLabel": "Administración alquileres · Gràcia",
                "keyword_principal": "administración alquileres Gràcia",
                "priority": 0.86,
                "indexable": True,
                "cardTeaser": "Gestión mensual en Vila de Gràcia y Camp d'en Grassot · panel propietario.",
            },
            {
                "slug": "alquiler-integral-gracia",
                "cluster": "alquileres",
                "footerLabel": "Alquiler integral · Gràcia",
                "keyword_principal": "alquiler integral Gràcia",
                "priority": 0.86,
                "indexable": True,
                "cardTeaser": "499 € fijo · captación y cierre en Gràcia · top 3 perfiles y LAU.",
            },
        ]
        for e in new_entries:
            if e["slug"] not in slugs:
                entries.append(e)
                slugs.add(e["slug"])
        if "landings" in data:
            data["landings"] = entries
        else:
            data = entries
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("updated", fname)


def hub_zona_grid() -> str:
    cards = []
    for z in ZONAS:
        cards.append(
            f"""      <article class="fade-up" style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.5rem">
        <h3 style="font-family:var(--font-serif);font-size:1.25rem;margin:0 0 .75rem">{z["label"]}</h3>
        <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:0 0 1rem">Propietarios particulares en {z["label"]}: elige captación o gestión mensual.</p>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          <a href="/{z["integral_slug"]}" class="btn btn-gold" style="justify-content:center;font-size:.875rem">Integral 499 € · {z["label"]}</a>
          <a href="/{z["admin_slug"]}" class="btn btn-outline" style="justify-content:center;font-size:.875rem">Administración 60 €/mes</a>
        </div>
      </article>"""
        )
    return f"""
<section id="barrios-alquiler" style="padding:5rem 0;background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2.5rem">
      <span class="overline">Por barrio</span>
      <h2 class="section-title">Administración e integral en Barcelona y área</h2>
      <p class="section-subtitle" style="max-width:720px;margin:0 auto">Cuatro zonas con landings específicas para propietarios que buscan <strong>delegar el alquiler</strong> o <strong>administrar un contrato en curso</strong>. Contenido diferenciado por barrio para posicionar en Google.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem">
{chr(10).join(cards)}
    </div>
  </div>
</section>
"""


HUB_MARKER = "<!-- NH_HUB_BARRIOS_ALQUILER -->"


def inject_hub(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    block = HUB_MARKER + hub_zona_grid()
    if HUB_MARKER in text:
        text = re.sub(
            re.escape(HUB_MARKER) + r"[\s\S]*?(?=\n<section|\n<footer|\Z)",
            block.strip() + "\n\n",
            text,
            count=1,
        )
    else:
        for needle in ('<section id="solicitar"', '<section id="demo-panel-alquiler"', "<footer>"):
            if needle in text:
                text = text.replace(needle, block + "\n\n" + needle, 1)
                break
    path.write_text(text, encoding="utf-8")
    print("hub", path.name)


def fix_eixample_integral_admin_link() -> None:
    path = ROOT / "alquiler-integral-eixample.html"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        'Mira <a href="/administracion-alquileres">administración de alquileres en Barcelona</a> (60 €/mes)',
        'Mira <a href="/administracion-alquileres-eixample">administración de alquileres en el Eixample</a> (60 €/mes)',
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    write_admin_eixample_gracia()
    write_integral_gracia()
    fix_eixample_integral_admin_link()
    for z in ZONAS:
        inject_servicios(ROOT / f'{z["admin_slug"]}.html', z)
        inject_servicios(ROOT / f'{z["integral_slug"]}.html', z)
    inject_hub(ROOT / "administracion-alquileres.html")
    inject_hub(ROOT / "alquiler-integral.html")
    update_json_index()


if __name__ == "__main__":
    main()
