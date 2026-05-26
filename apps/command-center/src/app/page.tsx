import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { Balance702010, ProgressMeta } from "@/lib/types";
import { PageHeader, KpiCard, BalanceBar } from "@/components/ui/PageHeader";

export default function DashboardPage() {
  const progress = loadJson<{ meta: ProgressMeta; balance702010: Balance702010 }>("progress_metrics.json");
  const flywheel = loadJson<{ metrics: Record<string, number> }>("flywheel_metrics.json");
  const library = loadJson<{ librarySummary: { pdfCount: number; syncValid: boolean } }>("resources.json");
  const { meta, balance702010 } = progress;

  return (
    <div>
      <PageHeader
        title="Mission Control"
        subtitle="ToMorrowAILabs.ai AI Engineering Command Center — Month 1 foundations sprint"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Month 1 Progress" value={`${meta.percentComplete}%`} hint={`Week ${meta.currentWeek} of 6`} accent="text-cyan-400" />
        <KpiCard label="Lessons Complete" value={`${meta.lessonsCompleted}/${meta.lessonsTotal}`} hint={`Next: ${meta.nextRecommendedLesson}`} />
        <KpiCard label="Learning Streak" value={`${meta.streakDays}d`} hint={`Quiz avg: ${meta.averageQuizScore}%`} accent="text-emerald-400" />
        <KpiCard label="Library PDFs" value={library.librarySummary.pdfCount} hint={library.librarySummary.syncValid ? "Sync valid" : "Sync issues"} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <BalanceBar target={balance702010.target} actual={balance702010.actual} />
        <div className="glass-panel p-4">
          <p className="mb-2 text-sm font-medium">Flywheel Snapshot</p>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>Resources accepted: {flywheel.metrics.resourcesAccepted}</li>
            <li>NotebookLM packs: {flywheel.metrics.notebooklmPackGenerationCount}</li>
            <li>Remediation queue: {meta.activeRemediationQueueSize}</li>
            <li>Commuter completion: {meta.commuterReviewCompletionPct}%</li>
          </ul>
        </div>
      </div>

      {!balance702010.onTrack && balance702010.violations.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Balance violations: {balance702010.violations.join(", ")}
        </div>
      )}

      {balance702010.recommendations.length > 0 && (
        <div className="mb-6 glass-panel p-4">
          <p className="mb-2 text-sm font-medium text-command-accent">Recommendations</p>
          <ul className="list-inside list-disc text-sm text-gray-400">
            {balance702010.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/roadmap", label: "Roadmap" },
          { href: "/progress", label: "Progress" },
          { href: "/daily-brief", label: "Daily Brief" },
          { href: "/commuter", label: "Commuter Queue" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="glass-panel p-4 text-sm hover:border-cyan-500/40">
            → {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
