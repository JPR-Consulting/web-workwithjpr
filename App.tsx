import React, { useState, useEffect, useRef } from 'react';
import Imprint from './components/Imprint';
import Privacy from './components/Privacy';
import CookieBanner from './components/CookieBanner';
import CustomCursor from './components/CustomCursor';
import MagneticButton from './components/MagneticButton';
import WaterHeadline from './components/WaterHeadline';
import WaterImage from './components/WaterImage';
import ScrambleLabel from './components/ScrambleLabel';
import ProjectCarousel from './components/ProjectCarousel';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import BlogIndex from './components/BlogIndex';
import BlogPostView from './components/BlogPost';
import PreisePage from './components/PreisePage';
import { useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { getPostBySlug } from './content/blog';
import { copy, paths, type Lang } from './content/site-copy';
import { LangContext, LangSwitch, useCopy } from './i18n';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

type ViewState = 'HOME' | 'IMPRINT' | 'PRIVACY' | 'BLOG' | 'BLOG_POST' | 'PREISE';

const SITE = 'https://workwithjpr.com';

/**
 * Adresse -> Ansicht. `lang` ist nur bei Seiten gesetzt, die es in beiden
 * Sprachen gibt (Start, Preise); Blog und Rechtstexte sind nur deutsch und
 * ändern die gewählte Sprache nicht.
 */
function parseLocation(path: string): { view: ViewState; slug: string; lang: Lang | null } {
  if (path === paths.home.en || path === `${paths.home.en}/`) return { view: 'HOME', slug: '', lang: 'en' };
  if (path === paths.pricing.en) return { view: 'PREISE', slug: '', lang: 'en' };
  if (path === paths.pricing.de) return { view: 'PREISE', slug: '', lang: 'de' };
  if (path === '/imprint' || path === '/impressum') return { view: 'IMPRINT', slug: '', lang: null };
  if (path === '/privacy' || path === '/datenschutz') return { view: 'PRIVACY', slug: '', lang: null };
  if (path === '/blog') return { view: 'BLOG', slug: '', lang: null };
  if (path.startsWith('/blog/')) return { view: 'BLOG_POST', slug: path.replace('/blog/', ''), lang: null };
  return { view: 'HOME', slug: '', lang: path.startsWith('/en/') ? 'en' : 'de' };
}

function pathFor(view: ViewState, lang: Lang, slug: string): string {
  if (view === 'HOME') return paths.home[lang];
  if (view === 'PREISE') return paths.pricing[lang];
  if (view === 'IMPRINT') return '/imprint';
  if (view === 'PRIVACY') return '/privacy';
  if (view === 'BLOG') return '/blog';
  return slug ? `/blog/${slug}` : '/blog';
}

/** Sektions-Headline mit Zeilen-Reveal (aus jpr-prototyp.html .sec-title). */
const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
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

const Eyebrow: React.FC<{ children: string }> = ({ children }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal font-mono text-[14px] text-accent uppercase mb-5">
      {children}
    </div>
  );
};

