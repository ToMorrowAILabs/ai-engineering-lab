/**
 * Ingestion orchestrator — runs all fetchers, scores, classifies, and returns
 * a unified signal list ready to be written to JSON.
 */

import { fetchArxivPapers } from "./arxiv";
import { fetchGithubTrending } from "./github";
import { fetchHFTrendingModels, fetchHFTrendingPapers } from "./huggingface";
import { scoreRelevance } from "./scorer";
import { classifySignal, classifyVelocity } from "./classifier";

export type IngestedSignal = {
  id: string;
  source: "arxiv" | "github" | "huggingface_model" | "huggingface_paper";
  title: string;
  description: string;
  url: string;
  tags: string[];
  relevanceScore: number;
  classification: "act_now" | "monitor" | "parked" | "ignore";
  velocity: "rising" | "stable" | "declining" | "parked";
  matchedTopics: string[];
  ingestedAt: string;
};

export type IngestResult = {
  signals: IngestedSignal[];
  summary: {
    total: number;
    act_now: number;
    monitor: number;
    parked: number;
    ignore: number;
    sources: Record<string, number>;
  };
  errors: string[];
  ingestedAt: string;
};

export async function runIngestion(options?: {
  githubToken?: string;
  signal?: AbortSignal;
}): Promise<IngestResult> {
  const errors: string[] = [];
  const signals: IngestedSignal[] = [];
  const now = new Date().toISOString();

  // ── arXiv ─────────────────────────────────────────────
  try {
    const papers = await fetchArxivPapers(options?.signal);
    for (const p of papers) {
      const text = `${p.title} ${p.summary} ${p.categories.join(" ")}`;
      const scored = scoreRelevance(text);
      const classification = classifySignal(scored, "week");
      if (classification === "ignore") continue; // skip irrelevant
      signals.push({
        id: `arxiv:${p.id}`,
        source: "arxiv",
        title: p.title,
        description: p.summary,
        url: p.link,
        tags: p.categories,
        relevanceScore: scored.total,
        classification,
        velocity: classifyVelocity(scored),
        matchedTopics: scored.matchedTopics,
        ingestedAt: now,
      });
    }
  } catch (e) {
    errors.push(`arXiv: ${String(e)}`);
  }

  // ── GitHub ────────────────────────────────────────────
  try {
    const repos = await fetchGithubTrending(options?.githubToken, options?.signal);
    for (const r of repos) {
      const text = `${r.name} ${r.description} ${r.topics.join(" ")} ${r.language}`;
      const scored = scoreRelevance(text);
      const classification = classifySignal(scored, "week");
      if (classification === "ignore") continue;
      signals.push({
        id: `github:${r.fullName}`,
        source: "github",
        title: `${r.fullName} (⭐${r.stars.toLocaleString()})`,
        description: r.description,
        url: r.url,
        tags: [...r.topics, r.language].filter(Boolean),
        relevanceScore: scored.total,
        classification,
        velocity: classifyVelocity(scored),
        matchedTopics: scored.matchedTopics,
        ingestedAt: now,
      });
    }
  } catch (e) {
    errors.push(`GitHub: ${String(e)}`);
  }

  // ── HuggingFace papers ────────────────────────────────
  try {
    const papers = await fetchHFTrendingPapers(options?.signal);
    for (const p of papers) {
      const text = `${p.title} ${p.summary}`;
      const scored = scoreRelevance(text);
      const classification = classifySignal(scored, "today");
      if (classification === "ignore") continue;
      signals.push({
        id: `hf-paper:${p.id}`,
        source: "huggingface_paper",
        title: p.title,
        description: p.summary,
        url: p.url,
        tags: [],
        relevanceScore: scored.total,
        classification,
        velocity: classifyVelocity(scored),
        matchedTopics: scored.matchedTopics,
        ingestedAt: now,
      });
    }
  } catch (e) {
    errors.push(`HuggingFace papers: ${String(e)}`);
  }

  // ── HuggingFace models ────────────────────────────────
  try {
    const models = await fetchHFTrendingModels(options?.signal);
    for (const m of models) {
      const text = `${m.modelId} ${m.pipeline_tag} ${m.tags.join(" ")}`;
      const scored = scoreRelevance(text);
      const classification = classifySignal(scored, "week");
      if (classification === "ignore") continue;
      signals.push({
        id: `hf-model:${m.id}`,
        source: "huggingface_model",
        title: `Model: ${m.modelId}`,
        description: `Pipeline: ${m.pipeline_tag} · ${m.likes} likes · ${m.downloads.toLocaleString()} downloads`,
        url: m.url,
        tags: m.tags.slice(0, 5),
        relevanceScore: scored.total,
        classification,
        velocity: classifyVelocity(scored),
        matchedTopics: scored.matchedTopics,
        ingestedAt: now,
      });
    }
  } catch (e) {
    errors.push(`HuggingFace models: ${String(e)}`);
  }

  // Sort by relevance score descending
  signals.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const summary = {
    total: signals.length,
    act_now: signals.filter((s) => s.classification === "act_now").length,
    monitor: signals.filter((s) => s.classification === "monitor").length,
    parked: signals.filter((s) => s.classification === "parked").length,
    ignore: 0,
    sources: {
      arxiv: signals.filter((s) => s.source === "arxiv").length,
      github: signals.filter((s) => s.source === "github").length,
      huggingface: signals.filter(
        (s) => s.source === "huggingface_model" || s.source === "huggingface_paper"
      ).length,
    },
  };

  return { signals, summary, errors, ingestedAt: now };
}
