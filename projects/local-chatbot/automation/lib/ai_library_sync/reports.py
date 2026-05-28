from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def render_health_report(
    validation: dict[str, Any],
    sync_status: dict[str, Any],
    duplicates: dict[str, Any],
) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    mode = sync_status.get("mode", "dry-run")
    actions = sync_status.get("actions", [])

    lines = [
        "# Resource Health Report",
        "",
        f"**Generated:** {now}  ",
        f"**Sync mode:** {mode}  ",
        f"**Operating rule:** 70% foundations · 20% applied · 10% frontier scan",
        "",
        "## Summary",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Resources in manifest | {sync_status.get('resource_count', 0)} |",
        f"| PDFs on disk | {sync_status.get('pdfs_on_disk', 0)} |",
        f"| Validation errors | {validation.get('error_count', 0)} |",
        f"| Validation warnings | {validation.get('warning_count', 0)} |",
        f"| Duplicate PDF groups | {duplicates.get('duplicate_group_count', 0)} |",
        f"| Mirror actions planned/applied | {len(actions)} |",
        "",
    ]

    if validation.get("issues"):
        lines.extend(["## Metadata Validation", ""])
        for issue in validation["issues"]:
            rid = issue.get("resource_id") or "—"
            lines.append(
                f"- **{issue['severity'].upper()}** `{rid}` — {issue['field']}: {issue['message']}"
            )
        lines.append("")

    if duplicates.get("duplicate_groups"):
        lines.extend(["## Duplicate PDFs", ""])
        for group in duplicates["duplicate_groups"]:
            lines.append(f"### SHA256 `{group['sha256'][:12]}…`")
            for copy in group["copies"]:
                lines.append(f"- `{copy['path']}` ({copy['size_bytes']:,} bytes)")
            lines.append("")

    lines.extend(["## Lesson Coverage", ""])
    for lesson, ids in validation.get("lesson_coverage", {}).items():
        lines.append(f"- **{lesson}:** {len(ids)} resource(s)")

    if sync_status.get("future_extensions"):
        lines.extend(["", "## Future Extensions (disabled)", ""])
        for name, info in sync_status["future_extensions"].items():
            lines.append(f"- **{name}:** {info.get('status', 'stub')} — {info.get('notes', '')}")

    lines.extend(
        [
            "",
            "## Next Steps",
            "",
            "1. Fix validation errors in `ingestion_manifest.json`.",
            "2. Run `python automation/scripts/sync_ai_library.py --apply` to persist mirrors.",
            "3. Import staged PDFs into Calibre manually from `calibre_import_queue/`.",
            "",
        ]
    )

    return "\n".join(lines)
