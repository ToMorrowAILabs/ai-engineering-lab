#!/usr/bin/env python3
"""
Math Resource Ingestion Pipeline — AI Engineering Lab

Curated index: dair-ai/Mathematics-for-ML
Storage root:   /Volumes/AI_MODELS/AI_LIBRARY/

Default mode is dry-run. Open-access PDFs download only with --download.
Never bypasses paywalls or scrapes restricted content.

Usage:
    python automation/scripts/ingest_math_resources.py
    python automation/scripts/ingest_math_resources.py --generate-queues
    python automation/scripts/ingest_math_resources.py --download
    python automation/scripts/ingest_math_resources.py --download --generate-queues

After ingestion, run sync_ai_library.py to mirror queues and write health reports.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
RESOURCES_DIR = REPO_ROOT / "courses" / "math" / "resources"
MANIFEST_PATH = RESOURCES_DIR / "ingestion_manifest.json"
METADATA_INDEX_PATH = RESOURCES_DIR / "resource_metadata_index.json"

APPROVED_PDF_HOST_PATTERNS = (
    r"arxiv\.org",
    r"github\.com",
    r"github\.io",
    r"\.edu/",
    r"bayes\.wustl\.edu",
)

BLOCKED_DOWNLOAD_HOSTS = (
    r"youtube\.com",
    r"youtu\.be",
    r"twitter\.com",
    r"x\.com",
    r"reddit\.com",
    r"huggingface\.co",
    r"google\.com",
    r"notebooklm",
    r"statlearning\.com",
    r"hastie\.su\.domains",
    r"deeplearningbook\.org",
    r"probml\.github\.io",
    r"mml-book\.github\.io",
)


def load_manifest() -> dict[str, Any]:
    with MANIFEST_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def save_manifest(manifest: dict[str, Any]) -> None:
    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
    with MANIFEST_PATH.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")


def save_metadata_index(index: dict[str, Any]) -> None:
    index["updated_at"] = datetime.now(timezone.utc).isoformat()
    with METADATA_INDEX_PATH.open("w", encoding="utf-8") as f:
        json.dump(index, f, indent=2)
        f.write("\n")


def resolve_pdf_url(resource: dict[str, Any]) -> str | None:
    """Return direct PDF URL if resource is eligible for download."""
    if not resource.get("download_allowed"):
        return None

    url = resource["url"]
    source_type = resource.get("source_type", "")

    if source_type not in ("open_pdf", "paper"):
        return None

    if re.search(r"arxiv\.org/abs/", url):
        paper_id = url.rstrip("/").split("/")[-1]
        return f"https://arxiv.org/pdf/{paper_id}.pdf"

    if url.endswith(".pdf"):
        return url

    return None


def host_allowed_for_download(url: str) -> bool:
    for pattern in BLOCKED_DOWNLOAD_HOSTS:
        if re.search(pattern, url, re.IGNORECASE):
            return False
    for pattern in APPROVED_PDF_HOST_PATTERNS:
        if re.search(pattern, url, re.IGNORECASE):
            return True
    return False


def download_pdf(url: str, dest: Path, dry_run: bool) -> bool:
    if dry_run:
        print(f"  [dry-run] would download: {url} -> {dest}")
        return False

    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "AI-Engineering-Lab-Ingest/1.0"})

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            content_type = resp.headers.get("Content-Type", "")
            if resp.status != 200:
                print(f"  [skip] HTTP {resp.status} for {url}")
                return False
            if "pdf" not in content_type.lower() and not url.endswith(".pdf"):
                print(f"  [skip] not PDF content-type ({content_type}): {url}")
                return False
            data = resp.read()
    except urllib.error.URLError as exc:
        print(f"  [error] download failed: {url} — {exc}")
        return False

    dest.write_bytes(data)
    print(f"  [saved] {dest} ({len(data):,} bytes)")
    return True


def build_metadata_index(manifest: dict[str, Any]) -> dict[str, Any]:
    resources = []
    for r in manifest["resources"]:
        entry = {
            "id": r["id"],
            "title": r["title"],
            "authors": r.get("authors", []),
            "url": r["url"],
            "lesson": r.get("lessons", []),
            "topic": r.get("lessons", ["general"])[0] if r.get("lessons") else "general",
            "difficulty": r.get("difficulty", "intermediate"),
            "reinforcement_priority": r.get("reinforcement_priority", "medium"),
            "commute_friendly": r.get("commute_friendly", False),
            "source_type": r.get("source_type"),
            "copyright_status": r.get("copyright_status"),
            "local_path": r.get("local_path"),
            "weakness_tags": r.get("weakness_tags", []),
            "curriculum_tier": r.get("curriculum_tier", "foundations"),
            "exercise_suggestion": r.get("exercise_suggestion"),
            "download_allowed": r.get("download_allowed", False),
        }
        resources.append(entry)

    by_lesson: dict[str, list[str]] = {}
    by_weakness: dict[str, list[str]] = {}
    for entry in resources:
        for lesson in entry["lesson"]:
            by_lesson.setdefault(lesson, []).append(entry["id"])
        for tag in entry["weakness_tags"]:
            by_weakness.setdefault(tag, []).append(entry["id"])

    return {
        "schema_version": "1.0.0",
        "updated_at": None,
        "library_root": manifest["library_root"],
        "resource_count": len(resources),
        "resources": resources,
        "by_lesson": by_lesson,
        "by_weakness": by_weakness,
    }


def generate_notebooklm_pack(resource: dict[str, Any]) -> str:
    lessons = ", ".join(resource.get("lessons", []))
    weakness = ", ".join(resource.get("weakness_tags", []))
    return f"""# NotebookLM Source Pack — {resource['title']}

