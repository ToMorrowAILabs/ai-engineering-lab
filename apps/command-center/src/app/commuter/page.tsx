import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { CtaButton, GhostButton } from "@/components/ui/Buttons";
import { InternalLink, ExternalLink, PendingResourceBadge } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { isSafeUrl, getRelatedLessonSlug } from "@/lib/catalog";
import { CommuterModePicker } from "@/components/commuter/CommuterModePicker";

type MediaResource = {
  id: string;
  title: string;
  sourceType: string;
  url: string;
  relatedLesson: string | null;
  relatedTopic: string;
  modeTags: string[];
  estimatedMinutes: number;
  passiveFriendly: boolean;
  activeRecallPrompt: string;
  recommendedContext: string[];
  videoNeeded?: boolean;
  resourceId?: string;
};

type QueueItem = {
  resourceId: string;
  title: string;
  url?: string;
  commuteFriendly: boolean;
  priority: string;
  reviewQuestions: number;
  weaknessTags: string[];
  completed: boolean;
  kind?: "watch_now" | "read_later";
  sourceType?: string;
  relatedLesson?: string | null;
  relatedTopic?: string;
  modeTags?: string[];
  estimatedMinutes?: number;
  passiveFriendly?: boolean;
  activeRecallPrompt?: string;
  videoNeeded?: boolean;
  recommendedContext?: string[];
};

const SOURCE_LABELS: Record<string, string> = {
  youtube_playlist: "YouTube Playlist",
  youtube_video:    "YouTube Video",
  github_repo:      "GitHub Repo",
  paper:            "Paper",
  book:             "Book",
  notebooklm_pack:  "NotebookLM Pack",
  course:           "Course",
};

