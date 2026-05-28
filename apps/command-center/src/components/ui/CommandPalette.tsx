"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/app/api/search-index/route";

const CATEGORY_ORDER = ["action", "page", "lesson", "resource"];
const CATEGORY_LABELS: Record<string, string> = {
  action: "Quick Actions",
  page: "Pages",
  lesson: "Lessons",
  resource: "Resources",
  topic: "Topics",
};

function score(item: SearchItem, query: string): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  const sublabel = (item.sublabel ?? "").toLowerCase();
  const keywords = (item.keywords ?? []).join(" ").toLowerCase();

  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (sublabel.includes(q)) return 40;
  if (keywords.includes(q)) return 20;
  return 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch index once on first open
  const fetchIndex = useCallback(async () => {
    if (items.length > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search-index");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [items.length]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      fetchIndex();
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open, fetchIndex]);

  // Filtered and sorted results
  const filtered: SearchItem[] = query.trim()
    ? items
        .map((item) => ({ item, s: score(item, query.trim()) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 12)
        .map(({ item }) => item)
    : items.filter((i) => i.category === "action" || i.category === "page").slice(0, 10);

  // Group by category
  const grouped: Record<string, SearchItem[]> = {};
  for (const item of filtered) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  // Flat list for keyboard navigation
  const flatList = CATEGORY_ORDER.flatMap((cat) => grouped[cat] ?? []);

  const navigate = (item: SearchItem) => {
    setOpen(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = flatList[selectedIndex];
      if (item) navigate(item);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-command-border bg-command-panel/60 px-3 py-1.5 text-xs text-gray-500 transition hover:border-cyan-500/40 hover:text-gray-300"
        aria-label="Open command palette"
      >
        <span>⌘K Search…</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed left-1/2 top-[12vh] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0d1525] shadow-2xl shadow-black/50"
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-command-border px-4 py-3">
          <span className="shrink-0 text-gray-500">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, resources, pages…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {loading && <span className="text-xs text-gray-600">Loading…</span>}
          <kbd className="rounded border border-gray-700 px-1.5 py-0.5 text-[10px] text-gray-600">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {flatList.length === 0 && query.trim() && (
            <p className="py-6 text-center text-sm text-gray-600">No results for &ldquo;{query}&rdquo;</p>
          )}

          {CATEGORY_ORDER.map((cat) => {
            const catItems = grouped[cat];
            if (!catItems?.length) return null;
            return (
              <div key={cat} className="mb-2">
                <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  {CATEGORY_LABELS[cat] ?? cat}
                </p>
                {catItems.map((item) => {
                  const globalIdx = flatList.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-cyan-500/15 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span
                        className={`shrink-0 text-base ${isSelected ? "text-cyan-400" : "text-gray-600"}`}
                      >
                        {item.icon ?? "›"}
                      </span>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      {item.sublabel && (
                        <span className="shrink-0 truncate text-xs text-gray-600 max-w-[160px]">
                          {item.sublabel}
                        </span>
                      )}
                      {isSelected && (
                        <kbd className="shrink-0 rounded border border-cyan-500/30 px-1.5 py-0.5 text-[10px] text-cyan-500">
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {flatList.length === 0 && !query.trim() && (
            <p className="py-6 text-center text-sm text-gray-600">
              Type to search, or use ↑↓ to navigate
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-command-border px-4 py-2 text-[10px] text-gray-700">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span className="text-cyan-500/40">ToMorrowAILabs ⌘K</span>
        </div>
      </div>
    </>
  );
}
