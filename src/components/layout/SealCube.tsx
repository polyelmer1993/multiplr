"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { SealCubeFaces } from "@/components/ui/SealCubeFaces";
import { clamp, eio, span } from "@/lib/motion";

const snap = (v: number) => Math.round(v / 90) * 90;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The Multiplr seal as one living cube, from the top of the page to the bottom.
 *
 * 1. Hero: it sits large in the hero's [data-seal-anchor] box. Drag it to spin,
 *    tap to flip, or roll it with the arrow keys. It breathes, follows your
 *    pointer with its gaze, and hops twice to invite a first-time visitor.
 * 2. Shrink: as you scroll through the hero ([data-seal-track]) it settles
 *    front-facing and shrinks down into a small companion.
 * 3. Companion: it hops to whichever <Perch> is nearest the upper third of the
 *    screen, tumbling gently, and hops when tapped.
 * 4. Merge: near the contact section it flies up and melts into the header logo.
 */
export function SealCube() {
  const { reduced } = useSite();
  const wrapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  // Everything changes every frame, so it lives in a ref rather than state.
  const C = useRef({
    // rotation, spin velocity, rotation targets (hero), drag
    rx: -8, ry: 18, vx: 0, vy: 0, tx: 0, ty: 0, drag: false,
    // squash-and-stretch, hop height and velocity, spin stretch
    sq: 0, sqv: 0, sqT: 0, hy: 0, hv: 0, st: 0,
    // gaze towards the pointer
    lx: 0, ly: 0, plx: 0, ply: 0,
    // companion position (centre) and size, springing towards its perch
    cx: 0, cy: 0, cvx: 0, cvy: 0, cs: 60, started: false,
    // merge into the header logo
    m: 0, mg: false, trx: 0, try_: 0, merged: false, ps: 0, pv: 0,
    // interaction bookkeeping
    locked: false, companion: false, touched: false,
    lastX: 0, lastY: 0, lastT: 0, moved: 0, downT: 0, flipAxis: 0, spin: 0,
  }).current;

  const hop = (big = true) => {
    C.hv = big ? -860 : -560;
    C.sqv -= big ? 2.2 : 1.6;
  };

  /* ---------- Interaction ---------- */

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    C.touched = true;
    C.moved = 0;
    C.downT = performance.now();
    C.lastX = e.clientX;
    C.lastY = e.clientY;
    C.lastT = C.downT;
    if (C.locked) return;
    C.drag = true;
    C.sqT = 0.12;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!C.drag) return;
    const now = performance.now(), dt = Math.max(8, now - C.lastT) / 1000;
    const dx = e.clientX - C.lastX, dy = e.clientY - C.lastY;
    C.moved += Math.abs(dx) + Math.abs(dy);
    if (C.moved > 6) C.sqT = 0.04;
    C.ry += dx * 0.5;
    C.rx -= dy * 0.5;
    C.vy = C.vy * 0.5 + ((dx * 0.5) / dt) * 0.5;
    C.vx = C.vx * 0.5 + ((-dy * 0.5) / dt) * 0.5;
    C.lastX = e.clientX;
    C.lastY = e.clientY;
    C.lastT = now;
  };

  const onRelease = () => {
    const tap = C.moved < 6 && performance.now() - C.downT < 400;
    if (C.companion) {
      // Small cube: a tap makes it hop and spin.
      if (tap && C.m < 0.3) {
        hop(false);
        C.spin += 520;
      }
      return;
    }
    if (!C.drag) return;
    C.drag = false;
    C.sqT = 0;
    if (tap) {
      // A tap: flip, alternating axes.
      C.flipAxis = 1 - C.flipAxis;
      hop();
      if (C.flipAxis) C.ty += 180;
      else C.tx -= 180;
      C.tx = snap(C.tx);
      C.ty = snap(C.ty);
    } else {
      // A fling: keep spinning a little, then settle on a face.
      C.tx = snap(C.rx + C.vx * 0.22);
      C.ty = snap(C.ry + C.vy * 0.22);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (C.companion) {
      if (k === "Enter" || k === " ") {
        e.preventDefault();
        hop(false);
        C.spin += 520;
      }
      return;
    }
    if (C.locked) return;
    if (k === "ArrowLeft") C.ty -= 90;
    else if (k === "ArrowRight") C.ty += 90;
    else if (k === "ArrowUp") C.tx += 90;
    else if (k === "ArrowDown") C.tx -= 90;
    else if (k === "Enter" || k === " ") {
      hop();
      C.ty += 360;
    } else return;
    e.preventDefault();
    C.touched = true;
    C.sqv += 1.2;
  };

  /* ---------- The frame loop ---------- */

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current!, squash = squashRef.current!, cube = cubeRef.current!, shadow = shadowRef.current!;
    const anchor = document.querySelector<HTMLElement>("[data-seal-anchor]");
    const track = document.querySelector<HTMLElement>("[data-seal-track]");
    const talk = document.getElementById("talk");
    const homeSeal = document.querySelector<HTMLElement>("[data-home-seal]");
    if (!anchor || !track) return;

    // The cube's gaze follows the pointer while it's big.
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
      invites++;
      hop();
      C.ty += 360;
      inviteTimer = window.setTimeout(invite, 6500);
    }, 1900);

    /** Where the small cube wants to be: the perch nearest the upper third of the screen. */
    const perch = (vw: number, vh: number, sz: number) => {
      let best: DOMRect | null = null, bd = 1e9;
      document.querySelectorAll<HTMLElement>("main [data-perch]").forEach((p) => {
        const r = p.getBoundingClientRect();
        if (!r.width) return;
        const cy = r.top + r.height / 2;
        if (cy < 72 + sz / 2 || cy > vh * 0.86 || r.left < 0 || r.right > vw) return;
        const d = Math.abs(cy - vh * 0.36);
        if (d < bd) { bd = d; best = r; }
      });
      if (best) {
        const b = best as DOMRect;
        return { x: b.left + b.width / 2, y: b.top + b.height / 2, s: sz };
      }
      // No perch on screen: wait, smaller, in the header. With the section menu
      // showing, that's the gap between the menu and the call to action.
      const pill = document.querySelector<HTMLElement>("[data-nav-pill]")?.getBoundingClientRect();
      const cta = document.querySelector<HTMLElement>("[data-header-cta]")?.getBoundingClientRect();
      const x = pill?.width && cta?.width ? (pill.right + cta.left) / 2 : vw / 2;
      return { x, y: 38, s: sz * 0.7 };
    };

    let raf = 0, last = 0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      const t = ts / 1000;
      const vw = window.innerWidth, vh = window.innerHeight;
      const small = vw >= 821 ? 60 : 42;

      // How far through the hero we are, and how far the cube has shrunk.
      const tr = track.getBoundingClientRect();
      const heroP = clamp(-tr.top / Math.max(1, track.offsetHeight - vh), 0, 1);
      const sh = eio(span(heroP, 0.02, 0.5));
      C.locked = heroP > 0.004;
      C.companion = sh >= 0.999;
      if (C.locked) C.drag = false;

      // --- Companion target, including the flight into the header logo ---
      let tg = perch(vw, vh, small);
      const mRaw = talk ? clamp((vh * 0.9 - talk.getBoundingClientRect().top) / (vh * 0.5), 0, 1) : 0;
      C.m += (mRaw - C.m) * Math.min(1, dt * 5);
      if (C.m < 0.002) C.m = 0;
      if (C.m > 0.998) C.m = 1;
      const mt = eio(C.m);
      const hr = homeSeal?.getBoundingClientRect();
      if (hr && mt > 0) {
        const hx = hr.left + hr.width / 2, hy = hr.top + hr.height / 2;
        tg = { x: lerp(tg.x, hx, mt), y: lerp(tg.y, hy, mt), s: lerp(tg.s, hr.width, mt) };
        if (!C.mg) {
          C.mg = true;
          C.trx = Math.ceil(C.rx / 360 + 0.08) * 360;
          C.try_ = Math.ceil(C.ry / 360 + 0.08) * 360;
        }
      } else C.mg = false;

      if (!C.started) {
        C.started = true;
        C.cx = tg.x; C.cy = tg.y; C.cs = tg.s;
      }
      C.cvx += (34 * (tg.x - C.cx) - 7 * C.cvx) * dt; C.cx += C.cvx * dt;
      C.cvy += (34 * (tg.y - C.cy) - 7 * C.cvy) * dt; C.cy += C.cvy * dt;
      C.cs += (tg.s - C.cs) * Math.min(1, dt * 5);
      // Final approach: lock exactly onto the header logo.
      const lock = span(mt, 0.5, 0.88);
      let ccx = C.cx, ccy = C.cy, ccs = C.cs;
      if (hr && lock > 0) {
        ccx = lerp(ccx, hr.left + hr.width / 2, lock);
        ccy = lerp(ccy, hr.top + hr.height / 2, lock);
        ccs = lerp(ccs, hr.width, lock);
      }

      // --- Blend the hero spot into the companion spot as it shrinks ---
      const a = anchor.getBoundingClientRect();
      // The front face sits half a cube closer to the viewer, so in perspective it
      // looks bigger than the box. Shrink the box so the face itself matches the
      // target (unless it's been flattened into the header logo).
      const depth = 1 - 0.999 * eio(span(mt, 0.45, 1));
      const size = Math.max(8, lerp(a.width, ccs, sh) * ((4.4 - 0.5 * depth) / 4.4));
      const x = lerp(a.left + a.width / 2, ccx, sh);
      const y = lerp(a.top + a.height / 2, ccy, sh);

      // --- Rotation ---
      const free = span(sh, 0.85, 1) * (1 - mt);
      if (C.locked) {
        // Once scrolling starts, settle front-facing before tumbling freely.
        C.tx = Math.round(C.rx / 360) * 360;
        C.ty = Math.round(C.ry / 360) * 360;
        C.sqT = 0;
      }
      if (!C.drag && free < 1) {
        const k = (C.locked ? 220 : 95) * (1 - free), c = C.locked ? 26 : 10;
        C.vx += (k * (C.tx - C.rx) - c * C.vx) * dt; C.rx += C.vx * dt;
        C.vy += (k * (C.ty - C.ry) - c * C.vy) * dt; C.ry += C.vy * dt;
      }
      const speed = Math.hypot(C.cvx, C.cvy);
      C.spin *= Math.exp(-2.4 * dt);
      C.rx += (6 + speed * 0.05) * dt * free;
      C.ry += (9 + speed * 0.07 + C.spin) * dt * free;
      if (C.mg) { C.rx = Math.min(C.rx, C.trx); C.ry = Math.min(C.ry, C.try_); }
      const face = eio(span(mt, 0, 0.8));
      const arx = C.mg ? lerp(C.rx, C.trx, face) : C.rx;
      const ary = C.mg ? lerp(C.ry, C.try_, face) : C.ry;
      const flat = depth;

      // --- Squash, hops, idle breathing, gaze ---
      C.sqv += (320 * (C.sqT - C.sq) - 13 * C.sqv) * dt; C.sq += C.sqv * dt;
      const g = C.companion ? 2300 : 2900;
      C.hv += g * dt; C.hy += C.hv * dt;
      if (C.hy > 0) { if (C.hv > 220) C.sqv += C.hv * 0.0032; C.hy = 0; C.hv = 0; }
      const spd = Math.min(Math.hypot(C.vx, C.vy) / 2600, 0.14);
      C.st += (spd - C.st) * Math.min(1, dt * 10);
      const horiz = Math.abs(C.vy) >= Math.abs(C.vx);
      const idle = C.locked ? 0 : 1;
      const breathe = Math.sin(t * 2.3) * 0.014 * idle;
      const bob = Math.sin(t * (C.locked ? 1.8 : 1.7)) * 3 * (1 - mt);
      const settle = 1 - lock;
      const sx = 1 + (C.sq * 0.75 - breathe * 0.5 + (horiz ? C.st : -C.st * 0.45)) * settle;
      const sy = 1 + (-C.sq + breathe + (horiz ? -C.st * 0.45 : C.st)) * settle;
      C.lx += ((C.drag || C.locked ? 0 : -C.plx * 16) - C.lx) * Math.min(1, dt * 4);
      C.ly += ((C.drag || C.locked ? 0 : C.ply * 20) - C.ly) * Math.min(1, dt * 4);
      // Hops scale with the cube, so a small cube does a small hop.
      const hopY = C.hy * clamp(size / 160, 0.3, 1) * settle;

      // --- Write it all out ---
      wrap.style.width = wrap.style.height = `${size.toFixed(2)}px`;
      wrap.style.transform = `translate(${(x - size / 2).toFixed(1)}px,${(y - size / 2 + (bob * (1 - lock)) * 0.6).toFixed(1)}px)`;
      wrap.style.perspective = `${(size * 4.4).toFixed(0)}px`;
      wrap.style.setProperty("--sz", `${size.toFixed(2)}px`);
      wrap.style.setProperty("--bw", `${Math.max(1.4, Math.min(size * 0.012, 3)).toFixed(2)}px`);
      wrap.style.setProperty("--pad", `${(size * 0.078).toFixed(2)}px`);
      squash.style.transform = `translateY(${hopY.toFixed(2)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      cube.style.transform = `rotateX(${(arx + C.lx).toFixed(2)}deg) rotateY(${(ary + C.ly).toFixed(2)}deg) scale3d(1,1,${flat.toFixed(4)})`;
      cube.style.cursor = C.companion ? "pointer" : C.locked ? "default" : "";
      cube.style.pointerEvents = C.m > 0.3 || (C.locked && !C.companion) ? "none" : "";

      const lift = Math.min(1, -C.hy / 220);
      shadow.style.transform = `scale(${(1 - lift * 0.35 + C.sq * 0.4).toFixed(3)},${(1 - lift * 0.2).toFixed(3)})`;
      shadow.style.opacity = ((1 - lift * 0.55) * (1 - span(sh, 0, 0.35))).toFixed(3);

      const co = 1 - span(mt, 0.9, 0.99);
      wrap.style.opacity = co.toFixed(3);
      wrap.style.setProperty("--co", co.toFixed(3));
      const merging = mt > 0.74;
      wrap.classList.toggle("merging", merging);
      if (merging) {
        // Match the header logo's type and border exactly as it lands.
        wrap.style.setProperty("--mfs", "9px");
        wrap.style.setProperty("--mbw", "1.5px");
        wrap.style.setProperty("--mpy", "5px");
        wrap.style.setProperty("--mpx", "7px");
      }

      // A little squash on the header logo when the cube lands in it.
      if (homeSeal) {
        if (!C.merged && C.m >= 0.99) { C.merged = true; C.ps = 0.12; C.pv = 0; }
        if (C.merged && C.m < 0.9) { C.merged = false; C.ps = 0.06; C.pv = 0; }
        C.pv += (320 * (0 - C.ps) - 11 * C.pv) * dt; C.ps += C.pv * dt;
        if (Math.abs(C.ps) < 0.0005 && Math.abs(C.pv) < 0.01) { C.ps = 0; C.pv = 0; homeSeal.style.transform = ""; }
        else homeSeal.style.transform = `scale(${(1 + C.ps).toFixed(4)},${(1 + C.ps * 0.55).toFixed(4)})`;
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(inviteTimer);
      window.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  return (
    <div ref={wrapRef} className="seal-cube pointer-events-none fixed top-0 left-0 z-41 will-change-transform">
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[104%] h-[16%] bg-[radial-gradient(closest-side,rgba(13,19,85,.22),rgba(13,19,85,0))]"
      />
      <div ref={squashRef} className="absolute inset-0 origin-bottom transform-3d">
        <div
          ref={cubeRef}
          tabIndex={0}
          role="img"
          aria-label="The Multiplr seal as a cube. Drag it to spin, tap it to flip, or use the arrow keys to roll it."
          className="pointer-events-auto absolute inset-0 cursor-grab touch-none outline-none transform-3d [-webkit-tap-highlight-color:transparent] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-strike"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onRelease}
          onPointerCancel={onRelease}
          onKeyDown={onKeyDown}
        >
          <SealCubeFaces />
        </div>
      </div>
    </div>
  );
}
