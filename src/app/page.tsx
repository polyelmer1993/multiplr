import { FadeUp } from "@/components/FadeUp";
import { Section } from "@/components/Section";
import { IndigoBand } from "@/components/IndigoBand";
import { ButtonLink } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { Highlight, Underscore } from "@/components/hero/Highlight";
import { StudioLoop } from "@/components/studio/StudioLoop";
import { NumberedCard } from "@/components/cards/NumberedCard";
import { FeaturedWork } from "@/components/work/FeaturedWork";
import { WorkCard } from "@/components/work/WorkCard";
import { Parallax } from "@/components/motion/Parallax";
import { services } from "@/content/services";
import { projects, featuredProject } from "@/content/work";

const FACTS = [
  { k: "Founded", v: "2024" },
  { k: "Based", v: "Australia" },
  { k: "Engagements", v: "Retainer or project" },
  { k: "Practice", v: "Brand, web, AI workflow" },
];

export default function HomePage() {
  const teasers = projects.filter((p) => p.slug !== featuredProject.slug).slice(0, 3);

  return (
    <>
      {/* Hero — bone stage, headline in Indigo Strike, geometry behind it. */}
      <section className="relative isolate overflow-hidden">
        <HeroBackdrop />

        <div className="stage pointer-events-none relative pb-s-8 pt-s-9 md:pb-s-9">
          <div className="pointer-events-auto">
            <FadeUp>
              <Chip variant="working">AI-native studio</Chip>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="mt-s-6 max-w-[18ch] font-display text-display text-strike">
                Websites that make people say{" "}
                <Highlight delay={0.65}>wow</Highlight>.
              </h1>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="mt-s-7 max-w-measure text-body text-ink">
                Multiplr is a boutique studio for companies that need their thinking to look like
                thinking. We build <Underscore delay={0.9}>force-multiplier websites</Underscore>{" "}
                and the systems behind them — structured, fast, and built to hold up long after
                launch.
              </p>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="mt-s-8 flex flex-col gap-s-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" variant="primary" markAccent>
                  Start a project
                </ButtonLink>
                <ButtonLink href="/work" variant="secondary">
                  See the work
                </ButtonLink>
              </div>
            </FadeUp>

            <FadeUp delay={0.24}>
              <dl className="mt-s-9 grid grid-cols-2 gap-s-6 border-t-hairline border-muted/40 pt-s-6 md:grid-cols-4">
                {FACTS.map((item) => (
                  <div key={item.k} className="group">
                    <dt className="eyebrow">{item.k}</dt>
                    <dd className="mt-s-2 text-body-sm text-ink">{item.v}</dd>
                    <span
                      aria-hidden="true"
                      className="mt-s-3 block h-px w-full origin-left scale-x-0 bg-strike transition-transform duration-500 ease-calm group-hover:scale-x-100"
                    />
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 01 Studio — copy left, the looping multiplier right. */}
      <Section divider>
        <div className="grid items-center gap-s-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-s-9">
          <div>
            <FadeUp className="max-w-measure">
              <p className="eyebrow">01 Studio</p>
              <h2 className="mt-s-4 text-heading-lg text-strike">
                Small on purpose. Sharp where it counts.
              </h2>
              <p className="mt-s-5 text-body text-muted">
                We are a boutique: a principal on every engagement, no account layer between you
                and the people doing the work. AI-native means the leverage is built into how we
                work, not bolted on as a service line — research, drafting and production move
                faster, so the judgement calls get the time they deserve.
              </p>
              <p className="mt-s-5 text-body text-muted">
                The output is deliberately plain: generous space, a strong grid, one accent used
                where it earns attention. Restraint reads as confidence, and it ages better than a
                trend.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <ul className="mt-s-7 grid gap-px border-hairline border-muted/40 bg-muted/40 sm:grid-cols-3">
                {[
                  { k: "Principal-led", v: "Every engagement" },
                  { k: "Team size", v: "Deliberately small" },
                  { k: "Turnaround", v: "Weeks, not quarters" },
                ].map((item) => (
                  <li key={item.k} className="group bg-bone p-s-5 transition-colors duration-300 ease-calm hover:bg-paper">
                    <p className="font-mono text-mono-micro uppercase text-strike">{item.k}</p>
                    <p className="mt-s-2 text-body-sm text-ink">{item.v}</p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <Parallax distance={56} innerClassName="lg:pl-s-5">
              <StudioLoop />
            </Parallax>
          </FadeUp>
        </div>
      </Section>

      {/* 02 What we do */}
      <Section
        id="what-we-do"
        eyebrow="02 What we do"
        title="Four ways we work."
        lede="Most engagements start with one and grow into two."
      >
        <ul className="grid gap-px border-hairline border-muted/40 bg-muted/40 md:grid-cols-2">
          {services.map((service, i) => (
            <NumberedCard
              key={service.index}
              index={service.index}
              title={service.title}
              body={service.body}
              footer="In scope"
              position={i}
            />
          ))}
        </ul>
      </Section>

      {/* 03 Selected work */}
      <Section eyebrow="03 Selected work" title="A recent engagement.">
        <FeaturedWork project={featuredProject} />

        <ul className="mt-s-6 grid gap-s-5 md:grid-cols-3">
          {teasers.map((project, i) => (
            <WorkCard key={project.slug} project={project} position={i} />
          ))}
        </ul>
      </Section>

      {/* 04 Contact — the one full-bleed Indigo Strike band on this page. */}
      <IndigoBand
        eyebrow="04 Contact"
        footer={
          <ButtonLink href="/contact" variant="inverse">
            Start a project
          </ButtonLink>
        }
      >
        <h2 className="max-w-[20ch] font-display text-display">
          Bone paper. Indigo structure.
        </h2>
        <p className="mt-s-6 max-w-measure text-body text-bone/85">
          Tell us what you are building and who has to believe in it. We will tell you whether we
          are the right studio for it — and if we are not, who is.
        </p>
      </IndigoBand>
    </>
  );
}
