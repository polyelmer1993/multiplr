export type Project = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  discipline: string;
  year: string;
  featured?: boolean;
};

/** Placeholder case studies — replace with real engagements. */
export const projects: Project[] = [
  {
    slug: "meridian-capital",
    client: "Meridian Capital",
    title: "A research desk, rebuilt as a reading surface",
    summary:
      "Twelve years of analyst notes reorganised into one structured archive, with an AI drafting layer that keeps the house voice intact.",
    discipline: "Brand system, website, AI workflow",
    year: "2026",
    featured: true,
  },
  {
    slug: "halden-industrial",
    client: "Halden Industrial",
    title: "One catalogue, four markets, no rewrite",
    summary:
      "A product catalogue that localises itself. Specification data stays single-source; the copy around it adapts per market.",
    discipline: "Website, content system",
    year: "2026",
  },
  {
    slug: "northline-health",
    client: "Northline Health",
    title: "Clinical clarity without the clinical coldness",
    summary:
      "A patient-facing rebuild that reads at a sixth-grade level and still passes a compliance review on the first pass.",
    discipline: "Positioning, website",
    year: "2025",
  },
  {
    slug: "orrick-studio",
    client: "Orrick Studio",
    title: "A portfolio that files itself",
    summary:
      "Project intake, image processing and case-study drafting reduced to one form and a review step.",
    discipline: "AI workflow, website",
    year: "2025",
  },
  {
    slug: "fen-and-forth",
    client: "Fen & Forth",
    title: "Retail structure for a wholesale brain",
    summary:
      "A wholesale range translated into a direct-to-consumer storefront without diluting the trade proposition.",
    discipline: "Brand system, website",
    year: "2025",
  },
  {
    slug: "civic-atlas",
    client: "Civic Atlas",
    title: "Public data, legible at a glance",
    summary:
      "Municipal datasets rendered as a single navigable atlas — structured typography doing the work charts usually claim.",
    discipline: "Website, data design",
    year: "2024",
  },
];

export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
