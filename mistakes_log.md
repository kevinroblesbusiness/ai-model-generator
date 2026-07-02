# Mistakes Log — Image Gen Failures (cute-bed, nudes, room scenes, etc.)

Append-only. Read before every new cute-bed or nudes bundle.

Format: date — character — step — room/angle used — reason — redo variation chosen.


## 2026-06-28 — GPT Images ref upload method locked
- **Only method:** Playwright MCP skill `gpt-images-playwright-upload-ref` (batch `browser_run_code_unsafe`, 10 tabs ~30s)
- **Removed:** `grok-warm-tabs`, `grok-upload-pic`, Safari WebDriver upload, `grok-stage` pic upload path, `pb-warm` / `pb-warm-all`
- **Doc:** `~/Desktop/memory/grok/GPT_IMAGES_UPLOAD.md`
- Kevin confirmed 10/10 pass in Playwright MCP session 2026-06-28

- Character: catalina
- Step: T1 (tits test)
- Deleted file: catalina_T1_tits.jpeg
- Prompt issue: Ref scene + room/furniture described in prompt — model rebuilt wrong loft (two-story, different sofa color)
- Failure reason: Room changed from uploaded ref. Never prompt room/scene — ref image owns the setting.
- Redo: pose + hands + action + camera only, no room/furniture/props

## 2026-06-18 — PROMPT RULES locked (nudes lane)
- **Never suffix:** `simple natural pose easy to recreate in one common smartphone photo` · `no skyline or city view visible` · `photoreal smartphone photo`
- **Code tail only:** `highly detailed realistic skin`
- **Never prompt room/scene/furniture** — ref owns setting
- **Never selfie on full-body** — legs crossed / full body visible → `camera straight-on full body at eye level` not selfie
- Enforced in: `prompt-build.js` · `pose-simplicity.js` · `rules/nudes_bundle.md`

## 2026-06-18 — parallel batch cross-contamination (wrong identity in folder)
- **Layer 1:** `nsfw-copy-latest` newest-file race when `--source` missing
- **Layer 2 (real bug):** wavespeed `saved` filenames collide at **second** precision — 45 parallel runs overwrite same `2026-06-18T05-10-10-….jpeg`; hash-matched copy still wrong (file on disk already Leah)
- Symptom: `catalina_N1_nude.jpeg` = Leah blonde bathroom selfie; Catalina ref = dark hair living room
- Fix: stage immediately to `staging/{char}/{date}/{slot}-{uuid}.jpeg`; store `outputUrl`; repair from unique CDN URL via `nsfw-repair-from-cdn.js`
- Repaired: all 45 re-downloaded from CDN output URLs in batch logs

## 2026-06-18 — tits branch must keep bottom on
- Catalina T1 fire (pose/room/ref match) but model went bottomless — tits branch must prompt **bottom stays on**
- Fix: bundle `**Bottom stays on:**` field → code injects on T1–T5 only
- Catalina: `black mini skirt still on hips and upper thighs`
