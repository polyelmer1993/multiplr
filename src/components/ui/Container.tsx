import type { ComponentProps } from "react";

/** The page's content width: wide, with edge-aligned gutters. */
export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`relative mx-auto w-full max-w-[1440px] px-5 md:px-10 ${className}`} {...props} />;
}
