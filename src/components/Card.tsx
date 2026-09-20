import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  href?: string;
  meta?: string;
  className?: string;
};

/** A paper plate on the bone stage. Bordered, never shadowed. */
export function Card({ eyebrow, title, body, href, meta, className }: Props) {
  const content = (
    <>
      {eyebrow ? <p className="eyebrow mb-s-4">{eyebrow}</p> : null}
      <h3 className="text-heading-sm text-ink">{title}</h3>
      {body ? <p className="mt-s-3 max-w-measure text-body text-muted">{body}</p> : null}
      {meta ? <p className="mt-s-5 font-mono text-mono-micro uppercase text-muted">{meta}</p> : null}
    </>
  );

  const shell = cn(
    "block h-full bg-paper border-hairline border-muted p-[24px] transition-colors duration-200 ease-calm",
    className,
  );

  if (!href) {
    return <div className={shell}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(shell, "hover:border-active hover:border-strike hover:p-[23px]")}
    >
      {content}
    </Link>
  );
}
