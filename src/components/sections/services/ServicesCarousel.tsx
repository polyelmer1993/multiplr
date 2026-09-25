"use client";

import { useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SERVICES } from "@/lib/content";
import { ServiceChips, ServicesHeader, ServiceSketch, serviceTitle } from "./shared";

/**
 * Option A · Carousel. A swipeable row of cards; the next card always peeks
 * in from the right, so it's clear there's more to see.
 */
export function ServicesCarousel({ titleId }: { titleId: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const count = SERVICES.length;

  const goTo = (i: number) => {
    const track = trackRef.current!;
    const card = track.children[Math.max(0, Math.min(count - 1, i))] as HTMLElement;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  // Work out which card is showing from the scroll position.
  const onScroll = () => {
    const track = trackRef.current!;
    const cards = [...track.children] as HTMLElement[];
    const dist = (c: HTMLElement) => Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft);
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    setActive(atEnd ? count - 1 : cards.reduce((best, c, k) => (dist(c) < dist(cards[best]) ? k : best), 0));
  };

  const controls = (
    <div className="flex items-center gap-4">
      <p className="font-mono text-[12px] font-medium tracking-[.2em] text-fg-soft" aria-live="polite">
        <span className="text-fg">0{active + 1}</span> / 0{count}
      </p>
      <div className="flex gap-2">
        <NavButton label="Previous service" disabled={active === 0} onClick={() => goTo(active - 1)} flip />
        <NavButton label="Next service" disabled={active === count - 1} onClick={() => goTo(active + 1)} />
      </div>
    </div>
  );

  return (
    <>
      <ServicesHeader titleId={titleId} aside={controls} />

      <div className="relative mt-[clamp(28px,5vh,48px)]">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Services"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hd md:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.title.join(" ")}
                aria-current={on || undefined}
                className={`flex shrink-0 basis-[80%] snap-start flex-col rounded-[22px] border bg-paper p-[clamp(20px,2.4vw,32px)] transition-[opacity,border-color,box-shadow] duration-500 md:basis-[64%] lg:basis-[58%] ${
                  on
                    ? "border-ink/14 opacity-100 shadow-[0_24px_50px_-34px_rgba(13,19,85,.55)]"
                    : "cursor-pointer border-ink/10 opacity-60 hover:opacity-85"
                }`}
                onClick={() => !on && goTo(i)}
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] md:items-center">
                  <div className="order-2 md:order-1">
                    <p className="font-mono text-[11px] font-medium tracking-[.2em] text-fg-soft uppercase">Service 0{i + 1}</p>
                    <h3
                      className={`mt-2 text-[clamp(1.5rem,2.7vw,2.4rem)] leading-[1.04] font-medium tracking-[-.05em] transition-colors duration-500 ${
                        on ? "text-strike" : "text-muted"
                      }`}
                    >
                      {serviceTitle(s.title)}
                    </h3>
                    <p className="pt-3 text-[clamp(.95rem,1.1vw,1.05rem)] text-fg-soft">{s.body}</p>
                    <ServiceChips chips={s.chips} className="mt-4 text-fg" />
                  </div>
                  <div className="order-1 aspect-4/3 border border-ink/8 bg-bone/32 md:order-2 md:aspect-square">
                    <ServiceSketch index={i} drawn={on} className="h-full w-full p-[6%]" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {/* Soft fade on the right edge hints that the row keeps going. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-bgc to-transparent transition-opacity duration-500 ${
            active === count - 1 ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div className="mt-6 flex gap-2" role="group" aria-label="Choose a service">
        {SERVICES.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={s.title.join(" ")}
            aria-pressed={i === active}
            onClick={() => goTo(i)}
            className="group h-6 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hd"
          >
            <span
              className={`block h-[3px] transition-[width,background-color] duration-500 ease-site ${
                i === active ? "w-12 bg-strike" : "w-6 bg-hair group-hover:bg-fg-soft"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}

function NavButton({ label, onClick, disabled, flip }: { label: string; onClick: () => void; disabled: boolean; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 cursor-pointer place-items-center border-[1.5px] border-fg text-fg transition-[background-color,color,opacity,transform] duration-300 hover:bg-fg hover:text-bgc active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-hd"
    >
      <ArrowIcon className={flip ? "-rotate-135" : "rotate-45"} />
    </button>
  );
}
