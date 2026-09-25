"use client";

import Link from "next/link";
import { useSite } from "@/components/SiteProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Seal } from "@/components/ui/Seal";

/** Fixed top bar. Slides in once the visitor is through the entrance door. */
export function Header() {
  const { inside } = useSite();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-linear-to-b from-bgc from-74% to-transparent pt-[18px] pb-[30px] text-fg transition-[opacity,transform] duration-600 ease-site ${
        inside ? "opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
      inert={!inside}
    >
      <Container rail={false} className="flex items-center justify-between">
        <Link href="/" aria-label="Multiplr home" className="text-fg no-underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-hd">
          {/* The companion cube flies into this logo at the end of the page. */}
          <Seal data-home-seal />
        </Link>
        <Button href="/#talk" size="sm" arrow>
          Let&apos;s talk
        </Button>
      </Container>
    </header>
  );
}
