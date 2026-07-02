# Memory + Model Pics

Brain memory system and batch model pics for cloud/local agent work.

## Quick start

```bash
python3 scripts/session_brief.py          # refresh brain/memory/session_brief.md
python3 scripts/sync_model_pics.py 036    # verify batch 036 pics
python3 outfit_gen.py leah going_out      # outfit slot picker (repo root)
python3 scheduler.py                      # daily setting assignments (repo root)
```

## Layout

| Path | Purpose |
|------|---------|
| `brain/` | Character files, memory trackers, trends, scheduling |
| `model_pics/batch_036/` | 10 model reference images + manifest |
| `scripts/` | Portable-path helpers (`session_brief.py`, `sync_model_pics.py`) |
| `paths.py` | Repo-root resolver — use everywhere instead of hardcoded paths |
| `prompts/` | Daily raw/edited prompt output |

## Model pics

See `model_pics/batch_036/README.md`. Replace seed images with your approved generations when ready.

## Memory

Read `brain/memory/session_brief.md` at session start (regenerate with `scripts/session_brief.py`).

Full workflow index: `CLAUDE.md`.
