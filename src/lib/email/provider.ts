import type { ContactInput } from "@/lib/validation/contact";
import { SITE } from "@/lib/constants/site";

/**
 * Pluggable email transport.
 *
 * The old site used PHP `mail()`, which Next.js cannot run. Rather than lock
 * the project to one vendor, delivery goes through this interface. Implement
 * `send` with Resend / SendGrid / SMTP and register it in `getEmailProvider`.
 */
export interface EmailProvider {
  readonly name: string;
  send(payload: ContactSubmission): Promise<void>;
}

export interface ContactSubmission {
  readonly to: string;
  readonly replyTo: string;
  readonly subject: string;
  readonly text: string;
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("No email provider is configured.");
    this.name = "EmailNotConfiguredError";
  }
}

/**
 * Returns the active provider, or null when none is configured.
 *
 * TO ENABLE SENDING — pick one:
 *
 *   Resend:   npm i resend  → set RESEND_API_KEY, then uncomment resendProvider
 *   SMTP:     npm i nodemailer → implement a provider using SMTP_* env vars
 *   SendGrid: npm i @sendgrid/mail → set SENDGRID_API_KEY
 *
 * Until then the API validates and logs submissions but does not deliver mail,
 * and the route reports that honestly instead of pretending to have sent.
 */
export function getEmailProvider(): EmailProvider | null {
  // --- Resend (recommended) -------------------------------------------------
  // if (process.env.RESEND_API_KEY) {
  //   return {
  //     name: "resend",
  //     async send({ to, replyTo, subject, text }) {
  //       const { Resend } = await import("resend");
  //       const resend = new Resend(process.env.RESEND_API_KEY);
  //       const { error } = await resend.emails.send({
  //         from: "BondByte Website <website@bondbyte.in>",
  //         to,
  //         replyTo,
  //         subject,
  //         text,
  //       });
  //       if (error) throw new Error(error.message);
  //     },
  //   };
  // }

  return null;
}

/** Formats a submission into the message delivered to the studio inbox. */
export function formatSubmission(input: ContactInput): ContactSubmission {
  const lines = [
    `Name:     ${input.name}`,
    `Email:    ${input.email}`,
    `Company:  ${input.company || "—"}`,
    `Type:     ${input.projectType}`,
    `Budget:   ${input.budget ? input.budget : "—"}`,
    "",
    "Message:",
    input.message,
  ];

  return {
    to: SITE.email,
    replyTo: input.email,
    subject: `New enquiry — ${input.projectType} — ${input.name}`,
    text: lines.join("\n"),
  };
}
