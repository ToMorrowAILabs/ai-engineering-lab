import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { isSafeUrl } from "@/lib/catalog";

export default function TrendSignalsPage() {
  const log = loadJson<{
    signals: {
      id: string;
      topic: string;
      title?: string;
      velocity: string;
      source: string;
      classification?: string;
      learningPhase?: string;
      actAfter?: string;
      reason?: string;
      resourceIds?: string[];
      loggedAt: string;
    }[];
  }>("trend_signal_log.json");
  const brief = loadJson<{ signals: { title: string; classification: string; category: string; relevanceScore: number; url: string }[] }>("daily_brief.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));

  const featured = log.signals.find((s) => s.id === "ts4");

  return (
    <div>
      <PageHeader title="AI Trend Signals" subtitle="10% frontier scan — monitor, do not chase hype" />

      {featured && (
        <div className="mb-6 glass-panel p-4">
          <p className="mb-1 text-sm font-medium text-amber-300">Featured signal</p>
          <p className="font-medium">{featured.title ?? featured.topic.replace(/_/g, " ")}</p>
          <p className="mt-2 text-sm text-gray-400">
            Classification: <span className="badge-monitor">{featured.classification ?? "monitor"}</span>
            {featured.actAfter && (
              <span className="ml-2">· Act after {featured.actAfter}</span>
            )}
          </p>
          {featured.reason && <p className="mt-2 text-sm text-gray-400">{featured.reason}</p>}
          {featured.resourceIds && (
            <ul className="mt-3 space-y-1">
              {featured.resourceIds.map((id) => {
                const r = byId[id];
                return r && isSafeUrl(r.url) ? (
                  <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                    <ExternalLink href={r.url} className="text-xs">
                      Open
                    </ExternalLink>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Signal Log</h2>
      <DataTable
        headers={["Topic", "Phase", "Velocity", "Action", "Source", "Logged"]}
        rows={log.signals.map((s) => [
          s.title ?? s.topic.replace(/_/g, " "),
          s.learningPhase ?? "—",
          <span className={s.velocity === "rising" ? "badge-ready" : s.velocity === "parked" ? "badge-frontier" : "badge-monitor"}>{s.velocity}</span>,
          <span className={s.classification === "later" ? "badge-ignore" : s.classification === "act_now" ? "badge-ready" : "badge-monitor"}>{s.classification ?? "monitor"}</span>,
          s.source,
          s.loggedAt,
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Today&apos;s Brief Signals</h2>
      <DataTable
        headers={["Title", "Score", "Action", "Category"]}
        rows={brief.signals
          .filter((s) => isSafeUrl(s.url))
          .map((s) => [
            <ExternalLink href={s.url}>{s.title}</ExternalLink>,
            s.relevanceScore,
            <span className={s.classification === "ignore" ? "badge-ignore" : s.classification === "act_now" ? "badge-ready" : "badge-monitor"}>{s.classification}</span>,
            s.category,
          ])}
      />
    </div>
  );
}
