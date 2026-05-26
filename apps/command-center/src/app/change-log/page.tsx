import ReactMarkdown from "react-markdown";
import { loadJson, loadMarkdown } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function ChangeLogPage() {
  const log = loadJson<{
    changes: {
      id: string;
      date: string;
      triggerSource: string;
      reason: string;
      affectedLesson: string | null;
      changeType: string;
      priority: string;
      status: string;
      curriculumImpact: string;
      tier: string;
      learningPhase?: string;
      resourceId?: string;
    }[];
  }>("course_change_log.json");
  const md = loadMarkdown("COURSE_CHANGELOG.md");

  return (
    <div>
      <PageHeader title="Course Change Log" subtitle="Tracked curriculum evolution — approved vs rejected" />

      <div className="mb-6 glass-panel p-6 prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>

      <DataTable
        headers={["Date", "Reason", "Phase", "Type", "Tier", "Status", "Impact"]}
        rows={log.changes.map((c) => [
          c.date,
          c.reason,
          c.learningPhase ?? "—",
          c.changeType,
          <span className={c.tier === "frontier" ? "badge-frontier" : c.tier === "applied" ? "badge-monitor" : "badge-ready"}>{c.tier}</span>,
          <span className={c.status === "approved" ? "badge-ready" : "badge-ignore"}>{c.status}</span>,
          c.curriculumImpact,
        ])}
      />
    </div>
  );
}
