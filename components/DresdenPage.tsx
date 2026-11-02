import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Bot, CalendarX, Check, Mail, Mic, MicOff, Phone, Plus } from 'lucide-react';
import CookieBanner from './CookieBanner';
import { useReveal } from '../hooks/useReveal';
import { dresden as t } from '../content/dresden-copy';
import { copy } from '../content/site-copy';

interface Props {
  onRequestDraft: (website?: string) => void;
}

/**
 * Landingpage /dresden: Toms Visitenkarte für Betriebe in Dresden (Sie-Form, JPR Consulting GmbH).
 * Eigenes ruhiges Thema (warmes Dunkel + Papier, Gold statt Lime, Fraunces + Manrope); Farben über
 * die CSS-Variablen in index.css (html.theme-dresden, .dd-paper). Alle Knöpfe öffnen den Entwurf-Dialog.
 */

const Reveal: React.FC<{ className?: string; children: React.ReactNode; as?: 'div' | 'li' }> = ({ className = '', children, as = 'div' }) => {
  const ref = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return <Tag ref={ref} className={`reveal ${className}`}>{children}</Tag>;
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 font-manrope text-[13px] font-semibold uppercase tracking-[0.18em] text-accent mb-5">
    <span className="w-8 h-px bg-accent" aria-hidden="true" />
    {children}
  </div>
);

const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`font-fraunces font-normal text-[clamp(32px,4.2vw,58px)] leading-[1.06] tracking-[-0.015em] text-ftext ${className}`}>{children}</h2>
);

const Cta: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; ctaRef?: React.Ref<HTMLButtonElement> }> = ({ onClick, children, className = '', ctaRef }) => (
  <button ref={ctaRef} type="button" onClick={onClick} className={`dd-btn group inline-flex items-center justify-center gap-3 min-h-[56px] px-7 rounded-full font-manrope text-[16px] font-bold ${className}`}>
    {children}
    <ArrowRight className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} aria-hidden="true" />
  </button>
);

/** Rechner-Rahmen mit Handy davor: zeigt einen Beispiel-Entwurf auf beiden Geräten. */
const Devices: React.FC<{ desktop: string; mobile: string; alt: string; eager?: boolean; className?: string }> = ({ desktop, mobile, alt, eager, className = '' }) => (
  <div className={`relative pl-[9%] pb-[7%] ${className}`}>
    <div className="rounded-[12px] overflow-hidden border border-[rgb(255_255_255/0.12)] bg-[#0d0c0b] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-1.5 px-3 h-6 md:h-7 bg-[#1b1916] border-b border-[rgb(255_255_255/0.08)]" aria-hidden="true">
        <span className="w-2 h-2 rounded-full bg-[#3a352f]" />
        <span className="w-2 h-2 rounded-full bg-[#3a352f]" />
        <span className="w-2 h-2 rounded-full bg-[#3a352f]" />
      </div>
      <img
        src={`${desktop}-desktop.webp`}
        alt={alt}
        width={1200}
        height={750}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className="block w-full h-auto"
      />
    </div>
    <div className="absolute left-0 bottom-0 w-[27%] rounded-[18px] md:rounded-[22px] overflow-hidden border-[4px] md:border-[5px] border-[#0d0c0b] bg-[#0d0c0b] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.75)] ring-1 ring-[rgb(255_255_255/0.14)]">
      <img src={`${mobile}-mobile.webp`} alt="" width={585} height={1266} loading={eager ? 'eager' : 'lazy'} decoding="async" className="block w-full h-auto" />
    </div>
  </div>
);

const Monogram: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => (
  <span
    aria-hidden="true"
    className={`relative grid place-items-center shrink-0 rounded-full border border-accent/70 font-fraunces text-accent ${
      size === 'lg' ? 'w-24 h-24 md:w-28 md:h-28 text-[34px] md:text-[40px]' : 'w-11 h-11 text-[16px]'
    }`}
  >
    <span className={`absolute rounded-full border border-accent/25 ${size === 'lg' ? 'inset-[6px]' : 'inset-[3px]'}`} />
    <span className="italic leading-none tracking-[-0.02em]">{t.tom.initials}</span>
  </span>
);

