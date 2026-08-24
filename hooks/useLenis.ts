import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth Scroll im NATIVEN Modus (kein transform-Wrapper um <main>),
 * damit IntersectionObserver-basierte Reveals zuverlässig bleiben.
 * Deaktiviert bei prefers-reduced-motion.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
