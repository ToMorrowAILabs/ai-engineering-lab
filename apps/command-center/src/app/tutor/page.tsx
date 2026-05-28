import { PageHeader, KpiCard } from "@/components/ui/PageHeader";
import { TutorPanel } from "@/components/tutor/TutorPanel";

export default async function TutorPage({
  searchParams,
}: {
  searchParams?: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  const defaultTopic = params?.topic ?? "";

  return (
    <div>
      <PageHeader
        title="AI Tutor"
        subtitle="Claude-powered · explain · quiz · exercise · audio summary"
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <KpiCard label="Modes" value="5" />
        <KpiCard label="Model" value="Claude Opus" accent="text-cyan-400" />
        <KpiCard label="Streaming" value="Live" accent="text-emerald-400" />
      </div>

      <div className="mb-6 rounded-xl border border-cyan-500/10 bg-cyan-500/5 px-5 py-4 text-sm text-cyan-300/70">
        <span className="font-semibold text-cyan-400">How to use:</span> Pick a
        mode, enter any AI/ML concept, then hit <kbd className="rounded border border-cyan-500/30 px-1.5 py-0.5 font-mono text-xs">↵ Enter</kbd> or click →.{" "}
        Use the quick-topic pills below the input for instant examples.
      </div>

      <div className="mx-auto max-w-3xl">
        <TutorPanel defaultTopic={defaultTopic} />
      </div>
    </div>
  );
}
