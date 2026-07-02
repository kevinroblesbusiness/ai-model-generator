#!/usr/bin/env python3
"""List and validate model pics for a batch using portable paths."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from paths import REPO_ROOT, batch_dir


def sync(batch_id: str = "036") -> int:
    bdir = batch_dir(batch_id)
    manifest_path = bdir / "manifest.json"
    if not manifest_path.exists():
        print(f"No manifest at {manifest_path.relative_to(REPO_ROOT)}")
        return 1

    with open(manifest_path) as f:
        manifest = json.load(f)

    missing = []
    present = []
    for entry in manifest["files"]:
        pic = bdir / entry["file"]
        if pic.exists():
            present.append(entry["file"])
        else:
            missing.append(entry["file"])

    print(f"Batch {batch_id}: {len(present)}/{len(manifest['files'])} pics present")
    for name in present:
        print(f"  ✓ {name}")
    for name in missing:
        print(f"  ✗ {name} (missing)")

    return 0 if not missing else 1


if __name__ == "__main__":
    bid = sys.argv[1] if len(sys.argv) > 1 else "036"
    raise SystemExit(sync(bid))
