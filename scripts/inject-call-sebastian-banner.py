#!/usr/bin/env python3
"""Insert mid-page call banner (Sebastián) after alq-price-band on alquiler landings."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = "<!-- NH_CALL_SEBASTIAN -->"

BANNER = f"""{MARKER}
<section class="lc-call-banner">
  <div class="container">
    <div class="lc-call-banner__inner fade-up">
      <div>
        <span class="overline" style="color:var(--oro-claro)">¿Necesitas información?</span>
        <p class="lc-call-banner__title">Llama a Sebastián</p>
        <p class="lc-call-banner__sub">Te orientamos sobre tu caso sin compromiso · lun–sáb 9–20h</p>
      </div>
      <a href="tel:+34603656587" class="btn btn-gold nh-call-link" data-nh-call="banner-sebastian">603 656 587</a>
    </div>
  </div>
</section>
"""

# Close of alq-price-band section, then inject before next content
AFTER_PRICE_BAND = re.compile(
    r"(<section class=\"alq-price-band\">[\s\S]*?</section>\n+)(?="
    r"(?:<!-- NH_INTEGRAL_PROCESO_DEMO -->\n+)?"
    r"<section)",
    re.DOTALL,
)


def targets() -> list[Path]:
    paths: list[Path] = []
    for pattern in ("administracion-alquileres*.html", "alquiler-integral*.html"):
        paths.extend(sorted(ROOT.glob(pattern)))
    return paths


def inject(html: str) -> tuple[str, str]:
    if MARKER in html:
        return html, "skip"
    m = AFTER_PRICE_BAND.search(html)
    if not m:
        return html, "no-anchor"
    return html[: m.end(1)] + "\n" + BANNER + "\n" + html[m.end(1) :], "ok"


def main() -> None:
    stats = {"ok": 0, "skip": 0, "no-anchor": 0}
    for path in targets():
        text = path.read_text(encoding="utf-8")
        new_text, status = inject(text)
        stats[status] += 1
        if status == "ok":
            path.write_text(new_text, encoding="utf-8")
            print(f"OK  {path.name}")
        elif status == "skip":
            print(f"SKIP {path.name}")
        else:
            print(f"MISS {path.name} (no alq-price-band anchor)")

    print(stats)


if __name__ == "__main__":
    main()
