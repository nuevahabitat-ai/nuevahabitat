#!/usr/bin/env python3
"""Barrio landings: administración 60€ + alquiler integral 499€ (13 zonas Barcelona)."""
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
        "admin_title": "Administración alquileres Les Corts · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Les Corts: 60 €/mes IVA incl. Incidencias, LAU e informe sin hablar con el inquilino. Numància, Pedralbes, Zona Universitaria.",
        "integral_title": "Alquiler integral Les Corts · 499 € fijo · NuevaHabitat",
        "integral_desc": "Alquiler integral en Les Corts: 499 € precio fijo. Anuncio, visitas, top 3 perfiles, LAU e INCASÒL. Oficina Mejía Lequerica 42.",
        "hero_integral": "Delegamos captación y cierre en Numància, Zona Universitaria y Pedralbes",
        "demo_place": "Numància",
        "area_served": ["Les Corts", "Numància", "Pedralbes", "Zona Universitaria", "08028", "08034"],
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
        "admin_title": "Administración alquileres Eixample · 60 €/mes · Dreta, Sant Antoni · NuevaHabitat",
        "admin_desc": "Administración de alquileres en el Eixample Barcelona: 60 €/mes IVA incl. Incidencias, LAU y renovaciones. Dreta, Esquerre, Sant Antoni, Sagrada Família.",
        "integral_title": "Alquiler integral Eixample · 499 € · visitas y contrato · NuevaHabitat",
        "integral_desc": "Alquiler integral en el Eixample: 499 € fijo. Anuncio, filtro, visitas, top 3 perfiles, LAU e INCASÒL.",
        "hero_integral": "Eixample Esquerre y Dret, Sant Antoni, Sagrada Família y entorno Passeig de Gràcia",
        "demo_place": "Pau Claris (Dreta)",
        "area_served": ["Eixample", "Eixample Dret", "Sant Antoni", "08009", "08011", "08015"],
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
        "admin_title": "Administración alquileres Gràcia · 60 €/mes · Vila de Gràcia · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Gràcia: 60 €/mes IVA incl. Incidencias y control de renta en Vila de Gràcia, Camp d'en Grassot y Vallcarca.",
        "integral_title": "Alquiler integral Gràcia · 499 € fijo · NuevaHabitat",
        "integral_desc": "Alquiler integral en Gràcia Barcelona: 499 € precio fijo. Captación y cierre en Vila de Gràcia y Camp d'en Grassot.",
        "hero_integral": "Vila de Gràcia, Camp d'en Grassot, Vallcarca y Penitents",
        "demo_place": "Verdi (Vila de Gràcia)",
        "area_served": ["Gràcia", "Vila de Gràcia", "Camp d'en Grassot", "08012", "08023", "08025"],
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
        "admin_title": "Administración alquileres L'Hospitalet · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en L'Hospitalet: 60 €/mes IVA incl. Centre, Bellvitge, Pubilla Cases y Gran Via.",
        "integral_title": "Alquiler integral L'Hospitalet · 499 € · NuevaHabitat",
        "integral_desc": "Alquiler integral en L'Hospitalet de Llobregat: 499 € fijo hasta firma de contrato LAU.",
        "hero_integral": "Centre, Bellvitge, Pubilla Cases y Gran Via",
        "demo_place": "Gran Via (Centre)",
        "area_served": ["L'Hospitalet de Llobregat", "Centre", "Bellvitge", "08901", "08907"],
    },
    {
        "key": "sants",
        "label": "Sants",
        "label_short": "Sants",
        "admin_slug": "administracion-alquileres-sants",
        "integral_slug": "alquiler-integral-sants",
        "demo_zona": "sants",
        "hero_img": "imagenes/sants1.jpg",
        "vender_slug": "vender-sants",
        "admin_overline": "Sants · Montjuïc, Hostafrancs, La Bordeta",
        "integral_overline": "Sants · 499 € fijo · captación y cierre",
        "admin_title": "Administración alquileres Sants · 60 €/mes · Montjuïc · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Sants-Montjuïc: 60 €/mes IVA incl. Incidencias, LAU y mediación sin contacto con el inquilino. Hostafrancs, La Bordeta, Sants Estació.",
        "integral_title": "Alquiler integral Sants · 499 € fijo · NuevaHabitat",
        "integral_desc": "Alquiler integral en Sants Barcelona: 499 € precio fijo. Anuncio, visitas, top 3 perfiles y contrato LAU en Hostafrancs y La Bordeta.",
        "hero_integral": "Sants Estació, Hostafrancs, La Bordeta y entorno Montjuïc",
        "demo_place": "Carrer de Sants (Hostafrancs)",
        "area_served": ["Sants", "Sants-Montjuïc", "Hostafrancs", "La Bordeta", "08014", "08028"],
    },
    {
        "key": "poblenou",
        "label": "Poblenou",
        "label_short": "Poblenou",
        "admin_slug": "administracion-alquileres-poblenou",
        "integral_slug": "alquiler-integral-poblenou",
        "demo_zona": "poblenou",
        "hero_img": "imagenes/poblenou5.jpg",
        "vender_slug": "vender-poblenou",
        "admin_overline": "Poblenou · 22@, Diagonal Mar, Rambla del Poblenou",
        "integral_overline": "Poblenou · 499 € fijo · captación y cierre",
        "admin_title": "Administración alquileres Poblenou · 60 €/mes · 22@ · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Poblenou y Sant Martí: 60 €/mes IVA incl. Gestión diaria en 22@, Diagonal Mar y Rambla del Poblenou.",
        "integral_title": "Alquiler integral Poblenou · 499 € · NuevaHabitat",
        "integral_desc": "Alquiler integral en Poblenou: 499 € fijo. Publicación, filtro de candidatos, visitas y cierre LAU en 22@ y Diagonal Mar.",
        "hero_integral": "22@, Rambla del Poblenou, Diagonal Mar y Vila Olímpica",
        "demo_place": "Rambla del Poblenou",
        "area_served": ["Poblenou", "Sant Martí", "22@", "Diagonal Mar", "08005", "08019"],
    },
    {
        "key": "sarria",
        "label": "Sarrià",
        "label_short": "Sarrià",
        "admin_slug": "administracion-alquileres-sarria",
        "integral_slug": "alquiler-integral-sarria",
        "demo_zona": "sarria",
        "hero_img": "imagenes/eixample5.jpg",
        "vender_slug": "vender-sarria",
        "admin_overline": "Sarrià · Sant Gervasi, Bonanova, Putxet",
        "integral_overline": "Sarrià · 499 € fijo · captación y cierre",
        "admin_title": "Administración alquileres Sarrià · 60 €/mes · Sant Gervasi · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Sarrià-Sant Gervasi: 60 €/mes IVA incl. Discreción, incidencias y LAU en Bonanova, Putxet y Sant Gervasi.",
        "integral_title": "Alquiler integral Sarrià · 499 € · NuevaHabitat",
        "integral_desc": "Alquiler integral en Sarrià-Sant Gervasi: 499 € precio fijo. Captación con inquilinos solventes en Bonanova y Putxet.",
        "hero_integral": "Sarrià centre, Bonanova, Putxet i Farró y Sant Gervasi",
        "demo_place": "Major de Sarrià",
        "area_served": ["Sarrià", "Sant Gervasi", "Bonanova", "Putxet", "08017", "08022"],
    },
    {
        "key": "badalona",
        "label": "Badalona",
        "label_short": "Badalona",
        "admin_slug": "administracion-alquileres-badalona",
        "integral_slug": "alquiler-integral-badalona",
        "demo_zona": "badalona",
        "hero_img": "imagenes/interior11.jpg",
        "vender_slug": "vender-badalona",
        "admin_overline": "Badalona · Centre, Gorg, Montigalà, Pep Ventura",
        "integral_overline": "Badalona · 499 € fijo · captación y cierre",
        "admin_title": "Administración alquileres Badalona · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Badalona: 60 €/mes IVA incl. Operativa desde Barcelona en Centre, Gorg, Montigalà y Pep Ventura.",
        "integral_title": "Alquiler integral Badalona · 499 € · NuevaHabitat",
        "integral_desc": "Alquiler integral en Badalona: 499 € precio fijo. Anuncio, visitas, top 3 perfiles y LAU en Centre y Gorg.",
        "hero_integral": "Centre, Gorg, Montigalà, Pep Ventura y La Salut",
        "demo_place": "Gorg (Centre)",
        "area_served": ["Badalona", "Centre Badalona", "Gorg", "Montigalà", "08911", "08917"],
    },
    {
        "key": "horta",
        "label": "Horta-Guinardó",
        "label_short": "Horta-Guinardó",
        "admin_slug": "administracion-alquileres-horta",
        "integral_slug": "alquiler-integral",
        "demo_zona": "horta",
        "hero_img": "imagenes/horta1.jpg",
        "vender_slug": "vender-horta",
        "admin_template": "les-corts",
        "admin_overline": "Horta-Guinardó · Montbau, Vall d'Hebron, Guinardó",
        "admin_title": "Administración alquileres Horta-Guinardó · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Horta-Guinardó: 60 €/mes IVA incl. Incidencias, LAU y mediación sin hablar con el inquilino. Montbau, Vall d'Hebron, La Clota.",
        "admin_keywords": "administración alquileres Horta, gestionar alquiler Guinardó Barcelona, administrador fincas Montbau, alquiler larga duración 08031, gestión inquilinos Vall d'Hebron",
        "demo_place": "Passeig de Maragall (Horta)",
        "area_served": ["Horta-Guinardó", "Horta", "El Guinardó", "Montbau", "Vall d'Hebron", "08031", "08032", "08041"],
        "hero_zones": "Montbau, Vall d'Hebron, La Clota y el Guinardó",
        "trust_lead": "Visitas en Horta-Guinardó",
    },
    {
        "key": "sant-andreu",
        "label": "Sant Andreu",
        "label_short": "Sant Andreu",
        "admin_slug": "administracion-alquileres-sant-andreu",
        "integral_slug": "alquiler-integral",
        "demo_zona": "santandreu",
        "hero_img": "imagenes/barcelona5.jpg",
        "vender_slug": "vender-sant-andreu",
        "admin_template": "les-corts",
        "admin_overline": "Sant Andreu · Congrés, La Sagrera, Bon Pastor",
        "admin_title": "Administración alquileres Sant Andreu · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Sant Andreu de Palomar: 60 €/mes IVA incl. Incidencias, LAU y control de renta en Congrés, La Sagrera y Bon Pastor.",
        "admin_keywords": "administración alquileres Sant Andreu, gestionar alquiler Sant Andreu de Palomar, administrador fincas La Sagrera, alquiler larga duración 08030",
        "demo_place": "Carrer de Sant Antoni (Congrés)",
        "area_served": ["Sant Andreu", "Sant Andreu de Palomar", "Congrés i Indians", "La Sagrera", "Bon Pastor", "08030", "08027"],
        "hero_zones": "Congrés i Indians, La Sagrera, Bon Pastor y Sant Andreu centre",
        "trust_lead": "Operativa Sant Andreu",
    },
    {
        "key": "nou-barris",
        "label": "Nou Barris",
        "label_short": "Nou Barris",
        "admin_slug": "administracion-alquileres-nou-barris",
        "integral_slug": "alquiler-integral",
        "demo_zona": "noubarris",
        "hero_img": "imagenes/noubarris1.jpg",
        "vender_slug": "vender-nou-barris",
        "admin_template": "les-corts",
        "admin_overline": "Nou Barris · Porta, Verdum, Roquetes, Trinitat Vella",
        "admin_title": "Administración alquileres Nou Barris · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Nou Barris: 60 €/mes IVA incl. Incidencias y LAU en Porta, Verdum, Roquetes y Trinitat Vella.",
        "admin_keywords": "administración alquileres Nou Barris, gestionar alquiler Porta Barcelona, administrador fincas Verdum, alquiler larga duración 08042",
        "demo_place": "Via Júlia (Porta)",
        "area_served": ["Nou Barris", "La Porta", "Verdum", "Roquetes", "Trinitat Vella", "08042", "08016", "08033"],
        "hero_zones": "La Porta, Verdum, Roquetes y Trinitat Vella",
        "trust_lead": "Gestión en Nou Barris",
    },
    {
        "key": "ciutat-vella",
        "label": "Ciutat Vella",
        "label_short": "Ciutat Vella",
        "admin_slug": "administracion-alquileres-ciutat-vella",
        "integral_slug": "alquiler-integral",
        "demo_zona": "ciutatvella",
        "hero_img": "imagenes/ciutatvella2.jpg",
        "vender_slug": "vender-piso-ciutat-vella-barcelona",
        "admin_template": "les-corts",
        "admin_overline": "Ciutat Vella · Gòtic, Born, Raval, Barceloneta",
        "admin_title": "Administración alquileres Ciutat Vella · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Ciutat Vella: 60 €/mes IVA incl. Incidencias, LAU y mediación en Gòtic, El Born, Raval y Barceloneta.",
        "admin_keywords": "administración alquileres Ciutat Vella, gestionar alquiler Gòtic Barcelona, administrador fincas Raval, alquiler larga duración 08002",
        "demo_place": "Carrer del Born (El Born)",
        "area_served": ["Ciutat Vella", "Barri Gòtic", "El Born", "El Raval", "La Barceloneta", "08002", "08003", "08001"],
        "hero_zones": "Gòtic, El Born, Raval y Barceloneta",
        "trust_lead": "Ciutat Vella · canal único",
    },
    {
        "key": "sant-antoni",
        "label": "Sant Antoni",
        "label_short": "Sant Antoni",
        "admin_slug": "administracion-alquileres-sant-antoni",
        "integral_slug": "alquiler-integral",
        "demo_zona": "santantoni",
        "hero_img": "imagenes/eixample2.jpg",
        "vender_slug": "vender-sant-antoni",
        "admin_template": "les-corts",
        "admin_overline": "Sant Antoni · Mercat, Ronda Sant Antoni, Urgell",
        "admin_title": "Administración alquileres Sant Antoni · 60 €/mes · NuevaHabitat",
        "admin_desc": "Administración de alquileres en Sant Antoni (Eixample): 60 €/mes IVA incl. Incidencias, LAU y seguimiento de renta junto al mercado y Ronda Sant Antoni.",
        "admin_keywords": "administración alquileres Sant Antoni, gestionar alquiler Ronda Sant Antoni, administrador fincas 08015, alquiler larga duración Sant Antoni Barcelona",
        "demo_place": "Ronda de Sant Antoni",
        "area_served": ["Sant Antoni", "Eixample Esquerre", "Ronda Sant Antoni", "08015", "08011"],
        "hero_zones": "Mercat de Sant Antoni, Ronda Sant Antoni y calles del 08015",
        "trust_lead": "Sant Antoni · 60 € fijos",
    },
]

