# Multiplr Boutique

Marketing site for Multiplr — an AI-native studio. Next.js 14 (App Router),
TypeScript, Tailwind CSS.

## Run it

```bash
npm install     # already done
npm run dev     # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Brand

Everything visual comes from *Multiplr Brand Guidelines — Indigo + Bone* and is
expressed as Tailwind theme values in `tailwind.config.ts`. The palette is
**replaced**, not extended, so an off-brand colour fails at build time rather
than slipping through review.

| Token | Value | Use |
| --- | --- | --- |
| `bone` | `#e8e6e0` | Root canvas. Never pure white at the root. |
| `paper` | `#ffffff` | Cards, inputs. Elevated above bone. |
| `ink` | `#0a0a0a` | Body copy. |
| `muted` | `#5c5c56` | Secondary copy, resting hairlines. |
| `strike` | `#1925aa` | Headlines, the one full-bleed band, links, every focus ring. |
| `deep` | `#0d1355` | Seal letters and border, primary button fill. |

Rules held in the code:

- **0px corners everywhere.** `borderRadius` only defines `none`/`0px`.
- **Elevation is a border, never a shadow.** `boxShadow` only defines `none`.
- **The hairline shift.** Interactive borders step 1px -> 2px on hover/focus;
  padding steps down 1px in the same rule so nothing reflows. Filled controls
  have no border to thicken, so the fill steps `deep` -> `strike` instead.
- **One indigo band per page, maximum** (`<IndigoBand />`). Body copy stays on
  bone. There is no dark theme — the brand rules one out by name.
- **The seal is the logo** (`<Seal />`): a square rule box, three mono rows
  `MUL` / `TIP` / `LR×`. Do not invent a second mark or a horizontal wordmark.
- **No copper, orange or forest green.** Retired by the brand file.

## Type

Inter (400/500) and JetBrains Mono (500) are self-hosted via `@fontsource/*`,
so the site makes no third-party font request. `--font-display` leads with
**PP Neue Montreal** and falls back to Inter; add the licensed woff2 files and
an `@font-face` block to `globals.css` to switch it on for real.

## Structure

```
src/
  app/            route segments: /, /work, /about, /contact, not-found
  components/     Header, Footer, Seal, Section, IndigoBand, PageHeader,
                  Button, Card, Chip, Field, FadeUp, ContactForm, Preloader
    motion/       Parallax, PointerWash (+ TopRule, GhostIndex)
    backdrops/    GridBackdrop
    hero/         HeroBackdrop, Highlight + Underscore
    studio/       StudioLoop
    cards/        NumberedCard
    work/         FeaturedWork, WorkCard, ProjectCard, MediaPlate,
                  PlatePattern
    about/        MemberCard
    contact/      ContactBackdrop
  content/        placeholder data: site, services, work, team
  lib/cn.ts       class-name join helper
```

## Motion

Four layers, in order of how much attention each is allowed to take.

**Entrance.** `<FadeUp />` is unchanged: a 16px fade-up, once, on scroll into
view. Cards that manage their own hover state (`ServiceCard`, `WorkCard`,
`FeaturedWork`) inline the same values rather than nesting a wrapper.

**Parallax.** `<Parallax distance={n} />` translates a layer on Y as it crosses
the viewport — translate only, never scale or rotate the content. The scroll
ref sits on a static outer element and the transform on an inner one, so the
measured position never feeds back into the transform. The inner layer is
`h-full w-full` so an absolutely positioned backdrop can size against it.

**Backdrops.** `<GridBackdrop />` is the house ground: a hairline grid plus two
square rules, each on its own parallax rate. `<Section />` renders one by
default (`backdrop={false}` opts out) and `<IndigoBand />` renders the bone
variant through `<ContactBackdrop />`. All are `aria-hidden` and decorative.

