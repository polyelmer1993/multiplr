"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { STEPS } from "@/lib/content";
import { DIAGRAMS, HowHeader } from "./shared";

// A winding road in a 100 × 300 box: one bend per step, alternating sides.
const ROAD =
  "M50 0 C50 25 18 25 18 50 C18 75 50 75 50 100 C50 125 82 125 82 150 C82 175 50 175 50 200 C50 225 18 225 18 250 C18 275 50 275 50 300";

/**
 * Option D · Winding path. A road snakes down between the steps and draws
 * itself as you scroll, with a marker travelling along it. Steps swap sides,
 * big numbers drift in the background, and each diagram plays as you arrive.
 */
export function HowPath({ titleId }: { titleId: string }) {
  const { reduced } = useSite();
  const ref = useRef<HTMLOListElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const done = useMotionValue(1);
  const p = reduced ? done : scrollYProgress;

  // Keep the marker on the road: find the point that far along the path.
  const left = useMotionValue("50%");
  const top = useMotionValue("0%");
  const revealed = useMotionValue(0);
  const place = (v: number) => {
    const path = pathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(v * path.getTotalLength());
    left.set(`${pt.x}%`);
    top.set(`${(pt.y / 300) * 100}%`);
    revealed.set(pt.y);
  };
  useMotionValueEvent(p, "change", place);
  useEffect(() => place(p.get()));
  // useId can contain characters that aren't safe inside url(#…).
  const clipId = `road-${titleId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="py-[clamp(90px,14vh,160px)]">
      <Container>
        <HowHeader titleId={titleId} />
        <ol ref={ref} className="relative mt-[clamp(32px,6vh,64px)] grid auto-rows-fr">
          {/* The road, in its own column down the middle (down the left on phones) */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-12 md:left-1/2 md:w-[120px] md:-translate-x-1/2">
            <svg viewBox="0 0 100 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
              <path d={ROAD} className="stroke-hair" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeDasharray="3 6" />
              {/* The travelled part: the same road, revealed from the top as you scroll */}
              <defs>
                <clipPath id={clipId}>
                  <motion.rect x="-10" y="0" width="120" style={{ height: revealed }} />
                </clipPath>
              </defs>
              <path
                ref={pathRef}
                d={ROAD}
                className="stroke-strike"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                clipPath={`url(#${clipId})`}
              />
            </svg>
            <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
              <span className="block size-5 rotate-45 border-2 border-strike bg-bgc shadow-[0_0_0_6px_rgba(25,37,170,.12)]" />
            </motion.div>
          </div>

          {STEPS.map((s, i) => (
            <PathStep key={i} index={i} title={s.title} body={s.body} />
          ))}
        </ol>
      </Container>
    </div>
  );
}

function PathStep({ index, title, body }: { index: number; title: string; body: string }) {
  const { reduced } = useSite();
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const done = useMotionValue(0.5);
  const s = reduced ? done : scrollYProgress;
  // Diagram plays between the row entering and reaching the middle of the screen.
  const p = useTransform(s, [0.15, 0.5], [0, 1], { clamp: true }) as MotionValue<number>;
  const numberY = useTransform(s, [0, 1], [80, -80]);
  const cardY = useTransform(s, [0, 0.45], [70, 0]);
  const cardOpacity = useTransform(s, [0.05, 0.3], [0, 1]);
  const flip = index % 2 === 1;
  const D = DIAGRAMS[index];

  return (
    <li ref={ref} className="relative grid min-h-[70vh] grid-cols-1 items-center gap-6 py-10 pl-16 md:grid-cols-[1fr_120px_1fr] md:gap-0 md:pl-0">
      <motion.div className={`relative ${flip ? "md:col-start-3" : "md:col-start-1"} md:row-start-1`} style={{ opacity: cardOpacity, y: cardY }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[.55em] left-0 font-mono text-[clamp(5rem,12vw,10rem)] leading-none font-semibold text-transparent [-webkit-text-stroke:1px_var(--hair)]"
        >
          <motion.span className="block" style={{ y: numberY }}>
            0{index + 1}
          </motion.span>
        </span>
        <div className="relative">
          <h3 className="text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] font-medium tracking-[-.045em] text-strike">{title}</h3>
          <p className="mt-3 max-w-[440px] text-[clamp(1rem,1.2vw,1.12rem)] text-fg-soft">{body}</p>
        </div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className={`border border-hair bg-paper shadow-[0_30px_60px_-45px_rgba(13,19,85,.6)] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full ${
          flip ? "md:col-start-1" : "md:col-start-3"
        } md:row-start-1`}
        style={{ opacity: cardOpacity, y: cardY }}
      >
        <D p={p} />
      </motion.div>
    </li>
  );
}
