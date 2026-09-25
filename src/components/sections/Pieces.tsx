"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { RiseText } from "@/components/ui/RiseText";
import { Sheet } from "@/components/ui/Sheet";
import { PIECES, STATEMENT } from "@/lib/content";
import { EASE } from "@/lib/motion";

/** The order pieces get fixed in: the one that matters most first, not left to right. */
const ORDER = [4, 0, 7, 2, 5, 8, 1, 6, 3];
/** Each improved piece lifts the whole system a little more than the last. */
const RATE = 1.32;
const MAX = Math.pow(RATE, PIECES.length) - 1;

/**
 * "What I do", told as a pinned scene. The first sheet slides up over the
 * hero and holds still while you scroll: the statement plays out in three
 * beats, pieces of the business light up one by one, and the output bar
 * compounds as each one starts working.
 */
export function Pieces() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [fixedN, setFixedN] = useState(0);
  const [beat, setBeat] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setFixedN(Math.max(0, Math.min(PIECES.length, Math.floor((v - 0.06) * PIECES.length * 1.15))));
    setBeat(Math.min(STATEMENT.length - 1, Math.floor(v * STATEMENT.length * 1.05)));
  });

  const n = reduced ? PIECES.length : fixedN;
  const b = reduced ? -1 : beat;
  const fixed = new Set(ORDER.slice(0, n));
  const output = (Math.pow(RATE, n) - 1) / MAX;

  return (
    <Sheet id="pieces" tone="paper" aria-labelledby="pieces-title" className="z-10 -mt-[100svh]! md:-mt-[100svh]!">
      <div ref={ref} className={reduced ? "py-24" : "relative h-[320vh]"}>
        <div className={reduced ? "" : "sticky top-0 flex h-svh items-center pt-16 pb-6 md:pt-20 md:pb-8"}>
          <Container className="grid gap-7 md:grid-cols-12 md:items-center md:gap-10">
            <div className="md:col-span-6">
              <Label perch className="text-strike">
                What I do
              </Label>
              <RiseText
                id="pieces-title"
                lines={["Your business already", { text: "has the pieces.", accent: true }]}
                className="mt-4 text-[clamp(2.1rem,4.4vw,4.4rem)] leading-[1] font-light tracking-[-.045em] text-deep md:mt-5"
              />
              <div className={`mt-4 md:mt-[clamp(20px,4vh,40px)] md:block md:space-y-4 ${reduced ? "space-y-4" : "grid"}`}>
                {STATEMENT.map((s, i) => (
                  <p
                    key={i}
                    className={`max-w-[560px] text-[clamp(1.02rem,1.35vw,1.3rem)] leading-[1.45] tracking-[-.01em] transition-[color,opacity,transform] duration-700 ease-site ${
                      reduced ? "text-ink" : `max-md:col-start-1 max-md:row-start-1 ${i === b ? "text-ink" : i < b ? "text-ink/40 max-md:opacity-0" : "translate-y-1 text-ink/15 max-md:opacity-0"}`
                    }`}
                  >
                    {s}
                  </p>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className="md:col-span-5 md:col-start-8">
              <div className="rounded-[18px] border border-ink/8 bg-bone p-3.5 md:p-[clamp(14px,2vw,24px)]">
                <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] tracking-[.14em] text-ink/55 uppercase">
                  <span>Your business</span>
                  <span>
                    <span className="text-strike">{String(n).padStart(2, "0")}</span> / {String(PIECES.length).padStart(2, "0")} improved
                  </span>
                </div>
                <ul className="grid grid-cols-3 gap-2">
                  {PIECES.map((label, i) => {
                    const on = fixed.has(i);
                    const latest = ORDER[n - 1] === i && !reduced;
                    return (
                      <motion.li
                        key={label}
                        animate={latest ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className={`relative flex aspect-[4/3] flex-col justify-between md:aspect-[5/4] overflow-hidden rounded-[10px] border p-2.5 transition-colors duration-500 md:p-3 ${
                          on ? "border-strike bg-strike text-bone" : "border-ink/10 bg-paper text-ink/60"
                        }`}
                      >
                        <span className="font-mono text-[9.5px] tracking-[.12em]">0{i + 1}</span>
                        <span className="text-[clamp(.78rem,1vw,.95rem)] font-medium tracking-[-.01em]">{label}</span>
                        <svg viewBox="0 0 16 16" className="absolute top-2.5 right-2.5 size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <motion.path d="M3 8.5l3 3 7-7" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.4 }} />
                        </svg>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* The compounding output */}
                <div className="mt-3 border-t border-ink/10 pt-3 md:mt-4">
                  <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[.14em] text-ink/55 uppercase">
                    <span>System output</span>
                    <span>Compounding</span>
                  </div>
                  <div className="mt-2.5 flex h-10 items-end gap-1 md:h-16">
                    {PIECES.map((_, k) => (
                      <span
                        key={k}
                        className={`flex-1 origin-bottom rounded-[2px] transition-[transform,background-color] duration-700 ease-site ${k < n ? "bg-deep" : "bg-ink/8"}`}
                        style={{ height: "100%", transform: `scaleY(${Math.max(0.06, (Math.pow(RATE, k + 1) - 1) / MAX)})` }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-ink/8">
                    <div className="h-full origin-left bg-strike transition-transform duration-700 ease-site" style={{ transform: `scaleX(${output})` }} />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Sheet>
  );
}
