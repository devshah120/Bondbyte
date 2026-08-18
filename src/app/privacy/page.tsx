import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.legalName} collects, uses and protects the information you share with us.`,
  alternates: { canonical: "/privacy" },
};

/**
 * Baseline privacy policy covering what this site actually does: a contact
 * form and basic analytics. Review with a legal advisor before launch, and
 * extend it if you add tracking, accounts or third-party embeds.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        lines={["Privacy Policy"]}
        description="What we collect, why we collect it, and what we do with it."
      />

      <section className="border-t border-line py-20 lg:py-28">
        <div className="container-page max-w-3xl space-y-10">
          <Block title="What we collect">
            <p>
              The only personal information this website collects is what you
              choose to send through our contact form: your name, email address,
              company name (optional), the type of project, an optional budget
              range, and your message.
            </p>
          </Block>

          <Block title="Why we collect it">
            <p>
              We use it solely to read and respond to your enquiry. We do not
              sell it, rent it, or share it with third parties for marketing.
            </p>
          </Block>

          <Block title="How long we keep it">
            <p>
              Enquiries are retained for as long as needed to respond and to
              maintain a record of our correspondence. You can ask us to delete
              your data at any time by emailing {SITE.email}.
            </p>
          </Block>

          <Block title="Analytics">
            <p>
              We may use privacy-respecting analytics to understand which pages
              are visited. This does not identify you personally.
            </p>
          </Block>

          <Block title="Your rights">
            <p>
              You can request a copy of the information we hold about you, ask
              us to correct it, or ask us to delete it. Write to {SITE.email}{" "}
              and we will respond.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              {SITE.legalName}, {SITE.location.city}, {SITE.location.region},{" "}
              {SITE.location.country}. Email {SITE.email}.
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-7">
      <h2 className="text-[1.25rem] font-medium tracking-tight text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed text-fg-muted">
        {children}
      </div>
    </div>
  );
}
