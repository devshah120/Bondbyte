import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants/work";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { AnimatedText } from "@/components/animations/AnimatedText";
import { Reveal } from "@/components/animations/Reveal";
import { CTASection } from "@/components/sections/CTASection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every case study at build time. */
export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — BondByte`,
      description: project.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.indexOf(project);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <>
      <article className="relative pt-36 lg:pt-44">
        <div className="bg-grid absolute inset-x-0 top-0 h-[30rem] opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />

        <div className="container-page relative">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All work
          </Link>

          <div className="mt-12 flex items-center gap-4">
            <span className="text-eyebrow">{project.discipline}</span>
            {project.year && (
              <>
                <span className="h-px w-6 bg-line-strong" />
                <span className="text-eyebrow">{project.year}</span>
              </>
            )}
          </div>

          <AnimatedText
            as="h1"
            lines={[project.title]}
            className="text-display mt-7 text-[clamp(2.6rem,8vw,5.5rem)]"
            onScroll={false}
          />

          <p className="mt-8 max-w-2xl text-[1.15rem] leading-relaxed text-fg-muted">
            {project.summary}
          </p>
        </div>

        <div className="container-page relative mt-16">
          <ProjectVisual
            project={project}
            priority
            className="aspect-[16/9] w-full"
          />
        </div>

        <div className="container-page relative py-24 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              {project.description ? (
                <Reveal>
                  <h2 className="text-eyebrow mb-6">Overview</h2>
                  <p className="text-[1.15rem] leading-relaxed text-fg">
                    {project.description}
                  </p>
                </Reveal>
              ) : (
                /* No verified write-up exists for this project yet. Rather than
                   invent one, we show only what is confirmed. */
                <Reveal>
                  <h2 className="text-eyebrow mb-6">Overview</h2>
                  <p className="text-[1.15rem] leading-relaxed text-fg">
                    {project.summary}
                  </p>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-fg-subtle">
                    A full write-up of this project is in progress.
                  </p>
                </Reveal>
              )}
            </div>

            <aside className="lg:col-span-5">
              <Reveal staggerChildren className="space-y-10 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                <div>
                  <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Discipline
                  </h3>
                  <p className="mt-3 text-[0.9375rem] text-fg">{project.discipline}</p>
                </div>

                <div>
                  <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                    Stack
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.metrics.length > 0 && (
                  <div>
                    <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-fg-subtle">
                      Outcomes
                    </h3>
                    <dl className="mt-3 space-y-4">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dd className="text-2xl font-medium tracking-tight text-fg">
                            {metric.value}
                          </dd>
                          <dt className="mt-1 text-sm text-fg-subtle">
                            {metric.label}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </Reveal>
            </aside>
          </div>
        </div>

        {/* Next project */}
        <div className="border-t border-line">
          <div className="container-page py-16">
            <Link href={`/work/${next.slug}`} className="group block">
              <span className="text-eyebrow">Next project</span>
              <div className="mt-4 flex items-center justify-between gap-6">
                <h2 className="text-display text-[clamp(1.8rem,4.5vw,3rem)] transition-colors group-hover:text-accent-hi">
                  {next.title}
                </h2>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg" />
              </div>
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
