"use client";

import { useRef, useState } from "react";

type TutorMode = "explain" | "quiz" | "exercise" | "summary" | "ask";

const MODES: { id: TutorMode; label: string; icon: string; hint: string }[] = [
  { id: "explain", label: "Explain", icon: "💡", hint: "Deep explanation with code example" },
  { id: "quiz",    label: "Quiz",    icon: "❓", hint: "4-question multiple choice" },
  { id: "exercise",label: "Exercise",icon: "⌨️", hint: "Hands-on Python coding exercise" },
  { id: "summary", label: "Summary", icon: "🎧", hint: "Commuter-friendly audio script" },
  { id: "ask",     label: "Ask",     icon: "💬", hint: "Free-form question" },
];

const QUICK_TOPICS = [
  "conditional probability",
  "dot product",
  "matrix multiplication",
  "Bayes theorem",
  "gradient descent",
  "embeddings",
  "transformer attention",
  "cosine similarity",
  "RAG architecture",
  "SM-2 spaced repetition",
];

export function TutorPanel({ defaultTopic = "" }: { defaultTopic?: string }) {
  const [mode, setMode] = useState<TutorMode>("explain");
  const [topic, setTopic] = useState(defaultTopic);
  const [context, setContext] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const submit = async () => {
    if (!topic.trim() || loading) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, topic: topic.trim(), context: context.trim() || undefined }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        setError(data.error ?? "Request failed");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setError("No stream"); return; }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResponse((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            title={m.hint}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              mode === m.id
                ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                : "border-command-border text-gray-400 hover:border-cyan-500/30 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Topic input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-400">
          Topic or question
        </label>
        <div className="flex gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
            placeholder={
              mode === "ask"
                ? "Ask anything about AI/ML engineering…"
                : `Enter a concept to ${mode}…`
            }
            className="flex-1 rounded-lg border border-command-border bg-command-bg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={!topic.trim() || loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              "→"
            )}
          </button>
        </div>

        {/* Quick topics */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="rounded-full border border-command-border px-2 py-0.5 text-[10px] text-gray-600 transition hover:border-cyan-500/30 hover:text-cyan-400"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Optional context */}
      {mode !== "ask" && (
        <div>
          <label className="mb-1 block text-xs text-gray-600">
            Extra context (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            placeholder="e.g. 'I understand dot products but struggle with the geometric interpretation'"
            className="w-full rounded-lg border border-command-border bg-command-bg px-3 py-2 text-xs text-gray-400 placeholder:text-gray-700 focus:border-cyan-500/50 focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          ⚠ {error}
        </div>
      )}

      {/* Response */}
      {(response || loading) && (
        <div className="relative rounded-xl border border-cyan-500/15 bg-[#080d18] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500/60">
              {MODES.find((m) => m.id === mode)?.icon} Claude · {mode} · {topic}
            </span>
            {!loading && response && (
              <button
                onClick={() => navigator.clipboard.writeText(response)}
                className="text-[10px] text-gray-700 hover:text-gray-400 transition"
              >
                Copy
              </button>
            )}
          </div>

          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300">
            {response}
            {loading && (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-cyan-400" />
            )}
          </div>

          {loading && (
            <button
              onClick={() => abortRef.current?.abort()}
              className="mt-3 text-[10px] text-gray-700 hover:text-red-400 transition"
            >
              Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
