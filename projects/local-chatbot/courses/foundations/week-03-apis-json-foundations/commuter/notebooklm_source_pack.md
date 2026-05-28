# APIs + JSON Foundations — NotebookLM Source Pack

Paste below the line into NotebookLM manually. Generate Audio Overview in the NotebookLM UI.

**Do not automate Google or NotebookLM login.**

---

## Source: Lesson Overview

APIs and JSON are the wire format of modern AI systems. This lesson teaches how to call a public HTTP API with Python, read status codes and headers, parse JSON, extract nested fields, and persist results to disk.

The exercise uses JSONPlaceholder, a free fake REST API. The script GETs post ID 1, prints status 200 and content-type, parses fields userId, id, title, and a truncated body preview, writes post_summary.json, and reads it back. Patterns mirror real work: fetch remote data, validate HTTP success, transform JSON for downstream steps, save artifacts for pipelines.

LLM APIs — OpenAI, Anthropic, Ollama — all use HTTP. Ollama POSTs JSON to localhost:11434/api/generate and returns JSON with a response field. Token usage, model name, and error messages live in JSON keys. RAG systems fetch documents via HTTP, parse metadata JSON, and pass text to embedders.

## Source: Key Terms Glossary

| Term | Definition |
|------|------------|
| HTTP GET | Read a resource at a URL without sending a body |
| HTTP POST | Send a payload (often JSON) to create or invoke an action |
| Status code | Three-digit HTTP result — 2xx success, 4xx client error, 5xx server error |
| REST | Architectural style where URLs identify resources |
| `requests.get()` | Python function to perform HTTP GET |
| `response.json()` | Parse response body as JSON into Python dict/list |

## Source: Exercise Walkthrough

fetch_post calls requests.get with a 10-second timeout, then raise_for_status so 404 or 500 raise an exception instead of silent failure. extract_post_fields maps API shape to a smaller summary dict with body_preview capped at 80 characters. save_summary and load_summary round-trip JSON to disk — the same pattern used for caching embeddings or logging LLM outputs. main prints diagnostics then pretty-prints the saved summary.

## Source: Common Mistakes

1. Ignoring status codes — always check success before parsing JSON.
2. KeyError on nested JSON — use .get() or validate schema before access.
3. No timeout — hung requests block training scripts; always set timeout=.
4. Trusting LLM JSON blindly — strip markdown fences and validate before loads.
5. Hard-coding production URLs in commits — use config files from Week 2 lesson.

## Source: AI Engineering Connection

Every integration layer in AI engineering is HTTP + JSON: model inference, vector upsert, evaluation callbacks, webhook notifications. Cost tracking reads usage tokens from JSON. Tool-calling agents parse function arguments from JSON blobs in model output. Mastering fetch-parse-persist is prerequisite for Week 6 local LLM work and all cloud API usage.

---

## NotebookLM Instructions (Manual)

1. Open https://notebooklm.google.com/ and sign in.
2. New notebook: **APIs + JSON Foundations**.
3. Paste each `## Source:` block as copied text sources.
4. Generate Audio Overview.
5. Complete `review_questions.md` without notes.
