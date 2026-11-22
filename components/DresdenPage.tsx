import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, CalendarX, Check, ChevronDown, MicOff, Phone, Plus, ShieldCheck, X } from 'lucide-react';
import CookieBanner from './CookieBanner';
import CompareSlider from './dresden/CompareSlider';
import Lightbox from './dresden/Lightbox';
import VoiceDemo from './dresden/VoiceDemo';
import ExampleSwitcher from './dresden/ExampleSwitcher';
import { HeroStack } from './dresden/HeroStage';
import { Avatar, Count, Cta, Eyebrow, MailLink, Reveal, Title, Words, withMail } from './dresden/parts';
import { useScrollMotion } from '../hooks/useScrollMotion';
import { dresden as t } from '../content/dresden-copy';
import { copy } from '../content/site-copy';

interface Props {
  onRequestDraft: (website?: string) => void;
}

/**
 * Landingpage /tom-nowak (früher /dresden): Toms Visitenkarte für Betriebe in Dresden (Du-Form, JPR Consulting GmbH).
 * v2 (02.11.2026): kühles Tinten-Dunkel + helle Sektionen, ein Akzent (Kobaltblau), Satoshi-Überschriften,
 * kursives Serif-Akzentwort. Kein Braun/Gold/Beige (Jan). Farben über die CSS-Variablen in index.css
 * (html.theme-dresden, .dd-paper). Alle Knöpfe öffnen den Entwurf-Dialog.
 * v3 (13.11.2026/22.11.2026): Toms Foto, Wort-Aufstieg, Vorher/Nachher-Regler, KI-Demo, Lightbox, Zählwerk der 206.
 * v4 (22.11.2026): Du-Form, 8 Abschnitte statt 13 (tom-v4/decisions.md). Website-Feld schon im Hero, Beweis (206 + Zitate)
 * in einem Abschnitt, Tom im Ablauf, ein Preis-Knopf. Eine Kartenform (Radius 20), Eyebrow nur im Hero.
 * Rhythmus (4 Wechsel): dunkel (Hero) · hell (Vorher/Nachher) · dunkel (KI, Beispiele, Beweis) · hell (Ablauf, Preise, FAQ) · dunkel (Schluss).
 */

// Abstand zwischen Abschnitten: gleiche Fläche = nur oben (64/96), letzter Abschnitt eines Blocks auch unten
const SEC = 'pt-16 md:pt-24';
const SEC_END = 'pb-16 md:pb-24';
// Folgt auf einen gleichfarbigen Abschnitt: 96/128, damit die Grenze mehr als doppelt so groß ist wie Abstände im Abschnitt (≤ 48)
const SEC_SAME = 'pt-24 md:pt-32';

