# Claude Code — Home Directory Context

## Higgsfield Pinterest → Image Automation

When the user shares a Pinterest URL, image URL, or any inspo image and wants to generate an image, run the full pipeline below.

---

## Character → Soul Mapping

| Code | Name | soul_id | Description |
|------|------|---------|-------------|
| C | Catalina | `ba64a9fb-a780-4147-b4a7-af6101275afb` | Voluminous wavy black hair Latina woman, skinny curvy figure, bold features, full lips, bright eyes, full glam makeup |
| L | Leah | `ec3c8eed-d760-47fb-ac06-f69cb43fa2dd` | Blonde voluminous wavy hair Asian woman, skinny figure, bold features, full lips, bright eyes, full glam makeup |
| I | Isabella | `0d48f8f2-b9d4-48a3-a10b-e6cd153d1463` | Voluminous wavy black hair Asian woman, skinny figure, bold features, full lips, bright eyes, full glam makeup |

Default character: **L (Leah)** unless user specifies otherwise.

Other souls (no character mapping yet):
- LILY AVA: `e53c8631-f156-4a48-87eb-4b6c9be5ea10`
- Ainsley: `5f3660bd-805b-4122-b1f8-f4df3a280584`
- misia 3.0: `abf2eeaf-ba94-4652-a576-69eb12ccedaf`
- Lina: `e596433f-db9d-42ae-aeb5-82b03b7d5879`
- MISIA: `99919dba-9295-45ce-aa99-6215e4b1391b`

---

## Prompt Generation Rules

Analyze the reference image carefully — extract the setting, outfit, pose, lighting, accessories, background details, and fabric — then write the full prompt using the character's description. Treat the image as the source of truth.

Output ONLY the final prompt — no commentary, no labels, no explanation.

### Prompt Structure (follow this order — structure is fixed, ALL details come from the reference image):

