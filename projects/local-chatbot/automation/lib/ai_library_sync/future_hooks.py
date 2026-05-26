from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .config import SyncConfig
from .mirrors import write_json


def ensure_future_extension_stubs(config: SyncConfig, dry_run: bool) -> dict[str, Any]:
    """Create placeholder manifests for future feed/index integrations."""
    future_root = config.library_path("library_sync_dir") / "future"
    extensions = config.raw.get("future_extensions", {})
    results: dict[str, Any] = {}

    for name, spec in extensions.items():
        manifest_rel = spec["manifest"]
        manifest_path = config.library_root / manifest_rel
        subdir = config.library_root / spec["library_subdir"]

        stub = {
            "schema_version": "1.0.0",
            "extension": name,
            "enabled": spec.get("enabled", False),
            "status": "stub",
            "notes": spec.get("notes", ""),
            "entries": [],
        }

        results[name] = {
            "status": "stub",
            "enabled": spec.get("enabled", False),
            "manifest": str(manifest_path),
            "notes": spec.get("notes", ""),
        }

        if not dry_run:
            subdir.mkdir(parents=True, exist_ok=True)
            if not manifest_path.exists():
                write_json(manifest_path, stub, dry_run=False)

    return results
