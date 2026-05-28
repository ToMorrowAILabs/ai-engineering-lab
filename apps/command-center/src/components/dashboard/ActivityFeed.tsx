type ActivityEvent = {
  id: string;
  type: string;
  lessonId?: string;
  resourceId?: string;
  tag?: string;
  score?: number;
  timestamp: string;
};

const EVENT_META: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  lesson_completed:          { icon: "✓", label: "Lesson completed",         color: "text-emerald-400" },
  quiz_completed:            { icon: "❓", label: "Quiz completed",           color: "text-cyan-400" },
  exercise_completed:        { icon: "⌨", label: "Exercise completed",        color: "text-indigo-400" },
  weakness_detected:         { icon: "⚠", label: "Weakness detected",         color: "text-amber-400" },
  remediation_assigned:      { icon: "→", label: "Remediation assigned",      color: "text-orange-400" },
  commuter_review_completed: { icon: "🎧", label: "Commuter review done",     color: "text-purple-400" },
};

function formatRelative(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/^week-\d+-/, "Week: ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-2">
      {sorted.map((e) => {
        const meta = EVENT_META[e.type] ?? { icon: "·", label: e.type, color: "text-gray-500" };
        const subject = e.lessonId
          ? slugToTitle(e.lessonId)
          : e.resourceId
          ? e.resourceId.replace(/-/g, " ")
          : e.tag ?? "";

        return (
          <div
            key={e.id}
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
          >
            <span className={`mt-0.5 shrink-0 text-sm ${meta.color}`}>
              {meta.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-300 truncate">
                <span className={`font-medium ${meta.color}`}>{meta.label}</span>
                {subject && (
                  <span className="text-gray-500"> · {subject}</span>
                )}
                {e.score !== undefined && (
                  <span className="ml-1 text-cyan-400 font-mono">{e.score}%</span>
                )}
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-gray-700 tabular-nums">
              {formatRelative(e.timestamp)}
            </span>
          </div>
        );
      })}
      {events.length === 0 && (
        <p className="py-4 text-center text-xs text-gray-600">No recent activity</p>
      )}
    </div>
  );
}
