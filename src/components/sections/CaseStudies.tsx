"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import { Button } from "@/components/ui/Button";
import { CaseCard } from "@/components/ui/CaseCard";
import { Container } from "@/components/ui/Container";
import { Perch } from "@/components/ui/Perch";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { CASE_STUDIES } from "@/lib/content";

/** How far each column drifts, in px, across the section's scroll. Different speeds = parallax. */
const DRIFT = [40, 110, 70];

/** Home page teaser: three case study cards that drift at different speeds. */
export function CaseStudies() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useMotionValue(0.5);
  const p = reduced ? still : scrollYProgress;
  const y0 = useTransform(p, [0, 1], [DRIFT[0], -DRIFT[0]]);
  const y1 = useTransform(p, [0, 1], [DRIFT[1], -DRIFT[1]]);
  const y2 = useTransform(p, [0, 1], [DRIFT[2], -DRIFT[2]]);
  const ys = [y0, y1, y2];

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="relative py-[clamp(90px,14vh,160px)]">
      <Container>
        <Reveal className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <SectionHeading id="work-title">Case studies</SectionHeading>
            <FadeIn delay={0.2}>
              <p className="mt-3 text-[clamp(.98rem,1.15vw,1.08rem)] text-fg-soft">
                A few of the pieces we&apos;ve fixed, and what changed once they were working.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.3}>
            <Button href="/case-studies" variant="ghost" arrow>
              All case studies
            </Button>
          </FadeIn>
        </Reveal>
        <Perch className="top-0 right-[22px] -mt-12 ml:right-14" />

        <ul className="mt-[clamp(40px,7vh,72px)] grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          {CASE_STUDIES.map((study, i) => (
            // Only drift on wider screens where the cards sit side by side.
            <motion.li key={study.slug} style={{ y: ys[i] }} className="max-md:transform-none!">
              <CaseCard study={study} />
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
