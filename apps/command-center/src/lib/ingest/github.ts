/**
 * GitHub trending ingester.
 * Uses the GitHub Search API (unauthenticated, 10 req/min limit).
 * Fetches repos with most stars this week matching ML/AI topics.
 */

export type GithubRepo = {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  topics: string[];
  pushedAt: string;
};

const AI_QUERY = [
  "topic:machine-learning",
  "topic:deep-learning",
  "topic:llm",
  "topic:rag",
  "topic:transformers",
].join("+OR+");

const GITHUB_API =
  `https://api.github.com/search/repositories?q=${AI_QUERY}&sort=stars&order=desc&per_page=15`;

export async function fetchGithubTrending(
  token?: string,
  signal?: AbortSignal
): Promise<GithubRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(GITHUB_API, {
    headers,
    signal,
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();
  const items = (data.items ?? []) as Record<string, unknown>[];

  return items.map((r) => ({
    id: String(r.id),
    name: String(r.name ?? ""),
    fullName: String(r.full_name ?? ""),
    description: String(r.description ?? "").slice(0, 200),
    stars: Number(r.stargazers_count ?? 0),
    language: String(r.language ?? ""),
    url: String(r.html_url ?? ""),
    topics: (r.topics as string[]) ?? [],
    pushedAt: String((r.pushed_at as string | undefined)?.slice(0, 10) ?? ""),
  }));
}
