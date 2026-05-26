# ToMorrowAILabs.ai — AI Engineering Command Center

Private-first learning operating system for the AI Engineering Lab.

**Operating rule:** 70% foundations · 20% applied · 10% frontier scan

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Local JSON + Markdown (`data/`)
- Vercel-ready · auth-ready · no database yet

## Local Development

```bash
cd apps/command-center
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard |
| `/roadmap` | Course roadmap |
| `/progress` | Month 1 progress |
| `/course-kpis` | Learning KPIs |
| `/resources` | Resource links + registry |
| `/commuter` | Commuter reinforcement queue |
| `/notebooklm` | NotebookLM source packs |
| `/weakness-remediation` | Remediation queue |
| `/daily-brief` | Daily AI brief |
| `/trend-signals` | Frontier trend signals |
| `/flywheel` | Flywheel analytics |
| `/resource-graph` | Lesson-resource graph |
| `/change-log` | Course change log |
| `/system-inventory` | Infrastructure inventory |

## Data

All runtime data lives in `data/` — sanitized, no machine paths, deploy-safe.

Refresh from course repo:

```bash
npm run sanitize-data
```

Master build spec: `docs/MASTER_BUILD_PROMPT.md`

## Vercel Deployment

1. Push repository to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Set **Root Directory** to `apps/command-center`
4. Framework: **Next.js** (auto-detected)
5. Build command: `npm run build` (default)
6. Output: default
7. Environment variables (optional for v1):
   - Copy from `.env.example`
   - `AUTH_ENABLED=false`
8. Deploy

### Recommended: Deployment Protection

Until auth is implemented, enable **Vercel Deployment Protection** (password or SSO) in project settings.

### Custom Domain

Add `command.tomorrowailabs.ai` (or your subdomain) in Vercel → Domains.

## Security

- `robots.txt` disallows indexing
- No `/Volumes/` or local usernames in committed data
- No automated external logins
- Does not modify OpenClaw, MCP, swarms, startup, or production agents

## Future

- Auth middleware (`AUTH_ENABLED=true`)
- Database for lesson events and KPIs
- Agent integration (course OS only)
- Live sync webhook from `sync_ai_library.py`
