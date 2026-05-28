"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/types";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = [...new Set(NAV_ITEMS.map((n) => n.section).filter(Boolean))];

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navContent = (
    <nav className="space-y-4">
      {sections.map((section) => (
        <div key={section}>
          <p className="mb-2 text-xs font-medium uppercase text-gray-500">{section}</p>
          <ul className="space-y-1">
            {NAV_ITEMS.filter((n) => n.section === section).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    pathname === item.href
                      ? "bg-cyan-500/15 text-command-accent"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-command-border bg-command-panel/50 p-4 lg:block">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-command-accent">ToMorrowAILabs.ai</p>
          <h1 className="text-lg font-semibold">Command Center</h1>
          <p className="text-xs text-gray-500">Private · 70/20/10</p>
        </div>
        {navContent}
      </aside>

      {/* Mobile slide-over overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-command-panel border-r border-command-border p-4 transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-command-accent">ToMorrowAILabs.ai</p>
            <h1 className="text-lg font-semibold">Command Center</h1>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {navContent}
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-command-border px-4 py-3 lg:px-8">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="font-semibold lg:hidden">Command Center</p>

          {/* Command palette trigger — center/right of header */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <CommandPalette />
            <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 sm:inline">
              v0.5
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
