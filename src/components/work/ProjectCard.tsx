"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PointerWash, TopRule, usePointerWash } from "@/components/motion/PointerWash";
import { MediaPlate } from "./MediaPlate";
import type { Project } from "@/content/work";

/**
 * A cell in the work index. There are no case-study routes yet, so this is
 * deliberately not a link: the hover state decorates, it does not promise a
 * destination. Give it an `href` once the routes exist and wrap it then.
 */
export function ProjectCard({ project, position }: { project: Project; position: number }) {
  const reduce = useReducedMotion();
  const wash = usePointerWash<HTMLElement>();

  return (
    <motion.li
      className="group relative isolate overflow-hidden bg-paper"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay: (position % 3) * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <article {...wash} className="relative flex h-full flex-col p-s-6">
        <PointerWash radius={240} alpha={0.06} />
        <TopRule />

        <p className="font-mono text-mono-label uppercase text-strike">
          {project.client} / {project.year}
        </p>

        <MediaPlate
          alt={`Placeholder image for ${project.client}`}
          caption="Project image — placeholder"
          aspect="aspect-[4/3]"
          parallax={0}
          className="mt-s-5"
        />

        <h2 className="mt-s-5 text-heading-sm text-ink transition-colors duration-300 ease-calm group-hover:text-strike">
          {project.title}
        </h2>

        <p className="mt-s-3 flex-1 text-body text-muted">{project.summary}</p>

        <p className="mt-s-5 flex items-center gap-s-3 border-t-hairline border-muted/40 pt-s-4 font-mono text-mono-micro uppercase text-muted transition-colors duration-300 ease-calm group-hover:text-strike">
          <span
            aria-hidden="true"
            className="block h-px w-s-4 bg-muted transition-[width,background-color] duration-[420ms] ease-calm group-hover:w-s-7 group-hover:bg-strike"
          />
          {project.discipline}
        </p>
      </article>
    </motion.li>
  );
}
