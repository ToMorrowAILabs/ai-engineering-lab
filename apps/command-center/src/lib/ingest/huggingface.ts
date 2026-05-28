/**
 * HuggingFace ingester — fetches trending models and papers.
 * Uses the public HF Hub API. No key required for public resources.
 */

export type HFModel = {
  id: string;
  modelId: string;
  downloads: number;
  likes: number;
  tags: string[];
  pipeline_tag: string;
  url: string;
  lastModified: string;
};

export type HFPaper = {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  upvotes: number;
};

export async function fetchHFTrendingModels(signal?: AbortSignal): Promise<HFModel[]> {
  const url =
    "https://huggingface.co/api/models?sort=likes7d&limit=15&direction=-1";

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`HF models API error: ${res.status}`);

  const data = await res.json() as Record<string, unknown>[];

  return data.map((m) => ({
    id: String(m.id ?? m.modelId ?? ""),
    modelId: String(m.modelId ?? m.id ?? ""),
    downloads: Number(m.downloads ?? 0),
    likes: Number(m.likes ?? 0),
    tags: (m.tags as string[]) ?? [],
    pipeline_tag: String(m.pipeline_tag ?? ""),
    url: `https://huggingface.co/${String(m.modelId ?? m.id ?? "")}`,
    lastModified: String((m.lastModified as string | undefined)?.slice(0, 10) ?? ""),
  }));
}

export async function fetchHFTrendingPapers(signal?: AbortSignal): Promise<HFPaper[]> {
  const url = "https://huggingface.co/api/daily_papers?limit=15";

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`HF papers API error: ${res.status}`);

  const data = await res.json() as Record<string, unknown>[];

  return data.map((p) => {
    const paper = (p.paper as Record<string, unknown>) ?? p;
    const id = String(paper.id ?? p.id ?? "");
    return {
      id,
      title: String(paper.title ?? ""),
      summary: String((paper.summary as string | undefined)?.slice(0, 300) ?? ""),
      url: `https://huggingface.co/papers/${id}`,
      publishedAt: String((paper.publishedAt as string | undefined)?.slice(0, 10) ?? ""),
      upvotes: Number(p.numComments ?? paper.upvotes ?? 0),
    };
  });
}
