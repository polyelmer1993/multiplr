"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { SealCubeFaces, SealLetters } from "@/components/ui/SealCubeFaces";
import { useOnScroll } from "@/hooks/useOnScroll";
import { clamp, ein, eio, eout, span } from "@/lib/motion";
import { TypingText } from "./TypingText";

const snap = (v: number) => Math.round(v / 90) * 90;

/**
 * The scroll-driven intro. A playful seal cube sits in the middle of the
 * screen; as you scroll it flattens and flies onto a door, the × turns like
 * a key, the door swings open, and you walk through into the site.
 */
export function Entrance() {
  const { reduced, setInside } = useSite();

  const entryRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const doorwayRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const plaqueRef = useRef<HTMLDivElement>(null);
  const plaqueSealRef = useRef<HTMLDivElement>(null);
  const keyXRef = useRef<HTMLElement>(null);
  const leverRef = useRef<HTMLElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const flyerXRef = useRef<HTMLElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLAnchorElement>(null);

  // Cube physics. Kept in a ref: it changes every frame and never needs a re-render.
  const C = useRef({
    rx: 0, ry: 0, vx: 0, vy: 0, tx: 0, ty: 0, drag: false, sq: 0, sqv: 0, sqT: 0, hy: 0, hv: 0,
    lx: 0, ly: 0, plx: 0, ply: 0, st: 0,
    flat: 1, locked: false, touched: false,
    lastX: 0, lastY: 0, lastT: 0, moved: 0, downT: 0, flipAxis: 0,
  }).current;

  const hop = (axis: "x" | "y", amount: number) => {
    C.hv = -860; C.sqv -= 2.2;
    if (axis === "x") C.tx += amount; else C.ty += amount;
  };

  /* ---------- Cube interaction ---------- */

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (C.locked) return;
    C.drag = true; C.touched = true; C.moved = 0; C.downT = performance.now();
    C.lastX = e.clientX; C.lastY = e.clientY; C.lastT = C.downT; C.sqT = 0.12;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!C.drag) return;
    const now = performance.now(), dt = Math.max(8, now - C.lastT) / 1000;
    const dx = e.clientX - C.lastX, dy = e.clientY - C.lastY;
    C.moved += Math.abs(dx) + Math.abs(dy);
    if (C.moved > 6) C.sqT = 0.04;
    C.ry += dx * 0.5; C.rx -= dy * 0.5;
    C.vy = C.vy * 0.5 + ((dx * 0.5) / dt) * 0.5;
    C.vx = C.vx * 0.5 + ((-dy * 0.5) / dt) * 0.5;
    C.lastX = e.clientX; C.lastY = e.clientY; C.lastT = now;
  };

  const onRelease = () => {
    if (!C.drag) return;
    C.drag = false; C.sqT = 0;
    if (C.moved < 6 && performance.now() - C.downT < 400) {
      // A tap: flip, alternating axes.
      C.flipAxis = 1 - C.flipAxis;
      hop(C.flipAxis ? "y" : "x", C.flipAxis ? 180 : -180);
      C.tx = snap(C.tx); C.ty = snap(C.ty);
    } else {
      // A fling: keep spinning a little, then settle on a face.
      C.tx = snap(C.rx + C.vx * 0.22); C.ty = snap(C.ry + C.vy * 0.22);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (C.locked) return;
    const k = e.key;
    if (k === "ArrowLeft") C.ty -= 90;
    else if (k === "ArrowRight") C.ty += 90;
    else if (k === "ArrowUp") C.tx += 90;
    else if (k === "ArrowDown") C.tx -= 90;
    else if (k === "Enter" || k === " ") hop("y", 360);
    else return;
    e.preventDefault(); C.touched = true; C.sqv += 1.2;
  };

  /* ---------- Cube physics loop ---------- */

  useEffect(() => {
    if (reduced) return;
    const cube = cubeRef.current!, squash = squashRef.current!, shadow = shadowRef.current!;

    // Follow the pointer slightly with the cube's gaze.
    const onMove = (e: globalThis.PointerEvent) => {
      if (C.drag) return;
      const r = cube.getBoundingClientRect();
      C.plx = clamp((e.clientY - (r.top + r.height / 2)) / window.innerHeight, -0.6, 0.6);
      C.ply = clamp((e.clientX - (r.left + r.width / 2)) / window.innerWidth, -0.6, 0.6);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Two little hops to invite a first-time visitor to play.
    let invites = 0;
    let inviteTimer = window.setTimeout(function invite() {
      if (C.touched || C.locked || invites >= 2) return;
      invites++; hop("y", 360);
      inviteTimer = window.setTimeout(invite, 6500);
    }, 1700);

    let raf = 0, last = 0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      const t = ts / 1000;
      if (C.locked) {
        // Once scrolling starts, settle front-facing.
        C.drag = false; C.tx = Math.round(C.rx / 360) * 360; C.ty = Math.round(C.ry / 360) * 360; C.sqT = 0;
      }
      if (!C.drag) {
        const k = C.locked ? 220 : 95, c = C.locked ? 26 : 10;
        C.vx += (k * (C.tx - C.rx) - c * C.vx) * dt; C.rx += C.vx * dt;
        C.vy += (k * (C.ty - C.ry) - c * C.vy) * dt; C.ry += C.vy * dt;
      }
      // Squash-and-stretch spring, and gravity for hops.
      C.sqv += (320 * (C.sqT - C.sq) - 13 * C.sqv) * dt; C.sq += C.sqv * dt;
      C.hv += 2900 * dt; C.hy += C.hv * dt;
      if (C.hy > 0) { if (C.hv > 250) C.sqv += C.hv * 0.0032; C.hy = 0; C.hv = 0; }
      // Stretch along the direction of spin.
      const spd = Math.min(Math.hypot(C.vx, C.vy) / 2600, 0.14);
      C.st += (spd - C.st) * Math.min(1, dt * 10);
      const horiz = Math.abs(C.vy) >= Math.abs(C.vx);
      const idle = C.locked ? 0 : 1, breathe = Math.sin(t * 2.3) * 0.014 * idle, bob = Math.sin(t * 1.7) * 3 * idle;
      const sx = 1 + C.sq * 0.75 - breathe * 0.5 + (horiz ? C.st : -C.st * 0.45);
      const sy = 1 - C.sq + breathe + (horiz ? -C.st * 0.45 : C.st);
      C.lx += ((C.drag || C.locked ? 0 : -C.plx * 16) - C.lx) * Math.min(1, dt * 4);
      C.ly += ((C.drag || C.locked ? 0 : C.ply * 20) - C.ly) * Math.min(1, dt * 4);

      squash.style.transform = `translateY(${(C.hy + bob).toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      cube.style.transform = `rotateX(${(C.rx + C.lx).toFixed(2)}deg) rotateY(${(C.ry + C.ly).toFixed(2)}deg) scale3d(1,1,${Math.max(0.001, C.flat).toFixed(4)})`;
      cube.style.pointerEvents = C.locked ? "none" : "";
      const lift = Math.min(1, -C.hy / 220);
      shadow.style.transform = `scale(${(1 - lift * 0.35 + C.sq * 0.4).toFixed(3)},${(1 - lift * 0.2).toFixed(3)})`;
      shadow.style.opacity = ((1 - lift * 0.55) * C.flat).toFixed(3);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(inviteTimer);
      window.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* ---------- Scroll timeline ---------- */

  const sceneOy = useRef<number | null>(null);
  const sceneS = useRef(1);

  useEffect(() => {
    const onResize = () => { sceneOy.current = null; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useOnScroll(({ vw, vh }) => {
    const entry = entryRef.current, scene = sceneRef.current, flyer = flyerRef.current;
    if (!entry || !scene || !flyer) return;
    const r = entry.getBoundingClientRect();
    const p = clamp(-r.top / (entry.offsetHeight - vh), 0, 1);
    const set = (el: HTMLElement | null, prop: string, v: string) => el?.style.setProperty(prop, v);

    // 0–7%: the pitch and scroll cue fade away.
    const lead = span(p, 0, 0.07);
    set(pitchRef.current, "opacity", String(1 - lead));
    set(pitchRef.current, "transform", `translateY(${-lead * 30}px)`);
    set(cueRef.current, "opacity", String(1 - span(p, 0, 0.03)));
    set(skipRef.current, "opacity", p > 0.9 ? "0" : "");

    // 3–21%: the door frame draws up from the floor.
    set(archRef.current, "clip-path", `inset(${(1 - eout(span(p, 0.03, 0.19))) * 100}% 0 0 0)`);
    set(openingRef.current, "clip-path", `inset(${(1 - eout(span(p, 0.06, 0.21))) * 100}% 0 0 0)`);

    // 5–27%: the cube flattens into a seal and flies onto the door as its plaque.
    const d = doorwayRef.current!.getBoundingClientRect();
    const sw = d.width * 0.4, sx = d.left + d.width * 0.3, sy = d.top + d.height * 0.12;
    const big = Math.min(vw * 0.26, vh * 0.17, 165);
    const bx = (vw - big) / 2, by = vh * 0.5 - big * 0.5 - Math.min(vh * 0.08, 60);
    const f = eio(span(p, 0.05, 0.27));
    const size = big + (sw - big) * f;
    flyer.style.width = flyer.style.height = `${size}px`;
    flyer.style.transform = `translate(${bx + (sx - bx) * f}px,${by + (sy - by) * f}px)`;
    flyer.style.setProperty("--sz", `${size}px`);
    flyer.style.setProperty("--bw", `${Math.max(1.5, size * 0.012)}px`);
    flyer.style.setProperty("--pad", `${size * 0.075}px`);
    flyer.style.setProperty("--t", eio(span(p, 0.09, 0.2)).toFixed(3));
    C.flat = 1 - eio(span(p, 0.004, 0.05));
    C.locked = p > 0.004;
    set(hintRef.current, "top", `${by - 40}px`);
    set(hintRef.current, "opacity", C.locked || C.touched ? "0" : "1");
    set(plaqueSealRef.current, "border-width", `${Math.max(1.5, sw * 0.012)}px`);
    set(plaqueSealRef.current, "padding", `${sw * 0.075}px`);
    const landed = p >= 0.27;
    flyer.style.visibility = landed ? "hidden" : "visible";
    set(plaqueRef.current, "visibility", landed ? "visible" : "hidden");

    // 28–35%: the × turns like a key; the handle dips.
    const key = eio(span(p, 0.28, 0.35));
    set(keyXRef.current, "transform", `rotate(${key * 90}deg)`);
    set(flyerXRef.current, "transform", `rotate(${key * 90}deg)`);
    set(leverRef.current, "transform", `rotate(${-key * 32 + eio(span(p, 0.52, 0.6)) * 32}deg)`);

    // 35–64%: the door swings open and light spills out.
    const open = eio(span(p, 0.35, 0.64));
    set(leafRef.current, "transform", `rotateY(${open * 100}deg)`);
    set(shadeRef.current, "opacity", (open * 0.55).toFixed(3));
    set(spillRef.current, "opacity", (eout(span(p, 0.37, 0.6)) * 0.95).toFixed(3));

    // 52–97%: walk through — zoom into the doorway.
    const walk = ein(span(p, 0.52, 0.97));
    if (walk > 0) {
      const s0 = sceneS.current;
      const ow = d.width / s0, oh = d.height / s0;
      const smax = Math.max(vw / ow, vh / oh) * 1.35;
      const s = 1 + (smax - 1) * walk;
      const cy = d.top + d.height / 2;
      const oy = (sceneOy.current ??= (cy - vh / 2) / s0 + vh / 2);
      scene.style.transformOrigin = `${vw / 2}px ${oy}px`;
      scene.style.transform = `translateY(${-(oy - vh / 2) * walk}px) scale(${s})`;
      sceneS.current = s;
    } else {
      scene.style.transform = "";
      sceneS.current = 1;
      sceneOy.current = null;
    }

    setInside(p >= 0.97 || r.bottom <= vh);
  }, !reduced);

  // Visitors who prefer reduced motion skip the door entirely.
  if (reduced) return null;

  const skipDoor = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: document.getElementById("home")!.offsetTop, behavior: "instant" });
  };

  return (
    <section ref={entryRef} id="entry" aria-label="Entrance" className="relative h-[430vh] bg-field">
      <div className="door-stage sticky top-0 h-svh overflow-hidden bg-field">
        <div ref={sceneRef} className="absolute inset-0 will-change-transform">
          <div className="door-floor" />
          <div ref={spillRef} className="door-spill" />
          <div ref={doorwayRef} className="doorway">
            <div ref={archRef} className="architrave" />
            <div ref={openingRef} className="door-opening">
              <div className="door-inside" />
              <div ref={leafRef} className="door-leaf">
                <div className="absolute inset-x-[12%] top-[7%] h-2/5 border border-bone/16" />
                <div className="absolute inset-x-[12%] top-[53%] h-2/5 border border-bone/16" />
                <div ref={plaqueRef} className="invisible absolute top-[12%] left-1/2 aspect-square w-2/5 -translate-x-1/2">
                  <div ref={plaqueSealRef} className="bigseal absolute inset-0 [--t:1]">
                    <SealLetters xRef={keyXRef} />
                  </div>
                </div>
                <div className="absolute top-[51%] right-[9%] aspect-square w-[7%] bg-bone">
                  <b ref={leverRef} className="absolute top-[32%] right-[40%] h-[36%] w-[340%] origin-right bg-bone" />
                </div>
                <div ref={shadeRef} className="absolute inset-0 bg-black opacity-0" />
              </div>
            </div>
          </div>
        </div>

        <div ref={flyerRef} className="absolute top-0 left-0 perspective-[calc(var(--sz,300px)*4.2)] will-change-transform">
          <div
            ref={shadowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] top-[104%] h-[16%] bg-[radial-gradient(closest-side,rgba(13,19,85,.2),rgba(13,19,85,0))]"
          />
          <div ref={squashRef} className="absolute inset-0 origin-bottom transform-3d">
            <div
              ref={cubeRef}
              tabIndex={0}
              role="img"
              aria-label="The Multiplr seal as a cube. Drag it to spin, tap it to flip, or use the arrow keys to roll it."
              className="absolute inset-0 cursor-grab touch-none outline-none transform-3d [-webkit-tap-highlight-color:transparent] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-[14px] focus-visible:outline-strike"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onRelease}
              onPointerCancel={onRelease}
              onKeyDown={onKeyDown}
            >
              <SealCubeFaces xRef={flyerXRef} />
            </div>
          </div>
        </div>

        <p
          ref={hintRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 text-center font-mono text-[10.5px] font-medium tracking-[.2em] text-ink/58 uppercase transition-opacity duration-600"
        >
          Drag it, tap it, then scroll
        </p>

        <div ref={pitchRef} className="door-pitch absolute inset-x-0 px-[22px] text-center text-ink">
          <p className="text-[clamp(15px,1.5vw,18px)] text-ink/66">I help business owners</p>
          <TypingText />
        </div>

        <div
          ref={cueRef}
          className="absolute bottom-[26px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[10.5px] font-medium tracking-[.2em] text-ink/58 uppercase"
        >
          Scroll to come in
          <i className="relative block h-[34px] w-px overflow-hidden bg-ink/28">
            <span className="absolute left-0 h-2/5 w-px animate-cue bg-ink" />
          </i>
        </div>

        <a
          ref={skipRef}
          href="#home"
          data-section-link="off"
          onClick={skipDoor}
          className="absolute top-[18px] right-[18px] z-3 inline-flex min-h-11 items-center p-3 font-mono text-[10.5px] font-semibold tracking-[.2em] text-ink uppercase no-underline opacity-55 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-ink"
        >
          Skip the door
        </a>
      </div>
    </section>
  );
}