/** Website-Feld (Hero und Schluss): Adresse eintragen, der Dialog öffnet vorbefüllt. Eigener State, damit Tippen nicht die ganze Seite rendert. */
const WebsiteField: React.FC<{ id: string; onStart: (website: string) => void; ctaRef?: React.Ref<HTMLButtonElement>; magnetic?: boolean; center?: boolean }> = ({
  id,
  onStart,
  ctaRef,
  magnetic,
  center,
}) => {
  const [url, setUrl] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onStart(url.trim());
      }}
      className={`w-full max-w-[680px] text-left ${center ? 'mx-auto' : ''}`}
    >
      <label htmlFor={id} className="block text-[14px] font-semibold text-muted mb-2">
        {t.draft.heroLabel}
      </label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:p-2 sm:rounded-full sm:border sm:border-white/12 sm:bg-white/[0.04] sm:focus-within:ring-2 sm:focus-within:ring-[#8fa8ff]">
        <input
          id={id}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t.draft.heroPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="dd-field w-full sm:flex-1 min-w-0 h-14 px-6 rounded-full bg-white/[0.06] sm:bg-transparent border border-white/12 sm:border-0 text-ftext text-[17px] placeholder:text-dim focus:outline-none max-sm:focus-visible:ring-2 max-sm:focus-visible:ring-[#8fa8ff]"
        />
        <Cta type="submit" ctaRef={ctaRef} magnetic={magnetic} className="w-full sm:w-auto shrink-0">{t.cta.button}</Cta>
      </div>
      <p className="mt-3 text-[15px] text-muted">{t.draft.heroHint}</p>
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

  const portrait = t.tom.photo.cutout;
  const ba = t.beforeAfter;
  const cs = t.caseStudy;
  const ctaWords = t.cta.title[1].split(' ');
  const ctaLast = ctaWords.pop() as string;
  const ctaRest = ctaWords.join(' ');
  const stickyHide = showSticky ? 'max-md:hidden' : '';

  return (
    <div ref={rootRef} className="dd bg-ink text-ftext font-manrope overflow-x-clip selection:bg-[#3d5afe] selection:text-white">
      {/* Navigation: Knopf nur am Rechner (Umriss), am Handy übernimmt der Hero-Knopf, danach die feste Leiste */}
      <nav
        className={`dd-nav fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-300 border-b ${
          scrolled ? 'bg-ink/[0.94] backdrop-blur-xl border-line' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 md:px-10 h-[64px] md:h-[76px]">
          <a href="/" className="flex items-center gap-3 min-w-0">
            <span className="font-syne font-extrabold text-[15px] md:text-[18px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap">
              JPR <span className="text-accent">Studio</span>&reg;
            </span>
            <span className="w-px h-4 bg-line" aria-hidden="true" />
            <span className="font-manrope text-[13px] md:text-[14px] font-medium tracking-[0.08em] uppercase text-muted">{t.nav.place}</span>
          </a>
          <button type="button" onClick={open} className="dd-btn-ghost max-md:hidden inline-flex items-center gap-2 h-11 px-5 rounded-full font-manrope text-[14px] font-bold whitespace-nowrap shrink-0">
            {t.nav.cta}
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
        {/* Lesefortschritt: feine Akzentlinie unter der Leiste */}
        <span data-page-progress className={`dd-page-bar absolute left-0 right-0 bottom-[-1px] h-px transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
      </nav>

      <main>
        {/* 1 Hero (dunkel): Eyebrow, H1, Satz, Website-Feld, Tom-Zeile; rechts der 3D-Kartenstapel */}
        <header className="dd-hero relative isolate overflow-hidden">
          <div className="dd-hero-glow absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" />
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-[88px] md:pt-[112px] pb-12 md:pb-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-10 xl:gap-x-14 gap-y-10 lg:gap-y-0 items-center">
            {/* Text steht sofort (LCP): keine Deckkraft-Einblendung, nur der Rest bewegt sich */}
            <div className="min-w-0">
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="dd-h text-[clamp(40px,5vw,72px)] leading-[1.0] text-ftext [text-wrap:balance]">
                <span className="block">{t.hero.h1[0]}</span>
                <span className="block">
                  <em className="dd-em">{t.hero.h1[1]}</em> {t.hero.h1[2]}
                </span>
              </h1>
              <p className="mt-5 md:mt-6 max-w-[560px] text-[17px] md:text-[18px] leading-[1.6] text-muted">{t.hero.sub}</p>
              <div className="mt-6 md:mt-8">
                <WebsiteField id="dd-website-hero" onStart={(w) => onRequestDraft(w)} ctaRef={heroCta} magnetic />
              </div>
              <div className="mt-5 md:mt-6 flex items-center gap-4">
                <Avatar size={48} alt={t.tom.photo.alt} eager />
                <div className="min-w-0">
                  <div className="font-display font-bold text-[17px] leading-tight tracking-[-0.01em] text-ftext">{t.hero.tomCard.name}</div>
                  <div className="text-[14px] text-muted">{t.hero.tomCard.role}</div>
                </div>
              </div>
            </div>
            <div className={`dd-rise ${heroIn ? 'in' : ''} min-w-0 xl:-mr-14`}>
              <HeroStack />
            </div>
          </div>
        </header>

        {/* 2 Vorher / Nachher (hell): vier schlanke Zeilen, Prüfungs-Fußnote, Regler am Ende */}
        <section className={`dd-paper ${SEC} ${SEC_END}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <Reveal>
              <Title className="max-w-[760px]">{ba.title}</Title>
              <p className="mt-4 max-w-[620px] text-[17px] md:text-[18px] leading-[1.6] text-ftext">{ba.intro}</p>
            </Reveal>
            <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-start">
              <div className="min-w-0">
                <ul className="list-none p-0 m-0 border-t border-line">
                  {ba.pairs.map((p, i) => (
                    <Reveal as="li" key={p.label} delay={i * 80} className="py-5 border-b border-line">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-display font-bold text-[20px] leading-tight tracking-[-0.02em] text-ftext">{p.label}</span>
                        <span className="text-[14px] font-semibold text-accent whitespace-nowrap">{p.stat}</span>
                      </div>
                      <p className="mt-2 m-0 flex items-start gap-3 text-[16px] leading-[1.5] text-muted">
                        <X className="w-4 h-4 mt-1 shrink-0 text-[#d03a3f]" strokeWidth={2.6} aria-hidden="true" />
                        <span>
                          <span className="sr-only">{ba.colBefore}: </span>
                          {p.before}
                        </span>
                      </p>
                      <p className="mt-1.5 m-0 flex items-start gap-3 text-[16px] leading-[1.5] font-semibold text-ftext">
                        <Check className="w-4 h-4 mt-1 shrink-0 text-accent" strokeWidth={3} aria-hidden="true" />
                        <span>
                          <span className="sr-only">{ba.colAfter}: </span>
                          {p.after}
                        </span>
                      </p>
                    </Reveal>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] leading-[1.5] text-muted">{ba.footnote}</p>
              </div>
              <Reveal delay={60} className="min-w-0 lg:sticky lg:top-28">
                <CompareSlider />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3 KI-Assistent (dunkel): Handy: Demo direkt nach Überschrift + Einleitung, Rechner: Demo rechts, mitlaufend */}
        <section className={`relative overflow-hidden ${SEC}`}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(45% 50% at 85% 30%, rgba(61,90,254,0.14), transparent 70%)' }} aria-hidden="true" />
          <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:grid-rows-[auto_1fr] gap-x-20 gap-y-10 lg:gap-y-0">
            <Reveal className="min-w-0 lg:col-start-1 lg:row-start-1">
              <Title>{t.voice.title}</Title>
              <p className="mt-5 text-[17px] md:text-[18px] leading-[1.6] text-ftext max-w-[580px]">{t.voice.intro}</p>
            </Reveal>
            <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 lg:self-start">
              <VoiceDemo />
            </div>
            <Reveal className="min-w-0 lg:col-start-1 lg:row-start-2">
              <ul className="lg:mt-10 grid grid-cols-1 gap-3 list-none p-0 m-0">
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
              <p className="mt-6 text-[16px] leading-[1.6] text-muted">{t.voice.note}</p>
            </Reveal>
          </div>
        </section>

        {/* 4 Beispiel-Entwürfe (dunkel): ein großes Fenster mit Branchen-Reitern */}
        <section id="beispiele" className={`scroll-mt-16 ${SEC_SAME}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <Reveal>
              <Title>{t.examples.title}</Title>
              <p className="mt-4 max-w-[620px] text-[17px] md:text-[18px] leading-[1.6] text-ftext">{t.examples.text}</p>
            </Reveal>
            <Reveal className="mt-8 md:mt-10" delay={80}>
              <ExampleSwitcher onOpen={setLightbox} />
            </Reveal>
          </div>
        </section>

        {/* 5 Beweis (dunkel): 206 + Vorher/Heute + Brücke, darunter die zwei Zitate, dann der Zwischen-Knopf. Bewusst anonym. */}
        <section className={`relative ${SEC_SAME} ${SEC_END}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <Reveal className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
              <div className="min-w-0">
                <div className="font-manrope text-[16px] md:text-[17px] font-semibold text-ftext mb-5">
                  <span className="text-accent">{cs.kicker.split(' · ')[0]}</span>{cs.kicker.includes(' · ') ? ` · ${cs.kicker.split(' · ').slice(1).join(' · ')}` : ''}
                </div>
                <div className="dd-h text-[clamp(120px,22vw,220px)] leading-[0.82] tracking-[-0.06em] text-ftext">
                  <Count value={String(cs.count)} duration={1900} />
                </div>
                <p className="mt-6 max-w-[420px] text-[19px] md:text-[21px] leading-[1.4] font-semibold text-ftext">{cs.countLabel}</p>
                <p className="mt-1 text-[16px] font-medium text-muted">{cs.countNote}</p>
              </div>
              <div className="min-w-0">
                <h2 className="dd-h text-[clamp(32px,3.4vw,48px)] leading-[1.06] text-ftext [text-wrap:balance]">
                  <Words text={cs.title} />
                </h2>
                <div className="mt-6 grid gap-3">
                  <p className="m-0 flex items-start gap-3 text-[16px] md:text-[17px] leading-[1.5] text-muted">
                    <X className="w-4 h-4 mt-1.5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                    {cs.old}
                  </p>
                  <p className="m-0 flex items-start gap-3 text-[17px] md:text-[18px] leading-[1.5] font-semibold text-ftext">
                    <Check className="w-4 h-4 mt-1.5 shrink-0 text-accent" strokeWidth={3} aria-hidden="true" />
                    {cs.now}
                  </p>
                </div>
                <p className="mt-6 text-[16px] md:text-[17px] leading-[1.6] text-muted max-w-[560px]">{cs.bridge}</p>
              </div>
            </Reveal>
            <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {cs.quotes.map((q, i) => (
                <Reveal key={q.who} delay={i * 100}>
                  <figure className="m-0 pt-6 border-t border-line h-full">
                    <blockquote className="m-0 text-[18px] md:text-[19px] leading-[1.55] font-medium text-ftext">„{q.quote}“</blockquote>
                    <figcaption className="mt-4 text-[15px] font-medium text-muted">{q.who}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className={`mt-8 md:mt-10 ${stickyHide}`}>
              <Cta onClick={open} className="w-full sm:w-auto">{cs.cta}</Cta>
            </div>
          </div>
        </section>

        {/* 6 Ablauf mit Tom (hell): drei Schritte, darunter Tom als Karte mit Foto */}
        <section className={`dd-paper ${SEC}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <Reveal>
              <Title className="max-w-[760px]">{t.process.title}</Title>
            </Reveal>
            {/* Ablauf: Fortschrittslinie füllt sich beim Scrollen, Schritte leuchten auf, wenn die Linie sie erreicht */}
            <ol data-progress="auto" className="dd-steps relative mt-10 md:mt-12 grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-8 list-none p-0 max-w-[720px] xl:max-w-none">
              <span className="dd-rail" aria-hidden="true">
                <span />
              </span>
              {t.process.steps.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 110} className="relative pl-16 xl:pl-0">
                  <div data-step className="dd-step absolute left-0 top-0 xl:relative xl:mb-6" aria-hidden="true">
                    <span className="grid place-items-center w-10 h-10 rounded-full border font-display font-bold text-[15px] tabular-nums">{i + 1}</span>
                  </div>
                  <div className="sr-only">Schritt {i + 1}</div>
                  <h3 className="dd-h text-[22px] leading-tight tracking-[-0.025em] text-ftext mb-2 pt-1.5 xl:pt-0">{s.title}</h3>
                  <p className="text-[17px] leading-[1.6] text-muted">{s.desc}</p>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_1fr] gap-5 sm:gap-8 items-center rounded-[20px] border border-line bg-panel p-5 md:p-6">
              <div className="dd-portrait relative aspect-square w-full max-w-[160px] sm:max-w-none rounded-[12px] overflow-hidden">
                <img
                  src={`${portrait}-480.webp`}
                  srcSet={`${portrait}-480.webp 480w, ${portrait}-800.webp 800w`}
                  sizes="(min-width: 640px) 200px, 160px"
                  alt={t.tom.photo.alt}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-0 block w-full h-auto"
                />
              </div>
              <div className="min-w-0">
                <p className="m-0 text-[15px] font-semibold text-muted">
                  {t.tom.name} · {t.tom.role}
                </p>
                <h3 className="dd-h mt-2 text-[24px] md:text-[28px] leading-[1.15] tracking-[-0.03em] text-ftext [text-wrap:balance]">{t.tom.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.6] text-muted max-w-[560px]">{t.tom.text}</p>
                {t.tom.personal && <p className="mt-3 text-[17px] leading-[1.6] text-ftext max-w-[560px]">{t.tom.personal}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-1">
                  {t.tom.phone && (
                    <a href={`tel:${t.tom.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                      <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
                      {t.tom.phone}
                    </a>
                  )}
                  {t.tom.email && <MailLink className="text-[16px]" label />}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7 Preise (hell): drei Pakete, ein Knopf darunter */}
        <section id="preise" className={`dd-paper ${SEC_SAME}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <Reveal>
              <Title>{t.pricing.title}</Title>
            </Reveal>
            <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
              {t.pricing.tiers.map((tier, i) => {
                const cut = tier.features.length - 3 >= 2 ? 3 : tier.features.length;
                const shown = tier.features.slice(0, cut);
                const rest = tier.features.slice(cut);
                const li = (f: string, extra = '') => (
                  <li key={f} className={`flex items-start gap-3 text-[16px] leading-[1.45] ${extra}`}>
                    <Check className="w-4 h-4 mt-1 shrink-0 text-accent" strokeWidth={2.4} aria-hidden="true" />
                    {f}
                  </li>
                );
                return (
                  <Reveal key={tier.name} delay={i * 110} className={`flex flex-col rounded-[20px] p-6 md:p-8 bg-panel text-ftext ${tier.reco ? 'border-2 border-accent' : 'border border-line'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.16em]">{tier.name}</span>
                      {tier.reco && <span className="text-[14px] font-bold text-accent">{t.pricing.reco}</span>}
                    </div>
                    <div className="mt-2 text-[15px] leading-[1.5] text-muted lg:min-h-[4.5em]">{tier.for}</div>
                    <div className="dd-h mt-4 text-[40px] leading-none tracking-[-0.04em] tabular-nums">{tier.price}</div>
                    <ul className="mt-6 space-y-3 list-none p-0">
                      {shown.map((f) => li(f))}
                      {/* Rechner: alle Leistungen offen */}
                      {rest.map((f) => li(f, 'max-lg:hidden'))}
                    </ul>
                    {/* Handy und Tablet: Rest aufklappbar */}
                    {rest.length > 0 && (
                      <details className="dd-more group mt-3 lg:hidden flex flex-col-reverse">
                        <summary className="inline-flex items-center gap-2 min-h-[44px] cursor-pointer list-none text-[15px] font-semibold text-accent">
                          <span className="group-open:hidden">{t.pricing.more.replace('{n}', String(rest.length))}</span>
                          <span className="hidden group-open:inline">{t.pricing.less}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={2.2} aria-hidden="true" />
                        </summary>
                        <ul className="space-y-3 list-none p-0">{rest.map((f) => li(f))}</ul>
                      </details>
                    )}
                  </Reveal>
                );
              })}
            </div>
            <ul className="mt-8 grid gap-3 list-none p-0 m-0">
              <li className="flex items-start gap-3 text-[16px] leading-[1.5] text-ftext">
                <ShieldCheck className="w-5 h-5 mt-0.5 text-accent shrink-0" strokeWidth={1.8} aria-hidden="true" />
                {t.pricing.care}
              </li>
              <li className="flex items-start gap-3 text-[16px] leading-[1.5] text-ftext">
                <Bot className="w-5 h-5 mt-0.5 text-accent shrink-0" strokeWidth={1.8} aria-hidden="true" />
                {t.pricing.voice}
              </li>
            </ul>
            <p className="mt-4 text-[14px] text-muted">{t.pricing.note}</p>
            <div className={`mt-8 ${stickyHide}`}>
              <Cta onClick={open} className="w-full sm:w-auto">{t.pricing.cta}</Cta>
            </div>
          </div>
        </section>

        {/* 8 FAQ (hell) */}
        <section className={`dd-paper ${SEC} ${SEC_END}`}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 self-start">
              <Title>{t.faq.title}</Title>
            </Reveal>
            <Reveal delay={100} className="border-t border-line">
              {t.faq.items.map((f) => (
                <details key={f.q} className="dd-faq group border-b border-line">
                  <summary className="flex items-center justify-between gap-6 py-5 md:py-6 cursor-pointer list-none font-display font-bold text-[18px] md:text-[20px] leading-snug tracking-[-0.02em] text-ftext hover:text-accent transition-colors">
                    {f.q}
                    <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full border border-line text-accent transition-colors group-open:bg-accent group-open:border-accent group-open:text-white" aria-hidden="true">
                      <Plus className="w-4 h-4 transition-transform duration-300 group-open:rotate-45" strokeWidth={2} />
                    </span>
                  </summary>
                  <p className="pb-6 -mt-1 text-[17px] leading-[1.65] text-muted max-w-[680px]">{withMail(f.a)}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Schluss (dunkel): Website-Feld */}
        <section ref={endRef} className="relative overflow-hidden">
          <div className="dd-glow absolute inset-0 -z-0" aria-hidden="true" />
          <div className="dd-final-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
          <Reveal className="relative max-w-[980px] mx-auto px-4 md:px-10 py-16 md:py-24 text-center">
            <h2 className="dd-h text-[clamp(36px,5vw,64px)] leading-[1.02] text-ftext">
              <Words text={t.cta.title[0]} />
              <span className="block">
                <Words text={ctaRest} />{' '}
                <em className="dd-word not-italic">
                  <span className="dd-em" style={{ '--i': 4 } as React.CSSProperties}>{ctaLast}</span>
                </em>
              </span>
            </h2>
            <p className="mt-5 mx-auto max-w-[560px] text-[17px] md:text-[18px] leading-[1.6] text-muted">{t.cta.text}</p>
            <div className="mt-8">
              <WebsiteField id="dd-website" center onStart={(w) => onRequestDraft(w)} />
            </div>
            <div className="mt-10 inline-flex items-center gap-3 text-left max-w-full">
              <Avatar size={52} />
              <div className="min-w-0 flex flex-col items-start text-[15px] text-muted">
                <span>{withMail(t.cta.mail)}</span>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-line">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-6 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[14px] font-medium text-muted">
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
              <a href="/agb" className="py-2 hover:text-accent transition-colors">{t.footer.terms}</a>
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

export default DresdenPage;
