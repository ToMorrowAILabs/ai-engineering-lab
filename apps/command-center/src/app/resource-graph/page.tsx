import { loadJson } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ResourceGraphPage() {
  const graph = loadJson<{
    lessons: Record<string, { resources: string[]; week: number | null }>;
    edges: { from: string; to: string }[];
  }>("resource_graph.json");

  return (
    <div>
      <PageHeader title="Resource Graph" subtitle="Lesson → resource mappings and prerequisite edges" />

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(graph.lessons).map(([lesson, data]) => (
          <div key={lesson} className="glass-panel p-4">
            <p className="font-medium capitalize">{lesson.replace(/_/g, " ")}</p>
            {data.week && <p className="text-xs text-gray-500">Week {data.week}</p>}
            <div className="mt-2 flex flex-wrap gap-1">
              {data.resources.map((r) => (
                <span key={r} className="badge-monitor">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Prerequisite Edges</h2>
      <div className="space-y-2">
        {graph.edges.map((e, i) => (
          <div key={i} className="glass-panel px-4 py-2 text-sm">
            <span className="text-cyan-400">{e.from}</span>
            <span className="mx-2 text-gray-600">→</span>
            <span className="text-amber-400">{e.to}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
