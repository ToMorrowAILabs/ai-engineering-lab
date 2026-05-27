"use client";

import { useState } from "react";
import Link from "next/link";

type RecallQuestion = {
  id: string;
  lessonId: string;
  topic: string;
  question: string;
  hint: string;
  difficulty: string;
};

const diffColor = (d: string) =>
  d === "easy"
    ? "text-emerald-400"
    : d === "medium"
    ? "text-amber-400"
    : "text-red-400";

export function RecallQuestionsBlock({
  questions,
}: {
  questions: RecallQuestion[];
}) {
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  if (questions.length === 0) return null;

  const toggleHint = (id: string) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-6 glass-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Active Recall</h2>
        <span className="text-xs text-gray-500">Answer first — then check hint</span>
      </div>
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            {/* Question row */}
            <div className="flex items-start justify-between gap-3">
              <p className="flex-1 text-sm font-medium text-white">{q.question}</p>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase ${diffColor(q.difficulty)}`}
                >
                  {q.difficulty}
                </span>
                <span className="badge-scaffold text-[10px]">
                  {q.topic.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Buttons row */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => toggleHint(q.id)}
                className="rounded border border-gray-700 px-2.5 py-1 text-[10px] font-medium text-gray-400 transition hover:border-gray-500 hover:text-white"
              >
                {expandedHints.has(q.id) ? "Hide hint" : "Show hint"}
              </button>
              <button
                onClick={() => toggleReveal(q.id)}
                className="rounded border border-cyan-800/50 px-2.5 py-1 text-[10px] font-medium text-cyan-500/70 transition hover:border-cyan-600 hover:text-cyan-300"
              >
                {revealed.has(q.id) ? "Hide answer" : "Reveal answer"}
              </button>
            </div>

            {/* Hint */}
            {expandedHints.has(q.id) && (
              <p className="mt-2 rounded bg-white/5 px-3 py-2 text-xs italic text-gray-400">
                💡 {q.hint}
              </p>
            )}

            {/* Revealed answer = full hint (stub — future: separate answer field) */}
            {revealed.has(q.id) && !expandedHints.has(q.id) && (
              <p className="mt-2 rounded bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300/80">
                ✓ {q.hint}
              </p>
            )}

            {/* Link to commuter page for more practice */}
            <p className="mt-2 text-[10px] text-gray-600">
              More practice →{" "}
              <Link href="/commuter" className="text-cyan-500/60 hover:text-cyan-400">
                Commuter recall
              </Link>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
