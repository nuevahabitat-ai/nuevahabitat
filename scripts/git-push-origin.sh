#!/usr/bin/env bash
# Push usando GITHUB_TOKEN (Cloud Agent secret) si Cursor managed auth falla.
set -euo pipefail
branch="${1:-$(git branch --show-current)}"
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  exec git push -u origin "HEAD:${branch}"
fi
exec git push "https://x-access-token:${GITHUB_TOKEN}@github.com/nuevahabitat-ai/nuevahabitat.git" "HEAD:${branch}"
