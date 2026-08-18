import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import {
  formatSubmission,
  getEmailProvider,
} from "@/lib/email/provider";

export const runtime = "nodejs";

/** Naive in-memory rate limit — one instance, best-effort abuse control. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  /* Honeypot is checked BEFORE schema validation, so a bot never receives a
     field-level error naming the trap. Silently accepted. */
  if (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const provider = getEmailProvider();
  const submission = formatSubmission(parsed.data);

  if (!provider) {
    // No transport wired yet. Log it so nothing is lost, and tell the truth.
    console.warn(
      "[contact] No email provider configured — submission not delivered:\n%s",
      submission.text,
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "Our contact form isn't connected to email yet. Please reach us directly at support@bondbyte.in.",
        code: "EMAIL_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  try {
    await provider.send(submission);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send that. Please try again or email us directly." },
      { status: 502 },
    );
  }
}
