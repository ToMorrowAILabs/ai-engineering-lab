import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionBadge, SourceTypeBadge } from "@/components/resources/ResourceBadges";
import { ExternalLink, InternalLink, OpenResourceButton } from "@/components/navigation/NavLinks";
import {
  getAllLessons,
  getLessonBySlug,
  getResourceBySlug,
  isSafeUrl,
} from "@/lib/catalog";
import { loadJson } from "@/lib/data";
import { RecallQuestionsBlock } from "@/components/lessons/RecallQuestionsBlock";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ slug: l.slug }));
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const recallData = loadJson<{
    questions: {
      id: string;
      lessonId: string;
      topic: string;
      question: string;
      hint: string;
      difficulty: string;
    }[];
  }>("active_recall_questions.json");

  const lessonRecallQuestions = recallData.questions.filter(
    (q) => q.lessonId === slug
  );

  const resources = lesson.resourceIds
    .map((id) => getResourceBySlug(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r && isSafeUrl(r.url)));

  const commuterResources = lesson.commuterResourceIds
    .map((id) => getResourceBySlug(id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r && isSafeUrl(r.url)));

  return (
    <div>
      <PageHeader
        title={`Week ${lesson.week}: ${lesson.title}`}
        subtitle={lesson.objective}
      />

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <InternalLink href="/progress">← Progress</InternalLink>
        <InternalLink href="/roadmap">Roadmap</InternalLink>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className={lesson.status === "ready" ? "badge-ready" : "badge-scaffold"}>{lesson.status}</span>
        {lesson.anchor && <span className="badge-ready">anchor</span>}
        {lesson.completed ? (
          <span className="badge-ready">completed</span>
        ) : (
          <span className="badge-monitor">in progress</span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel p-4">
          <h2 className="mb-3 font-semibold">Checklist</h2>
          <ul className="space-y-2">
            {lesson.checklist.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-gray-300">
                <span className="text-gray-500">{lesson.completed ? "✓" : "○"}</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-panel p-4">
          <h2 className="mb-3 font-semibold">Exercises</h2>
          <ul className="space-y-2">
            {lesson.exercises.map((ex) => (
              <li key={ex.id} className="flex items-center gap-2 text-sm">
                <span>{ex.completed ? "✓" : "○"}</span>
                <span>{ex.title}</span>
                <code className="text-xs text-gray-500">{ex.id}</code>
              </li>
            ))}
          </ul>

          <h2 className="mb-2 mt-6 font-semibold">Quiz / Checkpoint</h2>
          <div className="text-sm text-gray-300">
            <p>{lesson.quiz.title}</p>
            <p className="mt-1 text-gray-400">
              {lesson.quiz.completed
                ? `Score: ${lesson.quiz.score}% (pass ≥${lesson.quiz.passingScore}%)`
                : `Pending — pass ≥${lesson.quiz.passingScore}%`}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-6 glass-panel p-4">
        <h2 className="mb-3 font-semibold">Resources</h2>
        {resources.length === 0 ? (
          <p className="text-sm text-gray-500">No linked resources for this week yet.</p>
        ) : (
          <ul className="space-y-3">
            {resources.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 text-sm">
                <SourceTypeBadge type={r.source_type} />
                <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                <ActionBadge action={r.action} />
                <OpenResourceButton href={r.url} label="Open" />
              </li>
            ))}
          </ul>
        )}
      </section>

      {commuterResources.length > 0 && (
        <section className="mt-6 glass-panel p-4">
          <h2 className="mb-3 font-semibold">Commuter Reinforcement</h2>
          <ul className="space-y-3">
            {commuterResources.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="badge-monitor">commute</span>
                <InternalLink href={`/resources/${r.id}`}>{r.title}</InternalLink>
                <ExternalLink href={r.url} className="text-xs">
                  Watch/read
                </ExternalLink>
                <InternalLink href="/commuter" className="text-xs">
                  Commuter queue
                </InternalLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Active recall questions for this lesson */}
      <RecallQuestionsBlock questions={lessonRecallQuestions} />

      {lesson.notebooklmPackIds.length > 0 && (
        <section className="mt-6 glass-panel p-4">
          <h2 className="mb-3 font-semibold">NotebookLM Packs</h2>
          <p className="mb-2 text-sm text-gray-400">
            Manual paste workflow — see{" "}
            <InternalLink href="/notebooklm">NotebookLM Packs</InternalLink>.
          </p>
          <ul className="flex flex-wrap gap-2">
            {lesson.notebooklmPackIds.map((id) => (
              <span key={id} className="badge-monitor text-xs">
                {id}
              </span>
            ))}
          </ul>
        </section>
      )}

      {lesson.nextSlug && (
        <div className="mt-8">
          <InternalLink href={`/lessons/${lesson.nextSlug}`} className="text-sm font-medium">
            Next lesson: {getLessonBySlug(lesson.nextSlug)?.title ?? lesson.nextSlug} →
          </InternalLink>
        </div>
      )}
    </div>
  );
}
