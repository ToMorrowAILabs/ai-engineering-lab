"use client";

import { useMemo, useState } from "react";
import type { LearningPhase, Resource, ResourceAction, ResourceCategory, ResourcePriority, SourceType } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { ActionBadge, ExternalResourceLink, PdfBadge, SourceTypeBadge } from "./ResourceBadges";

const PHASES: LearningPhase[] = ["Month 1", "Month 2", "Month 3", "Month 4+"];
const PRIORITIES: ResourcePriority[] = ["high", "medium", "low"];
const ACTIONS: ResourceAction[] = ["act_now", "monitor", "later"];
const SOURCE_TYPES: SourceType[] = [
  "github_repo",
  "youtube_playlist",
  "course",
  "paper",
  "book",
  "docs",
  "web_book",
  "video_playlist",
];

export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const [phase, setPhase] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [sourceType, setSourceType] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(resources.map((r) => r.category));
    return Array.from(set).sort();
  }, [resources]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (phase !== "all" && r.learning_phase !== phase) return false;
      if (category !== "all" && r.category !== category) return false;
      if (priority !== "all" && r.priority !== priority) return false;
      if (sourceType !== "all" && r.source_type !== sourceType) return false;
      if (action !== "all" && r.action !== action) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q) ||
          r.recommended_use.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resources, phase, category, priority, sourceType, action, query]);

  return (
    <div>
      <div className="mb-4 glass-panel p-4">
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <FilterSelect label="Phase" value={phase} onChange={setPhase} options={["all", ...PHASES]} />
          <FilterSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={["all", ...categories]}
            labels={CATEGORY_LABELS}
          />
          <FilterSelect label="Priority" value={priority} onChange={setPriority} options={["all", ...PRIORITIES]} />
          <FilterSelect label="Source type" value={sourceType} onChange={setSourceType} options={["all", ...SOURCE_TYPES]} />
          <FilterSelect label="Action" value={action} onChange={setAction} options={["all", ...ACTIONS]} />
          <div>
            <label className="mb-1 block text-xs text-gray-500">Search</label>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, notes…"
              className="w-full rounded-lg border border-command-border bg-command-bg px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Showing {filtered.length} of {resources.length} resources · click any title to open source
        </p>
      </div>

      <div className="glass-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-command-border text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-command-border/50 hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <SourceTypeBadge type={r.source_type} />
                    <ExternalResourceLink href={r.url}>{r.title}</ExternalResourceLink>
                    {r.pdfAvailable && <PdfBadge />}
                    {r.commute_friendly && (
                      <span className="badge-monitor text-[10px]">commute</span>
                    )}
                    {r.project_candidate && (
                      <span className="badge-ready text-[10px]">project</span>
                    )}
                  </div>
                  <p className="mt-1 max-w-xl text-xs text-gray-500">{r.recommended_use}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-400">{r.learning_phase}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="badge-monitor">{CATEGORY_LABELS[r.category] ?? r.category}</span>
                </td>
                <td className="px-4 py-3 capitalize">{r.priority}</td>
                <td className="px-4 py-3">
                  <ActionBadge action={r.action} />
                </td>
                <td className="px-4 py-3 font-mono text-cyan-400">{r.relevance_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-500">No resources match filters.</p>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-command-border bg-[#0a0e17] px-2 py-1.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "All" : labels?.[o] ?? o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
