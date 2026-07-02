"""Portable repo paths — works from any checkout location."""
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
BRAIN_DIR = REPO_ROOT / "brain"
MODEL_PICS_DIR = REPO_ROOT / "model_pics"
PROMPTS_DIR = REPO_ROOT / "prompts"
SCRIPTS_DIR = REPO_ROOT / "scripts"

OUTFIT_HISTORY = BRAIN_DIR / "scheduling" / "outfit_history.json"
SCHEDULE_HISTORY = BRAIN_DIR / "scheduling" / "history.json"
SESSION_BRIEF = BRAIN_DIR / "memory" / "session_brief.md"


def batch_dir(batch_id: str) -> Path:
    return MODEL_PICS_DIR / f"batch_{batch_id}"


def model_pic(batch_id: str, filename: str) -> Path:
    return batch_dir(batch_id) / filename
