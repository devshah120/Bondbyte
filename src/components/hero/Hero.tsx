"use client";

import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE, prefersReducedMotion, registerGsap } from "@/lib/animations/gsap";
import { SITE } from "@/lib/constants/site";

/** Hero with the staged GSAP entrance timeline from §10. */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-hero]"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      tl.fromTo(
        "[data-hero='eyebrow']",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.2,
      )
        .fromTo(
          "[data-hero='line-1']",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.25 },
          0.4,
        )
        .fromTo(
          "[data-hero='line-2']",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.25 },
          0.55,
        )
        .fromTo(
          "[data-hero='support']",
          { opacity: 0, y: 18, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
          0.7,
        )
        .fromTo(
          "[data-hero='cta']",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.9,
        )
        .fromTo(
          "[data-hero='visual']",
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1.6 },
          1.2,
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-band="dark"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      {/* Layered backdrop: grid + radial glow */}
      <div data-hero="visual" className="absolute inset-0 opacity-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,#000_10%,transparent_72%)]" />
        <div className="pointer-events-none absolute -right-1/4 top-1/4 h-[36rem] w-[36rem] rounded-full bg-accent/[0.09] blur-[130px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="container-page relative">
        <div className="max-w-4xl">
          <div data-hero="eyebrow" className="mb-9 flex items-center gap-3 opacity-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-hi opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-hi" />
            </span>
            <span className="text-eyebrow">
              Digital product studio
            </span>
          </div>

          <h1 className="text-display text-[clamp(2.5rem,8.4vw,6.25rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line-1" className="block">
                Your idea. Our code.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line-2" className="block text-accent-hi">
                Live within 48 hours.
              </span>
            </span>
          </h1>

          <p
            data-hero="support"
            className="mt-9 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted opacity-0 sm:text-[1.15rem]"
          >
            We design, build and ship production software — landing pages and
            stores in 48 hours, full products in weeks. Strategy, design and
            engineering under one roof.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <div data-hero="cta" className="opacity-0">
              <MagneticButton href="/contact">Start a Project</MagneticButton>
            </div>
            <div data-hero="cta" className="opacity-0">
              <MagneticButton href="/work" variant="secondary">
                Explore Our Work
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
