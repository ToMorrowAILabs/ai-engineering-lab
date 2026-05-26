import { loadJson } from "@/lib/data";
import type { ProgressMeta } from "@/lib/types";
import { PageHeader, KpiCard, BalanceBar } from "@/components/ui/PageHeader";

export default function CourseKpisPage() {
  const progress = loadJson<{ meta: ProgressMeta; balance702010: { target: { foundations: number; applied: number; frontier: number }; actual: { foundations: number; applied: number; frontier: number } } }>("progress_metrics.json");
  const quizzes = loadJson<{ scores: { lessonId: string; score: number; date: string }[] }>("quiz_scores.json");
  const exercises = loadJson<{ runs: { lessonId: string; success: boolean }[] }>("exercise_runs.json");
  const { meta, balance702010 } = progress;

  const exerciseRate = exercises.runs.length
    ? Math.round((exercises.runs.filter((r) => r.success).length / exercises.runs.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader title="Course KPIs" subtitle="Learning performance dashboard" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Lessons completed" value={meta.lessonsCompleted} hint={`${meta.lessonsRemaining} remaining`} />
        <KpiCard label="Avg quiz score" value={`${meta.averageQuizScore}%`} accent="text-emerald-400" />
        <KpiCard label="Exercise rate" value={`${exerciseRate}%`} />
        <KpiCard label="Avg lesson time" value={`${meta.averageLessonDurationMinutes}m`} />
        <KpiCard label="Reinforcement %" value={`${meta.reinforcementCompletionPct}%`} />
        <KpiCard label="Commuter %" value={`${meta.commuterReviewCompletionPct}%`} />
        <KpiCard label="Consistency" value={`${meta.monthlyConsistencyScore}%`} accent="text-amber-400" />
        <KpiCard label="Remediation queue" value={meta.activeRemediationQueueSize} />
      </div>

      <div className="mb-6">
        <BalanceBar target={balance702010.target} actual={balance702010.actual} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Quiz Scores</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {quizzes.scores.map((q) => (
          <div key={q.lessonId} className="glass-panel p-4">
            <p className="text-xs text-gray-500">{q.lessonId}</p>
            <p className="text-2xl font-bold text-cyan-400">{q.score}%</p>
            <p className="text-xs text-gray-500">{q.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 glass-panel p-4">
        <p className="text-sm font-medium">Next recommended</p>
        <p className="text-lg text-command-accent">{meta.nextRecommendedLesson}</p>
        <p className="mt-2 text-xs text-gray-500">Est. completion: {meta.estimatedCompletionDate}</p>
      </div>
    </div>
  );
}
