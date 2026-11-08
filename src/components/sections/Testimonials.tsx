import type { Testimonial } from "@/lib/cms/types";
import { AnimatedText } from "@/components/animations/AnimatedText";

/**
 * §21 — cinematic quote section.
 *
 * Renders nothing while there are no testimonials. This is deliberate:
 * placeholder quotes must never be shown as if they were real. Add one under
 * Testimonials in the admin panel and the section appears.
 */
export function Testimonials({ eyebrow, testimonials }: { eyebrow: string; testimonials: Testimonial[] }) {
  const [featured] = testimonials;
  if (!featured) return null;
  const attribution = [featured.role, featured.company].filter(Boolean).join(", ");

  return (
    <section className="relative overflow-hidden border-t border-line py-32 lg:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[130px]" />

      <div className="container-page relative">
        <figure className="mx-auto max-w-4xl text-center">
          {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
          <AnimatedText
            as="div"
            lines={[`“${featured.quote}”`]}
            className="text-display mt-9 text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.2] text-fg"
          />
          <figcaption className="mt-10 text-sm text-fg-muted">
            <span className="text-fg">{featured.author}</span>
            {attribution && (
              <>
                <span className="mx-2 text-fg-subtle">·</span>
                {attribution}
              </>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
