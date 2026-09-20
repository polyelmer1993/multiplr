import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FadeUp } from "@/components/FadeUp";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { Highlight } from "@/components/hero/Highlight";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Multiplr, or ask whether we are the right studio for it.",
};

const DETAILS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Studio", value: "Australia — working worldwide" },
  { label: "Hours", value: "Mon–Fri, 9:00–17:00 AEST" },
  { label: "Response", value: "Within two business days" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Start a <Highlight delay={0.45}>project</Highlight>.
          </>
        }
        lede="Tell us what you are building and who has to believe in it. If we are not the right studio for it, we will say so and point you somewhere better."
        meta={[
          { k: "Reply", v: "Two business days" },
          { k: "Hours", v: "Mon–Fri, AEST" },
          { k: "Studio", v: "Australia" },
          { k: "Scope", v: "Retainer or project" },
        ]}
      />

      <Section eyebrow="01 Brief" title="Send the shape of it." divider>
        <div className="grid gap-s-8 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            <ContactForm />
          </FadeUp>

          <FadeUp delay={0.06} className="lg:col-span-5">
            <div className="border-hairline border-muted/60 bg-bone p-s-6">
              <h2 className="eyebrow">Direct</h2>

              {/* Each row is its own hover group: a Strike rule draws in from
                  the left and the label steps to Strike. CSS only — nothing
                  here needs to ship JavaScript. */}
              <dl className="mt-s-5 flex flex-col">
                {DETAILS.map((item) => (
                  <div
                    key={item.label}
                    className="group relative flex flex-col gap-s-1 border-b-hairline border-muted/30 py-s-4 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-strike transition-transform duration-[420ms] ease-calm group-hover:scale-x-100 group-last:hidden"
                    />
                    <dt className="font-mono text-mono-micro uppercase text-muted transition-colors duration-300 ease-calm group-hover:text-strike">
                      {item.label}
                    </dt>
                    <dd className="text-body text-ink">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="inline-block border-b-hairline border-transparent pb-[3px] text-strike transition-colors duration-200 ease-calm hover:border-b-active hover:border-strike hover:pb-[2px]"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-s-6 max-w-measure text-body-sm text-muted">
                Prefer a call? Send three windows that suit you and we will confirm one.
              </p>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
