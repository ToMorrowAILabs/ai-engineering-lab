# Calibre Import Queue

Staged metadata sidecars for **manual** Calibre import. PDFs live under `/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/` and `/Volumes/AI_MODELS/AI_LIBRARY/inbox/`.

## Usage

1. Run `python automation/scripts/ingest_math_resources.py --download --generate-queues`
2. Open Calibre manually
3. For each `{resource_id}.json` in this folder:
   - Add the PDF from `pdf_path`
   - Apply `title`, `authors`, and `tags` from the sidecar
4. Save to `/Volumes/AI_MODELS/AI_LIBRARY/calibre-library/`

**Do not** automate Calibre or download commercial books.
