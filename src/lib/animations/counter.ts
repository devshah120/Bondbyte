"use client";

import { prefersReducedMotion, registerGsap } from "./gsap";

/** Counts an element's text from 0 to `value` when it enters view (§20). */
export function createCounter(
  el: HTMLElement,
  value: number,
  options: { duration?: number; suffix?: string } = {},
): () => void {
  const gsap = registerGsap();
  const { duration = 1.9, suffix = "" } = options;

  if (prefersReducedMotion()) {
    el.textContent = `${value}${suffix}`;
    return () => {};
  }

  const ctx = gsap.context(() => {
    const counter = { current: 0 };
    gsap.to(counter, {
      current: value,
      duration,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.current)}${suffix}`;
      },
    });
  });

  return () => ctx.revert();
}
