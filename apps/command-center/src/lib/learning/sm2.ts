/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the original SuperMemo SM-2 algorithm by Piotr Wozniak.
 *
 * Quality scale: 0–5
 *   0 = complete blackout
 *   1 = incorrect response, but correct remembered
 *   2 = incorrect, but easy to recall
 *   3 = correct with serious difficulty
 *   4 = correct after hesitation
 *   5 = perfect recall
 */

export type SM2Card = {
  /** Unique identifier (e.g., "topic:conditional_probability") */
  id: string;
  /** Easiness factor — starts at 2.5, range [1.3, ∞) */
  easinessFactor: number;
  /** Number of consecutive successful reviews */
  repetitions: number;
  /** Days until next review */
  interval: number;
  /** ISO date of next due review */
  nextReviewDate: string;
  /** ISO date of last review */
  lastReviewDate: string | null;
  /** Quality of last response (0–5) */
  lastQuality: number | null;
};

export type SM2ReviewResult = {
  card: SM2Card;
  /** Whether this was a "successful" review (quality ≥ 3) */
  passed: boolean;
  /** How many days until next review */
  nextIntervalDays: number;
};

/** Default starting card for a new topic. */
export function createCard(id: string): SM2Card {
  return {
    id,
    easinessFactor: 2.5,
    repetitions: 0,
    interval: 1,
    nextReviewDate: new Date().toISOString().slice(0, 10),
    lastReviewDate: null,
    lastQuality: null,
  };
}

/** Apply a review with quality 0–5. Returns the updated card. */
export function reviewCard(card: SM2Card, quality: number): SM2ReviewResult {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  const passed = q >= 3;

  let { easinessFactor, repetitions, interval } = card;

  if (!passed) {
    // Reset on failure
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  }

  // Update easiness factor
  easinessFactor = Math.max(
    1.3,
    easinessFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
  );

  const now = new Date();
  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  const updated: SM2Card = {
    ...card,
    easinessFactor: Math.round(easinessFactor * 100) / 100,
    repetitions,
    interval,
    nextReviewDate: nextDate.toISOString().slice(0, 10),
    lastReviewDate: now.toISOString().slice(0, 10),
    lastQuality: q,
  };

  return { card: updated, passed, nextIntervalDays: interval };
}

/** Cards due today or overdue. */
export function getDueCards(cards: SM2Card[], asOf = new Date()): SM2Card[] {
  const today = asOf.toISOString().slice(0, 10);
  return cards.filter((c) => c.nextReviewDate <= today);
}

/** Estimated retention: 0–1, based on elapsed time vs interval. */
export function estimateRetention(card: SM2Card, asOf = new Date()): number {
  if (!card.lastReviewDate) return 0;
  const elapsed =
    (asOf.getTime() - new Date(card.lastReviewDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const stability = card.interval * card.easinessFactor;
  return Math.exp(-elapsed / stability);
}
