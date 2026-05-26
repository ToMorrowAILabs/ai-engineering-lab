import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function RoadmapPage() {
  const roadmap = loadJson<{
    weeks: { week: number; title: string; folder: string; status: string; tier: string; anchor?: boolean; completed?: boolean }[];
    tracks: { id: string; name: string; description: string }[];
    parkingLot: string[];
    outcomes: string[];
  }>("roadmap.json");

  return (
    <div>
      <PageHeader title="Course Roadmap" subtitle="70% foundations · 20% applied · 10% frontier scan" />

      <div className="mb-8 glass-panel p-4">
        <p className="mb-2 text-sm font-medium">Month 1 Learning Outcomes</p>
        <ul className="list-inside list-disc text-sm text-gray-400">
          {roadmap.outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Week-by-Week</h2>
      <DataTable
        headers={["Week", "Focus", "Status", "Progress"]}
        rows={roadmap.weeks.map((w) => [
          `Week ${w.week}`,
          <>
            {w.title}
            {w.anchor && <span className="ml-2 badge-ready">anchor</span>}
          </>,
          <span className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}>{w.status}</span>,
          w.completed ? "✓" : "—",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Curriculum Tracks</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {roadmap.tracks.map((t) => (
          <div key={t.id} className="glass-panel p-4">
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-gray-400">{t.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Parking Lot</h2>
      <div className="flex flex-wrap gap-2">
        {roadmap.parkingLot.map((item) => (
          <span key={item} className="badge-frontier">{item}</span>
        ))}
      </div>
    </div>
  );
}
