# Resource Health Report

**Generated:** 2026-05-26 20:00 UTC  
**Sync mode:** apply  
**Operating rule:** 70% foundations · 20% applied · 10% frontier scan

## Summary

| Metric | Value |
|--------|-------|
| Resources in manifest | 20 |
| PDFs on disk | 4 |
| Validation errors | 0 |
| Validation warnings | 0 |
| Duplicate PDF groups | 4 |
| Mirror actions planned/applied | 24 |

## Duplicate PDFs

### SHA256 `2ada390ed8ea…`
- `/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/arxiv-math-of-ai.pdf` (8,744,025 bytes)
- `/Volumes/AI_MODELS/AI_LIBRARY/inbox/arxiv-math-of-ai.pdf` (8,744,025 bytes)

### SHA256 `5ec0f6fc7675…`
- `/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/arxiv-matrix-calculus.pdf` (761,311 bytes)
- `/Volumes/AI_MODELS/AI_LIBRARY/inbox/arxiv-matrix-calculus.pdf` (761,311 bytes)

### SHA256 `a1f91e337445…`
- `/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/gallier-math-deep.pdf` (24,629,575 bytes)
- `/Volumes/AI_MODELS/AI_LIBRARY/inbox/gallier-math-deep.pdf` (24,629,575 bytes)

### SHA256 `23dd1664db7e…`
- `/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/jaynes-probability.pdf` (493,553 bytes)
- `/Volumes/AI_MODELS/AI_LIBRARY/inbox/jaynes-probability.pdf` (493,553 bytes)

## Lesson Coverage

- **linear_algebra:** 9 resource(s)
- **calculus:** 8 resource(s)
- **probability:** 10 resource(s)
- **statistics:** 10 resource(s)
- **optimization:** 9 resource(s)
- **embeddings:** 4 resource(s)
- **transformers:** 2 resource(s)

## Future Extensions (disabled)

- **youtube_transcript_index:** stub — Manual transcript paste only — no YouTube login automation
- **huggingface_dataset_refs:** stub — Reference metadata only — no automated HF hub downloads
- **arxiv_feed_monitor:** stub — RSS/feed index for frontier scan — dry-run fetch only when enabled
- **notebooklm_export_manifests:** stub — Manual export manifest — no Google login automation

## Next Steps

1. Fix validation errors in `ingestion_manifest.json`.
2. Run `python automation/scripts/sync_ai_library.py --apply` to persist mirrors.
3. Import staged PDFs into Calibre manually from `calibre_import_queue/`.
