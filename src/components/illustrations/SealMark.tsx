"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { EASE } from "@/lib/motion";

/** The seal's letters, row by row. The last cell of the last row is the ×. */
const ROWS = [
  ["M", "U", "L"],
  ["T", "I", "P"],
  ["L", "R"],
];
const LETTERS = ROWS.flat();
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/#";
const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * The Multiplr seal, blown up to fill the hero as a living backdrop.
 * - On load the frame draws itself and the letters decode into place.
 * - Every couple of seconds one letter scrambles and briefly fills in solid,
 *   as if the seal were quietly working on one piece at a time.
 * - It tilts towards the cursor, and as you scroll the × turns like a key
 *   while the seal grows past you.
 */
export function SealMark({ progress, className = "" }: { progress?: MotionValue<number>; className?: string }) {
  const { reduced } = useSite();
  const zero = useMotionValue(0);
  const p = progress ?? zero;
  const [chars, setChars] = useState<string[]>(() => LETTERS.map(() => ""));
  const [lit, setLit] = useState<number | null>(null);
  const raf = useRef(0);

  // Load: decode every letter, staggered left to right, top to bottom.
  useEffect(() => {
    if (reduced) return;
    const start = performance.now() + 350;
    const tick = (now: number) => {
      const t = (now - start) / 1400;
      setChars(LETTERS.map((ch, i) => (t < i * 0.07 ? "" : t > 0.3 + i * 0.07 ? ch : rand())));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setChars(LETTERS);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  // Idle: work on one piece at a time.
  useEffect(() => {
    if (reduced) return;
    let last = -1;
    let timers: number[] = [];
    const work = () => {
      let i = Math.floor(Math.random() * LETTERS.length);
      if (i === last) i = (i + 1) % LETTERS.length;
      last = i;
      setLit(i);
      // A few frames of scramble, then it settles back to its letter.
      for (let k = 0; k < 6; k++) {
        timers.push(window.setTimeout(() => setChars((c) => c.map((ch, j) => (j === i ? rand() : ch))), k * 55));
      }
      timers.push(window.setTimeout(() => setChars((c) => c.map((ch, j) => (j === i ? LETTERS[i] : ch))), 340));
      timers.push(window.setTimeout(() => setLit(null), 1500));
    };
    const loop = window.setInterval(() => {
      timers = [];
      work();
    }, 2200);
    const first = window.setTimeout(work, 2600);
    return () => {
      clearInterval(loop);
      clearTimeout(first);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  // Tilt towards the pointer.
  const tx = useSpring(0, { stiffness: 50, damping: 18 });
  const ty = useSpring(0, { stiffness: 50, damping: 18 });
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx.set((e.clientX / window.innerWidth - 0.5) * 2);
      ty.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, tx, ty]);
  const rotateY = useTransform(tx, (v) => v * 10);
  const rotateX = useTransform(ty, (v) => v * -8);

  // Scroll: the × turns a quarter like a key, and the seal grows and fades past you.
  const keyTurn = useTransform(p, [0, 0.45], [0, 90]);
  const scale = useTransform(p, [0, 1], [1, 1.35]);
  const opacity = useTransform(p, [0.3, 1], [1, 0.35]);

  return (
    <div aria-hidden="true" className={`pointer-events-none perspective-[1400px] ${className}`}>
      <motion.div style={{ rotateX, rotateY, scale, opacity }} className="relative aspect-square w-full [container-type:size]">
        {/* Frame: a double rule that draws itself in */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <motion.rect
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            className="stroke-deep"
            strokeWidth=".3"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.1 }}
          />
          <motion.rect
            x="3"
            y="3"
            width="94"
            height="94"
            className="stroke-deep/25"
            strokeWidth=".2"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.35 }}
          />
        </svg>

        {/* Letters */}
        <div className="absolute inset-[7.5%] grid grid-rows-3 items-center font-mono text-[21cqh] leading-none font-semibold">
          {ROWS.map((row, r) => (
            <div key={r} className="flex items-center justify-between">
              {row.map((_, c) => {
                const i = r * 3 + c;
                const on = lit === i;
                return (
                  <span
                    key={c}
                    className={`inline-block w-[.62em] text-center transition-[color,-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1.5px_var(--color-deep)] ${
                      on ? "text-strike [-webkit-text-stroke-color:var(--color-strike)]" : "text-transparent"
                    }`}
                  >
                    {(reduced ? LETTERS[i] : chars[i]) || " "}
                  </span>
                );
              })}
              {r === 2 && (
                <motion.span
                  className="inline-block w-[.62em] text-center text-strike"
                  initial={reduced ? false : { scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 1.2 }}
                >
                  <motion.span className="inline-block" style={{ rotate: keyTurn }}>
                    &times;
                  </motion.span>
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
