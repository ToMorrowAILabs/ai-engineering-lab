import Link from "next/link";
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
        {/* Total resources — click to scroll to explorer (stays on same page) */}
        <div className="glass-card flex flex-col gap-1 p-4 group">
          <span className="text-xs uppercase tracking-wide text-gray-500">Resources</span>
          <span className="text-2xl font-bold text-white">{data.resources.length}</span>
          <span className="text-[10px] text-gray-600 transition group-hover:text-cyan-400">
            Use filters below ↓
          </span>
        </div>
        {/* PDFs → filter to books */}
        <Link
          href="/resources"
          className="glass-card flex flex-col gap-1 p-4 group"
          aria-label="Filter resources by PDF availability"
        >
          <span className="text-xs uppercase tracking-wide text-gray-500">Open PDFs</span>
          <span className="text-2xl font-bold text-white">{data.librarySummary.pdfCount}</span>
          <span className="text-[10px] text-cyan-400/50 transition group-hover:text-cyan-400">
            Browse library →
          </span>
        </Link>
        {/* Calibre staged → link to flywheel */}
        <Link
          href="/flywheel"
          className="glass-card flex flex-col gap-1 p-4 group"
          aria-label="View Calibre staged items in flywheel"
        >
          <span className="text-xs uppercase tracking-wide text-gray-500">Calibre staged</span>
          <span className="text-2xl font-bold text-white">{data.librarySummary.calibreStaged}</span>
          <span className="text-[10px] text-cyan-400/50 transition group-hover:text-cyan-400">
            View flywheel →
          </span>
        </Link>
      </div>

      <ResourceExplorer resources={data.resources.filter((r) => isSafeUrl(r.url))} />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Source Registry</h2>
      <p className="mb-4 text-sm text-gray-500">
        All sources tracked in the curriculum. Blue titles → internal detail page; grey titles → external source only.
      </p>
      <div className="space-y-2">
        {data.sourceRegistry.filter((s) => isSafeUrl(s.url)).map((s) => (
          <div
            key={s.id}
            className="glass-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
          >
            <SourceTypeBadge type={s.type as Resource["source_type"]} />
            <div className="flex-1 min-w-0">
              {resourceIds.has(s.id) ? (
                <InternalLink href={`/resources/${s.id}`}>{s.name}</InternalLink>
              ) : (
                <span className="text-gray-300">{s.name}</span>
              )}
            </div>
            {resourceIds.has(s.id) && (
              <InternalLink
                href={`/resources/${s.id}`}
                className="rounded border border-command-border px-2.5 py-1 text-[10px] font-medium no-underline text-gray-500 transition hover:border-cyan-500/40 hover:text-cyan-400"
              >
                Details →
              </InternalLink>
            )}
            <ExternalLink href={s.url} className="text-xs">
              Open source
            </ExternalLink>
          </div>
        ))}
      </div>
    </div>
  );
}
