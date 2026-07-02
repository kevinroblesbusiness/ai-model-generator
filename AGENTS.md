# Agent Roles — Bounded Memory

**Coordinator:** Kevin + `session_state.md` + `*-orchestrate` (no gen/send access)

Read `SCALING_AGENTS.md` and `DESIGN_BEFORE_BUILD.md` before assigning work to any agent.

**New workflow gate:** `design-check new-workflow --lane LANE --name NAME --ack-transcript`  
**Resume batch:** `*-orchestrate` only — no transcript re-ack unless building new automation.

---

## NSFW agents

| Agent | Trigger | Owns | May read | Must NOT read |
|-------|---------|------|----------|---------------|
| **Ref analyst** | Ref dropped in `ref/` | Image → bundle pose briefs | ref image, `rules/nudes_bundle.md`, `taste_log.md` | 15 old prompts, wavespeed output |
| **Brainstorm** | `nsfw-brainstorm` | 15 unique briefs → `bundles/` | ref, slot-specs, prior mistakes | full prompt history |
| **Prompt builder** | `nsfw-import-bundle` | One row → one `.txt` | one bundle row, `nudes-master.txt`, `prompt-build.js` | other slots' `.txt` at build time |
| **Prompt QA** | `nsfw-verify-prompts` | Duplicate/uniqueness check | `ideas/*.brief.txt`, 15 `.txt` headers | images |
| **Ref uploader** | `nsfw-cli upload-ref` | Local ref → CDN cache | one ref file, `.daily-refs.json` | prompts |
| **Slot runner** | Kevin `go T{n}` | ONE wavespeed run + copy | one `T{n}.txt`, CDN URL, one `cli-inputs/*.json` | full bundle, all 15 images |
| **Organizer** | `nsfw-organize` | Folder layout + queue | model output dir, slot-specs | prompt content |
| **Review** | Batch complete | ✅/❌ per slot | one image + its prompt | all 15 at once for decisions |
| **Recover** | Bad gen | delete → mark → redo ONE slot | `mistakes_log.md`, redo angle rules | rerun whole bundle |

**Orchestrator:** `nsfw-orchestrate` — checks G0–G4, prints next command. Never calls `wavespeed`.

---

## IG agents

| Agent | Trigger | Owns | May read | Must NOT read |
|-------|---------|------|----------|---------------|
| **Ideas** | `instagram-fit-ideas` skill | 11 vibe lines → `batches/` | `gen_z_vibe_gate.md`, `taste_log.md` | SKU ledger unless asked |
| **Validator** | `grok-pipeline validate` | Gen Z + color gate | one batch file, optional morning batch | Safari |
| **Sync** | `grok-pipeline sync` | Batch → `session_state.md` | approved batch | prompts |
| **Importer** | `grok-import-batch` | 11 `{Model}.txt` files | session_state row, master template | other batches |
| **Verifier** | `grok-pipeline verify` | File existence + Gen Z prefix | 11 prompt files | images |
| **Warmer** | Playwright MCP `gpt-images-playwright-upload-ref` | Upload 10 model refs | `models.manifest.json` | prompt bodies |
| **Stager** | `grok-stage` / `stage-all` | Fill prompt in one tab | one `{Model}.txt`, one pic | all 11 prompts |
| **Sender** | Kevin `go M{n}` | ONE ChatGPT send | one tab, one prompt file | other models |
| **Policy retry** | S8 after block | Edit message, resend same | one tab state | batch replan |
| **Review** | Kevin feedback | `--mark done` / taste_log | one result at a time | — |

**Orchestrator:** `grok-orchestrate` — checks G0–G4, prints next command. Never clicks Send.

---

## Horizontal vs vertical placement

| Capability | Placement | Why |
|------------|-----------|-----|
| Prompt rules (nipples, hands, same girl) | **Vertical** in `prompt-build.js` | Coupled to every NSFW prompt |
| Gen Z / vibe rules | **Vertical** in `gen-z-check.js` | Coupled to every IG line |
| Ref scene analysis | **Horizontal** ref analyst step | Reusable across characters |
| `upload-ref` / `warm-tabs` | **Horizontal** stage | Once per batch, many slots/models |
| `verify-prompts` | **Embedded** in build path | Coupled to import, not separate agent |
| Single slot/model gen | **Horizontal** `nsfw-cli` / `grok-send` | Independent, bounded, G4-gated |

---

## Session startup read order (all lanes)

1. `DESIGN_BEFORE_BUILD.md` (this design lens)
2. `SCALING_AGENTS.md`
3. `rules/agent_gates.md`
4. Lane `START_HERE.md` → `session_state.md` → `note_to_next_me.md`