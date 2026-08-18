import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CaseStudy } from "@/components/work/CaseStudy";
import { CTASection } from "@/components/sections/CTASection";
import { WorkByIndustry } from "@/components/sections/WorkByIndustry";
import { Reveal } from "@/components/animations/Reveal";
import { FEATURED_PROJECTS, PROJECTS } from "@/lib/constants/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work from BondByte — mobile applications, web products, interface design and brand identity, including Kindify, Padhaku and Furmart, plus industry-specific solutions and packages.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const others = PROJECTS.filter((project) => !project.featured);

  return (
    <>
      <PageHeader
        eyebrow="Work"
        lines={["Products, interfaces", "and identities."]}
        description="A selection of what we have designed and engineered — for clients, and for ourselves."
      />

      <section className="pb-8">
        <div className="container-page">
          {FEATURED_PROJECTS.map((project, i) => (
            <CaseStudy
              key={project.slug}
              project={project}
              index={i}
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line py-24 lg:py-32">
          <div className="container-page">
            <div className="mb-12 flex items-center gap-3">
              <span className="h-px w-8 bg-line-strong" />
              <span className="text-eyebrow">Also from the studio</span>
            </div>

            <Reveal staggerChildren className="border-t border-line">
              {others.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group flex flex-col gap-3 border-b border-line py-7 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-baseline gap-5">
                    <h3 className="text-[1.35rem] font-medium tracking-tight text-fg transition-colors group-hover:text-accent-hi">
                      {project.title}
                    </h3>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
                      {project.discipline}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="max-w-sm text-sm text-fg-muted">
                      {project.summary}
                    </p>
                    <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg sm:block" />
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <WorkByIndustry />
      <CTASection />
    </>
  );
}
