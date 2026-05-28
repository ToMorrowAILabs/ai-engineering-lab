import Link from "next/link";
import type { ComponentProps } from "react";

const linkClass =
  "font-medium text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition hover:text-cyan-300 hover:decoration-cyan-300";

export function InternalLink({
  href,
  children,
  className = "",
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${linkClass} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export function ExternalLink({
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
      className={`${linkClass} ${className}`}
    >
      {children}
      <span className="ml-1 inline-block text-[10px] opacity-60" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export function OpenResourceButton({ href, label = "Open Resource" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
    >
      {label}
      <span className="text-xs opacity-70" aria-hidden>
        ↗
      </span>
    </a>
  );
}

export function LessonLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <InternalLink href={`/lessons/${slug}`}>{children}</InternalLink>;
}

export function ResourceDetailLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <InternalLink href={`/resources/${slug}`}>{children}</InternalLink>;
}

/**
 * Amber badge-pill that navigates to weakness-remediation filtered by topic.
 * Use for weak topic tags anywhere in the app.
 */
export function TopicFilterLink({ topic }: { topic: string }) {
  return (
    <Link
      href={`/weakness-remediation?topic=${encodeURIComponent(topic)}`}
      className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300 transition hover:border-amber-500/50 hover:bg-amber-500/25"
      aria-label={`Remediate ${topic.replace(/_/g, " ")}`}
    >
      {topic.replace(/_/g, " ")} →
    </Link>
  );
}

/**
 * Emerald badge-pill for strong topics — navigates to resources page.
 * Use to surface related learning material for mastered topics.
 */
export function StrongTopicLink({ topic }: { topic: string }) {
  return (
    <Link
      href="/resources"
      className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/25"
      aria-label={`Find resources for ${topic.replace(/_/g, " ")}`}
    >
      {topic.replace(/_/g, " ")} ↗
    </Link>
  );
}

/**
 * Disabled "resource pending" badge — shown when a resourceId can't be resolved.
 */
export function PendingResourceBadge({ id }: { id: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/50 px-2.5 py-0.5 text-xs text-gray-600"
      title={`Resource not yet loaded: ${id}`}
    >
      resource pending
    </span>
  );
}
