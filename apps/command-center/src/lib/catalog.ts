import { loadJson } from "@/lib/data";
import type { Resource } from "@/lib/types";

export interface LessonExercise {
  id: string;
  title: string;
  completed: boolean;
}

export interface LessonQuiz {
  title: string;
  score: number | null;
  completed: boolean;
  passingScore: number;
}

export interface Lesson {
  slug: string;
  week: number;
  title: string;
  folder: string;
  status: string;
  tier: string;
  anchor: boolean;
  completed: boolean;
  objective: string;
  checklist: string[];
  resourceIds: string[];
  exercises: LessonExercise[];
  quiz: LessonQuiz;
  commuterResourceIds: string[];
  notebooklmPackIds: string[];
  nextSlug: string | null;
}


export function weekSlug(week: number): string {
  return `week-${week}`;
}

export function getAllResources(): Resource[] {
  return loadJson<{ resources: Resource[] }>("resources.json").resources;
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getAllResources().find((r) => r.id === slug);
}

export function getAllLessons(): Lesson[] {
  return loadJson<{ lessons: Lesson[] }>("lessons.json").lessons;
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.slug === slug);
}

export function getRelatedLessonSlug(resourceId: string): string | undefined {
  return getAllLessons().find((l) => l.resourceIds.includes(resourceId))?.slug;
}

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/Volumes/") || url.startsWith("/Users/")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** Map progress/event lesson ids (e.g. week-05-statistics, week-12-rag) to route slug (week-5, week-12). */
export function lessonIdToSlug(lessonId: string): string {
  const weekMatch = lessonId.match(/week-0?(\d+)/i);
  if (weekMatch) return `week-${weekMatch[1]}`;
  return lessonId;
}
