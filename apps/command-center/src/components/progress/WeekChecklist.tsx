import Link from "next/link";
import type { Lesson } from "@/lib/catalog";
import { weekSlug } from "@/lib/catalog";

export function WeekChecklistCard({ lesson }: { lesson: Lesson }) {
  const slug = lesson.slug ?? weekSlug(lesson.week);
  const exercisesDone = lesson.exercises.filter((e) => e.completed).length;
  const exercisesTotal = lesson.exercises.length;

  return (
    <Link
      href={`/lessons/${slug}`}
      className="glass-card group flex flex-col p-5"
    >
      {/* Top row: week + badges */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-bold text-gray-500">Week {lesson.week}</span>
        <span className={lesson.status === "ready" ? "badge-ready" : "badge-scaffold"}>
          {lesson.status}
        </span>
        {lesson.anchor && <span className="badge-ready text-[10px]">anchor</span>}
        {lesson.completed ? (
          <span className="badge-ready text-[10px]">✓ complete</span>
        ) : (
          <span className="badge-monitor text-[10px]">in progress</span>
        )}
      </div>

      {/* Title */}
      <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {lesson.title}
      </p>

      {/* Objective */}
      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{lesson.objective}</p>

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>{exercisesDone}/{exercisesTotal} exercises</span>
        <span>quiz {lesson.quiz.completed ? `✓ ${lesson.quiz.score}%` : "○ pending"}</span>
        {lesson.commuterResourceIds.length > 0 && (
          <span>{lesson.commuterResourceIds.length} commuter</span>
        )}
        {lesson.resourceIds.length > 0 && (
          <span>{lesson.resourceIds.length} resources</span>
        )}
      </div>

      {/* CTA row — always visible, stronger on hover */}
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 transition group-hover:border-cyan-500/60 group-hover:bg-cyan-500/10">
          Open lesson →
        </span>
        {!lesson.quiz.completed && (
          <span className="text-[10px] text-amber-400/70">quiz pending</span>
        )}
      </div>
    </Link>
  );
}
