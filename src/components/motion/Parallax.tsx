"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Scroll parallax, house rules: translate only, never scale or rotate the
 * content itself. `distance` is total Y travel across a full pass through the
 * viewport — keep it small; the effect should read as depth, not as movement.
 *
 * The ref sits on a static outer element so the measured position never feeds
 * back into the transform. Reduced motion renders a flat layer.
 */
export function Parallax({
  children,
  distance = 48,
  className,
  innerClassName,
  damp = true,
}: {
  children: React.ReactNode;
  /** Total Y travel in px. Negative moves the layer against the scroll. */
  distance?: number;
  className?: string;
  innerClassName?: string;
  /** Spring-smooth the travel. Off for layers that must track scroll exactly. */
  damp?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const smooth = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.35 });
  const y = damp ? smooth : raw;

  // The inner layer fills the outer one, so an absolutely positioned backdrop
  // can size its own children against it with h-full.
  const inner = cn("h-full w-full", innerClassName);

  if (reduce) {
    return (
      <div className={className}>
        <div className={inner}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div className={cn(inner, "will-change-transform")} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
