"use client";

import { useEffect, useState } from "react";

/**
 * Shortest time the panel stays up. The seal finishes drawing itself at about
 * 920ms (see the keyframes in `globals.css`), so anything less would wipe the
 * panel away mid-animation on a warm cache. This leaves a short beat on the
 * assembled mark before the exit starts.
 */
const MIN_MS = 1150;
/** Hard cap. The panel leaves at this point whether or not `load` has fired. */
const MAX_MS = 2600;
/** Must match the panel's exit transition in globals.css. */
const EXIT_MS = 700;

const SESSION_KEY = "multiplr:preloaded";

/**
 * The opening seal. A bone panel over the page, drawing the logo — the square
 * rule, then the three mono rows, then the multiply mark — while the document
 * finishes loading, then wiping up to reveal the sheet.
 *
 * Three things keep it honest:
 *
 * 1. **The entrance is CSS, not JS.** Keyframes in `globals.css` start on the
 *    first paint of the server HTML. A Framer entrance would not start until
 *    hydration, which is roughly when the page is ready anyway — the animation
 *    would play to an empty room.
 * 2. **It never gates the content.** The page is server-rendered underneath,
 *    so crawlers and readers get it regardless. The panel leaves on `load` or
 *    at `MAX_MS`, whichever comes first, and `<noscript>` hides it outright.
 * 3. **It plays once per session.** An inline script in `layout.tsx` sets
 *    `data-preloaded` on `<html>` before first paint when this session has
 *    already seen it, or when the visitor asked for reduced motion; CSS then
 *    hides the panel with no flash and no hydration mismatch.
 *
 * Worth saying plainly: this does not make the site load faster. It covers the
 * load with something to look at. The bundle it adds is a few hundred bytes of
 * CSS and no images.
 */
export function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Already seen this session, or reduced motion — the panel is hidden by
    // CSS already, so drop it from the tree without animating anything.
    if (root.dataset.preloaded === "1") {
      setGone(true);
      return;
    }

    root.classList.add("is-loading");

    const startedAt = performance.now();
    // `load` and the cap can both fire; only the first one counts. This is a
    // local, not a ref: StrictMode remounts the effect in development, and
    // each run has to be able to schedule its own exit from scratch.
    let finished = false;
    let exitTimer: number | undefined;
    let doneTimer: number | undefined;

    const finish = () => {
      if (finished) return;
      finished = true;

      const hold = Math.max(0, MIN_MS - (performance.now() - startedAt));

      exitTimer = window.setTimeout(() => {
        setLeaving(true);
        root.classList.remove("is-loading");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // Private mode or blocked storage: the panel simply plays again.
        }
        doneTimer = window.setTimeout(() => setGone(true), EXIT_MS);
      }, hold);
    };

    const cap = window.setTimeout(finish, MAX_MS);

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", finish);
      root.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader${leaving ? " preloader--leave" : ""}`} aria-hidden="true">
      <div className="preloader__stack">
        <div className="preloader__seal">
          <span className="preloader__edge preloader__edge--t" />
          <span className="preloader__edge preloader__edge--r" />
          <span className="preloader__edge preloader__edge--b" />
          <span className="preloader__edge preloader__edge--l" />

          <span className="preloader__row preloader__row--1">MUL</span>
          <span className="preloader__row preloader__row--2">TIP</span>
          <span className="preloader__row preloader__row--3">
            LR<span className="preloader__mark">&#215;</span>
          </span>
        </div>

        <p className="preloader__word">MULTIPLR</p>

        <div className="preloader__meter">
          <span className="preloader__meter-fill" />
        </div>
      </div>
    </div>
  );
}