/** [01] Leistungen — Grid-Zelle mit Reveal. */
const ServiceCell: React.FC<{ idx: string; title: string; desc: string }> = ({ idx, title, desc }) => {
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
const ProcessStep: React.FC<{ n: string; title: string; desc: string }> = ({ n, title, desc }) => {
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

/** Title, Description, Canonical und html-lang passend zu Ansicht und Sprache. */
function useDocumentMeta(view: ViewState, lang: Lang) {
  useEffect(() => {
    const localized = view === 'HOME' || view === 'PREISE';
    document.documentElement.lang = localized ? lang : 'de';
    if (!localized) return;
    const m = copy[lang].meta;
    const isHome = view === 'HOME';
    document.title = isHome ? m.homeTitle : m.pricingTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', isHome ? m.homeDesc : m.pricingDesc);
    const path = isHome ? paths.home[lang] : paths.pricing[lang];
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE}${path === '/' ? '/' : path}`);
  }, [view, lang]);
}

const App: React.FC = () => {
  const initial = parseLocation(window.location.pathname);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(initial.view);
  const [currentSlug, setCurrentSlug] = useState<string>(initial.slug);
  const [lang, setLang] = useState<Lang>(initial.lang ?? 'de');
  const [heroIn, setHeroIn] = useState(false);
  // Wasser-Shader erst nach dem Hero-Intro aktivieren, damit der
  // Zeilen-Reveal beim Laden sichtbar bleibt.
  const [waterReady, setWaterReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaterReady(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const ctaRef = useReveal<HTMLDivElement>();
  const lastScrollY = useRef(0);
  const t = copy[lang];

  useLenis();
  useDocumentMeta(currentView, lang);

  // Hero-Intro-Stagger beim Mount
  useEffect(() => {
    if (currentView !== 'HOME') return;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setHeroIn(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [currentView]);

  // Nav-Autohide + Sticky-CTA
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowStickyNav(y > 120);
      if (y > 120 && y > lastScrollY.current + 2) setNavHidden(true);
      else if (y < lastScrollY.current - 2 || y <= 120) setNavHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Calendly widget script
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const loc = parseLocation(window.location.pathname);
      setCurrentView(loc.view);
      setCurrentSlug(loc.slug);
      if (loc.lang) setLang(loc.lang);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const path = pathFor(currentView, lang, currentSlug);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView, currentSlug, lang]);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/workwithjpr/30min?hide_gdpr_banner=1&background_color=101012&text_color=f4f4f0&primary_color=d4ff4f'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navigate = (view: string, slug?: string) => {
    if (slug) setCurrentSlug(slug);
    setCurrentView(view as ViewState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const changeLang = (l: Lang) => setLang(l);

  const renderView = () => {
    if (currentView === 'IMPRINT') return <Imprint onBack={() => navigate('HOME')} />;
    if (currentView === 'PRIVACY') return <Privacy onBack={() => navigate('HOME')} />;
    if (currentView === 'PREISE') return <PreisePage onNavigate={navigate} openCalendly={openCalendly} onLangChange={changeLang} />;
    if (currentView === 'BLOG') return <BlogIndex onNavigate={navigate} />;
    if (currentView === 'BLOG_POST') {
      const post = getPostBySlug(currentSlug);
      if (post) return <BlogPostView post={post} onNavigate={navigate} openCalendly={openCalendly} />;
      return <BlogIndex onNavigate={navigate} />;
    }
    return null;
  };

  const other = renderView();
  if (other) return <LangContext.Provider value={lang}>{other}</LangContext.Provider>;

  const marqueeItems = (
    <>
      {t.refs.items.map((r) => (
        <React.Fragment key={r.name}>
          <span className="inline-flex items-baseline gap-3 px-7">
            <span className="text-ftext">{r.name}</span>
            <span className="font-body font-normal normal-case text-[16px] tracking-normal text-muted">{r.what}</span>
          </span>
          <span className="text-accent self-center">✦</span>
        </React.Fragment>
      ))}
    </>
  );

  const checkIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5} className="shrink-0"><path d="M4 12L10 18L20 6" /></svg>
  );

  // Einmal definiert, damit Wasser-Effekt und Fallback identisch gesetzt sind.
  // Nur die Headline-Zeilen tragen data-line und laufen durch den Effekt;
  // kleine Texte bleiben echtes DOM, sonst werden sie in der Textur unscharf.
  const heroContent = (
    <>
      <div className="flex justify-between items-center font-mono text-[14px] text-muted uppercase mb-10 md:mb-14 flex-wrap gap-2">
        <div>{t.hero.topLeft}</div>
        <div>{t.hero.topRight}</div>
      </div>

      <h1 className="font-syne font-extrabold uppercase text-[clamp(38px,8.4vw,168px)] leading-[1.02] tracking-[-0.015em] break-words">
        <span className={`hero-line ${heroIn ? 'in' : ''}`}>
          <span data-line>{t.hero.h1[0]}</span>
        </span>
        <span className={`hero-line hero-line-2 text-accent ${heroIn ? 'in' : ''}`}>
          <span data-line>{t.hero.h1[1]}</span>
        </span>
        <span
          className={`hero-line hero-line-3 ${heroIn ? 'in' : ''}`}
          style={{ WebkitTextStroke: '2px #f4f4f0', color: 'transparent' }}
        >
          <span data-line>{t.hero.h1[2]}</span>
        </span>
      </h1>

      <div className={`hero-foot ${heroIn ? 'in' : ''} flex justify-between items-end gap-x-8 gap-y-6 mt-14 flex-wrap`}>
        <p className="font-body text-[20px] md:text-[24px] leading-[1.4] text-ftext max-w-[520px]">
          <span>{t.hero.audience}</span>
        </p>
        <p className="font-body text-[18px] md:text-[20px] leading-[1.55] text-[#d8d8de] max-w-[480px]">
          <span>{t.hero.offer}</span>
        </p>
      </div>

      <div className={`hero-foot ${heroIn ? 'in' : ''} flex gap-3.5 flex-wrap mt-12`}>
        <MagneticButton
          as="button"
          onClick={openCalendly}
          className="cta-glow inline-flex items-center gap-2.5 font-mono text-[13px] sm:text-[15px] font-medium uppercase min-[380px]:whitespace-nowrap bg-accent text-ink px-5 sm:px-7 py-4 border border-accent hover:bg-transparent hover:text-accent transition-colors"
        >
          {t.hero.ctaPrimary}
        </MagneticButton>
        <MagneticButton
          as="button"
          onClick={() => scrollToSection('preise')}
          className="inline-flex items-center gap-2.5 font-mono text-[15px] font-medium uppercase bg-transparent text-ftext px-7 py-4 border border-[#3a3a40] hover:border-accent hover:text-accent transition-colors"
        >
          {t.hero.ctaSecondary}
        </MagneticButton>
      </div>

      <div className={`hero-proof ${heroIn ? 'in' : ''} flex gap-x-8 gap-y-3 flex-wrap mt-10 pt-6 border-t border-line font-body text-[16px] md:text-[17px] text-muted`}>
        {t.hero.proofs.map((proof) => (
          <span key={proof} className="inline-flex items-center gap-2.5">
            {checkIcon}
            <span>{proof}</span>
          </span>
        ))}
      </div>

      <p className="mt-5 font-body text-[15px] md:text-[16px] text-muted">
        <span>{t.hero.capacity}</span>
      </p>
    </>
  );

  return (
    <LangContext.Provider value={lang}>
    <div className="bg-texture bg-ink text-ftext font-body overflow-x-clip selection:bg-accent selection:text-ink">
      <CustomCursor />

      {/* Nav */}
      <nav
        className={`nav-autohide ${navHidden ? 'hidden' : ''} fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-3 px-4 md:px-12 py-4 md:py-5 bg-ink/[0.82] backdrop-blur-md border-b border-line`}
      >
        <button onClick={scrollToTop} className="font-syne font-extrabold text-[16px] md:text-[19px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap shrink-0">
          JPR <span className="text-accent">Studio</span>&reg;
        </button>
        <ul className="hidden md:flex gap-8 list-none font-mono text-[14px] uppercase">
          {t.nav.links.map((link) => (
            <li key={link.id}>
              <ScrambleLabel
                as="span"
                mode="hover"
                onClick={() => scrollToSection(link.id)}
                className="text-muted hover:text-accent transition-colors cursor-pointer"
              >
                {link.label}
              </ScrambleLabel>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6 shrink-0">
          <LangSwitch onChange={changeLang} className="hidden md:flex" />
          <MagneticButton
            as="button"
            onClick={openCalendly}
            className="inline-flex items-center gap-2 font-mono text-[12px] md:text-[14px] font-medium uppercase bg-accent text-ink px-3 md:px-5 py-2.5 md:py-3 border border-accent hover:bg-transparent hover:text-accent transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.cta}
          </MagneticButton>
        </div>
      </nav>

      <main className="relative z-[1]">
        {/* Hero */}
        <header className="px-4 md:px-12 border-b border-line pt-28 md:pt-[220px] pb-16 md:pb-[72px]">
          {/* Mobil ist in der Navigation kein Platz für den Umschalter */}
          <LangSwitch onChange={changeLang} className="md:hidden mb-6" />
          {waterReady ? <WaterHeadline>{heroContent}</WaterHeadline> : heroContent}
        </header>

        {/* Marquee */}
        <section className="overflow-hidden border-b border-line" aria-label={t.refs.ariaLabel}>
          <div className="font-mono text-[14px] text-accent uppercase pt-3.5 px-6 md:px-12">{t.refs.label}</div>
          <div className="flex whitespace-nowrap w-max pt-[14px] pb-[18px] overflow-hidden">
            <div className="marquee-track flex items-baseline whitespace-nowrap font-syne font-bold text-[21px] uppercase tracking-[-0.01em] text-ftext">
              <span className="flex">
                {marqueeItems}
                {marqueeItems}
              </span>
              <span className="flex">
                {marqueeItems}
                {marqueeItems}
              </span>
            </div>
          </div>
        </section>

        {/* [01] Leistungen */}
        <section id="leistungen" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.services.eyebrow}</Eyebrow>
          <SectionTitle>{t.services.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {t.services.items.map((s, i) => (
              <ServiceCell key={s.title} idx={`/ 00${i + 1}`} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        {/* [02] Projekte */}
        <section id="projekte" className="border-b border-line py-16 md:py-0">
          <ProjectCarousel
            header={<><Eyebrow>{t.projects.eyebrow}</Eyebrow><SectionTitle className="!mb-8">{t.projects.title}</SectionTitle></>}
            projects={t.projects.items}
          />
        </section>

        <TestimonialsSection />

        {/* [03] Prozess */}
        <section id="prozess" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.process.eyebrow}</Eyebrow>
          <SectionTitle>{t.process.title}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            {t.process.steps.map((s, i) => (
              <ProcessStep key={s.title} n={`0${i + 1}`} title={s.title} desc={s.desc} />
            ))}
          </div>
        </section>

        {/* Über mich */}
        <section id="jan" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <div className="flex gap-16 items-center flex-wrap">
            <AboutPhoto />
            <AboutText />
          </div>
        </section>

        <PricingSection openCalendly={openCalendly} onHome />
        <FAQSection onHome />

        {/* CTA */}
        <section id="kontakt" className="px-6 md:px-12 border-b border-line bg-accent text-ink py-16 md:py-24">
          <div ref={ctaRef} className="reveal flex justify-between items-center gap-10 flex-wrap">
            <h2 className="font-syne font-extrabold text-[clamp(38px,6vw,78px)] leading-[1.04] uppercase tracking-[-0.015em] break-words max-w-full">
              {t.cta.title[0]}<br />{t.cta.title[1]}
            </h2>
            <div className="max-w-[380px]">
              <p className="text-[18px] leading-[1.6] mb-6">{t.cta.text}</p>
              <MagneticButton
                as="button"
                onClick={openCalendly}
                className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-ink text-ftext px-7 py-4 border border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                {t.cta.button}
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 flex flex-col md:flex-row md:justify-between md:items-center gap-5 py-8 font-mono text-[14px] text-muted uppercase">
          <div className="leading-[1.7] normal-case">{t.footer.company}</div>
          <div className="flex gap-x-6 gap-y-3 items-center flex-wrap">
            <LangSwitch onChange={changeLang} />
            <button onClick={scrollToTop} className="text-muted hover:text-accent transition-colors">{t.footer.top}</button>
            {t.footer.blog && (
              <button onClick={() => navigate('BLOG')} className="text-muted hover:text-accent transition-colors">{t.footer.blog}</button>
            )}
            <button onClick={() => navigate('IMPRINT')} className="text-muted hover:text-accent transition-colors">{t.footer.imprint}</button>
            <button onClick={() => navigate('PRIVACY')} className="text-muted hover:text-accent transition-colors">{t.footer.privacy}</button>
            <a href="https://www.linkedin.com/in/jan-rojek-b31474a" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">LinkedIn</a>
            <a
              href="https://g.page/r/Cbent0mi4nueEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors normal-case"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t.footer.review}
            </a>
          </div>
        </footer>
      </main>

      {/* Sticky-CTA-Leiste beim Scrollen */}
      {showStickyNav && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-b border-line">
          <div className="flex items-center justify-between gap-3 px-4 md:px-12 py-3">
            <button onClick={scrollToTop} className="font-syne font-extrabold text-sm uppercase text-ftext">
              JPR <span className="text-accent">Studio</span>
            </button>
            <div className="hidden md:flex items-center gap-6">
              {t.nav.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="font-mono text-[13px] text-muted hover:text-accent uppercase transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <LangSwitch onChange={changeLang} className="hidden md:flex" />
              <button
                onClick={openCalendly}
                className="font-mono text-[13px] font-medium uppercase bg-accent text-ink px-4 py-2.5 border border-accent hover:bg-transparent hover:text-accent transition-colors"
              >
                {t.nav.stickyCta}
              </button>
            </div>
          </div>
        </div>
      )}

      <CookieBanner />
    </div>
    </LangContext.Provider>
  );
};

/** Über-mich Foto mit Clip-Path-Reveal + Grayscale→Farbe bei Hover. */
const AboutPhoto: React.FC = () => {
  const ref = useReveal<HTMLDivElement>();
  const t = useCopy().about;
  return (
    <div ref={ref} className="mask-reveal group w-[320px] h-[380px] flex-shrink-0 relative overflow-hidden">
      <WaterImage
        src="/jan-rojek.webp"
        alt={t.photoAlt}
        intensity={0.4}
        className="w-full h-full grayscale contrast-[1.05] transition-[filter] duration-500 group-hover:grayscale-0 group-hover:contrast-100"
      />
      <div className="absolute bottom-0 left-0 px-4 py-2.5 bg-accent text-ink font-mono text-[13px] font-medium uppercase">
        {t.badge}
      </div>
    </div>
  );
};

const AboutText: React.FC = () => {
  const ref = useReveal<HTMLDivElement>();
  const t = useCopy().about;
  return (
    <div ref={ref} className="reveal flex-1 min-w-[300px] max-w-[640px]">
      <h2 className="font-syne font-extrabold uppercase text-[clamp(30px,3.6vw,48px)] tracking-[-0.015em] mb-6">
        {t.hello} <span className="text-accent">{t.name}</span>
      </h2>
      {t.paragraphs.map((p) => (
        <p key={p} className="text-[17px] leading-[1.7] text-muted mb-4">{p}</p>
      ))}
      <p className="text-[17px] leading-[1.7] text-ftext font-medium mb-4">{t.highlight}</p>
      <div className="flex gap-7 flex-wrap mt-7 pt-[22px] border-t border-line font-mono text-[14px] text-muted uppercase">
        {t.facts.map((f) => (
          <span key={f}>{f}</span>
        ))}
        <span>
          <a href="https://www.linkedin.com/in/jan-rojek-b31474a" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ftext transition-colors">
            LinkedIn →
          </a>
        </span>
      </div>
    </div>
  );
};

export default App;
