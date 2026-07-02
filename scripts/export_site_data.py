#!/usr/bin/env python3
"""Export brain/scheduling JSON for the GPT static site."""

import json
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DATA = SITE / "data"


def main():
    DATA.mkdir(parents=True, exist_ok=True)
    today = datetime.now().strftime("%Y-%m-%d")

    shutil.copy(ROOT / "brain/scheduling/history.json", DATA / "schedule.json")
    shutil.copy(ROOT / "brain/scheduling/outfit_history.json", DATA / "outfit_history.json")

    schedule = json.loads((DATA / "schedule.json").read_text())
    outfits = json.loads((DATA / "outfit_history.json").read_text())

    night_batch = {}
    day = schedule.get(today, {})
    day_outfits = outfits.get(today, {})
    for model in ("leah", "catalina", "isabella"):
        if model in day and "night" in day[model]:
            night_batch[model] = {
                "setting": day[model]["night"],
                "outfit": day_outfits.get(model, {}),
            }

    (DATA / "night_batch.json").write_text(json.dumps({
        "date": today,
        "slot": "night",
        "models": night_batch,
    }, indent=2) + "\n")

    print(f"Exported site data for {today} → {DATA.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
