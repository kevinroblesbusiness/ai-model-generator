# Note to next me — 2026-06-28 (GPT IMAGES UPLOAD — PLAYWRIGHT MCP ONLY)

**S5 warm-pics:** Playwright MCP skill `gpt-images-playwright-upload-ref` — one `browser_run_code_unsafe` batch, 10 tabs, ~30s.  
**Doc:** `~/Desktop/memory/grok/GPT_IMAGES_UPLOAD.md`  
**Removed:** `grok-warm-tabs`, `grok-upload-pic`, Safari pic upload in `grok-stage`, `pb-warm`, `pb-warm-all`.

Pipeline: Cursor warm refs → `grok-pipeline stage-all --prompt-only` → send.

---

# Note to next me — 2026-06-26 (COLOR + SCENE GATE HARDENING)

Read this first.

## Full audit done — pink streak can’t recur

**Root cause:** Leah pink streak — night-only color cycle, `blush`≠`pink`, SKU colors ignored, `batchNum` bug in history builder.

**Code shipped:**
- `scripts/color-cycle-check.js` — SKU-first `getEffectiveModelColor`, full **3-post lookback all colors** (day+night), pink streak overlay, `Plum Kiss`→pink, banned olive via SKU
- `scripts/batch-gates.js` — `isBannedEffectiveColor`, cross-batch venue gate, morning scene dedup via `sceneFamily`, removed duplicate night color check
- `scripts/cross-batch-venue-check.js` — 8-post venue repeat per model
- `scripts/scene-cycle-check.js` — GRWM action wins over `home` in location
- `scripts/audit-all-gates.js` + `scripts/test/gates-color.test.js` + `gates-scene.test.js`

**Batches fixed:** 030 day + 031 night pass all gates. Row changes:
- 030: Isabella **home** (was eat), Hanna **Bluestone ALO** (was Green Olive)
- 031: Isabella **eat/flower truck**, Emily **Sonic Pink gym**, Lexi **Bluestone studio**

**Re-imported prompts:** `--batch` 030 + 031. **Restage 030** (rows changed) then stage 031 prompt-only. **No gen** until Kevin says go.

**Audit:** `node scripts/audit-all-gates.js` — only 030/031 pass; older 016–029 fail retroactively (expected).

---

## Kevin — $8K Dec → $4K now · content reframe

**Problem:** PB educator carousels (tips, travel, decoder dating) don't drive OF subs.  
**Fix:** New batches C10/C11/C12 — POV + direct-to-viewer hooks. See `personal-brand/of_funnel_rules.md`.

**Run order:** C10 Isabella outfit → C12 Leah outfit → C11 Catalina dating POV  
**Tonight 2026-06-24 v2 RETRY:** 3/3 on correct tabs ✅ Leah W1T1 · Catalina W1T2 · Isabella W1T3  
**Isabella C10 v2:** NEW dresses (champagne/cobalt/hot pink) — NOT C5 black/burgundy/emerald  
**Always:** `pb-switch-manifest.sh all-three` then `node scripts/pb-send-three.js` for triple nights  
**Ledger:** `personal-brand/outfit_fingerprint_ledger.md`

**Carousels alone won't fix churn** — also check OF post cadence, PPV, DM funnel, win-back.

---

# Note to next me — 2026-06-24 (PB travel = NO)

Read this first.

## Kevin feedback — skip PB travel carousels

**Do not build/send** personal-brand `topic: travel` carousels (on-location destination slides). Kevin hates them after Leah C6 + Isabella C9.

**Use instead:** LIST · REAL · TRUTH · POV · outfit try-on · apartment/home settings. Policy scrub still applies at send.

---

# Note to next me — 2026-06-23 (batch 025 night SENT)

## Batch 025 — DONE

**Batch:** `instagram-sexy-fits/batches/025-gen-z-night-scene-mix-jun23.md`  
**Prompt dir:** `prompts/025-gen-z-night-scene-mix-jun23`  
**session_state:** `~/Desktop/memory/grok/session_state.md`

