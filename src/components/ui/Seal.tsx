import type { ComponentProps } from "react";

/** The small square Multiplr logo mark: MUL / TIP / LR×. */
export function Seal({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`grid size-[52px] flex-none grid-rows-3 border-[1.5px] border-current px-[7px] py-[5px] font-mono text-[9px] font-semibold leading-[1.4] tracking-[.28em] will-change-transform ${className}`}
      {...props}
    >
      <span>MUL</span>
      <span>TIP</span>
      <span>
        LR<i className="not-italic text-hd">&times;</i>
      </span>
    </div>
  );
}
