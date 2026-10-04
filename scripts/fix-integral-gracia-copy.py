#!/usr/bin/env python3
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "alquiler-integral-gracia.html"
text = path.read_text(encoding="utf-8")
pairs = [
    ("poner piso alquiler Dreta, delegar alquiler Sant Antoni", "poner piso alquiler Verdi, delegar alquiler Camp d'en Grassot"),
    ("¿Visitáis pisos en Dreta, Esquerre y Sant Antoni?", "¿Visitáis pisos en Vila de Gràcia, Camp d'en Grassot y Vallcarca?"),
    ("Sí, en todo el distrito del Gràcia.", "Sí, en todo el distrito de Gràcia."),
    ("Dreta no se publica con precio de Sant Antoni.", "Vila de Gràcia no se publica con precio de Camp d'en Grassot."),
    (
        "El Gràcia concentra profesionales, familias y expatriados con alta demanda de alquiler. La <strong>Dreta</strong> y Passeig de Gràcia exigen inquilinos solventes; <strong>Sant Antoni</strong> y <strong>Sagrada Família</strong> mezclan perfiles jóvenes y familias.",
        "Gràcia concentra familias, parejas jóvenes y profesionales que buscan barrio con identidad. <strong>Vila de Gràcia</strong> (Verdi, Plaça de la Vila) exige inventario fino y mediación vecinal; <strong>Camp d'en Grassot</strong> y <strong>Vallcarca</strong> mezclan pisos más amplios y accesos complicados para obras.",
    ),
    ("Proceso en Gràcia", "Proceso en Gràcia"),
    ("Servicio integral en tu barrio de Gràcia", "Servicio integral en tu barrio de Gràcia"),
    ("Anuncio orientado a inquilinos solventes en Numància, ZU o Pedralbes", "Anuncio orientado a particulares solventes en Verdi, Camp d'en Grassot o Vallcarca"),
    ("Gràcia Esquerre y Dret, Sant Antoni, Sagrada Família y entorno Passeig de Gràcia", "Vila de Gràcia, Camp d'en Grassot, Vallcarca y Penitents"),
]
for old, new in pairs:
    text = text.replace(old, new)
path.write_text(text, encoding="utf-8")
print("ok")
