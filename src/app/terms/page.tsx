import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use the ${SITE.legalName} website.`,
  alternates: { canonical: "/terms" },
};

/**
 * Baseline website terms. These cover use of the site itself — project work is
 * governed by the individual agreement signed for that engagement. Review with
 * a legal advisor before launch.
 */
export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        lines={["Terms of Use"]}
        description="The terms that apply when you use this website."
      />

      <section className="border-t border-line py-20 lg:py-28">
        <div className="container-page max-w-3xl space-y-10">
          <Block title="Using this site">
            <p>
              You may browse and share this website freely. You may not copy its
              design, code or written content for commercial use without our
              written permission.
            </p>
          </Block>

          <Block title="Indicative pricing">
            <p>
              Any prices, timelines or package contents shown on this site are
              indicative and for guidance only. They are not an offer or a
              quotation. Final scope, cost and timelines are confirmed in a
              written proposal after a discovery conversation.
            </p>
          </Block>

          <Block title="Project work">
            <p>
              Work we carry out for clients is governed by the specific
              agreement signed for that engagement, not by this page. Where the
              two differ, the signed agreement applies.
            </p>
          </Block>

          <Block title="Intellectual property">
            <p>
              The BondByte name, wordmark and the content of this site belong to{" "}
              {SITE.legalName}. Project names and marks belonging to our clients
              remain theirs.
            </p>
          </Block>

          <Block title="Liability">
            <p>
              This website is provided as is. We take care to keep it accurate,
              but we do not warrant that it is free of errors, and we are not
              liable for decisions taken solely on the basis of its content.
            </p>
          </Block>

          <Block title="Contact">
            <p>
              Questions about these terms can go to {SITE.email}.
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