ADMIN_MICRO = {
    "sants": """
    <p>Sants-Montjuïc mezcla <strong>Sants Estació</strong> (alta rotación pero mucha demanda de larga duración en calles residenciales), <strong>Hostafrancs</strong> y <strong>La Bordeta</strong>. Fincas de los 60–70 con ascensor irregular; incidencias de comunidad y obras en Montjuïc. Gestión a <strong>60 €/mes IVA incluido</strong> desde oficina Mejía Lequerica (Les Corts).</p>
    <h3>Sants Estació y carrer de Sants</h3>
    <p>Propietarios e inversores; conviene filtrar inquilinos y documentar inventario por desgaste. Mediación sin que el inquilino tenga tu teléfono.</p>
    <h3>Hostafrancs i La Bordeta</h3>
    <p>Alquiler familiar estable; calendario LAU, actualización de renta y seguimiento de pagos (tú cobras en tu cuenta).</p>
    <h3>Entorn Montjuïc</h3>
    <p>Pisos con vistas y comunidades grandes; coordinación con administradores de finca y proveedores locales.</p>
""",
    "poblenou": """
    <p>Poblenou y el distrito de Sant Martí combinan <strong>22@</strong>, vivienda de familias en la Rambla del Poblenou y torres en <strong>Diagonal Mar</strong>. Perfiles de inquilino muy distintos según manzana; la administración a <strong>60 €/mes</strong> centraliza incidencias técnicas, ruidos y renovaciones.</p>
    <h3>22@ i Poblenou tecnológic</h3>
    <p>Profesionales y parejas; contratos con cláusulas claras de mobiliario y suministros. Seguimiento de renta sin cobro garantizado.</p>
    <h3>Rambla del Poblenou i Vila Olímpica</h3>
    <p>Comunidades con portería, obras en fachada y terrazas. Canal único Nueva Habitat con el inquilino.</p>
    <h3>Diagonal Mar</h3>
    <p>Vivienda de standing; documentación impecable en fianza INCASÒL y devolución de depósito al fin del contrato.</p>
""",
    "sarria": """
    <p>Sarrià-Sant Gervasi es uno de los distritos con mayor renta media: <strong>Sarrià centre</strong>, <strong>Bonanova</strong>, <strong>Putxet</strong> y <strong>Sant Gervasi</strong>. Propietarios exigen discreción total — el inquilino no contacta contigo — y proveedores de calidad. Cuota fija <strong>60 €/mes IVA incluido</strong>.</p>
    <h3>Sarrià i Bonanova</h3>
    <p>Vivienda unifamiliar y fincas bajas; inventario detallado y plazos LAU revisados en cada renovación.</p>
    <h3>Putxet i Farró</h3>
    <p>Familias de larga duración; incidencias de calderas, terrazas y garajes comunitarios.</p>
    <h3>Sant Gervasi – Galvany</h3>
    <p>Alquileres premium; mediación profesional y registro de comunicaciones con el inquilino.</p>
""",
    "horta": """
    <p>Horta-Guinardó mezcla <strong>Montbau</strong>, <strong>Vall d'Hebron</strong>, <strong>La Clota</strong> y el <strong>Guinardó</strong>. Fincas en pendiente, comunidades con ascensor irregular y propietarios que no viven en el distrito. Administración a <strong>60 €/mes IVA incluido</strong> con visitas desde Les Corts.</p>
    <h3>Horta i Passeig de Maragall</h3>
    <p>Alquiler familiar estable; calendario LAU, incidencias de caldera y terrazas. Canal único con el inquilino.</p>
    <h3>Montbau i Vall d'Hebron</h3>
    <p>Demanda de larga duración cerca de hospital y universidad; inventario detallado y seguimiento de renta (tú cobras en tu cuenta).</p>
    <h3>El Guinardó</h3>
    <p>Pendiente y vistas; coordinación de reparaciones con proveedores habituales en la zona alta del distrito.</p>
""",
    "sant-andreu": """
    <p>Sant Andreu combina <strong>Congrés i Indians</strong>, <strong>La Sagrera</strong>, <strong>Bon Pastor</strong> y el eje comercial de <strong>Gran de Sant Andreu</strong>. Propietarios que delegan tras herencia o viven fuera del barrio. Cuota fija <strong>60 €/mes IVA incluido</strong>.</p>
    <h3>Congrés i Sant Andreu centre</h3>
    <p>Fincas de los 50–70; incidencias de comunidad y ascensor. Mediación LAU sin WhatsApp directo al propietario.</p>
    <h3>La Sagrera</h3>
    <p>Renovaciones urbanísticas y obras en finca; documentamos comunicaciones al inquilino y plazos contractuales.</p>
    <h3>Bon Pastor</h3>
    <p>Alquileres familiares; seguimiento de pagos y coordinación de averías domésticas.</p>
""",
    "nou-barris": """
    <p>Nou Barris concentra <strong>La Porta</strong>, <strong>Verdum</strong>, <strong>Roquetes</strong> y <strong>Trinitat Vella</strong>. Muchos propietarios buscan un interlocutor profesional ante incidencias repetidas en comunidades grandes. Misma tarifa <strong>60 €/mes IVA incluido</strong>.</p>
    <h3>La Porta i Via Júlia</h3>
    <p>Alquiler de larga duración; control de renta y recordatorios formales si hay retraso (sin cobro garantizado).</p>
    <h3>Verdum i Roquetes</h3>
    <p>Familias y demanda estable; renovaciones y actualización de renta con revisión normativa.</p>
    <h3>Trinitat Vella</h3>
    <p>Comunidades con portería o sin ascensor; coordinación de fontanería y electricidad certificada.</p>
""",
    "ciutat-vella": """
    <p>Ciutat Vella exige rigor documental: <strong>Gòtic</strong>, <strong>El Born</strong>, <strong>Raval</strong> y <strong>Barceloneta</strong>. Turismo, ruidos y fincas históricas con instalaciones antiguas. Administración <strong>60 €/mes IVA incluido</strong> con comunicación profesional al inquilino.</p>
    <h3>El Born i Gòtic</h3>
    <p>Contratos claros sobre uso de vivienda habitual; incidencias de humedades y comunidades estrechas.</p>
    <h3>El Raval</h3>
    <p>Mediación en convivencia y cumplimiento LAU; seguimiento de fianza INCASÒL al fin de contrato.</p>
    <h3>La Barceloneta</h3>
    <p>Salitre, ventilación y terrazas; proveedores locales para averías urgentes sin saturar al propietario.</p>
""",
    "sant-antoni": """
    <p>Sant Antoni es uno de los barrios con más rotación de alquiler en el <strong>Eixample esquerre</strong>: <strong>Mercat de Sant Antoni</strong>, <strong>Ronda Sant Antoni</strong> y calles del <strong>08015</strong>. Cuota fija <strong>60 €/mes IVA incluido</strong>; el inquilino no tiene tu teléfono.</p>
    <h3>Entorn del mercat</h3>
    <p>Pisos reformados y familias; inventario en entrada y salida para evitar disputas en fianza.</p>
    <h3>Ronda Sant Antoni i Urgell</h3>
    <p>Edificios del primer tercio del siglo XX; calderas y ascensores comunitarios coordinados por Nueva Habitat.</p>
    <h3>08015 · mercado tensionado</h3>
    <p>Revisamos plazos y comunicaciones cuando aplica normativa de mercado tensionado; detalle en la <a href="/administracion-alquileres#normativa">guía LAU</a>.</p>
""",
    "badalona": """
    <p>Badalona concentra propietarios que viven en Barcelona o fuera del Maresme: <strong>Centre</strong>, <strong>Gorg</strong>, <strong>Montigalà</strong> y <strong>Pep Ventura</strong>. Misma tarifa <strong>60 €/mes IVA incluido</strong> con desplazamiento habitual desde Les Corts.</p>
    <h3>Centre i Gorg</h3>
    <p>Alquileres consolidados cerca del metro; seguimiento de pagos y mediación en averías de finca.</p>
    <h3>Montigalà i Nova Lloreda</h3>
    <p>Familias y demanda estable; renovaciones y comunicaciones LAU en catalán o castellano según contrato.</p>
    <h3>Pep Ventura i La Salut</h3>
    <p>Buen acceso R1/metro; incidencias de fontanería y ascensor coordinadas sin saturarte de llamadas.</p>
""",
}

