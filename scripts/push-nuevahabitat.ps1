# Antes de push en este repo: cuenta activa nuevahabitat-ai (evita 403 con danielhdz-ai)
gh auth switch -u nuevahabitat-ai
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git push -u origin HEAD
