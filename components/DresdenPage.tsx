import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Bot, CalendarX, Check, Mail, Maximize2, MicOff, Phone, Plus, Quote, ShieldCheck, X } from 'lucide-react';
import CookieBanner from './CookieBanner';
import CompareSlider from './dresden/CompareSlider';
import Lightbox from './dresden/Lightbox';
import VoiceDemo from './dresden/VoiceDemo';
import { HeroParticles, HeroStack } from './dresden/HeroStage';
import { Avatar, Count, Cta, Devices, Eyebrow, MailLink, Reveal, Title, Words, finePointer, withMail } from './dresden/parts';
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
 * v3.1 (22.11.2026): „Reinknallen“-Umbau nach tom-v3/design-brief.md. Hero mit Lichtpunkten und 3D-Kartenstapel,
 * Zahlenleiste mit Zählwerk, Branchen-Laufband, Vorher/Nachher-Regler, KI-Demo mit Tipp-Animation, Lightbox,
 * Kundenprojekt mit Zählwerk, Preise mit hervorgehobenem Paket, Schluss mit Website-Feld. Texte: content/dresden-copy.ts.
 * Rhythmus: dunkel (Hero) · hell (Vorher/Nachher, Ergebnis) · dunkel (KI) · hell (Beispiele) · dunkel (Projekt, Tom) ·
 * hell (Ablauf, Preise) · dunkel (FAQ, Schluss).
 */

/** Schluss-Feld: Website eintragen, der Dialog öffnet vorbefüllt. Eigener State, damit Tippen nicht die ganze Seite rendert. */
const WebsiteField: React.FC<{ onStart: (website: string) => void }> = ({ onStart }) => {
  const [url, setUrl] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onStart(url.trim());
      }}
      className="mx-auto w-full max-w-[680px] text-left"
    >
      <label htmlFor="dd-website" className="block text-[14px] font-semibold text-muted mb-2.5 pl-2">
        {t.draft.heroLabel}
      </label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:p-2 sm:rounded-full sm:border sm:border-white/12 sm:bg-white/[0.04] sm:backdrop-blur-md">
        <input
          id="dd-website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t.draft.heroPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="dd-field w-full sm:flex-1 min-w-0 h-14 px-6 rounded-full bg-white/[0.06] sm:bg-transparent border border-white/12 sm:border-0 text-ftext text-[17px] placeholder:text-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8fa8ff]"
        />
        <Cta type="submit" className="w-full sm:w-auto shrink-0">{t.cta.button}</Cta>
      </div>
      <p className="mt-3 pl-2 text-[14px] text-dim">{t.draft.heroHint}</p>
    </form>
  );
};

