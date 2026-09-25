"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { Children, isValidElement, useRef, useState, type ElementType, type ReactNode } from "react";
import { useSite } from "@/components/SiteProvider";

type LitTextProps = {
  as?: ElementType;
  id?: string;
  big?: boolean;
  className?: string;
  /** Plain text, optionally mixed with inline elements (each counts as one word). */
  children: ReactNode;
};

/**
 * Text that "lights up" word by word as it scrolls through the viewport,
 * as if you were reading along.
 */
export function LitText({ as: Tag = "p", id, big, className = "", children }: LitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useSite();

  // Split strings into words; inline elements (like the portrait) stay whole.
  const words: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (typeof child === "string") words.push(...child.split(/\s+/).filter(Boolean));
    else if (isValidElement(child)) words.push(child);
  });

  const [lit, setLit] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.6"] });
  useMotionValueEvent(scrollYProgress, "change", (t) => setLit(Math.round(t * words.length)));

  const size = big
    ? "text-[clamp(1.6rem,3.3vw,3.3rem)] leading-[1.16] tracking-[-.04em]"
    : "text-[clamp(1.45rem,2.6vw,2.5rem)] leading-[1.2] tracking-[-.035em]";

  return (
    <Tag ref={ref} id={id} className={`font-medium ${size} ${className}`}>
      {words.map((w, i) => {
        const on = reduced || i < lit;
        return (
          <span key={i}>
            {i > 0 && " "}
            {typeof w === "string" ? (
              <span className={`transition-colors duration-[450ms] ${on ? "text-fg" : "text-fg-dim"}`}>{w}</span>
            ) : (
              <span data-on={on || undefined} className="group/lit">
                {w}
              </span>
            )}
          </span>
        );
      })}
    </Tag>
  );
}
