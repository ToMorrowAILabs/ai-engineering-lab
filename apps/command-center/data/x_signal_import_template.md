# X / Twitter Signal Import Template

## Purpose
This template is for **manual signal capture** from X/Twitter. There is no automated scraping, no OAuth, and no API integration. You read a post on X, decide it's worth saving, and paste it here.

**Why manual?** X requires login to view most content. Automated scraping violates ToS. The manual workflow protects you from legal risk and also builds better signal curation habits — you only import what genuinely passes a "would I act on this?" filter.

---

## When to Import a Signal

Ask yourself these three questions before pasting:
1. **Is this from someone on the Frontier People Watchlist?** → High prior probability of signal value
2. **Does it touch a topic in the `frontier_to_course_map.json`?** → Check for alias matches
3. **Would I act on this in the next 30 days?** → If no, don't import (it's just noise)

If YES to at least 2 of 3: import it. Otherwise: dismiss and move on.

---

## Import Steps

1. **Open** `data/x_signal_import.json`
2. **Copy** the `ximport-template` object
3. **Paste** it as a new entry in the `imports` array (above the template)
4. **Fill in** all fields (see field guide below)
5. **Set `status`** to `"pending"`
6. **Generate a new `id`** — format: `ximport-NNN` (e.g., `ximport-003`)
7. **Save** the file
8. During your next review session, update `status` to `"reviewed"` and fill in `action_taken`

---

## Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID. Format: `ximport-NNN`. Increment from highest existing. |
| `imported_at` | date | Today's date. Format: `YYYY-MM-DD` |
| `status` | enum | `"pending"` when adding. `"reviewed"` after classification. `"archived"` if dismissed. |
| `post_author_handle` | string | X handle with `@`. Example: `@karpathy` |
| `post_author_name` | string | Display name as shown on X |
| `post_text` | string | Full post text. Include thread context if it changes meaning. |
| `post_url` | string | Direct link to post. Format: `https://x.com/handle/status/POST_ID` |
| `posted_at` | date | When the post was published. Format: `YYYY-MM-DD` |
| `linked_url` | string or null | URL from the post (paper, blog, GitHub, etc.). `null` if no link. |
| `topic_guess` | string | Your best guess at the topic. Match to frontier_to_course_map aliases if possible. |
| `your_notes` | string | Why did this catch your eye? What would you do with it? Be specific. |
| `relevance_score_estimate` | number | 0–100 estimate. Use the scoring model as a guide. |
| `classification_guess` | enum | `"act_now"`, `"monitor"`, `"parked"`, `"ignore"`, or `"pending"` |
| `action_taken` | string or null | What you actually did. `null` until reviewed. |

---

## Scoring Model (Quick Reference)

```
relevance_score = lesson_match(40%) + weak_topic_match(25%) + source_credibility(15%) + implementation_value(10%) + commuter_usefulness(10%)
```

| Score | Classification | Action |
|-------|---------------|--------|
| ≥ 70  | `act_now`     | Directly reinforces current month work. Act this week. |
| 40–69 | `monitor`     | Relevant but Month 2+. Add to LATER.md. |
| 20–39 | `parked`      | Important topic but would distract. Explicitly defer. |
| < 20  | `ignore`      | Hype, no implementation value, irrelevant. Dismiss. |

---

## People to Watch (Quick Reference)

Highest priority accounts to import from when you see them:

| Handle | Why |
|--------|-----|
| `@karpathy` | Neural Networks: Zero to Hero author. Everything he posts is signal. |
| `@3blue1brown` | Visual math educator. Core Month 1 content creator. |
| `@AndrewYNg` | Practical ML engineering framing. Low hype. |
| `@simonw` | Practical LLM engineering. High import rate. |
| `@chiphuyen` | MLOps and ML systems design. Month 3–4 preview. |
| `@rasbt` | Applied ML. Biweekly newsletter author. |
| `@jeremyphoward` | fast.ai. Practical deep learning. |

---

## What NOT to Import

- **Viral hype posts** ("AGI in 6 months") — classify as `ignore` if you accidentally paste one
- **Unverified "leaked memo"** posts — no verifiable source, no engineering value
- **Product announcements** that don't affect your API or tooling — not actionable
- **Retweets without commentary** — original source is usually better
- **Threads > 20 posts long** — summarize the key idea instead of pasting the whole thread

---

## Review Cadence

- **Import** during commute when you open X
- **Review** once per week during planning session
- **Archive** anything older than 30 days that was never acted on

---

## Safety Reminders

- **No OAuth flows** — do not authorize any app to post/read on your behalf
- **No scraping scripts** — do not run any automated scripts against x.com
- **No cookies/session abuse** — do not use browser automation against X
- **Public posts only** — do not import DMs or locked-account posts
- **Manual paste only** — this file is updated by hand, not by any script
