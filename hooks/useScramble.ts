import { useEffect, useRef } from 'react';

/**
 * Scramble-Effekt aus jpr-prototyp.html <script>. Läuft nur bei
 * pointer:fine und ohne reduced-motion. Zwei Trigger-Modi:
 * - 'hover': scrambelt bei mouseenter (Nav-Links)
 * - 'reveal': scrambelt automatisch, sobald das Element sichtbar wird (Eyebrows)
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01↑→↓/';

function scramble(el: HTMLElement) {
  if ((el as HTMLElement & { __scr?: boolean }).__scr) return;
  (el as HTMLElement & { __scr?: boolean }).__scr = true;
  const original = el.textContent || '';
  const len = original.length;
  let i = 0;
  const t = window.setInterval(() => {
    i += 1.4;
    let out = '';
    for (let j = 0; j < len; j++) {
      out += j < i ? original[j] : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    if (i >= len) {
      window.clearInterval(t);
      el.textContent = original;
      (el as HTMLElement & { __scr?: boolean }).__scr = false;
    }
  }, 30);
}

export function useScramble<T extends HTMLElement = HTMLElement>(mode: 'hover' | 'reveal' = 'hover') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return;

    if (mode === 'hover') {
      const handler = () => scramble(el);
      el.addEventListener('mouseenter', handler);
      return () => el.removeEventListener('mouseenter', handler);
    }

    // mode === 'reveal': scrambelt einmalig, sobald sichtbar
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble(el);
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  return ref;
}
