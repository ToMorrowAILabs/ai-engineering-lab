/**
 * Signal classifier — maps a relevance score to act_now / monitor / parked / ignore.
 */

import type { RelevanceScore } from "./scorer";

export type SignalClassification = "act_now" | "monitor" | "parked" | "ignore";

export function classifySignal(
  score: RelevanceScore,
  recency: "today" | "week" | "month" | "older" = "week"
): SignalClassification {
  const recencyBoost = recency === "today" ? 10 : recency === "week" ? 5 : 0;
  const adjusted = score.total + recencyBoost;

  if (adjusted >= 60) return "act_now";
  if (adjusted >= 35) return "monitor";
  if (adjusted >= 15) return "parked";
  return "ignore";
}

export function classifyVelocity(
  score: RelevanceScore
): "rising" | "stable" | "declining" | "parked" {
  if (score.total >= 70) return "rising";
  if (score.total >= 40) return "stable";
  if (score.total >= 15) return "declining";
  return "parked";
}
