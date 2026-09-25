# Multiplr v2

The Multiplr site: Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and Framer Motion.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## The story, top to bottom

1. **Hero** pins to the screen. The seal cube (`SealCube`, the same one as multiplr.com.au) sits large on the right: drag it to spin, tap to flip, roll it with the arrow keys. Meanwhile "I help business owners" is followed by the pitches typing out (`TypingText`). As you scroll the cube settles front-facing and shrinks into a small companion that hops to the spot just above each section label (`<Label perch>`), and near Contact it flies up and melts into the header logo.
2. **Pieces** (What I do) is a pinned scene: the statement plays in three beats while nine pieces of a business get improved one by one and the output bar compounds.
3. **How I work**: the step titles stay pinned on the left and light up as each panel's diagram plays on the right.
4. **Services** is the deep navy sheet: a glowing sphere whose orbits turn with the scroll, and tabs that auto-advance (paused on hover or focus).
5. **Case studies**: a swipeable carousel with arrow buttons.
6. **Story**: a pinned portrait warms from grey to colour as the chapters scroll past, ending on the adoption curve.
7. **Contact** (on every page) has the animated seal (`SealMark`) as its background: the frame draws in, letters decode and light up one at a time, and it settles into place as you arrive. The footer wordmark rises in letter by letter.

Each section after the hero is a `<Sheet>` with rounded top corners that overlaps the one before it.

## Where things live

```
src/
  app/                 layout (fonts, metadata), home page, case studies, global styles, icons, robots
  components/
    layout/            Header (pill nav, scroll progress, phone menu), SealCube, Footer, SectionLinks
    sections/          Hero, Pieces, HowIWork, Services, CaseStudies, Story, AdoptionCurve, Contact
    ui/                Button, Container, Sheet, Label, RiseText, Seal, SealCubeFaces, Perch, Marquee, Reveal/FadeIn,
                       CaseCard, CopyButton, TypingText, SkipLink
    illustrations/     SealMark, Orbit, step diagrams, animated service sketches, case covers
    SiteProvider.tsx   reduced-motion flag
  hooks/useOnScroll.ts rAF-throttled scroll/resize callback
  lib/content.ts       copy: nav, ticker, statement, pieces, steps, services, case studies, story, email
  lib/motion.ts        easing helpers
```

## Design tokens

- Colours: bone `#e8e6e0` (background), ink `#0a0a0a`, strike `#1925aa` (headings), deep `#0d1355` (navy), field `#dcd9d1`
- Type: Inter (300 for headlines, 400/500/600) for text, JetBrains Mono for labels and the seal
- Easing: `cubic-bezier(0.2, 0.7, 0.1, 1)`

Most copy changes happen in `src/lib/content.ts`. Visitors with "reduce motion" turned on get the
same content without pinning, auto-advancing or looping animation.
