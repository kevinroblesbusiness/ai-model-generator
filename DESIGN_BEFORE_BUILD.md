# Design Before Build — Mandatory Read

**Read this file before designing or implementing any new workflow, skill, or pipeline stage.**

No new automation until this checklist is satisfied. Chat memory is not enough — disk is truth.

---

## Step 0 — Transcript gate (required for NEW workflows)

```bash
design-check    # verify docs exist + print read order
```

Read in order, then ack:

```bash
design-check new-workflow --lane nsfw|ig|other --name SHORT_NAME --ack-transcript
```

**Blocked without `--ack-transcript`:** new scripts, new skills, new pipeline stages, new automation lanes.  
**Not required:** resuming existing batch via `*-orchestrate`.

Files to read before ack:

1. **`SCALING_AGENTS.md`** — scaling agents transcript + nudes + IG learnings + GStack critique
2. **`rules/agent_gates.md`** — G0–G4 for your lane
3. **`AGENTS.md`** — who owns what, bounded memory
4. **This file** — full checklist

---

## Step 1 — Name the bounded unit

Every workflow must declare its **smallest irreversible unit**:

| Lane | Unit | Irreversible action |
|------|------|---------------------|
| NSFW | One slot (T1…O5) | One Wavespeed run (~credits) |
| IG | One model (M1…M11) | One ChatGPT Images send |
| Higgsfield | One prompt cell | One Higgsfield gen |
| Fanvue | One post | One publish |

If you cannot name the unit, the scope is too wide — decompose first.

---

## Step 2 — Draw the DAG (not a mega-loop)

```
PLAN → VALIDATE → BUILD → PREFLIGHT → {Kevin gate} → EXECUTE → ORGANIZE → REVIEW → RECOVER
```

Rules:
- **One stage = one script = one failure point**
- **Stop on first fail** — no opaque chains
- **Orchestrator coordinates only** — no API/send access on orchestrator
- **Specialist executes one stage**

---

## Step 3 — Define gates (before code)

| Gate | What must be true | Who approves |
|------|-------------------|--------------|
| G0 | Source material analyzed (ref image / batch ideas) | Kevin |
| G1 | Written spec approved on disk | Kevin |
| G2 | Automated verify pass | Script |
| G3 | Preflight pass (refs, files, CDN, tabs) | Script |
| G4 | Explicit `go` for spend/send | Kevin |

Encode G4 in the runner:
- NSFW: `NSFW_GO_SLOT` or `--i-said-go`
- IG: `GROK_GO_SEND` or `--i-said-go`

---

## Step 4 — Bounded memory table

For each agent/stage, write:

| Stage | May read | Must NOT read |
|-------|----------|---------------|
| … | … | … |

**Failure mode to avoid:** one agent loading full bundle + all outputs + full session history before one decision.

---

## Step 5 — Failure containment

- Redo **one slot/model** only — never rerun whole batch for one bad cell
- Log to `mistakes_log.md` with reason
- Queue file tracks per-unit status + `failure_reason`
- Never redo same angle/room area (nudes: `redo-failed` skill)

---

## Step 6 — Cost / decision awareness

| Scope | Rule |
|-------|------|
| Test | One unit only (`go T1`, `go M1`) |
| Full batch | Sequential, not parallel |
| Multi-character | Separate sessions per character |
| Track | `credits_spent`, `slots_ok`, `slots_redo` in session_state |

---

## Step 7 — Apply lane learnings

### From nudes (if NSFW-adjacent)
- Ref-first brainstorm from actual image
- `Same girl from the reference,` opener
- Slot naming `{model}_{slot}_{branch}.jpeg`
- Separate `.txt` per slot — never mixed prompts
- `nsfw-cli` = one slot, one send

### From IG (if content/staging-adjacent)
- Vibe-first short lines — no web search default
- Gen Z gate before showing Kevin batch ideas
- Unique color per model
- `master_prompt.md` bottom stays empty
- S1–S4 disk-only before Safari

---

## Step 8 — Deliverables before first run

- [ ] `PIPELINE.md` stage row (id, command, pass, fail, next)
- [ ] `session_state.md` template with NEXT ACTION
- [ ] Gate enforced in runner script
- [ ] `*-orchestrate` dry-run command
- [ ] `*-audit` report command
- [ ] `START_HERE.md` updated with read order
- [ ] Entry in `SCALING_AGENTS.md` if new pattern learned

---

## Deterministic CLI rule (GStack critique)

**If it runs the same way every time, it must be a CLI — not English in a skill.**

| Do in CLI (cached, deterministic) | Do in AI (creative, once) |
|-----------------------------------|---------------------------|
| validate, import, verify, preflight | ref analysis, vibe ideas, pose briefs |
| orchestrate (next command) | Kevin taste feedback |
| gen/send with G4 gate | pick better Pinterest ref |
| organize, copy-latest, audit | — |

**Skills should be ~25 lines:** trigger keywords + `run *-orchestrate` + pointer to `START_HERE`.  
**Never:** 300-line skill walls with bash blocks and English if-statements the model re-reads every invoke.

Session start: `nsfw-orchestrate` / `grok-orchestrate` (~1KB) beats re-reading 300+ lines of START_HERE + skills.

---

## Anti-patterns (reject immediately)

| Anti-pattern | Why it fails |
|--------------|--------------|
| "Just run it all" | Unbounded decisions, assumption poisoning |
| One agent owns brainstorm + gen + review | Context bloat, skipped gates |
| Parallel gens without Kevin batch approval | Credit firehose |
| Reusing same scene across characters | Fingerprint duplicate |
| Trusting chat after compact | Wrong state — read disk |
| Giant SKILL.md with code + if-checks | Token burn; non-deterministic replay of deterministic logic |
| Agent runs wavespeed/grok-send without CLI | Skips gates; hallucinates flags |

---

## Quick reference

```bash
# New workflow gate (read transcript first)
design-check
design-check new-workflow --lane ig --name my-thing --ack-transcript

# Resume existing batch (no new-workflow gate)
nsfw-orchestrate --character leah
grok-orchestrate

# Health audit
nsfw-audit --character leah
grok-audit
```

**If `design-check new-workflow` was not acked, do not build new automation.**