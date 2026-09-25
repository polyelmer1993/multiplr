import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCover } from "@/components/illustrations/CaseCover";
import { Contact } from "@/components/sections/Contact";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { FadeIn, Reveal, RevealLine } from "@/components/ui/Reveal";
import { SkipLink } from "@/components/ui/SkipLink";
import { CASE_STUDIES, getCaseStudy } from "@/lib/content";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await props.params).slug);
  return study ? { title: study.title, description: study.summary } : {};
}

const label = "font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase";
const heading = "text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.1] font-medium tracking-[-.04em] text-hd";

export default async function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const i = CASE_STUDIES.indexOf(study);
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];

  return (
    <>
      <SkipLink href="#main" />
      <main id="main">
        <article>
          <header className="pt-[clamp(130px,20vh,200px)] pb-[clamp(32px,6vh,56px)]">
            <Container rail={false}>
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-[14px] font-medium text-fg-soft no-underline hover:text-fg">
                <ArrowIcon className="-rotate-135" /> All case studies
              </Link>
              <Reveal>
                <p className={`mt-8 ${label}`}>{study.sector}</p>
                <h1 className="mt-4 max-w-[16ch] text-[clamp(2.2rem,5.4vw,5rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd">
                  <RevealLine>{study.title}</RevealLine>
                </h1>
                <FadeIn delay={0.3}>
                  <p className="mt-6 max-w-[640px] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.45] text-fg-soft">{study.summary}</p>
                </FadeIn>
                <FadeIn delay={0.45}>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-[14.5px]">
                    <div><dt className={label}>Client</dt><dd className="mt-1 text-fg">{study.client}</dd></div>
                    <div><dt className={label}>Service</dt><dd className="mt-1 text-fg">{study.service}</dd></div>
                  </dl>
                </FadeIn>
              </Reveal>
            </Container>
          </header>

          <Container rail={false}>
            <CaseCover motif={study.motif} stat={study.stats[0].value} className="aspect-16/10 md:aspect-21/9" />

            <dl className="grid grid-cols-1 gap-6 border-b border-hair py-10 sm:grid-cols-3">
              {study.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-[clamp(2rem,3.6vw,3.2rem)] leading-none font-medium tracking-[-.04em] text-strike">{s.value}</dd>
                  <dd className="mt-2 text-[15px] text-fg-soft">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-12 py-[clamp(56px,10vh,110px)] md:grid-cols-12">
              <div className="md:col-span-4">
                <p className={label}>The piece</p>
                <h2 className={`mt-3 ${heading}`}>The challenge</h2>
              </div>
              <p className="text-[clamp(1.05rem,1.3vw,1.2rem)] text-fg md:col-span-8">{study.challenge}</p>

              <div className="md:col-span-4">
                <p className={label}>The fix</p>
                <h2 className={`mt-3 ${heading}`}>What we did</h2>
              </div>
              <ol className="flex flex-col gap-5 md:col-span-8">
                {study.approach.map((step, k) => (
                  <li key={k} className="grid grid-cols-[40px_1fr] gap-3 border-t border-hair pt-5 text-[clamp(1rem,1.2vw,1.1rem)] text-fg">
                    <span className="font-mono text-[12px] font-semibold text-strike">0{k + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="md:col-span-4">
                <p className={label}>The result</p>
                <h2 className={`mt-3 ${heading}`}>What changed</h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-[clamp(1.05rem,1.3vw,1.2rem)] text-fg">{study.outcome}</p>
                {study.quote && (
                  <figure className="mt-10 border-l-2 border-strike pl-6">
                    <blockquote className="text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.25] font-medium tracking-[-.03em] text-fg">
                      “{study.quote.text}”
                    </blockquote>
                    <figcaption className="mt-3 text-[14.5px] text-fg-soft">{study.quote.by}</figcaption>
                  </figure>
                )}
              </div>
            </div>

            <Link
              href={`/case-studies/${next.slug}`}
              className="group flex flex-wrap items-end justify-between gap-4 border-t border-hair py-10 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hd"
            >
              <span>
                <span className={label}>Next case study</span>
                <span className="mt-2 block text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.05] font-medium tracking-[-.045em] text-strike">
                  {next.title}
                </span>
              </span>
              <ArrowIcon className="size-6 transition-transform duration-[350ms] ease-site group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Container>
        </article>
        <Contact />
      </main>
    </>
  );
}