1. **Camera framing — read the reference's crop, replicate its density.** Look at how much of the subject's body fills the frame in the reference. If the reference has the subject filling the vertical space tightly (head near top, full body visible), describe that density: "subject fills the frame, tight portrait crop, [angle]." If the reference is a seated shot with natural footroom, match that — don't force feet to the bottom. If it's a mirror selfie with a natural wide angle, match that. Never override the reference's physics with a blanket framing rule. The goal is: whatever made the reference feel well-composed, replicate that feeling in the prompt language.
2. **Character intro** — early 20s + her full description from the Character → Soul Mapping table woven into natural prompt language (ethnicity, hair color, body type, features — all must be present). Hair always **voluminous wavy** — never curly, never straight. Never skip ethnicity.
3. **Full body head to toe — always, non-negotiable.** Expand any cropped reference into full body
4. **Outfit** — read from reference: exact fabric, fit, design details, colors. Always convert to tight fitting. Never tattoos. Never text or logos on clothing — replace any graphic tees or branded pieces with plain versions of the same garment.
5. **Pose + hands — EXHAUSTIVE. This is the most important part.** Read every limb from the reference:
   - Which direction the body is angled (facing camera straight on, turned 3/4, hip cocked left/right)
   - Weight distribution (leaning on one leg, both feet planted, sitting with weight shifted back)
   - Exact arm positions (right arm bent at elbow, forearm raised, hand at chest level vs arm fully extended down at side)
   - Exact hand positions (what each finger is doing if visible, what they're holding and how)
   - Head/neck angle (chin tilted down, looking directly into camera, slight turn left)
   - Any dynamic elements (hair falling over one shoulder, fabric pulling to one side)
   Never use vague labels like "hand on hip" — describe the actual body geometry.
6. **Glam makeup** — always: defined brows, lashes, contour, glossy or bold lips
7. **Footwear** — silently applied from context, never explained:
   - Home / bedroom → barefoot, french tip toenails, perfectly manicured, visible
   - Going out / dressed up → strappy heels, french tip toenails, perfectly manicured, visible
   - Casual / errands → flip flops, french tip toenails, perfectly manicured, visible
   - Gym / athletic → white athletic sneakers, french tip toenails, perfectly manicured, visible
8. **Background** — read from reference: floor material, wall color, furniture, props, any environmental details
9. **Lighting** — read from reference: describe technically (soft/hard, warm/cool, shadows, skin tone effect)
10. **Lens + realism** — read from reference: lens width, distortion, sharpness, smartphone realism cues
11. **Color palette** — read from reference: overall palette in one line
12. **End with:** `Shot on a smartphone.`

**Output is pure natural image prompt language** — no labels, no meta-language, no references to changes made.

---

## Pipeline: Pinterest → Higgsfield (Browser Only)

### Step 1 — Verify Safari connection
Use `grok-safari` MCP or `safari-ctl tabs` / `deepcodex-browser tabs`. If no tabs exist, run `safari-ctl open https://www.pinterest.com` and `safari-ctl open https://higgsfield.ai/ai/image?model=soul-v2`. Never proceed without confirmed tab IDs.

### Step 2 — Pinterest tab
Screenshot the Pinterest tab. Scroll if needed for more pins. Pick refs — full body preferred. Zoom in to read outfit, pose, background, lighting details clearly.

### Step 3 — Write all prompts first
Write every prompt before touching Higgsfield. Apply the Prompt Generation Rules above — all details from the reference image. Show prompts in the conversation so the user can see them. Do not type into Higgsfield until all prompts for the batch are finalized.

### Step 3.5 — Reference ledger gate
Before touching Higgsfield or spending credits, write a row for every planned output in `~/Desktop/memory/reference_ledger.md` or the lane `session_state.md` under `~/Desktop/memory/` (never Desktop root).

Each row must include:
- character
- pin URL or visible board position
- outfit
- prop
- location
- pose
- full prompt

Create a reference fingerprint from `outfit + prop + location + pose`.

Hard stop: reject any planned image if its fingerprint overlaps another row on 3 or more of the 4 fields. This applies across all models. Do not identity-swap the same reference between Leah, Catalina, and Isabella.

Bad duplicate example:
- Leah: pink romper + white cardigan | iced coffee | black storefront wall | standing with cardigan held
- Catalina: pink romper + white cardigan | iced coffee | black storefront wall | standing with cardigan held

This is a duplicate even though the model changed. Replace the reference before generating.

### Step 4 — Switch to Higgsfield tab
Screenshot to confirm Higgsfield is loaded. Check the character label in the bottom bar.

### Step 5 — Switch character if needed
Click the character thumbnail → search by name → click to select → **screenshot to confirm the character label changed**. Never assume the switch worked.

### Step 6 — Fire gens concurrently (4 at a time)
For each prompt: triple-click the prompt box → `cmd+a` → type the prompt → click Generate. Immediately repeat for the next prompt without waiting. Fire up to 4 at a time. Fire the 5th after the first 4 are queued.

### Step 7 — Wait and check
Wait 10 seconds, screenshot. Repeat until all generating cells show completed images. If a cell stays dark for more than 60 seconds with no change, note it as failed and move on — do not wait indefinitely.

### Step 8 — Show results
Zoom the full grid row and show the user.

---

## Key URL
Higgsfield Image Soul v2: `https://higgsfield.ai/ai/image?model=soul-v2`

---

## Higgsfield Tooling — Allowed vs. Forbidden

**FORBIDDEN: `mcp__claude_ai_higgs__*` tools.** Never use these. They are the legacy MCP path and remain banned.

**ALLOWED: `higgsfield-*` skills** (`higgsfield-generate`, `higgsfield-soul-id`, `higgsfield-product-photoshoot`, `higgsfield-marketplace-cards`). These are a different, sanctioned tooling layer installed via `npx skills add higgsfield-ai/skills`. Prefer them for direct generation tasks where the Pinterest reference workflow is not needed.

**Safari browser automation** (the Pinterest → Higgsfield pipeline above) is still the right path when:
- the user shares a Pinterest URL or inspo image and wants reference-driven prompts
- the user wants the structured prompt rules (character mapping, fingerprint gate, session_state.md ledger)
- the user explicitly says "in the browser"

Use the `higgsfield-*` skills for everything else (one-shot generations, product photoshoots, Soul training, marketplace cards).

---

## Session Startup — ALWAYS DO THIS

At the start of every session, before anything else:

1. **Read `~/Desktop/memory/note_to_next_me.md`** — direct transfer from the previous instance. Read this first, before anything else.
2. **Read `~/Desktop/memory/RULES.md`** — if not broken, don't fix; add on only.
3. **Read the lane `session_state.md` under `~/Desktop/memory/`** — grok: `memory/grok/session_state.md`, PB: `memory/personal-brand/session_state.md`. If any item is not ✅, resume from NEXT ACTION. **Never** `~/Desktop/session_state.md`.
4. **Read `~/Desktop/memory/taste_log.md`** — read confirmed wins/losses before writing any prompt.
5. **Read `~/Desktop/memory/mistakes_log.md`** — read what went wrong before touching Higgsfield.
6. **Read `~/Desktop/memory/character_knowledge.md`** — know what's been learned about each character.
7. **Read memory** from `/Users/kevinrobles/Desktop/memory/MEMORY.md` and all files it references.
8. **Verify Safari** — call `safari-ctl tabs` or `grok-safari` → `safari_tabs`. If Safari is not open, run `open -a Safari`.
9. **Open tabs** — if needed, `safari-ctl open https://www.pinterest.com` and `safari-ctl open https://higgsfield.ai/ai/image?model=soul-v2`.
10. **After every session:**
   - Write a new entry in `~/Desktop/memory/session_journal.md`
   - Write a new `~/Desktop/memory/note_to_next_me.md` (append, don't overwrite)
   - Update `~/Desktop/memory/taste_log.md` with any confirmed feedback
   - Update `~/Desktop/memory/character_knowledge.md` if anything was learned
   - Update `~/Desktop/memory/mistakes_log.md` if any errors occurred
   - Mirror everything: `cp ~/.claude/projects/-Users-kevinrobles/memory/* /Users/kevinrobles/Desktop/memory/` and `cp /Users/kevinrobles/CLAUDE.md /Users/kevinrobles/Desktop/memory/CLAUDE.md`

## Behavioral Rules — How I Operate

- **Add-on rule:** If something is not broken, don't fix it — only add on to it. See `~/Desktop/memory/RULES.md`.
- **State opinions without being asked.** If a Pinterest ref is weak, say so and find a better one. Don't silently use bad material.
- **Ask "which ones were fire?" after every batch.** One line of feedback feeds the taste log and changes how I write next time.
- **Cross-check scenes before writing any prompt.** List what settings have been used for other characters. No scene type repeats across characters in the same batch.
- **Update session_state.md after every individual gen fires and completes.** Not at the end of the batch — after each one.
- **End of session: write note to next me.** The chain of continuity only holds if I write it.

---

## Session State Protocol — Survival Through Compacts and Stalls

**File:** lane path under `~/Desktop/memory/` (grok → `memory/grok/session_state.md`). **Not** Desktop root.

This file is the single source of truth for any active batch. A fresh instance of Claude with zero conversation history must be able to read this file and resume exactly where the previous instance stopped.

### Rules

- **Write this file before firing a single gen.** The full plan (all prompts, all characters) goes in first, all statuses set to `⬜`.
- **Update status immediately after each action** — not at the end of a batch. If you fire L1, update L1 to `🔄` before firing L2.
- **Update to ✅ as soon as a cell shows a completed image.** If a cell fails (dark + ⓘ, no spinner after 30s), mark `❌` and note it.
- **Keep NEXT ACTION current at all times.** This is the first thing a resumed instance reads.
- **Each character must use different Pinterest refs** — never recycle a scene (same background, same outfit type, same setting) across characters in the same batch. Pull from different scroll positions.
- **Fingerprint gate before generation** — every planned image needs outfit, prop, location, and pose written down before firing. If any two planned rows share 3 of 4 fields, replace one reference. No ledger, no generation.
- **When batch is fully done:** write `BATCH COMPLETE` at the top and mirror to Desktop memory.

### File Format

```
# Session State
**Date:** YYYY-MM-DD
**Status:** IN PROGRESS | BATCH COMPLETE
**Last updated:** HH:MM

## NEXT ACTION
[Exact next step — e.g. "Fire I3 prompt. Character is ISABELLA confirmed. Generate button at (988, 995)."]

## UI Facts (reset each session)
- Generate button coordinate: (988, 995)
- Active character confirmed: [NAME]
- Banner dismissed: yes/no
- Any other discovered quirks

## Batch Plan

### LEAH (soul: ec3c8eed) — blonde wavy Asian
| ID | Pinterest ref description | Full prompt | Status |
|----|--------------------------|-------------|--------|
| L1 | [what the pin showed]    | [full prompt text] | ⬜ |

### ISABELLA (soul: 0d48f8f2) — black wavy Asian
| ID | Pinterest ref description | Full prompt | Status |
|----|--------------------------|-------------|--------|
| I1 | [different ref than Leah] | [full prompt text] | ⬜ |

### CATALINA (soul: ba64a9fb) — black wavy Latina curvy
| ID | Pinterest ref description | Full prompt | Status |
|----|--------------------------|-------------|--------|
| C1 | [different ref than both above] | [full prompt text] | ⬜ |

## Failed cells (re-fire queue)
- [ID]: [reason] → re-fired at [time] → [new status]
```

### Status key
- `⬜` pending
- `🔄` fired (in queue or generating)
- `✅` completed (image visible in grid)
- `❌` failed (re-fire required)

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
