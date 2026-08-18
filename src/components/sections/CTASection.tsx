"use client";

import { useRef } from "react";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/constants/site";

/** §22 — closing CTA with a cursor-tracked glow and magnetic button. */
export function CTASection() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Pointer position drives a CSS variable — no React re-render per frame.
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <section data-band="dark" className="border-t border-line">
      <div
        ref={rootRef}
        onPointerMove={onPointerMove}
        className="relative overflow-hidden py-32 lg:py-48"
        style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
      >
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_70%)]" />

        {/* Follows the cursor across the section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(28rem 28rem at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 13%, transparent), transparent 70%)",
          }}
        />

        <div className="container-page relative text-center">
          <AnimatedText
            as="h2"
            lines={["Have a product", "worth building?"]}
            className="text-display mx-auto text-[clamp(2.4rem,7vw,5.25rem)]"
          />

          <p className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-fg-muted">
            Tell us what you&apos;re building. We&apos;ll help turn the idea into
            something real.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <MagneticButton href="/contact">Start a Conversation</MagneticButton>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
