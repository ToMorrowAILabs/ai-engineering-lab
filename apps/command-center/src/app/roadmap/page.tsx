import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { ExternalResourceLink, SourceTypeBadge } from "@/components/resources/ResourceBadges";

type RoadmapData = {
  weeks: { week: number; title: string; folder: string; status: string; tier: string; anchor?: boolean; completed?: boolean }[];
  tracks: { id: string; name: string; description: string }[];
  supportMaterials: Record<string, { focus: string; resourceIds: string[]; note: string }>;
  parkingLot: string[];
  outcomes: string[];
};

export default function RoadmapPage() {
  const roadmap = loadJson<RoadmapData>("roadmap.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));

  return (
    <div>
      <PageHeader title="Course Roadmap" subtitle="70% foundations · 20% applied · 10% frontier scan" />

      <div className="mb-8 glass-panel p-4">
        <p className="mb-2 text-sm font-medium">Month 1 Learning Outcomes</p>
        <ul className="list-inside list-disc text-sm text-gray-400">
          {roadmap.outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Week-by-Week</h2>
      <DataTable
        headers={["Week", "Focus", "Status", "Progress"]}
        rows={roadmap.weeks.map((w) => [
          `Week ${w.week}`,
          <>
            {w.title}
            {w.anchor && <span className="ml-2 badge-ready">anchor</span>}
          </>,
          <span className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}>{w.status}</span>,
          w.completed ? "✓" : "—",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Support Materials by Phase</h2>
      <p className="mb-4 text-sm text-gray-500">
        Optional references — core sequence stays week-by-week. Click any resource to open its source.
      </p>
      <div className="space-y-4">
        {Object.entries(roadmap.supportMaterials).map(([phase, block]) => (
          <div key={phase} className="glass-panel p-4">
            <div className="mb-2 flex flex-wrap items-baseline gap-2">
              <span className="badge-ready">{phase}</span>
              <span className="text-sm text-gray-400">{block.focus}</span>
            </div>
            <p className="mb-3 text-xs text-gray-500">{block.note}</p>
            <ul className="space-y-2">
              {block.resourceIds.map((id) => {
                const r = byId[id];
                if (!r) return null;
                return (
                  <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <SourceTypeBadge type={r.source_type} />
                    <ExternalResourceLink href={r.url}>{r.title}</ExternalResourceLink>
                    <span className="text-xs capitalize text-gray-500">{r.action.replace(/_/g, " ")}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Curriculum Tracks</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {roadmap.tracks.map((t) => (
          <div key={t.id} className="glass-panel p-4">
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-gray-400">{t.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Parking Lot</h2>
      <div className="flex flex-wrap gap-2">
        {roadmap.parkingLot.map((item) => (
          <span key={item} className="badge-frontier">{item}</span>
        ))}
      </div>
    </div>
  );
}
