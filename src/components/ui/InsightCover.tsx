import type { Insight } from "@/lib/constants/insights";
import { cn } from "@/lib/utils/cn";

/**
 * Generated cover art for an insight.
 *
 * Each article gets a designed title card instead of a stock photo — the
 * headline is set into the artwork, the way a real editorial thumbnail works.
 * Variant is chosen from the slug so a given article always renders the same
 * card (no hydration mismatch, no random flicker).
 */

const VARIANTS = [
  // deep navy, terminal-ish
  {
    surface: "bg-[#0c1832]",
    glow: "bg-accent/25",
    title: "text-white",
    accent: "text-accent-hi",
  },
  // saturated blue
  {
    surface: "bg-accent-dim",
    glow: "bg-white/15",
    title: "text-white",
    accent: "text-white/70",
  },
  // near-black
  {
    surface: "bg-[#0a1120]",
    glow: "bg-accent-hi/20",
    title: "text-white",
    accent: "text-accent-hi",
  },
] as const;

/** Stable per-slug hash so the same article always picks the same variant. */
function variantFor(slug: string): (typeof VARIANTS)[number] {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return VARIANTS[Math.abs(hash) % VARIANTS.length];
}

/**
 * Splits the title into a short lead and the remainder, so the card reads as
 * designed type rather than one long wrapped string.
 */
function splitTitle(title: string): [string, string] {
  const words = title.split(" ");
  if (words.length <= 3) return [title, ""];
  const head = Math.min(4, Math.ceil(words.length / 2));
  return [words.slice(0, head).join(" "), words.slice(head).join(" ")];
}

export function InsightCover({
  insight,
  className,
  compact = false,
}: {
  insight: Insight;
  className?: string;
  compact?: boolean;
}) {
  const variant = variantFor(insight.slug);
  const [lead, rest] = splitTitle(insight.title);
  const year = insight.date.slice(0, 4);

  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden",
        variant.surface,
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-[0.18]" />
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full blur-[60px]",
          variant.glow,
        )}
      />

      {/* Decorative byte blocks, echoing the logo mark */}
      <div className="pointer-events-none absolute bottom-0 right-0 opacity-[0.14]">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
          <rect x="70" y="90" width="34" height="34" rx="5" fill="currentColor" className="text-white" />
          <rect x="108" y="90" width="34" height="34" rx="5" fill="currentColor" className="text-white" />
          <rect x="108" y="52" width="34" height="34" rx="5" fill="currentColor" className="text-white" />
          <rect x="70" y="128" width="34" height="18" rx="5" fill="currentColor" className="text-white" />
        </svg>
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col justify-between",
          compact ? "p-4" : "p-5 lg:p-6",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="0" y="9" width="5" height="5" rx="1" fill="currentColor" className={variant.accent} />
              <rect x="6" y="5" width="5" height="5" rx="1" fill="currentColor" className={variant.accent} opacity="0.75" />
              <rect x="11" y="1" width="4" height="4" rx="1" fill="currentColor" className={variant.accent} opacity="0.5" />
            </svg>
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-2">
          <p
            className={cn(
              "font-semibold leading-[1.15] tracking-tight",
              variant.title,
              compact ? "text-[0.95rem]" : "text-[1.05rem] lg:text-[1.25rem]",
            )}
          >
            {lead}
          </p>
          {rest && (
            <p
              className={cn(
                "font-semibold leading-[1.15] tracking-tight",
                variant.accent,
                compact ? "text-[0.95rem]" : "text-[1.05rem] lg:text-[1.25rem]",
              )}
            >
              {rest}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between">
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-white/35">
            bondbyte.in
          </span>
          <span className="font-mono text-[0.5rem] tracking-[0.14em] text-white/35">
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}
