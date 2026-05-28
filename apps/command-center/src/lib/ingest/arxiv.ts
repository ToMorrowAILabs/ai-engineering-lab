/**
 * arXiv ingester — fetches recent papers matching AI/ML topics.
 * Uses the free arXiv Atom API: https://export.arxiv.org/api/query
 * No API key required.
 */

export type ArxivPaper = {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
  categories: string[];
};

const SEARCH_QUERY = [
  "cat:cs.LG",       // Machine Learning
  "cat:cs.AI",       // Artificial Intelligence
  "cat:cs.CL",       // Computation and Language
  "cat:stat.ML",     // Statistics ML
].join("+OR+");

const ARXIV_API_URL =
  `https://export.arxiv.org/api/query?search_query=${SEARCH_QUERY}&sortBy=submittedDate&sortOrder=descending&max_results=20`;

function extractText(xmlStr: string, tag: string): string {
  const match = xmlStr.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function extractAll(xmlStr: string, tag: string): string[] {
  const results: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(xmlStr)) !== null) {
    const text = m[1].replace(/\s+/g, " ").trim();
    if (text) results.push(text);
  }
  return results;
}

export async function fetchArxivPapers(signal?: AbortSignal): Promise<ArxivPaper[]> {
  const res = await fetch(ARXIV_API_URL, {
    signal,
    headers: { Accept: "application/atom+xml" },
    next: { revalidate: 3600 }, // cache 1h
  });

  if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);

  const xml = await res.text();

  // Extract entries
  const entries: ArxivPaper[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  let m: RegExpExecArray | null;

  while ((m = entryRe.exec(xml)) !== null) {
    const entry = m[1];
    const idRaw = extractText(entry, "id");
    const arxivId = idRaw.split("/abs/")[1] ?? idRaw;
    const title = extractText(entry, "title");
    const summary = extractText(entry, "summary").slice(0, 400);
    const published = extractText(entry, "published");
    const authors = extractAll(entry, "name");
    const categories = extractAll(entry, "category")
      .map((c) => {
        const termMatch = c.match(/term="([^"]+)"/);
        return termMatch ? termMatch[1] : c;
      })
      .filter(Boolean);

    if (title && arxivId) {
      entries.push({
        id: arxivId,
        title,
        summary,
        authors,
        published: published.slice(0, 10),
        link: `https://arxiv.org/abs/${arxivId}`,
        categories,
      });
    }
  }

  return entries;
}
