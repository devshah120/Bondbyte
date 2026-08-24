import type { ContactInput } from "@/lib/validation/contact";
import { SITE } from "@/lib/constants/site";

/**
 * Pluggable email transport.
 *
 * The old site used PHP `mail()`, which Next.js cannot run. Rather than lock
 * the project to one vendor, delivery goes through this interface. The active
 * implementation is SMTP (nodemailer); swapping in Resend/SendGrid later means
 * returning a different provider from `getEmailProvider`.
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
  readonly html: string;
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("No email provider is configured.");
    this.name = "EmailNotConfiguredError";
  }
}

/**
 * A single transporter is reused across requests. Nodemailer pools nothing by
 * default, but rebuilding the object per request would also re-resolve DNS and
 * re-run the TLS handshake on every submission. Cached on `globalThis` so the
 * dev server's module reloading doesn't leak a new transporter each edit.
 */
const transporterCache = globalThis as unknown as {
  __bondbyteMailer?: import("nodemailer").Transporter;
};

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

/** Reads and validates SMTP_* env vars. Returns null when not fully configured. */
function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  // All three are required; a partial config is a misconfiguration, not a
  // reason to attempt (and fail) a connection on every submission.
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);

  /* Port 465 is implicit TLS ("secure"); 587 and 25 start plaintext and
     upgrade via STARTTLS, which nodemailer does automatically when the server
     advertises it. SMTP_SECURE overrides for hosts that differ. */
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure =
    secureEnv === "true" ? true : secureEnv === "false" ? false : port === 465;

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    user,
    pass,
    fromName: process.env.SMTP_FROM_NAME?.trim() || SITE.name,
    fromEmail: process.env.SMTP_FROM_EMAIL?.trim() || user,
  };
}

/**
 * Returns the active provider, or null when none is configured.
 *
 * Set SMTP_HOST, SMTP_USER and SMTP_PASS (see .env.example) to enable sending.
 * Until then the API validates and logs submissions but does not deliver mail,
 * and the route reports that honestly instead of pretending to have sent.
 */
export function getEmailProvider(): EmailProvider | null {
  const config = readSmtpConfig();
  if (!config) return null;

  return {
    name: "smtp",
    async send({ to, replyTo, subject, text, html }) {
      const nodemailer = await import("nodemailer");

      /* Built lazily and cached: the module import above is dynamic so
         nodemailer never enters the client bundle. */
      const transporter =
        transporterCache.__bondbyteMailer ??
        (transporterCache.__bondbyteMailer = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: { user: config.user, pass: config.pass },
          /* Shared cPanel-style mail hosts frequently present a certificate
             for the server hostname rather than the mail domain. Keep TLS on
             and required, but allow that common mismatch — set
             SMTP_TLS_STRICT=true to enforce full verification. */
          requireTLS: !config.secure,
          tls: {
            rejectUnauthorized:
              process.env.SMTP_TLS_STRICT?.trim().toLowerCase() === "true",
          },
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 20_000,
        }));

      await transporter.sendMail({
        /* The From address must belong to the authenticated mailbox — most
           providers reject (or spam-file) a spoofed visitor address here.
           The visitor goes in Reply-To so "Reply" reaches them directly. */
        from: { name: config.fromName, address: config.fromEmail },
        to,
        replyTo,
        subject,
        text,
        html,
      });
    },
  };
}

/** Escapes text for safe interpolation into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Formats a submission into the message delivered to the studio inbox. */
export function formatSubmission(input: ContactInput): ContactSubmission {
  const fields: readonly (readonly [string, string])[] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "—"],
    ["Type", input.projectType],
    ["Budget", input.budget ? input.budget : "—"],
  ];

  const text = [
    ...fields.map(([label, value]) => `${label.padEnd(9)} ${value}`),
    "",
    "Message:",
    input.message,
  ].join("\n");

  const rows = fields
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;color:#6b7280;font:500 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#111827;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const html =
    `<div style="background:#f6f7f9;padding:32px 16px">` +
    `<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:28px 30px">` +
    `<p style="margin:0 0 20px;color:#6b7280;font:600 11px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:.12em;text-transform:uppercase">New enquiry — ${escapeHtml(SITE.name)}</p>` +
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">${rows}</table>` +
    `<div style="margin:22px 0 0;padding:18px 0 0;border-top:1px solid #e5e7eb">` +
    `<p style="margin:0 0 8px;color:#6b7280;font:500 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Message</p>` +
    `<div style="color:#111827;font:400 14px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:pre-wrap">${escapeHtml(input.message)}</div>` +
    `</div>` +
    `<p style="margin:24px 0 0;color:#9ca3af;font:400 12px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">Reply directly to this email to reach ${escapeHtml(input.name)}.</p>` +
    `</div></div>`;

  return {
    to: process.env.CONTACT_TO_EMAIL?.trim() || SITE.email,
    replyTo: input.email,
    subject: `New enquiry — ${input.projectType} — ${input.name}`,
    text,
    html,
  };
}
