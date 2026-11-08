import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";

export interface PositioningData {
  eyebrow: string;
  heading: string[];
  paragraphs: string[];
  fact1Label: string;
  fact1Value: string;
  fact2Label: string;
  fact2Value: string;
}

/** §12 — editorial positioning statement on an asymmetric grid. */
export function Positioning({ data }: { data: PositioningData }) {
  const facts = [
    [data.fact1Label, data.fact1Value],
    [data.fact2Label, data.fact2Value],
  ].filter(([label, value]) => label || value);

  return (
    <section className="relative py-32 lg:py-44">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            {data.eyebrow && (
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-8 bg-line-strong" />
                <span className="text-eyebrow">{data.eyebrow}</span>
              </div>
            )}
            <AnimatedText
              as="h2"
              lines={data.heading}
              className="text-display text-[clamp(2.25rem,5.6vw,4.5rem)]"
              lineClassName="text-fg"
            />
          </div>

          <div className="lg:col-span-5 lg:pt-32">
            <Reveal staggerChildren className="space-y-7">
              {data.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  {paragraph}
                </p>
              ))}
              {facts.length > 0 && (
                <div className="grid grid-cols-2 gap-8 border-t border-line pt-8">
                  {facts.map(([label, value]) => (
                    <div key={label}>
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                        {label}
                      </p>
                      <p className="mt-2 text-sm text-fg">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
