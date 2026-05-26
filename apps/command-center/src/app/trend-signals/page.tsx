import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function TrendSignalsPage() {
  const log = loadJson<{ signals: { id: string; topic: string; velocity: string; source: string; loggedAt: string }[] }>("trend_signal_log.json");
  const brief = loadJson<{ signals: { title: string; classification: string; category: string; relevanceScore: number }[] }>("daily_brief.json");

  return (
    <div>
      <PageHeader title="AI Trend Signals" subtitle="10% frontier scan — monitor, do not chase hype" />

      <h2 className="mb-3 text-lg font-semibold">Signal Log</h2>
      <DataTable
        headers={["Topic", "Velocity", "Source", "Logged"]}
        rows={log.signals.map((s) => [
          s.topic.replace(/_/g, " "),
          <span className={s.velocity === "rising" ? "badge-ready" : s.velocity === "parked" ? "badge-frontier" : "badge-monitor"}>{s.velocity}</span>,
          s.source,
          s.loggedAt,
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Today&apos;s Brief Signals</h2>
      <DataTable
        headers={["Title", "Score", "Action", "Category"]}
        rows={brief.signals.map((s) => [
          s.title,
          s.relevanceScore,
          <span className={s.classification === "ignore" ? "badge-ignore" : "badge-monitor"}>{s.classification}</span>,
          s.category,
        ])}
      />
    </div>
  );
}
