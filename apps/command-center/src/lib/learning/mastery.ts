/**
 * Mastery scoring — computes per-topic mastery (0–100) from SM-2 card state,
 * quiz scores, and exercise completions.
 */

import type { SM2Card } from "./sm2";
import { estimateRetention } from "./sm2";

export type TopicMastery = {
  topic: string;
  score: number;           // 0–100
  level: "novice" | "learning" | "proficient" | "mastered";
  retention: number;       // 0–1 estimated retention
  dueForReview: boolean;
  quizContribution: number;
  exerciseContribution: number;
  recallContribution: number;
  lastActivity: string | null;
};

export type MasterySnapshot = {
  topics: TopicMastery[];
  overallMastery: number;    // 0–100 weighted average
  strongTopics: string[];    // score ≥ 75
  weakTopics: string[];      // score < 40
  dueForReview: string[];
  computedAt: string;
};

/** Map raw quiz score (0–100) to a mastery contribution (0–40). */
function quizToContribution(quizScore: number): number {
  return Math.round((quizScore / 100) * 40);
}

/** Map completion ratio (0–1) to mastery contribution (0–30). */
function exercisesToContribution(completedRatio: number): number {
  return Math.round(completedRatio * 30);
}

/** SM-2 card quality to recall contribution (0–30). */
function sm2ToContribution(card: SM2Card | undefined): number {
  if (!card) return 0;
  const rep = Math.min(card.repetitions, 5);
  const ef = Math.min(card.easinessFactor / 2.5, 1);
  return Math.round(rep * 4 * ef);
}

export function computeMastery(options: {
  sm2Cards: SM2Card[];
  quizScores: Record<string, number>;    // topic → 0–100
  exerciseRatios: Record<string, number>; // topic → 0–1
  topics: string[];
}): MasterySnapshot {
  const { sm2Cards, quizScores, exerciseRatios, topics } = options;
  const cardMap = Object.fromEntries(sm2Cards.map((c) => [c.id.replace("topic:", ""), c]));
  const today = new Date();

  const computed: TopicMastery[] = topics.map((topic) => {
    const card = cardMap[topic];
    const retention = card ? estimateRetention(card, today) : 0;
    const quizC = quizToContribution(quizScores[topic] ?? 0);
    const exC = exercisesToContribution(exerciseRatios[topic] ?? 0);
    const recallC = sm2ToContribution(card);

    const score = Math.min(100, quizC + exC + recallC);
    const level =
      score >= 80 ? "mastered"
      : score >= 60 ? "proficient"
      : score >= 30 ? "learning"
      : "novice";

    const dueForReview = card
      ? card.nextReviewDate <= today.toISOString().slice(0, 10)
      : false;

    return {
      topic,
      score,
      level,
      retention: Math.round(retention * 100) / 100,
      dueForReview,
      quizContribution: quizC,
      exerciseContribution: exC,
      recallContribution: recallC,
      lastActivity: card?.lastReviewDate ?? null,
    };
  });

  const overallMastery =
    computed.length > 0
      ? Math.round(computed.reduce((s, t) => s + t.score, 0) / computed.length)
      : 0;

  return {
    topics: computed,
    overallMastery,
    strongTopics: computed.filter((t) => t.score >= 75).map((t) => t.topic),
    weakTopics: computed.filter((t) => t.score < 40).map((t) => t.topic),
    dueForReview: computed.filter((t) => t.dueForReview).map((t) => t.topic),
    computedAt: today.toISOString(),
  };
}
