import React, { useState, useRef, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useCopy } from '../i18n';

interface Props {
  /** Startseite: Anker-ID und Nummern-Eyebrow. */
  onHome?: boolean;
}

const FAQSection: React.FC<Props> = ({ onHome }) => {
  const t = useCopy().faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const eyebrowRef = useReveal<HTMLDivElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  const listRef = useReveal<HTMLDivElement>();

  return (
    <section id={onHome ? 'faq' : undefined} className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      <div ref={eyebrowRef} className="reveal font-mono text-[14px] text-accent uppercase mb-5">
        {onHome ? t.eyebrow : 'FAQ'}
      </div>
      <h2
        ref={titleRef}
        className="font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px] sec-title-line"
      >
        <span>{t.title}</span>
      </h2>

      <div ref={listRef} className="reveal border-t border-line max-w-[980px]">
        {t.items.map((faq, idx) => (
          <FaqItem
            key={faq.q}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </section>
  );
};

/** Akkordeon-Eintrag (+ dreht zu × via rotate 45deg, max-height-Transition). */
const FaqItem: React.FC<{ q: string; a: string; isOpen: boolean; onToggle: () => void }> = ({ q, a, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  // Hoehe messen statt beim ersten Render zu raten: scrollHeight ist vor dem
  // Layout 0, wodurch die Antwort zugeklappt blieb. Auch bei Resize neu messen.
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [a]);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center gap-6 py-[26px] bg-transparent border-none cursor-pointer text-left font-syne font-bold text-xl text-ftext hover:text-accent transition-colors"
      >
        {q}
        <span
          className="font-mono text-xl text-accent flex-shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
        style={{ maxHeight: isOpen ? `${height || 600}px` : '0px' }}
      >
        <div ref={contentRef}>
          <p className="pb-[26px] pr-10 text-[17px] leading-[1.7] text-muted max-w-[760px]">{a}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
