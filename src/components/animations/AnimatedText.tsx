"use client";

import { useEffect, useRef } from "react";
import { createTextReveal } from "@/lib/animations/textReveal";
import { cn } from "@/lib/utils/cn";

interface AnimatedTextProps {
  /** Each entry becomes one masked line. */
  lines: readonly (string | React.ReactNode)[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Reveal on scroll rather than immediately on mount. */
  onScroll?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}

/** Masked line-by-line text reveal used for all editorial headlines. */
export function AnimatedText({
  lines,
  className,
  lineClassName,
  delay = 0,
  onScroll = true,
  as: Tag = "div",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const inner = Array.from(container.querySelectorAll<HTMLElement>("[data-line-inner]"));
    if (inner.length === 0) return;

    return createTextReveal(inner, {
      delay,
      trigger: onScroll ? container : undefined,
    });
  }, [delay, onScroll]);

  return (
    <Tag ref={containerRef as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <span data-line-inner className={cn("block will-change-transform", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
