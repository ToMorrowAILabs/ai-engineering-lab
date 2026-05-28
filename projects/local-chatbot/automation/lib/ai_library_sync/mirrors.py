from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import SyncConfig


def build_lesson_resource_links(manifest: dict[str, Any]) -> dict[str, Any]:
    lessons: dict[str, dict[str, Any]] = {}

    for resource in manifest["resources"]:
        rid = resource["id"]
        for lesson in resource.get("lessons") or []:
            bucket = lessons.setdefault(
                lesson,
                {
                    "lesson": lesson,
                    "resource_ids": [],
                    "primary": [],
                    "commute_friendly": [],
                    "open_pdf": [],
                    "exercise_suggestions": [],
                },
            )
            bucket["resource_ids"].append(rid)

            if resource.get("reinforcement_priority") == "high":
                bucket["primary"].append(rid)
            if resource.get("commute_friendly"):
                bucket["commute_friendly"].append(rid)
            if resource.get("source_type") in ("open_pdf", "paper") and resource.get("local_path"):
                bucket["open_pdf"].append(rid)
            if resource.get("exercise_suggestion"):
                bucket["exercise_suggestions"].append(
                    {"resource_id": rid, "suggestion": resource["exercise_suggestion"]}
                )

    return {
        "schema_version": "1.0.0",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source_manifest": "ingestion_manifest.json",
        "lessons": lessons,
    }


def reconcile_local_paths(manifest: dict[str, Any], pdf_dir: Path) -> list[dict[str, Any]]:
    """Align manifest local_path with PDFs on disk."""
    actions: list[dict[str, Any]] = []

    for resource in manifest["resources"]:
        rid = resource["id"]
        expected = pdf_dir / f"{rid}.pdf"
        current = resource.get("local_path")

        if expected.exists():
            if current != str(expected):
                actions.append(
                    {
                        "action": "set_local_path",
                        "resource_id": rid,
                        "from": current,
                        "to": str(expected),
                    }
                )
                resource["local_path"] = str(expected)
        elif current and not Path(current).exists():
            actions.append(
                {
                    "action": "clear_missing_local_path",
                    "resource_id": rid,
                    "was": current,
                }
            )
            resource["local_path"] = None

    return actions


def mirror_pdf_to_inbox(
    resource: dict[str, Any],
    inbox_dir: Path,
    dry_run: bool,
) -> dict[str, Any] | None:
    local_path = resource.get("local_path")
    if not local_path:
        return None

    src = Path(local_path)
    if not src.exists():
        return None

    dest = inbox_dir / src.name
    if dest.exists() and dest.stat().st_size == src.stat().st_size:
        return {"action": "skip", "resource_id": resource["id"], "path": str(dest)}

    if dry_run:
        return {
            "action": "mirror_pdf",
            "resource_id": resource["id"],
            "from": str(src),
            "to": str(dest),
            "dry_run": True,
        }

    inbox_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return {
        "action": "mirror_pdf",
        "resource_id": resource["id"],
        "from": str(src),
        "to": str(dest),
        "dry_run": False,
    }


def mirror_notebooklm_pack(
    resource_id: str,
    repo_queue: Path,
    library_output: Path,
    dry_run: bool,
) -> dict[str, Any] | None:
    src = repo_queue / f"{resource_id}.md"
    if not src.exists():
        return None

    dest = library_output / f"{resource_id}.md"
    if dest.exists() and dest.read_text(encoding="utf-8") == src.read_text(encoding="utf-8"):
        return {"action": "skip", "resource_id": resource_id, "path": str(dest)}

    if dry_run:
        return {
            "action": "mirror_notebooklm_pack",
            "resource_id": resource_id,
            "from": str(src),
            "to": str(dest),
            "dry_run": True,
        }

    library_output.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return {
        "action": "mirror_notebooklm_pack",
        "resource_id": resource_id,
        "from": str(src),
        "to": str(dest),
        "dry_run": False,
    }


def write_json(path: Path, payload: dict[str, Any], dry_run: bool) -> None:
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")


def write_text(path: Path, content: str, dry_run: bool) -> None:
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
