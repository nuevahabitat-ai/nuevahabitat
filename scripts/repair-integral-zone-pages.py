#!/usr/bin/env python3
"""Append FAQ, form, footer and scripts to truncated alquiler-integral-* zone pages."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TAIL = subprocess.check_output(
    ["git", "show", "9fd14d0:alquiler-integral-les-corts.html"],
    cwd=ROOT,
    text=True,
)
# From FAQ section through </html>
idx = TAIL.find('<section style="padding:5rem 0;background:var(--crema)">\n  <div class="container" style="max-width:820px">\n    <div class="text-center" style="margin-bottom:2.5rem">\n      <span class="overline">FAQ Les Corts</span>')
if idx < 0:
    raise SystemExit("tail anchor not found")
TAIL = TAIL[idx:]

ZONE_LABEL = {
    "les-corts": "Les Corts",
    "eixample": "Eixample",
    "gracia": "Gràcia",
    "l-hospitalet": "L'Hospitalet",
    "sants": "Sants",
    "poblenou": "Poblenou",
    "sarria": "Sarrià",
    "badalona": "Badalona",
    "horta": "Horta-Guinardó",
    "sant-andreu": "Sant Andreu",
    "nou-barris": "Nou Barris",
    "ciutat-vella": "Ciutat Vella",
    "sant-antoni": "Sant Antoni",
}

ADMIN_SLUG = {
    "les-corts": "administracion-alquileres-les-corts",
    "eixample": "administracion-alquileres-eixample",
    "gracia": "administracion-alquileres-gracia",
    "l-hospitalet": "administracion-alquileres-l-hospitalet",
    "sants": "administracion-alquileres-sants",
    "poblenou": "administracion-alquileres-poblenou",
    "sarria": "administracion-alquileres-sarria",
    "badalona": "administracion-alquileres-badalona",
    "horta": "administracion-alquileres-horta",
    "sant-andreu": "administracion-alquileres-sant-andreu",
    "nou-barris": "administracion-alquileres-nou-barris",
    "ciutat-vella": "administracion-alquileres-ciutat-vella",
    "sant-antoni": "administracion-alquileres-sant-antoni",
}


def zone_key(path: Path) -> str:
    name = path.stem.replace("alquiler-integral-", "")
    return name


for path in sorted(ROOT.glob("alquiler-integral-*.html")):
    text = path.read_text(encoding="utf-8")
    if "js/main.js" in text:
        print("ok", path.name)
        continue
    key = zone_key(path)
    label = ZONE_LABEL.get(key, key.replace("-", " ").title())
    admin = ADMIN_SLUG.get(key, "administracion-alquileres")
    tail = TAIL.replace("FAQ Les Corts", f"FAQ {label}")
    tail = tail.replace("Les Corts", label)
    tail = tail.replace("administracion-alquileres-les-corts", admin)
    tail = tail.replace("locIntSubmit", "locIntSubmit")
    tail = re.sub(
        r"Admin alquileres Les Corts|Les Corts ·",
        f"Solicitar · {label}",
        tail,
        count=0,
    )
    tail = tail.replace(
        "Pedralbes y entorno del Camp Nou",
        f"micro-zonas de {label}",
    )
    text = text.rstrip() + "\n\n" + tail
    path.write_text(text, encoding="utf-8")
    print("repaired", path.name)
