import { useEffect, useRef } from 'react';

/**
 * Magnetische Buttons aus jpr-prototyp.html <script>. Nur bei
 * pointer:fine und ohne reduced-motion.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return;

    const handleMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    };
    const handleLeave = () => {
      el.style.transition = 'transform .5s cubic-bezier(.19,1,.22,1), background .25s, color .25s';
      el.style.transform = '';
      window.setTimeout(() => {
        el.style.transition = '';
      }, 500);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return ref;
}
