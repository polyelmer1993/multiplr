"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { RiseText } from "@/components/ui/RiseText";
import { SealLetters } from "@/components/ui/SealCubeFaces";
import { TypingText } from "@/components/ui/TypingText";
import { PITCHES } from "@/lib/content";

/**
 * The opening scene. The seal cube sits large on the right (it's drawn by
 * <SealCube>, which reads this section's [data-seal-anchor] box) while the
 * pitch types itself out. The hero pins as the next sheet slides up over it,
 * and the cube shrinks down into the companion that follows you.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const none = useMotionValue(0);
  const p = reduced ? none : scrollYProgress;
  const contentScale = useTransform(p, [0, 1], [1, 0.9]);
  const contentY = useTransform(p, [0, 1], [0, -60]);
  const contentOpacity = useTransform(p, [0, 0.8], [1, 0.25]);
  const hintOpacity = useTransform(p, [0, 0.03], [1, 0]);

  return (
    <div ref={ref} data-seal-track className="relative h-[200svh]">
      <section id="home" aria-labelledby="hero-title" className="dot-grid grain sticky top-0 flex h-svh flex-col overflow-hidden bg-bone">
        <motion.div
          className="relative flex flex-1 flex-col justify-center pt-20 pb-10 md:pt-24"
          style={{ scale: contentScale, y: contentY, opacity: contentOpacity }}
        >
          <Container className="grid items-center gap-y-12 md:grid-cols-12 md:gap-x-10">
            {/* Where the big cube sits. <SealCube> sizes and places itself on this box. */}
            <div
              data-seal-anchor
              aria-hidden="true"
              className="relative aspect-square w-[min(44vw,24svh)] md:order-2 md:col-span-4 md:w-[min(34svh,100%,300px)] md:justify-self-end"
            >
              {reduced && (
                <div className="bigseal absolute inset-0 border-[3px] p-[8%]">
                  <SealLetters />
                </div>
              )}
              <motion.p
                style={{ opacity: hintOpacity }}
                className="absolute -top-8 left-0 font-mono text-[10.5px] font-medium tracking-[.2em] whitespace-nowrap text-ink/55 uppercase md:left-1/2 md:-translate-x-1/2"
              >
                Drag it, tap it, then scroll
              </motion.p>
            </div>

            <div className="md:order-1 md:col-span-8">
              <RiseText
                as="h1"
                id="hero-title"
                onMount
                delay={0.3}
                lines={["I help business owners"]}
                className="text-[clamp(2.4rem,5.2vw,5.6rem)] leading-[1] font-light tracking-[-.045em] text-deep"
              />
              <TypingText
                lines={PITCHES}
                startDelay={1300}
                className="mt-[.08em] min-h-[3em] text-[clamp(2.4rem,5.2vw,5.6rem)] leading-[1] font-light tracking-[-.045em] text-strike md:min-h-[2em]"
              />
            </div>
          </Container>
        </motion.div>
      </section>
    </div>
  );
}
