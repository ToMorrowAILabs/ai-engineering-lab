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
