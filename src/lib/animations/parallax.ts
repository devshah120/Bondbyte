"use client";

import { prefersReducedMotion, registerGsap } from "./gsap";

/** Subtle scroll parallax. `distance` is total travel in pixels. */
export function createParallax(
  target: Element,
  options: { distance?: number; scale?: number; trigger?: Element } = {},
): () => void {
  const gsap = registerGsap();
  const { distance = 70, scale, trigger = target } = options;

  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      target,
      { yPercent: -distance / 20, ...(scale ? { scale } : {}) },
      {
        yPercent: distance / 20,
        ...(scale ? { scale: 1 } : {}),
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });

  return () => ctx.revert();
}
