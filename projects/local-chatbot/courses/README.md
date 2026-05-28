# AI Engineering Lab — Courses

This directory contains the ToMorrowAILabs AI Engineering Lab curriculum: Markdown lessons, Python exercises, quizzes, commuter reinforcement, and Git checkpoints.

## Operating Rule

**70% foundations · 20% applied projects · 10% frontier intelligence**

Month 1 focuses on foundations only. Advanced topics (agents, OpenClaw, MCP, swarms, startup infrastructure) stay in the Parking Lot until Month 2+.

## Directory Layout

```
courses/
├── _templates/          # Copy these when authoring a new lesson
├── foundations/         # Python, terminal, Git, APIs, JSON
├── math/                # Linear algebra, statistics
├── ml/                  # NumPy, pandas (Month 1 week 6)
└── llms/                # Local LLM basics (Month 1 week 6)
```

Each week folder follows this pattern:

```
week-XX-topic/
├── notes/<lesson_slug>.md
├── exercises/<lesson_slug>.py
├── quizzes/<lesson_slug>_quiz.md
└── commuter/
    ├── resources.md
    ├── notebooklm_source_pack.md
    ├── audio_overview_prompt.md
    └── review_questions.md
```

## Lesson Format

Every lesson includes:

1. **Lesson goal**
2. **Core concepts**
3. **AI engineering connection**
4. **Coding exercise**
5. **Quiz**
6. **Reflection**
7. **Commuter reinforcement** (in `commuter/`)
8. **Git checkpoint**

Use `courses/_templates/` as the starting point. Validate with `automation/LESSON_CHECKLIST.md` before marking a lesson **ready**.

## Month 1 Status

| Week | Topic | Folder | Status |
|------|-------|--------|--------|
| 1 | Python basics | `foundations/week-01-python/` | scaffold |
| 2 | Python + Git foundations | `foundations/week-02-python-git-foundations/` | **ready** |
| 3 | APIs + JSON foundations | `foundations/week-03-apis-json-foundations/` | **ready** |
| 4 | Linear algebra foundations | `math/week-04-linear-algebra-foundations/` | **ready** |
| 5 | Statistics foundations | `math/week-05-statistics/` | scaffold |
| 6 | NumPy/Pandas + local LLM basics | `ml/week-06-numpy-pandas/`, `llms/week-06-local-llm-basics/` | scaffold |

See [COURSE_ROADMAP.md](../COURSE_ROADMAP.md) for the full curriculum plan.

## How to Work Through a Lesson

1. Read the lesson notes in `notes/`.
2. Complete the coding exercise in `exercises/`.
3. Answer the quiz in `quizzes/` without looking at the notes.
4. Write your reflection (in the quiz file or a personal journal).
5. Use `commuter/` files for offline review — resources, NotebookLM source pack, audio prompt, and review questions.
6. Complete the Git checkpoint at the end of the lesson notes.

## Commuter Reinforcement (Manual Only)

Commuter files provide links, source packs, and prompts for **manual** review. Do not automate login to Google, NotebookLM, YouTube, X, Reddit, or Hugging Face. Copy source packs into NotebookLM yourself when you want an audio overview.

## Progress Tracking

Track completion in your own branch or a personal `PROGRESS.md` (optional). Each Git checkpoint suggests a commit message so your history reflects what you learned.
