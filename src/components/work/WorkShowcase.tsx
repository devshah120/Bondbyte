"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_PROJECTS } from "@/lib/constants/work";
import { ProjectVisual } from "./ProjectVisual";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";

/**
 * Featured work in a single screen: a selectable list on the left drives one
 * shared preview on the right, so the homepage shows the whole portfolio
 * without scrolling through a stack of full case studies.
 */
export function WorkShowcase() {
  const [active, setActive] = useState(0);
  const project = FEATURED_PROJECTS[active];

  return (
    <section className="relative border-t border-line py-28 lg:py-36">
      <div className="container-page">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Selected work" lines={["Products we've", "put into the world."]} />
          <Link
            href="/work"
            className="group inline-flex shrink-0 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            All work
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Selector */}
          <div className="lg:col-span-5">
            <ul className="border-t border-line">
              {FEATURED_PROJECTS.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.slug} className="border-b border-line">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-current={isActive}
                      className="group relative flex w-full items-center gap-5 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-0 h-full w-px bg-accent-hi transition-transform duration-500",
                          isActive ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-[0.6875rem] tracking-[0.16em] transition-all duration-500",
                          isActive ? "translate-x-2 text-accent-hi" : "text-fg-subtle",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("flex-1 transition-all duration-500", isActive && "translate-x-2")}>
                        <span
                          className={cn(
                            "block text-[1.35rem] font-medium tracking-tight transition-colors duration-500",
                            isActive ? "text-fg" : "text-fg-muted",
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="mt-0.5 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle">
                          {item.discipline}
                        </span>
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-all duration-500",
                          isActive
                            ? "translate-x-0 text-accent-hi opacity-100"
                            : "-translate-x-2 opacity-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Shared preview */}
          <div className="lg:col-span-7">
            <Link
              href={`/work/${project.slug}`}
              data-cursor="view"
              aria-label={`View the ${project.title} case study`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl">
                {/* Keyed so the visual cross-fades when the selection changes */}
                <div key={project.slug} className="animate-[fadeIn_450ms_ease-out]">
                  <ProjectVisual
                    project={project}
                    className="aspect-[16/11] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-fg">
                  View case study
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
