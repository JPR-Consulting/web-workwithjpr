import { useEffect, useRef } from 'react';

/**
 * Portiert aus jpr-prototyp.html: Elemente bekommen die Klasse `.in`,
 * sobald sie zu ~88% der Viewporthöhe sichtbar sind. Danach wird nicht
 * mehr beobachtet (einmaliger Reveal, wie im Prototyp).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
