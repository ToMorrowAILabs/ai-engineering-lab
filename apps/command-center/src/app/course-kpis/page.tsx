import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { ProgressMeta } from "@/lib/types";
import { PageHeader, KpiCard, BalanceBar } from "@/components/ui/PageHeader";
import { InternalLink } from "@/components/navigation/NavLinks";
import { lessonIdToSlug } from "@/lib/catalog";

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
          <Link
            key={q.lessonId}
            href={`/lessons/${lessonIdToSlug(q.lessonId)}`}
            className="glass-panel block p-4 transition hover:border-cyan-500/30 hover:bg-white/5"
          >
            <p className="text-xs text-gray-500">{q.lessonId}</p>
            <p className="text-2xl font-bold text-cyan-400">{q.score}%</p>
            <p className="text-xs text-gray-500">{q.date}</p>
            <p className="mt-2 text-xs text-cyan-400/70">View lesson →</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 glass-panel p-4">
        <p className="text-sm font-medium">Next recommended</p>
        {meta.nextRecommendedLesson ? (
          <InternalLink
            href={`/lessons/${lessonIdToSlug(meta.nextRecommendedLesson)}`}
            className="mt-1 block text-lg"
          >
            {meta.nextRecommendedLesson.replace(/-/g, " ")}
          </InternalLink>
        ) : (
          <p className="text-lg text-command-accent">—</p>
        )}
        <p className="mt-2 text-xs text-gray-500">Est. completion: {meta.estimatedCompletionDate}</p>
      </div>
    </div>
  );
}
