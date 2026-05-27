import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { GhostButton } from "@/components/ui/Buttons";
import { InternalLink, ExternalLink } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { isSafeUrl } from "@/lib/catalog";
import { CommuterModePicker } from "@/components/commuter/CommuterModePicker";

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

  const modesData = loadJson<{
    note: string;
    modes: {
      id: string;
      label: string;
      icon: string;
      description: string;
      maxItems: number;
      resourceIds: string[];
      reviewPrompts: string[];
      notebooklmPackId?: string;
    }[];
  }>("commuter_modes.json");

  const recallData = loadJson<{
    questions: {
      id: string;
      lessonId: string;
      topic: string;
      question: string;
      hint: string;
      difficulty: string;
    }[];
  }>("active_recall_questions.json");

  const nlmData = loadJson<{
    packs: { id: string; title: string; repoPath: string; priority: string }[];
  }>("notebooklm_packs.json");

  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const resourceMap = Object.fromEntries(resources.map((r) => [r.id, r]));

  const watchNow = data.queue.filter((q) => q.kind !== "read_later");
  const readLater = data.queue.filter((q) => q.kind === "read_later");
  const pending = data.queue.filter((q) => !q.completed).length;

  return (
    <div>
      <PageHeader
        title="Commuter Reinforcement"
        subtitle="Passive learning — reinforce foundations during commute, gym, walking, and errands"
      />

      {/* Metrics row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Passive score" value={data.metrics.passiveReinforcementScore} accent="text-cyan-400" />
        <KpiCard label="Review cadence" value={`${data.metrics.reviewCadenceDays}d`} />
        <KpiCard label="Retention level" value={data.metrics.retentionReinforcementLevel} />
      </div>

      {/* Queue summary */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-5 py-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            {pending} items pending · {watchNow.length} watch-now · {readLater.length} read later
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Select a mode below to get a curated session with active recall questions
          </p>
        </div>
        <GhostButton href="/notebooklm">NotebookLM packs →</GhostButton>
      </div>

      {/* ── MODE PICKER (client component) ─────────────────────── */}
      <h2 className="mb-4 text-lg font-semibold">Choose a learning mode</h2>
      <CommuterModePicker
        modes={modesData.modes}
        queue={data.queue}
        resourceMap={resourceMap}
        recallQuestions={recallData.questions}
        notebooklmPacks={nlmData.packs}
        defaultMode="20min"
      />

      {/* ── READ / WATCH LATER ──────────────────────────────────── */}
      <h2 className="mb-2 mt-10 text-lg font-semibold">Read / Watch Later</h2>
      <p className="mb-4 text-sm text-gray-500">
        GitHub repos and reference material — optional, not blocking Month 1 anchors.
      </p>
      <div className="mb-8 space-y-2">
        {readLater.map((q) => {
          const r = resourceMap[q.resourceId];
          return (
            <div
              key={q.resourceId}
              className="glass-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
            >
              <SourceTypeBadge type="github_repo" />
              <InternalLink href={`/resources/${q.resourceId}`}>{q.title}</InternalLink>
              {r && isSafeUrl(r.url) && (
                <ExternalLink href={r.url} className="text-xs">
                  Open repo ↗
                </ExternalLink>
              )}
              <span className="badge-monitor">optional</span>
              {q.weaknessTags.length > 0 && (
                <span className="text-xs text-gray-600">{q.weaknessTags.join(", ")}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── PLAYLISTS ───────────────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Playlists</h2>
      <div className="mb-8 space-y-3">
        {data.playlist.map((p) => (
          <div key={p.id} className="glass-panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                {p.estimatedMinutes > 0 && (
                  <p className="mt-0.5 text-xs text-gray-500">{p.estimatedMinutes} min estimated</p>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.resourceIds.map((id) => {
                const r = resourceMap[id];
                return r ? (
                  <InternalLink key={id} href={`/resources/${id}`} className="text-xs">
                    {r.title}
                  </InternalLink>
                ) : (
                  <span key={id} className="text-xs text-gray-600">{id}</span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── SESSIONS ────────────────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Past Sessions</h2>
      <div className="space-y-2">
        {data.sessions.map((s) => {
          const r = resourceMap[s.resourceId];
          return (
            <div
              key={s.id}
              className="glass-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span className="text-gray-500">{s.date}</span>
              {r ? (
                <InternalLink href={`/resources/${s.resourceId}`}>{r.title}</InternalLink>
              ) : (
                <span className="text-gray-400">{s.resourceId}</span>
              )}
              <span className="text-gray-400">{s.durationMinutes}m</span>
              <span className={s.completed ? "badge-ready" : "badge-scaffold"}>
                {s.completed ? "done" : "partial"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
