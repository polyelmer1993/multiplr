"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PointerWash, TopRule, usePointerWash } from "@/components/motion/PointerWash";
import { MediaPlate } from "@/components/work/MediaPlate";
import type { Member } from "@/content/team";

/** A team plate. Same hover vocabulary as the work index, half the scale. */
export function MemberCard({ member, position }: { member: Member; position: number }) {
  const reduce = useReducedMotion();
  const wash = usePointerWash<HTMLElement>();

  return (
    <motion.li
      className="group relative isolate h-full overflow-hidden border-hairline border-muted bg-paper transition-colors duration-300 ease-calm hover:border-active hover:border-strike"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.55, delay: position * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* The border steps 1px -> 2px on hover, so padding steps down to match. */}
      <article {...wash} className="relative h-full p-[24px] group-hover:p-[23px]">
        <PointerWash radius={200} alpha={0.06} />
        <TopRule />

        <MediaPlate
          alt={`Placeholder headshot for ${member.role}`}
          caption="Headshot"
          aspect="aspect-square"
          parallax={0}
        />

        <h3 className="mt-s-5 text-body font-medium text-ink transition-colors duration-300 ease-calm group-hover:text-strike">
          {member.name}
        </h3>
        <p className="mt-s-1 font-mono text-mono-label uppercase text-strike">{member.role}</p>
        <p className="mt-s-3 text-body-sm text-muted">{member.bio}</p>
      </article>
    </motion.li>
  );
}
