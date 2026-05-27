import Link from "next/link";
import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { InternalLink } from "@/components/navigation/NavLinks";
import { lessonIdToSlug } from "@/lib/catalog";

export default async function WeaknessRemediationPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const queue = loadJson<{
    queue: { id: string; weaknessTag: string; resourceId: string; lesson: string; priority: string; status: string; assignedAt: string }[];
  }>("weakness_remediation_queue.json");
  const progress = loadJson<{ meta: { weakTopics: string[] } }>("progress_metrics.json");

  const displayQueue = topic
    ? queue.queue.filter((r) => r.weaknessTag === topic)
    : queue.queue;

  return (
    <div>
      <PageHeader title="Weakness Remediation" subtitle="Targeted reinforcement from quiz and self-assessment gaps" />

      <div className="mb-6 glass-panel p-4">
        <p className="mb-2 text-sm font-medium">Detected weak topics — click to filter</p>
        <div className="flex flex-wrap gap-2">
          {progress.meta.weakTopics.map((t) => (
            <Link
              key={t}
              href={topic === t ? "/weakness-remediation" : `/weakness-remediation?topic=${encodeURIComponent(t)}`}
              className={`badge transition ${topic === t ? "badge-ready" : "badge-scaffold"}`}
            >
              {t}
            </Link>
          ))}
          {topic && (
            <Link href="/weakness-remediation" className="badge badge-ignore text-xs">
              clear filter
            </Link>
          )}
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">
        Active Remediation Queue
        {topic && <span className="ml-2 text-sm font-normal text-gray-400">— filtered: {topic}</span>}
      </h2>
      <DataTable
        headers={["Weakness", "Resource", "Lesson", "Priority", "Status", "Assigned"]}
        rows={displayQueue.map((r) => [
          r.weaknessTag,
          <InternalLink href={`/resources/${r.resourceId}`}>{r.resourceId}</InternalLink>,
          <InternalLink href={`/lessons/${lessonIdToSlug(r.lesson)}`}>{r.lesson}</InternalLink>,
          r.priority,
          r.status,
          r.assignedAt,
        ])}
      />
      {displayQueue.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No remediation items for this topic.</p>
      )}

      <div className="mt-8 glass-panel p-4 text-sm text-gray-400">
        <p className="font-medium text-white">Remediation loop</p>
        <p className="mt-2">1. Detect weakness → 2. Lookup resource → 3. Commute or desk review → 4. Redo exercise → 5. Re-quiz</p>
        <InternalLink href="/commuter" className="mt-3 inline-block text-sm">→ Commuter queue</InternalLink>
      </div>
    </div>
  );
}
