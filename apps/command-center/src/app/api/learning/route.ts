/**
 * POST /api/learning
 * Accept a recall review result (topic + quality 0-5), run SM-2 update,
 * return the updated card and mastery snapshot.
 *
 * Body: { topicId: string; quality: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { createCard, reviewCard, getDueCards } from "@/lib/learning/sm2";
import { loadJson } from "@/lib/data";
import type { SM2Card } from "@/lib/learning/sm2";

type LearningState = {
  cards: SM2Card[];
  masterySnapshot: {
    overallMastery: number;
    strongTopics: string[];
    weakTopics: string[];
    dueForReview: string[];
    computedAt: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const { topicId, quality } = await req.json() as { topicId: string; quality: number };

    if (!topicId || typeof quality !== "number") {
      return NextResponse.json({ error: "topicId and quality (0-5) required" }, { status: 400 });
    }

    const state = loadJson<LearningState>("learning_state.json");
    const cardId = topicId.startsWith("topic:") ? topicId : `topic:${topicId}`;

    let card = state.cards.find((c) => c.id === cardId) ?? createCard(cardId);
    const result = reviewCard(card, quality);
    card = result.card;

    // Update cards array
    const cards = state.cards.filter((c) => c.id !== cardId);
    cards.push(card);

    const due = getDueCards(cards);

    return NextResponse.json({
      ok: true,
      card,
      passed: result.passed,
      nextReviewInDays: result.nextIntervalDays,
      dueCount: due.length,
      message: result.passed
        ? `Good! Next review in ${result.nextIntervalDays} day${result.nextIntervalDays !== 1 ? "s" : ""}.`
        : `Review again tomorrow — keep practicing!`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const state = loadJson<LearningState>("learning_state.json");
    const due = getDueCards(state.cards);
    return NextResponse.json({
      cards: state.cards,
      dueCards: due,
      dueCount: due.length,
      masterySnapshot: state.masterySnapshot,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