**Resource ID:** `{resource['id']}`  
**Manual only** — paste into NotebookLM; do not automate Google login.

---

## Source: Overview

{resource['title']} by {', '.join(resource.get('authors', []))}.
URL: {resource['url']}
Source type: {resource.get('source_type')}. Difficulty: {resource.get('difficulty')}.
Mapped lessons: {lessons}.
Curriculum tier: {resource.get('curriculum_tier', 'foundations')}.

## Source: AI Engineering Connection

This resource supports AI Engineering Lab math foundations ({manifest_pct_note()}).
Weakness remediation tags: {weakness or 'none'}.
Exercise suggestion: {resource.get('exercise_suggestion', 'See lesson_resource_map.md')}.

## Source: Key Concepts to Retain

- Identify 3–5 core concepts from this resource relevant to {lessons or 'ML math'}.
- Relate each concept to an AI system you are building (RAG, training, evaluation).
- Note notation differences vs the MML book / week-04 anchor lesson.

## Source: Commuter Review Hook

After audio overview, answer review questions in:
`commuter_review_queue/{resource['id']}.json`

---

## Manual NotebookLM Steps

1. Open https://notebooklm.google.com/ and sign in manually.
2. Create notebook: `{resource['title'][:60]}`
3. Add pasted text sources from sections above.
4. Generate Audio Overview.
5. Complete commuter review questions.
"""


def manifest_pct_note() -> str:
    return "70% foundations, 20% applied, 10% frontier scan"


def generate_commuter_review(resource: dict[str, Any]) -> dict[str, Any]:
    return {
        "resource_id": resource["id"],
        "title": resource["title"],
        "url": resource["url"],
        "lesson": resource.get("lessons", []),
        "difficulty": resource.get("difficulty"),
        "reinforcement_priority": resource.get("reinforcement_priority"),
        "commute_friendly": resource.get("commute_friendly", False),
        "weakness_tags": resource.get("weakness_tags", []),
        "review_questions": [
            f"What is the main goal of studying {resource['title']}?",
            f"Name one AI engineering application for topics in {resource.get('lessons', ['this resource'])[0]}.",
            "What notation or concept was hardest? How would you test whether you understand it?",
            f"How does this resource connect to weakness tags: {', '.join(resource.get('weakness_tags', [])) or 'N/A'}?",
        ],
        "exercise_suggestion": resource.get("exercise_suggestion"),
        "manual_only": True,
        "instructions": "Review manually during commute. Do not automate YouTube or external logins.",
    }


def generate_calibre_sidecar(resource: dict[str, Any], pdf_path: str | None) -> dict[str, Any]:
    tags = list(resource.get("lessons", [])) + resource.get("weakness_tags", [])
    tags.append(resource.get("curriculum_tier", "foundations"))
    return {
        "resource_id": resource["id"],
        "title": resource["title"],
        "authors": resource.get("authors", []),
        "tags": tags,
        "pdf_path": pdf_path,
        "copyright_status": resource.get("copyright_status"),
        "calibre_import_instructions": [
            "Open Calibre manually.",
            "Add books -> select PDF from pdf_path or AI_LIBRARY/inbox staging.",
            "Edit metadata from this sidecar.",
            "Save to AI_LIBRARY/calibre-library/.",
        ],
    }


def generate_queues(manifest: dict[str, Any]) -> None:
    paths = manifest["paths"]
    nb_queue = REPO_ROOT / paths["notebooklm_pack_queue"]
    commuter_queue = REPO_ROOT / paths["commuter_review_queue"]
    calibre_queue = REPO_ROOT / paths["calibre_import_queue"]

    for d in (nb_queue, commuter_queue, calibre_queue):
        d.mkdir(parents=True, exist_ok=True)

    for resource in manifest["resources"]:
        rid = resource["id"]

        nb_path = nb_queue / f"{rid}.md"
        nb_path.write_text(generate_notebooklm_pack(resource), encoding="utf-8")

        commuter_path = commuter_queue / f"{rid}.json"
        with commuter_path.open("w", encoding="utf-8") as f:
            json.dump(generate_commuter_review(resource), f, indent=2)
            f.write("\n")

        if resource.get("local_path") or resource.get("download_allowed"):
            sidecar_path = calibre_queue / f"{rid}.json"
            with sidecar_path.open("w", encoding="utf-8") as f:
                json.dump(
                    generate_calibre_sidecar(resource, resource.get("local_path")),
                    f,
                    indent=2,
                )
                f.write("\n")

    print(f"Generated queues: {nb_queue}, {commuter_queue}, {calibre_queue}")


def run_downloads(manifest: dict[str, Any], dry_run: bool) -> None:
    pdf_dir = Path(manifest["paths"]["pdf_download_dir"])
    inbox_dir = Path(manifest["paths"]["calibre_staging_dir"])

    for resource in manifest["resources"]:
        pdf_url = resolve_pdf_url(resource)
        if not pdf_url:
            continue

        if not host_allowed_for_download(pdf_url):
            print(f"[blocked] host not approved: {pdf_url}")
            continue

        if resource.get("copyright_status") != "open_access":
            print(f"[blocked] copyright_status not open_access: {resource['id']}")
            continue

        filename = f"{resource['id']}.pdf"
        dest = pdf_dir / filename
        inbox_dest = inbox_dir / filename

        print(f"[download] {resource['id']}: {pdf_url}")
        ok = download_pdf(pdf_url, dest, dry_run=dry_run)

        if ok:
            resource["local_path"] = str(dest)
            if inbox_dest != dest:
                inbox_dest.write_bytes(dest.read_bytes())
                print(f"  [staged] {inbox_dest}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Math resource ingestion pipeline")
    parser.add_argument(
        "--download",
        action="store_true",
        help="Download open-access PDFs only (default: dry-run)",
    )
    parser.add_argument(
        "--generate-queues",
        action="store_true",
        help="Generate NotebookLM, commuter, and Calibre queue files",
    )
    args = parser.parse_args()

    if not MANIFEST_PATH.exists():
        print(f"Manifest not found: {MANIFEST_PATH}", file=sys.stderr)
        return 1

    manifest = load_manifest()
    dry_run = not args.download

    print(f"Math Resource Ingestion Pipeline")
    print(f"  Manifest: {MANIFEST_PATH}")
    print(f"  Library:  {manifest['library_root']}")
    print(f"  Mode:     {'DOWNLOAD' if args.download else 'dry-run'}")
    print()

    run_downloads(manifest, dry_run=dry_run)

    index = build_metadata_index(manifest)
    save_metadata_index(index)
    save_manifest(manifest)
    print(f"\nUpdated: {METADATA_INDEX_PATH}")
    print(f"Updated: {MANIFEST_PATH}")

    if args.generate_queues or args.download:
        generate_queues(manifest)

    if dry_run:
        print("\nDry-run complete. Pass --download to fetch open-access PDFs.")
        print("Pass --generate-queues to build NotebookLM/commuter/Calibre queues.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
