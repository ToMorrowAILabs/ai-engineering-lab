import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { InternalLink } from "@/components/navigation/NavLinks";
import { getAllLessons } from "@/lib/catalog";

export default function NotebookLMPage() {
  const data = loadJson<{
    packs: { id: string; title: string; lessons: string[]; priority: string; repoPath: string; manualOnly: boolean }[];
    exportManifest: { enabled: boolean; note: string };
  }>("notebooklm_packs.json");
  const allLessons = getAllLessons();

  return (
    <div>
      <PageHeader
        title="NotebookLM Packs"
        subtitle="Paste source packs manually at notebooklm.google.com — no login automation"
      />

      <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-gray-300">
        <p className="font-medium text-command-accent">Manual workflow</p>
        <ol className="mt-2 list-inside list-decimal text-gray-400">
          <li>Open NotebookLM and sign in manually</li>
          <li>Create a notebook per pack below</li>
          <li>Copy source text from course repo path (relative path only)</li>
          <li>Generate Audio Overview</li>
          <li>
            Complete matching{" "}
            <InternalLink href="/commuter">commuter review</InternalLink> questions
          </li>
        </ol>
      </div>

      <DataTable
        headers={["Pack", "Lessons", "Priority", "Course path", "Detail"]}
        rows={data.packs.map((p) => {
          const weekLesson = allLessons.find((l) => p.id.startsWith("week-04") && l.week === 4);
          return [
            p.id.startsWith("week-") && weekLesson ? (
              <InternalLink href={`/lessons/${weekLesson.slug}`}>{p.title}</InternalLink>
            ) : (
              <InternalLink href={`/resources/${p.id}`}>{p.title}</InternalLink>
            ),
            p.lessons.join(", "),
            <span className={p.priority === "high" ? "badge-ready" : "badge-monitor"}>{p.priority}</span>,
            <code className="text-xs text-gray-400">{p.repoPath}</code>,
            p.id.startsWith("week-") && weekLesson ? (
              <InternalLink href={`/lessons/${weekLesson.slug}`} className="text-xs">
                Lesson page
              </InternalLink>
            ) : (
              <InternalLink href={`/resources/${p.id}`} className="text-xs">
                Resource
              </InternalLink>
            ),
          ];
        })}
      />

      <p className="mt-6 text-xs text-gray-500">{data.exportManifest.note}</p>
    </div>
  );
}
