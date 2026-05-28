from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def scan_pdf_duplicates(*directories: Path) -> dict[str, Any]:
    by_hash: dict[str, list[dict[str, Any]]] = {}
    scanned: list[str] = []

    for directory in directories:
        if not directory.exists():
            continue
        for pdf in sorted(directory.glob("**/*.pdf")):
            if not pdf.is_file():
                continue
            if pdf.name.startswith("._") or pdf.name == ".DS_Store":
                continue
            scanned.append(str(pdf))
            digest = file_sha256(pdf)
            entry = {
                "path": str(pdf),
                "size_bytes": pdf.stat().st_size,
                "name": pdf.name,
            }
            by_hash.setdefault(digest, []).append(entry)

    duplicate_groups = [
        {"sha256": digest, "copies": copies}
        for digest, copies in by_hash.items()
        if len(copies) > 1
    ]

    return {
        "scanned_count": len(scanned),
        "unique_count": len(by_hash),
        "duplicate_group_count": len(duplicate_groups),
        "duplicate_groups": duplicate_groups,
        "scanned_paths": scanned,
    }
