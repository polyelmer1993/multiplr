"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Seal } from "./Seal";
import { ButtonLink } from "./Button";
import { cn } from "@/lib/cn";

const LINKS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** The bar is a hairline, never a pill and never a shadowed slab. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-hairline border-muted/40 bg-bone/95 backdrop-blur-[2px]">
      <div className="stage flex items-center justify-between py-s-4">
        <Link
          href="/"
          className="flex items-center gap-s-4"
          aria-label="Multiplr — home"
        >
          <Seal />
          <span className="font-mono text-mono-label uppercase tracking-[0.02em] text-ink">
            MULTIPLR
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-s-7">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-block pb-[3px] font-sans text-ui transition-colors duration-200 ease-calm",
                      active
                        ? "border-b-active border-strike pb-[2px] text-ink"
                        : "border-b-hairline border-transparent text-muted hover:border-b-active hover:border-strike hover:pb-[2px] hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <ButtonLink href="/contact" variant="primary" markAccent>
                Start a project
              </ButtonLink>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="border-hairline border-strike px-[12px] py-[8px] font-mono text-mono-label uppercase text-ink transition-colors duration-200 ease-calm hover:border-active hover:border-deep hover:px-[11px] hover:py-[7px] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t-hairline border-muted/40 md:hidden"
        >
          <ul className="stage flex flex-col py-s-4">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href} className="border-b-hairline border-muted/30 last:border-b-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-s-4 font-sans text-ui",
                      active ? "text-strike" : "text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-s-5">
              <ButtonLink href="/contact" variant="primary" markAccent className="w-full">
                Start a project
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
