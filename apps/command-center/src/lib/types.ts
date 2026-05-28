export type SourceType =
  | "github_repo"
  | "youtube_playlist"
  | "course"
  | "paper"
  | "book"
  | "docs"
  | "web_book"
  | "video_playlist";

export type ResourceCategory =
  | "math_foundations"
  | "ml_foundations"
  | "llm_apps"
  | "rag"
  | "agents"
  | "vector_db"
  | "evaluation"
  | "mcp"
  | "local_llms"
  | "commuter_reinforcement";

export type LearningPhase = "Month 1" | "Month 2" | "Month 3" | "Month 4+";
export type ResourceAction = "act_now" | "monitor" | "later";
export type ResourcePriority = "high" | "medium" | "low";

export interface Resource {
  id: string;
  title: string;
  url: string;
  source_type: SourceType;
  category: ResourceCategory;
  learning_phase: LearningPhase;
  priority: ResourcePriority;
  action: ResourceAction;
  relevance_score: number;
  commute_friendly: boolean;
  project_candidate: boolean;
  notes: string;
  recommended_use: string;
  curriculum_tier: "foundations" | "applied" | "frontier_scan";
  pdfAvailable?: boolean;
  /** @deprecated use category — kept for backward compat */
  lessons?: string[];
  difficulty?: string;
  reinforcement_priority?: string;
  copyright_status?: string;
}

export interface Balance702010 {
  target: { foundations: number; applied: number; frontier: number };
  actual: { foundations: number; applied: number; frontier: number };
  onTrack: boolean;
  violations: string[];
  recommendations: string[];
}

export interface ProgressMeta {
  currentWeek: number;
  currentMonth: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonsRemaining: number;
  percentComplete: number;
  estimatedCompletionDate: string;
  averageLessonDurationMinutes: number;
  learningVelocityLessonsPerWeek: number;
  streakDays: number;
  averageQuizScore: number;
  exerciseCompletionRate: number;
  reinforcementCompletionPct: number;
  commuterReviewCompletionPct: number;
  monthlyConsistencyScore: number;
  activeRemediationQueueSize: number;
  nextRecommendedLesson: string;
  weakTopics: string[];
  strongTopics: string[];
}

export interface NavItem {
  href: string;
  label: string;
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", section: "Core" },
  { href: "/roadmap", label: "Roadmap", section: "Core" },
  { href: "/progress", label: "Progress", section: "Core" },
  { href: "/course-kpis", label: "Course KPIs", section: "Core" },
  { href: "/tutor", label: "AI Tutor", section: "Learning" },
  { href: "/graph", label: "Concept Graph", section: "Learning" },
  { href: "/resources", label: "Resources", section: "Learning" },
  { href: "/commuter", label: "Commuter", section: "Learning" },
  { href: "/notebooklm", label: "NotebookLM Packs", section: "Learning" },
  { href: "/weakness-remediation", label: "Weakness Remediation", section: "Learning" },
  { href: "/daily-brief", label: "Daily AI Brief", section: "Intelligence" },
  { href: "/trend-signals", label: "AI Trend Signals", section: "Intelligence" },
  { href: "/flywheel", label: "Flywheel Analytics", section: "Intelligence" },
  { href: "/resource-graph", label: "Resource Graph", section: "Intelligence" },
  { href: "/change-log", label: "Change Log", section: "System" },
  { href: "/system-inventory", label: "System Inventory", section: "System" },
];

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  math_foundations: "Math Foundations",
  ml_foundations: "ML Foundations",
  llm_apps: "LLM Apps",
  rag: "RAG",
  agents: "Agents",
  vector_db: "Vector DBs",
  evaluation: "Evaluation",
  mcp: "MCP",
  local_llms: "Local LLMs",
  commuter_reinforcement: "Commuter Reinforcement",
};
