"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { STEPS } from "@/lib/content";
import { clamp } from "@/lib/motion";
import { DIAGRAMS, HowHeader } from "./shared";

const N = STEPS.length;

/**
 * Option A · Scrollytelling. Steps on the left, following a timeline; the
 * illustration on the right stays in view and plays along with the step you're reading.
 */
export function HowScrolly({ titleId }: { titleId: string }) {
  const { reduced } = useSite();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });
  const complete = useMotionValue(1);
  const progress = reduced ? complete : scrollYProgress;

  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setActive(Math.min(N - 1, Math.floor(v * N))));

  // The dot that rides down the timeline with you.
  const dotTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="py-[clamp(90px,14vh,160px)]">
      <Container>
        <HowHeader titleId={titleId} />

        <div className="mt-[clamp(32px,6vh,64px)] grid grid-cols-1 gap-x-[clamp(32px,6vw,96px)] md:grid-cols-2">
          {/* Left: the steps on a timeline */}
          <ol ref={listRef} className="relative pl-10 md:pl-12">
            <div aria-hidden="true" className="absolute top-0 bottom-0 left-[11px] w-px bg-hair">
              <motion.div className="absolute inset-0 origin-top bg-strike" style={{ scaleY: progress }} />
              <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: dotTop }}>
                <span className="block size-[15px] rounded-full border-2 border-strike bg-bgc" />
                {!reduced && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-strike"
                    animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            </div>

            {STEPS.map((step, i) => (
              <Step key={step.title} index={i} progress={progress} on={reduced || i === active} title={step.title} body={step.body} />
            ))}
          </ol>

          {/* Right: the illustration stays put while the steps scroll past */}
          <div aria-hidden="true" className="relative hidden md:block">
            <div className="sticky top-[max(110px,calc(50vh-min(22vw,300px)))]">
              <div className="relative aspect-square w-full border border-hair bg-paper shadow-[0_30px_70px_-50px_rgba(13,19,85,.6)]">
                <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-hair px-5 py-3 font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {STEPS[active].title}
                    </motion.span>
                  </AnimatePresence>
                  <span>
                    <span className="text-fg">0{active + 1}</span> / 0{N}
                  </span>
                </div>
                <div className="absolute inset-x-0 top-11 bottom-0">
                  <AnimatePresence initial={false}>
                    <PanelDiagram key={active} index={active} progress={progress} />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

/** Progress through step i alone, from 0 to 1. */
function useStepProgress(progress: MotionValue<number>, i: number) {
  return useTransform(progress, (v) => clamp(v * N - i, 0, 1));
}

function PanelDiagram({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const p = useStepProgress(progress, index);
  const D = DIAGRAMS[index];
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center p-[6%] [&_svg]:h-auto [&_svg]:w-full"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
      transition={{ duration: 0.45 }}
    >
      <D p={p} />
    </motion.div>
  );
}

function Step({
  index,
  progress,
  on,
  title,
  body,
}: {
  index: number;
  progress: MotionValue<number>;
  on: boolean;
  title: string;
  body: string;
}) {
  const p = useStepProgress(progress, index);
  const D = DIAGRAMS[index];

  return (
    <li className="relative flex min-h-[auto] flex-col justify-center py-10 md:min-h-[72vh] md:py-0">
      <motion.div animate={{ opacity: on ? 1 : 0.3, x: on ? 0 : -6 }} transition={{ duration: 0.4 }}>
        <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">Step 0{index + 1}</p>
        <h3 className="mt-2 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] font-medium tracking-[-.045em] text-strike">{title}</h3>
        <p className="mt-3 max-w-[460px] text-[clamp(1rem,1.2vw,1.12rem)] text-fg-soft">{body}</p>
        {/* A short line under the text that fills as you read this step */}
        <div aria-hidden="true" className="mt-6 h-px max-w-[460px] bg-hair">
          <motion.div className="h-full origin-left bg-strike" style={{ scaleX: p }} />
        </div>
      </motion.div>

      {/* On phones the illustration sits under each step instead */}
      <div aria-hidden="true" className="mt-6 border border-hair bg-paper md:hidden [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
        <D p={p} />
      </div>
    </li>
  );
}
