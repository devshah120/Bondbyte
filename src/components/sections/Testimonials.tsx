import { TESTIMONIALS } from "@/lib/constants/company";
import { AnimatedText } from "@/components/animations/AnimatedText";

/**
 * §21 — cinematic quote section.
 *
 * Renders nothing while TESTIMONIALS is empty. This is deliberate: no verified
 * client testimonials exist yet, and placeholder quotes must never be shown as
 * if they were real. Add entries to the constant and the section appears.
 */
export function Testimonials() {
  const [featured] = TESTIMONIALS;
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden border-t border-line py-32 lg:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[130px]" />

      <div className="container-page relative">
        <figure className="mx-auto max-w-4xl text-center">
          <span className="text-eyebrow">Client</span>
          <AnimatedText
            as="div"
            lines={[`“${featured.quote}”`]}
            className="text-display mt-9 text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.2] text-fg"
          />
          <figcaption className="mt-10 text-sm text-fg-muted">
            <span className="text-fg">{featured.author}</span>
            <span className="mx-2 text-fg-subtle">·</span>
            {featured.role}, {featured.company}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
