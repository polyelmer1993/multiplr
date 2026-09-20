"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GhostIndex, PointerWash, TopRule, usePointerWash } from "@/components/motion/PointerWash";
import { cn } from "@/lib/cn";

/**
 * A numbered cell in a hairline grid — the practice areas on the home page and
 * the engagement steps on About are the same object with different copy.
 *
 * Resting, it is plain bone and a number. On hover it lifts to paper, a Strike
 * rule draws along the top edge, the ghost index rises in the corner and the
 * pointer wash follows the cursor. Nothing here moves layout: every step is a
 * colour, an opacity or a transform.
 *
 * The cards are not links, so the footer label is decorative and aria-hidden —
 * nothing claims to be interactive that is not.
 */
export function NumberedCard({
  index,
  title,
  body,
  footer,
  position,
  as = "li",
  className,
}: {
  index: string;
  title: string;
  body: string;
  /** Decorative label revealed on hover. */
  footer?: string;
  /** Position in the list — drives the entrance stagger only. */
  position: number;
  as?: "li" | "div";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const wash = usePointerWash<HTMLElement>();
  const Tag = motion[as];

  return (
    <Tag
      className={cn(
        "group relative isolate overflow-hidden bg-bone transition-colors duration-300 ease-calm hover:bg-paper",
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay: position * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <article {...wash} className="relative h-full p-s-6 md:p-s-7">
        <PointerWash radius={260} alpha={0.07} />
        <TopRule />
        <GhostIndex>{index}</GhostIndex>

        <p className="font-mono text-mono-label text-strike">{index}</p>

        <h3 className="mt-s-4 text-heading-sm text-ink transition-colors duration-300 ease-calm group-hover:text-strike">
          {title}
        </h3>

        <p className="mt-s-3 max-w-measure text-body text-muted">{body}</p>

        {footer ? (
          <span
            aria-hidden="true"
            className="mt-s-5 flex items-center gap-s-3 font-mono text-mono-micro uppercase text-strike opacity-0 transition-opacity duration-300 ease-calm group-hover:opacity-100"
          >
            <span className="block h-px w-s-6 origin-left scale-x-0 bg-strike transition-transform duration-500 ease-calm group-hover:scale-x-100" />
            {footer}
          </span>
        ) : null}
      </article>
    </Tag>
  );
}
