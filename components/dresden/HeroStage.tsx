import React, { useEffect, useRef, useState } from 'react';
import { Devices, finePointer } from './parts';
import { prefersReducedMotion } from '../../hooks/useSeen';
import { dresden as t } from '../../content/dresden-copy';

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
      <div className="mt-3 md:mt-5 flex items-center">
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
      </div>
    </div>
  );
};
