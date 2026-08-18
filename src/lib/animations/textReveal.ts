"use client";

import { EASE, prefersReducedMotion, registerGsap } from "./gsap";

/**
 * Line-by-line masked text reveal. Expects children wrapped in
 * overflow-hidden line containers (see <AnimatedText />).
 */
export function createTextReveal(
  lines: Element[],
  options: { delay?: number; trigger?: Element; stagger?: number } = {},
): () => void {
  const gsap = registerGsap();
  const { delay = 0, trigger, stagger = 0.09 } = options;

  if (prefersReducedMotion()) {
    gsap.set(lines, { yPercent: 0, opacity: 1 });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      lines,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.15,
        stagger,
        delay,
        ease: EASE.out,
        ...(trigger
          ? { scrollTrigger: { trigger, start: "top 85%", once: true } }
          : {}),
      },
    );
  });

  return () => ctx.revert();
}
