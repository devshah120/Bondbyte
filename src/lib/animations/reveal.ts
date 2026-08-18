"use client";

import { EASE, prefersReducedMotion, registerGsap, ScrollTrigger } from "./gsap";

export interface RevealOptions {
  /** Elements to stagger in. Defaults to the target itself. */
  targets?: Element | Element[] | NodeListOf<Element>;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
}

/**
 * Scroll-triggered reveal: opacity + rise + a touch of blur (§10).
 * Returns a cleanup function for use in useEffect.
 */
export function createReveal(
  trigger: Element,
  options: RevealOptions = {},
): () => void {
  const gsap = registerGsap();
  const {
    targets = trigger,
    y = 28,
    duration = 1.05,
    stagger = 0.08,
    delay = 0,
    start = "top 85%",
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      targets,
      { opacity: 0, y, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        stagger,
        delay,
        ease: EASE.out,
        scrollTrigger: { trigger, start, once: true },
      },
    );
  });

  return () => {
    ctx.revert();
    ScrollTrigger.refresh();
  };
}
