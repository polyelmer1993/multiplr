import Link from "next/link";
import { CaseCover } from "@/components/illustrations/CaseCover";
import type { CaseStudy } from "@/lib/content";
import { ArrowIcon } from "./ArrowIcon";
import { TiltCard } from "./TiltCard";

/** A case study teaser. The whole card links to the full story. */
export function CaseCard({ study, headingLevel: H = "h3" }: { study: CaseStudy; headingLevel?: "h2" | "h3" }) {
  return (
    <TiltCard>
      <article className="group relative flex h-full flex-col border border-hair bg-paper transition-shadow duration-500 hover:shadow-[0_28px_60px_-36px_rgba(13,19,85,.6)]">
        <CaseCover motif={study.motif} stat={study.stats[0].value} className="aspect-4/3" />
        <div className="flex flex-1 flex-col p-[clamp(20px,2vw,28px)]">
          <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">
            {study.sector} · {study.service}
          </p>
          <H className="mt-2 text-[clamp(1.25rem,1.7vw,1.6rem)] leading-[1.12] font-medium tracking-[-.035em] text-strike">
            <Link
              href={`/case-studies/${study.slug}`}
              className="no-underline after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-3 after:focus-visible:outline-hd"
            >
              {study.title}
            </Link>
          </H>
          <p className="mt-2 text-[15px] text-fg-soft">{study.summary}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 text-[14px] font-semibold text-fg">
            Read the case study
            <ArrowIcon className="transition-transform duration-[350ms] ease-site group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </p>
        </div>
      </article>
    </TiltCard>
  );
}
