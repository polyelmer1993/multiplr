"use client";

import { useEffect, useRef } from "react";
import { useSite } from "@/components/SiteProvider";
import { SealCubeFaces } from "@/components/ui/SealCubeFaces";
import { clamp, eio, span } from "@/lib/motion";

/**
 * A small seal cube that follows you down the page. It hops to whichever
 * <Perch> is nearest the upper third of the screen, flips when tapped, and
 * near the contact section flies up and melts into the header logo.
 */
export function Companion() {
  const { inside, reduced } = useSite();
  const compRef = useRef<HTMLDivElement>(null);
  const csqRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const insideRef = useRef(inside);
  const hopRef = useRef<() => void>(() => {});

  useEffect(() => {
    insideRef.current = inside;
  }, [inside]);

  useEffect(() => {
    if (reduced) return;
    const comp = compRef.current!, csq = csqRef.current!, ccube = cubeRef.current!;
    const talk = document.getElementById("talk");
    const homeSeal = document.querySelector<HTMLElement>("[data-home-seal]");
    if (!talk || !homeSeal) return;

    // Spring state: position, rotation, squash, hop, merge progress, logo pulse.
    const K = { sc: 1, x: 0, y: -140, vx: 0, vy: 0, rx: -16, ry: 28, spin: 0, sq: 0, sqv: 0, hy: 0, hv: 0,
      started: false, landed: false, m: 0, mg: false, trx: 0, try_: 0, merged: false, ps: 0, pv: 0 };

    hopRef.current = () => {
      if (K.m > 0.3) return;
      K.hv = -560; K.spin += 520; K.sqv -= 1.6;
    };

    const mergeTarget = (vh: number) => clamp((vh * 0.9 - talk.getBoundingClientRect().top) / (vh * 0.5), 0, 1);

    const perchTarget = (vw: number, vh: number, sz: number) => {
      let best: DOMRect | null = null, bd = 1e9;
      document.querySelectorAll<HTMLElement>("main [data-perch]").forEach((p) => {
        const r = p.getBoundingClientRect();
        if (!r.width) return;
        const cy = r.top + r.height / 2;
        if (cy < 92 + sz / 2 || cy > vh * 0.86 || r.left < 0 || r.right > vw) return;
        const d = Math.abs(cy - vh * 0.36);
        if (d < bd) { bd = d; best = r; }
      });
      if (best) return { x: (best as DOMRect).left, y: (best as DOMRect).top, s: 1 };
      // No perch on screen: wait small, top-centre.
      return { x: (vw - sz) / 2, y: 44 - sz / 2, s: 0.7 };
    };

    let raf = 0, last = 0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      const vw = window.innerWidth, vh = window.innerHeight, sz = comp.offsetWidth || 60;

      if (!insideRef.current) {
        comp.style.opacity = "0";
        K.started = false; K.landed = false;
        return;
      }

      let tg = perchTarget(vw, vh, sz);
      K.m += (mergeTarget(vh) - K.m) * Math.min(1, dt * 5);
      if (K.m < 0.002) K.m = 0;
      if (K.m > 0.998) K.m = 1;
      const mt = eio(K.m), hr = homeSeal.getBoundingClientRect(), hs = hr.width / sz;
      const hx = hr.left + hr.width / 2 - sz / 2, hyy = hr.top + hr.height / 2 - sz / 2;
      if (K.m > 0) {
        tg = { x: tg.x + (hx - tg.x) * mt, y: tg.y + (hyy - tg.y) * mt, s: tg.s + (hs - tg.s) * mt };
        if (!K.mg) { K.mg = true; K.trx = Math.ceil(K.rx / 360 + 0.08) * 360; K.try_ = Math.ceil(K.ry / 360 + 0.08) * 360; }
      } else K.mg = false;

      if (!K.started) { K.started = true; K.x = tg.x; K.y = -sz * 2.2; K.vx = 0; K.vy = 0; }
      K.vx += (34 * (tg.x - K.x) - 7 * K.vx) * dt; K.x += K.vx * dt;
      K.vy += (34 * (tg.y - K.y) - 7 * K.vy) * dt; K.y += K.vy * dt;
      if (!K.landed && K.y > tg.y - 2 && K.vy > 0) { K.landed = true; K.sqv += 2.6; }
      K.sc += (tg.s - K.sc) * Math.min(1, dt * 5);

      const speed = Math.hypot(K.vx, K.vy);
      K.spin *= Math.exp(-2.4 * dt);
      const free = 1 - mt;
      K.rx += (6 + speed * 0.05) * dt * free;
      K.ry += (9 + speed * 0.07 + K.spin) * dt * free;
      if (K.mg) { K.rx = Math.min(K.rx, K.trx); K.ry = Math.min(K.ry, K.try_); }
      K.sqv += (300 * (0 - K.sq) - 12 * K.sqv) * dt; K.sq += K.sqv * dt;
      K.hv += 2300 * dt; K.hy += K.hv * dt;
      if (K.hy > 0) { if (K.hv > 200) K.sqv += K.hv * 0.0035; K.hy = 0; K.hv = 0; }
      const bob = Math.sin((ts / 1000) * 1.8) * 3 * (1 - mt);

      // Final approach: lock exactly onto the header logo.
      const lock = span(mt, 0.5, 0.88);
      const px = K.x + (hx - K.x) * lock;
      let py = K.y + K.hy + bob * K.sc;
      py = py + (hyy - py) * lock;
      const sc = K.sc + (hs - K.sc) * lock;
      const face = eio(span(mt, 0, 0.8));
      const arx = K.mg ? K.rx + (K.trx - K.rx) * face : K.rx;
      const ary = K.mg ? K.ry + (K.try_ - K.ry) * face : K.ry;
      const flat = 1 - 0.999 * eio(span(mt, 0.45, 1));

      comp.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px) scale(${sc.toFixed(4)})`;
      csq.style.transform = `scale(${(1 + K.sq * 0.7 * (1 - lock)).toFixed(4)},${(1 - K.sq * (1 - lock)).toFixed(4)})`;
      ccube.style.transform = `rotateX(${arx.toFixed(2)}deg) rotateY(${ary.toFixed(2)}deg) scale3d(1,1,${flat.toFixed(4)})`;

      const co = 1 - span(mt, 0.9, 0.99);
      comp.style.opacity = co.toFixed(3);
      comp.style.setProperty("--co", co.toFixed(3));
      const merging = mt > 0.74;
      comp.classList.toggle("merging", merging);
      if (merging) {
        const inv = 1 / Math.max(0.2, sc);
        comp.style.setProperty("--mfs", `${(9 * inv).toFixed(2)}px`);
        comp.style.setProperty("--mbw", `${(1.5 * inv).toFixed(2)}px`);
        comp.style.setProperty("--mpy", `${(5 * inv).toFixed(2)}px`);
        comp.style.setProperty("--mpx", `${(7 * inv).toFixed(2)}px`);
      }
      ccube.style.pointerEvents = K.m > 0.3 ? "none" : "";

      // A little squash on the header logo when the cube lands in it.
      if (!K.merged && K.m >= 0.99) { K.merged = true; K.ps = 0.12; K.pv = 0; }
      if (K.merged && K.m < 0.9) { K.merged = false; K.ps = 0.06; K.pv = 0; }
      K.pv += (320 * (0 - K.ps) - 11 * K.pv) * dt; K.ps += K.pv * dt;
      if (Math.abs(K.ps) < 0.0005 && Math.abs(K.pv) < 0.01) { K.ps = 0; K.pv = 0; homeSeal.style.transform = ""; }
      else homeSeal.style.transform = `scale(${(1 + K.ps).toFixed(4)},${(1 + K.ps * 0.55).toFixed(4)})`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={compRef}
      className="companion pointer-events-none fixed top-0 left-0 z-41 opacity-0 transition-opacity duration-500 will-change-transform"
    >
      <div ref={csqRef} className="absolute inset-0 origin-bottom transform-3d">
        <div
          ref={cubeRef}
          role="button"
          tabIndex={inside ? 0 : -1}
          aria-label="The Multiplr seal. Tap it to make it flip."
          className="pointer-events-auto absolute inset-0 cursor-pointer outline-none transform-3d [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-strike"
          onClick={() => hopRef.current()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              hopRef.current();
            }
          }}
        >
          <SealCubeFaces />
        </div>
      </div>
    </div>
  );
}
