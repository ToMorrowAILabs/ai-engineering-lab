import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { isSafeUrl } from "@/lib/catalog";

type SignalAction = {
  type: "watch" | "lesson" | "resource" | "external" | "park" | "badge";
  label: string;
  href: string | null;
};

type Signal = {
  id: string;
  topic: string;
  title?: string;
  description?: string;
  velocity: string;
  source: string;
  classification?: string;
  learningPhase?: string;
  actAfter?: string;
  reason?: string;
  resourceIds?: string[];
  relatedResourceId?: string;
  relatedLessonSlug?: string | null;
  url?: string;
  modeTags?: string[];
  commuterFriendly?: boolean;
  estimatedMinutes?: number;
  activeRecallPrompt?: string;
  whyParked?: string;
  videoNeeded?: boolean;
  actions?: SignalAction[];
  loggedAt: string;
};

const ACTION_STYLES: Record<string, string> = {
  watch:    "inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-cyan-400",
  lesson:   "inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20",
  resource: "inline-flex items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300",
  external: "inline-flex items-center gap-1 rounded-lg border border-command-border px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-cyan-500/40 hover:text-cyan-300",
};

const MODE_TAG_STYLES: Record<string, string> = {
  commuter:      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  walking:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  gym:           "bg-amber-500/10 text-amber-400 border-amber-500/20",
  chores:        "bg-purple-500/10 text-purple-400 border-purple-500/20",
  lunch:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
  dinner:        "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  passive:       "bg-gray-500/10 text-gray-400 border-gray-500/20",
  monitor:       "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  later:         "bg-gray-600/10 text-gray-500 border-gray-600/20",
  active_recall: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function ModeTag({ tag }: { tag: string }) {
  const cls = MODE_TAG_STYLES[tag] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium capitalize ${cls}`}>
      {tag.replace(/_/g, " ")}
    </span>
  );
}

function SignalActions({ actions, signalUrl }: { actions?: SignalAction[]; signalUrl?: string }) {
  if (!actions?.length && !signalUrl) return null;

  // If no structured actions, fall back to a generic "Open" button
  const items = actions?.length
    ? actions
    : [{ type: "external" as const, label: "Open ↗", href: signalUrl ?? null }];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((action, i) => {
        // Badge / park actions — no link, render as span
        if (!action.href || action.type === "badge" || action.type === "park") {
          return (
            <span
              key={i}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                action.type === "park"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-gray-700 bg-gray-800/60 text-gray-500"
              }`}
            >
              {action.label}
            </span>
          );
        }

        // Internal links (lesson, resource)
        if (action.type === "lesson" || action.type === "resource") {
          return (
            <a
              key={i}
              href={action.href}
              className={ACTION_STYLES[action.type]}
            >
              {action.label}
            </a>
          );
        }

        // External links (watch, external)
        return (
          <a
            key={i}
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={ACTION_STYLES[action.type] ?? ACTION_STYLES.external}
          >
            {action.label}
          </a>
        );
      })}
    </div>
  );
}

