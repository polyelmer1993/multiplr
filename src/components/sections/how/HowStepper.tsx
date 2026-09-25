"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { STEPS } from "@/lib/content";
import { clamp, EASE } from "@/lib/motion";
import { DIAGRAMS, HowHeader } from "./shared";

const N = STEPS.length;

/**
 * Option C · Scroll stepper. The steps stay on screen while you scroll: each
 * one opens in turn, its bar fills as you go, and the graphic on the right
 * changes to match. Clicking a step scrolls straight to it.
 */
export function HowStepper({ titleId }: { titleId: string }) {
  const { reduced } = useSite();
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  // Which step the scroll position is in, and how far through it.
  const [scrolled, setScrolled] = useState(0);
  const [picked, setPicked] = useState(0);
  const active = reduced ? picked : scrolled;
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrolled(Math.min(N - 1, Math.floor(v * N))));
  const done = useMotionValue(1);
  const stepProgress = useTransform(scrollYProgress, (v) => {
    const raw = v * N;
    return clamp(raw - Math.min(N - 1, Math.floor(raw)), 0, 1);
  });
  const bar = reduced ? done : stepProgress;
  // The diagram finishes a little before the step ends, then holds.
  const p = useTransform(bar, [0, 0.75], [0, 1]);

  const goTo = (i: number) => {
    if (reduced) return setPicked(i);
    const el = pinRef.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const room = el.offsetHeight - window.innerHeight;
    // Land just inside step i, so its bar starts from the beginning.
    window.scrollTo({ top: top + room * ((i + 0.02) / N), behavior: "smooth" });
  };

  const D = DIAGRAMS[active];

  return (
    <div className="pt-[clamp(90px,14vh,160px)] pb-[clamp(40px,8vh,90px)]">
      <Container>
        <HowHeader titleId={titleId} />
      </Container>

      {/* Tall track to scroll through; the stepper stays pinned inside it. */}
      <div ref={pinRef} className={reduced ? "" : "relative h-[300vh]"}>
        <div className={reduced ? "py-10" : "sticky top-0 flex h-svh items-center pt-16"}>
          <Container className="grid gap-[clamp(20px,5vw,72px)] md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:items-center">
            <div role="tablist" aria-label="Steps" className="order-2 flex flex-col md:order-1">
              {STEPS.map((s, i) => {
                const on = i === active;
                const passed = i < active;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => goTo(i)}
                    className={`group relative cursor-pointer border-t border-hair py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hd md:py-6 ${
                      on ? "" : "hover:bg-fg/[.03]"
                    }`}
                  >
                    {/* Bar across the top: full for steps you've passed, filling for the current one */}
                    <span aria-hidden="true" className="absolute inset-x-0 -top-px h-[2px] overflow-hidden">
                      {on ? (
                        <motion.span className="block h-full origin-left bg-strike" style={{ scaleX: bar }} />
                      ) : (
                        <span className={`block h-full bg-strike transition-opacity duration-500 ${passed ? "opacity-35" : "opacity-0"}`} />
                      )}
                    </span>
                    <span className="flex items-baseline gap-4">
                      <span className={`font-mono text-[12px] font-semibold tracking-[.2em] ${on ? "text-strike" : "text-fg-soft"}`}>
                        0{i + 1}
                      </span>
                      <span
                        className={`text-[clamp(1.35rem,2.4vw,2.2rem)] leading-[1.05] font-medium tracking-[-.045em] transition-colors duration-300 ${
                          on ? "text-strike" : "text-fg/45 group-hover:text-fg/70"
                        }`}
                      >
                        {s.title}
                      </span>
                    </span>
                    {/* Opens with a CSS grid-rows transition rather than animating height: "auto",
                        which would interrupt smooth scrolling (Framer resets the scroll position to measure). */}
                    <span
                      aria-hidden={!on}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-site ${
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-3 pl-[calc(12px+2.4rem)] text-[clamp(.98rem,1.15vw,1.08rem)] text-fg-soft">{s.body}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
              {!reduced && (
                <p aria-hidden="true" className="flex items-center gap-2 border-t border-hair pt-3 font-mono text-[10.5px] tracking-[.2em] text-fg-soft uppercase">
                  <motion.span
                    className="inline-block"
                    animate={{ y: active === N - 1 ? 0 : [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                  {active === N - 1 ? "Keep scrolling to continue" : "Scroll to the next step"}
                </p>
              )}
            </div>

            <div
              aria-hidden="true"
              className="relative order-1 aspect-16/10 overflow-hidden border border-hair bg-paper shadow-[0_30px_70px_-50px_rgba(13,19,85,.6)] md:order-2 md:aspect-4/3"
            >
              {/* Step counter in the corner */}
              <div className="absolute top-3 right-4 z-10 font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft">
                <span className="text-fg">0{active + 1}</span> / 0{N}
              </div>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={active}
                  className="absolute inset-0 grid place-items-center p-[5%] [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full"
                  initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -50, scale: 1.02, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <D p={p} />
                </motion.div>
              </AnimatePresence>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
