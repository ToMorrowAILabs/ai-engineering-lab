"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resource } from "@/lib/types";

type CommuterMode = {
  id: string;
  label: string;
  icon: string;
  description: string;
  maxItems: number;
  resourceIds: string[];
  reviewPrompts: string[];
  notebooklmPackId?: string;
};

type QueueItem = {
  resourceId: string;
  title: string;
  url?: string;
  commuteFriendly: boolean;
  priority: string;
  reviewQuestions: number;
  weaknessTags: string[];
  completed: boolean;
  kind?: string;
};

type RecallQuestion = {
  id: string;
  lessonId: string;
  topic: string;
  question: string;
  hint: string;
  difficulty: string;
};

type NotebookPack = {
  id: string;
  title: string;
  repoPath: string;
  priority: string;
};

type Props = {
  modes: CommuterMode[];
  queue: QueueItem[];
  resourceMap: Record<string, Resource>;
  recallQuestions: RecallQuestion[];
  notebooklmPacks: NotebookPack[];
  defaultMode: string;
};

export function CommuterModePicker({
  modes,
  queue,
  resourceMap,
  recallQuestions,
  notebooklmPacks,
  defaultMode,
}: Props) {
  const [selectedId, setSelectedId] = useState(defaultMode);
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());

  const mode = modes.find((m) => m.id === selectedId) ?? modes[0];
  if (!mode) return null;

  // Filter queue items for this mode
  const modeItems = mode.resourceIds
    .slice(0, mode.maxItems)
    .map((id) => queue.find((q) => q.resourceId === id))
    .filter((q): q is QueueItem => Boolean(q));

  // Recall questions for the topics covered by this mode's items
  const modeTopics = new Set(modeItems.flatMap((q) => q.weaknessTags));
  const modeRecall = recallQuestions
    .filter((q) => modeTopics.has(q.topic))
    .slice(0, 4);

  // NotebookLM pack for this mode
  const nlmPack = mode.notebooklmPackId
    ? notebooklmPacks.find((p) => p.id === mode.notebooklmPackId)
    : null;

  const toggleHint = (id: string) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const diffColor = (d: string) =>
    d === "easy" ? "text-emerald-400" : d === "medium" ? "text-amber-400" : "text-red-400";

  return (
    <div>
      {/* ── MODE TABS ─────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              m.id === selectedId
                ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                : "border-command-border text-gray-400 hover:border-cyan-500/30 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* ── MODE DESCRIPTION ────────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border border-cyan-500/15 bg-cyan-500/5 px-5 py-4">
        <p className="font-semibold text-white">
          {mode.icon} {mode.label} mode
        </p>
        <p className="mt-1 text-sm text-gray-400">{mode.description}</p>
      </div>

      {/* ── QUEUE ITEMS ─────────────────────────────────────────────── */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Resources for this session
      </h3>
      <div className="mb-6 space-y-4">
        {modeItems.length === 0 ? (
          <p className="text-sm text-gray-500">No resources mapped to this mode yet.</p>
        ) : (
          modeItems.map((item) => {
            const resource = resourceMap[item.resourceId];
            const isSafe = (url?: string) => {
              if (!url) return false;
              if (url.startsWith("/Volumes/") || url.startsWith("/Users/")) return false;
              try {
                const p = new URL(url);
                return p.protocol === "https:" || p.protocol === "http:";
              } catch {
                return false;
              }
            };
            return (
              <div
                key={item.resourceId}
                className="glass-panel space-y-3 p-5"
              >
                {/* Resource header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`badge ${item.priority === "high" ? "badge-ready" : "badge-monitor"}`}
                      >
                        {item.priority}
                      </span>
                      {item.commuteFriendly && (
                        <span className="badge-monitor text-[10px]">commute ✓</span>
                      )}
                    </div>
                    <p className="font-semibold text-white">{item.title}</p>
                    {item.weaknessTags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.weaknessTags.map((t) => (
                          <span key={t} className="badge-scaffold text-[10px]">
                            {t.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Action buttons */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/resources/${item.resourceId}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                    >
                      Detail
                    </Link>
                    {resource && isSafe(resource.url) && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-cyan-400"
                      >
                        Listen / Watch ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Mode-specific review prompts */}
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    💭 Think about this:
                  </p>
                  <ul className="space-y-2">
                    {mode.reviewPrompts.map((prompt, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-0.5 shrink-0 text-gray-600">{i + 1}.</span>
                        {prompt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── ACTIVE RECALL ────────────────────────────────────────────── */}
      {modeRecall.length > 0 && (
        <>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Active recall — answer without looking
          </h3>
          <div className="mb-6 space-y-3">
            {modeRecall.map((q) => (
              <div key={q.id} className="glass-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 text-sm font-medium text-white">{q.question}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${diffColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    <button
                      onClick={() => toggleHint(q.id)}
                      className="rounded border border-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:border-gray-500 hover:text-white transition"
                    >
                      {expandedHints.has(q.id) ? "hide hint" : "show hint"}
                    </button>
                  </div>
                </div>
                {expandedHints.has(q.id) && (
                  <p className="mt-2 rounded bg-white/5 px-3 py-2 text-xs italic text-gray-400">
                    💡 {q.hint}
                  </p>
                )}
                <p className="mt-2 text-[10px] text-gray-600">
                  Lesson:{" "}
                  <Link
                    href={`/lessons/${q.lessonId}`}
                    className="text-cyan-500/70 hover:text-cyan-400"
                  >
                    {q.lessonId}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── NOTEBOOKLM PROMPT ─────────────────────────────────────────── */}
      {nlmPack && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-400">
            📓 NotebookLM Source Pack
          </p>
          <p className="font-semibold text-white">{nlmPack.title}</p>
          <p className="mt-1 font-mono text-xs text-gray-500">{nlmPack.repoPath}</p>
          <p className="mt-3 text-sm text-gray-400">
            Open NotebookLM manually, create a notebook for this pack, paste the source
            path, and generate the Audio Overview for commute listening.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/notebooklm"
              className="inline-flex items-center gap-1 rounded-lg border border-violet-500/40 px-3 py-1.5 text-xs font-medium text-violet-400 transition hover:border-violet-500/60 hover:bg-violet-500/10"
            >
              View all packs →
            </Link>
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-gray-500 hover:text-white"
            >
              Open NotebookLM ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
