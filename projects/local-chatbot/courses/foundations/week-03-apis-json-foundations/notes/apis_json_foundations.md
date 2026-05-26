# APIs + JSON Foundations for AI Engineering

## Lesson Goal

Call a public HTTP API with Python, inspect status codes and response headers, parse JSON safely, and extract fields you would use in an AI pipeline (metadata, text content, identifiers).

## Core Concepts

- **HTTP methods** — GET for reading resources; POST for sending payloads (used heavily with LLM APIs)
- **Status codes** — 200 OK, 404 Not Found, 429 Too Many Requests, 500 Server Error
- **REST APIs** — URLs represent resources; responses are often JSON
- **The `requests` library** — `get()`, `post()`, `response.json()`, `raise_for_status()`
- **JSON parsing** — `json.loads()` for strings; `.json()` on responses; handling nested keys
- **Defensive parsing** — validate keys exist before access; strip markdown fences from LLM JSON output
- **API etiquette** — public demo APIs, rate limits, no credential automation in this lesson

## AI Engineering Connection

LLMs, embedding APIs, vector databases, and evaluation services all speak HTTP and return JSON. A RAG pipeline might: fetch documents from an API, parse JSON metadata, embed text fields, and store vectors. Chat completions return JSON with `choices`, `usage`, and token counts. Engineers who cannot reliably call APIs and parse JSON cannot integrate models, log costs, or build tool-calling agents — even local Ollama uses JSON over HTTP at `localhost:11434`.

## Coding Exercise

**File:** `exercises/apis_json_foundations.py`

Build a **JSONPlaceholder post fetcher** that:

1. GETs a single post from `https://jsonplaceholder.typicode.com/posts/1`
2. Prints HTTP status code and content-type header
3. Parses JSON and extracts `userId`, `id`, `title`, and first 80 characters of `body`
4. Writes a summary dict to `post_summary.json` in the exercises folder
5. Reads the file back and prints formatted JSON

```bash
cd courses/foundations/week-03-apis-json-foundations
python exercises/apis_json_foundations.py
```

Requires network access. Uses only the public JSONPlaceholder API — no API keys or login.

## Quiz

See `quizzes/apis_json_foundations_quiz.md`.

## Reflection

Most LLM APIs return JSON with nested fields (`choices[0].message.content`). Describe how the parsing patterns in this exercise (check status, extract nested keys, save intermediate JSON) would extend to logging an Ollama or OpenAI response for debugging.

**Your answer:**

_(Write here or in the quiz file.)_

## Commuter Reinforcement

See `commuter/` for curated resources, NotebookLM source pack, audio overview prompt, and review questions.

## Git Checkpoint

```bash
git add courses/foundations/week-03-apis-json-foundations/
git commit -m "Complete APIs + JSON foundations — fetch, parse, and persist API response"
git log --oneline -3
```

**Checkpoint question:** What should your code do when an API returns HTTP 429, and why does that matter for LLM applications?
