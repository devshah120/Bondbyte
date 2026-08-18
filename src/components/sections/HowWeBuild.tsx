"use client";

import { useEffect, useRef } from "react";
import { PRINCIPLES } from "@/lib/constants/company";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";
import { createParallax } from "@/lib/animations/parallax";

/**
 * "The difference is how we build" — the argument that BondByte is not
 * competing on price. Sits at the top of the pricing page so the quality
 * case is made before any number appears.
 */
export function HowWeBuild() {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = markRef.current;
    if (!el) return;
    return createParallax(el, { distance: 40 });
  }, []);

  return (
    <section
      data-band="dark"
      className="relative overflow-hidden border-t border-line py-28 lg:py-40"
    >
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_30%_20%,#000_5%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-accent/[0.10] blur-[140px]" />

      <div className="container-page relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-line-strong" />
              <span className="text-eyebrow">Why we cost what we cost</span>
            </div>

            <AnimatedText
              as="h2"
              lines={["The difference", "is how we build."]}
              className="text-display text-[clamp(2.4rem,6.5vw,4.75rem)]"
            />

            <Reveal delay={0.1} className="mt-9 space-y-5">
              <p className="max-w-lg text-[1.15rem] leading-relaxed text-fg">
                Anyone can quote a lower number. The question is what arrives,
                and what it costs you to live with it afterwards.
              </p>
              <p className="max-w-lg text-[1.0625rem] leading-relaxed text-fg-muted">
                We are not the cheapest way to get software made, and we do not
                try to be. What we offer is work that is scoped honestly,
                engineered to be changed, and owned by you outright — so the
                second year costs less than the first rather than more.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal staggerChildren>
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.index}
                  className="group border-t border-line py-7 transition-colors duration-500 last:border-b"
                >
                  <div className="flex gap-6">
                    <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-hi">
                      {principle.index}
                    </span>
                    <div>
                      <h3 className="text-[1.25rem] font-medium tracking-tight text-fg">
                        {principle.title}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* Oversized supporting statement */}
        <div ref={markRef} className="mt-20 border-t border-line pt-12">
          <p className="max-w-4xl text-[clamp(1.35rem,3.2vw,2.25rem)] font-medium leading-[1.25] tracking-tight text-fg">
            Cheap software is only cheap until you need to change it.
            <span className="text-fg-subtle">
              {" "}
              We build the version that survives its own success.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
