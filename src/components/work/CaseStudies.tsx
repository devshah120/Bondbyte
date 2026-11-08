import type { Project } from "@/lib/cms/types";
import { CaseStudy } from "./CaseStudy";

/** Featured projects as full case studies (the work page). */
export function CaseStudies({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="pb-8">
      <div className="container-page">
        {projects.map((project, i) => (
          <CaseStudy key={project.id} project={project} index={i} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}
