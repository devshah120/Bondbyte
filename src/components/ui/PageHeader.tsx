import { AnimatedText } from "@/components/animations/AnimatedText";

interface PageHeaderProps {
  eyebrow: string;
  lines: readonly string[];
  description?: string;
}

/** Consistent hero band for every interior page. */
export function PageHeader({ eyebrow, lines, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 lg:pt-48 lg:pb-28">
      <div className="bg-grid absolute inset-x-0 top-0 h-[34rem] opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="pointer-events-none absolute -right-40 top-24 h-[26rem] w-[26rem] rounded-full bg-accent/[0.07] blur-[120px]" />

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
          <p className="mt-9 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
