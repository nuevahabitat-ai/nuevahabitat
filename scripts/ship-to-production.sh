#!/usr/bin/env bash
# Cloud Agent: push rama actual y llevar cambios a main (Production en Vercel).
# Uso: ./scripts/ship-to-production.sh [verify-url-path]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "No hay rama activa." >&2
  exit 1
fi

push_branch() {
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    git push "https://x-access-token:${GITHUB_TOKEN}@github.com/nuevahabitat-ai/nuevahabitat.git" "HEAD:${branch}"
  else
    git push -u origin "HEAD:${branch}"
  fi
}

echo "→ Push ${branch}…"
push_branch

if [[ "$branch" == "main" ]]; then
  echo "→ Ya en main; Vercel Production se actualizará solo."
else
  echo "→ Merge a main…"
  git fetch origin main
  git checkout main
  git pull --ff-only origin main
  git merge --no-edit "origin/${branch}"
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    git push "https://x-access-token:${GITHUB_TOKEN}@github.com/nuevahabitat-ai/nuevahabitat.git" main
  else
    git push origin main
  fi
  git checkout "$branch" 2>/dev/null || true
fi

verify_path="${1:-}"
if [[ -n "$verify_path" ]]; then
  url="https://www.nuevahabitat.com${verify_path}"
  echo "→ Comprobar ${url} (espera ~60s si el deploy acaba de arrancar)…"
  for i in 1 2 3 4 5 6; do
    code="$(curl -sS -o /dev/null -w '%{http_code}' "$url" || true)"
    if [[ "$code" == "200" ]]; then
      echo "OK ${code} ${url}"
      exit 0
    fi
    sleep 15
  done
  echo "Aviso: ${url} devolvió HTTP ${code:-?} — revisa Vercel Production." >&2
  exit 1
fi

echo "→ Hecho. Comprueba Vercel: deployment Production en www.nuevahabitat.com"