const DresdenPage: React.FC<Props> = ({ onRequestDraft }) => {
  const [heroIn, setHeroIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const heroCta = useRef<HTMLButtonElement>(null);
  const open = () => onRequestDraft();
  const pricing = copy.de.pricing;
  const quotes = copy.de.testimonials.items;

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeroIn(true)));
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Feste Leiste unten (Handy) erst, wenn der Hero-Knopf aus dem Bild ist
  useEffect(() => {
    const el = heroCta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toExamples = () => document.getElementById('beispiele')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="dd bg-ink text-ftext font-manrope overflow-x-clip selection:bg-accent selection:text-ink">
      {/* Navigation */}
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-300 border-b ${
          scrolled ? 'bg-ink/[0.86] backdrop-blur-md border-line' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 px-4 md:px-10 h-[64px] md:h-[76px]">
          <a href="/" className="flex items-center gap-3 min-w-0">
            <span className="font-syne font-extrabold text-[14px] min-[400px]:text-[15px] md:text-[18px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap">
              JPR <span className="text-accent">Studio</span>&reg;
            </span>
            <span className="hidden min-[400px]:inline w-px h-4 bg-line" aria-hidden="true" />
            <span className="hidden min-[400px]:inline font-manrope text-[13px] md:text-[14px] font-medium tracking-[0.08em] uppercase text-muted">{t.nav.place}</span>
          </a>
          <button type="button" onClick={open} className="dd-btn inline-flex items-center gap-2 h-10 md:h-11 px-4 md:px-5 rounded-full font-manrope text-[13px] md:text-[14px] font-bold whitespace-nowrap shrink-0">
            {t.nav.cta}
            <ArrowRight className="hidden sm:block w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <header className="dd-hero relative isolate overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-[92px] md:pt-[150px] pb-16 md:pb-28 grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] gap-12 lg:gap-14 items-center">
            <div className="min-w-0">
              <div className={`hero-foot ${heroIn ? 'in' : ''}`}>
                <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="font-fraunces font-normal text-[clamp(38px,5.2vw,76px)] leading-[1.04] tracking-[-0.02em] text-ftext">
                <span className={`hero-line ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[0]}</span></span>
                <span className={`hero-line hero-line-2 ${heroIn ? 'in' : ''}`}>
                  <span>
                    <em className="italic text-accent">{t.hero.h1[1]}</em> {t.hero.h1[2]}
                  </span>
                </span>
              </h1>
              <p className={`hero-foot ${heroIn ? 'in' : ''} mt-6 md:mt-8 max-w-[560px] text-[17px] md:text-[20px] leading-[1.6] text-muted`}>{t.hero.sub}</p>
              <div className={`hero-foot ${heroIn ? 'in' : ''} mt-8 md:mt-10 flex flex-wrap items-center gap-x-7 gap-y-4`}>
                <Cta onClick={open} ctaRef={heroCta} className="w-full sm:w-auto">{t.hero.cta}</Cta>
                <button type="button" onClick={toExamples} className="inline-flex items-center gap-2 min-h-[44px] font-manrope text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                  {t.hero.secondary}
                  <ArrowDown className="w-4 h-4" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>
              <div className={`hero-proof ${heroIn ? 'in' : ''} mt-10 md:mt-12 pt-6 border-t border-line flex items-center gap-4`}>
                <Monogram size="sm" />
                <div className="min-w-0">
                  <div className="font-fraunces text-[19px] leading-tight text-ftext">{t.tom.name}</div>
                  <div className="text-[14px] text-muted">{t.tom.role}</div>
                </div>
              </div>
              <ul className={`hero-proof ${heroIn ? 'in' : ''} mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted list-none p-0`}>
                {t.hero.proofs.map((p) => (
                  <li key={p} className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" strokeWidth={2.4} aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`hero-foot ${heroIn ? 'in' : ''} min-w-0`}>
              <Devices desktop="/dresden/beispiel-carhifi" mobile="/dresden/beispiel-shk" alt={t.hero.deviceAlt} eager />
            </div>
          </div>
        </header>

        {/* Zielgruppen-Leiste */}
        <section aria-label={t.audience.label} className="border-y border-line">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-5 flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-manrope text-[13px] font-semibold uppercase tracking-[0.18em] text-dim">{t.audience.label}</span>
            {t.audience.items.map((a, i) => (
              <span key={a} className="inline-flex items-center gap-8 font-fraunces text-[19px] md:text-[22px] text-ftext">
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
            <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {t.outcomes.items.map((o, i) => (
                <Reveal key={o.title} className="border-t border-line pt-7">
                  <div className="font-fraunces italic text-[40px] leading-none text-accent mb-6">0{i + 1}</div>
                  <h3 className="font-fraunces text-[24px] md:text-[26px] leading-[1.2] mb-3 text-ftext">{o.title}</h3>
                  <p className="text-[17px] leading-[1.65] text-muted">{o.desc}</p>
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
                      <span className="block font-fraunces text-[21px] leading-tight text-ftext mb-1">{n.title}</span>
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

            {/* Gestaltetes Beispiel: Gesprächsausschnitt + Auftragskarte (kein Live-Assistent) */}
            <Reveal className="lg:sticky lg:top-28">
              <div className="rounded-[24px] border border-line bg-panel p-5 md:p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="relative grid place-items-center w-10 h-10 rounded-full bg-accent text-ink" aria-hidden="true">
                    <span className="absolute inset-[-5px] rounded-full border border-accent/40" />
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
                      className={`max-w-[88%] rounded-[16px] px-4 py-3 text-[15px] leading-[1.5] ${
                        m.who === 'ki' ? 'bg-[rgb(255_255_255/0.06)] text-ftext rounded-tl-[4px]' : 'ml-auto bg-accent/[0.16] text-ftext rounded-tr-[4px]'
                      }`}
                    >
                      <span className="sr-only">{m.who === 'ki' ? 'KI-Assistentin: ' : 'Kundin: '}</span>
                      {m.text}
                    </p>
                  ))}
                </div>
                <div className="rounded-[16px] bg-[#F4EFE7] text-[#1c1916] p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.12em]">{t.voice.card.number}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9E3B24] text-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
                      {t.voice.card.badge}
                    </span>
                  </div>
                  <dl className="divide-y divide-[#e2d8c8] m-0">
                    {t.voice.card.rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-2.5 text-[15px]">
                        <dt className="text-[#6b6156]">{k}</dt>
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
            <ul className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 list-none p-0">
              {t.examples.items.map((e) => (
                <Reveal as="li" key={e.title}>
                  <div className="rounded-[22px] bg-[#1c1916] px-5 pt-7 pb-6 md:px-7">
                    <Devices desktop={e.img} mobile={e.img} alt={`${t.examples.badge}: ${e.title}`} />
                  </div>
                  <div className="mt-6">
                    <span className="inline-block rounded-full border border-accent/50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-accent">{t.examples.badge}</span>
                    <h3 className="mt-3 font-fraunces text-[24px] leading-tight text-ftext">{e.title}</h3>
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
            <Reveal className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-center rounded-[28px] border border-line bg-panel p-7 md:p-12">
              <Monogram />
              <div className="min-w-0">
                <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.18em] text-accent mb-3">{t.tom.eyebrow}</div>
                <h2 className="font-fraunces font-normal text-[clamp(30px,3.4vw,46px)] leading-[1.08] tracking-[-0.015em] text-ftext">
                  {t.tom.name}
                  <span className="block text-muted text-[0.6em] mt-2 italic">{t.tom.role}</span>
                </h2>
                <p className="mt-5 text-[17px] leading-[1.65] text-muted max-w-[640px]">{t.tom.text}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Cta onClick={open}>{t.tom.cta}</Cta>
                  {t.tom.phone && (
                    <a href={`tel:${t.tom.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                      <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
                      {t.tom.phone}
                    </a>
                  )}
                  {t.tom.email && (
                    <a href={`mailto:${t.tom.email}`} className="inline-flex items-center gap-2 min-h-[44px] text-[16px] font-semibold text-ftext hover:text-accent transition-colors">
                      <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
                      {t.tom.email}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-24 md:mt-32">
              <Eyebrow>{t.process.eyebrow}</Eyebrow>
              <Title>{t.process.title}</Title>
            </Reveal>
            <ol className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-8 list-none p-0">
              {t.process.steps.map((s, i) => (
                <Reveal as="li" key={s.title} className="relative border-t border-line pt-7">
                  <span className="absolute -top-[5px] left-0 w-[9px] h-[9px] rounded-full bg-accent" aria-hidden="true" />
                  <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.18em] text-dim mb-3">Schritt {i + 1}</div>
                  <h3 className="font-fraunces text-[24px] leading-tight text-ftext mb-3">{s.title}</h3>
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
            <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pricing.tiers.map((tier) => (
                <Reveal
                  key={tier.name}
                  className={`flex flex-col rounded-[24px] p-7 md:p-9 ${tier.reco ? 'bg-[#1c1916] text-[#F3EEE6]' : 'bg-panel border border-line text-ftext'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.16em]">{tier.name}</span>
                    {tier.reco && <span className="rounded-full bg-[#C9A46A] text-[#17140F] px-3 py-1 text-[12px] font-bold">Empfohlen</span>}
                  </div>
                  <div className={`mt-2 text-[15px] ${tier.reco ? 'text-[#BFB6A9]' : 'text-muted'}`}>{tier.for}</div>
                  <div className="mt-6 font-fraunces text-[44px] leading-none tracking-[-0.02em]">{tier.price}</div>
                  <ul className="mt-7 space-y-3 list-none p-0 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[16px] leading-[1.45]">
                        <Check className={`w-4 h-4 mt-1 shrink-0 ${tier.reco ? 'text-[#C9A46A]' : 'text-accent'}`} strokeWidth={2.4} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={open}
                    className={`mt-8 min-h-[52px] rounded-full font-manrope text-[15px] font-bold transition-colors ${
                      tier.reco ? 'dd-btn' : 'border border-ftext/25 text-ftext hover:border-accent hover:text-accent'
                    }`}
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
              {t.trust.facts.map((f) => (
                <Reveal key={f.title} className="border-t border-line pt-6">
                  <h3 className="font-fraunces text-[22px] leading-tight text-ftext mb-2">{f.title}</h3>
                  <p className="text-[16px] leading-[1.65] text-muted">{f.desc}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-20 md:mt-24">
              <div className="font-manrope text-[13px] font-semibold uppercase tracking-[0.18em] text-dim mb-8">{t.trust.quotesLabel}</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quotes.map((q) => (
                  <Reveal key={q.name} className="rounded-[24px] border border-line p-7 md:p-10">
                    <figure className="m-0">
                      <blockquote className="m-0 font-fraunces italic text-[21px] md:text-[24px] leading-[1.45] text-ftext">„{q.quote}“</blockquote>
                      <figcaption className="mt-6 text-[15px]">
                        <span className="font-semibold text-ftext">{q.name}</span>
                        <span className="text-muted"> · {q.company}</span>
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
            <Reveal>
              <Eyebrow>{t.faq.eyebrow}</Eyebrow>
              <Title>{t.faq.title}</Title>
            </Reveal>
            <div className="border-t border-line">
              {t.faq.items.map((f) => (
                <details key={f.q} className="dd-faq group border-b border-line">
                  <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none font-fraunces text-[20px] md:text-[22px] leading-snug text-ftext hover:text-accent transition-colors">
                    {f.q}
                    <Plus className="w-5 h-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" strokeWidth={1.8} aria-hidden="true" />
                  </summary>
                  <p className="pb-7 -mt-1 text-[17px] leading-[1.7] text-muted max-w-[680px]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Abschluss */}
        <section className="relative overflow-hidden">
          <div className="dd-glow absolute inset-0 -z-0" aria-hidden="true" />
          <Reveal className="relative max-w-[980px] mx-auto px-4 md:px-10 py-24 md:py-36 text-center">
            <h2 className="font-fraunces font-normal text-[clamp(40px,6.4vw,92px)] leading-[1.02] tracking-[-0.02em] text-ftext">
              {t.cta.title[0]}
              <span className="block italic text-accent">{t.cta.title[1]}</span>
            </h2>
            <p className="mt-7 mx-auto max-w-[560px] text-[17px] md:text-[19px] leading-[1.6] text-muted">{t.cta.text}</p>
            <div className="mt-10 flex justify-center">
              <Cta onClick={open}>{t.cta.button}</Cta>
            </div>
            <div className="mt-10 inline-flex items-center gap-3 text-left">
              <Monogram size="sm" />
              <span className="text-[15px] text-muted">
                <span className="text-ftext font-semibold">{t.tom.name}</span> · {t.tom.role}
              </span>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-line">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-10 pb-28 md:pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[14px] text-muted">
            <div className="flex flex-col gap-2">
              <span className="font-syne font-extrabold text-[16px] uppercase text-ftext">JPR <span className="text-accent">Studio</span>&reg;</span>
              <span>{copy.de.footer.company}</span>
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

      {/* Feste Leiste unten, nur Handy, sobald der Hero-Knopf weg ist */}
      <div
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-ink/95 backdrop-blur-md border-t border-line transition-transform duration-300 ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showSticky}
      >
        <button type="button" tabIndex={showSticky ? 0 : -1} onClick={open} className="dd-btn w-full h-12 rounded-full font-manrope text-[15px] font-bold">
          {t.sticky}
        </button>
      </div>

      <CookieBanner />
    </div>
  );
};

export default DresdenPage;
