import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { RiseText } from "@/components/ui/RiseText";
import { SkipLink } from "@/components/ui/SkipLink";
import { CASE_STUDIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How Multiplr has helped business owners with practical AI, better websites and workflows.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <SkipLink href="#main" />
      <main id="main">
        <section aria-labelledby="page-title" className="dot-grid bg-bone pt-[clamp(140px,22vh,220px)] pb-[clamp(90px,14vh,150px)]">
          <Container>
            <Label className="text-strike">Case studies</Label>
            <RiseText
              as="h1"
              id="page-title"
              onMount
              lines={["One piece at a time,", { text: "and what it changed.", accent: true }]}
              className="mt-5 text-[clamp(2.5rem,6vw,6rem)] leading-[.98] font-light tracking-[-.045em] text-deep"
            />
            <Reveal>
              <FadeIn delay={0.5}>
                <p className="mt-6 max-w-[560px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.45] text-ink/70">
                  Real problems, practical fixes and the numbers that moved afterwards.
                </p>
              </FadeIn>
            </Reveal>
            <ul className="mt-[clamp(48px,8vh,80px)] grid gap-4 md:grid-cols-3">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
                  <CaseCard study={study} headingLevel="h2" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
        <Contact />
      </main>
    </>
  );
}
