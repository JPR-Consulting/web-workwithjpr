import { useEffect } from 'react';

/**
 * Eine rAF-Schleife für alle scroll-gebundenen Effekte einer Seite (Toms Seite /tom-nowak).
 * Läuft nur, wenn gescrollt oder die Größe geändert wurde, liest Positionen per
 * getBoundingClientRect und schreibt ausschließlich transform / CSS-Variablen (kein Layout).
 * Kein IntersectionObserver: bleibt auch korrekt, falls ein Elternteil transformiert ist (Safari).
 *
 *  .reveal                 bekommt einmalig .in, sobald es ins Bild kommt (ersetzt useReveal auf dieser Seite)
 *  [data-parallax="0.12"]  verschiebt das Element um (Abstand zur Bildmitte × Faktor) in Y
 *  [data-progress]         setzt --p (0…1) am Element; Kinder [data-step] bekommen .on, sobald die Füllung sie erreicht
 *  [data-page-progress]    setzt --page-p (0…1) = Lesefortschritt der Seite
 *
 * prefers-reduced-motion: keine Parallaxe, Fortschritt sofort voll, alle Schritte .on.
 */
const isHorizontal = (p: HTMLElement) => (p.dataset.progress === 'auto' ? window.innerWidth >= 1280 : p.dataset.progress === 'x');

/** Lage eines Elements innerhalb eines Vorfahren aus offsetTop/offsetLeft: ohne transform, also unabhängig von laufenden Reveals. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  if (n !== ancestor) {
    // ancestor ist kein offsetParent (nicht positioniert): auf dessen eigene Lage zurückrechnen
    x -= ancestor.offsetLeft;
    y -= ancestor.offsetTop;
  }
  return { x, y };
}

/** Misst die Mittelpunkte der [data-step]-Kreise, setzt --rail-start / --rail-len und liefert je Schritt seinen Anteil (0…1). */
function measureRail(p: HTMLElement, horizontal: boolean) {
  const steps = Array.from(p.querySelectorAll<HTMLElement>('[data-step]'));
  const centers = steps.map((s) => {
    const o = offsetWithin(s, p);
    return horizontal ? o.x + s.offsetWidth / 2 : o.y + s.offsetHeight / 2;
  });
  const first = centers[0] ?? 0;
  const len = Math.max(1, (centers[centers.length - 1] ?? 1) - first);
  p.style.setProperty('--rail-start', `${first.toFixed(1)}px`);
  p.style.setProperty('--rail-len', `${len.toFixed(1)}px`);
  const at = steps.map((s, i) => [s, (centers[i] - first) / len] as [HTMLElement, number]);
  return { first, len, at };
}

export function useScrollMotion(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallax = Array.from(el.querySelectorAll<HTMLElement>('[data-parallax]'));
    const progress = Array.from(el.querySelectorAll<HTMLElement>('[data-progress]'));
    const pageBars = Array.from(el.querySelectorAll<HTMLElement>('[data-page-progress]'));
    let pending = Array.from(el.querySelectorAll<HTMLElement>('.reveal:not(.in)'));

    if (reduced) {
      pending.forEach((r) => r.classList.add('in'));
      const still = () =>
        progress.forEach((p) => {
          measureRail(p, isHorizontal(p));
          p.style.setProperty('--p', '1');
          p.querySelectorAll('[data-step]').forEach((s) => s.classList.add('on'));
        });
      still();
      pageBars.forEach((b) => b.style.setProperty('--page-p', '0'));
      window.addEventListener('resize', still);
      return () => window.removeEventListener('resize', still);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (pending.length) {
        // einmaliger Reveal, sobald die Oberkante 88 % der Bildhöhe erreicht (auch wenn schon vorbeigescrollt)
        pending = pending.filter((r) => {
          if (r.getBoundingClientRect().top < vh * 0.88) {
            r.classList.add('in');
            return false;
          }
          return true;
        });
      }
      for (const p of parallax) {
        const r = p.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const f = parseFloat(p.dataset.parallax || '0.1');
        // eigene Verschiebung herausrechnen, sonst schaukelt sich der Wert auf
        const prev = parseFloat(p.dataset.py || '0');
        const y = (r.top - prev + r.height / 2 - vh / 2) * f;
        p.dataset.py = String(y);
        p.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }
      for (const p of progress) {
        const r = p.getBoundingClientRect();
        const horizontal = isHorizontal(p);
        const { first, len, at } = measureRail(p, horizontal);
        // Vertikal: die Linie wächst mit der Stelle bei 62 % der Bildhöhe mit, ein Schritt leuchtet, wenn sie ihn erreicht.
        // Horizontal (breite Bildschirme): füllt sich über 35 % Bildhöhe, sobald die Liste bei 80 % ist.
        const v = horizontal
          ? (vh * 0.8 - r.top) / Math.max(1, vh * 0.35)
          : (vh * 0.62 - (r.top + first)) / Math.max(1, len);
        const c = Math.min(1, Math.max(0, v));
        p.style.setProperty('--p', c.toFixed(4));
        at.forEach(([s, a]) => s.classList.toggle('on', c >= a - 0.002));
      }
      if (pageBars.length) {
        const max = document.documentElement.scrollHeight - vh;
        const v = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        pageBars.forEach((b) => b.style.setProperty('--page-p', v.toFixed(4)));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [root]);
}
