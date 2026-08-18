import { z } from "zod";

/** Shared client + server contact schema (§23). */
export const PROJECT_TYPES = [
  "Web application",
  "Mobile application",
  "Website",
  "UI/UX design",
  "Brand & identity",
  "Something else",
] as const;

export const BUDGET_RANGES = [
  "Under ₹1L",
  "₹1L – ₹5L",
  "₹5L – ₹15L",
  "₹15L+",
  "Not sure yet",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is a little too long."),
  email: z
    .string()
    .trim()
    .min(1, "We need an email to reply to.")
    .email("That email address doesn't look right."),
  company: z.string().trim().max(120, "That's too long.").optional().or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES, {
    message: "Pick the closest match.",
  }),
  /* The "Prefer not to say" option submits an empty string, so it is accepted
     as a valid value here and normalised away before the email is composed.
     Keeping it in the union (rather than using z.preprocess) preserves a
     precise input type for react-hook-form's resolver. */
  budget: z.enum(BUDGET_RANGES).or(z.literal("")).optional(),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail helps us reply properly.")
    .max(4000, "Please keep it under 4000 characters."),
  /* Honeypot — real users never fill this. Accepted by the schema (so the
     response never reveals the field exists) and checked in the route. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
