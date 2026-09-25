"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useSite } from "@/components/SiteProvider";

const RINGS = [
  { r: 250, tilt: -18, speed: 38, nodes: [0, 140] },
  { r: 320, tilt: 12, speed: 56, nodes: [60, 220, 300] },
  { r: 390, tilt: -6, speed: 80, nodes: [100] },
];

/**
 * A glowing sphere with tilted orbits and small nodes travelling round them:
 * the business at the centre, with its pieces circling. The orbits also turn
 * with the section's scroll progress.
 */
export function Orbit({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const { reduced } = useSite();
  const turn = useTransform(progress, [0, 1], [-30, 50]);

  return (
    <svg viewBox="-420 -420 840 840" aria-hidden="true" className={`pointer-events-none overflow-visible ${className}`}>
      <defs>
        <radialGradient id="orb" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#3440c8" />
          <stop offset=".55" stopColor="#1925aa" stopOpacity=".55" />
          <stop offset="1" stopColor="#0d1355" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rim" cx="50%" cy="50%" r="50%">
          <stop offset=".86" stopColor="#8f99ff" stopOpacity="0" />
          <stop offset=".97" stopColor="#8f99ff" stopOpacity=".5" />
          <stop offset="1" stopColor="#8f99ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle r="190" fill="url(#orb)" />
      <circle r="196" fill="url(#rim)" />

      <motion.g style={{ rotate: turn }}>
        {RINGS.map((ring, i) => (
          <g key={i} transform={`rotate(${ring.tilt}) scale(1 .3)`}>
            <circle r={ring.r} fill="none" stroke="#8f99ff" strokeOpacity=".28" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            <motion.g
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: ring.speed, repeat: Infinity, ease: "linear" }}
            >
              {ring.nodes.map((a) => (
                <g key={a} transform={`rotate(${a}) translate(${ring.r} 0)`}>
                  <circle r="16" fill="#8f99ff" fillOpacity=".18" />
                  <circle r="6" fill="#e8e6e0" />
                </g>
              ))}
            </motion.g>
          </g>
        ))}
      </motion.g>
    </svg>
  );
}
