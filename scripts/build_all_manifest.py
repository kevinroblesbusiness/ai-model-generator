#!/usr/bin/env python3
"""Build manifest.json listing all reference images in the repo."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from paths import MODEL_PICS_DIR, REPO_ROOT

TRAINING_DIR = REPO_ROOT / "trainig_data_pinterest_2026-04-23"
BATCH_DIR = MODEL_PICS_DIR / "all_reference"
MANIFEST = BATCH_DIR / "manifest.json"


def main():
    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    images = sorted(TRAINING_DIR.glob("*.jpg"))
    entries = [
        {"id": f"{i:03d}", "file": img.name, "source": str(img.relative_to(REPO_ROOT))}
        for i, img in enumerate(images, 1)
    ]
    manifest = {
        "batch": "all_reference",
        "count": len(entries),
        "source_dir": str(TRAINING_DIR.relative_to(REPO_ROOT)),
        "files": entries,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Wrote {len(entries)} entries to {MANIFEST.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
