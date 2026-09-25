import type { ComponentProps } from "react";
import { Container } from "./Container";

type SectionProps = ComponentProps<"section"> & {
  /** Classes for the inner <Container>. */
  containerClassName?: string;
};

/** A page section with the standard centred container inside. */
export function Section({ children, containerClassName = "", className = "", ...props }: SectionProps) {
  return (
    <section className={`relative ${className}`} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
