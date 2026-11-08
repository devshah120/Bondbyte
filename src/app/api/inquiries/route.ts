import { after } from "next/server";
import { cms } from "@/lib/cms/server";
import { clientIp } from "@/lib/cms/server/admin-api";
import { makeContactSchema } from "@/lib/validation/contact";
import { formatSubmission, getEmailProvider } from "@/lib/email/provider";

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/**
 * The contact form. Messages are saved to data/inquiries.json and appear in
 * the admin panel under Inquiries. When SMTP is configured, a copy is also
 * emailed — after the response, so a slow mail server never delays the form.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "The request was not valid JSON." }, 400);
  }

  // Honeypot: answered as if saved, so a bot learns nothing, but dropped.
  if (typeof body?.website === "string" && body.website.trim()) return json({ ok: true }, 201);

  const { store, inquiries, allowInquiry } = await cms();
  if (!allowInquiry(clientIp(request))) {
    return json({ error: "You have sent several messages in a short time. Please wait a few minutes, or email us directly." }, 429);
  }

  const content = await store.get();
  const contact = content.pages.flatMap((page) => page.sections).find((section) => section.type === "contact")?.data ?? {};
  const projectTypes = Array.isArray(contact.projectTypes) ? (contact.projectTypes as string[]) : [];
  const budgets = Array.isArray(contact.budgets) ? (contact.budgets as string[]) : [];

  const result = makeContactSchema(projectTypes, budgets).safeParse(body);
  if (!result.success) {
    return json({ error: result.error.issues[0]?.message ?? "Please check the form." }, 400);
  }

  const { name, email, company = "", projectType = "", budget = "", message } = result.data;
  const item = await inquiries.add({ name, email, company, projectType, budget, message });

  const site = { name: content.settings.name, email: content.settings.email };
  const provider = getEmailProvider(site);
  if (provider) {
    after(async () => {
      try {
        await provider.send(formatSubmission(item, site));
      } catch (err) {
        console.error("Enquiry saved, but the notification email failed:", err);
      }
    });
  }

  return json({ ok: true }, 201);
}
