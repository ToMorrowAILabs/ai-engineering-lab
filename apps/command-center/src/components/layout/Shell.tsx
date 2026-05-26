"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/types";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sections = [...new Set(NAV_ITEMS.map((n) => n.section).filter(Boolean))];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-command-border bg-command-panel/50 p-4 lg:block">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-command-accent">ToMorrowAILabs.ai</p>
          <h1 className="text-lg font-semibold">Command Center</h1>
          <p className="text-xs text-gray-500">Private · 70/20/10</p>
        </div>
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
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-command-border px-4 py-3 lg:px-8">
          <div className="lg:hidden">
            <p className="font-semibold">Command Center</p>
          </div>
          <p className="text-xs text-gray-500">AI Engineering Lab · local JSON data · auth-ready</p>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
            v0.1
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
