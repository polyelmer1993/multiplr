"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * A section title whose words rise into place one after another the first
 * time it scrolls into view.
 */
export function SectionHeading({
  children,
  id,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const words = children.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      id={id}
      aria-label={children}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.07 }}
      className={`text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd ${className}`}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="-mb-[.1em] inline-block overflow-hidden pb-[.1em] align-top">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </MotionTag>
  );
}
