/**
 * Technology stack (§17).
 *
 * Every entry is drawn from the stack listed on the existing BondByte site or
 * used in the projects recorded in constants/work.ts. Nothing aspirational.
 */

export type TechCategory =
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "Cloud"
  | "Database"
  | "DevOps"
  | "Design";

export interface Tech {
  readonly name: string;
  readonly category: TechCategory;
  /** Relative emphasis — drives node size in the constellation. */
  readonly weight: 1 | 2 | 3;
}

export const TECH_CATEGORIES: readonly TechCategory[] = [
  "Frontend",
  "Backend",
  "Mobile",
  "Cloud",
  "Database",
  "DevOps",
  "Design",
];

export const TECHNOLOGIES: readonly Tech[] = [
  // Frontend
  { name: "React", category: "Frontend", weight: 3 },
  { name: "Next.js", category: "Frontend", weight: 3 },
  { name: "TypeScript", category: "Frontend", weight: 3 },

  // Backend
  { name: "Node.js", category: "Backend", weight: 3 },
  { name: "PHP", category: "Backend", weight: 2 },
  { name: "Laravel", category: "Backend", weight: 2 },
  { name: "Python", category: "Backend", weight: 2 },
  { name: "WordPress", category: "Backend", weight: 1 },

  // Mobile
  { name: "Flutter", category: "Mobile", weight: 3 },

  // Cloud
  { name: "AWS", category: "Cloud", weight: 3 },

  // Database
  { name: "MongoDB", category: "Database", weight: 2 },
  { name: "MySQL", category: "Database", weight: 2 },

  // DevOps
  { name: "Docker", category: "DevOps", weight: 2 },
  { name: "Git", category: "DevOps", weight: 2 },

  // Design
  { name: "Figma", category: "Design", weight: 2 },
];
