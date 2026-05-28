import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { InternalLink } from "@/components/navigation/NavLinks";
import { getAllLessons, getAllResources } from "@/lib/catalog";

export default function NotebookLMPage() {
  const data = loadJson<{
    packs: { id: string; title: string; lessons: string[]; priority: string; repoPath: string; manualOnly: boolean }[];
    exportManifest: { enabled: boolean; note: string };
  }>("notebooklm_packs.json");
  const allLessons = getAllLessons();
  const resourceIds = new Set(getAllResources().map((r) => r.id));

  function resolvePackLink(id: string) {
    const weekMatch = id.match(/week-0?(\d+)/i);
    if (weekMatch) {
      const lesson = allLessons.find((l) => l.week === parseInt(weekMatch[1], 10));
      if (lesson) return { href: `/lessons/${lesson.slug}`, label: "Lesson page" };
    }
    if (resourceIds.has(id)) return { href: `/resources/${id}`, label: "Resource" };
    return null;
  }

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
          const link = resolvePackLink(p.id);
          return [
            link ? (
              <InternalLink href={link.href}>{p.title}</InternalLink>
            ) : (
              <span className="text-gray-300">{p.title}</span>
            ),
            p.lessons.join(", "),
            <span className={p.priority === "high" ? "badge-ready" : "badge-monitor"}>{p.priority}</span>,
            <code className="text-xs text-gray-400">{p.repoPath}</code>,
            link ? (
              <InternalLink href={link.href} className="text-xs">
                {link.label}
              </InternalLink>
            ) : (
              <span className="text-xs text-gray-500">—</span>
            ),
          ];
        })}
      />

      <p className="mt-6 text-xs text-gray-500">{data.exportManifest.note}</p>
    </div>
  );
}
