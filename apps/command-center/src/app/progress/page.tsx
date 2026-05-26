import { loadJson } from "@/lib/data";
import type { ProgressMeta } from "@/lib/types";
import { PageHeader, KpiCard, DataTable } from "@/components/ui/PageHeader";
import { getAllLessons, lessonIdToSlug } from "@/lib/catalog";
import { WeekChecklistCard } from "@/components/progress/WeekChecklist";
import { InternalLink } from "@/components/navigation/NavLinks";

export default function ProgressPage() {
  const progress = loadJson<{ meta: ProgressMeta }>("progress_metrics.json");
  const events = loadJson<{ events: { type: string; lessonId?: string; timestamp: string }[] }>("lesson_events.json");
  const lessons = getAllLessons();
  const { meta } = progress;

  return (
    <div>
      <PageHeader title="Progress" subtitle={`Month ${meta.currentMonth} · Week ${meta.currentWeek}`} />

      {meta.nextRecommendedLesson && (
        <div className="mb-6 glass-panel p-4">
          <p className="text-sm text-gray-400">Next recommended lesson</p>
          <InternalLink href={`/lessons/${lessonIdToSlug(meta.nextRecommendedLesson)}`} className="text-lg">
            {meta.nextRecommendedLesson.replace(/-/g, " ")}
          </InternalLink>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Completion" value={`${meta.percentComplete}%`} />
        <KpiCard label="Est. finish" value={meta.estimatedCompletionDate} />
        <KpiCard label="Velocity" value={`${meta.learningVelocityLessonsPerWeek}/wk`} />
        <KpiCard label="Consistency" value={`${meta.monthlyConsistencyScore}%`} accent="text-amber-400" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="glass-panel p-4">
          <p className="mb-2 font-medium text-emerald-400">Strong topics</p>
          <div className="flex flex-wrap gap-2">
            {meta.strongTopics.map((t) => (
              <span key={t} className="badge-ready">{t}</span>
            ))}
          </div>
        </div>
        <div className="glass-panel p-4">
          <p className="mb-2 font-medium text-amber-400">Weak topics</p>
          <div className="flex flex-wrap gap-2">
            {meta.weakTopics.map((t) => (
              <span key={t} className="badge-scaffold">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Week Checklist</h2>
      <p className="mb-4 text-sm text-gray-500">Click any week for lesson detail, resources, exercises, and commuter links.</p>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <WeekChecklistCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold">Week Summary Table</h2>
      <DataTable
        headers={["Week", "Title", "Status", "Done", "Link"]}
        rows={lessons.map((w) => [
          w.week,
          <InternalLink href={`/lessons/${w.slug}`}>{w.title}</InternalLink>,
          <span className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}>{w.status}</span>,
          w.completed ? "✓" : "○",
          <InternalLink href={`/lessons/${w.slug}`} className="text-xs">View lesson</InternalLink>,
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Recent Events</h2>
      <DataTable
        headers={["Type", "Lesson", "When"]}
        rows={events.events.slice(-8).reverse().map((e) => [
          e.type.replace(/_/g, " "),
          e.lessonId ? (
            <InternalLink href={`/lessons/${lessonIdToSlug(e.lessonId)}`}>
              {e.lessonId}
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
