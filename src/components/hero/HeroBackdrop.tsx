"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Parallax } from "@/components/motion/Parallax";
import { cn } from "@/lib/cn";

/**
 * The hero ground. Three depths of hairline geometry, all built from the two
 * shapes the brand already owns — the square rule and the multiply mark.
 *
 * Motion is layered, never fast: the grid drifts on scroll, the square rules
 * rotate on a ninety-second cycle, one scan line crosses on a loop, and the
 * whole field leans a few pixels toward the pointer. Decorative and
 * aria-hidden; reduced motion keeps the composition and drops the movement.
 */
export function HeroBackdrop({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const gridId = compact ? "page-grid" : "hero-grid";

  // Pointer lean, normalised to -1..1 and spring-damped so it never snaps.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  const leanNearX = useTransform(sx, [-1, 1], [14, -14]);
  const leanNearY = useTransform(sy, [-1, 1], [10, -10]);
  const leanFarX = useTransform(sx, [-1, 1], [5, -5]);
  const leanFarY = useTransform(sy, [-1, 1], [4, -4]);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = host.current?.getBoundingClientRect();
    if (!box) return;
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={host}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto absolute inset-0 overflow-hidden"
    >
      {/* Depth 1 — the grid. */}
      <Parallax distance={48} className="absolute -inset-y-[20%] inset-x-0" damp={false}>
        <motion.div className="h-full w-full" style={reduce ? undefined : { x: leanFarX, y: leanFarY }}>
          <svg className="h-full w-full">
            <defs>
              <pattern id={gridId} width="96" height="96" patternUnits="userSpaceOnUse">
                <path
                  d="M 96 0 L 0 0 0 96"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="1"
                  opacity="0.16"
                />
              </pattern>
              {/* The grid fades out toward the copy so type never fights it. */}
              <linearGradient id={`${gridId}-fade`} x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
                <stop offset="55%" stopColor="#fff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#fff" stopOpacity="1" />
              </linearGradient>
              <mask id={`${gridId}-mask`}>
                <rect width="100%" height="100%" fill={`url(#${gridId}-fade)`} />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${gridId})`} mask={`url(#${gridId}-mask)`} />
          </svg>
        </motion.div>
      </Parallax>

      {/* Depth 2 — two square rules on a slow counter-rotation. */}
      <Parallax distance={-120} className="absolute -inset-y-[24%] inset-x-0">
        <motion.div
          className="relative h-full w-full"
          style={reduce ? undefined : { x: leanNearX, y: leanNearY }}
        >
          <motion.div
            className={cn(
              "absolute right-[-8%] aspect-square border-hairline border-strike/[0.14]",
              compact ? "top-[-30%] w-[30%]" : "top-[6%] w-[42%]",
            )}
            animate={reduce ? undefined : { rotate: 90 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={cn(
              "absolute right-[2%] aspect-square border-hairline border-strike/[0.20]",
              compact ? "top-[6%] w-[17%]" : "top-[22%] w-[24%]",
            )}
            animate={reduce ? undefined : { rotate: -90 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </Parallax>

      {/* Depth 3 — the multiply mark, and a scan line that crosses on a loop. */}
      <Parallax distance={-200} className="absolute -inset-y-[28%] inset-x-0">
        <motion.div
          className="relative h-full w-full"
          style={reduce ? undefined : { x: leanNearX, y: leanNearY }}
        >
          <motion.span
            className={cn(
              "absolute right-[13%] select-none font-mono leading-none text-strike/[0.16]",
              compact ? "top-[52%] text-[clamp(2rem,4vw,3.5rem)]" : "top-[40%] text-[clamp(3rem,7vw,6rem)]",
            )}
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            &#215;
          </motion.span>

          {!reduce && !compact ? (
            <motion.div
              className="absolute inset-x-0 h-px bg-strike/25"
              initial={{ top: "8%", opacity: 0 }}
              animate={{ top: ["8%", "88%"], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                repeatDelay: 3,
                ease: [0.22, 0.61, 0.36, 1],
                times: [0, 1],
                opacity: { duration: 9, repeat: Infinity, repeatDelay: 3, times: [0, 0.12, 0.8, 1] },
              }}
            />
          ) : null}
        </motion.div>
      </Parallax>
    </div>
  );
}
