# ChatGPT session for cloud browser pool

The cloud VM **has no visible desktop** — you can't sign in there directly.  
Sign in on your **Mac**, export a session file, upload it to the agent.

## Step 1 — Login on Mac (2 minutes)

From your local clone of this repo:

```bash
bash scripts/chatgpt-login-mac.sh
```

1. Browser opens → `chatgpt.com/images/`
2. Sign in with ChatGPT
3. Wait for the prompt box to appear
4. **Close the browser**

This creates `infra/secrets/chatgpt-storage.json` (cookies + localStorage).

## Step 2 — Upload to cloud

**Easiest:** drag `infra/secrets/chatgpt-storage.json` into this Cursor chat.

Or scp:

```bash
scp infra/secrets/chatgpt-storage.json cloud:/workspace/infra/secrets/
```

Then message the agent: **session uploaded**

## Step 3 — Agent verifies + runs

```bash
node scripts/verify-chatgpt-session.js
GROK_PW_DRY_RUN=0 npm run browser-pool:live
node memory/grok/scripts/grok-preflight-playwright.js
```

## Alternative — copy Mac Playwright profile

If you already have `~/.grok/gpt-images-playwright/`:

```bash
rsync -av ~/.grok/gpt-images-playwright/ infra/storage/browser-profile/grok/
```

## Security

- **Never commit** `chatgpt-storage.json` — it's in `.gitignore`
- Session expires — re-run Mac login if preflight fails

## Env vars

| Var | Purpose |
|-----|---------|
| `GROK_CHATGPT_STORAGE` | Path to storage JSON (default: `infra/secrets/chatgpt-storage.json`) |
| `GROK_PW_DRY_RUN=0` | Live Playwright |
| `GROK_SKIP_THINKING_GATE=1` | Emergency only |
