/**
 * GitHub-style contribution heatmap.
 * Accepts a list of activity dates (ISO strings) and renders the last N weeks.
 */

const WEEKS_TO_SHOW = 16;
const DAYS_PER_WEEK = 7;

const INTENSITY_COLORS = [
  "bg-white/5",           // 0 — empty
  "bg-emerald-900/60",   // 1 — low
  "bg-emerald-700/70",   // 2 — medium
  "bg-emerald-500/80",   // 3 — high
  "bg-emerald-400",      // 4 — max
];

function dateToKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setUTCDate(result.getUTCDate() + n);
  return result;
}

export function StreakHeatmap({
  activityDates,
  streakDays,
}: {
  activityDates: string[];
  streakDays: number;
}) {
  // Build a frequency map
  const freq: Record<string, number> = {};
  for (const d of activityDates) {
    const key = d.slice(0, 10);
    freq[key] = (freq[key] ?? 0) + 1;
  }

  // Build grid: WEEKS_TO_SHOW columns × 7 rows
  // Start from (today - WEEKS_TO_SHOW*7) days, aligned to Sunday
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Roll back to the most recent Sunday
  const dayOfWeek = today.getUTCDay(); // 0=Sun
  const startDate = addDays(today, -(WEEKS_TO_SHOW * DAYS_PER_WEEK - 1 + dayOfWeek));

  const grid: { key: string; count: number; isToday: boolean }[][] = [];
  let cursor = new Date(startDate);
  for (let w = 0; w < WEEKS_TO_SHOW; w++) {
    const week: { key: string; count: number; isToday: boolean }[] = [];
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const key = dateToKey(cursor);
      week.push({
        key,
        count: freq[key] ?? 0,
        isToday: key === dateToKey(today),
      });
      cursor = addDays(cursor, 1);
    }
    grid.push(week);
  }

  const intensityFor = (count: number): number =>
    count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;

  const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {WEEKS_TO_SHOW}-week activity
        </span>
        <span className="text-xs font-semibold text-emerald-400">
          🔥 {streakDays}-day streak
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {DAY_LABELS.map((l, i) => (
            <span
              key={i}
              className="flex h-3 w-3 items-center justify-center text-[7px] text-gray-700"
            >
              {l}
            </span>
          ))}
        </div>

        {/* Heatmap columns */}
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((cell) => {
              const intensity = intensityFor(cell.count);
              return (
                <div
                  key={cell.key}
                  title={`${cell.key}: ${cell.count} event${cell.count !== 1 ? "s" : ""}`}
                  className={`h-3 w-3 rounded-sm transition-opacity ${
                    INTENSITY_COLORS[intensity]
                  } ${cell.isToday ? "ring-1 ring-cyan-400" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Scale */}
      <div className="flex items-center gap-1 text-[9px] text-gray-700">
        <span>Less</span>
        {INTENSITY_COLORS.map((c, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
