#!/usr/bin/env python3
"""
AI Library Synchronization Layer — AI Engineering Lab

Mirrors approved PDFs and queue artifacts between:
  - /Volumes/AI_MODELS/AI_LIBRARY/
  - projects/local-chatbot/

Default mode is dry-run. Pass --apply to write mirrors and regenerate queues.

Usage:
    python automation/scripts/sync_ai_library.py
    python automation/scripts/sync_ai_library.py --apply
    python automation/scripts/sync_ai_library.py --apply --verbose

Does NOT modify OpenClaw, MCP, swarm, startup, or production agent systems.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
LIB_ROOT = REPO_ROOT / "automation" / "lib"
if str(LIB_ROOT) not in sys.path:
    sys.path.insert(0, str(LIB_ROOT))

from ai_library_sync import SyncConfig, run_sync  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="AI Library sync layer")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply mirrors and regenerate queues (default: dry-run)",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print sync_status JSON to stdout",
    )
    args = parser.parse_args()

    config = SyncConfig.load(REPO_ROOT)

    if not config.library_root.exists():
        print(f"Library root not found: {config.library_root}", file=sys.stderr)
        print("Mount /Volumes/AI_MODELS/AI_LIBRARY/ and retry.", file=sys.stderr)
        return 1

    mode = "APPLY" if args.apply else "DRY-RUN"
    print("AI Library Synchronization Layer")
    print(f"  Repo:    {config.repo_root}")
    print(f"  Library: {config.library_root}")
    print(f"  Mode:    {mode}")
    print()

    result = run_sync(config, apply=args.apply)

    validation = result["validation"]
    sync_status = result["sync_status"]
    duplicates = result["duplicates"]

    print(f"Resources:     {sync_status['resource_count']}")
    print(f"PDFs on disk:  {sync_status['pdfs_on_disk']}")
    print(f"Validation:    {validation['error_count']} errors, {validation['warning_count']} warnings")
    print(f"Duplicates:    {duplicates['duplicate_group_count']} group(s)")
    print(f"Actions:       {len(sync_status['actions'])}")

    print()
    print("Reports written:")
    print(f"  {config.repo_path('sync_status')}")
    print(f"  {config.repo_path('health_report')}")
    print(f"  {config.repo_path('duplicate_detection')}")
    print(f"  {config.repo_path('lesson_resource_links')}")
    print(f"  {config.library_path('library_sync_dir')}/")

    if result["dry_run"]:
        print()
        print("Dry-run: mirror/copy and queue regeneration skipped.")
        print("Run with --apply to persist mirrors and regenerate queues.")
    else:
        print()
        print("Applied: PDF mirrors, queues, and metadata index updated.")

    if args.verbose:
        print()
        print(json.dumps(sync_status, indent=2))

    return 1 if validation["error_count"] > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
