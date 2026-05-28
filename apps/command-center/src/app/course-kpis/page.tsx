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
        <KpiCard label="Lessons completed" value={meta.lessonsCompleted} hint={`${meta.lessonsRemaining} remaining`} href="/progress" />
        <KpiCard label="Avg quiz score" value={`${meta.averageQuizScore}%`} accent="text-emerald-400" href="/course-kpis" />
        <KpiCard label="Exercise rate" value={`${exerciseRate}%`} href="/progress" />
        <KpiCard label="Avg lesson time" value={`${meta.averageLessonDurationMinutes}m`} href="/progress" />
        <KpiCard label="Reinforcement %" value={`${meta.reinforcementCompletionPct}%`} href="/commuter" />
        <KpiCard label="Commuter %" value={`${meta.commuterReviewCompletionPct}%`} href="/commuter" />
        <KpiCard label="Consistency" value={`${meta.monthlyConsistencyScore}%`} accent="text-amber-400" href="/progress" />
        <KpiCard label="Remediation queue" value={meta.activeRemediationQueueSize} href="/weakness-remediation" />
      </div>

      <div className="mb-6">
        <BalanceBar target={balance702010.target} actual={balance702010.actual} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Quiz Scores</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {quizzes.scores.map((q) => {
          const passed = q.score >= 70;
          return (
            <Link
              key={q.lessonId}
              href={`/lessons/${lessonIdToSlug(q.lessonId)}`}
              className="glass-card flex flex-col p-5 group"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gray-500">
                  {q.lessonId.replace(/-/g, " ")}
                </span>
                <span className={passed ? "badge-ready text-[10px]" : "badge-scaffold text-[10px]"}>
                  {passed ? "passed" : "needs review"}
                </span>
              </div>
              <p className={`text-3xl font-bold ${passed ? "text-emerald-400" : "text-amber-400"}`}>
                {q.score}%
              </p>
              <p className="mt-1 text-xs text-gray-600">{q.date}</p>
              <p className="mt-3 text-xs font-medium text-cyan-400/60 transition group-hover:text-cyan-400">
                Open lesson →
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-cyan-500/25 bg-gradient-to-r from-[#0d1525] to-command-bg p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-400">Next recommended</p>
        {meta.nextRecommendedLesson ? (
          <>
            <p className="text-lg font-semibold text-white">
              {meta.nextRecommendedLesson.replace(/-/g, " ")}
            </p>
            <p className="mt-1 text-xs text-gray-500">Est. completion: {meta.estimatedCompletionDate}</p>
            <div className="mt-3">
              <Link
                href={`/lessons/${lessonIdToSlug(meta.nextRecommendedLesson)}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
              >
                Open lesson →
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No recommendation available — check progress data.</p>
        )}
      </div>
    </div>
  );
}
