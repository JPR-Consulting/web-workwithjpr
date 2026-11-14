import React from 'react';
import { useReveal } from '../hooks/useReveal';

/** Sektions-Headline mit Zeilen-Reveal (aus jpr-prototyp.html .sec-title). */
export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useReveal<HTMLHeadingElement>();
  return (
    <h2
      ref={ref}
      className={`font-syne font-extrabold uppercase text-[clamp(18px,5.4vw,34px)] md:text-[clamp(34px,4.5vw,60px)] hyphens-manual tracking-[-0.015em] leading-[1.02] mb-[52px] sec-title-line ${className ?? ''}`}
    >
      <span>{children}</span>
    </h2>
  );
};

export const Eyebrow: React.FC<{ children: string }> = ({ children }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal font-mono text-[14px] text-accent uppercase mb-5">
      {children}
    </div>
  );
};

/** Grid-Zelle mit Reveal (Branchen-Landingpages). */
export const ServiceCell: React.FC<{ idx: string; title: string; desc: string }> = ({ idx, title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-10">
      <div className="font-mono text-[14px] text-accent mb-[18px]">{idx}</div>
      <h3 className="font-syne font-bold text-[clamp(20px,6.4vw,28px)] sm:text-[28px] break-words hyphens-auto mb-3">{title}</h3>
      <p className="text-[17px] leading-[1.6] text-muted">{desc}</p>
    </div>
  );
};

/** [01] Leistungen — Listenzeile: Titel links, Beschreibung rechts, Haarlinie dazwischen. */
export const ServiceRow: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-2 md:gap-10 py-6 md:py-7 border-b border-line">
      <h3 className="font-syne font-bold text-[20px] md:text-[22px] leading-tight hyphens-manual">{title}</h3>
      <p className="text-[17px] leading-[1.6] text-muted max-w-[720px]">{desc}</p>
    </div>
  );
};

/** Prozess — Schritt mit großer Zahl. */
export const ProcessStep: React.FC<{ n: string; title: string; desc: string }> = ({ n, title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal group bg-ink hover:bg-panel transition-colors p-6 md:p-10 relative grid grid-cols-[64px_minmax(0,1fr)] md:block gap-x-2">
      {/* Handy: Zahl klein links neben dem Text (kompakt), ab md groß darüber */}
      <div
        className="font-syne font-extrabold text-[28px] md:text-[64px] leading-none pt-0.5 md:pt-0 md:mb-6 text-accent transition-opacity opacity-90 group-hover:opacity-100"
      >
        {n}
      </div>
      <div>
        <h3 className="font-syne font-bold text-[20px] md:text-[22px] mb-2 md:mb-3">{title}</h3>
        <p className="text-[16px] md:text-[17px] leading-[1.6] text-muted">{desc}</p>
      </div>
    </div>
  );
};
