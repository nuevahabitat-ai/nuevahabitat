import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAT = re.compile(r"/blog-articulo\?slug=([^\"'&\s<>]+)")
total = 0
for pattern in ("**/*.html", "content/**/*.json"):
    for p in ROOT.glob(pattern):
        s = str(p)
        if ".cursor" in s or "promo" in s:
            continue
        text = p.read_text(encoding="utf-8")
        new_text, n = PAT.subn(r"/blog/\1", text)
        if n:
            p.write_text(new_text, encoding="utf-8")
            print(p.relative_to(ROOT), n)
            total += n
print("total", total)
