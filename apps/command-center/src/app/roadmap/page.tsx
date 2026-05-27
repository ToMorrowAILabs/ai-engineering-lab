import Link from "next/link";
import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";
import { ExternalLink, InternalLink } from "@/components/navigation/NavLinks";
import { SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { getAllLessons, isSafeUrl } from "@/lib/catalog";

type RoadmapData = {
  weeks: { week: number; title: string; folder: string; status: string; tier: string; anchor?: boolean; completed?: boolean }[];
  tracks: { id: string; name: string; description: string }[];
  supportMaterials: Record<string, { focus: string; resourceIds: string[]; note: string }>;
  parkingLot: string[];
  parkingLotDetails?: Record<string, { reason: string; revisitAfter: string }>;
  outcomes: string[];
};

export default function RoadmapPage() {
  const roadmap = loadJson<RoadmapData>("roadmap.json");
  const { resources } = loadJson<{ resources: Resource[] }>("resources.json");
  const byId = Object.fromEntries(resources.map((r) => [r.id, r]));
  const lessons = getAllLessons();

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
        headers={["Week", "Focus", "Status", "Progress", "Lesson"]}
        rows={roadmap.weeks.map((w) => {
          const lesson = lessons.find((l) => l.week === w.week);
          return [
            w.week,
            lesson ? (
              <InternalLink href={`/lessons/${lesson.slug}`}>{w.title}</InternalLink>
            ) : (
              <span className="flex items-center gap-2">
                {w.title}
                <span className="badge-scaffold text-[10px]">lesson coming</span>
              </span>
            ),
            <span className={w.status === "ready" ? "badge-ready" : "badge-scaffold"}>{w.status}</span>,
            w.completed ? "✓" : "—",
            lesson ? (
              <InternalLink href={`/lessons/${lesson.slug}`} className="text-xs">
                Open lesson
              </InternalLink>
            ) : (
              <span className="text-xs text-gray-600">scaffold</span>
            ),
          ];
        })}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Support Materials by Phase</h2>
      <p className="mb-4 text-sm text-gray-500">
        Optional references — core sequence stays week-by-week.
      </p>
      <div className="space-y-4">
        {Object.entries(roadmap.supportMaterials).map(([phase, block]) => (
          <div key={phase} className="glass-panel p-4">
            <div className="mb-2 flex flex-wrap items-baseline gap-2">
              <span className="badge-ready">{phase}</span>
              <span className="text-sm text-gray-400">{block.focus}</span>
            </div>
            <p className="mb-3 text-xs text-gray-500">{block.note}</p>
            <ul className="space-y-2">
              {block.resourceIds.map((id) => {
                const r = byId[id];
                if (!r || !isSafeUrl(r.url)) return null;
                return (
                  <li key={id} className="flex flex-wrap items-center gap-2 text-sm">
                    <SourceTypeBadge type={r.source_type} />
                    <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                    <ExternalLink href={r.url} className="text-xs">
                      Open
                    </ExternalLink>
                    <span className="text-xs capitalize text-gray-500">{r.action.replace(/_/g, " ")}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Curriculum Tracks</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {roadmap.tracks.map((t) => (
          <Link
            key={t.id}
            href="/resources"
            className="glass-panel block p-4 transition hover:border-cyan-500/30 hover:bg-white/5"
          >
            <p className="font-medium text-white">{t.name}</p>
            <p className="mt-1 text-sm text-gray-400">{t.description}</p>
            <p className="mt-2 text-xs text-cyan-400/80">Browse resources →</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Parking Lot</h2>
      <p className="mb-3 text-sm text-gray-500">Hover for reason — these topics are intentionally deferred to preserve 70% foundations focus.</p>
      <div className="flex flex-wrap gap-2">
        {roadmap.parkingLot.map((item) => {
          const detail = roadmap.parkingLotDetails?.[item];
          return (
            <span
              key={item}
              className="badge-frontier cursor-help"
              title={detail ? `Parked: ${detail.reason} Revisit after: ${detail.revisitAfter}` : "Parked — outside Month 1 scope"}
            >
              {item}
            </span>
          );
        })}
      </div>
      {roadmap.parkingLotDetails && (
        <div className="mt-4 space-y-2">
          {roadmap.parkingLot.map((item) => {
            const detail = roadmap.parkingLotDetails![item];
            if (!detail) return null;
            return (
              <details key={item} className="glass-panel px-4 py-2 text-sm">
                <summary className="cursor-pointer font-medium text-violet-300">{item}</summary>
                <p className="mt-2 text-gray-400">{detail.reason}</p>
                <p className="mt-1 text-xs text-gray-500">Revisit after: {detail.revisitAfter}</p>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
