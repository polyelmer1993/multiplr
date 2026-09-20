"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Emphasis on the one word that carries the headline. An Indigo Strike block
 * wipes in behind it and the word steps to bone — the same pairing the
 * full-bleed band uses, so no new colour enters the system.
 *
 * It is built as two stacked copies, not as a block sliding behind one copy,
 * and that matters: the base copy is plain Strike text, so the word is legible
 * in the server HTML, with JavaScript off, and at every frame of the wipe. A
 * single copy would have to be bone the whole time — invisible on bone until
 * the block arrived under it.
 *
 * The highlighted copy is revealed by a clip opening left to right, in step
 * with its own background. Same technique as the button fill.
 */
export function Highlight({
  children,
  delay = 0.5,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn("relative inline-block px-[0.12em] text-strike", className)}>
      {children}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block bg-strike px-[0.12em] text-bone"
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0 0 0)" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Quieter emphasis for body copy: a strike rule draws under the phrase.
 * The phrase itself stays ink, so the measure keeps one text colour.
 */
export function Underscore({
  children,
  delay = 0.2,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn("relative inline-block text-ink", className)}>
      {children}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-2px] block h-[2px] origin-left bg-strike"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-64px" }}
        transition={{ duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] }}
      />
    </span>
  );
}
