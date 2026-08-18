"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_STEPS } from "@/lib/constants/company";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { registerGsap, prefersReducedMotion, ScrollTrigger } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";

/**
 * Editorial process timeline for the About page.
 *
 * A progress rail fills as the section scrolls and the step nearest the
 * viewport centre becomes active — so the reader always knows where they are.
 * Under reduced motion the rail is drawn fully and every step reads as active.
 */
export function ProcessTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;

    if (prefersReducedMotion()) {
      rail.style.transform = "scaleY(1)";
      return;
    }

    const gsap = registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "bottom 75%",
            scrub: 0.6,
          },
        },
      );

      // Mark the step nearest the middle of the viewport as active.
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActiveStep(i);
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section data-band="tint" className="border-t border-line py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Process"
          lines={["From first conversation", "to production."]}
          description="Four stages, one team. You see working software throughout, not a reveal at the end."
          className="mb-16 lg:mb-24"
        />

        <div ref={rootRef} className="relative">
          {/* Progress rail — desktop only */}
          <div className="absolute left-[7.5rem] top-2 hidden h-full w-px bg-line lg:block">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-accent"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <ol className="space-y-14 lg:space-y-24">
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <li
                  key={step.index}
                  data-step
                  className="relative lg:grid lg:grid-cols-[7.5rem_1fr] lg:gap-14"
                >
                  {/* Step number + node */}
                  <div className="flex items-center gap-4 lg:block">
                    <span
                      className={cn(
                        "font-mono text-[0.75rem] tracking-[0.18em] transition-colors duration-500",
                        isActive ? "text-accent" : "text-fg-subtle",
                      )}
                    >
                      {step.index}
                    </span>
                    <span className="h-px flex-1 bg-line lg:hidden" />
                  </div>

                  {/* Node dot on the rail */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[7.5rem] top-1.5 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 transition-all duration-500 lg:block",
                      isActive
                        ? "scale-125 border-accent bg-accent"
                        : "border-line-strong bg-bg",
                    )}
                  />

                  <div
                    className={cn(
                      "mt-4 transition-opacity duration-500 lg:mt-0",
                      isActive ? "opacity-100" : "lg:opacity-55",
                    )}
                  >
                    <h3 className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight text-fg">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
