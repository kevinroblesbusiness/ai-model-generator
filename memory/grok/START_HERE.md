# Grok lane — start here

**Lane root:** `memory/grok/` (cloud: repo `memory/grok/`)

## Session startup (disk is truth)

1. `memory/note_to_next_me.md`
2. `memory/RULES.md`
3. **`memory/grok/session_state.md`** → NEXT ACTION
4. `memory/taste_log.md`
5. `memory/mistakes_log.md`
6. Preflight: `node memory/grok/scripts/grok-preflight-playwright.js --fix` (when browser pool live)

## Build batch (S1–S4, disk only)

```bash
node memory/grok/scripts/grok-pipeline.js build --batch memory/grok/instagram-sexy-fits/batches/036-gen-z-day-scene-mix-jul02.md
```

## Full send pipeline (after Kevin go)

```bash
node memory/grok/scripts/grok-pipeline.js build --batch BATCH.md
node memory/grok/scripts/grok-warm-playwright.js
node memory/grok/scripts/grok-pipeline.js stage-all --prompt-only --stop-on-fail
GROK_GO_SEND_ALL=1 node memory/grok/scripts/grok-send-all.js --delay 25 --i-said-go --stop-on-fail
node memory/grok/scripts/grok-retry-policy-all.js --wait 60
```

## Gates

All stages call `batch-gates.js`. No bypass. Stall recover: `grok-stall-recover --batch FILE --max 5`.

See `PIPELINE.md` and `CLOUD_MIGRATION.md` at repo root.
