/** Site copy that's shared between components or likely to be edited. */

export const EMAIL = "gabriel@multiplr.com.au";

export const NAV = [
  { id: "pieces", label: "What I do" },
  { id: "how", label: "How I work" },
  { id: "services", label: "Services" },
  { id: "work", label: "Case studies" },
  { id: "story", label: "Story" },
] as const;

/** The statement, split into the three beats the "pieces" section scrubs through. */
export const STATEMENT = [
  "Most businesses already have the pieces: a website, a handful of processes and software, and a team that knows the work.",
  "I find the piece that's costing you the most or the growth opportunity you're missing, implement the change and move on to the next one,",
  "so the whole system gets better as we go and works as a force multiplier that shows up as real ROI.",
];

/** Labels for the grid of business "pieces". */
export const PIECES = ["Website", "Enquiries", "Bookings", "Quotes", "Follow-ups", "Reporting", "Tools", "Handovers", "Team"];

/** The founder story, in chapters. */
export const STORY = [
  {
    meta: "San Francisco · 7 years",
    text: "I spent the last seven years at Uber in San Francisco, leading strategy globally across payments and financial services, and most recently as GM of the US and Canada financial services business.",
  },
  {
    meta: "Product at scale",
    text: "I worked with tech teams every day to build tasteful products for hundreds of millions of customers.",
  },
  {
    meta: "Melbourne · Now",
    text: "Now I'm back in Melbourne, putting AI to work to help business owners take the leap and realise tangible, data-driven benefits.",
  },
  {
    meta: "Multiplr",
    text: "Multiplr is where I do this, one useful change at a time.",
  },
];

export const PITCHES = [
  "build websites that convert better.",
  "improve their workflows.",
  "implement practical AI.",
];

export const STEPS = [
  {
    title: "Find the piece",
    body: "We start with the part of the business that's costing you the most time, or the growth you're not reaching yet.",
  },
  {
    title: "Fix it properly",
    body: "I build the change with you, tested against how the work actually runs.",
  },
  {
    title: "Move to the next",
    body: "Once it's working we pick the next piece, and the time each one frees up goes back into growing the business.",
  },
];

export const SERVICES = [
  {
    title: ["AI setup and", "enablement"],
    body: "There are too many new tools, and it's hard to keep up with what's useful for your business. I help you choose the ones that fit your work and set them up properly, and you learn to use them across your team.",
    chips: ["Choosing and setting up tools", "Working sessions on real work", "Training for you or your team"],
  },
  {
    title: ["Websites and", "digital tools"],
    body: "A website that explains what you do, gets found in search and in AI answers, and makes it easy for the right people to get in touch.",
    chips: ["Design, copy and build", "Search and AI visibility", "Forms, tracking and monthly insights"],
  },
  {
    title: ["Workflows and", "automation"],
    body: "The chasing, copying and checking your team does every week, built into workflows that run on their own and tested so they keep running.",
    chips: ["How work moves today", "Automations for specific jobs", "Support once they're live"],
  },
];

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  service: string;
  title: string;
  summary: string;
  /** Which illustration the cover uses. */
  motif: "web" | "flow" | "ai";
  stats: { value: string; label: string }[];
  challenge: string;
  approach: string[];
  outcome: string;
  quote?: { text: string; by: string };
};

/** Sample case studies: placeholder copy to be replaced with real client work. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "physio-clinic-bookings",
    client: "A Northside physiotherapy clinic",
    sector: "Healthcare",
    service: "Websites and digital tools",
    title: "Turning a brochure site into a booking engine",
    summary:
      "A tired five-page site became the clinic's busiest front desk, taking bookings around the clock and showing up in local search.",
    motif: "web",
    stats: [
      { value: "+62%", label: "online bookings in 90 days" },
      { value: "−40%", label: "phone calls to the front desk" },
      { value: "Top 3", label: "local search for “physio near me”" },
    ],
    challenge:
      "Most new patients called during clinic hours, when the front desk was busiest. The website explained very little, wasn't built for phones, and had no way to book.",
    approach: [
      "Rewrote every page around the questions patients actually ask, from pricing to what a first visit involves.",
      "Connected online booking to the clinic's existing practice software, so there was nothing new for staff to learn.",
      "Set up local search, reviews and simple monthly reporting on where bookings come from.",
    ],
    outcome:
      "Bookings now arrive overnight and on weekends, and the front desk spends its time with the patients in front of it.",
    quote: { text: "Monday mornings used to be a wall of voicemails. Now the diary just fills itself.", by: "Practice manager" },
  },
  {
    slug: "building-supplier-quotes",
    client: "A family-run building supplier",
    sector: "Trade and construction",
    service: "Workflows and automation",
    title: "Quotes out the same day, not next week",
    summary:
      "Quoting moved out of inboxes and spreadsheets into one flow that drafts, checks and chases, so builders hear back the same day.",
    motif: "flow",
    stats: [
      { value: "11 hrs", label: "saved every week" },
      { value: "Same day", label: "quote turnaround, down from 4 days" },
      { value: "+23%", label: "quotes won" },
    ],
    challenge:
      "Quote requests arrived by email, phone and text. Each one was re-keyed into a spreadsheet, priced by hand and often forgotten until the builder called to chase.",
    approach: [
      "Mapped how a quote actually moved through the business, including every hand-off and double entry.",
      "Built one intake form and an automation that drafts the quote from the current price list.",
      "Added automatic follow-ups and a simple board showing every open quote at a glance.",
    ],
    outcome:
      "The team quotes faster than their competitors, and nothing slips through the cracks when things get busy.",
    quote: { text: "We win work now just by being first to reply.", by: "Operations lead" },
  },
  {
    slug: "accounting-firm-ai",
    client: "A boutique accounting firm",
    sector: "Professional services",
    service: "AI setup and enablement",
    title: "An AI toolkit the whole team actually uses",
    summary:
      "Instead of a pile of logins nobody opened, the firm got a few well-chosen tools, set up around its real work, and a team confident using them.",
    motif: "ai",
    stats: [
      { value: "9 in 10", label: "staff using AI every week" },
      { value: "6 hrs", label: "saved per person each month" },
      { value: "3 weeks", label: "from first session to rollout" },
    ],
    challenge:
      "The partners knew AI could help but didn't know where to start. A couple of trials had fizzled out, and staff were worried about client data.",
    approach: [
      "Ran working sessions on real tasks such as client emails, meeting notes and first-pass reviews.",
      "Chose and configured tools with sensible data settings, and wrote a one-page guide on what's safe to share.",
      "Trained the team in small groups, with follow-ups to lock in the habits.",
    ],
    outcome:
      "AI is now part of the everyday workflow, and the time saved goes back into advisory work that clients value.",
    quote: { text: "It finally feels like the tools work for us, not the other way round.", by: "Managing partner" },
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
