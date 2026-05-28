import ReactMarkdown from "react-markdown";
import { loadJson, loadMarkdown } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalLink } from "@/components/navigation/NavLinks";
import { GhostButton } from "@/components/ui/Buttons";
import { isSafeUrl } from "@/lib/catalog";
import { FrontierSignalBrowser } from "@/components/signals/FrontierSignalBrowser";

type FrontierSignal = {
  id: string;
  date: string;
  source: string;
  person_or_lab: string;
  title: string;
  summary: string;
  url: string;
  topic: string;
  related_course_phase: string | null;
  related_lesson: string | null;
  relevance_score: number;
  urgency: string;
  classification: "act_now" | "monitor" | "parked" | "ignore";
  reason: string;
  commuter_ready: boolean;
  suggested_commuter_mode: string | null;
  reading_time_minutes: number | null;
  watch_time_minutes: number | null;
  action: string;
  related_resources: string[];
};

export default function DailyBriefPage() {
  const brief = loadJson<{
    date: string;
    headline: string;
    summary: string;
    signals: {
      id: string;
      title: string;
      source: string;
      category: string;
      relevanceScore: number;
      classification: string;
      importance: string;
      roadmapImpact: string;
      url: string;
      commuterPrompt: string;
    }[];
    manualIngestionNote: string;
  }>("daily_brief.json");
  const md = loadMarkdown("DAILY_AI_BRIEF.md");
  const { signals: frontierSignals } = loadJson<{ signals: FrontierSignal[] }>("frontier_signal_queue.json");
  const topFrontier = frontierSignals
    .filter((s) => s.classification !== "ignore")
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Daily AI Brief" subtitle={`${brief.date} — manual curation only`} />

      <div className="mb-6 glass-panel p-6 prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>

      <p className="mb-4 text-sm text-gray-500">{brief.manualIngestionNote}</p>

      <h2 className="mb-3 text-lg font-semibold">Trend Signals</h2>
      <div className="mb-8 space-y-3">
        {brief.signals
          .filter((s) => isSafeUrl(s.url))
          .map((s) => {
            const badgeClass =
              s.classification === "ignore"
                ? "badge-ignore"
                : s.classification === "monitor"
                ? "badge-monitor"
                : "badge-ready";
            return (
              <div
                key={s.id}
                className="glass-panel p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <ExternalLink href={s.url} className="font-semibold">
                      {s.title}
                    </ExternalLink>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={`${badgeClass} text-[10px]`}>{s.classification}</span>
                      <span className="badge-monitor text-[10px]">{s.category}</span>
                      <span className="text-[10px] text-gray-600">relevance {s.relevanceScore}</span>
                    </div>
                    {s.roadmapImpact && (
                      <p className="mt-1.5 text-xs text-gray-500">{s.roadmapImpact}</p>
                    )}
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    Read ↗
                  </a>
                </div>
              </div>
            );
          })}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Commuter Prompts</h2>
      <div className="mb-6 space-y-3">
        {brief.signals.map((s) => (
          <div key={s.id} className="glass-panel p-4 text-sm transition hover:border-cyan-500/15">
            <p className="font-semibold text-white">
              {isSafeUrl(s.url) ? (
                <ExternalLink href={s.url}>{s.title}</ExternalLink>
              ) : (
                s.title
              )}
            </p>
            <p className="mt-2 text-gray-400">{s.commuterPrompt}</p>
          </div>
        ))}
      </div>
      <GhostButton href="/commuter">Take to Commuter queue →</GhostButton>

      {/* ── FRONTIER WATCH ──────────────────────────────────── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">🔭 Frontier Watch</h2>
            <p className="text-xs text-gray-600 mt-0.5">Top 5 scored signals from the frontier queue · 10% scan budget</p>
          </div>
          <a
            href="/trend-signals"
            className="text-xs text-cyan-500 hover:text-cyan-400 transition"
          >
            View all signals →
          </a>
        </div>
        <FrontierSignalBrowser signals={topFrontier} />
      </div>
    </div>
  );
}
