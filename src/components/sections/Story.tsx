import { Reveal } from "@/components/animations/Reveal";

/** Heading on the left, paragraphs on the right (the about page's "Small team" block). */
export function Story({ heading, paragraphs }: { heading: string[]; paragraphs: string[] }) {
  return (
    <section className="border-t border-line py-24 lg:py-32">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2 className="text-display text-[clamp(1.9rem,4vw,2.75rem)]">
              {heading.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <Reveal staggerChildren className="space-y-6">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-[1.0625rem] leading-relaxed text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
