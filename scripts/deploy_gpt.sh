#!/usr/bin/env bash
# Deploy site/ to kevinroblesbusiness/gpt (run locally with your GitHub auth)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMPDIR:-/tmp}/gpt-deploy-$$"
trap 'rm -rf "$TMP"' EXIT

python3 "$ROOT/scripts/export_site_data.py"
git clone "https://github.com/kevinroblesbusiness/gpt.git" "$TMP"
rsync -a --delete "$ROOT/site/" "$TMP/"
cd "$TMP"
git add -A
if git diff --staged --quiet; then
  echo "Nothing to deploy."
  exit 0
fi
git commit -m "Deploy GPT site from ai-model-generator ($(date -u +%Y-%m-%d))"
git push origin main
echo "Done: https://github.com/kevinroblesbusiness/gpt"