SERVICIOS_BLOCK = """
<section class="alq-guide" id="servicios-complementarios" style="padding:4.5rem 0;background:var(--crema)">
  <div class="container alq-guide-inner fade-up">
    <span class="overline">Servicios complementarios</span>
    <h2 class="section-title">Administración e integral en {label}</h2>
    <p style="color:var(--gris-texto);line-height:1.75;max-width:820px">Si el piso está <strong>vacío</strong>, el <a href="/{integral_slug}">alquiler integral (499 €)</a> publica, visita y cierra contrato; si <strong>ya hay inquilino</strong>, la <a href="/{admin_slug}">administración (60 €/mes)</a> gestiona incidencias y LAU sin contacto directo. Mismo panel al encadenar servicios.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;margin-top:1.75rem">
      <article style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.75rem">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--oro);margin-bottom:.5rem">Piso vacío</div>
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin:0 0 .75rem">Integral · 499 €</h3>
        <p style="font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Captación y cierre en {label}.</p>
        <a href="/{integral_slug}" class="btn btn-gold" style="width:100%;justify-content:center">Ver integral</a>
      </article>
      <article style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.75rem">
        <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--oro);margin-bottom:.5rem">Contrato activo</div>
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;margin:0 0 .75rem">Administración · 60 €/mes</h3>
        <p style="font-size:.9rem;color:var(--gris-texto);line-height:1.65;margin:0 0 1rem">Incidencias y control de renta.</p>
        <a href="/{admin_slug}" class="btn btn-outline" style="width:100%;justify-content:center">Ver administración</a>
      </article>
    </div>
    <p style="margin-top:1.5rem;font-size:.875rem;color:var(--gris-texto)">Más barrios: <a href="/administracion-alquileres#barrios-alquiler">ver todas las zonas</a> · <a href="/alquiler-integral">Integral</a> · <a href="/administracion-alquileres">Administración</a>.</p>
  </div>
</section>
"""

