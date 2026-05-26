import { loadJson } from "@/lib/data";
import { PageHeader, DataTable, KpiCard } from "@/components/ui/PageHeader";

export default function CommuterPage() {
  const data = loadJson<{
    queue: { resourceId: string; title: string; commuteFriendly: boolean; priority: string; reviewQuestions: number; weaknessTags: string[]; completed: boolean }[];
    playlist: { id: string; name: string; resourceIds: string[]; estimatedMinutes: number }[];
    sessions: { id: string; date: string; resourceId: string; durationMinutes: number; completed: boolean }[];
    metrics: { passiveReinforcementScore: number; reviewCadenceDays: number; retentionReinforcementLevel: string };
  }>("commuter_queue.json");

  return (
    <div>
      <PageHeader title="Commuter Reinforcement" subtitle="Manual review — no automated external logins" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Passive score" value={data.metrics.passiveReinforcementScore} accent="text-cyan-400" />
        <KpiCard label="Review cadence" value={`${data.metrics.reviewCadenceDays}d`} />
        <KpiCard label="Retention" value={data.metrics.retentionReinforcementLevel} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Review Queue</h2>
      <DataTable
        headers={["Resource", "Priority", "Commute", "Questions", "Weakness tags", "Done"]}
        rows={data.queue.map((q) => [
          q.title,
          q.priority,
          q.commuteFriendly ? "✓" : "—",
          q.reviewQuestions,
          q.weaknessTags.join(", "),
          q.completed ? "✓" : "○",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Playlists</h2>
      {data.playlist.map((p) => (
        <div key={p.id} className="mb-3 glass-panel p-4">
          <p className="font-medium">{p.name}</p>
          <p className="text-sm text-gray-400">{p.estimatedMinutes} min · {p.resourceIds.join(" → ")}</p>
        </div>
      ))}

      <h2 className="mb-3 mt-8 text-lg font-semibold">Sessions</h2>
      <DataTable
        headers={["Date", "Resource", "Duration", "Complete"]}
        rows={data.sessions.map((s) => [s.date, s.resourceId, `${s.durationMinutes}m`, s.completed ? "✓" : "○"])}
      />
    </div>
  );
}
