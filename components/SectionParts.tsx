import React from 'react';
import { useReveal } from '../hooks/useReveal';

/** Sektions-Headline mit Zeilen-Reveal (aus jpr-prototyp.html .sec-title). */
export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useReveal<HTMLHeadingElement>();
  return (
    <h2
      ref={ref}
      className={`font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px] sec-title-line ${className ?? ''}`}
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

/** [01] Leistungen — Grid-Zelle mit Reveal. */
export const ServiceCell: React.FC<{ idx: string; title: string; desc: string }> = ({ idx, title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-10">
      <div className="font-mono text-[14px] text-accent mb-[18px]">{idx}</div>
      <h3 className="font-syne font-bold text-[28px] mb-3">{title}</h3>
      <p className="text-[17px] leading-[1.6] text-muted">{desc}</p>
    </div>
  );
};

/** Prozess — Schritt mit großer Zahl. */
export const ProcessStep: React.FC<{ n: string; title: string; desc: string }> = ({ n, title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal group bg-ink hover:bg-panel transition-colors p-10 relative">
      <div
        className="font-syne font-extrabold text-[64px] leading-none mb-6 text-accent transition-opacity opacity-90 group-hover:opacity-100"
      >
        {n}
      </div>
      <h3 className="font-syne font-bold text-[22px] mb-3">{title}</h3>
      <p className="text-[17px] leading-[1.6] text-muted">{desc}</p>
    </div>
  );
};
