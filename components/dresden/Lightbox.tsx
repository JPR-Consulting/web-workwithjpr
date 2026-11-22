import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { dresden as t } from '../../content/dresden-copy';

type Item = (typeof t.examples.items)[number];

/** Großansicht eines Beispiel-Entwurfs: Rechner- und Handy-Bild nebeneinander. Esc, Klick daneben oder Knopf schließen; Fokus kehrt zurück. */
const Lightbox: React.FC<{ item: Item; onClose: () => void }> = ({ item, onClose }) => {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // Fokus bleibt auf dem Schließen-Knopf (einziges bedienbares Element)
        e.preventDefault();
        closeBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', key);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${t.examples.badge}: ${item.title}`}
      className="dd-lightbox fixed inset-0 z-[60] overflow-y-auto bg-[#04060c]/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-16 md:px-10">
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label={t.ui.lightboxClose}
          className="fixed right-4 top-4 md:right-8 md:top-8 z-[1] grid place-items-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={2.2} aria-hidden="true" />
        </button>
        <div className="w-full max-w-[1280px] flex flex-col md:flex-row md:items-end gap-6 md:gap-8" onClick={(e) => e.stopPropagation()}>
          <figure className="m-0 min-w-0 md:flex-1">
            <div className="dd-browser">
              <div className="dd-browser-bar flex items-center gap-3 px-3 h-7 md:h-8" aria-hidden="true">
                <span className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                </span>
              </div>
              <img src={`${item.img}-desktop.webp`} alt={`${item.title}, ${t.ui.lightboxDesktop}`} width={1200} height={750} decoding="async" className="block w-full h-auto" />
            </div>
          </figure>
          <figure className="m-0 mx-auto md:mx-0 w-[56%] max-w-[260px] md:w-[22%] md:max-w-none md:min-w-[190px] shrink-0">
            <div className="dd-phone">
              <img src={`${item.img}-mobile.webp`} alt={`${item.title}, ${t.ui.lightboxMobile}`} width={585} height={1266} decoding="async" className="block w-full h-auto rounded-[15px] md:rounded-[18px]" />
            </div>
          </figure>
        </div>
        <p className="mt-6 text-center text-[15px] text-white/80">
          <span className="font-semibold text-white">{item.title}</span> · {item.tag}
        </p>
      </div>
    </div>
  );
};

export default Lightbox;
