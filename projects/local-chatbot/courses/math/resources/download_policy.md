# Math Resource Download Policy

## Operating Rule

**70% foundations · 20% applied projects · 10% frontier scanning**

Math resources support the foundation track. Frontier papers are indexed for scanning only unless explicitly marked for deep study.

## Canonical Storage

All downloaded files and generated packs live on the external library volume:

```
/Volumes/AI_MODELS/AI_LIBRARY/
├── math/pdfs/              # open-access PDF downloads
├── inbox/                  # Calibre import staging (from pipeline)
├── calibre-library/        # Calibre library (manual import)
├── notebooklm_packs/       # generated NotebookLM source packs
└── processed/              # post-import artifacts
```

Repo manifests and queues live in `courses/math/resources/` and stay version-controlled. Binary files do **not** belong in git.

## Allowed Automatic Downloads

The ingestion script may download **only** when all conditions are true:

1. `--download` flag is passed (default is dry-run)
2. Resource is marked `copyright_status: open_access` in the manifest
3. URL matches an approved host pattern:
   - `arxiv.org` (abs → pdf)
   - `*.edu` open course notes with explicit PDF links
   - `github.com` / `github.io` hosted PDFs
   - Known open repositories (e.g. `bayes.wustl.edu` for Jaynes)
4. Response `Content-Type` includes `pdf` and HTTP status is 200

## Never Download Automatically

- Commercial textbooks (ESL, ISL print editions, Murphy PML print, etc.)
- Paywalled journal articles
- Content requiring login, cookies, or CAPTCHA
- YouTube, X, Reddit, Hugging Face, or Google/NotebookLM pages
- Any resource marked `copyright_status: reference_only` or `commercial_web`

## Web-Only Resources

Resources marked `web_book`, `course`, `video_playlist`, or `reference` are **link-only**. The pipeline records metadata and generates NotebookLM/commuter prompts from curated summaries — not scraped page content.

## Calibre Import

PDFs staged in `calibre_import_queue/` include a sidecar JSON metadata file. Import into Calibre **manually**:

1. Open Calibre → Add books → select staged PDF
2. Edit metadata from the sidecar `title`, `authors`, `tags`
3. Move imported book to `AI_LIBRARY/calibre-library/`

## Manual Review Required

Before adding a new source to `ingestion_manifest.json`:

- [ ] Confirm license / access terms on the publisher page
- [ ] Set `copyright_status` correctly
- [ ] Set `download_allowed: true` only for open PDFs
- [ ] Map to at least one lesson in `lesson_resource_map.md`

## Frontier Scanning (10%)

Papers like arXiv surveys may be tagged `reinforcement_priority: low` and `curriculum_tier: frontier_scan`. Index and link only — no bulk download of survey corpora.

## Synchronization

After ingestion or manifest changes, run the sync layer:

```bash
python automation/scripts/sync_ai_library.py          # dry-run + reports
python automation/scripts/sync_ai_library.py --apply  # mirror PDFs and queues
```

See `automation/README.md` and `courses/math/resources/sync_status.json`.
