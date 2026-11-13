import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Bot, CalendarX, Check, Mail, Mic, MicOff, Phone, Plus, Quote } from 'lucide-react';
import CookieBanner from './CookieBanner';
import { useMagnetic } from '../hooks/useMagnetic';
import { useScrollMotion } from '../hooks/useScrollMotion';
import { dresden as t } from '../content/dresden-copy';
import { copy } from '../content/site-copy';

interface Props {
  onRequestDraft: (website?: string) => void;
}

/**
 * Landingpage /tom-nowak (früher /dresden): Toms Visitenkarte für Betriebe in Dresden (Sie-Form, JPR Consulting GmbH).
 * v2 (02.11.2026): kühles Tinten-Dunkel + helle Sektionen, ein Akzent (Kobaltblau), Satoshi-Überschriften,
 * kursives Serif-Akzentwort. Kein Braun/Gold/Beige (Jan). Farben über die CSS-Variablen in index.css
 * (html.theme-dresden, .dd-paper). Alle Knöpfe öffnen den Entwurf-Dialog.
 * v3 (13.11.2026): Toms Foto + E-Mail, ruhige Bewegung: Wort-Aufstieg der Überschriften, gestaffelte Reveals,
 * Tiefe beim Überfahren der Beispiele, Fortschrittslinie im Ablauf. Alles über useScrollMotion (eine rAF-Schleife),
 * bei prefers-reduced-motion statisch und vollständig sichtbar.
 */

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveal-Hülle; `delay` in ms staffelt Gruppen. Das .in setzt useScrollMotion. */
const Reveal: React.FC<{ className?: string; children: React.ReactNode; as?: 'div' | 'li'; delay?: number; variant?: 'rise' | 'mask' }> = ({
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

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="inline-flex items-center gap-2.5 font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-accent mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgb(var(--c-accent)/0.16)]" aria-hidden="true" />
    {children}
  </div>
);

/** Überschrift, deren Wörter einzeln aus einer Maske steigen, sobald die umgebende .reveal ins Bild kommt. */
const Words: React.FC<{ text: string }> = ({ text }) => (
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

const Title: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`dd-h text-[clamp(32px,4.2vw,56px)] leading-[1.06] text-ftext [text-wrap:balance] ${className}`}>
    <Words text={children} />
  </h2>
);