MARKER = "<!-- NH_SERVICIOS_COMPLEMENTARIOS -->"
HUB_MARKER = "<!-- NH_HUB_BARRIOS_ALQUILER -->"


def inject_servicios(path: Path, z: dict) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = MARKER + SERVICIOS_BLOCK.format(
        label=z["label"],
        admin_slug=z["admin_slug"],
        integral_slug=z["integral_slug"],
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


def write_admin(z: dict) -> None:
    out = ROOT / f'{z["admin_slug"]}.html'
    if out.exists():
        return
    template_key = z.get("admin_template", "eixample")
    tpl_path = ROOT / f"administracion-alquileres-{template_key}.html"
    if not tpl_path.exists():
        tpl_path = ROOT / "administracion-alquileres-eixample.html"
        template_key = "eixample"
    tpl = tpl_path.read_text(encoding="utf-8")
    base = next(x for x in ZONAS if x["key"] == template_key)
    text = tpl.replace(base["admin_slug"], z["admin_slug"])
    text = text.replace(base["integral_slug"], z["integral_slug"])
    text = text.replace(base["vender_slug"], z["vender_slug"])
    text = text.replace(f'zona={base["demo_zona"]}', f'zona={z["demo_zona"]}')
    text = text.replace(base["hero_img"], z["hero_img"])
    text = text.replace(base["admin_overline"], z["admin_overline"])
    text = text.replace(base["label"], z["label"])
    text = text.replace(base["key"], z["key"])
    if template_key == "les-corts":
        while 'id="servicios-complementarios"' in text or MARKER in text:
            text = re.sub(r"\n?<!-- NH_SERVICIOS_COMPLEMENTARIOS -->\n?", "", text, count=1)
            text = re.sub(
                r'\n?<section class="alq-guide" id="servicios-complementarios"[\s\S]*?</section>\n?',
                "",
                text,
                count=1,
            )
        text = text.replace("Les Corts", z["label"])
        text = text.replace("lescorts", z["demo_zona"])
        text = re.sub(
            r'(<div class="page-hero-content fade-up">\s*<span class="overline">)[^<]+(</span>)',
            rf'\1{z["admin_overline"]}\2',
            text,
            count=1,
        )
        text = re.sub(
            r'(<div class="page-hero-content fade-up">[\s\S]*?Gestionamos incidencias, LAU y pagos en <strong>)[^<]+(</strong>)',
            rf'\1{z.get("hero_zones", z["label"])}\2',
            text,
            count=1,
        )
        trust_lead = z.get("trust_lead", f'Gestión en {z["label"]}')
        text = re.sub(
            r'(<div class="trust-bar-inner">\s*<div class="trust-item">)[^<]+(</div>)',
            rf'\1{trust_lead}\2',
            text,
            count=1,
        )
        text = text.replace(
            f'<a href="/alquiler-integral-les-corts">Alquiler integral Les Corts 499 €</a>',
            f'<a href="/{z["integral_slug"]}">Alquiler integral 499 €</a>',
        )
        text = text.replace('id="normativa-les-corts"', f'id="normativa-{z["key"]}"')
        servicios = MARKER + SERVICIOS_BLOCK.format(
            label=z["label"],
            admin_slug=z["admin_slug"],
            integral_slug=z["integral_slug"],
        )
        text = text.replace('<section id="solicitar"', servicios + "\n\n<section id=\"solicitar\"", 1)
        while text.count('id="servicios-complementarios"') > 1:
            text = re.sub(
                r'\n<section class="alq-guide" id="servicios-complementarios"[\s\S]*?</section>\n',
                "\n",
                text,
                count=1,
            )
    else:
        text = text.replace("eixample", z["key"])
    text = re.sub(r"<title>[^<]+</title>", f'<title>{z["admin_title"]}</title>', text, count=1)
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{z["admin_desc"]}"',
        text,
        count=1,
    )
    if z.get("admin_keywords"):
        text = re.sub(
            r'<meta name="keywords" content="[^"]*"',
            f'<meta name="keywords" content="{z["admin_keywords"]}"',
            text,
            count=1,
        )
    text = text.replace(
        f'piso en <strong>{base["demo_place"]}</strong>',
        f'piso en <strong>{z["demo_place"]}</strong>',
    )
    served = json.dumps(z["area_served"], ensure_ascii=False)
    text = re.sub(
        r'"areaServed": \[[^\]]+\]',
        f'"areaServed": {served}',
        text,
        count=1,
    )
    micro = ADMIN_MICRO.get(z["key"], "")
    if micro and 'id="microzonas"' in text:
        text = re.sub(
            r'(<section class="alq-guide" id="microzonas">[\s\S]*?<p>Google y los propietarios)[\s\S]*?(</section>)',
            lambda m: m.group(1) + micro + m.group(2),
            text,
            count=1,
        )
    out.write_text(text, encoding="utf-8")
    print("admin", out.name)


