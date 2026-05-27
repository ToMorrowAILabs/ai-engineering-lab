import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { CtaButton, GhostButton } from "@/components/ui/Buttons";
import { InternalLink, ExternalLink, PendingResourceBadge } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { isSafeUrl, getRelatedLessonSlug } from "@/lib/catalog";
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
      <div className="mb-8 space-y-3">
        {readLater.map((q) => {
          const r = resourceMap[q.resourceId];
          const lessonSlug = getRelatedLessonSlug(q.resourceId);
          return (
            <div
              key={q.resourceId}
              className="glass-panel p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <SourceTypeBadge type="github_repo" />
                    <span className="badge-monitor text-[10px]">optional</span>
                    {q.weaknessTags.length > 0 &&
                      q.weaknessTags.map((t) => (
                        <span key={t} className="badge-scaffold text-[10px]">
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                  </div>
                  <InternalLink href={`/resources/${q.resourceId}`} className="font-semibold">
                    {q.title}
                  </InternalLink>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <InternalLink href={`/resources/${q.resourceId}`} className="rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium no-underline text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300">
                    View details
                  </InternalLink>
                  {r && isSafeUrl(r.url) && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                    >
                      Open repo ↗
                    </a>
                  )}
                  {lessonSlug && (
                    <InternalLink
                      href={`/lessons/${lessonSlug}`}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium no-underline text-cyan-300 transition hover:bg-cyan-500/20"
                    >
                      Open lesson →
                    </InternalLink>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PLAYLISTS ───────────────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Playlists</h2>
      <div className="mb-8 space-y-3">
        {data.playlist.map((p) => (
          <div key={p.id} className="glass-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                {p.estimatedMinutes > 0 && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {p.estimatedMinutes} min · {p.resourceIds.length} resources
                  </p>
                )}
              </div>
              <CtaButton href="/commuter">
                Start in Commuter →
              </CtaButton>
            </div>
            <div className="mt-4 space-y-2">
              {p.resourceIds.map((id) => {
                const r = resourceMap[id];
                return r ? (
                  <div key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <InternalLink href={`/resources/${id}`}>{r.title}</InternalLink>
                    {isSafeUrl(r.url) && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 transition hover:text-cyan-400"
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                ) : (
                  <div key={id} className="flex items-center gap-2">
                    <PendingResourceBadge id={id} />
                  </div>
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
          const lessonSlug = getRelatedLessonSlug(s.resourceId);
          return (
            <div
              key={s.id}
              className="glass-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
            >
              <span className="w-24 shrink-0 text-xs text-gray-600">{s.date}</span>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {r ? (
                  <InternalLink href={`/resources/${s.resourceId}`}>{r.title}</InternalLink>
                ) : (
                  <PendingResourceBadge id={s.resourceId} />
                )}
              </div>
              <span className="text-xs text-gray-600">{s.durationMinutes}m</span>
              <span className={s.completed ? "badge-ready" : "badge-scaffold"}>
                {s.completed ? "done" : "partial"}
              </span>
              {r && (
                <InternalLink
                  href={`/resources/${s.resourceId}`}
                  className="rounded border border-command-border px-2 py-0.5 text-[10px] font-medium no-underline text-gray-500 transition hover:border-cyan-500/40 hover:text-cyan-400"
                >
                  View →
                </InternalLink>
              )}
              {lessonSlug && (
                <InternalLink
                  href={`/lessons/${lessonSlug}`}
                  className="rounded border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-medium no-underline text-cyan-500/70 transition hover:border-cyan-500/40 hover:text-cyan-400"
                >
                  Lesson →
                </InternalLink>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
