import re
from pathlib import Path
import paramiko

local = {}
for line in Path(r"D:\Proyectos\Captador\.env").read_text(encoding="utf-8").splitlines():
    m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line.strip())
    if m:
        local[m.group(1)] = m.group(2).strip().strip('"')

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(
    local.get("VPS_HOST", "75.119.130.152"),
    22,
    "root",
    local["VPS_PASS"],
    timeout=15,
    allow_agent=False,
    look_for_keys=False,
)
cmds = [
    "sqlite3 /opt/captador/data/captador.db \"SELECT url, price FROM Listing WHERE url LIKE '%idealista%' AND price > 0 LIMIT 3;\"",
    "sqlite3 /opt/captador/data/captador.db \"SELECT COUNT(*) FROM Listing WHERE url LIKE '%idealista%' AND price > 0;\"",
]
for cmd in cmds:
    _, o, _ = c.exec_command(cmd, timeout=30)
    print(o.read().decode("utf-8", errors="replace"))
c.close()
