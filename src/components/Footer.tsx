import Link from "next/link";
import { Seal } from "./Seal";

const COLUMNS = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Practice",
    links: [
      { label: "What we do", href: "/#what-we-do" },
      { label: "Approach", href: "/about#approach" },
      { label: "Team", href: "/about#team" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-hairline border-muted/40 py-s-8">
      <div className="stage grid gap-s-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Seal />
          <p className="mt-s-5 max-w-measure-tight text-body text-muted">
            Multiplr is an AI-native studio. We build force-multiplier websites, organised as a
            broadsheet.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading} className="md:col-span-3">
            <h2 className="eyebrow">{col.heading}</h2>
            <ul className="mt-s-5 flex flex-col gap-s-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block border-b-hairline border-transparent pb-[3px] font-sans text-ui text-muted transition-colors duration-200 ease-calm hover:border-b-active hover:border-strike hover:pb-[2px] hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-1" />
      </div>

      <div className="stage mt-s-8 flex flex-col gap-s-3 border-t-hairline border-muted/30 pt-s-5 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-mono-micro uppercase text-muted">
          &#169; {new Date().getFullYear()} Multiplr
        </p>
        <p className="font-mono text-mono-micro uppercase text-muted">Bone paper. Indigo structure.</p>
      </div>
    </footer>
  );
}
