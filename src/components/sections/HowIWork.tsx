"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, type ComponentType } from "react";
import { FindDiagram, FixDiagram, NextDiagram } from "@/components/illustrations/StepDiagrams";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Sheet } from "@/components/ui/Sheet";
import { STEPS } from "@/lib/content";

const DIAGRAMS: ComponentType<{ p: MotionValue<number> }>[] = [FindDiagram, FixDiagram, NextDiagram];

/**
 * "How I work". The step titles stay pinned on the left like a table of
 * contents, lighting up as their panel on the right scrolls through the
 * middle of the screen. Each panel's diagram plays along with its scroll.
 */
export function HowIWork() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLLIElement | null)[]>([]);

  const goTo = (i: number) => {
    const el = panels.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.18;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <Sheet id="how" tone="bone" aria-labelledby="how-title" className="z-10 py-[clamp(90px,14vh,150px)]">
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[24vh]">
            <Label perch className="text-strike">
              How I work
            </Label>
            <h2 id="how-title" className="sr-only">
              How I work
            </h2>
            <ol className="mt-6 hidden md:block">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={`block cursor-pointer text-left text-[clamp(2rem,3.6vw,3.6rem)] leading-[1.08] font-light tracking-[-.045em] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-strike ${
                      i === active ? "text-deep" : "text-deep/20 hover:text-deep/45"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-[360px] text-[15px] text-ink/60 max-md:mt-4 max-md:text-[clamp(1.6rem,6vw,2rem)] max-md:leading-[1.1] max-md:font-light max-md:tracking-[-.03em] max-md:text-deep">
              Three steps, repeated. Each round makes the next one easier.
            </p>
          </div>
        </div>

        <ol className="md:col-span-7">
          {STEPS.map((s, i) => (
            <Panel
              key={s.title}
              index={i}
              title={s.title}
              body={s.body}
              refCb={(el) => {
                panels.current[i] = el;
              }}
              onActive={() => setActive(i)}
            />
          ))}
        </ol>
      </Container>
    </Sheet>
  );
}

function Panel({
  index,
  title,
  body,
  refCb,
  onActive,
}: {
  index: number;
  title: string;
  body: string;
  refCb: (el: HTMLLIElement | null) => void;
  onActive: () => void;
}) {
  const { reduced } = useSite();
  const ref = useRef<HTMLLIElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const done = useMotionValue(1);
  // The diagram plays as the panel rises from the bottom of the screen to just above the middle.
  const p = useTransform(reduced ? done : scrollYProgress, [0.2, 0.55], [0, 1], { clamp: true }) as MotionValue<number>;
  const cardY = useTransform(reduced ? done : scrollYProgress, [0, 0.4], [80, 0]);
  const D = DIAGRAMS[index];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.3 && v < 0.7) onActive();
  });

  return (
    <li
      ref={(el) => {
        ref.current = el;
        refCb(el);
      }}
      className="pb-[clamp(60px,14vh,160px)] last:pb-0"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: cardY }}
        className="dot-grid relative aspect-4/3 overflow-hidden rounded-[18px] bg-paper [--dot:rgba(13,19,85,.12)] [&_svg]:absolute [&_svg]:inset-[8%] [&_svg]:h-[84%] [&_svg]:w-[84%]"
      >
        <span className="absolute top-4 left-5 z-10 font-mono text-[11px] font-medium tracking-[.14em] text-ink/50 uppercase">
          Step 0{index + 1} / 0{STEPS.length}
        </span>
        {/* A thin rail that fills with the diagram's progress */}
        <span className="absolute inset-x-5 bottom-4 z-10 h-px bg-ink/10">
          <motion.span className="block h-full origin-left bg-strike" style={{ scaleX: p }} />
        </span>
        <D p={p} />
      </motion.div>
      <p className="mt-7 font-mono text-[11px] font-medium tracking-[.14em] text-ink/50 uppercase md:hidden">0{index + 1}</p>
      <h3 className="mt-2 text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.15] font-normal tracking-[-.03em] text-deep md:mt-7">
        {title}
        <span className="text-ink/40">.</span>
      </h3>
      <p className="mt-3 max-w-[520px] text-[clamp(1rem,1.15vw,1.1rem)] text-ink/70">{body}</p>
    </li>
  );
}
