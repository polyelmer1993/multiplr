"use client";

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { CaseCover } from "@/components/illustrations/CaseCover";
import { useSite } from "@/components/SiteProvider";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { CASE_STUDIES, type CaseStudy } from "@/lib/content";

/** The full list: large alternating rows where the text and the cover drift apart as you scroll. */
export function CaseList() {
  return (
    <section aria-label="All case studies" className="pb-[clamp(60px,10vh,120px)]">
      <Container rail={false}>
        <ol className="flex flex-col gap-[clamp(64px,12vh,140px)]">
          {CASE_STUDIES.map((study, i) => (
            <CaseRow key={study.slug} study={study} index={i} />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function CaseRow({ study, index }: { study: CaseStudy; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { reduced } = useSite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useMotionValue(0.5);
  const p = reduced ? still : scrollYProgress;
  const coverY = useTransform(p, [0, 1], [50, -50]);
  const textY = useTransform(p, [0, 1], [110, -110]);
  const flip = index % 2 === 1;

  return (
    <li ref={ref} className="group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
      <motion.div style={{ y: coverY }} className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
        <CaseCover motif={study.motif} stat={study.stats[0].value} className="aspect-4/3 md:aspect-16/11" />
      </motion.div>
      <motion.div style={{ y: textY }} className={`max-md:transform-none! md:col-span-5 ${flip ? "md:order-1" : ""}`}>
        <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">
          0{index + 1} · {study.sector}
        </p>
        <h2 className="mt-3 text-[clamp(1.7rem,3vw,2.8rem)] leading-[1.05] font-medium tracking-[-.045em] text-strike">
          <Link
            href={`/case-studies/${study.slug}`}
            className="no-underline after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-8 after:focus-visible:outline-hd"
          >
            {study.title}
          </Link>
        </h2>
        <p className="mt-4 text-[clamp(1rem,1.2vw,1.1rem)] text-fg-soft">{study.summary}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-hair pt-5">
          {study.stats.slice(1).map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[1.5rem] font-medium tracking-[-.03em] text-fg">{s.value}</dd>
              <dd className="text-[13.5px] text-fg-soft">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-fg">
          Read the case study
          <ArrowIcon className="transition-transform duration-[350ms] ease-site group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </motion.div>
    </li>
  );
}