const DresdenPage: React.FC<Props> = ({ onRequestDraft }) => {
  const [heroIn, setHeroIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroCta = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const open = () => onRequestDraft();
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

  const toExamples = () => document.getElementById('beispiele')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const portrait = t.tom.photo.cutout;
  const ba = t.beforeAfter;
  const cs = t.caseStudy;
  const marquee = [...t.audience.items, ...t.audience.items, ...t.audience.items];

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
        {/* 1 Hero: dunkle Bühne, Raster + Lichtschein + Lichtpunkte, rechts der 3D-Kartenstapel */}
        <header className="dd-hero relative isolate overflow-hidden">
          <div className="dd-hero-glow absolute inset-0 -z-10 pointer-events-none" data-parallax="0.18" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <HeroParticles />
          </div>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-[88px] md:pt-[136px] pb-14 md:pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] gap-x-10 xl:gap-x-14 gap-y-10 lg:gap-y-0 items-center">
            <div className="min-w-0 lg:row-start-1 lg:col-start-1">
              <div className={`hero-foot dd-blur ${heroIn ? 'in' : ''}`} style={{ '--hd': '0s' } as React.CSSProperties}>
                <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="dd-h text-[clamp(40px,5.6vw,88px)] leading-[1.0] text-ftext">
                <span className={`hero-line ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[0]}</span></span>
                <span className={`hero-line hero-line-2 ${heroIn ? 'in' : ''}`}>
                  <span>
                    <em className="dd-em">{t.hero.h1[1]}</em> {t.hero.h1[2]}
                  </span>
                </span>
              </h1>
              <p style={{ '--hd': '.32s' } as React.CSSProperties} className={`hero-foot dd-blur ${heroIn ? 'in' : ''} mt-6 md:mt-8 max-w-[560px] text-[17px] md:text-[19px] leading-[1.6] text-muted`}>{t.hero.sub}</p>
              <div style={{ '--hd': '.46s' } as React.CSSProperties} className={`hero-foot dd-blur ${heroIn ? 'in' : ''} mt-8 md:mt-10 flex flex-wrap items-center gap-x-7 gap-y-4`}>
                <Cta onClick={open} ctaRef={heroCta} magnetic className="w-full sm:w-auto">{t.hero.cta}</Cta>
                <button type="button" onClick={toExamples} className="inline-flex items-center gap-2 min-h-[44px] font-manrope text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                  {t.hero.secondary}
                  <ArrowDown className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div style={{ '--hd': '.2s' } as React.CSSProperties} className={`hero-foot dd-settle ${heroIn ? 'in' : ''} min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 xl:w-[110%]`}>
              <HeroStack />
            </div>

            <div className={`hero-proof ${heroIn ? 'in' : ''} min-w-0 lg:row-start-2 lg:col-start-1 lg:mt-12 pt-6 border-t border-line flex flex-col gap-5`}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar size={48} alt={t.tom.photo.alt} eager />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[17px] leading-tight tracking-[-0.01em] text-ftext">{t.hero.tomCard.name}</div>
                    <div className="text-[14px] text-muted">{t.hero.tomCard.role}</div>
                  </div>
                </div>
                <a href={`mailto:${t.tom.email}`} className="dd-link inline-flex items-center gap-2 min-h-[44px] rounded-full border border-white/12 px-4 text-[14px] font-semibold text-ftext hover:border-[#8fa8ff] hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 text-accent" strokeWidth={2} aria-hidden="true" />
                  {t.hero.tomCard.link}
                </a>
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
        </header>

        {/* 2 Zahlenleiste + 3 Laufband der Branchen */}
        <section className="relative border-y border-line bg-[#090d17]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-10 md:pt-14 pb-6 md:pb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-9">
              {t.strip.items.map((it, i) => (
                <Reveal
                  key={it.label}
                  delay={i * 90}
                  className={`min-w-0 pr-3 md:pr-6 ${i % 2 === 1 ? 'pl-4 md:pl-8 border-l border-line' : ''} ${i > 0 ? 'lg:pl-8 lg:border-l lg:border-line' : ''}`}
                >
                  <div className="dd-h text-[clamp(40px,5.2vw,72px)] leading-none tracking-[-0.04em] text-ftext">
                    <Count value={it.value} />
                  </div>
                  <p className="mt-3 max-w-[260px] text-[15px] md:text-[16px] leading-[1.45] text-muted">{it.label}</p>
                </Reveal>
              ))}
            </div>
            <p className="mt-9 text-[14px] leading-[1.5] text-muted">{t.strip.footnote}</p>
          </div>
          <div className="dd-marquee relative border-t border-line overflow-hidden py-5 md:py-6" role="group" aria-label={t.audience.label}>
            <div className="dd-marquee-track">
              {[0, 1].map((k) => (
                <ul key={k} aria-hidden={k === 1} className={`dd-marquee-list list-none p-0 m-0 ${k === 1 ? 'dd-marquee-dup' : ''}`}>
                  {marquee.map((a, i) => (
                    <li key={i} className="inline-flex items-center gap-8 pr-8 font-display font-bold text-[22px] md:text-[30px] tracking-[-0.03em] text-ftext/80 whitespace-nowrap">
                      {a}
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Vorher / Nachher + Ergebnisse (hell) */}
        <section className="dd-paper">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
            <Reveal className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,460px)] gap-6 lg:gap-16 items-end">
              <div>
                <Eyebrow>{ba.eyebrow}</Eyebrow>
                <Title className="max-w-[760px]">{ba.title}</Title>
              </div>
              <p className="text-[17px] md:text-[18px] leading-[1.65] text-muted">{ba.intro}</p>
            </Reveal>
            <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-14 items-start">
              <Reveal delay={60} className="min-w-0 lg:sticky lg:top-28">
                <CompareSlider />
              </Reveal>
              <div className="min-w-0">
                <ul className="list-none p-0 m-0 grid gap-4">
                  {ba.pairs.map((p, i) => (
                    <Reveal as="li" key={p.label} delay={i * 90} className="dd-card rounded-[18px] border border-line bg-panel p-5 md:p-6 shadow-[0_1px_2px_rgba(10,14,26,0.04)]">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.14em] text-accent">{p.label}</span>
                        <span className="rounded-full bg-ink px-3 py-1 text-[13px] font-semibold text-muted border border-line">{p.stat}</span>
                      </div>
                      <div className="grid gap-3">
                        <p className="m-0 flex items-start gap-3 text-[16px] leading-[1.55] text-muted">
                          <span className="grid place-items-center w-6 h-6 mt-0.5 shrink-0 rounded-full bg-[#e5484d]/10 text-[#d03a3f]" aria-hidden="true">
                            <X className="w-3.5 h-3.5" strokeWidth={2.8} />
                          </span>
                          <span>
                            <span className={i === 0 ? 'block text-[12px] font-bold uppercase tracking-[0.1em] text-[#c0343a] mb-0.5' : 'sr-only'}>{ba.colBefore}: </span>
                            {p.before}
                          </span>
                        </p>
                        <p className="m-0 flex items-start gap-3 text-[16px] leading-[1.55] font-semibold text-ftext">
                          <span className="grid place-items-center w-6 h-6 mt-0.5 shrink-0 rounded-full bg-accent text-white" aria-hidden="true">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </span>
                          <span>
                            <span className={i === 0 ? 'block text-[12px] font-bold uppercase tracking-[0.1em] text-accent mb-0.5' : 'sr-only'}>{ba.colAfter}: </span>
                            {p.after}
                          </span>
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
                <p className="mt-5 text-[14px] leading-[1.5] text-muted">{ba.footnote}</p>
              </div>
            </div>

            {/* Ergebnisse: Zeilen statt drei gleicher Karten */}
            <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-line grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20">
              <Reveal className="lg:sticky lg:top-28 self-start">
                <Eyebrow>{t.outcomes.eyebrow}</Eyebrow>
                <Title>{t.outcomes.title}</Title>
              </Reveal>
              <ol className="list-none p-0 m-0 border-t border-line">
                {t.outcomes.items.map((o, i) => (
                  <Reveal as="li" key={o.title} delay={i * 100} className="grid grid-cols-[56px_1fr] md:grid-cols-[88px_1fr] gap-4 md:gap-6 py-7 md:py-9 border-b border-line">
                    <span className="dd-h text-[40px] md:text-[60px] leading-none tracking-[-0.05em] text-accent/30 tabular-nums" aria-hidden="true">0{i + 1}</span>
                    <div>
                      <h3 className="dd-h text-[22px] md:text-[28px] leading-[1.15] tracking-[-0.03em] text-ftext mb-3">{o.title}</h3>
                      <p className="text-[16px] md:text-[17px] leading-[1.65] text-muted max-w-[600px]">{o.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 5 KI-Assistent (dunkel) */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 50% at 85% 30%, rgba(61,90,254,0.14), transparent 70%)' }} aria-hidden="true" />
          <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-14 lg:gap-20 items-start">
            <Reveal className="min-w-0">
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
              <p className="mt-8 text-[15px] text-muted">{t.voice.note}</p>
            </Reveal>
            <div className="min-w-0 lg:sticky lg:top-28">
              <VoiceDemo />
            </div>
          </div>
        </section>

        {/* 6 Beispiel-Entwürfe (hell), Klick öffnet die Lightbox */}
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
                <Reveal as="li" key={e.title} delay={i * 120} className={i === 1 ? 'lg:mt-16' : i === 2 ? 'lg:mt-8' : ''}>
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`${t.examples.badge}: ${e.title}`}
                    className="dd-zoom group block w-full text-left rounded-[22px] cursor-zoom-in"
                  >
                    <div className="relative">
                      <div>
                        <TiltStage>
                          <Devices desktop={e.img} mobile={e.img} host={e.title} alt={`${t.examples.badge}: ${e.title}`} />
                        </TiltStage>
                      </div>
                      <span className="absolute right-3 top-3 grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white/85 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                        <Maximize2 className="w-4 h-4" strokeWidth={2} />
                      </span>
                    </div>
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-accent/[0.08] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                        {t.examples.badge}
                      </span>
                      <h3 className="dd-h mt-3 text-[23px] leading-tight tracking-[-0.025em] text-ftext">{e.title}</h3>
                      <p className="mt-1 text-[16px] text-muted">{e.tag}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 Kundenprojekt + 8 Kundenstimmen (dunkel) */}
        <section className="relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-32 pb-12 md:pb-20">
            <Reveal className="dd-case relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/10 p-6 sm:p-8 md:p-12 lg:p-16">
              <span className="dd-case-rings absolute pointer-events-none" aria-hidden="true">
                <span /><span /><span />
              </span>
              <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
                <div className="min-w-0">
                  <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.16em] text-accent mb-5">{cs.kicker}</div>
                  <div className="dd-h text-[clamp(120px,24vw,260px)] leading-[0.82] tracking-[-0.06em] text-ftext [text-shadow:0_0_80px_rgba(95,125,255,0.45)]">
                    <Count value={String(cs.count)} duration={1900} />
                  </div>
                  <p className="mt-6 max-w-[420px] text-[19px] md:text-[21px] leading-[1.4] font-semibold text-ftext">{cs.countLabel}</p>
                  <p className="mt-1 text-[16px] text-muted">{cs.countNote}</p>
                </div>
                <div className="min-w-0">
                  <h2 className="dd-h text-[clamp(30px,3.6vw,48px)] leading-[1.06] text-ftext [text-wrap:balance]">
                    <Words text={cs.title} />
                  </h2>
                  <div className="mt-8 grid gap-4">
                    <p className="m-0 flex items-start gap-3 text-[16px] md:text-[17px] leading-[1.55] text-muted">
                      <span className="grid place-items-center w-6 h-6 mt-0.5 shrink-0 rounded-full bg-white/[0.07] text-muted" aria-hidden="true">
                        <X className="w-3.5 h-3.5" strokeWidth={2.8} />
                      </span>
                      {cs.old}
                    </p>
                    <p className="m-0 flex items-start gap-3 text-[17px] md:text-[18px] leading-[1.5] font-semibold text-ftext">
                      <span className="grid place-items-center w-6 h-6 mt-0.5 shrink-0 rounded-full bg-[#3d5afe] text-white" aria-hidden="true">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      {cs.now}
                    </p>
                  </div>
                  <p className="mt-8 pt-6 border-t border-white/10 text-[16px] md:text-[17px] leading-[1.6] text-muted max-w-[560px]">{cs.bridge}</p>
                  <div className="mt-8">
                    <Cta onClick={open} className="w-full sm:w-auto">{cs.cta}</Cta>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-20 md:mt-28">
              <Reveal>
                <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
                <h2 className="dd-h text-[clamp(26px,3vw,38px)] leading-[1.1] text-ftext [text-wrap:balance]">{t.testimonials.title}</h2>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                {t.testimonials.quotes.map((q, i) => (
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
              <p className="mt-5 text-[14px] text-muted">{t.testimonials.note}</p>
            </div>
          </div>
        </section>

        {/* 9 Tom (dunkel) */}
        <section>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-20 md:pb-32">
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
                <h2 className="dd-h text-[clamp(28px,3.2vw,42px)] leading-[1.08] text-ftext [text-wrap:balance]">
                  <Words text={t.tom.title} />
                </h2>
                <p className="mt-3 text-[15px] font-semibold text-muted">
                  {t.tom.name} · {t.tom.role}
                </p>
                <p className="mt-5 text-[17px] leading-[1.65] text-muted max-w-[640px]">{t.tom.text}</p>
                {t.tom.personal && <p className="mt-4 text-[17px] leading-[1.65] text-ftext max-w-[640px]">{t.tom.personal}</p>}
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
                <p className="mt-6 text-[14px] leading-[1.5] text-muted">{t.tom.company}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 10 Ablauf + 11 Preise (hell) */}
        <section className="dd-paper">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
            <Reveal>
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
          <div id="preise" className="border-t border-line">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-20 md:pt-28 pb-20 md:pb-32">
              <Reveal>
                <Eyebrow>{t.pricing.eyebrow}</Eyebrow>
                <Title>{t.pricing.title}</Title>
              </Reveal>
              <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
                {t.pricing.tiers.map((tier, i) => {
                  const body = (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.16em]">{tier.name}</span>
                        {tier.reco && <span className="rounded-full bg-[#3d5afe] text-white px-3 py-1 text-[12px] font-bold">{t.pricing.reco}</span>}
                      </div>
                      <div className={`mt-2 text-[15px] leading-[1.5] ${tier.reco ? 'text-[#a3adc2]' : 'text-muted'} lg:min-h-[4.5em]`}>{tier.for}</div>
                      <div className="dd-h mt-6 text-[44px] leading-none tracking-[-0.04em] tabular-nums">{tier.price}</div>
                      <ul className="mt-7 space-y-3 list-none p-0 flex-1">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-[16px] leading-[1.45]">
                            <Check className={`w-4 h-4 mt-1 shrink-0 ${tier.reco ? 'text-[#8fa8ff]' : 'text-accent'}`} strokeWidth={2.4} aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button type="button" onClick={open} className={`mt-8 min-h-[52px] rounded-full font-manrope text-[15px] font-bold ${tier.reco ? 'dd-btn' : 'dd-btn-ghost'}`}>
                        {t.pricing.cta}
                      </button>
                    </>
                  );
                  return tier.reco ? (
                    <Reveal key={tier.name} delay={i * 110} className="dd-card dd-reco relative rounded-[26px] p-[1.5px] lg:-my-4 shadow-[0_40px_80px_-36px_rgba(20,40,140,0.8)]">
                      <div className="relative flex flex-col h-full rounded-[25px] p-7 md:p-9 lg:py-12 text-white bg-[radial-gradient(80%_60%_at_100%_0%,rgba(61,90,254,0.4),transparent_60%),linear-gradient(180deg,#0f1526,#070a12)]">{body}</div>
                    </Reveal>
                  ) : (
                    <Reveal key={tier.name} delay={i * 110} className="dd-card relative flex flex-col rounded-[24px] p-7 md:p-9 bg-panel border border-line text-ftext">
                      {body}
                    </Reveal>
                  );
                })}
              </div>
              <Reveal className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 rounded-[18px] border border-line bg-panel">
                <p className="m-0 flex items-start gap-3 p-5 md:p-6 text-[16px] leading-[1.5] text-ftext">
                  <ShieldCheck className="w-5 h-5 mt-0.5 text-accent shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  {t.pricing.care}
                </p>
                <p className="m-0 flex items-start gap-3 p-5 md:p-6 text-[16px] leading-[1.5] text-ftext border-t md:border-t-0 md:border-l border-line">
                  <Bot className="w-5 h-5 mt-0.5 text-accent shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  {t.pricing.voice}
                </p>
              </Reveal>
              <p className="mt-5 text-[15px] text-muted">{t.pricing.note}</p>
            </div>
          </div>
        </section>

        {/* 12 FAQ (dunkel) */}
        <section>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 self-start">
              <Eyebrow>{t.faq.eyebrow}</Eyebrow>
              <Title>{t.faq.title}</Title>
            </Reveal>
            <Reveal delay={100} className="border-t border-line">
              {t.faq.items.map((f) => (
                <details key={f.q} className="dd-faq group border-b border-line">
                  <summary className="flex items-center justify-between gap-6 py-5 md:py-6 cursor-pointer list-none font-display font-bold text-[18px] md:text-[20px] leading-snug tracking-[-0.02em] text-ftext hover:text-accent transition-colors">
                    {f.q}
                    <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full border border-line text-accent transition-colors group-open:bg-accent group-open:border-accent group-open:text-ink" aria-hidden="true">
                      <Plus className="w-4 h-4 transition-transform duration-300 group-open:rotate-45" strokeWidth={2} />
                    </span>
                  </summary>
                  <p className="pb-7 -mt-1 text-[17px] leading-[1.7] text-muted max-w-[680px]">{withMail(f.a)}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 13 Schluss: große dunkle Bühne mit Website-Feld */}
        <section ref={endRef} className="relative overflow-hidden border-t border-line">
          <div className="dd-glow absolute inset-0 -z-0" aria-hidden="true" />
          <div className="dd-final-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
          <Reveal className="relative max-w-[980px] mx-auto px-4 md:px-10 py-24 md:py-40 text-center">
            <h2 className="dd-h text-[clamp(44px,7vw,104px)] leading-[0.98] text-ftext">
              <Words text={t.cta.title[0]} />
              <span className="block">
                <em className="dd-word not-italic">
                  <span className="dd-em" style={{ '--i': 2 } as React.CSSProperties}>{t.cta.title[1]}</span>
                </em>
              </span>
            </h2>
            <p className="mt-7 mx-auto max-w-[560px] text-[17px] md:text-[19px] leading-[1.6] text-muted">{t.cta.text}</p>
            <div className="mt-10">
              <WebsiteField onStart={(w) => onRequestDraft(w)} />
            </div>
            <div className="mt-12 inline-flex items-center gap-3 text-left max-w-full">
              <Avatar size={52} />
              <div className="min-w-0 flex flex-col items-start text-[15px] text-muted">
                <span>{withMail(t.cta.mail)}</span>
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

      {lightbox !== null && <Lightbox item={t.examples.items[lightbox]} onClose={() => setLightbox(null)} />}

      <CookieBanner />
    </div>
  );
};

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

export default DresdenPage;
