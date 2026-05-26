import Link from "next/link";
import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function WeaknessRemediationPage() {
  const queue = loadJson<{
    queue: { id: string; weaknessTag: string; resourceId: string; lesson: string; priority: string; status: string; assignedAt: string }[];
  }>("weakness_remediation_queue.json");
  const progress = loadJson<{ meta: { weakTopics: string[] } }>("progress_metrics.json");

  return (
    <div>
      <PageHeader title="Weakness Remediation" subtitle="Targeted reinforcement from quiz and self-assessment gaps" />

      <div className="mb-6 glass-panel p-4">
        <p className="mb-2 text-sm font-medium">Detected weak topics</p>
        <div className="flex flex-wrap gap-2">
          {progress.meta.weakTopics.map((t) => (
            <span key={t} className="badge-scaffold">{t}</span>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Active Remediation Queue</h2>
      <DataTable
        headers={["Weakness", "Resource", "Lesson", "Priority", "Status", "Assigned"]}
        rows={queue.queue.map((r) => [
          r.weaknessTag,
          r.resourceId,
          r.lesson,
          r.priority,
          r.status,
          r.assignedAt,
        ])}
      />

      <div className="mt-8 glass-panel p-4 text-sm text-gray-400">
        <p className="font-medium text-white">Remediation loop</p>
        <p className="mt-2">1. Detect weakness → 2. Lookup resource → 3. Commute or desk review → 4. Redo exercise → 5. Re-quiz</p>
        <Link href="/commuter" className="mt-3 inline-block text-cyan-400 hover:underline">→ Commuter queue</Link>
      </div>
    </div>
  );
}
