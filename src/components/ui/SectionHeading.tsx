import { cn } from "@/lib/utils/cn";
import { AnimatedText } from "@/components/animations/AnimatedText";

interface SectionHeadingProps {
  eyebrow?: string;
  lines: readonly string[];
  description?: string;
  className?: string;
  align?: "left" | "center";
}

/** Consistent section header — eyebrow, masked headline, optional lead. */
export function SectionHeading({
  eyebrow,
  lines,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <div className="mb-6 flex items-center gap-3">
          {align === "left" && <span className="h-px w-8 bg-line-strong" />}
          <span className="text-eyebrow">{eyebrow}</span>
        </div>
      )}
      <AnimatedText
        as="h2"
        lines={lines}
        className="text-display text-[clamp(2.1rem,5.2vw,4rem)] text-fg"
      />
      {description && (
        <p
          className={cn(
            "mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
