import { z } from "zod";

/**
 * Contact form schema, shared by the form (client) and /api/inquiries
 * (server). The project types and budget ranges are edited in the admin panel
 * on the "Contact and form" section, so the schema is built from them.
 */
export function makeContactSchema(projectTypes: readonly string[], budgets: readonly string[]) {
  return z.object({
    name: z.string().trim().min(2, "Please enter your name.").max(80, "That name is a little too long."),
    email: z.string().trim().min(1, "We need an email to reply to.").email("That email address doesn't look right."),
    company: z.string().trim().max(120, "That's too long.").optional().or(z.literal("")),
    projectType:
      projectTypes.length > 0
        ? z.string().refine((value) => projectTypes.includes(value), { message: "Pick the closest match." })
        : z.string().trim().max(60).optional().or(z.literal("")),
    /* "Prefer not to say" submits an empty string. */
    budget: z
      .string()
      .refine((value) => value === "" || budgets.includes(value), { message: "Pick one of the ranges." })
      .optional(),
    message: z
      .string()
      .trim()
      .min(20, "A little more detail helps us reply properly.")
      .max(4000, "Please keep it under 4000 characters."),
    /* Honeypot — real users never fill this. Accepted by the schema (so the
       response never reveals the field exists) and checked by the route. */
    website: z.string().optional(),
  });
}

export type ContactInput = z.infer<ReturnType<typeof makeContactSchema>>;