**Loops.** Three graphics loop: `StudioLoop` (a diagonal wave crossing a 6x6
field inside counter-rotating square rules), `PlatePattern` (the image slot,
until there is an image) and the contact band's concentric rules. This is the
one place the old "nothing loops" rule is relaxed — these are illustrations of
continuous work, not UI state — so they stay slow, stay one accent, and stay
decorative. Rotation cycles run 44-90s; nothing bounces and nothing overshoots.

**Hover.** Interactive surfaces wipe rather than fade, and every page uses the
same four moves so a card on About reads like a card on Work:

| Move | Where it lives | What it does |
| --- | --- | --- |
| Fill wipe | `Button` | Sweeps a fill in from the left over 260ms while a duplicate label is revealed by a clip-path in exact step, so the label never sits on a half-painted ground. |
| `<TopRule />` | every card | A 2px Strike rule draws along the top edge. |
| `<GhostIndex />` | numbered and ordered cards | The number, oversized, rising into the corner at 7-8% Strike. |
| `usePointerWash` + `<PointerWash />` | every card | A Strike wash at 6-7% following the cursor. It writes two custom properties on the host, so moving the mouse never re-renders. |

The documented hairline shift is untouched underneath: padding still steps down
1px so the border thickens without moving anything around it. Plates built from
`<MediaPlate />` add a Strike wipe from the base and invert their caption.

Cards that are links (`WorkCard`, `FeaturedWork`) mirror every hover state on
`:focus-visible`, so keyboard users get the same read. Cards that are not links
(`NumberedCard`, `ProjectCard`, `MemberCard`) decorate on hover only and never
grow an arrow or a "read more" — there is no destination to promise until the
case-study routes exist.

Every component calls `useReducedMotion` and renders a still composition when
it is set; `globals.css` freezes every transition and animation on top of that.
`Button`, the contact detail rows and `Field` are CSS-only and ship no JS.

## Preloader

`<Preloader />` draws the seal — the square rule, then the three mono rows,
then the multiply mark — over a bone panel while the document loads, then wipes
the panel up off the sheet.

Being straight about what it is: **this does not make the site load faster.**
It covers the load with something to look at. It costs a few hundred bytes of
CSS and no images. Four rules keep it from costing anything else:

- **The entrance is CSS, not JS.** Keyframes in `globals.css` start on the
  first paint of the server HTML. A Framer entrance would not start until
  hydration — roughly when the page is ready anyway — so it would play to an
  empty room. The React component only handles the exit.
- **It never gates the content.** The page is server-rendered underneath, so
  crawlers and readers get it regardless. The panel leaves on `load` or at
  `MAX_MS`, whichever comes first, and `<noscript>` hides it outright.
- **It plays once per session.** An inline script in `layout.tsx` sets
  `data-preloaded` on `<html>` before first paint when the session has already
  seen it, or when the visitor asked for reduced motion. CSS then hides the
  panel — no flash, no hydration mismatch.
- **The meter is indeterminate on purpose.** The panel does not know real
  progress, so it does not draw a bar pretending to.

`MIN_MS` (1150ms) is tied to the keyframes: the seal finishes assembling at
about 920ms, so a shorter hold would wipe the panel away mid-draw on a warm
cache. Change one and check the other.

## Placeholders to replace

- Case studies in `src/content/work.ts`, team in `src/content/team.ts`.
- Every image slot is a `<MediaPlate />`, holding `<PlatePattern />` until a
  real asset lands. Swap that one component for `next/image` and write real alt
  text — the plates on Work, About and the home page all change at once, and
  nothing around them moves.
- `ContactForm` has no endpoint. Wire `handleSubmit` to a route handler or form
  service.
- Success and error states read as a mono label in ink/muted, not a colour: the
  locked palette has no red/green/amber and the brand file rules out adding one.
  Needs a stakeholder call before a status colour exists.

## Accessibility

Skip link, one `h1` per page, landmark elements, `aria-current` on the active
nav link, `aria-expanded`/`aria-controls` on the mobile menu toggle, `aria-live`
on the form status, and a 2px `strike` focus ring with a 2px offset on every
focusable control. All shipped colour pairs clear WCAG AA.
