"""
Python + Git Foundations — Lab Config Manager

Creates, reads, and updates a JSON config file for the AI Engineering Lab.
Demonstrates pathlib, json module, and a clean main() entry point.

Run from this directory:
    python exercises/python_git_foundations.py
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

CONFIG_FILENAME = "lab_config.json"
DEFAULT_CONFIG = {
    "lab_name": "AI Engineering Lab",
    "python_target": "3.11+",
    "last_run": None,
}


def config_path(base_dir: Path | None = None) -> Path:
    """Return the path to lab_config.json next to this script."""
    root = base_dir or Path(__file__).resolve().parent
    return root / CONFIG_FILENAME


def load_config(path: Path) -> dict:
    """Load JSON config from disk, or return defaults if missing."""
    if not path.exists():
        return DEFAULT_CONFIG.copy()
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def save_config(path: Path, config: dict) -> None:
    """Write config dict to disk as formatted JSON."""
    with path.open("w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)
        f.write("\n")


def update_last_run(config: dict) -> dict:
    """Set last_run to current UTC ISO timestamp."""
    updated = config.copy()
    updated["last_run"] = datetime.now(timezone.utc).isoformat()
    return updated


def main() -> None:
    path = config_path()
    config = load_config(path)
    config = update_last_run(config)
    save_config(path, config)

    print(f"Lab: {config['lab_name']}")
    print(f"Python target: {config['python_target']}")
    print(f"Config saved to: {path}")
    print(f"Last run: {config['last_run']}")


if __name__ == "__main__":
    main()
