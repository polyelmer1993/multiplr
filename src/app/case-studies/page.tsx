import type { Metadata } from "next";
import { CaseList } from "@/components/sections/CaseList";
import { Contact } from "@/components/sections/Contact";
import { Container } from "@/components/ui/Container";
import { FadeIn, Reveal, RevealLine } from "@/components/ui/Reveal";
import { SkipLink } from "@/components/ui/SkipLink";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How Multiplr has helped business owners with practical AI, better websites and workflows.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <SkipLink href="#main" />
      <main id="main">
        <section aria-labelledby="page-title" className="pt-[clamp(140px,22vh,220px)] pb-[clamp(40px,8vh,80px)]">
          <Container rail={false}>
            <Reveal>
              <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">Case studies</p>
              <h1 id="page-title" className="mt-4 text-[clamp(2.2rem,5.6vw,5.4rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd">
                <RevealLine index={0}>One piece at a time,</RevealLine>
                <RevealLine index={1}>and what it changed.</RevealLine>
              </h1>
              <FadeIn delay={0.35}>
                <p className="mt-6 max-w-[620px] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.45] text-fg-soft">
                  Real problems, practical fixes and the numbers that moved afterwards.
                </p>
              </FadeIn>
            </Reveal>
          </Container>
        </section>
        <CaseList />
        <Contact />
      </main>
    </>
  );
}