def write_integral(z: dict) -> None:
    out = ROOT / f'{z["integral_slug"]}.html'
    if out.exists():
        return
    tpl = (ROOT / "alquiler-integral-eixample.html").read_text(encoding="utf-8")
    base = next(x for x in ZONAS if x["key"] == "eixample")
    text = tpl.replace(base["integral_slug"], z["integral_slug"])
    text = text.replace(base["admin_slug"], z["admin_slug"])
    text = text.replace("vender-eixample", z["vender_slug"])
    text = text.replace("zona=eixample", f'zona={z["demo_zona"]}')
    text = text.replace(base["hero_img"], z["hero_img"])
    text = text.replace(base["integral_overline"], z["integral_overline"])
    text = text.replace(base["hero_integral"], z["hero_integral"])
    text = text.replace("Eixample", z["label"])
    text = text.replace("eixample", z["key"])
    text = text.replace("el Eixample", z["label_short"])
    text = re.sub(r"<title>[^<]+</title>", f'<title>{z["integral_title"]}</title>', text, count=1)
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{z["integral_desc"]}"',
        text,
        count=1,
    )
    admin_link = f'<a href="/{z["admin_slug"]}">administración de alquileres en {z["label"]}</a>'
    text = re.sub(
        r'Mira <a href="/administracion-alquileres-eixample">administración de alquileres en el Eixample</a> \(60 €/mes\)',
        f'Mira {admin_link} (60 €/mes)',
        text,
    )
    text = re.sub(
        r'Mira <a href="/[^"]+">administración de alquileres en [^<]+</a> \(60 €/mes\)',
        f'Mira {admin_link} (60 €/mes)',
        text,
        count=1,
    )
    out.write_text(text, encoding="utf-8")
    print("integral", out.name)


