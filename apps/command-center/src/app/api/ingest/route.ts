/**
 * POST /api/ingest
 * Triggers the full ingestion pipeline and returns the result.
 * Optionally write to feed_cache.json (via ?write=true) — only works in local/dev.
 *
 * In production, call this route from a Vercel Cron job:
 *   vercel.json: { "crons": [{ "path": "/api/ingest", "schedule": "0 7 * * *" }] }
 */

import { NextResponse } from "next/server";
import { runIngestion } from "@/lib/ingest/index";

// Allow Vercel cron
export const maxDuration = 60;

export async function POST() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const result = await runIngestion({
      githubToken: process.env.GITHUB_TOKEN,
      signal: controller.signal,
    });

    return NextResponse.json({
      ok: true,
      summary: result.summary,
      signals: result.signals.slice(0, 50), // cap response payload
      errors: result.errors,
      ingestedAt: result.ingestedAt,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}

// Allow Vercel cron to call via GET
export async function GET() {
  return POST();
}
