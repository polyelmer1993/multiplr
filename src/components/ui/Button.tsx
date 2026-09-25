import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowIcon } from "./ArrowIcon";

type ButtonProps = Omit<ComponentProps<"a">, "ref"> & {
  href: string;
  variant?: "primary" | "quiet" | "light" | "outline";
  size?: "md" | "sm";
  /** Show the diagonal arrow after the label. */
  arrow?: boolean;
  children: string;
};

const variants = {
  primary: "bg-strike text-bone hover:bg-deep",
  quiet: "bg-ink/[.06] text-ink hover:bg-ink/[.11]",
  light: "bg-bone text-deep hover:bg-paper",
  outline: "border border-current/25 text-current hover:border-current",
};

const sizes = {
  md: "h-12 px-5 text-[12.5px]",
  sm: "h-10 px-4 text-[11.5px]",
};

/**
 * The site's mono call-to-action. On hover the label rolls up and a fresh
 * copy rolls in from below, and the arrow shoots off and comes back.
 */
export function Button({ href, variant = "primary", size = "md", arrow, className = "", children, ...props }: ButtonProps) {
  const cls = `group/btn inline-flex items-center gap-2.5 rounded-[5px] font-mono font-medium tracking-[.1em] uppercase no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-strike ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-site group-hover/btn:-translate-y-full motion-reduce:transition-none">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-site group-hover/btn:translate-y-0 motion-reduce:transition-none"
        >
          {children}
        </span>
      </span>
      {arrow && (
        <span aria-hidden="true" className="relative block size-3 overflow-hidden">
          <ArrowIcon className="absolute inset-0 transition-transform duration-500 ease-site group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3" />
          <ArrowIcon className="absolute inset-0 -translate-x-3 translate-y-3 transition-transform duration-500 ease-site group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
        </span>
      )}
    </>
  );

  const isPage = href.startsWith("/") && !href.startsWith("/#");
  return isPage ? (
    <Link href={href} className={cls} {...props}>
      {content}
    </Link>
  ) : (
    <a href={href} className={cls} {...props}>
      {content}
    </a>
  );
}
