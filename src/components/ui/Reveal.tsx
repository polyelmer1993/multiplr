"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/**
 * Wrap a block in <Reveal> and its children animate in (via <RevealLine>
 * and <FadeIn>) the first time a quarter of it scrolls into view.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

const line: Variants = {
  hidden: { y: "108%" },
  show: (i: number) => ({ y: 0, transition: { duration: 1.1, ease: EASE, delay: i * 0.09 } }),
};

/** One line of a headline that slides up from behind a mask. */
export function RevealLine({ children, index = 0, className = "" }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <span className="-mb-[.08em] block overflow-hidden pb-[.08em]">
      <motion.span className={`block ${className}`} variants={line} custom={index}>
        {children}
      </motion.span>
    </span>
  );
}

const fade: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE, delay },
  }),
};

/** Fades and un-blurs its content upwards. `delay` is in seconds. */
export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} variants={fade} custom={delay}>
      {children}
    </motion.div>
  );
}
