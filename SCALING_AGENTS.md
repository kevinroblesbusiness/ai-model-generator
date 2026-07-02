# Scaling Agents — Transcript + Pipeline Learnings

**Source:** YouTube transcript audit (2026-06-17 session)  
**Proof runs:** Leah 15/15 nudes bundle · IG batches 007–009 (11-model staging)

---

## Core insight

Scaling agents ≠ more servers. It is: **same loop, wider scope → cost per decision explodes, errors propagate, no natural checkpoint.**

**Fix:** bounded components, clear ownership, human gates before irreversible actions.

> You don't scale by giving one agent more tools and memory. You scale by giving each stage less to own, and putting Kevin at the gates before money fires.

---

## Transcript principles → our implementation

| Transcript principle | NSFW (nudes) | IG (grok) |
|---------------------|--------------|-----------|
| Bounded scope per decision | One slot = one CLI send, one `.txt` | One model = one stage/send |
| Failures don't propagate | Bad T1 doesn't poison T2 prompts | Bad M3 doesn't block M4 staging |
| Checkpoints before irreversible work | Kevin `go T{n}` | Kevin `go M{n}` |
| Memory doesn't bloat every step | Gen reads `T1.txt` only | Send reads one `{Model}.txt` |
| Decompose vs mega-agent | brainstorm · import · cli · organize | validate · sync · import · stage · send |
| Horizontal vs vertical | 15 slots horizontal; rules vertical in `prompt-build.js` | 11 models horizontal; Gen Z gate vertical |
| Coordination cost | `nsfw-orchestrate` (dry-run DAG) | `grok-orchestrate` (dry-run DAG) |

---

## What nudes taught us (Leah 2026-06-17)

### Wins ✅
- **15/15** with slot naming `{model}_{slot}_{branch}.jpeg`
- **One slot = one wavespeed call** — separate `cli-inputs/`, separate prompts
- **Same ref CDN** for all 15 — upload once
- **Ref-first brainstorm** — bathroom scene from hotel selfie ref
- **Simple selfie prompt** won T1 (left hand on hip only)
- **Sequential runs** — no parallel credit burn

### Failures we fixed ❌→✅
- Agent skipped brainstorm / auto-approved → **G1 + human approval**
- Agent fired without `go` → **G4 `NSFW_GO_SLOT`**
- Wrong scene until ref read → **G0 ref analyst step**
- `nsfw-copy-latest` bash 3.2 crash → fixed
- Loose `approved` match → strict `**Status:** approved`
- Ref only `ref.png` names → any image in `ref/`

### Locked prompt rules
1. Opens: `Same girl from the reference,`
2. Nipples explicit when visible
3. Selfies: prompt free hand only
4. Orgasm: `hand on vagina` — never "between legs"
5. Selfie: no mirror behind her
6. Suffix: `photoreal smartphone photo`, no skyline

---

## What IG taught us (batches 007–009)

### Wins ✅
- **Vibe-first** short lines beat SKU-heavy batches (~10× better per Kevin)
- **Gen Z gate** before any batch output (`gen_z_vibe_gate.md`)
- **S1–S9 named stages** — one command per failure point
- **Unique color per model** in every batch
- **Party/bar/restaurant → cute dress** (not crop + shorts)
- **Build = disk only** (S1–S4), Safari only for S5+
- **Batch 009** — 11/11 sent with paced `grok-send-all`

### Hard bans (taste_log)
- Skorts, sandals, mules, wedges, sneakers (vibe lane)
- Rollerways, hookah patios, Fashion Nova
- Props in Location and fit lines
- Writing into `master_prompt.md` bottom fields

### Format
```
Location and fit: [Place] morning|nighttime, cute [color] [fit], [footwear]
Time of day: morning | daytime | nighttime
```

---

## Agent decomposition (both lanes)

```
COORDINATOR (Kevin + session_state + orchestrate script)
    │
    ├── A: Ideas / ref analyst     → bundle or batches/*.md only
    ├── B: Prompt builder        → one row → one file
    ├── C: Preflight / verify    → rules gate, no gen
    ├── D: Gen / send runner     → ONE slot or ONE model (G4)
    ├── E: Organizer             → folders + queue
    └── F: Review / recover      → ✅/❌, redo one unit only
```

---

## Audit commands

```bash
nsfw-audit --character leah      # NSFW pipeline health report
grok-audit                         # IG pipeline health report
```

Reports: decision count, context bounds, gate enforcement, failure propagation risk, unbounded responsibilities.

---

## Multi-model scale rule

**Never** one agent session for:
- Leah + Catalina + Isabella nudes (3 × 15)
- All 11 IG models at gen/send time

**Do:** one bounded batch per model/character, different refs, fingerprint gate (outfit + prop + location + pose).

---

## Deterministic CLI vs skill walls (GStack critique)

**Problem:** Skills that are programs written in English — bash blocks, if-when-unless rules — get fed into a non-deterministic model every invoke. Token burn + drift.

**Fix we built:**
- **NSFW:** `nsfw-cli`, `nsfw-import-bundle`, `nsfw-verify-prompts`, `nsfw-orchestrate` — rules in `prompt-build.js`
- **IG:** `grok-pipeline`, `grok-send`, `gen-z-check.js`, `grok-orchestrate` — rules in disk files

**Still wrong:**
- `nudes` skill (~146 lines) — stale 10-pic / Figure 1: / hardcoded wavespeed commands
- `instagram-sexy-fits` skill (~356 lines) — legacy evo paths + English if-maze
- Agent still asked to read 300+ line START_HERE every session

**Target:** Skills = triggers + `*-orchestrate`. Everything else = CLI once, run forever.

**New workflow gate:** `design-check new-workflow --lane LANE --name NAME --ack-transcript`  
(read `DESIGN_BEFORE_BUILD.md` + transcript docs first — blocked without ack)

Run: `nsfw-audit` / `grok-audit` — includes deterministic CLI section.

---

## Related files

| File | Purpose |
|------|---------|
| `DESIGN_BEFORE_BUILD.md` | **Read before any new workflow** |
| `rules/agent_gates.md` | G0–G4 gate definitions |
| `AGENTS.md` | Bounded memory per agent role |
| `nsfw/PIPELINE.md` | NSFW stage map |
| `grok/PIPELINE.md` | IG S1–S9 stage map |