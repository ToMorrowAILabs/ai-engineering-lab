import ReactMarkdown from "react-markdown";
import { loadJson, loadMarkdown } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function DailyBriefPage() {
  const brief = loadJson<{
    date: string;
    headline: string;
    summary: string;
    signals: {
      id: string;
      title: string;
      source: string;
      category: string;
      relevanceScore: number;
      classification: string;
      importance: string;
      roadmapImpact: string;
      url: string;
      commuterPrompt: string;
    }[];
    manualIngestionNote: string;
  }>("daily_brief.json");
  const md = loadMarkdown("DAILY_AI_BRIEF.md");

  return (
    <div>
      <PageHeader title="Daily AI Brief" subtitle={`${brief.date} — manual curation only`} />

      <div className="mb-6 glass-panel p-6 prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>

      <p className="mb-4 text-sm text-gray-500">{brief.manualIngestionNote}</p>

      <h2 className="mb-3 text-lg font-semibold">Trend Signals</h2>
      <DataTable
        headers={["Signal", "Score", "Action", "Category", "Impact"]}
        rows={brief.signals.map((s) => [
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{s.title}</a>,
          s.relevanceScore,
          <span className={s.classification === "ignore" ? "badge-ignore" : s.classification === "monitor" ? "badge-monitor" : "badge-ready"}>{s.classification}</span>,
          s.category,
          s.roadmapImpact,
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Commuter Prompts</h2>
      <div className="space-y-3">
        {brief.signals.map((s) => (
          <div key={s.id} className="glass-panel p-4 text-sm">
            <p className="font-medium">{s.title}</p>
            <p className="mt-1 text-gray-400">{s.commuterPrompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
