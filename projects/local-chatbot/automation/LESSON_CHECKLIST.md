# Lesson Checklist

Use this checklist before marking any lesson **ready** in `COURSE_ROADMAP.md`.

## Structure

- [ ] Lesson lives in the correct week folder under `courses/[track]/`
- [ ] `notes/<lesson_slug>.md` exists
- [ ] `exercises/<lesson_slug>.py` exists and runs without errors
- [ ] `quizzes/<lesson_slug>_quiz.md` exists
- [ ] `commuter/` contains all four files:
  - [ ] `resources.md`
  - [ ] `notebooklm_source_pack.md`
  - [ ] `audio_overview_prompt.md`
  - [ ] `review_questions.md`

## Content (notes/)

- [ ] Lesson goal — one clear outcome
- [ ] Core concepts — bullet list of terms and ideas
- [ ] AI engineering connection — ties concepts to real AI work
- [ ] Coding exercise — file path, run command, expected behavior
- [ ] Quiz — points to quiz file
- [ ] Reflection — at least one written prompt
- [ ] Commuter reinforcement — points to `commuter/`
- [ ] Git checkpoint — commands + checkpoint question

## Commuter (manual only)

- [ ] `resources.md` uses public links only — no login automation
- [ ] `notebooklm_source_pack.md` is paste-ready for manual NotebookLM import
- [ ] `audio_overview_prompt.md` works without external login
- [ ] `review_questions.md` has 5+ recall questions

## Quality

- [ ] Exercise is small enough to finish in one sitting (< 60 lines of learner code)
- [ ] Quiz questions test understanding, not memorization of wording
- [ ] No references to OpenClaw, MCP, swarms, or startup infrastructure unless in Parking Lot context
- [ ] Python exercise follows repo conventions (stdlib first; `requests` only when lesson requires it)

## Roadmap

- [ ] Lesson status updated in `COURSE_ROADMAP.md` Month 1 table
- [ ] `courses/README.md` status table updated if needed
