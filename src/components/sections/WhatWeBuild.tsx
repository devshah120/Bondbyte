"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CAPABILITIES } from "@/lib/constants/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { registerGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";

const TONE_GRADIENT: Record<string, string> = {
  indigo: "from-indigo-500/30 to-blue-500/10",
  amber: "from-amber-500/30 to-orange-500/10",
  rose: "from-rose-500/30 to-pink-500/10",
  emerald: "from-emerald-500/30 to-teal-500/10",
  slate: "from-slate-400/25 to-slate-500/10",
};

/**
 * Large interactive rows with a cursor-following preview panel.
 *
 * The preview is positioned with GSAP quickTo against a ref — the pointer
 * never touches React state, so moving the mouse costs no re-render. The
 * preview is suppressed on touch and coarse pointers, where the rows simply
 * read as a list.
 */
export function WhatWeBuild() {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current =
      window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();
    if (!canHover.current) return;

    const preview = previewRef.current;
    const list = listRef.current;
    if (!preview || !list) return;

    const gsap = registerGsap();
    const xTo = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
    };

    list.addEventListener("pointermove", onMove, { passive: true });
    return () => list.removeEventListener("pointermove", onMove);
  }, []);

  const activeItem = active !== null ? CAPABILITIES[active] : null;

  return (
    <section data-band="tint" className="relative border-t border-line py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="What we build"
          lines={["Digital products engineered", "for real-world impact."]}
          className="mb-14 lg:mb-20"
        />

        <div ref={listRef} className="relative">
          {/* Cursor-following preview — desktop only */}
          <div
            ref={previewRef}
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-20 hidden h-56 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-line-strong shadow-2xl transition-opacity duration-300 lg:block",
              activeItem ? "opacity-100" : "opacity-0",
            )}
          >
            {activeItem && (
              <div
                data-band="dark"
                className="relative flex h-full w-full flex-col justify-between p-6"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    TONE_GRADIENT[activeItem.tone],
                  )}
                />
                <div className="bg-grid absolute inset-0 opacity-50" />
                <span className="relative font-mono text-[0.625rem] uppercase tracking-[0.18em] text-fg-subtle">
                  {activeItem.index}
                </span>
                <div className="relative">
                  <p className="text-[1.15rem] font-medium tracking-tight text-fg">
                    {activeItem.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {activeItem.examples.slice(0, 3).map((example) => (
                      <span
                        key={example}
                        className="rounded border border-line px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-fg-muted"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <ul className="border-t border-line">
            {CAPABILITIES.map((item, i) => {
              const isActive = active === i;
              const dimmed = active !== null && !isActive;

              return (
                <li
                  key={item.index}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    "group relative border-b border-line transition-opacity duration-500",
                    dimmed && "opacity-40",
                  )}
                >
                  <Link
                    href="/services"
                    className="relative flex items-center gap-5 py-6 lg:gap-10 lg:py-8"
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-full w-px bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive ? "scale-y-100" : "scale-y-0",
                      )}
                    />
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] tracking-[0.16em] transition-all duration-500",
                        isActive ? "translate-x-2 text-accent" : "text-fg-subtle",
                      )}
                    >
                      {item.index}
                    </span>

                    <div
                      className={cn(
                        "flex-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive && "lg:translate-x-3",
                      )}
                    >
                      <h3 className="text-[1.5rem] font-medium tracking-tight text-fg lg:text-[2.25rem]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-fg-muted lg:text-[0.9375rem]">
                        {item.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive
                          ? "translate-x-0 translate-y-0 text-accent opacity-100"
                          : "-translate-x-2 translate-y-2 text-fg-subtle opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
