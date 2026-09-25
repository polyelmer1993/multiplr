"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useSite } from "@/components/SiteProvider";

/**
 * Wraps content in a card that tilts gently towards the cursor, with a soft
 * spotlight that follows it. Does nothing for touch or reduced motion.
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
  glow = "rgba(25,37,170,.10)",
}: {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  glow?: string;
}) {
  const { reduced } = useSite();
  const spring = { stiffness: 220, damping: 22 };
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const light = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${glow}, transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 2 * max);
    rx.set(-(y - 0.5) * 2 * max);
    mx.set(x * 100);
    my.set(y * 100);
    light.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    light.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`relative h-full ${className}`}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{ background, opacity: light }}
      />
    </motion.div>
  );
}
