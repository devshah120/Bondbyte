"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { registerGsap, prefersReducedMotion } from "@/lib/animations/gsap";

type CursorState = "default" | "link" | "cta" | "view";

/**
 * Dot + trailing ring cursor (§24). Desktop pointers only — never mounted
 * behaviour on touch, and never when reduced motion is requested.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");

  /* Whether a precise pointer is available. Read through an external store so
     it stays SSR-safe (false on the server) and never needs setState in an
     effect. Re-evaluates if the user plugs in a mouse. */
  const enabled = useSyncExternalStore(
    subscribeToPointer,
    getPointerSnapshot,
    () => false,
  );

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const gsap = registerGsap();
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const el = (event.target as HTMLElement)?.closest?.(
        "[data-cursor], a, button, input, textarea, select",
      );
      const explicit = el?.getAttribute("data-cursor") as CursorState | null;
      if (explicit) setState(explicit);
      else if (el) setState("link");
      else setState("default");
    };

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize =
    state === "view" ? 76 : state === "cta" ? 56 : state === "link" ? 44 : 28;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-difference lg:block"
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderColor: "rgba(255,255,255,0.55)",
          backgroundColor:
            state === "cta" || state === "view"
              ? "rgba(255,255,255,0.16)"
              : "transparent",
          backdropFilter: state === "view" ? "blur(2px)" : undefined,
        }}
      >
        {state === "view" && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white">
            View
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-200"
        style={{ opacity: state === "view" ? 0 : 1 }}
      />
    </div>
  );
}

const POINTER_QUERY = "(pointer: fine)";

function subscribeToPointer(onChange: () => void): () => void {
  const mql = window.matchMedia(POINTER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getPointerSnapshot(): boolean {
  return window.matchMedia(POINTER_QUERY).matches && !prefersReducedMotion();
}