export default function TrendSignalsPage() {
  const log = loadJson<{ signals: Signal[] }>("trend_signal_log.json");
  const brief = loadJson<{
    signals: {
      id?: string;
      title: string;
      classification: string;
      category: string;
      relevanceScore: number;
      url: string;
      commuterPrompt?: string;
    }[];
  }>("daily_brief.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));

  const featured =
    log.signals.find((s) => s.classification === "act_now" && s.commuterFriendly) ??
    log.signals.find((s) => s.classification === "act_now") ??
    log.signals[0] ??
    null;

  const velocityClass = (v: string) =>
    v === "rising" ? "badge-ready" : v === "parked" ? "badge-frontier" : "badge-monitor";
  const classClass = (c?: string) =>
    c === "later" ? "badge-ignore" : c === "act_now" ? "badge-ready" : "badge-monitor";

  return (
    <div>
      <PageHeader
        title="AI Trend Signals"
        subtitle="10% frontier scan — monitor without chasing hype"
      />

      {/* ── FEATURED SIGNAL ─────────────────────────────────── */}
      {featured && (
        <div className="mb-6 overflow-hidden rounded-xl border border-cyan-500/25 bg-gradient-to-br from-[#0a1628] to-command-bg">
          <div className="flex items-center justify-between border-b border-cyan-500/10 bg-cyan-500/5 px-5 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">⚡ Featured Signal</p>
            {featured.commuterFriendly && (
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-medium text-cyan-400">
                🎧 Commuter ready
              </span>
            )}
          </div>
          <div className="p-5">
            <p className="text-base font-semibold text-white">
              {featured.title ?? featured.topic.replace(/_/g, " ")}
            </p>
            {featured.description && (
              <p className="mt-1 text-sm text-gray-400">{featured.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className={`${classClass(featured.classification)} text-[10px]`}>
                {featured.classification ?? "monitor"}
              </span>
              <span className={`${velocityClass(featured.velocity)} text-[10px]`}>
                {featured.velocity}
              </span>
              {featured.learningPhase && (
                <span className="badge-monitor text-[10px]">{featured.learningPhase}</span>
              )}
              {featured.modeTags?.map((t) => <ModeTag key={t} tag={t} />)}
            </div>
            {featured.activeRecallPrompt && (
              <p className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-xs italic text-violet-300">
                💬 {featured.activeRecallPrompt}
              </p>
            )}
            <div className="mt-4">
              <SignalActions actions={featured.actions} signalUrl={featured.url} />
            </div>
          </div>
        </div>
      )}

      {/* ── SIGNAL LOG ──────────────────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Signal Log</h2>
      <div className="mb-8 space-y-3">
        {log.signals.map((s) => {
          // Resolve a linked resource for fallback display
          const linkedResourceId = s.relatedResourceId ?? s.resourceIds?.[0];
          const linkedResource = linkedResourceId ? byId[linkedResourceId] : null;

          return (
            <div
              key={s.id}
              className="overflow-hidden rounded-xl border border-command-border bg-command-panel/40 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-command-border/50 px-4 py-3">
                <div className="flex-1">
                  <p className="font-semibold text-white leading-snug">
                    {s.title ?? s.topic.replace(/_/g, " ")}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">{s.source} · {s.loggedAt}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <span className={`${velocityClass(s.velocity)} text-[10px]`}>{s.velocity}</span>
                  <span className={`${classClass(s.classification)} text-[10px]`}>
                    {s.classification ?? "monitor"}
                  </span>
                  {s.learningPhase && (
                    <span className="badge-monitor text-[10px]">{s.learningPhase}</span>
                  )}
                  {s.commuterFriendly && (
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] text-cyan-400">
                      🎧 commuter
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3 space-y-3">
                {/* Description */}
                {s.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
                )}

                {/* Why parked callout */}
                {s.whyParked && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-500/70">
                      Why parked
                    </p>
                    <p className="text-xs text-amber-200/70 leading-relaxed">{s.whyParked}</p>
                  </div>
                )}

                {/* Active recall prompt */}
                {s.activeRecallPrompt && (
                  <p className="text-[11px] italic text-violet-400/80">
                    💬 {s.activeRecallPrompt}
                  </p>
                )}

                {/* Mode tags */}
                {s.modeTags && s.modeTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {s.modeTags.map((t) => <ModeTag key={t} tag={t} />)}
                    {s.estimatedMinutes && (
                      <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[9px] text-gray-600">
                        ~{s.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                )}

                {/* actAfter note */}
                {s.actAfter && !s.whyParked && (
                  <p className="text-[10px] text-gray-600">Act after: {s.actAfter}</p>
                )}

                {/* Action buttons */}
                <SignalActions actions={s.actions} signalUrl={s.url} />

                {/* Linked resource list (for signals with resourceIds but no structured actions) */}
                {!s.actions?.length && s.resourceIds && s.resourceIds.length > 1 && (
                  <div className="space-y-1 pt-1">
                    {s.resourceIds.slice(0, 6).map((id) => {
                      const r = byId[id];
                      return r && isSafeUrl(r.url) ? (
                        <div key={id} className="flex flex-wrap items-center gap-2 text-xs">
                          <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                          <ExternalLink href={r.url} className="text-xs">Open ↗</ExternalLink>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TODAY'S BRIEF SIGNALS ───────────────────────────── */}
      <h2 className="mb-3 text-lg font-semibold">Today&apos;s Brief Signals</h2>
      <div className="space-y-3">
        {brief.signals
          .filter((s) => isSafeUrl(s.url))
          .map((s) => {
            const badgeClass =
              s.classification === "ignore"
                ? "badge-ignore"
                : s.classification === "act_now"
                ? "badge-ready"
                : "badge-monitor";
            return (
              <div
                key={s.title}
                className="overflow-hidden rounded-xl border border-command-border bg-command-panel/40 transition hover:border-cyan-500/20 hover:bg-white/[0.03]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                  <div className="flex-1">
                    <ExternalLink href={s.url} className="font-semibold text-sm">
                      {s.title}
                    </ExternalLink>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className={`${badgeClass} text-[10px]`}>{s.classification}</span>
                      <span className="badge-monitor text-[10px]">{s.category}</span>
                      <span className="text-[10px] text-gray-600">score: {s.relevanceScore}</span>
                    </div>
                    {s.commuterPrompt && (
                      <p className="mt-2 text-[11px] italic text-gray-500">
                        💬 {s.commuterPrompt}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <ExternalLink href={s.url} className="text-xs">
                      Read ↗
                    </ExternalLink>
                    {(s.classification === "act_now" || s.classification === "monitor") && (
                      <a
                        href="/commuter"
                        className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-400 transition hover:bg-cyan-500/20"
                      >
                        + Commuter
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
