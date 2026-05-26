# Python + Git Foundations for AI Engineering

## Lesson Goal

Set up a small Python project, write a script that reads and writes JSON config files, and commit your work with Git using a clear checkpoint workflow.

## Core Concepts

- **Python project layout** — one folder per lesson with `notes/`, `exercises/`, and `quizzes/`
- **Functions and `main` guard** — reusable logic with `if __name__ == "__main__":`
- **File I/O** — reading and writing text and JSON with the standard library
- **`pathlib.Path`** — portable file paths across macOS, Linux, and Windows
- **Git basics** — `init`, `status`, `add`, `commit`, `log`, and meaningful commit messages
- **GitHub workflow (manual)** — create a repo in the browser, add remote, push branches
- **Virtual environments** — isolate dependencies with `python -m venv .venv`

## AI Engineering Connection

Every AI project starts as files on disk: training configs, prompt templates, evaluation datasets, and experiment logs. Engineers who cannot manage Python projects and version control cannot reproduce experiments, collaborate on models, or roll back bad changes. Git checkpoints mirror how teams ship prompt changes, fine-tuning configs, and evaluation scripts — one atomic commit per logical change.

## Coding Exercise

**File:** `exercises/python_git_foundations.py`

Build a **lab config manager** that:

1. Creates a default JSON config if none exists
2. Reads the config and prints the lab name and Python version target
3. Updates a `last_run` timestamp and writes the file back

```bash
cd courses/foundations/week-02-python-git-foundations
python exercises/python_git_foundations.py
```

Expected output (values will vary by timestamp):

```
Lab: AI Engineering Lab
Python target: 3.11+
Config saved to: .../lab_config.json
Last run: 2026-05-26T...
```

## Quiz

See `quizzes/python_git_foundations_quiz.md`.

## Reflection

Explain why AI engineering teams treat config files and code with the same Git discipline. Describe one situation where committing a bad prompt or config without version control would waste hours of debugging.

**Your answer:**

_(Write here or in the quiz file.)_

## Commuter Reinforcement

See `commuter/` for curated resources, NotebookLM source pack, audio overview prompt, and review questions. All commuter workflows are **manual** — no automated login.

## Git Checkpoint

From the repo root:

```bash
git status
git add courses/foundations/week-02-python-git-foundations/exercises/python_git_foundations.py
git add courses/foundations/week-02-python-git-foundations/exercises/lab_config.json
git commit -m "Add lab config manager — Python file I/O and JSON foundations"
git log --oneline -3
```

If this is your first push to GitHub, create the remote repo manually in the browser, then:

```bash
git remote add origin git@github.com:YOUR_USER/ai-engineering-lab.git
git push -u origin main
```

**Checkpoint question:** What is the difference between `git add` and `git commit`, and why should commit messages describe *why* you changed something?
