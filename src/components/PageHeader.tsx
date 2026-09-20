import { FadeUp } from "./FadeUp";
import { Parallax } from "./motion/Parallax";
import { HeroBackdrop } from "./hero/HeroBackdrop";

/**
 * The masthead on an inner page — the home hero at half volume. It carries the
 * same geometry and pointer lean, in the compact variant: smaller rules, no
 * scan line, nothing that competes with the sheet below it.
 *
 * `title` takes a node so a page can wrap one word in `<Highlight>`.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  /** Optional mono key/value row under the lede. */
  meta?: { k: string; v: string }[];
}) {
  return (
    <header className="relative isolate overflow-hidden pb-s-7 pt-s-8 md:pt-s-9">
      <HeroBackdrop compact />

      <div className="stage relative">
        <Parallax distance={28} innerClassName="max-w-measure">
          <FadeUp>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-s-4 font-display text-display text-strike">{title}</h1>
            {lede ? <p className="mt-s-6 text-body text-muted">{lede}</p> : null}
          </FadeUp>
        </Parallax>

        {meta ? (
          <FadeUp delay={0.12}>
            <dl className="mt-s-8 grid grid-cols-2 gap-s-6 border-t-hairline border-muted/40 pt-s-6 md:grid-cols-4">
              {meta.map((item) => (
                <div key={item.k} className="group">
                  <dt className="eyebrow">{item.k}</dt>
                  <dd className="mt-s-2 text-body-sm text-ink">{item.v}</dd>
                  <span
                    aria-hidden="true"
                    className="mt-s-3 block h-px w-full origin-left scale-x-0 bg-strike transition-transform duration-500 ease-calm group-hover:scale-x-100"
                  />
                </div>
              ))}
            </dl>
          </FadeUp>
        ) : null}
      </div>
    </header>
  );
}
