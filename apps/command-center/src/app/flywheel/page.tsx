import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { isSafeUrl } from "@/lib/catalog";

export default function FlywheelPage() {
  const metrics = loadJson<{
    metrics: Record<string, number>;
    newlyAcceptedResources?: { id: string; learningPhase: string; reason: string; approved: boolean }[];
    emergingTopics: string[];
    decliningTopics: string[];
    parkedIdeas: string[];
    period: string;
  }>("flywheel_metrics.json");
  const events = loadJson<{ events: { id: string; type: string; timestamp: string; detail: string }[] }>("flywheel_events.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));

  return (
    <div>
      <PageHeader title="Flywheel Analytics" subtitle={`Period: ${metrics.period} — curriculum evolution engine`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Accepted resources" value={metrics.metrics.resourcesAccepted} href="/resources" />
        <KpiCard label="New this batch" value={metrics.metrics.resourceIngestionRate} accent="text-cyan-400" href="/resources" />
        <KpiCard label="Updates applied" value={metrics.metrics.courseUpdatesApplied} accent="text-emerald-400" href="/change-log" />
        <KpiCard label="Trend velocity" value={metrics.metrics.trendVelocity} href="/trend-signals" />
      </div>

      {metrics.newlyAcceptedResources && metrics.newlyAcceptedResources.length > 0 && (
        <>
          <h2 className="mb-3 text-lg font-semibold">Newly Accepted Resources</h2>
          <div className="mb-6 glass-panel overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-command-border text-xs uppercase text-gray-500">
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.newlyAcceptedResources.map((entry) => {
                  const r = byId[entry.id];
                  return (
                    <tr key={entry.id} className="border-b border-command-border/50 hover:bg-white/5">
                      <td className="px-4 py-3">
                        {r && isSafeUrl(r.url) ? (
                          <span className="flex flex-wrap items-center gap-2">
                            <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                            <ExternalLink href={r.url} className="text-xs">
                              Open
                            </ExternalLink>
                          </span>
                        ) : (
                          entry.id
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{entry.learningPhase}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{entry.reason}</td>
                      <td className="px-4 py-3">
                        <span className={entry.approved ? "badge-ready" : "badge-ignore"}>
                          {entry.approved ? "approved" : "pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="glass-panel p-4">
          <p className="mb-3 text-sm font-medium text-emerald-400">Emerging Topics</p>
          <div className="flex flex-wrap gap-2">
            {metrics.emergingTopics.map((t) => (
              <Link
                key={t}
                href="/trend-signals"
                className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/25"
              >
                {t.replace(/_/g, " ")} ↗
              </Link>
            ))}
          </div>
        </div>
        <div className="glass-panel p-4">
          <p className="mb-3 text-sm font-medium text-gray-400">Declining Topics</p>
          <div className="flex flex-wrap gap-2">
            {metrics.decliningTopics.length ? metrics.decliningTopics.map((t) => (
              <span key={t} className="badge-ignore">{t.replace(/_/g, " ")}</span>
            )) : <span className="text-sm text-gray-600">None declining</span>}
          </div>
        </div>
        <div className="glass-panel p-4">
          <p className="mb-3 text-sm font-medium text-violet-400">Parked Ideas</p>
          <div className="flex flex-wrap gap-2">
            {metrics.parkedIdeas.map((t) => (
              <Link
                key={t}
                href="/roadmap"
                className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300 transition hover:border-violet-500/50 hover:bg-violet-500/25"
              >
                {t.replace(/_/g, " ")} →
              </Link>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Flywheel Events</h2>
      <div className="space-y-2">
        {events.events.map((e) => (
          <div
            key={e.id}
            className="glass-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
          >
            <span className="badge-monitor capitalize shrink-0">
              {e.type.replace(/_/g, " ")}
            </span>
            <span className="flex-1 text-gray-300">{e.detail}</span>
            <span className="text-xs text-gray-600 shrink-0">
              {new Date(e.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        <InternalLink href="/change-log">View change log</InternalLink>
        {" · "}
        <InternalLink href="/resources">Browse resources</InternalLink>
      </p>
    </div>
  );
}
