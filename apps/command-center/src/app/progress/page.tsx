import { loadJson } from "@/lib/data";
import type { ProgressMeta } from "@/lib/types";
import { PageHeader, KpiCard, DataTable } from "@/components/ui/PageHeader";

export default function ProgressPage() {
  const progress = loadJson<{ meta: ProgressMeta }>("progress_metrics.json");
  const roadmap = loadJson<{ weeks: { week: number; title: string; status: string; completed?: boolean }[] }>("roadmap.json");
  const events = loadJson<{ events: { type: string; lessonId?: string; timestamp: string }[] }>("lesson_events.json");
  const { meta } = progress;

  return (
    <div>
      <PageHeader title="Progress" subtitle={`Month ${meta.currentMonth} · Week ${meta.currentWeek}`} />

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
      <DataTable
        headers={["Week", "Title", "Status", "Done"]}
        rows={roadmap.weeks.map((w) => [
          w.week,
          w.title,
          <span className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}>{w.status}</span>,
          w.completed ? "✓" : "○",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Recent Events</h2>
      <DataTable
        headers={["Type", "Lesson", "When"]}
        rows={events.events.slice(-8).reverse().map((e) => [
          e.type.replace(/_/g, " "),
          e.lessonId ?? "—",
          new Date(e.timestamp).toLocaleDateString(),
        ])}
      />
    </div>
  );
}
