import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";

/** §12 — editorial positioning statement on an asymmetric grid. */
export function Positioning() {
  return (
    <section className="relative py-32 lg:py-44">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-line-strong" />
              <span className="text-eyebrow">What we believe</span>
            </div>
            <AnimatedText
              as="h2"
              lines={["Technology should", "create leverage,", "not complexity."]}
              className="text-display text-[clamp(2.25rem,5.6vw,4.5rem)]"
              lineClassName="text-fg"
            />
          </div>

          <div className="lg:col-span-5 lg:pt-32">
            <Reveal staggerChildren className="space-y-7">
              <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                BondByte combines strategy, design and engineering to turn
                ambitious ideas into reliable digital products.
              </p>
              <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                We work as one team across the whole build — the same people who
                shape the idea are the ones who ship it. That keeps decisions
                fast and the result coherent.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-line pt-8">
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Based in
                  </p>
                  <p className="mt-2 text-sm text-fg">Ahmedabad, Gujarat</p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Working with
                  </p>
                  <p className="mt-2 text-sm text-fg">Teams anywhere</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
