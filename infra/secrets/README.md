# ChatGPT session for cloud browser pool

GPT Images runs in cloud via **Playwright** against `https://chatgpt.com/images/` — same as your Mac pipeline, not the static copy-paste site.

## One-time login (recommended)

```bash
# Headed browser so you can log in manually once
GROK_PW_DRY_RUN=0 GROK_PW_HEADED=1 node services/browser-pool/server.js
```

Open another terminal and visit ChatGPT in that profile, or use:

```bash
npx playwright open --user-data-dir=infra/storage/browser-profile/grok https://chatgpt.com/images/
```

Log in with your ChatGPT account. Session persists in `infra/storage/browser-profile/grok/`.

## Option B — copy Mac Playwright profile

If you already use Playwright on Mac (`~/.grok/gpt-images-playwright/` or similar):

```bash
rsync -av ~/.grok/gpt-images-playwright/ infra/storage/browser-profile/grok/
```

## Run live pool

```bash
GROK_PW_DRY_RUN=0 npm run browser-pool:live
node memory/grok/scripts/grok-preflight-playwright.js
node memory/grok/scripts/grok-warm-playwright.js
node memory/grok/scripts/grok-stage-all.js
# Kevin approval only:
GROK_GO_SEND_ALL=1 node memory/grok/scripts/grok-send-all.js
```

## Env vars

| Var | Default | Purpose |
|-----|---------|---------|
| `GROK_PW_DRY_RUN` | `1` | `0` = live Playwright |
| `GROK_PW_HEADED` | off | `1` = visible browser (login/debug) |
| `GROK_PW_USER_DATA_DIR` | `infra/storage/browser-profile/grok` | persistent cookies |
| `GROK_PW_KEEP_OPEN` | off | keep browser open after commands |
| `GROK_SKIP_THINKING_GATE` | off | emergency only |

## Docker

Mount the profile volume and run non-headless login once, then headless for batch runs:

```yaml
volumes:
  - ./infra/storage/browser-profile/grok:/app/infra/storage/browser-profile/grok
environment:
  - GROK_PW_DRY_RUN=0
```
