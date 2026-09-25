import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export type LabOption = { key: string; name: string; about: string };

const letter = (i: number) => String.fromCharCode(65 + i);

/**
 * A page for comparing design options side by side: a title, a sticky menu
 * to jump between options, then each option with its label and description.
 */
export function LabPage({
  title,
  setting,
  current,
  options,
  render,
}: {
  title: string;
  /** Name of the constant in site-config.ts that picks the option. */
  setting: string;
  current: string;
  options: LabOption[];
  render: (key: string) => ReactNode;
}) {
  return (
    <main id="main" className="pt-[clamp(120px,18vh,180px)]">
      <Container rail={false}>
        <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">Design options</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] font-medium tracking-[-.05em] text-hd">{title}</h1>
        <p className="mt-4 max-w-[640px] text-[clamp(1rem,1.3vw,1.2rem)] text-fg-soft">
          Scroll through, hover and click each one. To use one on the home page, set{" "}
          <code className="font-mono text-[.9em] text-fg">{setting}</code> in{" "}
          <code className="font-mono text-[.9em] text-fg">src/lib/site-config.ts</code>.
        </p>
      </Container>

      {/* Quick jump between options; stays under the header while you scroll */}
      <div className="sticky top-[88px] z-30 mt-8">
        <Container rail={false}>
          <nav aria-label="Options" className="-mx-[22px] flex gap-2 overflow-x-auto px-[22px] py-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
            {options.map((o, i) => (
              <a
                key={o.key}
                href={`#option-${o.key}`}
                className="shrink-0 rounded-full border border-hair bg-bgc/90 px-4 py-2 text-[13.5px] font-medium text-fg no-underline backdrop-blur transition-colors hover:border-fg focus-visible:outline-2 focus-visible:outline-hd"
              >
                {letter(i)} · {o.name}
                {o.key === current && <span className="ml-2 text-strike">(in use)</span>}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {options.map((o, i) => (
        <div key={o.key} className="mt-16 border-t border-hair">
          <Container rail={false} className="pt-8">
            <p className="font-mono text-[12px] font-semibold tracking-[.2em] text-strike uppercase">
              Option {letter(i)} · {o.name}
            </p>
            <p className="mt-2 max-w-[640px] text-[15px] text-fg-soft">
              {o.about} <code className="font-mono text-[13px] text-fg">&quot;{o.key}&quot;</code>
            </p>
          </Container>
          {render(o.key)}
        </div>
      ))}
    </main>
  );
}
