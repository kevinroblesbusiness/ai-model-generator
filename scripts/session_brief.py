#!/usr/bin/env python3
"""Generate session brief. Run from repo root or scripts/."""

import json
import os
import sys
from datetime import datetime

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent.parent))
from paths import BRAIN_DIR, PROMPTS_DIR, REPO_ROOT, SCHEDULE_HISTORY, SESSION_BRIEF

TODAY = datetime.now().strftime("%Y-%m-%d")


def read(path):
    if os.path.exists(path):
        with open(path) as f:
            return f.read()
    return ""


def approved_count():
    count = {"leah": 0, "catalina": 0, "isabella": 0}
    edited = PROMPTS_DIR / TODAY / "edited"
    if not edited.exists():
        return count
    for f in edited.iterdir():
        if "approved" in f.name:
            for char in count:
                if f.name.startswith(char):
                    count[char] += 1
    return count


def todays_schedule():
    if not SCHEDULE_HISTORY.exists():
        return "No schedule yet — run scripts/scheduler.py first."
    with open(SCHEDULE_HISTORY) as f:
        history = json.load(f)
    today = history.get(TODAY, {})
    if not today:
        return "No schedule for today — run scripts/scheduler.py first."
    lines = []
    for model, slots in today.items():
        for slot, data in slots.items():
            approved = "✅" if data.get("approved") else "⬜"
            lines.append(
                f"  {approved} {model.capitalize():10} {slot:12} {data['id']} — {data['label']}"
            )
    return "\n".join(lines)


def trend_status():
    current = read(BRAIN_DIR / "trends" / "current.md")
    for line in current.splitlines():
        if "Last Updated" in line:
            if TODAY in line:
                return "✅ Trends up to date"
            return "⚠️  TRENDS OUTDATED — update brain/trends/current.md before generating"
    return "⚠️  Could not verify trend date"


def character_summary(char):
    return read(BRAIN_DIR / "characters" / f"{char}.md").strip()


def run():
    character = sys.argv[1].lower() if len(sys.argv) > 1 else None
    counts = approved_count()
    total = sum(counts.values())

    lines = [
        f"# Session Brief — {TODAY}",
        "",
        "## Status",
        f"- {trend_status()}",
        f"- Approved total: {total} | Leah: {counts['leah']} | Catalina: {counts['catalina']} | Isabella: {counts['isabella']}",
        "- Goal: 9/day (3 per model)",
        "",
        "## Today's Schedule",
        todays_schedule(),
        "",
        "## Rules (always apply)",
        read(BRAIN_DIR / "rules" / "universal.md").strip(),
        "",
        "## Active Reminders",
        read(BRAIN_DIR / "memory" / "reminders.md").strip(),
    ]

    if character:
        lines += [
            "",
            f"## {character.capitalize()} — Character File",
            character_summary(character),
            "",
            f"## {character.capitalize()} — Tracker",
            read(BRAIN_DIR / "memory" / f"tracker_{character}.md").strip(),
        ]

    SESSION_BRIEF.parent.mkdir(parents=True, exist_ok=True)
    SESSION_BRIEF.write_text("\n".join(lines) + "\n")
    print(f"Wrote {SESSION_BRIEF.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    run()