def hub_grid() -> str:
    n_zonas = len(ZONAS)
    cards = []
    for z in ZONAS:
        cards.append(
            f"""      <article class="fade-up" style="background:var(--blanco);border:1px solid var(--crema-dark);border-radius:var(--radius-lg);padding:1.5rem">
        <h3 style="font-family:var(--font-serif);font-size:1.25rem;margin:0 0 .75rem">{z["label"]}</h3>
        <p style="font-size:.875rem;color:var(--gris-texto);line-height:1.6;margin:0 0 1rem">Integral 499 € o administración 60 €/mes en {z["label"]}.</p>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          <a href="/{z["integral_slug"]}" class="btn btn-gold" style="justify-content:center;font-size:.875rem">Alquiler integral</a>
          <a href="/{z["admin_slug"]}" class="btn btn-outline" style="justify-content:center;font-size:.875rem">Administración</a>
        </div>
      </article>"""
        )
    body = f"""
<section id="barrios-alquiler" style="padding:5rem 0;background:var(--crema)">
  <div class="container">
    <div class="text-center fade-up" style="margin-bottom:2.5rem">
      <span class="overline">Por barrio</span>
      <h2 class="section-title">{n_zonas} zonas · administración e integral</h2>
      <p class="section-subtitle" style="max-width:760px;margin:0 auto">Landings para propietarios particulares en Barcelona, área metropolitana y Badalona. Contenido diferenciado por barrio para buscadores locales.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem">
{chr(10).join(cards)}
    </div>
  </div>
</section>
"""
    return body


