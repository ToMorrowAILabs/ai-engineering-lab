# Calibre Sync Workflow

Manual workflow for importing approved open-access PDFs into your Calibre library.

**Storage root:** `/Volumes/AI_MODELS/AI_LIBRARY/`  
**Policy:** Manual import only — the pipeline stages files and metadata; you operate Calibre.

---

## Purpose

Calibre provides searchable, tagged offline access to open-access math PDFs downloaded by the ingestion pipeline. The course OS **never** imports into Calibre automatically — it prepares staging artifacts and sidecar metadata.

---

## Directory Layout

```
/Volumes/AI_MODELS/AI_LIBRARY/
├── math/pdfs/              # canonical PDF downloads ({resource_id}.pdf)
├── inbox/                  # staging copies for import (mirrored by sync)
├── calibre-library/        # your Calibre library database
├── processed/              # optional post-import archive
└── sync/                   # health reports + duplicate detection
```

Repo-side staging metadata:

```
courses/math/resources/calibre_import_queue/{resource_id}.json
```

---

## Pipeline → Calibre Flow

```mermaid
flowchart LR
    A[ingestion_manifest.json] --> B[ingest --download]
    B --> C[math/pdfs/{id}.pdf]
    B --> D[calibre_import_queue/{id}.json]
    C --> E[sync --apply]
    E --> F[inbox/{id}.pdf]
    E --> D
    F --> G[Manual Calibre import]
    D --> G
    G --> H[calibre-library/]
```

---

## Current Open PDFs

These resources have `download_allowed: true` and Calibre sidecars:

| resource_id | Title | PDF path |
|-------------|-------|----------|
| `gallier-math-deep` | Algebra, Topology, Differential Calculus, and Optimization | `math/pdfs/gallier-math-deep.pdf` |
| `jaynes-probability` | Probability Theory: The Logic of Science | `math/pdfs/jaynes-probability.pdf` |
| `arxiv-matrix-calculus` | The Matrix Calculus You Need For Deep Learning | `math/pdfs/arxiv-matrix-calculus.pdf` |
| `arxiv-math-of-ai` | The Mathematics of AI | `math/pdfs/arxiv-math-of-ai.pdf` |

Web books (MML, ISL, etc.) are **not** downloaded — link only in Calibre as URL custom column if desired.

---

## Sync Before Import

Always run sync to ensure inbox mirrors and sidecars are current:

```bash
python automation/scripts/sync_ai_library.py --apply
```

Check health:

```bash
cat courses/math/resources/resource_health_report.md
```

Duplicate groups in `duplicate_detection.json` showing `math/pdfs/` ↔ `inbox/` copies are **expected** — inbox is the import staging area.

---

## Manual Import Procedure

### 1. Open Calibre

Launch Calibre with library path set to:

```
/Volumes/AI_MODELS/AI_LIBRARY/calibre-library/
```

(Configure once in Calibre → Preferences → Libraries.)

### 2. Select staged PDF

From `AI_LIBRARY/inbox/{resource_id}.pdf` — or directly from `math/pdfs/` if inbox is empty.

### 3. Add book

**Calibre → Add books** → select the PDF.

### 4. Apply sidecar metadata

Open `courses/math/resources/calibre_import_queue/{resource_id}.json`:

```json
{
  "resource_id": "arxiv-matrix-calculus",
  "title": "The Matrix Calculus You Need For Deep Learning",
  "authors": ["Terence Parr", "Jeremy Howard"],
  "tags": ["calculus", "optimization", "linear_algebra", "backprop", "foundations"],
  "pdf_path": "/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/arxiv-matrix-calculus.pdf",
  "copyright_status": "open_access"
}
```

In Calibre → **Edit metadata**:

| Field | Source |
|-------|--------|
| Title | sidecar `title` |
| Authors | sidecar `authors` |
| Tags | sidecar `tags` |
| Comments | optional: sidecar `resource_id` + manifest URL |

### 5. Verify

- Full-text search works
- Tags align with lesson slugs for filtering
- File lives in `calibre-library/`

### 6. Optional archive

Move imported originals to `AI_LIBRARY/processed/` if you want inbox clean — manual file move only.

---

## Tag Convention

Sidecar tags combine:

- **Lesson slugs** — `linear_algebra`, `calculus`, `probability`, etc.
- **Weakness tags** — `dot_product`, `matrix_calculus`, etc.
- **Curriculum tier** — `foundations`, `frontier_scan`

Filter in Calibre by tag to find remediation material:

```
tag:linear_algebra AND tag:foundations
```

---

## 70 / 20 / 10 in Calibre

| Tier | Calibre usage |
|------|---------------|
| **70% Foundations** | Import MML-related PDFs, matrix calculus paper, Gallier optimization chapters |
| **20% Applied** | Tag exercise companion PDFs you add manually (not auto-downloaded) |
| **10% Frontier** | Import arXiv surveys (`arxiv-math-of-ai`) for scan-only — tag `frontier_scan` |

Do not import paywalled commercial textbooks via unofficial PDFs.

---

## Adding New PDFs

1. Add resource to `ingestion_manifest.json` with correct `copyright_status`
2. Set `download_allowed: true` only for verified open-access PDFs
3. Run:
   ```bash
   python automation/scripts/ingest_math_resources.py --download --generate-queues
   python automation/scripts/sync_ai_library.py --apply
   ```
4. Import new sidecar from `calibre_import_queue/`

See `courses/math/resources/download_policy.md`.

---

## Do Not

- Automate Calibre CLI import without reviewing metadata
- Download commercial books (ESL, ISL print, etc.) into the pipeline
- Store Calibre database in git — it lives on AI_LIBRARY only
- Sync Calibre to production agent systems

---

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Sidecar missing | Resource may be web-only; check `download_allowed` in manifest |
| PDF not in inbox | Run `sync_ai_library.py --apply` |
| Volume unmounted | Mount `/Volumes/AI_MODELS/` before import |
| Wrong metadata | Re-read sidecar; manifest is source of truth |

---

## Related

- [RESOURCE_PIPELINE_OVERVIEW.md](./RESOURCE_PIPELINE_OVERVIEW.md)
- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
- `courses/math/resources/calibre_import_queue/README.md`
- `courses/math/resources/download_policy.md`
