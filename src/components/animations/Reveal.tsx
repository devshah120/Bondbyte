"use client";

import { useEffect, useRef } from "react";
import { createReveal } from "@/lib/animations/reveal";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Stagger direct children instead of revealing the block as one unit. */
  staggerChildren?: boolean;
}

/** Declarative wrapper around the scroll reveal utility. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  staggerChildren = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = staggerChildren
      ? Array.from(el.children)
      : undefined;
    return createReveal(el, { delay, y, ...(targets ? { targets } : {}) });
  }, [delay, y, staggerChildren]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
