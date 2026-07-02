# Universal rules — all lanes, all future work

## Add-on rule (Kevin — 2026-06-23)

**If something is not broken, don't fix it — only add on to it.**

| ✅ Do | ❌ Don't |
|-------|---------|
| Keep working master prompts, pipelines, scripts as-is | Rewrite or replace proven blocks because a new persona/lane exists |
| Append persona props, gates, batch rows as **add-on blocks** | Delete or shorten grok master rules (pose, grain, not copy-pasted, etc.) |
| Fork new files (`pt-prop-rules.js`, `manifests/catalina.json`) | Edit grok files for personal-brand work |
| Extend verify gates to require existing rules stay present | "Simplify" prompts by removing lines that were working |

**Prompts specifically:** `carousel-master-core.txt` / grok `master-template.txt` are the base. Persona, fit, location, and prop rules are **layers on top** — never substitutes.

**Code specifically:** new behavior = new module or fork. Touch shared code only to wire the add-on, not to rip out what ships today.

Applies to: `grok/` · `personal-brand/` · `nsfw/` · any new lane.

## Session state — memory folder only (Kevin — 2026-07-01)

**Never create or write `~/Desktop/session_state.md`.** All live batch state lives under `~/Desktop/memory/`.

| Lane | File |
|------|------|
| Grok / GPT Images (10-model IG) | `~/Desktop/memory/grok/session_state.md` |
| Personal brand carousels | `~/Desktop/memory/personal-brand/session_state.md` |
| NSFW | `~/Desktop/memory/nsfw/session_state.md` |

`~/Desktop/memory/session_state.md` is a **router only** — not the live tracker. Update the lane file for your active batch.

## GPT Images — Playwright only (Kevin — 2026-06-28)

**Safari is banned** for warm, stage, send, preflight on `grok/` batches.

| ✅ Do | ❌ Don't |
|-------|---------|
| `grok-warm-playwright` · `grok-preflight-playwright` · Playwright MCP skill | Safari `osascript`, `safari_browser.js`, `grok-preflight-tabs` legacy Safari path |
| `grok-pipeline stage-all` / `grok-send-all` (Playwright backend) | Upload refs via Safari or AppleScript file picker |

Doc: `~/Desktop/memory/grok/GPT_IMAGES_UPLOAD.md`

## Stall recover loop (Kevin — 2026-06-25)

**If validate/build stalls, loop auto-fixes before asking Kevin.**

| ✅ Do | ❌ Don't |
|-------|---------|
| Run `grok-stall-recover --batch FILE` (max 5 rounds) on gate failures | Stop at first `❌ Batch gates failed` and wait |
| Let solver fix scene-cycle / car-cycle / Alo cache / approved status | Hand-edit batch tables blindly without re-validating |
| `grok-pipeline go --batch FILE` after recover passes | Send (S7) without green validate + `GROK_GO_SEND_ALL=1` |

**Code:** `~/Desktop/memory/grok/stall_rules.md` · **Code:** `scripts/batch-stall-fix.js` · `grok-stall-recover`

## Thigh-length shorts (Kevin — 2026-06-25)

**Shorts in prompts = thigh-length only.** Never mini, micro, or lounge shorts without `thigh-length` prefix in vibe lines. `fit-rules.js` normalizes prompt Outfit text; `location-dedup-check.js` blocks duplicate eat/location scenes per batch.

## Thinking = High (Kevin — 2026-06-25)

**Image prompts must only be sent when ChatGPT Images thinking is set to High.**

| ✅ Do | ❌ Don't |
|-------|---------|
| Run `grok-preflight-tabs` before warm/stage/send — it now checks thinking | Send from Medium/Low thinking tabs |
| Let `--fix` auto-set thinking to High on `/images` tabs | Bypass unless emergency (`GROK_SKIP_THINKING_GATE=1`) |
| Use `thinking-gate-check --all --ensure` to verify all model tabs | Assume thinking stuck from a prior session |

**Code:** `~/.grok/safari-browser/thinking-gate.js` · enforced in `send-ready` · `grok-pre-send-verify` · `grok-preflight-tabs`

## Hair (personal brand — all models)

**Straight hair worn down OR sleek ponytail only** — never wavy, curly, messy bun, or loose waves.  
Code: `~/Desktop/memory/scripts/hair-rules.js`
