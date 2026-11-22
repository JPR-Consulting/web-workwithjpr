import React, { useEffect, useRef, useState } from 'react';
import { Devices, finePointer } from './parts';
import { prefersReducedMotion } from '../../hooks/useSeen';
import { dresden as t } from '../../content/dresden-copy';

/** Hero-Hintergrund: wenige, langsam treibende Lichtpunkte auf Canvas. Steht still bei „Bewegung reduzieren“, ruht, wenn der Hero nicht im Bild ist. */
export const HeroParticles: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;
    const still = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; ph: number; c: string };
    let ps: P[] = [];
    const seed = () => {
      const n = w < 768 ? 16 : 12; // wenige Punkte; das Licht am Zeiger (useCursorLight) trägt die Tiefe
      ps = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.05 - Math.random() * 0.14,
        r: 0.7 + Math.random() * 1.7,
        a: 0.25 + Math.random() * 0.55,
        ph: Math.random() * Math.PI * 2,
        c: Math.random() < 0.7 ? '143,168,255' : '201,214,255',
      }));
    };
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const tw = 0.65 + 0.35 * Math.sin(time / 1600 + p.ph);
        const al = p.a * tw;
        ctx.fillStyle = `rgba(${p.c},${(al * 0.14).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.c},${al.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const move = () => {
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
      }
    };
    size();
    if (still) {
      draw(0);
      const onResize = () => { size(); draw(0); };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      move();
      draw(time);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

const AUTO_MS = 4000;

/**
 * 3D-Kartenstapel der drei Beispiel-Entwürfe: leicht gekippt, wechselt alle ~4 s, Punkte-Leiste darunter,
 * Maus neigt den Stapel (nur Maus). Pausiert beim Überfahren/Fokus; bei reduzierter Bewegung kein Autoplay.
 */
export const HeroStack: React.FC = () => {
  // Dunkler Entwurf zuerst: passt zur Bühne und ist das vorgeladene Bild (prerender.mjs)
  const items = [t.examples.items[2], t.examples.items[0], t.examples.items[1]];
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(prefersReducedMotion());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced.current || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setActive((a) => (a + 1) % n);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, n, active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !finePointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="dd-stack"
      role="group"
      aria-label={t.ui.stackLabel}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="dd-stack-persp relative pt-[7%] pr-[7%] md:pr-[9%] md:pt-[11%]">
        <div className="dd-stack-scene relative">
          {items.map((it, i) => {
            const pos = (i - active + n) % n;
            return (
              <div key={it.title} className="dd-card3d" data-pos={pos} style={{ zIndex: n - pos }} aria-hidden={pos !== 0}>
                <Devices
                  desktop={it.img}
                  mobile={it.img}
                  host={it.title}
                  alt={`${t.examples.badge}: ${it.title}`}
                  phoneRight
                  eager
                  high={i === 0}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 md:mt-7 flex items-center justify-between gap-4 pr-[7%] md:pr-[9%]">
        <div className="flex items-center">
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${t.ui.stackDot}: ${it.title}`}
              aria-current={i === active}
              className="dd-dot group grid place-items-center h-11 px-1.5"
            >
              <span className={`dd-dot-bar ${i === active ? 'on' : ''} ${i === active && !paused && !reduced.current ? 'run' : ''}`}>
                <span />
              </span>
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-2 min-w-0 rounded-full border border-white/10 bg-[#0b1020]/70 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/75">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
          <span className="truncate">{t.examples.badge}<span className="hidden sm:inline">: {items[active].title}</span></span>
        </span>
      </div>
    </div>
  );
};
