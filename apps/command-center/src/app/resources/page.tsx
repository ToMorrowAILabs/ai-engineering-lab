import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function ResourcesPage() {
  const data = loadJson<{
    resources: Resource[];
    librarySummary: { pdfCount: number; syncValid: boolean; lastSync: string; calibreStaged: number };
    sourceRegistry: { id: string; name: string; url: string; type: string }[];
  }>("resources.json");

  return (
    <div>
      <PageHeader title="Resources" subtitle="Curated sources — link only, no paywall bypass" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="kpi-card">
          <span className="text-xs text-gray-500">Resources</span>
          <span className="text-2xl font-bold">{data.resources.length}</span>
        </div>
        <div className="kpi-card">
          <span className="text-xs text-gray-500">Open PDFs</span>
          <span className="text-2xl font-bold">{data.librarySummary.pdfCount}</span>
        </div>
        <div className="kpi-card">
          <span className="text-xs text-gray-500">Calibre staged</span>
          <span className="text-2xl font-bold">{data.librarySummary.calibreStaged}</span>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Math & ML Resources</h2>
      <DataTable
        headers={["Title", "Tier", "Priority", "Type", "Link"]}
        rows={data.resources.map((r) => [
          <>
            {r.title}
            {r.pdfAvailable && <span className="ml-2 text-xs text-cyan-400">PDF</span>}
          </>,
          <span className={r.curriculum_tier === "frontier_scan" ? "badge-frontier" : "badge-ready"}>{r.curriculum_tier}</span>,
          r.reinforcement_priority,
          r.source_type,
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Open</a>,
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Source Registry</h2>
      <DataTable
        headers={["Source", "Type", "URL"]}
        rows={data.sourceRegistry.map((s) => [
          s.name,
          s.type,
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate max-w-xs block">Link</a>,
        ])}
      />
    </div>
  );
}
