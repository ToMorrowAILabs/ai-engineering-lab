import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
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

  const featured =
    log.signals.find((s) => (s as { featured?: boolean }).featured) ??
    log.signals.find((s) => s.classification === "act_now") ??
    log.signals[0] ??
    null;

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
      <div className="mb-8 space-y-3">
        {log.signals.map((s) => {
          const firstResourceId = s.resourceIds?.[0];
          const firstResource = firstResourceId ? byId[firstResourceId] : null;
          const velocityClass =
            s.velocity === "rising" ? "badge-ready" : s.velocity === "parked" ? "badge-frontier" : "badge-monitor";
          const classClass =
            s.classification === "later" ? "badge-ignore" : s.classification === "act_now" ? "badge-ready" : "badge-monitor";
          return (
            <div
              key={s.id}
              className="glass-panel p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1">
                  {firstResource && isSafeUrl(firstResource.url) ? (
                    <InternalLink href={`/resources/${firstResource.id}`} className="font-semibold">
                      {s.title ?? s.topic.replace(/_/g, " ")}
                    </InternalLink>
                  ) : (
                    <p className="font-semibold text-white">{s.title ?? s.topic.replace(/_/g, " ")}</p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-500">{s.source}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <span className={`${velocityClass} text-[10px]`}>{s.velocity}</span>
                  <span className={`${classClass} text-[10px]`}>{s.classification ?? "monitor"}</span>
                  {s.learningPhase && (
                    <span className="badge-monitor text-[10px]">{s.learningPhase}</span>
                  )}
                </div>
              </div>
              {s.reason && <p className="text-xs text-gray-500">{s.reason}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {s.actAfter && (
                  <span className="text-[10px] text-gray-600">Act after: {s.actAfter}</span>
                )}
                <span className="text-[10px] text-gray-700">{s.loggedAt}</span>
                {firstResource && isSafeUrl(firstResource.url) && (
                  <ExternalLink href={firstResource.url} className="text-xs">
                    Open source
                  </ExternalLink>
                )}
                {firstResource && (
                  <InternalLink
                    href={`/resources/${firstResource.id}`}
                    className="rounded border border-command-border px-2 py-0.5 text-[10px] font-medium no-underline text-gray-500 transition hover:border-cyan-500/40 hover:text-cyan-400"
                  >
                    Details →
                  </InternalLink>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Today&apos;s Brief Signals</h2>
      <div className="space-y-3">
        {brief.signals
          .filter((s) => isSafeUrl(s.url))
          .map((s) => {
            const badgeClass =
              s.classification === "ignore" ? "badge-ignore" : s.classification === "act_now" ? "badge-ready" : "badge-monitor";
            return (
              <div
                key={s.title}
                className="glass-panel flex flex-wrap items-start justify-between gap-3 p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
              >
                <div className="flex-1">
                  <ExternalLink href={s.url} className="font-semibold">
                    {s.title}
                  </ExternalLink>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`${badgeClass} text-[10px]`}>{s.classification}</span>
                    <span className="badge-monitor text-[10px]">{s.category}</span>
                    <span className="text-[10px] text-gray-600">score: {s.relevanceScore}</span>
                  </div>
                </div>
                <ExternalLink href={s.url} className="shrink-0 text-xs">
                  Read ↗
                </ExternalLink>
              </div>
            );
          })}
      </div>
    </div>
  );
}
