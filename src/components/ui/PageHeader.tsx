import { AnimatedText } from "@/components/animations/AnimatedText";

interface PageHeaderProps {
  eyebrow: string;
  lines: readonly string[];
  description?: string;
}

/** Consistent dark masthead for every interior page, mirroring the Insights page. */
export function PageHeader({ eyebrow, lines, description }: PageHeaderProps) {
  return (
    <section
      data-band="dark"
      className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28"
    >
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_30%_30%,#000_10%,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-32 top-16 h-[26rem] w-[26rem] rounded-full bg-accent/[0.10] blur-[130px]" />

      <div className="container-page relative">
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px w-8 bg-line-strong" />
          <span className="text-eyebrow">{eyebrow}</span>
        </div>

        <AnimatedText
          as="h1"
          lines={lines}
          className="text-display max-w-4xl text-[clamp(2.4rem,6.4vw,4.75rem)]"
          onScroll={false}
        />

        {description && (
          <p className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-fg-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
