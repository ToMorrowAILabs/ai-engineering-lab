import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { Balance702010, ProgressMeta } from "@/lib/types";
import { KpiCard, BalanceBar, ProgressBar } from "@/components/ui/PageHeader";
import { CtaButton, GhostButton, WarnButton } from "@/components/ui/Buttons";
import { getLessonBySlug, lessonIdToSlug } from "@/lib/catalog";

export default function DashboardPage() {
  const progress = loadJson<{ meta: ProgressMeta; balance702010: Balance702010 }>("progress_metrics.json");
  const flywheel = loadJson<{ metrics: Record<string, number> }>("flywheel_metrics.json");
  const library = loadJson<{ librarySummary: { pdfCount: number; syncValid: boolean } }>("resources.json");
  const brief = loadJson<{ headline: string; date: string }>("daily_brief.json");
  const commuter = loadJson<{
    queue: { resourceId: string; title: string; completed: boolean; kind?: string }[];
  }>("commuter_queue.json");
  const { meta, balance702010 } = progress;

  // Resolve the active lesson from nextRecommendedLesson
  const currentLessonSlug = meta.nextRecommendedLesson ? lessonIdToSlug(meta.nextRecommendedLesson) : null;
  const currentLesson = currentLessonSlug ? getLessonBySlug(currentLessonSlug) : null;

  // First incomplete commuter item (not a "read later" repo)
  const commuterItem = commuter.queue.find((q) => !q.completed && q.kind !== "read_later") ?? null;
  const commuterPending = commuter.queue.filter((q) => !q.completed).length;

  // First weak topic
  const weakTopic = meta.weakTopics[0] ?? null;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
        <p className="mt-1 text-sm text-gray-400">
          ToMorrowAILabs.ai · AI Engineering Command Center · Month 1 foundations sprint
        </p>
      </div>

      {/* ── TODAY'S MISSION ─────────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-xl border border-cyan-500/25 bg-gradient-to-br from-[#0d1525] to-command-bg">
        {/* Mission header bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/15 bg-cyan-500/5 px-6 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">⚡ Today&apos;s Mission</p>
          <p className="text-xs text-gray-500">{brief.date}</p>
        </div>

        <div className="p-6">
          {/* Current lesson */}
          {currentLesson ? (
            <div className="mb-5">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Current Lesson</span>
                <span
                  className={
                    currentLesson.completed ? "badge-ready text-[10px]" : "badge-monitor text-[10px]"
                  }
                >
                  {currentLesson.completed ? "✓ complete" : "in progress"}
                </span>
                {currentLesson.anchor && <span className="badge-ready text-[10px]">anchor</span>}
              </div>
              <p className="text-xl font-bold text-white">
                Week {currentLesson.week}: {currentLesson.title}
              </p>
              <p className="mt-1 text-sm text-gray-400">{currentLesson.objective}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <CtaButton href={`/lessons/${currentLesson.slug}`}>
                  {currentLesson.completed ? "Review lesson" : "Continue lesson"} →
                </CtaButton>
                <GhostButton href="/progress">All weeks</GhostButton>
                {!currentLesson.quiz.completed && (
                  <GhostButton href={`/lessons/${currentLesson.slug}`}>Quiz pending</GhostButton>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-gray-400">No active lesson found. Check your progress data.</p>
              <GhostButton href="/progress" className="mt-2">View progress →</GhostButton>
            </div>
          )}

          <div className="my-5 border-t border-white/5" />

          {/* Two-col action row: weak topic + commuter */}
          <div className="grid gap-5 sm:grid-cols-2">
            {weakTopic && (
              <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">⚠ Weak Topic</p>
                <p className="font-semibold text-amber-300">{weakTopic.replace(/_/g, " ")}</p>
                <p className="mt-1 text-xs text-gray-500">Needs extra repetition before advancing</p>
                <div className="mt-3">
                  <WarnButton href={`/weakness-remediation?topic=${encodeURIComponent(weakTopic)}`}>
                    Remediate →
                  </WarnButton>
                </div>
              </div>
            )}

            {commuterItem && (
              <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">📱 Commuter Queue</p>
                <p className="line-clamp-1 font-semibold text-white">{commuterItem.title}</p>
                <p className="mt-1 text-xs text-gray-500">{commuterPending} items · passive reinforcement</p>
                <div className="mt-3">
                  <GhostButton href="/commuter">Start commute →</GhostButton>
                </div>
              </div>
            )}
          </div>

          <div className="my-5 border-t border-white/5" />

          {/* Daily brief headline */}
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">📡 Daily AI Brief</p>
            <p className="text-sm leading-relaxed text-gray-300">{brief.headline}</p>
            <div className="mt-3">
              <GhostButton href="/daily-brief">Read brief →</GhostButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRESS & METRICS ──────────────────────────────────── */}
      <div className="mb-6 glass-panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium">Month 1 Progress</p>
          <span className="text-sm font-mono text-cyan-400">{meta.percentComplete}%</span>
        </div>
        <ProgressBar value={meta.percentComplete} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Lessons</p>
            <p className="font-semibold text-white">{meta.lessonsCompleted}/{meta.lessonsTotal}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Streak</p>
            <p className="font-semibold text-emerald-400">{meta.streakDays}d</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Velocity</p>
            <p className="font-semibold text-white">{meta.learningVelocityLessonsPerWeek}/wk</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quiz avg</p>
            <p className="font-semibold text-cyan-400">{meta.averageQuizScore}%</p>
          </div>
        </div>
      </div>

      {/* ── BALANCE + FLYWHEEL ──────────────────────────────────── */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <BalanceBar target={balance702010.target} actual={balance702010.actual} />

        <div className="glass-panel p-4">
          <p className="mb-3 text-sm font-medium">Flywheel Snapshot</p>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/flywheel", label: "Resources accepted", value: flywheel.metrics.resourcesAccepted },
              { href: "/notebooklm", label: "NotebookLM packs", value: flywheel.metrics.notebooklmPackGenerationCount },
              { href: "/weakness-remediation", label: "Remediation queue", value: meta.activeRemediationQueueSize },
              { href: "/commuter", label: "Commuter completion", value: `${meta.commuterReviewCompletionPct}%` },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between">
                <Link href={row.href} className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 hover:text-cyan-300">
                  {row.label}
                </Link>
                <span className="font-mono text-gray-300">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── VIOLATIONS / RECOMMENDATIONS ────────────────────────── */}
      {!balance702010.onTrack && balance702010.violations.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <span className="font-semibold">⚠ Balance violations:</span> {balance702010.violations.join(", ")}
        </div>
      )}
      {balance702010.recommendations.length > 0 && (
        <div className="mb-6 glass-panel p-4">
          <p className="mb-2 text-sm font-medium text-command-accent">Recommendations</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
            {balance702010.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── NAVIGATION GRID ─────────────────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Navigate</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/roadmap", label: "Roadmap", sub: "Week-by-week plan", accent: true },
          { href: "/progress", label: "Progress", sub: `${meta.lessonsCompleted}/${meta.lessonsTotal} lessons done`, accent: false },
          { href: "/daily-brief", label: "Daily Brief", sub: "Today's AI signals", accent: false },
          { href: "/commuter", label: "Commuter", sub: `${commuterPending} items queued`, accent: false },
          { href: "/resources", label: "Resources", sub: `${library.librarySummary.pdfCount} PDFs in library`, accent: false },
          { href: "/flywheel", label: "Flywheel", sub: "Curriculum evolution", accent: false },
          { href: "/course-kpis", label: "Course KPIs", sub: "Quiz + exercise metrics", accent: false },
          { href: "/trend-signals", label: "Trend Signals", sub: "10% frontier scan", accent: false },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`glass-panel block p-4 transition hover:bg-white/5 ${
              item.accent ? "border-cyan-500/30 hover:border-cyan-500/50" : "hover:border-command-border"
            }`}
          >
            <p className="font-semibold text-white">{item.label}</p>
            <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
            <p className="mt-2 text-xs text-cyan-400/70">Open →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