def inject_hub(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    block = HUB_MARKER + hub_grid()
    if HUB_MARKER in text:
        text = re.sub(
            re.escape(HUB_MARKER) + r"[\s\S]*?(?=\n<section|\n<footer|\Z)",
            block.strip() + "\n\n",
            text,
            count=1,
        )
    else:
        for needle in ('<section id="solicitar"', '<footer>'):
            if needle in text:
                text = text.replace(needle, block + "\n\n" + needle, 1)
                break
    path.write_text(text, encoding="utf-8")


def update_json_index() -> None:
    for fname in ("content/seo-static-landings.json", "content/landings-index.json"):
        path = ROOT / fname
        data = json.loads(path.read_text(encoding="utf-8"))
        entries = data.get("landings", [])
        slugs = {e["slug"] for e in entries}
        for z in ZONAS:
            for slug, kw, teaser in (
                (z["admin_slug"], f'administración alquileres {z["label"]}', f'60 €/mes · {z["label"]} · panel propietario.'),
                (z["integral_slug"], f'alquiler integral {z["label"]}', f'499 € fijo · captación y cierre en {z["label"]}.'),
            ):
                if slug in slugs:
                    continue
                entry = {
                    "slug": slug,
                    "cluster": "alquileres",
                    "footerLabel": f'{"Administración" if slug.startswith("admin") else "Integral"} · {z["label"]}',
                    "keyword_principal": kw,
                    "priority": 0.86,
                    "indexable": True,
                    "cardTeaser": teaser,
                }
                if fname.endswith("landings-index.json"):
                    entry = {"slug": slug, "cluster": "alquileres", "indexable": True, "priority": 0.86}
                entries.append(entry)
                slugs.add(slug)
        data["landings"] = entries
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    new_admin_only = {"horta", "sant-andreu", "nou-barris", "ciutat-vella", "sant-antoni"}
    for z in ZONAS:
        if z["key"] in new_admin_only:
            write_admin(z)
    for z in ZONAS:
        if z["key"] in new_admin_only:
            continue
        inject_servicios(ROOT / f'{z["admin_slug"]}.html', z)
        p = ROOT / f'{z["integral_slug"]}.html'
        if p.exists():
            inject_servicios(p, z)
    inject_hub(ROOT / "administracion-alquileres.html")
    inject_hub(ROOT / "alquiler-integral.html")
    update_json_index()


if __name__ == "__main__":
    main()
