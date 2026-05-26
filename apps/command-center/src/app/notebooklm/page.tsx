import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function NotebookLMPage() {
  const data = loadJson<{
    packs: { id: string; title: string; lessons: string[]; priority: string; repoPath: string; manualOnly: boolean }[];
    exportManifest: { enabled: boolean; note: string };
  }>("notebooklm_packs.json");

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
          <li>Copy source text from repo path (course repo)</li>
          <li>Generate Audio Overview</li>
          <li>Complete matching commuter review questions</li>
        </ol>
      </div>

      <DataTable
        headers={["Pack", "Lessons", "Priority", "Repo path"]}
        rows={data.packs.map((p) => [
          p.title,
          p.lessons.join(", "),
          <span className={p.priority === "high" ? "badge-ready" : "badge-monitor"}>{p.priority}</span>,
          <code className="text-xs text-gray-400">{p.repoPath}</code>,
        ])}
      />

      <p className="mt-6 text-xs text-gray-500">{data.exportManifest.note}</p>
    </div>
  );
}
