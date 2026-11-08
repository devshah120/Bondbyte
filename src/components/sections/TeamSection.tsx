import Image from "next/image";
import type { HeadingData, TeamMember } from "@/lib/cms/types";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Team photos, edited under Team in the admin panel. */
export function TeamSection({ heading, team }: { heading: HeadingData; team: TeamMember[] }) {
  if (team.length === 0) return null;

  return (
    <section className="border-t border-line py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={heading.eyebrow} lines={heading.heading} className="mb-16" />

        <Reveal staggerChildren className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface">
                {member.image && (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              </div>
              <h3 className="mt-5 text-[1.0625rem] font-medium tracking-tight text-fg">
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent-hi">
                    {member.name}
                  </a>
                ) : (
                  member.name
                )}
              </h3>
              {member.role && (
                <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle">{member.role}</p>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
