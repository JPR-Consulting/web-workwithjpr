import React, { useEffect, useState } from 'react';
import CookieBanner from './CookieBanner';
import MagneticButton from './MagneticButton';
import HeroDraftForm from './HeroDraftForm';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import { Eyebrow, SectionTitle, ServiceCell, ProcessStep } from './SectionParts';
import { useReveal } from '../hooks/useReveal';
import { handwerk as t } from '../content/handwerk-copy';
import { copy } from '../content/site-copy';

interface Props {
  onRequestDraft: (website?: string) => void;
  onCall: () => void;
}

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5} className="shrink-0" aria-hidden="true"><path d="M4 12L10 18L20 6" /></svg>
);

/**
 * Landingpage für die Google-Ads-Suchkampagne „Handwerker“.
 * Schlanker als die Startseite: kein Wasser-Shader, kein Karussell, keine Navigationsliste.
 */
const HandwerkPage: React.FC<Props> = ({ onRequestDraft, onCall }) => {
  const [heroIn, setHeroIn] = useState(false);
  const ctaRef = useReveal<HTMLDivElement>();
  const refRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeroIn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const footer = copy.de.footer;

  return (
    <div className="bg-texture bg-ink text-ftext font-body overflow-x-clip selection:bg-accent selection:text-ink">
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center gap-3 px-4 md:px-12 py-4 md:py-5 bg-ink/[0.82] backdrop-blur-md border-b border-line">
        <a href="/" className="font-syne font-extrabold text-[16px] md:text-[19px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap shrink-0">
          JPR <span className="text-accent">Studio</span>&reg;
        </a>
        <MagneticButton
          as="button"
          onClick={() => onRequestDraft()}
          className="inline-flex items-center gap-2 font-mono text-[12px] md:text-[14px] font-medium uppercase bg-accent text-ink px-3 md:px-5 py-2.5 md:py-3 border border-accent hover:bg-transparent hover:text-accent transition-colors whitespace-nowrap shrink-0"
        >
          <span className="md:hidden">{t.nav.ctaShort}</span>
          <span className="hidden md:inline">{t.nav.cta}</span>
        </MagneticButton>
      </nav>

      <main className="relative z-[1]">
        {/* Hero */}
        <header className="px-4 md:px-12 border-b border-line pt-[88px] md:pt-[112px] pb-12 md:pb-14">
          <div className="hidden md:flex justify-between items-center font-mono text-[14px] text-muted uppercase mb-8 gap-2">
            <div>{t.hero.topLeft}</div>
            <div>{t.hero.topRight}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-14 items-center">
            <div className="min-w-0">
              <h1 className="font-syne font-extrabold uppercase text-[clamp(24px,6.4vw,92px)] lg:text-[clamp(30px,calc((100vw-620px)/13.5),80px)] leading-[1.02] tracking-[-0.015em] break-words">
                <span className={`hero-line ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[0]}</span></span>
                <span className={`hero-line hero-line-2 text-accent ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[1]}</span></span>
                <span className={`hero-line hero-line-3 ${heroIn ? 'in' : ''}`} style={{ WebkitTextStroke: '2px #f4f4f0', color: 'transparent' }}>
                  <span>{t.hero.h1[2]}</span>
                </span>
              </h1>
              <p className={`hero-foot ${heroIn ? 'in' : ''} font-body text-[17px] md:text-[22px] leading-[1.45] text-ftext max-w-[560px] mt-4 md:mt-8`}>
                {t.hero.audience}
              </p>
            </div>

            <div id="entwurf" className={`hero-foot ${heroIn ? 'in' : ''} bg-panel border border-line p-5 md:p-7`}>
              <h2 className="font-syne font-bold text-[20px] md:text-[24px] leading-tight mb-2">{t.hero.formTitle}</h2>
              <p className="font-body text-[16px] leading-[1.5] text-[#d8d8de] mb-5">{t.hero.offer}</p>
              <HeroDraftForm
                stacked
                ctaLabel={t.hero.cta}
                onStart={onRequestDraft}
                onPricing={() => document.getElementById('preise')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              />
            </div>
          </div>

          <div className={`hero-proof ${heroIn ? 'in' : ''} flex gap-x-8 gap-y-3 flex-wrap mt-8 md:mt-10 pt-6 border-t border-line font-body text-[16px] md:text-[17px] text-muted`}>
            {t.hero.proofs.map((proof) => (
              <span key={proof} className="inline-flex items-center gap-2.5">
                {checkIcon}
                <span>{proof}</span>
              </span>
            ))}
          </div>
        </header>

        {/* [01] Problem */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.problem.eyebrow}</Eyebrow>
          <SectionTitle>{t.problem.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {t.problem.items.map((s, i) => (
              <ServiceCell key={s.title} idx={`/ 00${i + 1}`} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        {/* [02] Was du bekommst */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.features.eyebrow}</Eyebrow>
          <SectionTitle>{t.features.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {t.features.items.map((s, i) => (
              <ServiceCell key={s.title} idx={`/ 00${i + 1}`} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        {/* [03] Referenz */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.reference.eyebrow}</Eyebrow>
          <SectionTitle>{t.reference.title}</SectionTitle>
          <div ref={refRef} className="reveal grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-14 items-center">
            <a
              href={t.reference.href}
              target="_blank"
              rel="noopener"
              aria-label={t.reference.link}
              className="group block border border-line bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="flex items-center gap-2 px-4 h-10 border-b border-line">
                <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                <span className="ml-3 font-mono text-[13px] text-muted truncate">{t.reference.url}</span>
              </div>
              <img
                src={t.reference.img}
                alt={t.reference.alt}
                width={1200}
                height={750}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto"
              />
            </a>
            <div>
              <p className="text-[18px] leading-[1.7] text-muted mb-6 max-w-[520px]">{t.reference.text}</p>
              <a
                href={t.reference.href}
                target="_blank"
                rel="noopener"
                className="font-mono text-[14px] uppercase text-accent hover:text-ftext transition-colors py-2 inline-block"
              >
                {t.reference.link}
              </a>
            </div>
          </div>
        </section>

        {/* [04] Ablauf */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.process.eyebrow}</Eyebrow>
          <SectionTitle>{t.process.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {t.process.steps.map((s, i) => (
              <ProcessStep key={s.title} n={`0${i + 1}`} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        <PricingSection onRequestDraft={() => onRequestDraft()} onHome eyebrow={t.pricingEyebrow} />
        <FAQSection onHome eyebrow={t.faq.eyebrow} title={t.faq.title} items={t.faq.items} />

        {/* CTA */}
        <section className="px-6 md:px-12 border-b border-line bg-accent text-ink py-16 md:py-24">
          <div ref={ctaRef} className="reveal flex justify-between items-center gap-10 flex-wrap">
            <h2 className="font-syne font-extrabold text-[clamp(28px,6vw,78px)] leading-[1.04] uppercase tracking-[-0.015em] break-words max-w-full">
              {t.cta.title[0]}<br />{t.cta.title[1]}
            </h2>
            <div className="max-w-[380px]">
              <p className="text-[18px] leading-[1.6] mb-6">{t.cta.text}</p>
              <MagneticButton
                as="button"
                onClick={() => onRequestDraft()}
                className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-ink text-ftext px-7 py-4 border border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                {t.cta.button}
              </MagneticButton>
              <button type="button" onClick={onCall} className="block mt-5 text-[16px] underline underline-offset-4 hover:opacity-70 transition-opacity text-left">
                {t.cta.call}
              </button>
            </div>
          </div>
        </section>

        {/* Footer (auf Mobil Luft für die feste CTA-Leiste) */}
        <footer className="px-6 md:px-12 flex flex-col md:flex-row md:justify-between md:items-center gap-5 pt-8 pb-28 md:pb-8 font-mono text-[14px] text-muted uppercase">
          <div className="leading-[1.7] normal-case">{footer.company}</div>
          <div className="flex gap-x-6 gap-y-3 items-center flex-wrap">
            <a href="/impressum" className="text-muted hover:text-accent transition-colors">{footer.imprint}</a>
            <a href="/datenschutz" className="text-muted hover:text-accent transition-colors">{footer.privacy}</a>
          </div>
        </footer>
      </main>

      {/* Feste CTA-Leiste, nur Mobil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-ink/95 backdrop-blur-md border-t border-line">
        <button
          type="button"
          onClick={() => onRequestDraft()}
          className="w-full h-12 font-mono text-[14px] font-medium uppercase bg-accent text-ink border border-accent active:scale-[0.98] transition-transform"
        >
          {t.sticky}
        </button>
      </div>

      <CookieBanner />
    </div>
  );
};

export default HandwerkPage;
