from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import SyncConfig
from .duplicates import scan_pdf_duplicates
from .future_hooks import ensure_future_extension_stubs
from .mirrors import (
    build_lesson_resource_links,
    mirror_notebooklm_pack,
    mirror_pdf_to_inbox,
    reconcile_local_paths,
    write_json,
    write_text,
)
from .reports import render_health_report
from .validators import validate_resources


def _import_ingest_module(repo_root: Path):
    scripts = repo_root / "automation" / "scripts"
    if str(scripts) not in sys.path:
        sys.path.insert(0, str(scripts))
    import ingest_math_resources as ingest  # noqa: WPS433

    return ingest


def run_sync(config: SyncConfig, apply: bool = False) -> dict[str, Any]:
    dry_run = not apply
    ingest = _import_ingest_module(config.repo_root)

    manifest_path = config.repo_path("manifest")
    manifest = ingest.load_manifest()
    config.assert_allowed_paths(manifest_path, config.library_root)

    pdf_dir = config.library_path("library_pdf_dir")
    inbox_dir = config.library_path("library_inbox_dir")
    nb_library = config.library_path("library_notebooklm_dir")
    nb_queue = config.repo_path("notebooklm_pack_queue")
    calibre_queue = config.repo_path("calibre_import_queue")
    commuter_queue = config.repo_path("commuter_review_queue")

    path_actions = reconcile_local_paths(manifest, pdf_dir)

    validation = validate_resources(
        manifest["resources"],
        config.raw["validation"]["required_lesson_slugs"],
    )

    duplicates = scan_pdf_duplicates(pdf_dir, inbox_dir)

    mirror_actions: list[dict[str, Any]] = list(path_actions)

    for resource in manifest["resources"]:
        action = mirror_pdf_to_inbox(resource, inbox_dir, dry_run=dry_run)
        if action:
            mirror_actions.append(action)

    if apply:
        ingest.generate_queues(manifest)
        ingest.save_manifest(manifest)
        index = ingest.build_metadata_index(manifest)
        ingest.save_metadata_index(index)
    else:
        mirror_actions.append(
            {
                "action": "generate_queues",
                "targets": [
                    str(calibre_queue),
                    str(nb_queue),
                    str(commuter_queue),
                ],
                "dry_run": True,
            }
        )
        index = ingest.build_metadata_index(manifest)

    lesson_links = build_lesson_resource_links(manifest)

    for resource in manifest["resources"]:
        action = mirror_notebooklm_pack(resource["id"], nb_queue, nb_library, dry_run=dry_run)
        if action:
            mirror_actions.append(action)

    future_extensions = ensure_future_extension_stubs(config, dry_run=dry_run)

    pdfs_on_disk = sum(
        1 for p in pdf_dir.glob("*.pdf") if p.is_file() and not p.name.startswith("._")
    ) if pdf_dir.exists() else 0

    sync_status: dict[str, Any] = {
        "schema_version": "1.0.0",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "mode": "apply" if apply else "dry-run",
        "library_root": str(config.library_root),
        "repo_root": str(config.repo_root),
        "resource_count": len(manifest["resources"]),
        "pdfs_on_disk": pdfs_on_disk,
        "validation": {
            "valid": validation["valid"],
            "error_count": validation["error_count"],
            "warning_count": validation["warning_count"],
        },
        "duplicates": {
            "duplicate_group_count": duplicates["duplicate_group_count"],
            "scanned_count": duplicates["scanned_count"],
        },
        "actions": mirror_actions,
        "queues": {
            "calibre_import_queue": str(calibre_queue),
            "notebooklm_pack_queue": str(nb_queue),
            "commuter_review_queue": str(commuter_queue),
            "library_notebooklm_packs": str(nb_library),
        },
        "future_extensions": future_extensions,
    }

    health_report = render_health_report(validation, sync_status, duplicates)

    # Reports and indexes are always written; mirror/copy actions respect dry_run.
    write_json(config.repo_path("sync_status"), sync_status, dry_run=False)
    write_json(config.repo_path("duplicate_detection"), duplicates, dry_run=False)
    write_json(config.repo_path("lesson_resource_links"), lesson_links, dry_run=False)
    write_text(config.repo_path("health_report"), health_report, dry_run=False)

    library_sync_dir = config.library_path("library_sync_dir")
    write_json(library_sync_dir / "sync_status.json", sync_status, dry_run=False)
    write_json(library_sync_dir / "duplicate_detection.json", duplicates, dry_run=False)
    write_text(library_sync_dir / "resource_health_report.md", health_report, dry_run=False)

    if apply:
        ingest.save_metadata_index(index)

    return {
        "sync_status": sync_status,
        "validation": validation,
        "duplicates": duplicates,
        "dry_run": dry_run,
    }
