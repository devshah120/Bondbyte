import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Product, Project } from "@/lib/cms/types";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedText } from "@/components/animations/AnimatedText";

/** Each product the studio owns, with its problem, solution and capabilities. */
export function ProductsSection({ products, projects, linkLabel }: { products: Product[]; projects: Project[]; linkLabel: string }) {
  return (
    <>
      {products.map((product) => {
        const project = product.caseStudy ? projects.find((p) => p.slug === product.caseStudy) : undefined;

        return (
          <section key={product.id} className="border-t border-line py-24 lg:py-32">
            <div className="container-page">
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
                <div className="lg:col-span-5">
                  {product.status && (
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-accent-hi/30 bg-accent/10 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-accent-hi">
                        {product.status}
                      </span>
                    </div>
                  )}

                  <AnimatedText as="h2" lines={[product.name]} className="text-display mt-6 text-[clamp(2.4rem,6vw,4rem)]" />

                  {product.tagline && <p className="mt-6 text-[1.15rem] leading-relaxed text-fg">{product.tagline}</p>}

                  {product.stack.length > 0 && (
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
                  )}

                  {project && (
                    <Link href={`/work/${project.slug}`} className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-fg">
                      {linkLabel || "View the case study"}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  )}
                </div>

                <div className="lg:col-span-7">
                  <Reveal staggerChildren className="space-y-10">
                    {product.problem && (
                      <div className="rounded-lg border border-line bg-surface/40 p-8">
                        <h3 className="text-eyebrow mb-4">The problem</h3>
                        <p className="text-[1.0625rem] leading-relaxed text-fg-muted">{product.problem}</p>
                      </div>
                    )}

                    {product.solution && (
                      <div className="rounded-lg border border-line bg-surface/40 p-8">
                        <h3 className="text-eyebrow mb-4">What we built</h3>
                        <p className="text-[1.0625rem] leading-relaxed text-fg-muted">{product.solution}</p>
                      </div>
                    )}

                    {product.features.length > 0 && (
                      <div>
                        <h3 className="text-eyebrow mb-5">Capabilities</h3>
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {product.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 border-t border-line pt-3 text-[0.9375rem] text-fg-muted">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-hi" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
