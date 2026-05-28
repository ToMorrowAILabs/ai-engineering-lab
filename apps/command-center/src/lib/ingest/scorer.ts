/**
 * Relevance scorer — determines how relevant a signal is to the current learning phase.
 * Higher score = more relevant.
 */

/** Topics being studied in Month 1. Extend per phase. */
const MONTH1_CORE_TOPICS = [
  "linear algebra", "matrix", "eigenvalue", "probability", "statistics",
  "bayes", "calculus", "gradient", "numpy", "pandas", "python",
  "git", "api", "json", "rest",
];

const MONTH1_APPLIED_TOPICS = [
  "llm", "language model", "transformer", "embeddings", "rag",
  "retrieval", "vector", "fine-tuning", "prompt", "ollama", "openai",
  "anthropic", "claude", "langchain",
];

const MONTH1_FRONTIER_TOPICS = [
  "agent", "multi-agent", "mcp", "swarm", "autonomous", "reasoning",
  "o1", "o3", "gemini", "gpt-5", "claude 4",
];

export type RelevanceScore = {
  total: number;        // 0–100
  foundationsFit: number;
  appliedFit: number;
  frontierFit: number;
  matchedTopics: string[];
};

export function scoreRelevance(
  text: string,
  currentPhase: "Month 1" | "Month 2" | "Month 3" | "Month 4+" = "Month 1"
): RelevanceScore {
  const lower = text.toLowerCase();

  const foundationsMatches = MONTH1_CORE_TOPICS.filter((t) => lower.includes(t));
  const appliedMatches = MONTH1_APPLIED_TOPICS.filter((t) => lower.includes(t));
  const frontierMatches = MONTH1_FRONTIER_TOPICS.filter((t) => lower.includes(t));

  const foundationsFit = Math.min(100, foundationsMatches.length * 20);
  const appliedFit = Math.min(100, appliedMatches.length * 15);
  const frontierFit = Math.min(100, frontierMatches.length * 10);

  // Month 1 weights: 70/20/10
  const total = Math.round(
    (foundationsFit * 0.7) + (appliedFit * 0.2) + (frontierFit * 0.1)
  );

  return {
    total: Math.min(100, total),
    foundationsFit,
    appliedFit,
    frontierFit,
    matchedTopics: [...foundationsMatches, ...appliedMatches, ...frontierMatches],
  };
}
