import { useEffect, type RefObject } from 'react';

/**
 * Weiches kobaltblaues Licht, das dem Zeiger auf dunklen Flächen folgt (Elemente mit [data-cursor-light]).
 * Setzt --cx/--cy/--co an jedem Element (Position weich nachgezogen, 0,12 je Bild). Nur Maus, nicht bei „Bewegung reduzieren“.
 */
export function useCursorLight(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(host.querySelectorAll<HTMLElement>('[data-cursor-light]'));
    type S = { el: HTMLElement; x: number; y: number; tx: number; ty: number; o: number; to: number };
    const st: S[] = els.map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0 }));
    let raf = 0;
    const loop = () => {
      let busy = false;
      for (const s of st) {
        s.x += (s.tx - s.x) * 0.12;
        s.y += (s.ty - s.y) * 0.12;
        s.o += (s.to - s.o) * 0.1;
        s.el.style.setProperty('--cx', `${s.x.toFixed(1)}px`);
        s.el.style.setProperty('--cy', `${s.y.toFixed(1)}px`);
        s.el.style.setProperty('--co', s.o.toFixed(3));
        if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.4 || Math.abs(s.to - s.o) > 0.01) busy = true;
      }
      raf = busy ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      for (const s of st) {
        const r = s.el.getBoundingClientRect();
        const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right;
        if (inside) {
          if (s.to === 0) { s.x = e.clientX - r.left; s.y = e.clientY - r.top; }
          s.tx = e.clientX - r.left;
          s.ty = e.clientY - r.top;
        }
        s.to = inside ? 1 : 0;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      st.forEach((s) => (s.to = 0));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [root]);
}
