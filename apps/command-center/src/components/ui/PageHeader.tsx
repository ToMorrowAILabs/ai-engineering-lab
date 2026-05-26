export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="kpi-card">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-2xl font-bold ${accent ?? "text-white"}`}>{value}</span>
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </div>
  );
}

export function BalanceBar({
  target,
  actual,
}: {
  target: { foundations: number; applied: number; frontier: number };
  actual: { foundations: number; applied: number; frontier: number };
}) {
  return (
    <div className="glass-panel p-4">
      <p className="mb-3 text-sm font-medium">70 / 20 / 10 Balance</p>
      <div className="mb-2 flex h-3 overflow-hidden rounded-full bg-gray-800">
        <div className="bg-cyan-500" style={{ width: `${actual.foundations}%` }} title="Foundations" />
        <div className="bg-amber-500" style={{ width: `${actual.applied}%` }} title="Applied" />
        <div className="bg-violet-500" style={{ width: `${actual.frontier}%` }} title="Frontier" />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Foundations {actual.foundations}% (target {target.foundations}%)</span>
        <span>Applied {actual.applied}%</span>
        <span>Frontier {actual.frontier}%</span>
      </div>
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="glass-panel overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-command-border text-xs uppercase text-gray-500">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-command-border/50 hover:bg-white/5">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
