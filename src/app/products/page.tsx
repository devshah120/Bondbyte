import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { CTASection } from "@/components/sections/CTASection";
import { PRODUCTS, PROJECTS } from "@/lib/constants/work";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software BondByte builds and operates itself — including Kindify, a platform where NGOs register and receive donations with payment routing built in.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        lines={["Software we own,", "not just ship."]}
        description="Client work is one half of the studio. These are the products we build, run and maintain ourselves."
      />

      {PRODUCTS.map((product) => {
        const project = PROJECTS.find((p) => p.title === product.name);

        return (
          <section
            key={product.name}
            className="border-t border-line py-24 lg:py-32"
          >
            <div className="container-page">
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-accent-hi/30 bg-accent/10 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-accent-hi">
                      {product.status}
                    </span>
                  </div>

                  <AnimatedText
                    as="h2"
                    lines={[product.name]}
                    className="text-display mt-6 text-[clamp(2.4rem,6vw,4rem)]"
                  />

                  <p className="mt-6 text-[1.15rem] leading-relaxed text-fg">
                    {product.tagline}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-2">
                    {product.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project && (
                    <Link
                      href={`/work/${project.slug}`}
                      className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-fg"
                    >
                      View the case study
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  )}
                </div>

                <div className="lg:col-span-7">
                  <Reveal staggerChildren className="space-y-10">
                    <div className="rounded-lg border border-line bg-surface/40 p-8">
                      <h3 className="text-eyebrow mb-4">The problem</h3>
                      <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                        {product.problem}
                      </p>
                    </div>

                    <div className="rounded-lg border border-line bg-surface/40 p-8">
                      <h3 className="text-eyebrow mb-4">What we built</h3>
                      <p className="text-[1.0625rem] leading-relaxed text-fg-muted">
                        {product.solution}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-eyebrow mb-5">Capabilities</h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {product.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 border-t border-line pt-3 text-[0.9375rem] text-fg-muted"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-hi" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <CTASection />
    </>
  );
}
