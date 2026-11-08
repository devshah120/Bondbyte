import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/cms/types";
import { Reveal } from "@/components/animations/Reveal";

/** Compact list of the projects that are not featured. */
export function OtherWork({ eyebrow, projects }: { eyebrow: string; projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="border-t border-line py-24 lg:py-32">
      <div className="container-page">
        {eyebrow && (
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-8 bg-line-strong" />
            <span className="text-eyebrow">{eyebrow}</span>
          </div>
        )}

        <Reveal staggerChildren className="border-t border-line">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group flex flex-col gap-3 border-b border-line py-7 transition-colors sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-baseline gap-5">
                <h3 className="text-[1.35rem] font-medium tracking-tight text-fg transition-colors group-hover:text-accent-hi">
                  {project.title}
                </h3>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">{project.discipline}</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="max-w-sm text-sm text-fg-muted">{project.summary}</p>
                <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-fg-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg sm:block" />
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
