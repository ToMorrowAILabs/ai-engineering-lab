# AI Engineering Lab Roadmap

## Operating Rule

70% foundations, 20% applied projects, 10% frontier intelligence.

---

## Month 1 — Foundation Sprint (6 Weeks)

**Goal:** Build the tooling, math, and data skills every AI engineer needs before LLM systems, agents, or production deployment.

**Out of scope for Month 1:** OpenClaw, MCP, multi-agent systems, swarms, startup infrastructure, autoresearch. See [Parking Lot](#7-parking-lot--later).

### Learning Outcomes

By the end of Month 1 you should be able to:

- Write and run Python scripts for file I/O, functions, and basic CLI workflows
- Use Git and GitHub for version control, branches, and lesson checkpoints
- Call HTTP APIs, parse JSON, and handle common response errors
- Explain vectors, dot products, and cosine similarity in embedding/RAG context
- Compute basic descriptive statistics and interpret distributions
- Load and transform tabular data with NumPy and pandas
- Run a local LLM via Ollama and send structured prompts

### Week-by-Week Plan

| Week | Focus | Folder | Lessons (planned) | Status |
|------|-------|--------|-------------------|--------|
| **1** | Python basics | `courses/foundations/week-01-python/` | Variables, types, control flow, functions, files | scaffold |
| **2** | Python + Git foundations | `courses/foundations/week-02-python-git-foundations/` | Python project layout + Git workflow (anchor) | **ready** |
| **3** | APIs + JSON foundations | `courses/foundations/week-03-apis-json-foundations/` | HTTP, requests, JSON parsing (anchor) | **ready** |
| **4** | Linear algebra foundations | `courses/math/week-04-linear-algebra-foundations/` | Vectors, dot product, cosine similarity (anchor) | **ready** |
| **5** | Statistics foundations | `courses/math/week-05-statistics/` | Mean, variance, distributions, correlation | scaffold |
| **6** | NumPy/Pandas + local LLM | `courses/ml/week-06-numpy-pandas/`, `courses/llms/week-06-local-llm-basics/` | Arrays, DataFrames, Ollama basics | scaffold |

### Anchor Lessons (Polished)

These three lessons define the quality bar for all Month 1 content:

| Lesson | Path |
|--------|------|
| Python + Git Foundations | `courses/foundations/week-02-python-git-foundations/` |
| APIs + JSON Foundations | `courses/foundations/week-03-apis-json-foundations/` |
| Linear Algebra Foundations | `courses/math/week-04-linear-algebra-foundations/` |

Each includes notes, exercise, quiz, reflection, commuter reinforcement, NotebookLM source pack, and Git checkpoint.

### Month 1 Capstone (Coming in Phase 5)

Mini project: fetch API data → parse JSON → analyze with NumPy/pandas → summarize with a local LLM. Spec will live in `courses/foundations/MONTH_01_CHECKPOINT.md`.

---

## Full Curriculum Tracks

### 1. Foundation Track

Python, terminal, Git/GitHub, APIs, JSON, HTTP, virtual environments, debugging.

### 2. ML Math Track

Linear algebra, vectors, matrices, probability, statistics, calculus, gradients, optimization.

### 3. Python/ML Coding Track

NumPy, pandas, matplotlib, scikit-learn, PyTorch basics.

### 4. LLM Engineering Track

Tokens, embeddings, transformers, attention, RAG, vector databases, evaluation.

### 5. AI Systems Track

FastAPI, Docker, deployment, monitoring, model serving, production patterns.

### 6. Cutting-Edge Intelligence Flywheel

Track X/Twitter, Reddit, Hugging Face, GitHub, papers, OpenAI, Anthropic, Google AI, Stanford/MIT/DeepLearning.AI resources. See `intelligence/` (Month 2+).

### 7. Parking Lot / Later

OpenClaw, autoresearch, MCP, multi-agent systems, swarms, startup infrastructure.

---

## Lesson Authoring

- Template: `courses/_templates/`
- Checklist: `automation/LESSON_CHECKLIST.md`
- Builder prompt: `automation/pipelines/CODEX_COURSE_BUILDER_PROMPT.md`
- Course index: `courses/README.md`

## Commuter Reinforcement

Every lesson provides manual-only commuter files: curated links, NotebookLM source packs, audio overview prompts, and review questions. No automated login to Google, NotebookLM, YouTube, X, Reddit, or Hugging Face.
