import { NextResponse } from "next/server";
import { getAllLessons, getAllResources } from "@/lib/catalog";
import { NAV_ITEMS } from "@/lib/types";

export type SearchItem = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  category: "page" | "lesson" | "resource" | "topic" | "action";
  icon?: string;
  keywords?: string[];
};

export function GET() {
  const lessons = getAllLessons();
  const resources = getAllResources();

  const items: SearchItem[] = [
    // ── Navigation pages ──────────────────────────────────
    ...NAV_ITEMS.map((n) => ({
      id: `page:${n.href}`,
      label: n.label,
      sublabel: n.section ?? "Page",
      href: n.href,
      category: "page" as const,
      icon: "⬡",
    })),

    // ── Quick actions ─────────────────────────────────────
    {
      id: "action:tutor",
      label: "Ask AI Tutor",
      sublabel: "Get explanation or exercise",
      href: "/tutor",
      category: "action",
      icon: "🤖",
    },
    {
      id: "action:commuter",
      label: "Start Commuter Session",
      sublabel: "Begin reinforcement review",
      href: "/commuter",
      category: "action",
      icon: "🎧",
    },
    {
      id: "action:remediate",
      label: "Start Remediation",
      sublabel: "Fix weak topics",
      href: "/weakness-remediation",
      category: "action",
      icon: "⚠",
    },
    {
      id: "action:graph",
      label: "View Concept Graph",
      sublabel: "Explore prerequisite map",
      href: "/graph",
      category: "action",
      icon: "◉",
    },

    // ── Lessons ───────────────────────────────────────────
    ...lessons.map((l) => ({
      id: `lesson:${l.slug}`,
      label: `Week ${l.week}: ${l.title}`,
      sublabel: l.completed ? `✓ ${l.objective.slice(0, 60)}` : l.objective.slice(0, 60),
      href: `/lessons/${l.slug}`,
      category: "lesson" as const,
      icon: l.completed ? "✓" : "○",
      keywords: [l.tier, l.status, ...(l.checklist ?? [])],
    })),

    // ── Resources ─────────────────────────────────────────
    ...resources.slice(0, 40).map((r) => ({
      id: `resource:${r.id}`,
      label: r.title,
      sublabel: `${r.source_type.replace(/_/g, " ")} · ${r.action.replace(/_/g, " ")}`,
      href: `/resources/${r.id}`,
      category: "resource" as const,
      icon: "📄",
      keywords: [r.category, r.learning_phase, r.notes.slice(0, 80)],
    })),
  ];

  return NextResponse.json({ items });
}
