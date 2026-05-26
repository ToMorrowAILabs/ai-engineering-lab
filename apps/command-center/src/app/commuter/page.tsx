import { loadJson } from "@/lib/data";
import { PageHeader, DataTable, KpiCard } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { isSafeUrl } from "@/lib/catalog";

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
          <span key={q.resourceId} className="flex flex-wrap items-center gap-2">
            <InternalLink href={`/resources/${q.resourceId}`}>{q.title}</InternalLink>
            {q.url && isSafeUrl(q.url) && (
              <ExternalLink href={q.url} className="text-xs">
                Open
              </ExternalLink>
            )}
          </span>,
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
            <InternalLink href={`/resources/${q.resourceId}`}>{q.title}</InternalLink>
            {q.url && isSafeUrl(q.url) && (
              <ExternalLink href={q.url} className="text-xs">
                Open repo
              </ExternalLink>
            )}
            <span className="badge-monitor">optional</span>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Playlists</h2>
      {data.playlist.map((p) => (
        <div key={p.id} className="mb-3 glass-panel p-4">
          <p className="font-medium">{p.name}</p>
          <p className="mt-1 text-sm text-gray-400">
            {p.estimatedMinutes > 0 ? `${p.estimatedMinutes} min · ` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.resourceIds.map((id) => (
              <InternalLink key={id} href={`/resources/${id}`} className="text-xs">
                {id}
              </InternalLink>
            ))}
          </div>
        </div>
      ))}

      <h2 className="mb-3 mt-8 text-lg font-semibold">Sessions</h2>
      <DataTable
        headers={["Date", "Resource", "Duration", "Complete"]}
        rows={data.sessions.map((s) => [
          s.date,
          <InternalLink href={`/resources/${s.resourceId}`}>{s.resourceId}</InternalLink>,
          `${s.durationMinutes}m`,
          s.completed ? "✓" : "○",
        ])}
      />
    </div>
  );
}
