import { loadJson } from "@/lib/data";
import { PageHeader, KpiCard, DataTable } from "@/components/ui/PageHeader";

export default function FlywheelPage() {
  const metrics = loadJson<{
    metrics: Record<string, number>;
    emergingTopics: string[];
    decliningTopics: string[];
    parkedIdeas: string[];
    period: string;
  }>("flywheel_metrics.json");
  const events = loadJson<{ events: { id: string; type: string; timestamp: string; detail: string }[] }>("flywheel_events.json");

  return (
    <div>
      <PageHeader title="Flywheel Analytics" subtitle={`Period: ${metrics.period} — curriculum evolution engine`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Accepted resources" value={metrics.metrics.resourcesAccepted} />
        <KpiCard label="Updates applied" value={metrics.metrics.courseUpdatesApplied} accent="text-emerald-400" />
        <KpiCard label="Trend velocity" value={metrics.metrics.trendVelocity} />
        <KpiCard label="Ingestion rate" value={metrics.metrics.resourceIngestionRate} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="glass-panel p-4">
          <p className="mb-2 text-sm font-medium text-emerald-400">Emerging</p>
          {metrics.emergingTopics.map((t) => (
            <span key={t} className="mr-2 badge-ready">{t}</span>
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
            <span key={t} className="mr-2 badge-frontier">{t}</span>
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
