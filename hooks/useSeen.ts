import { useEffect, useState, type RefObject } from 'react';

/**
 * Fallback für alle Reveals auf Toms Seite (/tom-nowak): Passiert 2,5 s lang keine Eingabe (Scrollen, Maus, Touch, Taste),
 * ist niemand da, der etwas sieht, oder der Beobachter feuert nie (Screenshot, Vorschau, Roboter). Dann soll der Inhalt
 * vollständig stehen, nicht unsichtbar bleiben. Auch beim Drucken. Gibt eine Aufräumfunktion zurück.
 */
export function onIdleFallback(cb: () => void, ms = 2500): () => void {
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    cb();
  };
  const events = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'] as const;
  const cancel = () => {
    window.clearTimeout(timer);
    events.forEach((e) => window.removeEventListener(e, cancel));
  };
  const timer = window.setTimeout(() => {
    events.forEach((e) => window.removeEventListener(e, cancel));
    fire();
  }, ms);
  events.forEach((e) => window.addEventListener(e, cancel, { passive: true, once: true }));
  window.addEventListener('beforeprint', fire);
  return () => {
    done = true;
    cancel();
    window.removeEventListener('beforeprint', fire);
  };
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * `seen` wird einmalig true, sobald das Element ins Bild kommt (Oberkante über `at` × Bildhöhe).
 * `instant` ist true, wenn der Fallback oder „Bewegung reduzieren“ greift: Animationen dann gleich im Endzustand zeigen.
 */
export function useSeen<T extends HTMLElement>(ref: RefObject<T | null>, at = 0.85) {
  const [state, setState] = useState({ seen: false, instant: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setState({ seen: true, instant: true });
      return;
    }
    let raf = 0;
    let stopped = false;
    const check = () => {
      raf = 0;
      if (stopped) return;
      if (el.getBoundingClientRect().top < window.innerHeight * at) {
        stopped = true;
        setState((s) => ({ ...s, seen: true }));
        cleanup();
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const stopIdle = onIdleFallback(() => {
      stopped = true;
      setState({ seen: true, instant: true });
      cleanup();
    });
    const cleanup = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      stopIdle();
      if (raf) cancelAnimationFrame(raf);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      stopped = true;
      cleanup();
    };
  }, [ref, at]);
  return state;
}
