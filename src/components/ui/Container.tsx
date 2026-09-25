import type { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div"> & {
  /**
   * Leave room on the left for the fixed side navigation on wide screens.
   * Turn off for full-bleed content such as the entrance.
   */
  rail?: boolean;
};

export function Container({ rail = true, className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[1240px] px-[22px] ml:px-14 ${
        rail ? "lg:pl-[max(56px,calc(176px-(100vw-1240px)/2))]" : ""
      } ${className}`}
      {...props}
    />
  );
}