| ID | Model | Scene | Status |
|----|-------|-------|--------|
| M1 | Leah | Malibu beach | 📤 sent |
| M2 | Catalina | Miami house party | 📤 sent |
| M3 | Isabella | Scottsdale house party | 📤 sent |
| M4 | Valeria | Austin studio | 📤 sent |
| M5 | Emily | Laguna Beach | 📤 sent |
| M6 | Mila | Beverly Hills Mercedes-AMG GT 63 | 📤 sent |
| M7 | Lexi | LA house party | 📤 sent |
| M8 | Hanna | LA high-rise GRWM | 📤 sent |
| M9 | Ainsly | Austin house party | 📤 sent |
| M10 | Lana | Scottsdale mansion | 📤 sent |

**Pipeline:** build → warm → stage-all --prompt-only → send-all 60s → policy-retry (clean).  
**Scene-cycle fixes:** Emily beach (not car), Mila car/Mercedes (not party), Hanna GRWM (not studio). Colors: Valeria lavender, Mila navy (sage/orange banned).

**NEXT ACTION:** Kevin review gens → mark done → taste_log feedback. Ask which were fire.

---

# Note to next me — 2026-06-23 (batch 024 v2 SENT)

Read this first.

## Batch 024 v2 — DONE

**Batch:** `instagram-sexy-fits/batches/024-gen-z-day-scene-mix-jun23.md` (v2 scene-cycle fix)  
**Prompt dir:** `prompts/024-gen-z-day-scene-mix-jun23`  
**session_state:** `~/Desktop/memory/grok/session_state.md`

| ID | Model | Scene | Status |
|----|-------|-------|--------|
| M1 | Leah | Nashville Target shopping | 📤 sent |
| M2 | Catalina | Beverly Hills Porsche Taycan 4S | 📤 sent |
| M3 | Isabella | Scottsdale studio | 📤 sent |
| M4 | Valeria | Malibu beach | 📤 sent |
| M5 | Emily | LA studio | 📤 sent |
| M6 | Mila | Scottsdale gym | 📤 sent |
| M7 | Lexi | Miami Aventura Mall shopping | 📤 sent |
| M8 | Hanna | LA gym | 📤 sent |
| M9 | Ainsly | Laguna Beach | 📤 sent |
| M10 | Lana | Scottsdale juice bar eat | 📤 sent |

**Pipeline run:** Playwright MCP warm refs → stage-all --prompt-only → send-all 60s → policy-retry (clean).  
**Leah fix:** old M1 Porsche (car repeat) replaced with shopping — re-sent successfully.

**NEXT ACTION:** Kevin review gens → mark done. Ask which were fire for taste_log.

## v2 row tweaks vs brainstorm

- Lexi: eat → **shopping** (eat pool cycle blocked since 021)
- Ainsly: mansion → **beach** (mansion blocked since 013)
- Catalina car: **Porsche** (car cycle after 023 Tesla)

## Scene cycle gate (still valid)

Full 10-family pool in `scene-cycle-check.js` + `batch-gates.js`. Run before every brainstorm:
`node ~/Desktop/memory/grok/scripts/scene-cycle-check.js BATCH.md`

## Safari

If Safari closed / tabs missing: open 10 tabs on `https://chatgpt.com/images/` in window 1, then `grok-preflight-tabs --fix`.

---

## Personal Brand lane — 2026-06-23

**Root:** `~/Desktop/memory/personal-brand/` — **never edit grok/ for PB work**

**Fork rule:** Always copy grok scripts → `pb-*.js`. Only shared layer: `~/.grok/safari-browser/`.

**Fork inventory (complete):**
- `pb-preflight-tabs.js` (1 tab Leah W1T1)
- `pb-stage.js` + `pb-stage-gate.js`
- `pb-send-core.js` → used by `pb-send-carousel.js`
- `pb-pipeline`, gates, orchestrate, etc.

**Active batch:** `batches/001-leah-travel-nurse-list-jun23.md` (LIST family, ceil blue scrubs)  
**Session:** `personal-brand/session_state.md`

| Slide | Status |
|-------|--------|
| C1-S1 | 📤 sent (Kevin confirmed test worked) |
| C1-S2 | ❌ failed — retry |
| C1-S3–S5 | ⬜ pending |

**NEXT:** Send remaining slides when Kevin ready.

---

## Universal add-on rule — 2026-06-23

**If not broken, don't fix — add on only.** Full doc: `~/Desktop/memory/RULES.md`

Prompts: grok master / `carousel-master-core.txt` is base — persona props are layers, never replacements.

**PB latest:** C2-FULL Catalina PT LIST sent (master core restored + PT add-ons). Manifest switch: `pb-switch-manifest.sh catalina|leah`.
