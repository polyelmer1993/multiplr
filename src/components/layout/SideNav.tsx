"use client";

import { useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { useOnScroll } from "@/hooks/useOnScroll";
import { NAV } from "@/lib/content";

/** Section links pinned to the left on large screens, highlighting where you are. */
export function SideNav() {
  const { inside } = useSite();
  const [current, setCurrent] = useState(0);

  useOnScroll(({ vh }) => {
    let cur = 0;
    NAV.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= vh * 0.45) cur = i;
    });
    setCurrent(cur);
  });

  return (
    <nav
      aria-label="Sections"
      className={`fixed top-[30vh] left-6 z-35 hidden transition-[opacity,transform] duration-600 ease-site lg:block ${
        inside ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0"
      }`}
      inert={!inside}
    >
      <ul className="flex flex-col gap-2">
        {NAV.map(({ id, label }, i) => {
          const on = i === current;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? "location" : undefined}
                className={`relative block py-[3px] pl-3.5 text-[13px] font-medium no-underline transition-[color,opacity] duration-300 focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-hd ${
                  on ? "text-fg opacity-100" : "text-fg-soft opacity-70"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 left-0 -mt-1.5 h-3 w-[1.5px] bg-hd transition-transform duration-[350ms] ease-site ${
                    on ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
