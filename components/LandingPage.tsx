import React, { useEffect, useState } from 'react';
import CookieBanner from './CookieBanner';
import MagneticButton from './MagneticButton';
import HeroDraftForm from './HeroDraftForm';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import { Eyebrow, SectionTitle, ServiceCell, ProcessStep } from './SectionParts';
import { useReveal } from '../hooks/useReveal';
import type { LandingCopy } from '../content/handwerk-copy';
import { copy } from '../content/site-copy';

interface Props {
  t: LandingCopy;
  onRequestDraft: (website?: string) => void;
  onCall: () => void;
}

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="shrink-0 text-accent" aria-hidden="true"><path d="M4 12L10 18L20 6" /></svg>
);

/**
 * Branchen-Landingpage für Google-Ads-Suchkampagnen (Handwerk, Praxis, …); Texte, Hero-Foto
 * und Thema kommen aus dem Copy-Objekt. Schlanker als die Startseite: kein Wasser-Shader,
 * kein Karussell, keine Navigationsliste.
 */
const LandingPage: React.FC<Props> = ({ t, onRequestDraft, onCall }) => {
  const [heroIn, setHeroIn] = useState(false);
  const ctaRef = useReveal<HTMLDivElement>();
  const refRef = useReveal<HTMLDivElement>();
  const aboutRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeroIn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const footer = copy.de.footer;
  const about = copy.de.about;
  const otherProjects = copy.de.projects.items.filter((p) => p.title !== t.reference.exclude);
  const img = t.hero.img;

  return (
    <div className="bg-texture bg-ink text-ftext font-body overflow-x-clip selection:bg-accent selection:text-ink">
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center gap-3 px-4 md:px-12 py-4 md:py-5 bg-ink/[0.82] backdrop-blur-md border-b border-line">
        <a href="/" className="font-syne font-extrabold text-[16px] md:text-[19px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap shrink-0">
          JPR <span className="text-accent">Studio</span>&reg;
        </a>
        <div className="flex items-center gap-6 lg:gap-8">
          <a href="/" className="hidden md:inline font-mono text-[14px] uppercase text-muted hover:text-accent transition-colors whitespace-nowrap">
            {t.nav.all}
          </a>
          <MagneticButton
            as="button"
            onClick={() => onRequestDraft()}
            className="inline-flex items-center gap-2 font-mono text-[12px] md:text-[14px] font-medium uppercase bg-accent text-ink px-3 md:px-5 py-2.5 md:py-3 border border-accent hover:bg-transparent hover:text-accent transition-colors whitespace-nowrap shrink-0"
          >
            <span className="md:hidden">{t.nav.ctaShort}</span>
            <span className="hidden md:inline">{t.nav.cta}</span>
          </MagneticButton>
        </div>
      </nav>

      <main className="relative z-[1]">
        {/* Hero */}
        <header className="relative isolate overflow-hidden px-4 md:px-12 border-b border-line pt-[88px] md:pt-[112px] pb-12 md:pb-14">
          {/* Foto: auf Mobil als Hintergrund hinter allem, ab lg als Quadrat rechts der Headline */}
          <div
            className="absolute inset-0 -z-10 lg:inset-y-0 lg:left-auto lg:right-[20%] lg:w-auto lg:h-full lg:aspect-square overflow-hidden lg:[mask-image:linear-gradient(to_right,transparent,#000_30%,#000_70%,transparent)]"
          >
            <div className={`w-full h-full ${img.flip ? '-scale-x-100' : ''}`}>
            <img
              src={`${img.base}-768.webp`}
              srcSet={`${img.base}-480.webp 480w, ${img.base}-768.webp 768w, ${img.base}-1024.webp 1024w`}
              sizes="(min-width: 1024px) 700px, 660px"
              width={1024}
              height={1024}
              alt={t.hero.imgAlt}
              fetchPriority="high"
              decoding="async"
              className={`kenburns w-full h-full object-cover ${img.pos}`}
            />
            </div>
          </div>
          <div className="lp-shade absolute inset-0 -z-10 bg-ink/[0.68] lg:bg-[linear-gradient(to_right,rgb(var(--c-ink)/0.94)_0%,rgb(var(--c-ink)/0.82)_38%,rgb(var(--c-ink)/0.45)_62%,rgb(var(--c-ink)/0.2)_100%)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />
          <div className="hidden md:flex justify-between items-center font-mono text-[14px] text-muted uppercase mb-8 gap-2">
            <div>{t.hero.topLeft}</div>
            <div>{t.hero.topRight}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-14 items-center">
            <div className="min-w-0 [text-shadow:0_2px_18px_rgb(var(--c-ink)/0.7)]">
              <h1 className="font-syne font-extrabold uppercase text-[clamp(24px,6.4vw,92px)] lg:text-[clamp(30px,calc((100vw-620px)/13.5),80px)] leading-[1.02] tracking-[-0.015em] break-words">
                <span className={`hero-line ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[0]}</span></span>
                <span className={`hero-line hero-line-2 text-accent ${heroIn ? 'in' : ''}`}><span>{t.hero.h1[1]}</span></span>
                <span className={`hero-line hero-line-3 ${heroIn ? 'in' : ''}`} style={{ WebkitTextStroke: '2px rgb(var(--c-ftext))', color: 'transparent' }}>
                  <span>{t.hero.h1[2]}</span>
                </span>
              </h1>
              <p className={`hero-foot ${heroIn ? 'in' : ''} font-body text-[17px] md:text-[22px] leading-[1.45] text-ftext max-w-[560px] mt-4 md:mt-8`}>
                {t.hero.audience}
              </p>
            </div>

            <div id="entwurf" className={`hero-foot ${heroIn ? 'in' : ''} bg-panel/[0.92] backdrop-blur-md border border-line p-5 md:p-7`}>
              <h2 className="font-syne font-bold text-[20px] md:text-[24px] leading-tight mb-2">{t.hero.formTitle}</h2>
              <p className="font-body text-[16px] leading-[1.5] text-ftext/85 mb-5">{t.hero.offer}</p>
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

        {/* Gewerke-Marquee */}
        <section className="overflow-hidden border-b border-line" aria-label={t.trades.ariaLabel}>
          <div className="font-mono text-[14px] text-accent uppercase pt-3.5 px-6 md:px-12">{t.trades.label}</div>
          <div className="flex whitespace-nowrap w-max pt-[14px] pb-[18px] overflow-hidden">
            <div className="marquee-track flex items-baseline whitespace-nowrap font-syne font-bold text-[21px] uppercase tracking-[-0.01em] text-ftext" style={{ animationDuration: "80s" }}>
              {[0, 1].map((half) => (
                <span key={half} className="flex" aria-hidden={half === 1 ? true : undefined}>
                  {[0, 1].map((rep) => (
                    <React.Fragment key={rep}>
                      {t.trades.items.map((name) => (
                        <React.Fragment key={name}>
                          <span className="px-7">{name}</span>
                          <span className="text-accent self-center" aria-hidden="true">✦</span>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

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

        {/* [03] Büro-Autopilot (nur Seiten mit autopilot-Block) */}
        {t.autopilot && (
          <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
            <Eyebrow>{t.autopilot.eyebrow}</Eyebrow>
            <SectionTitle>{t.autopilot.title}</SectionTitle>
            <p className="text-[18px] leading-[1.7] text-muted -mt-6 mb-10 max-w-[680px]">{t.autopilot.intro}</p>

            <div className="font-mono text-[14px] text-accent uppercase mb-4">{t.autopilot.flowLabel}</div>
            <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-line border border-line list-none p-0 m-0">
              {t.autopilot.steps.map((s, i) => (
                <li key={s.title} className="relative bg-ink p-7 md:p-8">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="font-mono text-[13px] uppercase text-ink bg-accent px-2.5 py-1">{s.time}</span>
                    <span className="font-syne font-extrabold text-[28px] leading-none text-line" aria-hidden="true">0{i + 1}</span>
                  </div>
                  <h3 className="font-syne font-bold text-[22px] leading-tight mb-3">{s.title}</h3>
                  <p className="text-[16px] leading-[1.6] text-muted">{s.desc}</p>
                </li>
              ))}
            </ol>

            <div className="font-mono text-[14px] text-muted uppercase mt-12 mb-4">{t.autopilot.moreLabel}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
              {t.autopilot.more.map((m) => (
                <div key={m.title} className="bg-ink p-7 md:p-8">
                  <h3 className="font-syne font-bold text-[20px] leading-tight mb-2">{m.title}</h3>
                  <p className="text-[16px] leading-[1.6] text-muted">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="text-[17px] leading-[1.6] text-ftext max-w-[620px]">{t.autopilot.note}</p>
              <button
                type="button"
                onClick={onCall}
                className="self-start md:self-auto inline-flex items-center min-h-[48px] font-mono text-[14px] font-medium uppercase text-accent border border-accent px-6 py-3 hover:bg-accent hover:text-ink transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t.autopilot.cta}
              </button>
            </div>
          </section>
        )}

        {/* [04] Referenz */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.reference.eyebrow}</Eyebrow>
          <SectionTitle>{t.reference.title}</SectionTitle>
          {t.reference.demos.length > 0 ? (
            <div ref={refRef} className="reveal">
              <p className="text-[18px] leading-[1.7] text-muted mb-10 max-w-[680px]">{t.reference.text}</p>
              <ul className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 list-none p-0">
                {t.reference.demos.map((d) => (
                  <li key={d.title} className="border border-line bg-panel">
                    <div className="flex items-center gap-2 px-4 h-9 border-b border-line">
                      <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                      <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                      <span className="w-2.5 h-2.5 rounded-full bg-line" aria-hidden="true" />
                      <span className="ml-auto font-mono text-[12px] uppercase text-accent">{t.reference.demoBadge}</span>
                    </div>
                    <img src={d.img} alt={d.alt} width={1200} height={750} loading="lazy" decoding="async" className="block w-full h-auto" />
                    <div className="p-4 border-t border-line">
                      <div className="font-syne font-bold text-[18px] mb-1">{d.title}</div>
                      <div className="text-[15px] leading-[1.5] text-muted">{d.tag}</div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Echte Referenz unter den Beispiel-Entwürfen (z. B. RopeFX auf der Handwerk-Seite) */}
              {t.reference.href && (
                <div className="mt-14 md:mt-16 pt-8 border-t border-line">
                  <div className="font-mono text-[14px] text-muted uppercase mb-6">{t.reference.moreLabel}</div>
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-6 md:gap-10 items-center">
                    <a
                      href={t.reference.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={t.reference.link}
                      className="block border border-line bg-panel hover:border-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <img src={t.reference.img} alt={t.reference.alt} width={1200} height={750} loading="lazy" decoding="async" className="block w-full h-auto" />
                    </a>
                    <div>
                      <p className="text-[17px] leading-[1.7] text-muted mb-4 max-w-[560px]">{t.reference.realText}</p>
                      <a
                        href={t.reference.href}
                        target="_blank"
                        rel="noopener"
                        className="font-mono text-[14px] uppercase text-accent hover:text-ftext transition-colors py-3 inline-block"
                      >
                        {t.reference.link}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
                <p className="text-[18px] leading-[1.7] text-muted mb-6 max-w-[520px]">{t.reference.realText || t.reference.text}</p>
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

            <div className="mt-14 md:mt-16 pt-8 border-t border-line">
              <div className="font-mono text-[14px] text-muted uppercase mb-6">{t.reference.moreLabel}</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 list-none p-0">
                {otherProjects.map((p) => (
                  <li key={p.title}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      className="group block border border-line bg-panel hover:border-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <img
                        src={p.img}
                        alt={`${copy.de.projects.altPrefix} ${p.title}`}
                        width={1200}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        className="block w-full aspect-[16/10] object-cover object-top"
                      />
                      <div className="p-4">
                        <div className="font-syne font-bold text-[18px] mb-1">{p.title}</div>
                        <div className="text-[15px] leading-[1.5] text-muted mb-2">{p.tag}</div>
                        <div className="font-mono text-[13px] uppercase text-accent group-hover:text-ftext transition-colors">{p.url} →</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            </>
          )}
        </section>

        {/* Über mich (Kurzfassung) */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <div ref={aboutRef} className="reveal flex gap-8 md:gap-14 items-center flex-wrap">
            <div className="relative w-[200px] h-[240px] md:w-[280px] md:h-[330px] flex-shrink-0 overflow-hidden group">
              <img
                src="/jan-rojek.webp"
                alt={about.photoAlt}
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale contrast-[1.05] transition-[filter] duration-500 group-hover:grayscale-0"
              />
              <div className="absolute bottom-0 left-0 px-3 py-2 bg-accent text-ink font-mono text-[12px] md:text-[13px] font-medium uppercase">
                {about.badge}
              </div>
            </div>
            <div className="flex-1 min-w-[260px] max-w-[620px]">
              <h2 className="font-syne font-extrabold uppercase text-[clamp(30px,3.6vw,48px)] tracking-[-0.015em] mb-5">
                {about.hello} <span className="text-accent">{about.name}</span>
              </h2>
              <p className="text-[17px] leading-[1.7] text-muted mb-4">{t.about.text || about.paragraphs[1]}</p>
              <p className="text-[17px] leading-[1.7] text-ftext font-medium mb-4">{t.about.highlight || about.highlight}</p>
              <div className="mt-6 pt-5 border-t border-line font-mono text-[14px] text-muted uppercase">{t.about.fact}</div>
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
            <a href="/" className="text-muted hover:text-accent transition-colors">{t.footer.home}</a>
            <a href="/preise" className="text-muted hover:text-accent transition-colors">{t.footer.pricing}</a>
            <a href="/blog" className="text-muted hover:text-accent transition-colors">{t.footer.blog}</a>
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

export default LandingPage;
