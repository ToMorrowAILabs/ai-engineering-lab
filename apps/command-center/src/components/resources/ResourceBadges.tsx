import type { Resource, SourceType } from "@/lib/types";

const SOURCE_ICONS: Record<SourceType, string> = {
  github_repo: "GH",
  youtube_playlist: "YT",
  course: "CR",
  paper: "PDF",
  book: "BK",
  docs: "DOC",
  web_book: "BK",
  video_playlist: "YT",
};

const SOURCE_COLORS: Record<SourceType, string> = {
  github_repo: "bg-gray-700 text-gray-200",
  youtube_playlist: "bg-red-500/20 text-red-300",
  course: "bg-blue-500/20 text-blue-300",
  paper: "bg-orange-500/20 text-orange-300",
  book: "bg-amber-500/20 text-amber-300",
  docs: "bg-indigo-500/20 text-indigo-300",
  web_book: "bg-amber-500/20 text-amber-300",
  video_playlist: "bg-red-500/20 text-red-300",
};

export function SourceTypeBadge({ type }: { type: SourceType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SOURCE_COLORS[type] ?? "bg-gray-700 text-gray-300"}`}
      title={type.replace(/_/g, " ")}
    >
      {SOURCE_ICONS[type] ?? "?"}
      <span className="hidden sm:inline">{type.replace(/_/g, " ")}</span>
    </span>
  );
}

export function ActionBadge({ action }: { action: Resource["action"] }) {
  const cls =
    action === "act_now"
      ? "badge-ready"
      : action === "monitor"
        ? "badge-monitor"
        : "badge-ignore";
  return <span className={cls}>{action.replace(/_/g, " ")}</span>;
}

export function ExternalResourceLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition hover:text-cyan-300 hover:decoration-cyan-300 ${className}`}
    >
      {children}
      <span className="ml-1 inline-block text-[10px] opacity-60" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export function PdfBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-orange-300">
      PDF
    </span>
  );
}
