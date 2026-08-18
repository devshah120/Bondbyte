"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import {
  TECHNOLOGIES,
  TECH_CATEGORIES,
  type TechCategory,
} from "@/lib/constants/technology";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";
import { cn } from "@/lib/utils/cn";

/**
 * Technology grid with a working category filter.
 *
 * Filtering genuinely removes non-matching entries (an earlier version only
 * dimmed them, which read as "the filter does nothing"). Framer Motion's
 * layout animation handles the reflow so items move rather than jump, and an
 * explicit empty state covers a category with no entries.
 */
export function TechnologySection() {
  const [active, setActive] = useState<TechCategory | null>(null);

  const visible = useMemo(
    () =>
      active === null
        ? TECHNOLOGIES
        : TECHNOLOGIES.filter((tech) => tech.category === active),
    [active],
  );

  // Only offer categories that actually contain something.
  const categories = useMemo(
    () =>
      TECH_CATEGORIES.filter((category) =>
        TECHNOLOGIES.some((tech) => tech.category === category),
      ),
    [],
  );

  return (
    <section id="technology" className="relative border-t border-line py-28 lg:py-36">
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Technology"
          lines={["We build with technology", "that gets out of the way."]}
          description="Tools chosen for the problem, not the trend. This is the stack we actually ship with."
          className="mb-12"
        />

        <div
          role="tablist"
          aria-label="Filter technologies by category"
          className="mb-12 flex flex-wrap gap-2"
        >
          <FilterChip
            label="All"
            count={TECHNOLOGIES.length}
            active={active === null}
            onClick={() => setActive(null)}
          />
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              count={TECHNOLOGIES.filter((t) => t.category === category).length}
              active={active === category}
              onClick={() => setActive(active === category ? null : category)}
            />
          ))}
        </div>

        <motion.ul
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((tech) => (
              <motion.li
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-7 transition-colors duration-300 hover:border-accent/40"
              >
                <TechIcon
                  name={tech.name}
                  className="h-8 w-8 text-fg-muted transition-colors duration-300 group-hover:text-accent"
                />
                <span className="text-center text-[0.8125rem] font-medium tracking-tight text-fg">
                  {tech.name}
                </span>
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-fg-subtle">
                  {tech.category}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Cannot happen with current data, but the filter is data-driven —
            a future category with no entries must degrade gracefully. */}
        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center"
          >
            <SearchX className="h-6 w-6 text-fg-subtle" />
            <p className="mt-4 text-[0.9375rem] font-medium text-fg">
              Nothing in this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-3 text-[0.875rem] text-accent underline underline-offset-4"
            >
              Show all technologies
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
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
