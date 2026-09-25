"use client";

import { useMotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SealMark } from "@/components/illustrations/SealMark";
import { useSite } from "@/components/SiteProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CopyButton } from "@/components/ui/CopyButton";
import { Label } from "@/components/ui/Label";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { RiseText } from "@/components/ui/RiseText";
import { Sheet } from "@/components/ui/Sheet";
import { EMAIL } from "@/lib/content";

/**
 * The closing scene, used on every page. The seal fills the background as a
 * living mark: its frame draws in, its letters decode and light up one at a
 * time, and the × turns like a key as you arrive.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const still = useMotionValue(0);
  // Run the seal's scroll motion backwards, so it settles into place (and the
  // × turns back to rest) as the section arrives, rather than growing away.
  const arrive = useTransform(scrollYProgress, (v) => 1 - v);

  return (
    <Sheet
      ref={ref}
      id="talk"
      tone="bone"
      aria-labelledby="talk-title"
      className="dot-grid grain z-10 flex min-h-svh items-center overflow-hidden py-[clamp(110px,16vh,180px)]"
    >
      <Container className="relative grid items-center gap-12 md:grid-cols-12 md:gap-x-10">
        <SealMark progress={reduced ? still : arrive} className="w-[min(56vw,30svh)] md:col-span-5 md:w-full md:max-w-[min(62svh,100%)]" />

        <div className="md:col-span-7">
          <Label perch className="text-strike">
            Contact
          </Label>
          <RiseText
            id="talk-title"
            lines={["Want to work", { text: "together?", accent: true }]}
            className="mt-5 text-[clamp(2.8rem,7vw,7rem)] leading-[.96] font-light tracking-[-.05em] text-deep"
          />
          <Reveal>
            <FadeIn delay={0.3}>
              <p className="mt-6 max-w-[480px] text-[clamp(1.02rem,1.3vw,1.2rem)] text-ink/70">
                Bring me your problems or ideas, and I&apos;ll find you a solution worth implementing.
              </p>
            </FadeIn>
            <FadeIn delay={0.45} className="mt-8 flex flex-wrap gap-2.5">
              <Button href={`mailto:${EMAIL}?subject=Let%27s%20talk`} arrow>
                Start a conversation
              </Button>
              <Button href="#services" variant="quiet">
                What I do
              </Button>
            </FadeIn>
            <FadeIn delay={0.55}>
              <p className="mt-6 flex flex-wrap items-center gap-y-2 text-[14.5px] text-ink/60">
                or email&nbsp;
                <a href={`mailto:${EMAIL}`} className="border-b border-ink/20 text-ink no-underline hover:border-ink">
                  {EMAIL}
                </a>
                <CopyButton text={EMAIL} />
              </p>
            </FadeIn>
          </Reveal>
        </div>
      </Container>
    </Sheet>
  );
}
