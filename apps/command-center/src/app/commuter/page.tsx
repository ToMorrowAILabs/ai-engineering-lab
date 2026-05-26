import { loadJson } from "@/lib/data";
import { PageHeader, DataTable, KpiCard } from "@/components/ui/PageHeader";
import { ExternalResourceLink, SourceTypeBadge } from "@/components/resources/ResourceBadges";

export default function CommuterPage() {
  const data = loadJson<{
    queue: {
      resourceId: string;
      title: string;
      url?: string;
      commuteFriendly: boolean;
      priority: string;
      reviewQuestions: number;
      weaknessTags: string[];
      completed: boolean;
      kind?: "watch_now" | "read_later";
    }[];
    playlist: { id: string; name: string; resourceIds: string[]; estimatedMinutes: number }[];
    sessions: { id: string; date: string; resourceId: string; durationMinutes: number; completed: boolean }[];
    metrics: { passiveReinforcementScore: number; reviewCadenceDays: number; retentionReinforcementLevel: string };
  }>("commuter_queue.json");

  const watchNow = data.queue.filter((q) => q.kind !== "read_later");
  const readLater = data.queue.filter((q) => q.kind === "read_later");

  return (
    <div>
      <PageHeader title="Commuter Reinforcement" subtitle="MIT math playlist high priority · GitHub repos optional read/watch later" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Passive score" value={data.metrics.passiveReinforcementScore} accent="text-cyan-400" />
        <KpiCard label="Review cadence" value={`${data.metrics.reviewCadenceDays}d`} />
        <KpiCard label="Retention" value={data.metrics.retentionReinforcementLevel} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">High-Priority Commute Queue</h2>
      <DataTable
        headers={["Resource", "Priority", "Commute", "Questions", "Weakness tags", "Done"]}
        rows={watchNow.map((q) => [
          q.url ? (
            <ExternalResourceLink href={q.url}>{q.title}</ExternalResourceLink>
          ) : (
            q.title
          ),
          q.priority,
          q.commuteFriendly ? "✓" : "—",
          q.reviewQuestions,
          q.weaknessTags.join(", "),
          q.completed ? "✓" : "○",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Read / Watch Later (GitHub)</h2>
      <p className="mb-3 text-sm text-gray-500">Optional repo review — not blocking Month 1 anchors.</p>
      <div className="space-y-2">
        {readLater.map((q) => (
          <div key={q.resourceId} className="glass-panel flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
            <SourceTypeBadge type="github_repo" />
            {q.url ? (
              <ExternalResourceLink href={q.url}>{q.title}</ExternalResourceLink>
            ) : (
              q.title
            )}
            <span className="badge-monitor">optional</span>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Playlists</h2>
      {data.playlist.map((p) => (
        <div key={p.id} className="mb-3 glass-panel p-4">
          <p className="font-medium">{p.name}</p>
          <p className="text-sm text-gray-400">
            {p.estimatedMinutes > 0 ? `${p.estimatedMinutes} min · ` : ""}
            {p.resourceIds.join(" → ")}
          </p>
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
