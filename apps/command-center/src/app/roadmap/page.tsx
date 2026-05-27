import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { CtaButton, GhostButton } from "@/components/ui/Buttons";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { getAllLessons, isSafeUrl } from "@/lib/catalog";

type RoadmapData = {
  weeks: {
    week: number;
    title: string;
    folder: string;
    status: string;
    tier: string;
    anchor?: boolean;
    completed?: boolean;
  }[];
  tracks: { id: string; name: string; description: string }[];
  supportMaterials: Record<string, { focus: string; resourceIds: string[]; note: string }>;
  parkingLot: string[];
  parkingLotDetails?: Record<string, { reason: string; revisitAfter: string }>;
  outcomes: string[];
};

export default function RoadmapPage() {
  const roadmap = loadJson<RoadmapData>("roadmap.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));
  const lessons = getAllLessons();

  return (
    <div>
      <PageHeader title="Course Roadmap" subtitle="70% foundations · 20% applied · 10% frontier scan" />

      {/* Learning outcomes */}
      <div className="mb-8 glass-panel p-5">
        <p className="mb-3 text-sm font-semibold text-command-accent">Month 1 Learning Outcomes</p>
        <ul className="space-y-1.5 text-sm text-gray-400">
          {roadmap.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2">
              <span className="mt-0.5 text-cyan-500">›</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      {/* ── WEEK-BY-WEEK CARDS ───────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Week-by-Week</h2>
      <p className="mb-4 text-sm text-gray-500">Click any row or the button to open that week&apos;s lesson.</p>
      <div className="mb-10 space-y-3">
        {roadmap.weeks.map((w) => {
          const lesson = lessons.find((l) => l.week === w.week);
          const exercisesDone = lesson?.exercises.filter((e) => e.completed).length ?? 0;
          const exercisesTotal = lesson?.exercises.length ?? 0;

          return (
            <div
              key={w.week}
              className="glass-panel flex flex-col gap-4 p-5 transition hover:border-cyan-500/20 hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left: meta + title */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-500">Week {w.week}</span>
                  <span
                    className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}
                  >
                    {w.status}
                  </span>
                  {w.anchor && <span className="badge-ready text-[10px]">anchor</span>}
                  {w.completed && (
                    <span className="badge-ready text-[10px]">✓ complete</span>
                  )}
                </div>

                {lesson ? (
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="block font-semibold text-white hover:text-cyan-300 transition"
                  >
                    {w.title}
                  </Link>
                ) : (
                  <p className="font-semibold text-gray-400">{w.title}</p>
                )}

                {lesson && (
                  <p className="mt-1 text-xs text-gray-500">
                    {exercisesDone}/{exercisesTotal} exercises
                    {" · "}
                    quiz {lesson.quiz.completed ? `✓ ${lesson.quiz.score}%` : "○ pending"}
                    {lesson.commuterResourceIds.length > 0 &&
                      ` · ${lesson.commuterResourceIds.length} commuter items`}
                  </p>
                )}
              </div>

              {/* Right: CTA button */}
              <div className="shrink-0">
                {lesson ? (
                  <CtaButton href={`/lessons/${lesson.slug}`}>
                    {w.completed ? "Review" : "Open lesson"} →
                  </CtaButton>
                ) : (
                  <span className="inline-flex items-center rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-600">
                    Scaffold
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SUPPORT MATERIALS ───────────────────────────────────── */}
      <h2 className="mb-2 text-lg font-semibold">Support Materials by Phase</h2>
      <p className="mb-4 text-sm text-gray-500">
        Optional references — the core sequence is the week-by-week cards above.
      </p>
      <div className="mb-10 space-y-4">
        {Object.entries(roadmap.supportMaterials).map(([phase, block]) => (
          <div key={phase} className="glass-panel p-5">
            <div className="mb-2 flex flex-wrap items-baseline gap-2">
              <span className="badge-ready">{phase}</span>
              <span className="text-sm font-medium text-gray-300">{block.focus}</span>
            </div>
            <p className="mb-4 text-xs text-gray-500">{block.note}</p>
            <ul className="space-y-2">
              {block.resourceIds.map((id) => {
                const r = byId[id];
                if (!r || !isSafeUrl(r.url)) return null;
                return (
                  <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <SourceTypeBadge type={r.source_type} />
                    <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                    <ExternalLink href={r.url} className="text-xs">
                      Open ↗
                    </ExternalLink>
                    <span className="text-xs capitalize text-gray-600">
                      {r.action.replace(/_/g, " ")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── CURRICULUM TRACKS ───────────────────────────────────── */}
      <h2 className="mb-2 text-lg font-semibold">Curriculum Tracks</h2>
      <p className="mb-4 text-sm text-gray-500">Each track maps to a resource category — click to browse.</p>
      <div className="mb-10 grid gap-3 md:grid-cols-2">
        {roadmap.tracks.map((t) => (
          <Link
            key={t.id}
            href="/resources"
            className="glass-panel flex items-center justify-between p-5 transition hover:border-cyan-500/30 hover:bg-white/5 group"
          >
            <div>
              <p className="font-semibold text-white">{t.name}</p>
              <p className="mt-1 text-sm text-gray-400">{t.description}</p>
            </div>
            <span className="ml-4 shrink-0 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 transition group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10">
              Browse →
            </span>
          </Link>
        ))}
      </div>

      {/* ── PARKING LOT ─────────────────────────────────────────── */}
      <h2 className="mb-2 text-lg font-semibold">Parking Lot</h2>
      <p className="mb-4 text-sm text-gray-500">
        Intentionally deferred — these topics would derail Month 1 foundations. Expand any card to see why.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roadmap.parkingLot.map((item) => {
          const detail = roadmap.parkingLotDetails?.[item];
          return (
            <details
              key={item}
              className="group overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/5 transition open:border-violet-500/40"
            >
              <summary className="flex cursor-pointer select-none items-center justify-between p-4 text-sm font-semibold text-violet-300 hover:text-violet-200">
                <span>{item}</span>
                <span className="ml-2 shrink-0 rounded border border-violet-500/30 px-2 py-0.5 text-[10px] font-medium text-violet-400 group-open:opacity-0">
                  Why parked?
                </span>
              </summary>
              {detail && (
                <div className="border-t border-violet-500/15 bg-violet-500/5 px-4 pb-4 pt-3">
                  <p className="text-sm text-gray-300">{detail.reason}</p>
                  <p className="mt-2 inline-flex items-center gap-1 rounded bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300">
                    Revisit after: {detail.revisitAfter}
                  </p>
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
