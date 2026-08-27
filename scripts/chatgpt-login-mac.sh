#!/usr/bin/env bash
# Run this on your Mac — cloud VM has no visible desktop for sign-in.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="infra/secrets/chatgpt-storage.json"
mkdir -p infra/secrets

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ChatGPT login (Mac) → export session for cloud"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  A browser will open to chatgpt.com/images/"
echo "  1. Sign in with your ChatGPT account"
echo "  2. Wait until you see the Images prompt box"
echo "  3. Close the browser window"
echo ""
echo "  Session saves to: $OUT"
echo ""

npx playwright install chromium 2>/dev/null || true
npx playwright open "https://chatgpt.com/images/" --save-storage="$OUT"

if [[ ! -f "$OUT" ]]; then
  echo "❌ No session file created. Did you close the browser after login?"
  exit 1
fi

echo ""
echo "✅ Session saved."
echo ""
echo "Next — upload to cloud agent (pick one):"
echo ""
echo "  A) Drag $OUT into the Cursor chat"
echo "  B) scp $OUT cloud:/workspace/infra/secrets/chatgpt-storage.json"
echo "  C) Commit to a private branch (not recommended — contains cookies)"
echo ""
echo "Then tell the agent: session uploaded"
echo ""
