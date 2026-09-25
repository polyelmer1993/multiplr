"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Line diagrams for the "How I work" timeline. Each one is driven by `p`,
 * the step's scroll progress from 0 to 1, so it plays as you scroll.
 */
type DiagramProps = { p: MotionValue<number> };

const DEEP = "var(--color-deep)";
const STRIKE = "var(--color-strike)";
const FAINT = "rgba(13,19,85,.18)";

const CELLS = [60, 124, 188].flatMap((y) => [110, 174, 238].map((x) => ({ x, y })));

/** 1. Find the piece: a magnifier sweeps the grid and settles on one square. */
export function FindDiagram({ p }: DiagramProps) {
  // The lens visits a few squares before landing on the one that matters.
  const lx = useTransform(p, [0, 0.25, 0.45, 0.7], [135, 199, 135, 263]);
  const ly = useTransform(p, [0, 0.25, 0.45, 0.7], [85, 85, 213, 149]);
  const found = useTransform(p, [0.7, 0.85], [0, 1]);
  const fill = useTransform(p, [0.75, 0.95], [0, 0.16]);
  const others = useTransform(p, [0.7, 0.9], [1, 0.45]);

  return (
    <svg viewBox="0 0 400 300" fill="none">
      <motion.g style={{ opacity: others }}>
        {CELLS.map(({ x, y }) => (
          <rect key={`${x},${y}`} x={x} y={y} width="50" height="50" stroke={FAINT} strokeWidth="1.2" />
        ))}
      </motion.g>
      <motion.rect x="238" y="124" width="50" height="50" fill={STRIKE} style={{ opacity: fill }} />
      <motion.rect x="238" y="124" width="50" height="50" stroke={STRIKE} strokeWidth="2.2" style={{ pathLength: found }} />
      <motion.g style={{ x: lx, y: ly }}>
        <circle r="46" stroke={DEEP} strokeWidth="1.6" fill="rgba(255,255,255,.35)" />
        <path d="M33 33 L64 64" stroke={DEEP} strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** 2. Fix it properly: two halves snap together, get tested, and a tick draws in. */
export function FixDiagram({ p }: DiagramProps) {
  const apart = useTransform(p, [0, 0.5], [34, 0]);
  const apartNeg = useTransform(apart, (v) => -v);
  const tilt = useTransform(p, [0, 0.5], [-8, 0]);
  const tiltNeg = useTransform(tilt, (v) => -v);
  const scan = useTransform(p, [0.45, 0.7], [70, 190]);
  const scanOpacity = useTransform(p, [0.45, 0.5, 0.68, 0.72], [0, 1, 1, 0]);
  const tick = useTransform(p, [0.7, 0.9], [0, 1]);
  const ruler = useTransform(p, [0.1, 0.6], [0, 1]);

  return (
    <svg viewBox="0 0 400 300" fill="none">
      <rect x="165" y="95" width="70" height="70" stroke={FAINT} strokeWidth="1.2" />
      <motion.path d="M140 70 H200 V190 H140 Z" stroke={DEEP} strokeWidth="1.6" style={{ x: apartNeg, rotate: tilt, originX: 1, originY: 1 }} />
      <motion.path d="M200 70 H260 V190 H200 Z" stroke={DEEP} strokeWidth="1.6" style={{ x: apart, rotate: tiltNeg, originX: 0, originY: 1 }} />
      <motion.path d="M140 0 H260" stroke={STRIKE} strokeWidth="1.2" strokeDasharray="4 4" style={{ y: scan, opacity: scanOpacity }} />
      <motion.path d="M166 134 L191 158 L236 108" stroke={STRIKE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: tick }} />
      <motion.path d="M120 222 H280 M150 214 V230 M200 214 V230 M250 214 V230" stroke={DEEP} strokeWidth="1.6" style={{ pathLength: ruler }} />
    </svg>
  );
}

/** 3. Move to the next: finished pieces fill in one after another, each passing the baton. */
export function NextDiagram({ p }: DiagramProps) {
  const xs = [70, 150, 230, 310];
  return (
    <svg viewBox="0 0 400 300" fill="none">
      {xs.map((x, i) => (
        <NextCell key={x} x={x} i={i} p={p} last={i === xs.length - 1} />
      ))}
      <path d="M60 222 H340" stroke={FAINT} strokeWidth="1.2" />
      <motion.path d="M60 222 H340" stroke={STRIKE} strokeWidth="2" style={{ pathLength: p }} />
    </svg>
  );
}

function NextCell({ x, i, p, last }: { x: number; i: number; p: MotionValue<number>; last: boolean }) {
  const start = i * 0.24;
  const fill = useTransform(p, [start, start + 0.12], [0, 1]);
  const lift = useTransform(p, [start, start + 0.08, start + 0.16], [0, -10, 0]);
  const arc = useTransform(p, [start + 0.1, start + 0.24], [0, 1]);
  return (
    <>
      <rect x={x} y="124" width="50" height="50" stroke={FAINT} strokeWidth="1.2" />
      <motion.rect x={x} y="124" width="50" height="50" fill={i === 0 ? DEEP : STRIKE} style={{ opacity: fill, y: lift }} />
      {!last && (
        <motion.path
          d={`M${x + 25} 118 C ${x + 25} 84, ${x + 105} 84, ${x + 105} 112 M${x + 98} 104 L${x + 105} 113 L${x + 112} 104`}
          stroke={DEEP}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: arc }}
        />
      )}
    </>
  );
}
