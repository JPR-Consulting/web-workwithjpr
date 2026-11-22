import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { prefersReducedMotion, useSeen } from '../../hooks/useSeen';
import { dresden as t } from '../../content/dresden-copy';

/** Gemeinsame Bausteine der Seite /tom-nowak (v3): Reveal, Überschriften, Hauptknopf, Geräte-Rahmen, Zählwerk. */

export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveal-Hülle; `delay` in ms staffelt Gruppen. Das .in setzt useScrollMotion (mit Fallback nach 2,5 s ohne Eingabe). */
export const Reveal: React.FC<{ className?: string; children: React.ReactNode; as?: 'div' | 'li'; delay?: number; variant?: 'rise' | 'mask' }> = ({
  className = '',
  children,
  as = 'div',
  delay = 0,
  variant = 'rise',
}) => {
  const Tag = as as 'div';
  return (
    <Tag className={`reveal ${variant === 'mask' ? 'dd-mask' : ''} ${className}`} style={delay ? ({ '--d': `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
};

/** Dot + Versalien nur im Hero und im KI-Abschnitt (`strong`); sonst eine ruhige Zeile (Review P2-6). */
export const Eyebrow: React.FC<{ children: React.ReactNode; strong?: boolean }> = ({ children, strong }) =>
  strong ? (
    <div className="inline-flex items-start gap-2.5 font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-accent mb-5">
      <span className="w-1.5 h-1.5 mt-[6px] shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_rgb(var(--c-accent)/0.16)]" aria-hidden="true" />
      {children}
    </div>
  ) : (
    <div className="font-manrope text-[14px] font-semibold tracking-[0.04em] text-muted mb-4">{children}</div>
  );

/** Überschrift, deren Wörter einzeln aus einer Maske steigen, sobald die umgebende .reveal ins Bild kommt. */
export const Words: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(' ').map((w, i, all) => (
      <React.Fragment key={i}>
        <span className="dd-word">
          <span style={{ '--i': i } as React.CSSProperties}>{w}</span>
        </span>
        {i < all.length - 1 ? ' ' : null}
      </React.Fragment>
    ))}
  </>
);

export const Title: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`dd-h text-[clamp(32px,4.2vw,56px)] leading-[1.06] text-ftext [text-wrap:balance] ${className}`}>
    <Words text={children} />
  </h2>
);

/** Hauptknopf: Text rollt beim Überfahren nach oben, Pfeil-Chip dreht sich. Auf Touch normaler Knopf (Text darf umbrechen). */
export const Cta: React.FC<{
  onClick?: () => void;
  children: string;
  className?: string;
  ctaRef?: React.Ref<HTMLButtonElement>;
  magnetic?: boolean;
  type?: 'button' | 'submit';
}> = ({ onClick, children, className = '', ctaRef, magnetic, type = 'button' }) => {
  const mag = useMagnetic<HTMLButtonElement>();
  const setRef = (node: HTMLButtonElement | null) => {
    if (magnetic) (mag as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    if (typeof ctaRef === 'function') ctaRef(node);
    else if (ctaRef) (ctaRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };
  return (
    <button
      ref={setRef}
      type={type}
      onClick={onClick}
      className={`dd-btn dd-roll inline-flex items-center justify-center gap-3 min-h-[56px] max-w-full py-2 pl-6 pr-2 max-[400px]:pl-5 rounded-full font-manrope text-[16px] leading-snug text-center font-bold whitespace-nowrap ${className}`}
    >
      <span className="dd-roll-win min-w-0">
        <span className="dd-roll-in">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className="dd-roll-chip grid place-items-center w-10 h-10 shrink-0 rounded-full bg-white text-[#3d5afe]" aria-hidden="true">
        <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.4} />
      </span>
    </button>
  );
};

/** Browser-Rahmen mit Handy davor: zeigt einen Beispiel-Entwurf auf beiden Geräten. `host` = Name im Adressfeld (bewusst keine Domain). */
export const Devices: React.FC<{ desktop: string; mobile: string; alt: string; host: string; eager?: boolean; high?: boolean; className?: string; phoneRight?: boolean }> = ({
  desktop,
  mobile,
  alt,
  host,
  eager,
  high,
  className = '',
  phoneRight,
}) => (
  <div className={`dd-devices relative ${phoneRight ? 'pr-[5%] pb-[8%]' : 'pl-[9%] pb-[7%]'} ${className}`}>
    <div className="dd-browser">
      <div className="dd-browser-bar flex items-center gap-3 px-3 h-6 md:h-8" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span className="hidden sm:flex flex-1 justify-center">
          <span className="max-w-[85%] truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-[10px] md:text-[11px] font-medium tracking-[0.02em] text-white/45">{host}</span>
        </span>
        <span className="hidden sm:block w-[30px]" />
      </div>
      <div className="overflow-hidden">
        <img
          src={`${desktop}-desktop.webp`}
          alt={alt}
          width={1200}
          height={750}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={high ? 'high' : undefined}
          decoding="async"
          className="dd-shot block w-full h-auto"
        />
      </div>
    </div>
    <div className={`dd-phone absolute bottom-0 ${phoneRight ? 'right-0 w-[26%]' : 'left-0 w-[27%]'}`}>
      <img src={`${mobile}-mobile.webp`} alt="" width={585} height={1266} loading={eager ? 'eager' : 'lazy'} decoding="async" className="block w-full h-auto rounded-[15px] md:rounded-[18px]" />
    </div>
  </div>
);

/** Kleines rundes Foto von Tom mit Akzent-Ring. `alt` leer, wenn der Name direkt daneben steht und das Foto schon einmal beschrieben ist. */
export const Avatar: React.FC<{ size?: number; alt?: string; eager?: boolean }> = ({ size = 44, alt = '', eager }) => (
  <span className="relative inline-block shrink-0 rounded-full p-[1.5px] bg-[linear-gradient(140deg,#c9d6ff,#3d5afe_55%,#1b2a7a)]" style={{ width: size, height: size }}>
    <img
      src={t.tom.photo.avatar}
      alt={alt}
      width={160}
      height={160}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="block w-full h-full rounded-full object-cover bg-[#0b1020]"
    />
  </span>
);

export const MailLink: React.FC<{ className?: string; label?: boolean }> = ({ className = '', label }) => (
  <a href={`mailto:${t.tom.email}`} className={`dd-link inline-flex items-center gap-2 min-h-[44px] font-semibold text-ftext hover:text-accent transition-colors ${className}`}>
    <Mail className="w-4 h-4 text-accent shrink-0" strokeWidth={2} aria-hidden="true" />
    {label && <span className="sr-only">{t.tom.emailLabel}: </span>}
    <span className="break-all">{t.tom.email}</span>
  </a>
);

/** Text mit E-Mail-Adressen darin: die Adressen werden zu mailto-Links. */
export const withMail = (text: string) =>
  text.split(/([\w.+-]+@[\w-]+\.[\w.]+?)(?=[.\s]|$)/).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

/**
 * Zählwerk: „48 h“, „206“, „100 %“ zählen beim Erscheinen von 0 hoch. Der Endwert steht von Anfang an im Text
 * (Prerender, ohne JS, Fallback ohne Eingabe, reduzierte Bewegung); nur im Browser startet das Zählen bei 0.
 */
export const Count: React.FC<{ value: string; duration?: number; className?: string }> = ({ value, duration = 1500, className }) => {
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : 0;
  const rest = m ? m[2] : value;
  const ref = useRef<HTMLSpanElement>(null);
  const { seen, instant } = useSeen(ref, 0.9);
  const [n, setN] = useState(target);
  const armed = useRef(false);

  useEffect(() => {
    if (!m || target === 0 || prefersReducedMotion()) return;
    setN(0);
    armed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!armed.current || !seen) return;
    if (instant) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, instant]);

  if (!m) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {n}
      {rest}
    </span>
  );
};

