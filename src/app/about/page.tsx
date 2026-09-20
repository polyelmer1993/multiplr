import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FadeUp } from "@/components/FadeUp";
import { Section } from "@/components/Section";
import { IndigoBand } from "@/components/IndigoBand";
import { ButtonLink } from "@/components/Button";
import { Highlight, Underscore } from "@/components/hero/Highlight";
import { NumberedCard } from "@/components/cards/NumberedCard";
import { MemberCard } from "@/components/about/MemberCard";
import { team } from "@/content/team";

export const metadata: Metadata = {
  title: "About",
  description: "The philosophy, the approach and the people behind Multiplr.",
};

const APPROACH = [
  {
    index: "01",
    title: "Find the argument",
    body: "Before a grid or a palette, the work needs a claim it can defend. We start by writing it down in one sentence and testing whether the rest of the site can carry it.",
  },
  {
    index: "02",
    title: "Build the system",
    body: "Colour, type, spacing and components, decided once and documented. A system is what keeps the tenth page as considered as the first.",
  },
  {
    index: "03",
    title: "Ship the surface",
    body: "Production front end, accessible by default, fast on a mid-range phone. Motion is used sparingly and only where it clarifies.",
  },
  {
    index: "04",
    title: "Hand over the machine",
    body: "You get the repository, the system and the workflow — not a dependency on us. Retainers exist because teams want them, not because the build requires one.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            <Highlight delay={0.45}>Structure</Highlight> is the point.
          </>
        }
        lede="Multiplr is a boutique, AI-native studio. Small team, senior hands, one principal across every engagement."
        meta={[
          { k: "Model", v: "Principal-led" },
          { k: "Team", v: `${team.length} people` },
          { k: "Steps", v: `${APPROACH.length} per engagement` },
          { k: "Handover", v: "Repo, system, workflow" },
        ]}
      />

      <Section eyebrow="01 Philosophy" title="Confident restraint.">
        <FadeUp className="max-w-measure">
          <p className="text-body text-ink">
            Most sites are loud because nobody decided what mattered.{" "}
            <Underscore delay={0.25}>We decide.</Underscore> The result is a page with a lot of
            air, a firm grid, and a single accent that only appears where it earns the attention.
          </p>
          <p className="mt-s-5 text-body text-muted">
            AI-native is a description of how we work, not a product we sell. It means the research,
            the drafting and the production grunt move at a different speed — which buys back the
            hours that go into judgement, structure and craft. The leverage is real; the output
            still has to survive a human read.
          </p>
        </FadeUp>
      </Section>

      <Section id="approach" eyebrow="02 Approach" title="How an engagement runs.">
        <ol className="grid gap-px border-hairline border-muted/40 bg-muted/40 md:grid-cols-2">
          {APPROACH.map((step, i) => (
            <NumberedCard
              key={step.index}
              index={step.index}
              title={step.title}
              body={step.body}
              footer={`Step ${step.index}`}
              position={i}
            />
          ))}
        </ol>
      </Section>

      <Section id="team" eyebrow="03 Team" title="Who you actually work with." lede="Placeholder profiles — swap in real names, roles and headshots.">
        <ul className="grid gap-s-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <MemberCard key={`${member.role}-${i}`} member={member} position={i} />
          ))}
        </ul>
      </Section>

      <IndigoBand
        eyebrow="04 Contact"
        footer={
          <ButtonLink href="/contact" variant="inverse">
            Start a project
          </ButtonLink>
        }
      >
        <h2 className="max-w-[20ch] font-display text-display">
          Fewer clients. More attention.
        </h2>
      </IndigoBand>
    </>
  );
}
