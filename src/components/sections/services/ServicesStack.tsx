"use client";

import { motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import { SERVICES } from "@/lib/content";
import { AnimatedServiceSketch } from "@/components/illustrations/AnimatedServiceSketches";
import { ServiceChips, ServicesHeader, serviceTitle } from "./shared";

const THEMES = [
  { card: "bg-paper text-ink", title: "text-strike", body: "text-ink/66", sketch: "text-strike", frame: "border-ink/8 bg-bone/32" },
  { card: "bg-deep text-bone", title: "text-bone", body: "text-bone/70", sketch: "text-[#8f99ff]", frame: "border-bone/15 bg-bone/5" },
  { card: "bg-field text-ink", title: "text-deep", body: "text-ink/66", sketch: "text-strike", frame: "border-ink/10 bg-paper/50" },
];

/**
 * Option C · Stacking cards. Each service is a full card that sticks as you
 * scroll; the next slides up over it and the ones behind shrink back.
 */
export function ServicesStack({ titleId }: { titleId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const none = useMotionValue(0);

  return (
    <>
      <ServicesHeader titleId={titleId} />
      <div ref={ref} className="relative mt-[clamp(28px,5vh,48px)]">
        {SERVICES.map((s, i) => (
          <StackCard key={i} index={i} progress={reduced ? none : scrollYProgress} />
        ))}
      </div>
    </>
  );
}

function StackCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const n = SERVICES.length;
  const s = SERVICES[index];
  const t = THEMES[index];
  const inner = useRef<HTMLDivElement>(null);
  // The graphic plays only while the card is on screen.
  const inView = useInView(inner, { amount: 0.4 });
  // Cards further back shrink more once the ones in front arrive.
  const scale = useTransform(progress, [index / n, 1], [1, 1 - (n - 1 - index) * 0.05]);
  const dim = useTransform(progress, [index / n, 1], [0, (n - 1 - index) * 0.12]);

  return (
    // The last card needs no extra scroll room behind it, so the section ends right after it.
    <div
      className={`sticky flex items-start ${index === n - 1 ? "" : "h-[88vh] md:h-[80vh]"}`}
      style={{ top: `calc(96px + ${index * 26}px)` }}
    >
      <motion.article
        ref={inner}
        style={{ scale }}
        className={`relative w-full origin-top overflow-hidden rounded-[26px] p-[clamp(22px,3vw,44px)] shadow-[0_-20px_50px_-30px_rgba(13,19,85,.45)] ${t.card}`}
      >
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] md:items-center">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[.2em] uppercase opacity-60">
              0{index + 1} / 0{n}
            </p>
            <h3 className={`mt-3 text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.02] font-medium tracking-[-.05em] ${t.title}`}>
              {serviceTitle(s.title)}
            </h3>
            <p className={`mt-4 max-w-[520px] text-[clamp(1rem,1.2vw,1.12rem)] ${t.body}`}>{s.body}</p>
            <ServiceChips chips={s.chips} className="mt-6" />
          </div>
          <div className={`order-first aspect-2/1 border md:order-none md:aspect-square ${t.frame}`}>
            <AnimatedServiceSketch index={index} active={inView} className={`h-full w-full p-[8%] ${t.sketch}`} />
          </div>
        </div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-deep" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}
