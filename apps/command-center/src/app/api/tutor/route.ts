/**
 * POST /api/tutor
 * AI Tutor endpoint — powered by Claude with streaming.
 *
 * Body:
 *   { mode: "explain" | "quiz" | "exercise" | "summary", topic: string, context?: string, lessonSlug?: string }
 *
 * Requires ANTHROPIC_API_KEY env var.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const maxDuration = 60;

type TutorMode = "explain" | "quiz" | "exercise" | "summary" | "ask";

const SYSTEM_PROMPT = `You are an expert AI engineering tutor embedded in ToMorrowAILabs.ai Command Center — a personal learning OS for Bryant, who is in Month 1 of a self-directed AI engineering curriculum (70% math/foundations, 20% applied ML/LLMs, 10% frontier scan).

Current study areas: linear algebra, probability, statistics, Python, APIs, git, and the beginnings of ML theory.
Next topics: NumPy/Pandas, basic ML models, embeddings, RAG systems.

Your tone: direct, technical, warm. Bryant is building toward building production AI systems — not just theory.
- Keep explanations concrete with real examples.
- When generating exercises, make them runnable Python.
- When generating quizzes, give 3–5 multiple choice questions with answers.
- Always tie concepts to their AI engineering applications.`;

function buildPrompt(mode: TutorMode, topic: string, context?: string): string {
  const ctx = context ? `\n\nAdditional context: ${context}` : "";

  switch (mode) {
    case "explain":
      return `Explain "${topic}" clearly for an AI engineering student in Month 1. Cover:
1. What it is (1–2 sentences)
2. Why it matters for AI/ML
3. Intuition or analogy
4. One concrete Python example
5. Where it appears in LLMs or production AI${ctx}`;

    case "quiz":
      return `Generate a 4-question multiple-choice quiz on "${topic}" for an AI engineering student.
Format each question as:
Q: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Answer: [letter] — [brief explanation]${ctx}`;

    case "exercise":
      return `Create a hands-on Python coding exercise for "${topic}". Include:
1. Brief goal statement (1 sentence)
2. Starter code with TODOs
3. Expected output
4. Hints (optional, after a separator)
5. Full solution (after a "Solution:" separator)${ctx}`;

    case "summary":
      return `Create a concise commuter-friendly audio summary of "${topic}" — suitable for listening while walking or on the subway. Use clear, spoken-word style (no code, no bullet points — just clear sentences). Target 3–4 minutes speaking time (~450 words). End with 2 active recall questions to think about.${ctx}`;

    case "ask":
    default:
      return `${topic}${ctx}`;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const { mode, topic, context, lessonSlug } = await req.json() as {
    mode: TutorMode;
    topic: string;
    context?: string;
    lessonSlug?: string;
  };

  if (!topic?.trim()) {
    return new Response(JSON.stringify({ error: "topic is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });
  const userPrompt = buildPrompt(mode ?? "ask", topic, context);

  // Stream the response
  const stream = await client.messages.stream({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Tutor-Mode": mode ?? "ask",
      "X-Tutor-Topic": encodeURIComponent(topic),
      "X-Lesson-Slug": lessonSlug ?? "",
      "Cache-Control": "no-store",
    },
  });
}
