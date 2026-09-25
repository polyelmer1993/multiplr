import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export const metadata: Metadata = { title: "Design options" };

const LABS = [
  { href: "/lab/how", title: "How I work", about: "4 layouts: scrollytelling, sideways scroll, scroll stepper, winding path." },
  { href: "/lab/services", title: "Our services", about: "5 layouts: carousel, expanding panels, stacking cards, editorial list, bento grid." },
];

/** Index of the design-option preview pages. */
export default function Lab() {
  return (
    <main id="main" className="pt-[clamp(120px,18vh,180px)] pb-24">
      <Container rail={false}>
        <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">Design options</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd">
          Pick a layout
        </h1>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {LABS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col border border-hair bg-paper p-7 no-underline transition-shadow hover:shadow-[0_30px_60px_-40px_rgba(13,19,85,.6)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-hd"
              >
                <span className="flex items-center justify-between text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium tracking-[-.04em] text-strike">
                  {l.title}
                  <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <span className="mt-2 text-[15px] text-fg-soft">{l.about}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
