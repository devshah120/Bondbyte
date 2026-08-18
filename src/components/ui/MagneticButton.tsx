"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { createMagnetic } from "@/lib/animations/magnetic";
import { cn } from "@/lib/utils/cn";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  showArrow?: boolean;
}

/** Primary CTA: magnetic pull, arrow travel and accent glow on hover (§7). */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  showArrow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return createMagnetic(ref.current, { strength: 0.28 });
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      data-cursor="cta"
      className={cn(
        "group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-300",
        variant === "primary"
          ? "bg-fg text-bg hover:bg-accent hover:text-white"
          : "border border-line-strong text-fg hover:border-accent/50 hover:bg-accent/[0.06]",
        className,
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -z-10 rounded-full bg-accent/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      )}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
      )}
    </Link>
  );
}
