# AI Library Sync Layer

Persistent synchronization between the repo and `/Volumes/AI_MODELS/AI_LIBRARY/`.

## Operating Rule

70% foundations · 20% applied projects · 10% frontier scanning

## Commands

```bash
# Dry-run (default) — validate, detect duplicates, write reports
python automation/scripts/sync_ai_library.py

# Apply mirrors, regenerate queues, update metadata index
python automation/scripts/sync_ai_library.py --apply

# Verbose JSON output
python automation/scripts/sync_ai_library.py --verbose
```

## What Sync Does

| Step | Dry-run | Apply |
|------|---------|-------|
| Metadata validation | yes | yes |
| Duplicate PDF detection | yes | yes |
| Write `sync_status.json` | yes | yes |
| Write `resource_health_report.md` | yes | yes |
| Write `duplicate_detection.json` | yes | yes |
| Write `lesson_resource_links.json` | yes | yes |
| Mirror PDFs → `AI_LIBRARY/inbox/` | plan only | yes |
| Mirror NotebookLM packs → `AI_LIBRARY/notebooklm_packs/` | plan only | yes |
| Regenerate Calibre / commuter / NotebookLM queues | plan only | yes |
| Future extension stubs | create if missing | yes |

## Artifacts

| File | Location |
|------|----------|
| `sync_status.json` | `courses/math/resources/` + `AI_LIBRARY/sync/` |
| `resource_health_report.md` | same |
| `duplicate_detection.json` | same |
| `lesson_resource_links.json` | repo only (generated lesson map) |

## Metadata Validation

Flags missing:

- lesson links (`lessons`)
- `difficulty`
- `reinforcement_priority`
- `copyright_status`

## Future Extensions (stubs)

Configured in `automation/config/ai_library_sync.json`:

- YouTube transcript indexing (manual paste only)
- HuggingFace dataset references (metadata only)
- arXiv feed monitoring (frontier scan)
- NotebookLM export manifests (manual export)

## Related

- `automation/scripts/ingest_math_resources.py` — initial ingestion + PDF download
- `automation/scripts/sync_ai_library.py` — ongoing sync
- `courses/math/resources/download_policy.md` — download rules

## Scope

Operates only inside:

- `/Volumes/AI_MODELS/AI_LIBRARY/`
- `projects/local-chatbot/`

Does **not** modify OpenClaw, MCP, swarm, startup, or production agent systems.
