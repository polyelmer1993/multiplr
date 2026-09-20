"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GhostIndex, PointerWash, TopRule, usePointerWash } from "@/components/motion/PointerWash";
import type { Project } from "@/content/work";

/**
 * A case-study teaser. Everything about the hover state is also a focus state,
 * because the card is a link and keyboard users get the same read.
 *
 * The number in the corner is the card's position in the list, not data — it
 * is aria-hidden and exists to give the row a rhythm.
 */
export function WorkCard({
  project,
  position,
  href = "/work",
}: {
  project: Project;
  position: number;
  href?: string;
}) {
  const reduce = useReducedMotion();
  const wash = usePointerWash<HTMLAnchorElement>();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay: position * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <Link
        {...wash}
        href={href}
        className="group relative isolate flex h-full flex-col overflow-hidden border-hairline border-muted bg-paper p-[24px] transition-colors duration-300 ease-calm hover:border-active hover:border-strike hover:p-[23px] focus-visible:border-active focus-visible:border-strike focus-visible:p-[23px]"
      >
        <PointerWash radius={220} alpha={0.06} />
        <TopRule />
        <GhostIndex className="right-s-3 -top-s-5 text-[5.5rem] group-hover:translate-y-s-4 group-focus-visible:translate-y-s-4">
          {String(position + 1).padStart(2, "0")}
        </GhostIndex>

        <p className="eyebrow mb-s-4">
          {project.client} / {project.year}
        </p>

        <h3 className="text-heading-sm text-ink transition-colors duration-300 ease-calm group-hover:text-strike group-focus-visible:text-strike">
          {project.title}
        </h3>

        <p className="mt-s-3 max-w-measure text-body text-muted">{project.summary}</p>

        <span className="mt-auto flex items-center gap-s-3 pt-s-6 font-mono text-mono-micro uppercase text-muted transition-colors duration-300 ease-calm group-hover:text-strike group-focus-visible:text-strike">
          <span
            aria-hidden="true"
            className="block h-px w-s-4 bg-muted transition-[width,background-color] duration-[420ms] ease-calm group-hover:w-s-7 group-hover:bg-strike group-focus-visible:w-s-7 group-focus-visible:bg-strike"
          />
          {project.discipline}
        </span>
      </Link>
    </motion.li>
  );
}
