import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { IndigoBand } from "@/components/IndigoBand";
import { ButtonLink } from "@/components/Button";
import { Highlight } from "@/components/hero/Highlight";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engagements from Multiplr — brand systems, websites and AI-native workflows.",
};

const DISCIPLINES = new Set(
  projects.flatMap((p) => p.discipline.split(",").map((d) => d.trim().toLowerCase())),
);

export default function WorkPage() {
  const years = projects.map((p) => Number(p.year));

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={
          <>
            Selected <Highlight delay={0.45}>engagements</Highlight>.
          </>
        }
        lede="Placeholder case studies. Each one pairs a brand system with the build that carries it — and, increasingly, the workflow that keeps it fed."
        meta={[
          { k: "Projects", v: String(projects.length) },
          { k: "Span", v: `${Math.min(...years)}–${Math.max(...years)}` },
          { k: "Disciplines", v: String(DISCIPLINES.size) },
          { k: "Engagements", v: "Retainer or project" },
        ]}
      />

      <Section eyebrow={`${projects.length} projects`} title="The index.">
        <ul className="grid gap-px border-hairline border-muted/40 bg-muted/40 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} position={i} />
          ))}
        </ul>
      </Section>

      <IndigoBand
        eyebrow="Next"
        footer={
          <ButtonLink href="/contact" variant="inverse">
            Start a project
          </ButtonLink>
        }
      >
        <h2 className="max-w-[20ch] font-display text-display">Your project could sit here.</h2>
      </IndigoBand>
    </>
  );
}