/** Hauptknopf: Text rollt beim Überfahren nach oben, Pfeil-Chip dreht sich. Auf Touch normaler Knopf (Text darf umbrechen). */
const Cta: React.FC<{ onClick: () => void; children: string; className?: string; ctaRef?: React.Ref<HTMLButtonElement>; magnetic?: boolean }> = ({
  onClick,
  children,
  className = '',
  ctaRef,
  magnetic,
}) => {
  const mag = useMagnetic<HTMLButtonElement>();
  const setRef = (node: HTMLButtonElement | null) => {
    if (magnetic) (mag as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    if (typeof ctaRef === 'function') ctaRef(node);
    else if (ctaRef) (ctaRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };
  return (
    <button
      ref={setRef}
      type="button"
      onClick={onClick}
      className={`dd-btn dd-roll inline-flex items-center justify-center gap-3 min-h-[56px] max-w-full py-2 pl-6 pr-2 rounded-full font-manrope text-[16px] leading-snug text-center font-bold ${className}`}
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
const Devices: React.FC<{ desktop: string; mobile: string; alt: string; host: string; eager?: boolean; className?: string }> = ({ desktop, mobile, alt, host, eager, className = '' }) => (
  <div className={`dd-devices relative pl-[9%] pb-[7%] ${className}`}>
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
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          className="dd-shot block w-full h-auto"
        />
      </div>
    </div>
    <div className="dd-phone absolute left-0 bottom-0 w-[27%]">
      <img src={`${mobile}-mobile.webp`} alt="" width={585} height={1266} loading={eager ? 'eager' : 'lazy'} decoding="async" className="block w-full h-auto rounded-[15px] md:rounded-[18px]" />
    </div>
  </div>
);

/** Kleines rundes Foto von Tom mit Akzent-Ring. `alt` leer, wenn der Name direkt daneben steht und das Foto schon einmal beschrieben ist. */
const Avatar: React.FC<{ size?: number; alt?: string; eager?: boolean }> = ({ size = 44, alt = '', eager }) => (
  <span className="relative shrink-0 rounded-full p-[1.5px] bg-[linear-gradient(140deg,#c9d6ff,#3d5afe_55%,#1b2a7a)]" style={{ width: size, height: size }}>
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

const MailLink: React.FC<{ className?: string; label?: boolean }> = ({ className = '', label }) => (
  <a href={`mailto:${t.tom.email}`} className={`dd-link inline-flex items-center gap-2 min-h-[44px] font-semibold text-ftext hover:text-accent transition-colors ${className}`}>
    <Mail className="w-4 h-4 text-accent shrink-0" strokeWidth={2} aria-hidden="true" />
    {label && <span className="sr-only">{t.tom.emailLabel}: </span>}
    <span className="break-all">{t.tom.email}</span>
  </a>
);

/** Text mit E-Mail-Adressen darin: die Adressen werden zu mailto-Links. */
const withMail = (text: string) =>
  text.split(/([\w.+-]+@[\w-]+\.[\w.]+?)(?=[.\s]|$)/).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

/** Beispiel-Bühne mit Tiefe: kippt leicht zum Zeiger, Licht folgt dem Zeiger (nur Maus, nicht bei reduzierter Bewegung). */
const TiltStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
      el.style.setProperty('--lx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--ly', `${(y * 100).toFixed(1)}%`);
    };
    const leave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);
  return (
    <div ref={ref} className="dd-tilt">
      <div className="dd-stage dd-tilt-in relative rounded-[22px] px-5 pt-7 pb-6 md:px-7 ring-1 ring-black/5">{children}</div>
    </div>
  );
};

const DresdenPage: React.FC<Props> = ({ onRequestDraft }) => {
  const [heroIn, setHeroIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroCta = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const open = () => onRequestDraft();
  const pricing = copy.de.pricing;
  const showSticky = pastHero && !atEnd;

  useScrollMotion(rootRef);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeroIn(true)));
    // Navigation-Hintergrund, feste Leiste (Handy): an Positionen gebunden, ohne IntersectionObserver
    let tick = 0;
    const onScroll = () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        setScrolled(window.scrollY > 12);
        const cta = heroCta.current?.getBoundingClientRect();
        setPastHero(!!cta && cta.bottom < 0);
        const end = endRef.current?.getBoundingClientRect();
        setAtEnd(!!end && end.top < window.innerHeight * 0.75);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      if (tick) cancelAnimationFrame(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Hero: Geräte reagieren ruhig auf den Zeiger (Browser und Handy auf zwei Ebenen), weich nachgezogen
  useEffect(() => {
    const el = heroRef.current;
    if (!el || !finePointer()) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty('--mx', x.toFixed(4));
      el.style.setProperty('--my', y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toExamples = () => document.getElementById('beispiele')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const portrait = t.tom.photo.cutout;

  return (
    <div ref={rootRef} className="dd bg-ink text-ftext font-manrope overflow-x-clip selection:bg-[#3d5afe] selection:text-white">
      {/* Navigation */}
      <nav
        className={`dd-nav fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-300 border-b ${
          scrolled ? 'bg-ink/[0.94] backdrop-blur-xl border-line' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 md:px-10 h-[64px] md:h-[76px]">
          <a href="/" className="flex items-center gap-3 min-w-0">
            <span className="font-syne font-extrabold text-[12px] min-[360px]:text-[14px] min-[400px]:text-[15px] md:text-[18px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap">
              JPR <span className="text-accent">Studio</span>&reg;
            </span>
            <span className="hidden min-[400px]:inline w-px h-4 bg-line" aria-hidden="true" />
            <span className="hidden min-[400px]:inline font-manrope text-[13px] md:text-[14px] font-medium tracking-[0.08em] uppercase text-muted">{t.nav.place}</span>
          </a>
          <button type="button" onClick={open} className="dd-btn inline-flex items-center gap-2 h-10 md:h-11 px-3 min-[360px]:px-4 md:px-5 rounded-full font-manrope text-[12px] min-[360px]:text-[13px] md:text-[14px] font-bold whitespace-nowrap shrink-0">
            {t.nav.cta}
            <ArrowRight className="hidden sm:block w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
        {/* Lesefortschritt: feine Akzentlinie unter der Leiste */}
        <span data-page-progress className={`dd-page-bar absolute left-0 right-0 bottom-[-1px] h-px transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
      </nav>

      <main>
        {/* Hero */}
        <header ref={heroRef} className="dd-hero relative isolate overflow-hidden">
          <div className="dd-hero-glow absolute inset-0 -z-10 pointer-events-none" data-parallax="0.18" aria-hidden="true" />
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-[92px] md:pt-[148px] pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] gap-12 lg:gap-12 items-center">
            <div className="min-w-0">
              <div className={`hero-foot dd-blur ${heroIn ? 'in' : ''}`} style={{ '--hd': '0s' } as React.CSSProperties}>
                <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="dd-h text-[clamp(38px,5vw,72px)] leading-[1.02] text-ftext">
                <span className={`hero-line ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[0]}</span></span>
                <span className={`hero-line hero-line-2 ${heroIn ? 'in' : ''}`}>
                  <span>
                    <em className="dd-em">{t.hero.h1[1]}</em> {t.hero.h1[2]}
                  </span>
                </span>
              </h1>
              <p style={{ '--hd': '.32s' } as React.CSSProperties} className={`hero-foot dd-blur ${heroIn ? 'in' : ''} mt-6 md:mt-8 max-w-[540px] text-[17px] md:text-[19px] leading-[1.6] text-muted`}>{t.hero.sub}</p>
              <div style={{ '--hd': '.46s' } as React.CSSProperties} className={`hero-foot dd-blur ${heroIn ? 'in' : ''} mt-8 md:mt-10 flex flex-wrap items-center gap-x-7 gap-y-4`}>
                <Cta onClick={open} ctaRef={heroCta} magnetic className="w-full sm:w-auto">{t.hero.cta}</Cta>
                <button type="button" onClick={toExamples} className="inline-flex items-center gap-2 min-h-[44px] font-manrope text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                  {t.hero.secondary}
                  <ArrowDown className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
              <div className={`hero-proof ${heroIn ? 'in' : ''} mt-10 md:mt-12 pt-6 border-t border-line flex flex-col gap-5`}>
                <div className="flex items-center gap-4">
                  <Avatar size={48} alt={t.tom.photo.alt} eager />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[17px] leading-tight tracking-[-0.01em] text-ftext">{t.tom.name}</div>
                    <div className="text-[14px] text-muted">{t.tom.role}</div>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted list-none p-0 m-0">
                  {t.hero.proofs.map((p) => (
                    <li key={p} className="inline-flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent shrink-0" strokeWidth={2.4} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ '--hd': '.2s' } as React.CSSProperties} className={`hero-foot dd-settle ${heroIn ? 'in' : ''} min-w-0 relative`}>
              <Devices desktop="/dresden/beispiel-carhifi" mobile="/dresden/beispiel-shk" host="Elbklang Car-HiFi" alt={t.hero.deviceAlt} eager className="dd-hero-devices xl:w-[112%]" />
              <span className="absolute right-3 -bottom-1 md:right-4 md:bottom-2 xl:right-[-8%] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/80 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/75">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                {t.examples.badge}
              </span>
            </div>
          </div>
        </header>

        {/* Zielgruppen-Leiste */}
        <section aria-label={t.audience.label} className="border-y border-line bg-panel/40">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-5 flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-dim">{t.audience.label}</span>
            {t.audience.items.map((a, i) => (
              <span key={a} className="inline-flex items-center gap-8 font-display font-bold text-[18px] md:text-[21px] tracking-[-0.02em] text-ftext">
                {i > 0 && <span className="hidden md:inline w-1 h-1 rounded-full bg-accent" aria-hidden="true" />}
                {a}
              </span>
            ))}
          </div>
        </section>

        {/* Was die Website erledigt */}
        <section className="dd-paper">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32">
            <Reveal>
              <Eyebrow>{t.outcomes.eyebrow}</Eyebrow>
              <Title className="max-w-[900px]">{t.outcomes.title}</Title>
            </Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {t.outcomes.items.map((o, i) => (
                <Reveal key={o.title} delay={i * 110} className="dd-card rounded-[20px] border border-line bg-panel p-7 md:p-8 shadow-[0_1px_2px_rgba(10,14,26,0.04)]">
                  <div className="grid place-items-center w-11 h-11 rounded-full bg-accent/[0.08] text-accent font-display font-bold text-[15px] mb-7 tabular-nums">0{i + 1}</div>
                  <h3 className="dd-h text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.025em] mb-3 text-ftext">{o.title}</h3>
                  <p className="text-[16px] md:text-[17px] leading-[1.65] text-muted">{o.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* KI-Assistent (USP) */}
        <section className="relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-14 lg:gap-20 items-start">
            <Reveal>
              <Eyebrow>{t.voice.eyebrow}</Eyebrow>
              <Title>{t.voice.title}</Title>
              <p className="mt-6 text-[17px] md:text-[19px] leading-[1.65] text-muted max-w-[580px]">{t.voice.intro}</p>
              <ul className="mt-10 border-t border-line list-none p-0">
                {t.voice.niches.map((n) => (
                  <li key={n.label} className="grid grid-cols-[96px_1fr] md:grid-cols-[130px_1fr] gap-4 py-5 border-b border-line">
                    <span className="font-manrope text-[13px] font-semibold uppercase tracking-[0.14em] text-accent pt-1">{n.label}</span>
                    <span>
                      <span className="block font-display font-bold text-[20px] leading-tight tracking-[-0.02em] text-ftext mb-1">{n.title}</span>
                      <span className="block text-[16px] leading-[1.6] text-muted">{n.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 list-none p-0">
                {t.voice.rules.map((r, i) => {
                  const Icon = [Bot, MicOff, CalendarX][i];
                  return (
                    <li key={r} className="flex items-start gap-3 text-[15px] leading-[1.5] text-ftext">
                      <Icon className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.8} aria-hidden="true" />
                      {r}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-8 text-[15px] text-dim">{t.voice.note}</p>
            </Reveal>

            {/* Gestaltetes Beispiel: Gesprächsausschnitt + Auftragskarte (kein Live-Assistent). Nachrichten kommen nacheinander. */}
            <Reveal delay={120} className="dd-chat lg:sticky lg:top-28">
              <div className="relative rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-5 md:p-7 shadow-[0_40px_90px_-40px_rgba(20,40,140,0.6)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative grid place-items-center w-10 h-10 rounded-full bg-[#3d5afe] text-white" aria-hidden="true">
                    <span className="absolute inset-[-5px] rounded-full border border-[#3d5afe]/50" />
                    <Mic className="w-[18px] h-[18px]" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-ftext">Auftrag per Sprache aufgeben</div>
                    <div className="text-[13px] text-dim">{t.voice.demoLabel}</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6" aria-label="Gesprächsausschnitt (Beispiel)">
                  {t.voice.chat.map((m, i) => (
                    <p
                      key={i}
                      style={{ '--i': i } as React.CSSProperties}
                      className={`dd-msg max-w-[88%] rounded-[16px] px-4 py-3 text-[15px] leading-[1.5] ${
                        m.who === 'ki' ? 'bg-white/[0.06] text-ftext rounded-tl-[4px]' : 'ml-auto bg-[#3d5afe]/[0.22] text-ftext rounded-tr-[4px]'
                      }`}
                    >
                      <span className="sr-only">{m.who === 'ki' ? 'KI-Assistentin: ' : 'Kundin: '}</span>
                      {m.text}
                    </p>
                  ))}
                </div>
                <div className="dd-order rounded-[16px] bg-white text-[#0a0e1a] p-5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.6)]">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.12em]">{t.voice.card.number}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5484d] text-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
                      {t.voice.card.badge}
                    </span>
                  </div>
                  <dl className="divide-y divide-[#e6e9f0] m-0">
                    {t.voice.card.rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-2.5 text-[15px]">
                        <dt className="text-[#5b6478]">{k}</dt>
                        <dd className="m-0 font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Beispiel-Entwürfe */}
        <section id="beispiele" className="dd-paper scroll-mt-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32">
            <Reveal className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,460px)] gap-6 lg:gap-16 items-end">
              <div>
                <Eyebrow>{t.examples.eyebrow}</Eyebrow>
                <Title>{t.examples.title}</Title>
              </div>
              <p className="text-[17px] md:text-[18px] leading-[1.65] text-muted">{t.examples.text}</p>
            </Reveal>
            <ul className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-6 list-none p-0">
              {t.examples.items.map((e, i) => (
                <Reveal as="li" key={e.title} delay={i * 120}>
                  <TiltStage>
                    <Devices desktop={e.img} mobile={e.img} host={e.title} alt={`${t.examples.badge}: ${e.title}`} />
                  </TiltStage>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent/[0.08] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                      {t.examples.badge}
                    </span>
                    <h3 className="dd-h mt-3 text-[23px] leading-tight tracking-[-0.025em] text-ftext">{e.title}</h3>
                    <p className="mt-1 text-[16px] text-muted">{e.tag}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Ansprechpartner + Ablauf */}
        <section>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32">
            <div className="relative overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-8 md:gap-12 lg:gap-16 items-center rounded-[28px] border border-white/10 bg-[radial-gradient(60%_90%_at_0%_0%,rgba(61,90,254,0.16),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-4 sm:p-5 md:p-6 lg:p-7">
              {/* Porträt: freigestellt auf kühlem Lichtschein, Ringe wie ein Ortsmarker */}
              <Reveal variant="mask" className="dd-portrait relative aspect-[4/5] w-full max-w-[440px] mx-auto md:mx-0 rounded-[22px] overflow-hidden">
                <span className="dd-rings absolute inset-0 pointer-events-none" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <div className="absolute inset-x-0 bottom-0">
                  <img
                    src={`${portrait}-800.webp`}
                    srcSet={`${portrait}-480.webp 480w, ${portrait}-800.webp 800w`}
                    sizes="(min-width: 1024px) 440px, (min-width: 768px) 40vw, 88vw"
                    alt={t.tom.photo.alt}
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="dd-portrait-img block w-full h-auto"
                  />
                </div>
                <span className="absolute left-3 bottom-3 md:left-4 md:bottom-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0b1020]/70 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/85">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8fa8ff]" aria-hidden="true" />
                  {t.nav.place}
                </span>
              </Reveal>
              <Reveal delay={140} className="relative min-w-0 px-3 pb-5 sm:px-4 md:px-0 md:pb-0 md:pr-6 lg:pr-10 lg:max-w-[640px]">
                <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-accent mb-3">{t.tom.eyebrow}</div>
                <h2 className="dd-h text-[clamp(30px,3.4vw,44px)] leading-[1.06] text-ftext">
                  <Words text={t.tom.name} />
                  <span className="block font-manrope font-medium tracking-normal text-muted text-[0.5em] mt-2">{t.tom.role}</span>
                </h2>
                <p className="mt-5 text-[17px] leading-[1.65] text-muted max-w-[640px]">{t.tom.text}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Cta onClick={open} className="w-full sm:w-auto">{t.tom.cta}</Cta>
                  {t.tom.phone && (
                    <a href={`tel:${t.tom.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                      <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
                      {t.tom.phone}
                    </a>
                  )}
                  {t.tom.email && <MailLink className="text-[16px]" label />}
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-24 md:mt-32">
              <Eyebrow>{t.process.eyebrow}</Eyebrow>
              <Title>{t.process.title}</Title>
            </Reveal>
            {/* Ablauf: Fortschrittslinie füllt sich beim Scrollen, Schritte leuchten auf, wenn die Linie sie erreicht */}
            <ol data-progress="auto" className="dd-steps relative mt-12 md:mt-16 grid grid-cols-1 xl:grid-cols-4 gap-10 xl:gap-8 list-none p-0 max-w-[720px] xl:max-w-none">
              <span className="dd-rail" aria-hidden="true">
                <span />
              </span>
              {t.process.steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 110} className="relative pl-16 xl:pl-0">
                  <div data-step className="dd-step absolute left-0 top-0 xl:relative xl:mb-6" aria-hidden="true">
                    <span className="grid place-items-center w-10 h-10 rounded-full border font-display font-bold text-[15px] tabular-nums">{i + 1}</span>
                  </div>
                  <div className="sr-only">Schritt {i + 1}</div>
                  <h3 className="dd-h text-[22px] leading-tight tracking-[-0.025em] text-ftext mb-3 pt-1.5 xl:pt-0">{s.title}</h3>
                  <p className="text-[16px] leading-[1.65] text-muted">{s.desc}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Preise (Zahlen aus site-copy, wie auf allen JPR-Seiten) */}
        <section id="preise" className="dd-paper">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32">
            <Reveal>
              <Eyebrow>{t.pricing.eyebrow}</Eyebrow>
              <Title>{t.pricing.title}</Title>
            </Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
              {pricing.tiers.map((tier, i) => (
                <Reveal
                  key={tier.name}
                  delay={i * 110}
                  className={`dd-card relative flex flex-col rounded-[24px] p-7 md:p-9 ${
                    tier.reco
                      ? 'bg-[radial-gradient(80%_60%_at_100%_0%,rgba(61,90,254,0.35),transparent_60%),linear-gradient(180deg,#0f1526,#070a12)] text-white border border-[#0f1526] shadow-[0_30px_70px_-35px_rgba(20,40,140,0.7)]'
                      : 'bg-panel border border-line text-ftext'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.16em]">{tier.name}</span>
                    {tier.reco && <span className="rounded-full bg-[#3d5afe] text-white px-3 py-1 text-[12px] font-bold">Empfohlen</span>}
                  </div>
                  <div className={`mt-2 text-[15px] ${tier.reco ? 'text-[#a3adc2]' : 'text-muted'}`}>{tier.for}</div>
                  <div className="dd-h mt-6 text-[44px] leading-none tracking-[-0.04em] tabular-nums">{tier.price}</div>
                  <ul className="mt-7 space-y-3 list-none p-0 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[16px] leading-[1.45]">
                        <Check className={`w-4 h-4 mt-1 shrink-0 ${tier.reco ? 'text-[#8fa8ff]' : 'text-accent'}`} strokeWidth={2.4} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={open}
                    className={`mt-8 min-h-[52px] rounded-full font-manrope text-[15px] font-bold ${tier.reco ? 'dd-btn' : 'dd-btn-ghost'}`}
                  >
                    {t.pricing.cta}
                  </button>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[15px] text-muted">
              <p>
                {pricing.note}
                <br />
                {t.pricing.voice}
              </p>
              <a href="/preise" className="font-semibold text-accent hover:text-ftext transition-colors py-2">{t.pricing.more}</a>
            </div>
          </div>
        </section>

        {/* Vertrauen */}
        <section>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32">
            <Reveal>
              <Eyebrow>{t.trust.eyebrow}</Eyebrow>
              <Title className="max-w-[860px]">{t.trust.title}</Title>
            </Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {t.trust.facts.map((f, i) => (
                <Reveal key={f.title} delay={i * 110} className="dd-fact relative border-t border-line pt-6">
                  <h3 className="dd-h text-[21px] leading-tight tracking-[-0.02em] text-ftext mb-2">{f.title}</h3>
                  <p className="text-[16px] leading-[1.65] text-muted">{f.desc}</p>
                  {f.mail && (
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar size={36} />
                      <MailLink className="text-[15px]" label />
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
            <div className="mt-20 md:mt-24">
              <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-dim mb-8">{t.trust.quotesLabel}</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                {t.trust.quotes.map((q, i) => (
                  <Reveal key={q.who} delay={i * 120} className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] p-7 md:p-10">
                    <figure className="m-0 flex flex-col h-full">
                      <Quote className="w-7 h-7 text-accent mb-5" strokeWidth={1.6} aria-hidden="true" />
                      <blockquote className="m-0 text-[19px] md:text-[21px] leading-[1.55] font-medium tracking-[-0.01em] text-ftext flex-1">„{q.quote}“</blockquote>
                      <figcaption className="mt-7 pt-5 border-t border-line flex items-center gap-3 text-[15px]">
                        <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/[0.12] text-accent" aria-hidden="true">
                          <Check className="w-4 h-4" strokeWidth={2.4} />
                        </span>
                        <span className="text-muted">
                          <span className="font-semibold text-ftext">Kunde von JPR Studio</span> · {q.who}
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="dd-paper">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 self-start">
              <Eyebrow>{t.faq.eyebrow}</Eyebrow>
              <Title>{t.faq.title}</Title>
            </Reveal>
            <Reveal delay={100} className="border-t border-line">
              {t.faq.items.map((f) => (
                <details key={f.q} className="dd-faq group border-b border-line">
                  <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none font-display font-bold text-[19px] md:text-[21px] leading-snug tracking-[-0.02em] text-ftext hover:text-accent transition-colors">
                    {f.q}
                    <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full border border-line text-accent transition-colors group-open:bg-accent group-open:border-accent group-open:text-white" aria-hidden="true">
                      <Plus className="w-4 h-4 transition-transform duration-300 group-open:rotate-45" strokeWidth={2} />
                    </span>
                  </summary>
                  <p className="pb-7 -mt-1 text-[17px] leading-[1.7] text-muted max-w-[680px]">{withMail(f.a)}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Abschluss */}
        <section ref={endRef} className="relative overflow-hidden">
          <div className="dd-glow absolute inset-0 -z-0" aria-hidden="true" />
          <Reveal className="relative max-w-[980px] mx-auto px-4 md:px-10 py-24 md:py-36 text-center">
            <h2 className="dd-h text-[clamp(40px,6.2vw,88px)] leading-[1.0] text-ftext">
              <Words text={t.cta.title[0]} />
              <span className="block">
                <em className="dd-word not-italic">
                  <span className="dd-em" style={{ '--i': 2 } as React.CSSProperties}>{t.cta.title[1]}</span>
                </em>
              </span>
            </h2>
            <p className="mt-7 mx-auto max-w-[560px] text-[17px] md:text-[19px] leading-[1.6] text-muted">{t.cta.text}</p>
            <div className="mt-10 flex justify-center">
              <Cta onClick={open} magnetic>{t.cta.button}</Cta>
            </div>
            <div className="mt-10 inline-flex items-center gap-3 text-left max-w-full">
              <Avatar size={52} />
              <div className="min-w-0 flex flex-col items-start text-[15px] text-muted">
                <span>
                  <span className="text-ftext font-semibold">{t.tom.name}</span> · {t.tom.role}
                </span>
                <MailLink className="!min-h-[32px] text-[15px]" label />
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-line">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-10 pb-28 md:pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[14px] text-muted">
            <div className="flex flex-col gap-2">
              <span className="font-syne font-extrabold text-[16px] uppercase text-ftext">JPR <span className="text-accent">Studio</span>&reg;</span>
              <span>
                {copy.de.footer.company} ·{' '}
                <a href={`mailto:${t.footer.companyEmail}`} className="hover:text-accent transition-colors">{t.footer.companyEmail}</a>
              </span>
              <span>
                {t.footer.tomLine} ·{' '}
                <a href={`mailto:${t.tom.email}`} className="text-ftext hover:text-accent transition-colors">{t.tom.email}</a>
              </span>
            </div>
            <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="/" className="py-2 hover:text-accent transition-colors">{t.footer.home}</a>
              <a href="/preise" className="py-2 hover:text-accent transition-colors">{t.footer.pricing}</a>
              <a href="/imprint" className="py-2 hover:text-accent transition-colors">{t.footer.imprint}</a>
              <a href="/privacy" className="py-2 hover:text-accent transition-colors">{t.footer.privacy}</a>
            </nav>
          </div>
        </footer>
      </main>

      {/* Feste Leiste unten, nur Handy: erscheint, sobald der Hero-Knopf weg ist, und weicht dem Abschluss-Block */}
      <div
        className={`dd-sticky md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-ink/90 backdrop-blur-xl border-t border-line ${showSticky ? 'on' : ''}`}
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <span className="hidden min-[360px]:block">
            <Avatar size={44} />
          </span>
          <button type="button" tabIndex={showSticky ? 0 : -1} onClick={open} className="dd-btn flex-1 min-w-0 h-12 px-4 rounded-full font-manrope text-[15px] font-bold leading-tight">
            {t.sticky}
          </button>
        </div>
      </div>

      <CookieBanner />
    </div>
  );
};

export default DresdenPage;
