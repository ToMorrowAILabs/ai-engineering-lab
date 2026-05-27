import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ResourceExplorer } from "@/components/resources/ResourceExplorer";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { isSafeUrl } from "@/lib/catalog";

export default function ResourcesPage() {
  const data = loadJson<{
    resources: Resource[];
    librarySummary: { pdfCount: number; syncValid: boolean; lastSync: string; calibreStaged: number };
    sourceRegistry: { id: string; name: string; url: string; type: string }[];
  }>("resources.json");
  const resourceIds = new Set(data.resources.map((r) => r.id));

  return (
    <div>
      <PageHeader title="Resources" subtitle="Click titles for detail · Open for external source in new tab" />

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

      <ResourceExplorer resources={data.resources.filter((r) => isSafeUrl(r.url))} />

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
            {data.sourceRegistry.filter((s) => isSafeUrl(s.url)).map((s) => (
              <tr key={s.id} className="border-b border-command-border/50 hover:bg-white/5">
                <td className="px-4 py-3">
                  {resourceIds.has(s.id) ? (
                    <InternalLink href={`/resources/${s.id}`}>{s.name}</InternalLink>
                  ) : (
                    <ExternalLink href={s.url}>{s.name}</ExternalLink>
                  )}
                </td>
                <td className="px-4 py-3">
                  <SourceTypeBadge type={s.type as Resource["source_type"]} />
                </td>
                <td className="px-4 py-3">
                  <ExternalLink href={s.url} className="text-xs">
                    Open source
                  </ExternalLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
