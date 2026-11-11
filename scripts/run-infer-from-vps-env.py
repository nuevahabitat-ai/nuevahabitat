#!/usr/bin/env python3
"""Lee NH_SUPABASE_* de /opt/captador/.env en el VPS y ejecuta sync-infer-compradores.mjs."""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAPTADOR_ENV = ROOT.parent / "Captador" / ".env"


def load_env_file(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line.strip())
        if not m:
            continue
        k, v = m.group(1), m.group(2).strip().strip('"').strip("'")
        if v:
            out[k] = v
    return out


def fetch_vps_nh_env() -> dict[str, str]:
    import paramiko  # noqa: PLC0415

    local = load_env_file(CAPTADOR_ENV)
    host = local.get("VPS_HOST", "75.119.130.152")
    user = local.get("VPS_USER", "root")
    pwd = local.get("VPS_PASS")
    if not pwd:
        print("Falta VPS_PASS en Captador/.env", file=sys.stderr)
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        host,
        22,
        user,
        pwd,
        timeout=15,
        banner_timeout=15,
        auth_timeout=15,
        allow_agent=False,
        look_for_keys=False,
    )
    cmds = [
        "grep -E '^NH_SUPABASE_(URL|SERVICE_KEY)=' /opt/captador/.env 2>/dev/null",
        "docker exec alfredo-worker-1 printenv NH_SUPABASE_URL NH_SUPABASE_SERVICE_KEY 2>/dev/null",
    ]
    raw = ""
    for cmd in cmds:
        _, stdout, stderr = client.exec_command(cmd, timeout=25)
        raw += stdout.read().decode("utf-8", errors="replace") + "\n"
        err = stderr.read().decode("utf-8", errors="replace")
        if err.strip():
            print(err, file=sys.stderr)
    client.close()

    found: dict[str, str] = {}
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
        else:
            # printenv alterna nombre / valor en líneas sueltas
            if line.startswith("http"):
                found.setdefault("SUPABASE_URL", line)
            elif len(line) > 80 and "eyJ" in line[:10]:
                found.setdefault("SUPABASE_SERVICE_ROLE_KEY", line)
            elif len(line) > 80:
                found.setdefault("SUPABASE_SERVICE_ROLE_KEY", line)
            continue
        if k == "NH_SUPABASE_URL" and v:
            found["SUPABASE_URL"] = v
        if k in ("NH_SUPABASE_SERVICE_KEY", "NH_SUPABASE_SERVICE_ROLE_KEY") and v:
            found["SUPABASE_SERVICE_ROLE_KEY"] = v
        if k == "NH_SUPABASE_SERVICE_KEY" and v:
            found["SUPABASE_SERVICE_ROLE_KEY"] = v

    role = found.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if len(role) < 40:
        print(
            "NH_SUPABASE_SERVICE_KEY vacío o ausente en VPS (/opt/captador/.env y worker Docker).",
            file=sys.stderr,
        )
        sys.exit(1)
    if not found.get("SUPABASE_URL"):
        found["SUPABASE_URL"] = "https://xxodawayoogthxnjpouq.supabase.co"
    return found


def patch_env_local(keys: dict[str, str]) -> None:
    env_path = ROOT / ".env.local"
    if not env_path.is_file():
        return
    text = env_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    have_url = any(l.startswith("SUPABASE_URL=") for l in lines)
    have_role = any(
        l.startswith("SUPABASE_SERVICE_ROLE_KEY=") or l.startswith("SUPABASE_SERVICE_ROLE=") for l in lines
    )

    new_lines: list[str] = []
    replaced_url = False
    replaced_role = False
    for line in lines:
        if line.startswith("SUPABASE_URL="):
            new_lines.append(f"SUPABASE_URL={keys['SUPABASE_URL']}")
            replaced_url = True
            continue
        if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
            new_lines.append(f"SUPABASE_SERVICE_ROLE_KEY={keys['SUPABASE_SERVICE_ROLE_KEY']}")
            replaced_role = True
            continue
        if line.startswith("# SUPABASE_SERVICE_ROLE="):
            new_lines.append(f"SUPABASE_SERVICE_ROLE_KEY={keys['SUPABASE_SERVICE_ROLE_KEY']}")
            replaced_role = True
            continue
        new_lines.append(line)

    if not replaced_url and not have_url:
        new_lines.insert(3, f"SUPABASE_URL={keys['SUPABASE_URL']}")
    if not replaced_role:
        # Tras bloque SERVICE ROLE comentado
        insert_at = None
        for i, line in enumerate(new_lines):
            if "SERVICE ROLE" in line:
                insert_at = i + 1
                break
        if insert_at is not None:
            new_lines.insert(insert_at, f"SUPABASE_SERVICE_ROLE_KEY={keys['SUPABASE_SERVICE_ROLE_KEY']}")
        else:
            new_lines.append(f"SUPABASE_SERVICE_ROLE_KEY={keys['SUPABASE_SERVICE_ROLE_KEY']}")

    env_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")


def main() -> None:
    write_env = "--write-env" in sys.argv
    dry = "--dry-run" in sys.argv
    keys = fetch_vps_nh_env()
    if write_env:
        patch_env_local(keys)
        print("Actualizado .env.local con SUPABASE_SERVICE_ROLE_KEY (desde VPS).")

    env = {**os.environ, **keys}
    cmd = ["node", str(ROOT / "scripts" / "sync-infer-compradores.mjs")]
    if dry:
        cmd.append("--dry-run")
    print("Ejecutando sync-infer-compradores.mjs …")
    subprocess.run(cmd, cwd=str(ROOT), env=env, check=True)


if __name__ == "__main__":
    main()
