#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FIXES = {
    "administracion-alquileres-eixample.html": [
        ('gestionar alquiler Numància, administrador fincas Eixample Barcelona, alquiler larga duración 08028, gestión inquilinos Zona Universitaria',
         'gestionar alquiler Eixample Dreta, administrador fincas Sant Antoni, alquiler larga duración 08009, gestión inquilinos Sagrada Família'),
        ('imagenes/lescorts1.jpg', 'imagenes/eixample1.jpg'),
        ('["Eixample", "Numància", "Zona Universitaria", "Pedralbes", "08028", "08034"]',
         '["Eixample", "Eixample Dret", "Eixample Esquerre", "Sant Antoni", "Sagrada Família", "08009", "08011", "08015"]'),
        ('en el distrito de Eixample.', 'en Les Corts; operamos en todo el Eixample.'),
        ('Eixample · oficina Mejía Lequerica · 08028', 'Eixample · Dreta, Esquerre, Sant Antoni'),
        ('en 08028 y 08034.', 'en 08009, 08011 y 08015.'),
        ('Numància, entorno del Camp Nou, Zona Universitaria o Pedralbes', 'Dreta, Esquerre, Sant Antoni o Sagrada Família'),
        ('piso en <strong>Numància</strong>', 'piso en <strong>Pau Claris (Dreta)</strong>'),
        ('familias en Numància, pisos vinculados a la universidad en el entorno del campus, vivienda unifamiliar en Pedralbes o bloques de los años 60–80 cerca de la Gran Via',
         'familias en la Dreta, pisos reformados en Esquerre, alquileres en Sant Antoni y bloques señoriales cerca de Passeig de Gràcia'),
        ('Qué cubrimos en Numància, Zona Universitaria y Pedralbes', 'Qué cubrimos en Dreta, Esquerre y Sant Antoni'),
        ('¿Trabajáis Pedralbes y Numància con la misma tarifa?', '¿Trabajáis Dreta y Sant Antoni con la misma tarifa?'),
        ('placeholder="Ej. Numància, c/…"', 'placeholder="Ej. Pau Claris, Comte Borrell…"'),
        ('¿Gestionáis pisos cerca de la Zona Universitaria?', '¿Gestionáis pisos en mercado tensionado del Eixample?'),
        ('Sí, en todo Eixample. La tarifa de 60 €/mes está pensada para vivienda habitual de larga duración.',
         'Sí. Revisamos comunicaciones y plazos con especial cuidado cuando aplica normativa de mercado tensionado.'),
        ('Desde nuestra oficina en Eixample.', 'Desde nuestra oficina en Mejía Lequerica (Les Corts), con operativa en todo el Eixample.'),
    ],
    "administracion-alquileres-gracia.html": [
        ('gestionar alquiler Numància, administrador fincas Gràcia Barcelona, alquiler larga duración 08028, gestión inquilinos Zona Universitaria',
         'gestionar alquiler Gràcia, administrador fincas Vila de Gràcia, alquiler larga duración 08012, gestión inquilinos Camp d\'en Grassot'),
        ('imagenes/lescorts1.jpg', 'imagenes/gracia1.jpg'),
        ('["Gràcia", "Numància", "Zona Universitaria", "Pedralbes", "08028", "08034"]',
         '["Gràcia", "Vila de Gràcia", "Camp d\'en Grassot", "Vallcarca", "Penitents", "08012", "08023", "08025"]'),
        ('en el distrito de Gràcia.', 'en Les Corts; operamos en todo Gràcia.'),
        ('Gràcia · oficina Mejía Lequerica · 08028', 'Gràcia · Vila de Gràcia, Camp d\'en Grassot, Vallcarca'),
        ('en 08028 y 08034.', 'en 08012, 08023 y 08025.'),
        ('Numància, entorno del Camp Nou, Zona Universitaria o Pedralbes', 'Verdi, Plaça de la Vila, Camp d\'en Grassot o Vallcarca'),
        ('piso en <strong>Numància</strong>', 'piso en <strong>Verdi (Vila de Gràcia)</strong>'),
        ('familias en Numància, pisos vinculados a la universidad en el entorno del campus, vivienda unifamiliar en Pedralbes o bloques de los años 60–80 cerca de la Gran Via',
         'familias en Vila de Gràcia, pisos sin ascensor en calles estrechas, alquileres en Camp d\'en Grassot y vivienda en pendiente en Vallcarca'),
        ('Qué cubrimos en Numància, Zona Universitaria y Pedralbes', 'Qué cubrimos en Vila de Gràcia, Camp d\'en Grassot y Vallcarca'),
        ('¿Trabajáis Pedralbes y Numància con la misma tarifa?', '¿Trabajáis Vila de Gràcia y Vallcarca con la misma tarifa?'),
        ('placeholder="Ej. Numància, c/…"', 'placeholder="Ej. Verdi, Plaça de la Vila…"'),
        ('Desde nuestra oficina en Gràcia.', 'Desde Mejía Lequerica (Les Corts), con visitas habituales en Gràcia.'),
    ],
}

for fname, pairs in FIXES.items():
    path = ROOT / fname
    text = path.read_text(encoding="utf-8")
    for old, new in pairs:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")
    print("fixed", fname)
