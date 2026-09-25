"use client";

import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Sheet } from "@/components/ui/Sheet";
import { STORY } from "@/lib/content";
import { AdoptionCurve } from "./AdoptionCurve";

/**
 * The founder's story. A portrait card stays pinned on the left and slowly
 * warms from grey to colour as the chapters on the right scroll past; the
 * chapter you're reading is the one in full ink. Ends on the adoption curve.
 */
export function Story() {
  const { reduced } = useSite();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 50%"] });
  const done = useMotionValue(1);
  const p = reduced ? done : scrollYProgress;
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(STORY.length - 1, Math.floor(v * STORY.length))));

  const gray = useTransform(p, [0, 0.8], [1, 0]);
  const filter = useMotionTemplate`grayscale(${gray})`;
  const zoom = useTransform(p, [0, 1], [1.12, 1]);

  return (
    <Sheet id="story" tone="bone" aria-labelledby="story-title" className="z-10 py-[clamp(90px,14vh,150px)]">
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-[24vh]">
            <Label perch className="text-strike">
              Story
            </Label>
            <figure className="mt-6 max-w-[340px] overflow-hidden rounded-[18px] bg-paper p-3">
              <div className="overflow-hidden rounded-[12px] bg-field">
                <motion.div style={{ filter, scale: zoom }}>
                  <Image src="/portrait.webp" alt="Portrait of Multiplr's founder" width={560} height={560} className="aspect-square w-full object-cover object-[50%_22%]" />
                </motion.div>
              </div>
              <figcaption className="flex items-center justify-between px-1 pt-3 font-mono text-[10.5px] font-medium tracking-[.14em] text-ink/55 uppercase">
                <span>Founder</span>
                <span>Melbourne, AU</span>
              </figcaption>
            </figure>
            {/* Chapter progress */}
            <ol aria-hidden="true" className="mt-5 flex max-w-[340px] gap-1.5">
              {STORY.map((c, i) => (
                <li key={c.meta} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
                  <span className={`block h-full bg-strike transition-transform duration-700 ease-site ${reduced || i <= active ? "scale-x-100" : "scale-x-0"} origin-left`} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="md:col-span-8 md:col-start-5">
          <h2 id="story-title" className="sr-only">
            Story
          </h2>
          <ol ref={ref} className="space-y-[clamp(48px,14vh,140px)]">
            {STORY.map((c, i) => {
              const on = reduced || i === active;
              return (
                <li key={c.meta}>
                  <p className={`font-mono text-[11px] font-medium tracking-[.14em] uppercase transition-colors duration-500 ${on ? "text-strike" : "text-ink/35"}`}>
                    0{i + 1} · {c.meta}
                  </p>
                  <p
                    className={`mt-3 text-[clamp(1.5rem,2.7vw,2.6rem)] leading-[1.18] font-light tracking-[-.035em] transition-colors duration-500 ${
                      on ? "text-deep" : "text-deep/20"
                    }`}
                  >
                    {c.text}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-[clamp(64px,14vh,140px)] rounded-[18px] bg-paper p-[clamp(18px,3vw,36px)]">
            <Label className="text-ink/60">Where I help you land</Label>
            <AdoptionCurve />
          </div>
        </div>
      </Container>
    </Sheet>
  );
}
