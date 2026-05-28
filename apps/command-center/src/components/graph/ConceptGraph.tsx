"use client";

import { useState } from "react";

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

type Props = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const TIER_COLORS = {
  foundations: { fill: "#0f3460", stroke: "#22d3ee", text: "#a5f3fc" },
  applied:     { fill: "#1a2c40", stroke: "#818cf8", text: "#c7d2fe" },
  frontier:    { fill: "#2a1a3f", stroke: "#a78bfa", text: "#ddd6fe" },
};

const MASTERY_BAR_COLOR = (m: number) =>
  m >= 70 ? "#22d3ee" : m >= 40 ? "#818cf8" : m >= 15 ? "#fb923c" : "#374151";

function masteryArc(mastery: number, r: number): string {
  if (mastery <= 0) return "";
  if (mastery >= 100) {
    return `M ${r} 0 A ${r} ${r} 0 1 1 ${r - 0.001} 0 Z`;
  }
  const angle = (mastery / 100) * 2 * Math.PI - Math.PI / 2;
  const x = r + r * Math.cos(angle);
  const y = r + r * Math.sin(angle);
  const large = mastery > 50 ? 1 : 0;
  return `M ${r} 0 A ${r} ${r} 0 ${large} 1 ${x} ${y} L ${r} ${r} Z`;
}

export function ConceptGraph({ nodes, edges }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "foundations" | "applied" | "frontier">("all");

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visibleNodes = filter === "all" ? nodes : nodes.filter((n) => n.tier === filter);
  const visibleIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to));

  const hoveredNode = hovered ? nodeMap.get(hovered) : null;

  // SVG viewport
  const W = 820;
  const H = 960;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "foundations", "applied", "frontier"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition capitalize ${
              filter === f
                ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                : "border-command-border text-gray-500 hover:border-cyan-500/30 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-gray-600">
          {visibleNodes.length} nodes · {visibleEdges.length} edges
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-6 border-t border-cyan-500/60" /> prerequisite
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-6 border-t border-dashed border-purple-400/60" /> reinforcement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-cyan-500/40 border border-cyan-400" /> foundations
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-indigo-500/40 border border-indigo-400" /> applied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-violet-500/40 border border-violet-400" /> frontier
        </span>
      </div>

      {/* SVG graph */}
      <div className="rounded-xl border border-command-border bg-[#05090f] overflow-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 480, maxWidth: "100%", display: "block" }}
        >
          <defs>
            <marker id="arrow-prereq" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" opacity="0.5" />
            </marker>
            <marker id="arrow-reinf" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#a78bfa" opacity="0.5" />
            </marker>
          </defs>

          {/* Edges */}
          {visibleEdges.map((e, i) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            const isPrereq = e.type === "prerequisite";
            const isHighlighted =
              hovered === e.from || hovered === e.to;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isPrereq ? "#22d3ee" : "#a78bfa"}
                strokeWidth={isHighlighted ? 1.5 : 0.8}
                strokeOpacity={isHighlighted ? 0.7 : 0.2}
                strokeDasharray={isPrereq ? undefined : "4 3"}
                markerEnd={isPrereq ? "url(#arrow-prereq)" : "url(#arrow-reinf)"}
              />
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((n) => {
            const colors = TIER_COLORS[n.tier];
            const isHov = hovered === n.id;
            const r = n.mastery >= 60 ? 28 : n.mastery >= 30 ? 24 : 20;
            const mastery = n.mastery;

            return (
              <g
                key={n.id}
                transform={`translate(${n.x - r}, ${n.y - r})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Background circle */}
                <circle
                  cx={r}
                  cy={r}
                  r={r}
                  fill={colors.fill}
                  stroke={isHov ? colors.stroke : colors.stroke}
                  strokeWidth={isHov ? 2 : 1}
                  strokeOpacity={isHov ? 1 : 0.5}
                  opacity={0.95}
                />
                {/* Mastery arc */}
                {mastery > 0 && (
                  <path
                    d={masteryArc(mastery, r)}
                    transform={`translate(0, 0)`}
                    fill={MASTERY_BAR_COLOR(mastery)}
                    opacity={0.35}
                  />
                )}
                {/* Border ring */}
                <circle
                  cx={r}
                  cy={r}
                  r={r}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth={isHov ? 2 : 1}
                  strokeOpacity={isHov ? 1 : 0.4}
                />
                {/* Mastery % text */}
                <text
                  x={r}
                  y={r + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={r >= 28 ? 10 : 8}
                  fill={colors.text}
                  fontWeight="bold"
                  opacity={0.9}
                >
                  {mastery}%
                </text>
                {/* Label below */}
                <text
                  x={r}
                  y={r * 2 + 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill={isHov ? "#ffffff" : "#9ca3af"}
                  fontWeight={isHov ? "600" : "400"}
                >
                  {n.label.length > 14 ? n.label.slice(0, 13) + "…" : n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered node detail */}
      {hoveredNode && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{hoveredNode.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {hoveredNode.phase} · {hoveredNode.tier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tabular-nums" style={{ color: MASTERY_BAR_COLOR(hoveredNode.mastery) }}>
                {hoveredNode.mastery}%
              </p>
              <p className="text-[10px] text-gray-600">mastery</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {edges
              .filter((e) => e.to === hoveredNode.id)
              .map((e) => {
                const from = nodeMap.get(e.from);
                return from ? (
                  <span
                    key={e.from}
                    className="rounded-full border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-400"
                  >
                    ← {from.label}
                  </span>
                ) : null;
              })}
            {edges
              .filter((e) => e.from === hoveredNode.id)
              .map((e) => {
                const to = nodeMap.get(e.to);
                return to ? (
                  <span
                    key={e.to}
                    className="rounded-full border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400"
                  >
                    → {to.label}
                  </span>
                ) : null;
              })}
          </div>
        </div>
      )}

      {/* Mastery breakdown table */}
      <div className="rounded-xl border border-command-border overflow-hidden">
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 border-b border-command-border bg-command-panel/40">
          Mastery by Concept
        </div>
        <div className="divide-y divide-command-border/50">
          {[...visibleNodes]
            .sort((a, b) => b.mastery - a.mastery)
            .map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition"
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-32 shrink-0 text-xs text-gray-400 truncate">{n.label}</div>
                <div className="flex-1">
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${n.mastery}%`,
                        backgroundColor: MASTERY_BAR_COLOR(n.mastery),
                      }}
                    />
                  </div>
                </div>
                <div className="w-10 text-right text-xs font-mono text-gray-500">{n.mastery}%</div>
                <div className="w-14 text-right">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                      n.tier === "foundations"
                        ? "bg-cyan-500/10 text-cyan-400"
                        : n.tier === "applied"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-violet-500/10 text-violet-400"
                    }`}
                  >
                    {n.phase.replace("Month ", "M")}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
