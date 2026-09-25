"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Line = string | { text: string; accent?: boolean };

type RiseTextProps = {
  /** Each entry is one line. Mark a line `accent` to set it in the highlight colour. */
  lines: Line[];
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  accentClassName?: string;
  /** Animate on mount instead of when scrolled into view. */
  onMount?: boolean;
  delay?: number;
};

/**
 * A large light-weight headline. Words rise out of a soft blur, one after
 * another, the first time the headline comes into view.
 */
export function RiseText({
  lines,
  as: Tag = "h2",
  id,
  className = "",
  accentClassName = "text-strike",
  onMount,
  delay = 0,
}: RiseTextProps) {
  const MotionTag = motion[Tag];
  const norm = lines.map((l) => (typeof l === "string" ? { text: l } : l));
  const label = norm.map((l) => l.text).join(" ");
  let k = 0;

  const trigger = onMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.5 } };

  return (
    <MotionTag id={id} aria-label={label} className={className} {...trigger}>
      {norm.map((line, li) => (
        <span key={li} aria-hidden="true" className={`md:block ${line.accent ? accentClassName : ""}`}>
          {line.text.split(" ").map((w, wi) => {
            const i = k++;
            return (
              <span key={wi} className="-mb-[.12em] inline-block overflow-hidden pb-[.12em] align-top">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "105%", opacity: 0, filter: "blur(8px)" },
                    show: {
                      y: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { duration: 1, ease: EASE, delay: delay + i * 0.055 },
                    },
                  }}
                >
                  {w}
                </motion.span>
                {" "}
              </span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}
