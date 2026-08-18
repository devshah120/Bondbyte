"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, SearchX } from "lucide-react";
import {
  PUBLISHED_INSIGHTS,
  formatInsightDate,
  type InsightCategory,
} from "@/lib/constants/insights";
import { InsightCover } from "@/components/ui/InsightCover";
import { cn } from "@/lib/utils/cn";

/**
 * Editorial index: one horizontal row per article — generated cover art on the
 * left, metadata and headline on the right. Category filtering is client-side
 * and animated, with an empty state for a category holding nothing.
 */
export function InsightsList() {
  const [category, setCategory] = useState<InsightCategory | null>(null);

  // Only offer categories that actually have published articles.
  const categories = useMemo(() => {
    const counts = new Map<InsightCategory, number>();
    for (const insight of PUBLISHED_INSIGHTS) {
      counts.set(insight.category, (counts.get(insight.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const visible = useMemo(
    () =>
      category === null
        ? PUBLISHED_INSIGHTS
        : PUBLISHED_INSIGHTS.filter((i) => i.category === category),
    [category],
  );

  return (
    <section className="border-t border-line py-16 lg:py-24">
      <div className="container-page">
        {/* Category filter */}
        <div
          role="tablist"
          aria-label="Filter articles by category"
          className="mb-10 flex flex-wrap gap-2"
        >
          <Chip
            label="All"
            count={PUBLISHED_INSIGHTS.length}
            active={category === null}
            onClick={() => setCategory(null)}
          />
          {categories.map(([name, count]) => (
            <Chip
              key={name}
              label={name}
              count={count}
              active={category === name}
              onClick={() => setCategory(category === name ? null : name)}
            />
          ))}
        </div>

        <motion.ul layout className="mx-auto max-w-4xl space-y-5">
          <AnimatePresence mode="popLayout">
            {visible.map((insight) => (
              <motion.li
                key={insight.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/insights/${insight.slug}`}
                  data-cursor="view"
                  className="group flex flex-col gap-5 rounded-xl border border-line bg-surface p-4 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_18px_50px_-30px] hover:shadow-accent/50 sm:flex-row sm:gap-7 sm:p-5"
                >
                  <InsightCover
                    insight={insight}
                    className="h-36 w-full shrink-0 rounded-lg sm:h-40 sm:w-56 lg:w-64"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                      <span className="text-accent">{insight.category}</span>
                      <span className="text-fg-subtle" aria-hidden>
                        ·
                      </span>
                      <span className="text-fg-subtle">
                        {formatInsightDate(insight.date)}
                      </span>
                      <span className="text-fg-subtle" aria-hidden>
                        ·
                      </span>
                      <span className="text-fg-subtle">{insight.readTime}</span>
                    </div>

                    <h2 className="mt-3 text-[1.25rem] font-semibold leading-[1.25] tracking-tight text-fg transition-colors duration-300 group-hover:text-accent lg:text-[1.5rem]">
                      {insight.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-relaxed text-fg-muted">
                      {insight.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                      Read post
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center"
          >
            <SearchX className="h-6 w-6 text-fg-subtle" />
            <p className="mt-4 text-[0.9375rem] font-medium text-fg">
              Nothing published in this category yet.
            </p>
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="mt-3 text-[0.875rem] text-accent underline underline-offset-4"
            >
              Show all articles
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-all duration-300",
        active
          ? "border-accent bg-accent text-white"
          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {label}
      <span className={cn("tabular-nums", active ? "text-white/70" : "text-fg-subtle")}>
        {count}
      </span>
    </button>
  );
}
