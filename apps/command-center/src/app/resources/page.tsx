import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ResourceExplorer } from "@/components/resources/ResourceExplorer";
import { ExternalResourceLink, SourceTypeBadge } from "@/components/resources/ResourceBadges";

export default function ResourcesPage() {
  const data = loadJson<{
    resources: Resource[];
    librarySummary: { pdfCount: number; syncValid: boolean; lastSync: string; calibreStaged: number };
    sourceRegistry: { id: string; name: string; url: string; type: string }[];
  }>("resources.json");

  return (
    <div>
      <PageHeader title="Resources" subtitle="Curated sources — click titles to open originals in a new tab" />

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

      <ResourceExplorer resources={data.resources} />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Source Registry</h2>
      <div className="glass-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-command-border text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.sourceRegistry.map((s) => (
              <tr key={s.id} className="border-b border-command-border/50 hover:bg-white/5">
                <td className="px-4 py-3">
                  <ExternalResourceLink href={s.url}>{s.name}</ExternalResourceLink>
                </td>
                <td className="px-4 py-3">
                  <SourceTypeBadge type={s.type as Resource["source_type"]} />
                </td>
                <td className="px-4 py-3">
                  <ExternalResourceLink href={s.url} className="text-xs">
                    Open source
                  </ExternalResourceLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
