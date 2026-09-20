import { cn } from "@/lib/cn";
import { FadeUp } from "./FadeUp";
import { GridBackdrop } from "./backdrops/GridBackdrop";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  children?: React.ReactNode;
  className?: string;
  /** Draws the hairline rule that separates one sheet from the next. */
  divider?: boolean;
  /** The parallaxing hairline grid behind the sheet. */
  backdrop?: boolean;
};

/** One sheet of the broadsheet: bone ground, hairline rule, generous air. */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
  divider = true,
  backdrop = true,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden py-s-8 md:py-s-9",
        divider && "border-t-hairline border-muted/40",
        className,
      )}
    >
      {backdrop ? <GridBackdrop /> : null}

      <div className="stage relative">
        {(eyebrow || title || lede) && (
          <FadeUp className="max-w-measure">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="mt-s-4 text-heading-lg text-strike">{title}</h2>
            ) : null}
            {lede ? <p className="mt-s-5 text-body text-muted">{lede}</p> : null}
          </FadeUp>
        )}
        {children ? <div className={cn(eyebrow || title || lede ? "mt-s-7" : "")}>{children}</div> : null}
      </div>
    </section>
  );
}
