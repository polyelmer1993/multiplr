"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PointerWash, usePointerWash } from "@/components/motion/PointerWash";
import { MediaPlate } from "./MediaPlate";
import type { Project } from "@/content/work";

/**
 * The lead case study. The whole plate is one link, so hover and keyboard
 * focus drive the same state: the border steps 1px -> 2px with padding
 * stepping down to match, the image plate wipes to Strike, and the read-more
 * rule draws out from the left.
 */
export function FeaturedWork({ project, href = "/work" }: { project: Project; href?: string }) {
  const reduce = useReducedMotion();
  const wash = usePointerWash<HTMLAnchorElement>();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <Link
        {...wash}
        href={href}
        className="group relative isolate block overflow-hidden border-hairline border-muted bg-paper p-[24px] transition-colors duration-300 ease-calm hover:border-active hover:border-strike hover:p-[23px] focus-visible:border-active focus-visible:border-strike focus-visible:p-[23px] md:p-[64px] md:hover:p-[63px] md:focus-visible:p-[63px]"
      >
        <PointerWash radius={360} alpha={0.05} />

        <div className="flex flex-wrap items-baseline justify-between gap-s-3">
          <p className="font-mono text-mono-label uppercase text-strike">
            {project.client} / {project.year}
          </p>
          <p className="font-mono text-mono-micro uppercase text-muted">Lead engagement</p>
        </div>

        <h3 className="mt-s-5 max-w-[22ch] text-heading-md text-ink transition-colors duration-300 ease-calm group-hover:text-strike">
          {project.title}
        </h3>

        <p className="mt-s-5 max-w-measure text-body text-muted">{project.summary}</p>

        <MediaPlate
          alt={`Placeholder image for the ${project.client} case study`}
          caption="Case study image — placeholder"
          overlayLabel={"Read it \u2192"}
          className="mt-s-7"
        />

        <div className="mt-s-7 flex flex-col gap-s-4 border-t-hairline border-muted/40 pt-s-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-mono-micro uppercase text-muted">{project.discipline}</p>
          <span className="inline-flex items-center gap-s-3 font-sans text-ui text-strike">
            <span
              aria-hidden="true"
              className="block h-px w-0 bg-strike transition-[width] duration-[420ms] ease-calm group-hover:w-s-7 group-focus-visible:w-s-7"
            />
            View all work
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