const SOURCE_COLORS: Record<string, string> = {
  youtube_playlist: "border-red-500/30 bg-red-500/10 text-red-400",
  youtube_video:    "border-red-500/30 bg-red-500/10 text-red-400",
  github_repo:      "border-gray-500/30 bg-gray-500/10 text-gray-400",
  course:           "border-blue-500/30 bg-blue-500/10 text-blue-400",
  paper:            "border-violet-500/30 bg-violet-500/10 text-violet-400",
  book:             "border-amber-500/30 bg-amber-500/10 text-amber-400",
  notebooklm_pack:  "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const MODE_CONTEXT_COLORS: Record<string, string> = {
  commute:  "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  walking:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  gym:      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  lunch:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  dinner:   "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  chores:   "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function ContextChip({ ctx }: { ctx: string }) {
  const cls = MODE_CONTEXT_COLORS[ctx] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
  const icons: Record<string, string> = {
    commute: "🚇", walking: "🚶", gym: "💪", lunch: "☀️", dinner: "🌙", chores: "🧹",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${cls}`}>
      {icons[ctx] ?? ""} {ctx}
    </span>
  );
}

function SourceBadge({ sourceType }: { sourceType: string }) {
  const label = SOURCE_LABELS[sourceType] ?? sourceType;
  const cls = SOURCE_COLORS[sourceType] ?? "border-gray-500/30 bg-gray-500/10 text-gray-400";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function CommuterPage() {
  const data = loadJson<{
    mediaResources: MediaResource[];
    queue: QueueItem[];
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

  const watchNow  = data.queue.filter((q) => q.kind !== "read_later");
  const readLater = data.queue.filter((q) => q.kind === "read_later");
  const pending   = data.queue.filter((q) => !q.completed).length;

  // Passive-friendly media for the reinforcement section
  const passiveMedia  = data.mediaResources.filter((m) => m.passiveFriendly);
  const activeMedia   = data.mediaResources.filter((m) => !m.passiveFriendly);

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
            Select a mode below, or pick a video/audio resource to watch while commuting
          </p>
        </div>
        <GhostButton href="/notebooklm">NotebookLM packs →</GhostButton>
      </div>

      {/* ── VIDEO / AUDIO REINFORCEMENT ─────────────────────── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🎧 Video / Audio Reinforcement</h2>
          <p className="text-xs text-gray-500">Watch or listen while commuting, walking, gym, cooking</p>
        </div>

        {/* Context legend */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["commute", "walking", "gym", "lunch", "dinner", "chores"].map((ctx) => (
            <ContextChip key={ctx} ctx={ctx} />
          ))}
        </div>

        {/* Passive / watchable resources */}
        <div className="space-y-3">
          {passiveMedia.map((m) => {
            const hasVideo =
              m.sourceType === "youtube_playlist" || m.sourceType === "youtube_video";
            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-xl border border-command-border bg-command-panel/40 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
              >
                {/* Top bar */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-command-border/50 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <SourceBadge sourceType={m.sourceType} />
                      <span className="rounded-full border border-gray-700 px-1.5 py-0.5 text-[9px] text-gray-600">
                        ~{m.estimatedMinutes}m
                      </span>
                    </div>
                    <p className="font-semibold text-white text-sm leading-snug">{m.title}</p>
                  </div>
                  {/* Primary action */}
                  <div className="shrink-0">
                    {hasVideo ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-cyan-400"
                      >
                        ▶ Watch ↗
                      </a>
                    ) : (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        Review / Listen →
                      </a>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 py-3 space-y-2.5">
                  {/* Context chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {m.recommendedContext.map((ctx) => (
                      <ContextChip key={ctx} ctx={ctx} />
                    ))}
                  </div>

                  {/* Active recall prompt */}
                  <p className="text-[11px] italic text-violet-400/80">
                    💬 {m.activeRecallPrompt}
                  </p>

                  {/* Secondary actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {m.relatedLesson && (
                      <a
                        href={`/lessons/${m.relatedLesson}`}
                        className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/8 px-2.5 py-1 text-[10px] font-medium text-cyan-400 transition hover:bg-cyan-500/15"
                      >
                        Open lesson →
                      </a>
                    )}
                    {m.resourceId && (
                      <a
                        href={`/resources/${m.resourceId}`}
                        className="inline-flex items-center rounded-lg border border-command-border px-2.5 py-1 text-[10px] font-medium text-gray-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
                      >
                        Resource details →
                      </a>
                    )}
                    <a
                      href="/notebooklm"
                      className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                    >
                      NotebookLM prompt →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active / non-passive resources (need screen) */}
        {activeMedia.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Requires screen · read during breaks</p>
            <div className="space-y-2">
              {activeMedia.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-command-border bg-command-panel/40 px-4 py-3 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
                >
                  <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
                    <SourceBadge sourceType={m.sourceType} />
                    {m.videoNeeded && (
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[9px] text-yellow-500">
                        video pending
                      </span>
                    )}
                    <p className="text-sm font-medium text-white">{m.title}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-command-border px-2.5 py-1 text-xs font-medium text-gray-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                    >
                      Open ↗
                    </a>
                    {m.resourceId && (
                      <a
                        href={`/resources/${m.resourceId}`}
                        className="inline-flex items-center rounded-lg border border-command-border px-2.5 py-1 text-xs font-medium text-gray-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        Details →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODE PICKER (client component) ─────────────────── */}
      <h2 className="mb-4 text-lg font-semibold">Choose a learning mode</h2>
      <CommuterModePicker
        modes={modesData.modes}
        queue={data.queue}
        resourceMap={resourceMap}
        recallQuestions={recallData.questions}
        notebooklmPacks={nlmData.packs}
        defaultMode="20min"
      />

      {/* ── WATCH NOW ──────────────────────────────────────── */}
      <h2 className="mb-2 mt-10 text-lg font-semibold">Full Queue — Watch / Listen</h2>
      <p className="mb-4 text-sm text-gray-500">
        All commuter-friendly items. Click titles to open externally. Action buttons link to lessons and resources.
      </p>
      <div className="mb-8 space-y-3">
        {watchNow.map((q) => {
          const r = resourceMap[q.resourceId];
          const lessonSlug = q.relatedLesson ?? getRelatedLessonSlug(q.resourceId);
          const itemUrl = q.url ?? (r && isSafeUrl(r.url) ? r.url : undefined);
          const isYouTube =
            q.sourceType === "youtube_playlist" || q.sourceType === "youtube_video" ||
            itemUrl?.includes("youtube.com");

          return (
            <div
              key={q.resourceId}
              className={`overflow-hidden rounded-xl border bg-command-panel/40 transition hover:bg-white/[0.03] ${
                q.completed
                  ? "border-gray-700/50 opacity-70"
                  : "border-command-border hover:border-cyan-500/20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-command-border/50 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {q.sourceType && <SourceBadge sourceType={q.sourceType} />}
                    {!q.sourceType && <SourceTypeBadge type="youtube_playlist" />}
                    <span className={q.completed ? "badge-ready text-[10px]" : "badge-monitor text-[10px]"}>
                      {q.completed ? "✓ done" : "pending"}
                    </span>
                    {q.videoNeeded && (
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-[9px] text-yellow-500">
                        video pending
                      </span>
                    )}
                    {q.estimatedMinutes && (
                      <span className="text-[9px] text-gray-600">~{q.estimatedMinutes}m</span>
                    )}
                  </div>
                  {itemUrl ? (
                    <a
                      href={itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white underline decoration-gray-700 underline-offset-2 transition hover:text-cyan-300 hover:decoration-cyan-500/50"
                    >
                      {q.title}
                    </a>
                  ) : (
                    <p className="font-semibold text-white">{q.title}</p>
                  )}
                </div>

                {/* Primary CTA */}
                {itemUrl && (
                  <div className="shrink-0">
                    {isYouTube ? (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
                      >
                        ▶ Watch ↗
                      </a>
                    ) : (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-4 py-3 space-y-2">
                {/* Mode tags */}
                {q.modeTags && q.modeTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {q.modeTags.map((t) => (
                      <ContextChip key={t} ctx={t} />
                    ))}
                  </div>
                )}

                {/* Active recall prompt */}
                {q.activeRecallPrompt && (
                  <p className="text-[11px] italic text-violet-400/70">
                    💬 {q.activeRecallPrompt}
                  </p>
                )}

                {/* Weakness tags */}
                {q.weaknessTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {q.weaknessTags.map((t) => (
                      <span key={t} className="badge-scaffold text-[10px]">
                        {t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}

                {/* Secondary actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {lessonSlug && (
                    <a
                      href={`/lessons/${lessonSlug}`}
                      className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/8 px-2.5 py-1 text-[10px] font-medium text-cyan-400 transition hover:bg-cyan-500/15"
                    >
                      Open lesson →
                    </a>
                  )}
                  {r && (
                    <a
                      href={`/resources/${q.resourceId}`}
                      className="inline-flex items-center rounded-lg border border-command-border px-2.5 py-1 text-[10px] font-medium text-gray-500 transition hover:border-cyan-500/30 hover:text-gray-300"
                    >
                      Resource details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── READ / WATCH LATER ──────────────────────────────── */}
      <h2 className="mb-2 mt-10 text-lg font-semibold">Read / Watch Later</h2>
      <p className="mb-4 text-sm text-gray-500">
        GitHub repos and reference material — optional, not blocking Month 1 anchors.
      </p>
      <div className="mb-8 space-y-3">
        {readLater.map((q) => {
          const r = resourceMap[q.resourceId];
          const lessonSlug = getRelatedLessonSlug(q.resourceId);
          const itemUrl = q.url ?? (r && isSafeUrl(r.url) ? r.url : undefined);
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
                    {q.weaknessTags.map((t) => (
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
                  <InternalLink
                    href={`/resources/${q.resourceId}`}
                    className="rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium no-underline text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    View details
                  </InternalLink>
                  {itemUrl && isSafeUrl(itemUrl) && (
                    <a
                      href={itemUrl}
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

      {/* ── PLAYLISTS ───────────────────────────────────────── */}
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
              <CtaButton href="/commuter">Start in Commuter →</CtaButton>
            </div>
            <div className="mt-4 space-y-2">
              {p.resourceIds.map((id) => {
                const r = resourceMap[id];
                const itemUrl = r && isSafeUrl(r.url) ? r.url : undefined;
                return r ? (
                  <div key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <InternalLink href={`/resources/${id}`}>{r.title}</InternalLink>
                    {itemUrl && (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 transition hover:text-cyan-400"
                      >
                        Open ↗
                      </a>
                    )}
                    {(r.source_type === "youtube_playlist" || r.source_type === "video_playlist") && itemUrl && (
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-red-400 transition hover:text-red-300"
                      >
                        ▶ Watch
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

      {/* ── SESSIONS ────────────────────────────────────────── */}
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
