import Image from "next/image";
import type { Project } from "@/lib/constants/work";
import { cn } from "@/lib/utils/cn";

const TONE: Record<Project["tone"], { from: string; glow: string; ring: string }> = {
  indigo: { from: "from-indigo-500/20", glow: "bg-indigo-500/25", ring: "border-indigo-400/25" },
  amber: { from: "from-amber-500/20", glow: "bg-amber-500/20", ring: "border-amber-400/25" },
  rose: { from: "from-rose-500/20", glow: "bg-rose-500/20", ring: "border-rose-400/25" },
  emerald: { from: "from-emerald-500/20", glow: "bg-emerald-500/20", ring: "border-emerald-400/25" },
  slate: { from: "from-slate-400/15", glow: "bg-slate-300/15", ring: "border-slate-300/20" },
};

/**
 * Designed placeholder visual for a case study. When `project.image` is set
 * it renders the real screenshot instead — swapping in artwork is a one-line
 * data change, no layout work.
 */
export function ProjectVisual({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const tone = TONE[project.tone];

  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg border border-line", className)}>
        <Image
          src={project.image}
          alt={`${project.title} — ${project.discipline}`}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      data-band="dark"
      className={cn(
        "relative overflow-hidden rounded-lg border border-line",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent", tone.from)} />
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div
        className={cn(
          "absolute -right-16 -top-16 h-64 w-64 rounded-full blur-[90px]",
          tone.glow,
        )}
      />

      {/* Abstract interface scaffold — reads as product, not clip-art */}
      <div className="absolute inset-0 flex flex-col justify-between p-7 lg:p-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2.5">
            <div className="h-1.5 w-16 rounded-full bg-white/20" />
            <div className="h-1.5 w-10 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/30">
            {project.discipline}
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className={cn("h-px w-full", "bg-white/10")} />
            <div className="flex gap-2">
              {project.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    "rounded border px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-white/45",
                    tone.ring,
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-tighter text-white/[0.07]">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
