"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Parallax } from "@/components/motion/Parallax";
import { GridBackdrop } from "@/components/backdrops/GridBackdrop";

/**
 * The contact band's ground. Inside the full-bleed Indigo Strike band the
 * only legible ink is bone, so every layer here is bone at low opacity.
 *
 * Four depths, each on its own parallax rate: the grid, a stack of concentric
 * square rules turning against each other, two drifting blocks, and the
 * multiply mark. Decorative, aria-hidden, and flat under reduced motion.
 */
export function ContactBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <GridBackdrop tone="strike" cell={64} />

      {/* Concentric square rules, counter-rotating. */}
      <Parallax distance={-160} className="absolute -inset-y-[30%] inset-x-0">
        <div className="relative h-full w-full">
          <div className="absolute right-[4%] top-1/2 aspect-square w-[34%] -translate-y-1/2 sm:w-[26%]">
            {[
              { inset: "0%", dur: 80, dir: 90, opacity: "border-bone/[0.18]" },
              { inset: "14%", dur: 60, dir: -90, opacity: "border-bone/[0.22]" },
              { inset: "28%", dur: 46, dir: 90, opacity: "border-bone/[0.28]" },
            ].map((ring) => (
              <motion.div
                key={ring.inset}
                className={`absolute border-hairline ${ring.opacity}`}
                style={{ inset: ring.inset }}
                animate={reduce ? undefined : { rotate: ring.dir }}
                transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
              />
            ))}

            <motion.span
              className="absolute inset-0 grid place-items-center font-mono text-[clamp(1.5rem,3vw,2.5rem)] leading-none text-bone/50"
              animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              &#215;
            </motion.span>
          </div>
        </div>
      </Parallax>

      {/* Two solid blocks drifting on a long loop — the only filled shapes. */}
      <Parallax distance={-260} className="absolute -inset-y-[34%] inset-x-0">
        <div className="relative h-full w-full">
          <motion.span
            className="absolute left-[8%] top-[22%] block h-s-5 w-s-5 bg-bone/20"
            animate={reduce ? undefined : { y: [0, 28, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute left-[46%] top-[68%] block h-s-3 w-s-3 bg-bone/25"
            animate={reduce ? undefined : { y: [0, -22, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          />
        </div>
      </Parallax>
    </div>
  );
}
