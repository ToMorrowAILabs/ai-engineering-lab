# ToMorrowAILabs.ai — AI Engineering Command Center Master Build Prompt

This document is the canonical Cursor Agent specification for the Command Center platform.

## Primary Objective

Build a private-first AI-native learning operating system that:

- Tracks course progress
- Dynamically updates curriculum
- Manages AI resources
- Reinforces learning
- Measures learning performance
- Monitors frontier AI trends
- Powers long-term adaptive AI engineering education

## Operating Rule

**70% foundations · 20% applied projects · 10% frontier scanning**

## Tech Stack

- Next.js · TypeScript · Tailwind · App Router
- Local JSON + Markdown data (no DB yet)
- Vercel deployment ready
- Auth-ready middleware stub

## Do NOT

- Add external auth yet (stub only)
- Add production databases yet
- Modify OpenClaw, MCP, swarms, startup, production agents
- Automate external logins or scrape restricted content
- Expose sensitive local file paths in deployed data

## Project Location

`apps/command-center/`

## Implementation Status (v0.1)

| Feature | Status |
|---------|--------|
| 14 core routes | ✅ |
| Sample data layer | ✅ |
| 70/20/10 tracker | ✅ |
| System inventory | ✅ |
| KPI dashboard | ✅ |
| Daily brief (manual) | ✅ |
| Flywheel analytics | ✅ |
| Commuter / NotebookLM / remediation | ✅ |
| sanitize-data script | ✅ |
| Vercel README | ✅ |
| Auth | stub |
| Database | future |
| Live pipeline sync | future |

## Workflow

1. Propose architecture
2. Scaffold project
3. Build pages incrementally
4. Generate sample data
5. Validate locally (`npm run build`)
6. Deploy to Vercel with Deployment Protection

See [README.md](../README.md) for commands and deployment steps.
