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
  const inv = loadJson<{
    syncedPdfCount: number;
    calibreBookCount: number;
    pendingImportCount: number;
    lastScanned: string;
    publicNote?: string;
    categories: { label: string; count: number; description?: string; titles?: string[] }[];
    highlights: string[];
  }>("library_inventory.json");
  const resourceIds = new Set(data.resources.map((r) => r.id));

  return (
    <div>
      <PageHeader title="Resources" subtitle="Click titles for detail · Open for external source in new tab" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {/* Total course resources */}
        <div className="glass-card flex flex-col gap-1 p-4 group">
          <span className="text-xs uppercase tracking-wide text-gray-500">Course Resources</span>
          <span className="text-2xl font-bold text-white">{data.resources.length}</span>
          <span className="text-[10px] text-gray-600 transition group-hover:text-cyan-400">
            Use filters below ↓
          </span>
        </div>
        {/* Synced PDFs — shows real count from library scan */}
        <Link
          href="/resources"
          className="glass-card flex flex-col gap-1 p-4 group"
          aria-label={`${inv.syncedPdfCount} PDFs synced from local library`}
        >
          <span className="text-xs uppercase tracking-wide text-gray-500">Synced PDFs</span>
          <span className="text-2xl font-bold text-white">{inv.syncedPdfCount}</span>
          <span className="text-[10px] text-cyan-400/50 transition group-hover:text-cyan-400">
            {inv.calibreBookCount} in Calibre · {inv.pendingImportCount} pending →
          </span>
        </Link>
        {/* Calibre staged → flywheel */}
        <Link
          href="/flywheel"
          className="glass-card flex flex-col gap-1 p-4 group"
          aria-label="View Calibre import queue in flywheel"
        >
          <span className="text-xs uppercase tracking-wide text-gray-500">Calibre staged</span>
          <span className="text-2xl font-bold text-white">{inv.pendingImportCount}</span>
          <span className="text-[10px] text-cyan-400/50 transition group-hover:text-cyan-400">
            View flywheel →
          </span>
        </Link>
      </div>

      {/* Library snapshot — no local paths exposed */}
      <div className="mb-6 glass-panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Library Inventory</p>
          <span className="text-xs text-gray-600">Scanned {inv.lastScanned}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {inv.categories.map((cat) => (
            <div key={cat.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">{cat.label}</span>
                <span className="font-mono text-sm font-bold text-cyan-400">{cat.count}</span>
              </div>
              {cat.description && (
                <p className="text-xs text-gray-600">{cat.description}</p>
              )}
              {cat.titles && cat.titles.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {cat.titles.slice(0, 3).map((t) => (
                    <li key={t} className="text-[10px] text-gray-600 before:mr-1.5 before:content-['›']">
                      {t}
                    </li>
                  ))}
                  {cat.titles.length > 3 && (
                    <li className="text-[10px] text-gray-700">
                      +{cat.titles.length - 3} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-gray-700">{inv.publicNote ?? "Local paths hidden for privacy."}</p>
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
