import Link from "next/link";
import type { Lesson } from "@/lib/catalog";
import { weekSlug } from "@/lib/catalog";

export function WeekChecklistCard({ lesson }: { lesson: Lesson }) {
  const slug = lesson.slug ?? weekSlug(lesson.week);

  return (
    <Link
      href={`/lessons/${slug}`}
      className="glass-panel block p-4 transition hover:border-cyan-500/30 hover:bg-white/5"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-gray-500">Week {lesson.week}</span>
        <span className={lesson.status === "ready" ? "badge-ready" : "badge-scaffold"}>{lesson.status}</span>
        {lesson.anchor && <span className="badge-ready text-[10px]">anchor</span>}
        {lesson.completed ? (
          <span className="badge-ready text-[10px]">complete</span>
        ) : (
          <span className="badge-monitor text-[10px]">in progress</span>
        )}
      </div>
      <p className="font-medium text-white">{lesson.title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{lesson.objective}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
        <span>{lesson.resourceIds.length} resources</span>
        <span>{lesson.exercises.length} exercises</span>
        <span>
          quiz {lesson.quiz.completed ? `✓ ${lesson.quiz.score}%` : "○ pending"}
        </span>
        <span>{lesson.commuterResourceIds.length} commuter</span>
      </div>
      <p className="mt-2 text-xs text-cyan-400/80">View lesson →</p>
    </Link>
  );
}
