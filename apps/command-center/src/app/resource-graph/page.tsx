import { loadJson } from "@/lib/data";
import type { Resource, ResourceCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalResourceLink, SourceTypeBadge } from "@/components/resources/ResourceBadges";

type GraphData = {
  categories: Record<ResourceCategory, { label: string; resourceIds: string[] }>;
  lessons: Record<string, { resources: string[]; week: number | null }>;
  edges: { from: string; to: string }[];
};

export default function ResourceGraphPage() {
  const graph = loadJson<GraphData>("resource_graph.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));

  return (
    <div>
      <PageHeader title="Resource Graph" subtitle="Grouped by category — every title links to its source" />

      <h2 className="mb-3 text-lg font-semibold">By Category</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(graph.categories).map(([key, group]) => (
          <div key={key} className="glass-panel p-4">
            <p className="mb-3 font-medium">{group.label ?? CATEGORY_LABELS[key as ResourceCategory]}</p>
            <ul className="space-y-2">
              {group.resourceIds.map((id) => {
                const r = byId[id];
                if (!r) return null;
                return (
                  <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <SourceTypeBadge type={r.source_type} />
                    <ExternalResourceLink href={r.url}>{r.title}</ExternalResourceLink>
                    <span className="text-xs text-gray-500">{r.learning_phase}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Lesson Mappings</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(graph.lessons).map(([lesson, data]) => (
          <div key={lesson} className="glass-panel p-4">
            <p className="font-medium capitalize">{lesson.replace(/_/g, " ")}</p>
            {data.week && <p className="text-xs text-gray-500">Week {data.week}</p>}
            <ul className="mt-2 space-y-1">
              {data.resources.map((id) => {
                const r = byId[id];
                return (
                  <li key={id} className="text-sm">
                    {r ? (
                      <ExternalResourceLink href={r.url}>{r.title}</ExternalResourceLink>
                    ) : (
                      <span className="text-gray-500">{id}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Prerequisite Edges</h2>
      <div className="space-y-2">
        {graph.edges.map((e, i) => (
          <div key={i} className="glass-panel px-4 py-2 text-sm">
            <span className="text-cyan-400">{e.from.replace(/_/g, " ")}</span>
            <span className="mx-2 text-gray-600">→</span>
            <span className="text-amber-400">{e.to.replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
