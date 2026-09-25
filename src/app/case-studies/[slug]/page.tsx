import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCover } from "@/components/illustrations/CaseCover";
import { Contact } from "@/components/sections/Contact";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { FadeIn, Reveal } from "@/components/ui/Reveal";
import { RiseText } from "@/components/ui/RiseText";
import { SkipLink } from "@/components/ui/SkipLink";
import { CASE_STUDIES, getCaseStudy } from "@/lib/content";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await props.params).slug);
  return study ? { title: study.title, description: study.summary } : {};
}

const mono = "font-mono text-[11px] font-medium tracking-[.14em] text-ink/50 uppercase";
const heading = "text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.08] font-light tracking-[-.04em] text-deep";

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
        <article className="bg-bone pb-[clamp(90px,14vh,150px)]">
          <header className="dot-grid pt-[clamp(130px,20vh,200px)] pb-[clamp(32px,6vh,56px)]">
            <Container>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[.12em] text-ink/60 uppercase no-underline hover:text-ink"
              >
                <ArrowIcon className="-rotate-135" /> All case studies
              </Link>
              <Label className="mt-10 text-strike">{study.sector}</Label>
              <RiseText
                as="h1"
                onMount
                lines={[study.title]}
                className="mt-5 max-w-[18ch] text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[.98] font-light tracking-[-.045em] text-deep"
              />
              <Reveal>
                <FadeIn delay={0.4}>
                  <p className="mt-6 max-w-[640px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.45] text-ink/70">{study.summary}</p>
                </FadeIn>
                <FadeIn delay={0.55}>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-[14.5px]">
                    <div>
                      <dt className={mono}>Client</dt>
                      <dd className="mt-1 text-ink">{study.client}</dd>
                    </div>
                    <div>
                      <dt className={mono}>Service</dt>
                      <dd className="mt-1 text-ink">{study.service}</dd>
                    </div>
                  </dl>
                </FadeIn>
              </Reveal>
            </Container>
          </header>

          <Container>
            <div className="overflow-hidden rounded-[22px]">
              <CaseCover motif={study.motif} stat={study.stats[0].value} className="aspect-16/10 md:aspect-21/9" />
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {study.stats.map((s) => (
                <div key={s.label} className="rounded-[18px] bg-paper p-6">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-[clamp(2rem,3.6vw,3.2rem)] leading-none font-light tracking-[-.045em] text-strike">{s.value}</dd>
                  <dd className="mt-3 text-[15px] text-ink/60">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-1 gap-12 py-[clamp(56px,10vh,110px)] md:grid-cols-12">
              <div className="md:col-span-4">
                <p className={mono}>The piece</p>
                <h2 className={`mt-3 ${heading}`}>The challenge</h2>
              </div>
              <p className="text-[clamp(1.05rem,1.3vw,1.2rem)] text-ink md:col-span-8">{study.challenge}</p>

              <div className="md:col-span-4">
                <p className={mono}>The fix</p>
                <h2 className={`mt-3 ${heading}`}>What we did</h2>
              </div>
              <ol className="flex flex-col md:col-span-8">
                {study.approach.map((step, k) => (
                  <li key={k} className="grid grid-cols-[48px_1fr] gap-3 border-t border-ink/10 py-5 text-[clamp(1rem,1.2vw,1.1rem)] text-ink">
                    <span className="font-mono text-[11px] font-medium tracking-[.1em] text-strike">0{k + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="md:col-span-4">
                <p className={mono}>The result</p>
                <h2 className={`mt-3 ${heading}`}>What changed</h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-[clamp(1.05rem,1.3vw,1.2rem)] text-ink">{study.outcome}</p>
                {study.quote && (
                  <figure className="mt-10 rounded-[18px] bg-deep p-[clamp(22px,3vw,40px)] text-bone">
                    <blockquote className="text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.2] font-light tracking-[-.03em]">
                      “{study.quote.text}”
                    </blockquote>
                    <figcaption className="mt-4 font-mono text-[11px] tracking-[.14em] text-bone/60 uppercase">{study.quote.by}</figcaption>
                  </figure>
                )}
              </div>
            </div>

            <Link
              href={`/case-studies/${next.slug}`}
              className="group flex flex-wrap items-end justify-between gap-4 rounded-[18px] bg-paper p-[clamp(22px,3vw,40px)] no-underline transition-shadow duration-500 hover:shadow-[0_40px_70px_-44px_rgba(13,19,85,.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-strike"
            >
              <span>
                <span className={mono}>Next case study</span>
                <span className="mt-2 block text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.05] font-light tracking-[-.045em] text-deep">{next.title}</span>
              </span>
              <ArrowIcon className="size-6 text-strike transition-transform duration-[350ms] ease-site group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Container>
        </article>
        <Contact />
      </main>
    </>
  );
}
