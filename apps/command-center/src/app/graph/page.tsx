import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { ConceptGraph } from "@/components/graph/ConceptGraph";
import { loadJson } from "@/lib/data";

type GraphNode = {
  id: string;
  label: string;
  phase: string;
  tier: "foundations" | "applied" | "frontier";
  mastery: number;
  x: number;
  y: number;
};

type GraphEdge = {
  from: string;
  to: string;
  type: "prerequisite" | "reinforcement";
};

type ConceptGraphData = {
  meta: { lastUpdated: string; description: string };
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export default function GraphPage() {
  const graph = loadJson<ConceptGraphData>("concept_graph.json");

  const foundationsCount = graph.nodes.filter((n) => n.tier === "foundations").length;
  const appliedCount = graph.nodes.filter((n) => n.tier === "applied").length;
  const avgMastery = Math.round(
    graph.nodes.reduce((s, n) => s + n.mastery, 0) / graph.nodes.length
  );

  return (
    <div>
      <PageHeader
        title="Concept Graph"
        subtitle={`Prerequisite map — ${graph.meta.lastUpdated}`}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Concepts" value={graph.nodes.length} />
        <KpiCard label="Foundations" value={foundationsCount} />
        <KpiCard label="Applied" value={appliedCount} />
        <KpiCard label="Avg Mastery" value={`${avgMastery}%`} accent="text-cyan-400" />
      </div>

      <ConceptGraph nodes={graph.nodes} edges={graph.edges} />
    </div>
  );
}
