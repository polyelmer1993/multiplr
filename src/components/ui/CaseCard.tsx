import Link from "next/link";
import { CaseCover } from "@/components/illustrations/CaseCover";
import type { CaseStudy } from "@/lib/content";
import { ArrowIcon } from "./ArrowIcon";

/** A case study card: tags across the top, the cover, then the title and headline result. The whole card links. */
export function CaseCard({ study, headingLevel: H = "h3" }: { study: CaseStudy; headingLevel?: "h2" | "h3" }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-paper transition-[box-shadow,transform] duration-500 ease-site hover:-translate-y-1 hover:shadow-[0_40px_70px_-44px_rgba(13,19,85,.6)]">
      <div className="flex flex-wrap gap-1.5 p-4 pb-0">
        {[study.sector, study.service].map((t) => (
          <span key={t} className="rounded-[4px] bg-ink/[.05] px-2 py-1 font-mono text-[10px] font-medium tracking-[.1em] text-ink/60 uppercase">
            {t}
          </span>
        ))}
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-[12px]">
          <CaseCover
            motif={study.motif}
            stat={study.stats[0].value}
            className="aspect-4/3 transition-transform duration-700 ease-site group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5">
        <H className="text-[clamp(1.25rem,1.6vw,1.55rem)] leading-[1.15] font-normal tracking-[-.03em] text-deep">
          <Link
            href={`/case-studies/${study.slug}`}
            className="no-underline after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:rounded-[18px] after:focus-visible:outline-2 after:focus-visible:outline-offset-3 after:focus-visible:outline-strike"
          >
            {study.title}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 text-[14.5px] text-ink/60">{study.summary}</p>
        <p className="mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] font-medium tracking-[.12em] text-strike uppercase">
          Read the case study
          <ArrowIcon className="transition-transform duration-[350ms] ease-site group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </article>
  );
}
