# NotebookLM Pack Queue

Generated source packs for **manual** paste into NotebookLM. One file per resource: `{resource_id}.md`.

## Usage

1. Run `python automation/scripts/ingest_math_resources.py --generate-queues`
2. Open https://notebooklm.google.com/ manually
3. Create a notebook per lesson or per resource
4. Paste sections from the `.md` file as copied text sources
5. Generate Audio Overview manually

**Do not** automate Google or NotebookLM login.

## Priority (Month 1)

| Resource ID | Lesson | Priority |
|-------------|--------|----------|
| `mml-book` | linear_algebra | high |
| `imperial-linear-algebra` | linear_algebra | high |
| `khan-linear-algebra` | linear_algebra | high |
| `khan-stats-probability` | statistics | high |
| `isl-book` | statistics | high |
