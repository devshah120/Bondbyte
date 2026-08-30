import { TECHNOLOGIES, type Tech } from "@/lib/constants/technology";

type Row = {
  items: readonly Tech[];
  direction: "left" | "right";
  duration: number;
};

function rotate<T>(arr: readonly T[], offset: number): T[] {
  const n = arr.length;
  const at = ((offset % n) + n) % n;
  return [...arr.slice(at), ...arr.slice(0, at)];
}

const ROW_COUNT = 9;

const ROWS: readonly Row[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
  items: rotate(TECHNOLOGIES, i * 3),
  direction: i % 2 === 0 ? "left" : "right",
  duration: 34 + (i % 4) * 8,
}));

function MarqueeRow({ items, direction, duration }: Row) {
  const loop = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={
          "flex flex-none items-center " +
          (direction === "left" ? "animate-marquee-left" : "animate-marquee-right")
        }
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((tech, i) => (
          <span
            key={`${tech.name}-${i}`}
            className="mx-3 flex flex-none items-center whitespace-nowrap font-mono text-xs uppercase leading-none tracking-wide text-accent-hi/[0.13] sm:text-sm lg:text-base"
          >
            {tech.name}
            <span className="ml-6 text-accent-hi/[0.07]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Continuous tech-stack marquee tiled across the full hero, with a sweeping highlight pass. */
export function TechMarquee() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between gap-4 py-6 [mask-image:linear-gradient(to_bottom,transparent,#000_6%,#000_94%,transparent)] sm:gap-5 lg:gap-6">
      {ROWS.map((row, i) => (
        <MarqueeRow key={i} {...row} />
      ))}
      <div
        aria-hidden
        className="animate-shimmer-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mix-blend-overlay"
      />
    </div>
  );
}
