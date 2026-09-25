# Multiplr

The Multiplr site, rebuilt in Next.js (App Router), TypeScript, Tailwind CSS 4 and Framer Motion.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where things live

```
src/
  app/                 layout (fonts, metadata), page, global styles, icons, robots
  components/
    layout/            Header, SideNav, Footer, Companion cube, ScrollTheme
    sections/          Entrance (door), Hero, Statement, HowIWork, Services, Story, Contact
    ui/                Button, Container, Section, Seal, Perch, Reveal/FadeIn, LitText, cube faces
    illustrations/     SVG line drawings
    SiteProvider.tsx   shared state: "through the door yet?" and reduced-motion
  hooks/useOnScroll.ts rAF-throttled scroll/resize callback
  lib/content.ts       copy: nav, services, steps, email
  lib/motion.ts        easing helpers
```

Most copy changes happen in `src/lib/content.ts` or directly in the section components.
Visitors with "reduce motion" turned on skip the door, and pinned sections become normal stacked content.
