# Model Pics — Batch 036

10 reference images for Leah, Catalina, and Isabella prompt/memory work.

## Layout

```
model_pics/batch_036/
  manifest.json          # pic metadata + character mapping
  01_leah_gym_mirror.jpg
  02_leah_athletic.jpg
  ...
  10_reference_pose.jpg
```

## Validate

```bash
python3 scripts/sync_model_pics.py 036
```

## Replace seeds

Drop your approved generations into this folder using the same filenames, or update `manifest.json` and re-run sync.

Paths resolve via `paths.py` from any machine — no hardcoded home directories.
