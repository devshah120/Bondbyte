"use client";

import { prefersReducedMotion, registerGsap } from "./gsap";

/** Magnetic hover pull for CTAs (§7). Disabled on touch / reduced motion. */
export function createMagnetic(
  el: HTMLElement,
  options: { strength?: number } = {},
): () => void {
  const gsap = registerGsap();
  const { strength = 0.35 } = options;

  if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) {
    return () => {};
  }

  const move = (event: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const reset = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", reset);

  return () => {
    el.removeEventListener("mousemove", move);
    el.removeEventListener("mouseleave", reset);
    gsap.killTweensOf(el);
  };
}
