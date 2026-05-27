import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { ProgressMeta } from "@/lib/types";
import { KpiCard, DataTable, ProgressBar } from "@/components/ui/PageHeader";
import { CtaButton, GhostButton, WarnButton } from "@/components/ui/Buttons";
import { getAllLessons, getLessonBySlug, lessonIdToSlug } from "@/lib/catalog";
import { WeekChecklistCard } from "@/components/progress/WeekChecklist";
import { InternalLink } from "@/components/navigation/NavLinks";

export default function ProgressPage() {
  const progress = loadJson<{ meta: ProgressMeta }>("progress_metrics.json");
  const events = loadJson<{ events: { type: string; lessonId?: string; timestamp: string }[] }>(
    "lesson_events.json"
  );
  const lessons = getAllLessons();
  const { meta } = progress;

  // Resolve active lesson
  const currentLessonSlug = meta.nextRecommendedLesson ? lessonIdToSlug(meta.nextRecommendedLesson) : null;
  const currentLesson = currentLessonSlug ? getLessonBySlug(currentLessonSlug) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-gray-400">
          Month {meta.currentMonth} · Week {meta.currentWeek} · Est. completion {meta.estimatedCompletionDate}
        </p>
      </div>

      {/* ── CONTINUE CTA ─────────────────────────────────────────── */}
      {currentLesson && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-cyan-500/25 bg-gradient-to-r from-[#0d1525] to-command-bg p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-400">Continue here</p>
            <p className="font-semibold text-white">
              Week {currentLesson.week}: {currentLesson.title}
            </p>
            <p className="mt-0.5 text-sm text-gray-400 line-clamp-1">{currentLesson.objective}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <CtaButton href={`/lessons/${currentLesson.slug}`}>
              {currentLesson.completed ? "Review" : "Open lesson"} →
            </CtaButton>
            {!currentLesson.quiz.completed && (
              <GhostButton href={`/lessons/${currentLesson.slug}`}>Quiz pending</GhostButton>
            )}
          </div>
        </div>
      )}

      {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
      <div className="mb-6 glass-panel p-5">
        <ProgressBar value={meta.percentComplete} label="Month 1 completion" />
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Lessons</p>
            <p className="font-semibold">{meta.lessonsCompleted} / {meta.lessonsTotal}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Velocity</p>
            <p className="font-semibold">{meta.learningVelocityLessonsPerWeek} / wk</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Streak</p>
            <p className="font-semibold text-emerald-400">{meta.streakDays} days</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Consistency</p>
            <p className={`font-semibold ${meta.monthlyConsistencyScore >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
              {meta.monthlyConsistencyScore}%
            </p>
          </div>
        </div>
      </div>

      {/* ── TOPIC PILLS ──────────────────────────────────────────── */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {/* Strong topics */}
        <div className="glass-panel p-5">
          <p className="mb-1 font-semibold text-emerald-400">✓ Strong Topics</p>
          <p className="mb-3 text-xs text-gray-500">Solid foundations — keep applying these</p>
          <div className="flex flex-wrap gap-2">
            {meta.strongTopics.map((t) => (
              <span key={t} className="badge-ready cursor-default">
                {t.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Weak topics — each is a clickable remediation link */}
        <div className="glass-panel p-5">
          <p className="mb-1 font-semibold text-amber-400">⚠ Weak Topics</p>
          <p className="mb-3 text-xs text-gray-500">Click a topic to open targeted remediation</p>
          <div className="flex flex-wrap gap-2">
            {meta.weakTopics.map((t) => (
              <WarnButton
                key={t}
                href={`/weakness-remediation?topic=${encodeURIComponent(t)}`}
              >
                {t.replace(/_/g, " ")} →
              </WarnButton>
            ))}
          </div>
          <div className="mt-3 border-t border-command-border pt-3">
            <Link href="/weakness-remediation" className="text-xs text-gray-500 hover:text-white transition">
              View all remediation items →
            </Link>
          </div>
        </div>
      </div>

      {/* ── WEEK CHECKLIST ───────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Week Checklist</h2>
        <GhostButton href="/roadmap">Full roadmap</GhostButton>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Click any card to open that week&apos;s lesson, resources, exercises, and commuter links.
      </p>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <WeekChecklistCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>

      {/* ── RECENT EVENTS ────────────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Recent Events</h2>
      <DataTable
        headers={["Type", "Lesson", "When"]}
        rows={events.events
          .slice(-8)
          .reverse()
          .map((e) => [
            <span key={e.timestamp} className="capitalize text-gray-300">
              {e.type.replace(/_/g, " ")}
            </span>,
            e.lessonId ? (
              <InternalLink href={`/lessons/${lessonIdToSlug(e.lessonId)}`}>
                {e.lessonId.replace(/-/g, " ")}
              </InternalLink>
            ) : (
              "—"
            ),
            new Date(e.timestamp).toLocaleDateString(),
          ])}
      />
    </div>
  );
}
