import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, KpiCard, DataTable } from "@/components/ui/PageHeader";
import { ExternalResourceLink } from "@/components/resources/ResourceBadges";

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
        <KpiCard label="Accepted resources" value={metrics.metrics.resourcesAccepted} />
        <KpiCard label="New this batch" value={metrics.metrics.resourceIngestionRate} accent="text-cyan-400" />
        <KpiCard label="Updates applied" value={metrics.metrics.courseUpdatesApplied} accent="text-emerald-400" />
        <KpiCard label="Trend velocity" value={metrics.metrics.trendVelocity} />
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
                        {r ? (
                          <ExternalResourceLink href={r.url}>{r.title}</ExternalResourceLink>
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
          <p className="mb-2 text-sm font-medium text-emerald-400">Emerging</p>
          {metrics.emergingTopics.map((t) => (
            <span key={t} className="mr-2 badge-ready">{t.replace(/_/g, " ")}</span>
          ))}
        </div>
        <div className="glass-panel p-4">
          <p className="mb-2 text-sm font-medium text-gray-400">Declining</p>
          {metrics.decliningTopics.length ? metrics.decliningTopics.map((t) => (
            <span key={t} className="mr-2 badge-ignore">{t}</span>
          )) : "—"}
        </div>
        <div className="glass-panel p-4">
          <p className="mb-2 text-sm font-medium text-violet-400">Parked</p>
          {metrics.parkedIdeas.map((t) => (
            <span key={t} className="mr-2 badge-frontier">{t.replace(/_/g, " ")}</span>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Flywheel Events</h2>
      <DataTable
        headers={["Type", "Detail", "When"]}
        rows={events.events.map((e) => [
          e.type.replace(/_/g, " "),
          e.detail,
          new Date(e.timestamp).toLocaleDateString(),
        ])}
      />
    </div>
  );
}
