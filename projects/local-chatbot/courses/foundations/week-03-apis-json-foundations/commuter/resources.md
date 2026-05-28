# APIs + JSON Foundations — Commuter Resources

Manual review only — open links yourself.

## Primary Resources

| Resource | Type | Link | Why it helps |
|----------|------|------|--------------|
| MDN — HTTP Overview | doc | https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview | Method, status code, header mental model |
| MDN — HTTP Status Codes | reference | https://developer.mozilla.org/en-US/docs/Web/HTTP/Status | 429 and 5xx matter for LLM APIs |
| Requests Quickstart | doc | https://requests.readthedocs.io/en/latest/user/quickstart/ | Library used in this lesson and Ollama demos |
| JSONPlaceholder | demo API | https://jsonplaceholder.typicode.com/ | Safe public API for practice |
| Python `json` module | doc | https://docs.python.org/3/library/json.html | Parsing and serialization patterns |

## Optional Deep Dives

- [HTTP POST with Requests](https://requests.readthedocs.io/en/latest/user/quickstart/#make-a-request) — preview for LLM API calls in Week 6
- [JSONLint](https://jsonlint.com/) — validate JSON when debugging LLM output manually
- Repo reference: `json_chatbot.py` at project root — Ollama POST + JSON parse (read only)

## How to Use

1. Read MDN HTTP Overview (~10 min) before the exercise if HTTP is new.
2. Browse JSONPlaceholder in a browser to see raw JSON shape.
3. After the exercise, skim `json_chatbot.py` to connect this lesson to local LLMs.
