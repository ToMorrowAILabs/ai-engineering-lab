import Link from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

/** Primary filled CTA — cyan, high-contrast. Use for the single most important action. */
export function CtaButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: React.ReactNode; className?: string } & Omit<LinkProps, "href">) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 active:bg-cyan-600 ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Secondary outlined button — cyan border, use for supporting actions. */
export function GhostButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: React.ReactNode; className?: string } & Omit<LinkProps, "href">) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/60 hover:bg-cyan-500/10 ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Warning / remediation button — amber, use for weak-topic or fix-it actions. */
export function WarnButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: React.ReactNode; className?: string } & Omit<LinkProps, "href">) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-1.5 text-sm font-medium text-amber-400 transition hover:border-amber-500/60 hover:bg-amber-500/10 ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/**
 * Clickable metric card — label + large value + "View →" affordance.
 * Use in place of static KPI boxes where the value maps to a page.
 */
export function LinkStatCard({
  href,
  label,
  value,
  accent,
}: {
  href: string;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card flex flex-col gap-1 p-4 group"
      aria-label={`${label}: ${value} — click to view`}
    >
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-2xl font-bold ${accent ?? "text-white"}`}>{value}</span>
      <span className="mt-1 text-[10px] text-cyan-400/50 transition group-hover:text-cyan-400">
        View →
      </span>
    </Link>
  );
}

/** Violet/frontier button — for parked/deferred topics. */
export function FrontierButton({
  href,
  children,
  className = "",
  ...rest
}: { href: string; children: React.ReactNode; className?: string } & Omit<LinkProps, "href">) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-violet-500/40 px-3 py-1.5 text-sm font-medium text-violet-400 transition hover:border-violet-500/60 hover:bg-violet-500/10 ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
