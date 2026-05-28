"use client";

import { useState } from "react";

type FrontierSignal = {
  id: string;
  date: string;
  source: string;
  person_or_lab: string;
  title: string;
  summary: string;
  url: string;
  topic: string;
  related_course_phase: string | null;
  related_lesson: string | null;
  relevance_score: number;
  urgency: string;
  classification: "act_now" | "monitor" | "parked" | "ignore";
  reason: string;
  commuter_ready: boolean;
  suggested_commuter_mode: string | null;
  reading_time_minutes: number | null;
  watch_time_minutes: number | null;
  action: string;
  related_resources: string[];
};

type Tab = "all" | "act_now" | "monitor" | "parked";

const CLASSIFICATION_STYLES: Record<string, string> = {
  act_now: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  monitor: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  parked:  "border-amber-500/40 bg-amber-500/10 text-amber-400",
  ignore:  "border-gray-700 bg-gray-800/60 text-gray-500",
};

const SCORE_COLOR = (score: number) => {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-amber-400";
  return "text-gray-500";
};

const MODE_ICONS: Record<string, string> = {
  commute:  "🚇",
  walking:  "🚶",
  gym:      "💪",
  lunch:    "☀️",
  dinner:   "🌙",
  chores:   "🧹",
  passive:  "🎧",
};

const URGENCY_LABELS: Record<string, string> = {
  this_week:     "This week",
  this_month:    "This month",
  next_month:    "Next month",
  when_available:"When available",
  later:         "Later",
  ignore:        "Ignore",
};

function ScoreMeter({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color =
    score >= 70 ? "bg-emerald-500" :
    score >= 40 ? "bg-yellow-500" :
    score >= 20 ? "bg-amber-500" : "bg-gray-600";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-mono font-semibold ${SCORE_COLOR(score)}`}>{score}</span>
    </div>
  );
}

export function FrontierSignalBrowser({ signals }: { signals: FrontierSignal[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [commuterOnly, setCommuterOnly] = useState(false);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all",      label: "All",       count: signals.filter(s => s.classification !== "ignore").length },
    { key: "act_now",  label: "Act Now",   count: signals.filter(s => s.classification === "act_now").length },
    { key: "monitor",  label: "Monitor",   count: signals.filter(s => s.classification === "monitor").length },
    { key: "parked",   label: "Parked",    count: signals.filter(s => s.classification === "parked").length },
  ];

  const visible = signals.filter((s) => {
    if (activeTab !== "all" && s.classification !== activeTab) return false;
    if (activeTab === "all" && s.classification === "ignore") return false;
    if (commuterOnly && !s.commuter_ready) return false;
    return true;
  });

  return (
    <div>
      {/* Tab bar + commuter toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === t.key
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-command-panel/40 text-gray-400 border border-command-border hover:border-cyan-500/20 hover:text-gray-300"
              }`}
            >
              {t.label}
              <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px]">{t.count}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setCommuterOnly(!commuterOnly)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            commuterOnly
              ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
              : "border-command-border bg-command-panel/40 text-gray-400 hover:border-cyan-500/20"
          }`}
        >
          🎧 Commuter only
        </button>
      </div>

      {/* Signal cards */}
      {visible.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-600">No signals match the current filter.</p>
      )}

      <div className="space-y-3">
        {visible.map((s) => (
          <div
            key={s.id}
            className="overflow-hidden rounded-xl border border-command-border bg-command-panel/40 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-command-border/50 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white leading-snug text-sm">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-600">
                  {s.person_or_lab} · {s.date}
                  {s.related_course_phase && (
                    <span className="ml-2 text-gray-700">{s.related_course_phase}</span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${CLASSIFICATION_STYLES[s.classification]}`}
                >
                  {s.classification.replace(/_/g, " ")}
                </span>
                <ScoreMeter score={s.relevance_score} />
              </div>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-2">
              <p className="text-xs text-gray-400 leading-relaxed">{s.summary}</p>

              {/* Reason callout */}
              <p className="text-[11px] text-gray-600 italic leading-relaxed">{s.reason}</p>

              {/* Action */}
              {s.action && (
                <div className="rounded-lg border border-command-border/50 bg-white/[0.02] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-0.5">Action</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{s.action}</p>
                </div>
              )}

              {/* Footer row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {s.commuter_ready && s.suggested_commuter_mode && (
                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/8 px-2 py-0.5 text-[9px] text-cyan-400">
                    {MODE_ICONS[s.suggested_commuter_mode] ?? "🎧"} {s.suggested_commuter_mode}
                  </span>
                )}
                {s.urgency && s.urgency !== "ignore" && (
                  <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[9px] text-gray-600">
                    {URGENCY_LABELS[s.urgency] ?? s.urgency}
                  </span>
                )}
                {s.reading_time_minutes && (
                  <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[9px] text-gray-600">
                    ~{s.reading_time_minutes}m read
                  </span>
                )}
                {s.watch_time_minutes && (
                  <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[9px] text-gray-600">
                    ~{s.watch_time_minutes}m watch
                  </span>
                )}
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center rounded-lg border border-command-border px-2.5 py-1 text-[10px] font-medium text-gray-400 transition hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    Open ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
