export type Tier = "foundations" | "applied" | "frontier" | "frontier_scan";

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

export interface Resource {
  id: string;
  title: string;
  url: string;
  lessons: string[];
  difficulty: string;
  reinforcement_priority: string;
  commute_friendly: boolean;
  source_type: string;
  copyright_status: string;
  curriculum_tier: string;
  pdfAvailable: boolean;
  estimated_read_time_minutes?: number;
  learning_stage?: string;
  resource_quality_score?: number;
  reinforcement_score?: number;
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
