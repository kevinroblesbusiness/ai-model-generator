# Cloud migration — Kevin multi-lane pipeline

This repo ports the macOS Playwright + markdown-state pipeline to cloud-native services while preserving lane isolation, gate logic, and disk-as-truth semantics.

## Repo layout

```
memory/
  RULES.md              # universal add-on rules
  note_to_next_me.md    # session handoff
  taste_log.md          # Kevin fire/miss feedback
  mistakes_log.md
  grok/                 # 10-model IG lane (authoritative session_state here)
  personal-brand/       # pb-* fork (isolated)
models/                 # 10 identity refs
services/
  orchestrator/         # HTTP :3100 — validate, build, status
  browser-pool/         # HTTP :3101 — warm, stage, send (Playwright integration point)
  higgsfield-cli/       # Soul v2 CLI wrapper
infra/
  docker-compose.yml
```

## Quick start (disk stages S1–S4)

```bash
npm run grok:gates    # G1 gate check
npm run grok:build    # S1–S4 on batch 036
```

## Browser pool — GPT Images in cloud

**Yes — target is live ChatGPT Images via Playwright**, not the static `site/` copy-paste flow.

| Mode | Command |
|------|---------|
| Dry run (no login) | `npm run browser-pool` |
| **Live** | `npm run browser-pool:live` after login |
| Login once | `npm run browser-pool:login` → log in at chatgpt.com/images |

Session profile: `infra/storage/browser-profile/grok/` — see `infra/secrets/README.md`.

```bash
GROK_PW_DRY_RUN=0 npm run browser-pool:live
node memory/grok/scripts/grok-warm-playwright.js
node memory/grok/scripts/grok-stage-all.js
# GROK_GO_SEND_ALL=1 node memory/grok/scripts/grok-send-all.js
```

## Orchestrator API

| Method | Path | Maps to |
|--------|------|---------|
| POST | `/batch/validate` | `batch-gates.js` |
| POST | `/batch/build` | `grok-pipeline build` |
| GET | `/batch/status` | `memory/grok/session_state.md` |

## Session resume (zero chat history)

1. Read `memory/note_to_next_me.md`
2. Read `memory/RULES.md`
3. Read `memory/grok/session_state.md` → **NEXT ACTION**
4. Run preflight / continue stage

## What’s live vs stub

| Piece | Status |
|-------|--------|
| `batch-gates.js`, `gen-z-check`, `grok-pipeline` S1–S4 | ✅ tested on batch 036 |
| `browser-pool` warm/stage/send | ✅ live Playwright when `GROK_PW_DRY_RUN=0` + logged-in profile |
| `scene-cycle`, `color-cycle`, `car-cycle` | partial stubs |
| Personal-brand `pb-*` | stub directory |
| Higgsfield CLI | dry-run wrapper |

## Kevin actions required

1. Export remaining Mac scripts to `memory/grok/scripts/` if not yet synced
2. Provide ChatGPT session for browser pool (`infra/secrets/`)
3. Say **go** before any `GROK_GO_SEND_ALL=1` send
4. After batch: answer “which ones were fire?” → `memory/taste_log.md`

## Non-negotiables

- Safari banned for grok warm/stage/send
- Thinking = High before send
- One stage = one command
- Never share `session_state` between lanes
- Add-on rule: fork, don’t rewrite master prompts
