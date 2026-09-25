"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/** Section id to scroll to after navigating back to the home page. */
let pending: string | null = null;

function scrollToSection(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY,
    behavior: smooth && !reduced ? "smooth" : "instant",
  });
  // Move keyboard focus too, so the next Tab continues from the section.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/**
 * Makes section links ("#talk" or "/#talk") scroll to the section without
 * adding "#talk" to the address bar. From other pages, it goes to the home
 * page first and then scrolls. Renders nothing.
 */
export function SectionLinks() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (a?.dataset.sectionLink === "off") return;
      const href = a?.getAttribute("href");
      const match = href?.match(/^\/?#(.+)$/);
      if (!match) return;
      // Runs before React's handlers (capture phase), so <Link> never adds the hash.
      e.preventDefault();
      e.stopPropagation();
      const id = match[1];
      if (pathname === "/" || href!.startsWith("#")) {
        scrollToSection(id, true);
      } else {
        pending = id;
        router.push("/", { scroll: false });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // Arriving on the home page with a section to show (from another page, or a shared "/#talk" link).
  useEffect(() => {
    if (pathname !== "/") return;
    const id = pending ?? (location.hash ? decodeURIComponent(location.hash.slice(1)) : null);
    pending = null;
    if (!id) return;
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    // Scroll now, then again once fonts and images have settled the layout.
    requestAnimationFrame(() => scrollToSection(id, false));
    const settle = () => scrollToSection(id, false);
    document.fonts?.ready.then(settle);
    const t = setTimeout(settle, 400);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
