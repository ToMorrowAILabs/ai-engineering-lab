# Python + Git Foundations — NotebookLM Source Pack

Copy everything below the line into NotebookLM as pasted text sources. Generate an Audio Overview manually.

**Do not automate Google or NotebookLM login.**

---

## Source: Lesson Overview

This lesson teaches Python + Git foundations for AI engineering. The goal is to set up a small Python project, write a script that reads and writes JSON config files, and commit your work with Git.

AI engineers constantly manage config files: model names, hyperparameters, prompt templates, dataset paths, and evaluation settings. These files live alongside Python code. Without file I/O skills and version control, you cannot reproduce experiments or collaborate safely.

The exercise builds a lab config manager. It creates a default JSON file if missing, loads settings like lab name and Python version target, updates a last_run timestamp in UTC ISO format, and saves the file back. The script uses pathlib for paths, the json standard library module, and a main guard so the script can be imported or run directly.

Git checkpoints mirror professional AI workflows. Each logical change gets one commit with a message explaining why. git add stages changes; git commit records a snapshot. git log shows history — critical when a model metric regresses and you need to find which config change caused it.

## Source: Key Terms Glossary

| Term | Definition |
|------|------------|
| `pathlib.Path` | Object-oriented file paths that work across operating systems |
| JSON | JavaScript Object Notation — text format for configs and API payloads |
| `git add` | Stage file changes for the next commit |
| `git commit` | Save a snapshot of staged changes with a message |
| Virtual environment | Isolated Python install for project dependencies |
| Main guard | `if __name__ == "__main__"` — run code only when script is executed directly |

## Source: Exercise Walkthrough

The lab config manager script defines a default config dict with lab_name, python_target, and last_run. The config_path function returns the path to lab_config.json in the exercises folder. load_config reads JSON from disk or returns defaults if the file is missing. save_config writes indented JSON for human-readable diffs in Git. update_last_run sets last_run to the current UTC time in ISO format. main orchestrates load, update, save, and prints a summary.

Running the script twice shows last_run changing — a tiny example of experiment logging. In Git, each run's code change (if any) and config change would be separate commits.

## Source: Common Mistakes

1. Forgetting to stage files before commit — git status shows unstaged changes; run git add first.
2. Committing secrets — never put API keys in lab_config.json; use environment variables later.
3. Hard-coded absolute paths — use Path(__file__).resolve().parent so the script works anywhere.
4. Vague commit messages — write what changed and why, e.g. "Add lab config manager" not "fix stuff".

## Source: AI Engineering Connection

Production AI teams version everything that affects model behavior: training configs, prompt files, evaluation harnesses, and data preprocessing scripts. Git blame on a config file answers who changed the learning rate or system prompt. Reproducible research requires knowing exact code and config at experiment time. This lesson's pattern — small Python utility + JSON config + Git checkpoint — scales to full MLOps pipelines.

---

## NotebookLM Instructions (Manual)

1. Go to https://notebooklm.google.com/ and sign in manually.
2. Create a notebook named **Python + Git Foundations**.
3. Add source → **Copied text** → paste each `## Source:` section above (one or multiple sources).
4. Generate → **Audio Overview**.
5. After listening, complete `review_questions.md` without notes.
