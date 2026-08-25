import React, { useState, useEffect, useRef } from 'react';
import Imprint from './components/Imprint';
import Privacy from './components/Privacy';
import CookieBanner from './components/CookieBanner';
import CustomCursor from './components/CustomCursor';
import MagneticButton from './components/MagneticButton';
import WaterHeadline from './components/WaterHeadline';
import WaterImage from './components/WaterImage';
import ScrambleLabel from './components/ScrambleLabel';
import BlogIndex from './components/BlogIndex';
import BlogPostView from './components/BlogPost';
import PreisePage from './components/PreisePage';
import { useLenis } from './hooks/useLenis';
import { useReveal } from './hooks/useReveal';
import { getPostBySlug } from './content/blog';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

type ViewState = 'HOME' | 'IMPRINT' | 'PRIVACY' | 'BLOG' | 'BLOG_POST' | 'PREISE';

const navLinks = [
  { label: '[01] Leistungen', id: 'leistungen' },
  { label: '[02] Projekte', id: 'projekte' },
  { label: '[03] Prozess', id: 'prozess' },
  { label: '[04] Preise', id: 'preise' },
  { label: '[05] FAQ', id: 'faq' },
];

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
    <div ref={ref} className="reveal font-mono text-[13px] text-accent uppercase mb-5">
      {children}
    </div>
  );
};

/** [01] Leistungen — Grid-Zelle mit Reveal. */
const ServiceCell: React.FC<{ idx: string; title: string; desc: string }> = ({ idx, title, desc }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-10">
      <div className="font-mono text-[13px] text-accent mb-[18px]">{idx}</div>
      <h3 className="font-syne font-bold text-[28px] mb-3">{title}</h3>
      <p className="text-base leading-[1.6] text-muted">{desc}</p>
    </div>
  );
};

/** [02] Projekte — Karte rollt beim Scrollen wie von einer Rolle herein. */
const ProjectCard: React.FC<{ url: string; href: string; title: string; tag: string; img: string }> = ({ url, href, title, tag, img }) => {
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const footRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      return;
    }

    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Fortschritt der Karte durch den Viewport: 0 = Unterkante betritt das Bild,
      // 1 = Karte ist oben komplett hinausgelaufen.
      const total = vh + r.height;
      const travelled = Math.min(total, Math.max(0, vh - r.top));
      const t = travelled / total;

      // Zwei Phasen: hereinrollen (unten) und wieder wegrollen (oben).
      const IN = 0.42;   // bis hierhin richtet sich die Karte auf
      const OUT = 0.62;  // ab hier kippt sie nach hinten weg
      let rot: number;
      let ty: number;
      let op: number;
      if (t < IN) {
        const p = t / IN;
        const e = 1 - Math.pow(1 - p, 3);
        rot = (1 - e) * 46;          // aus der Tiefe hochkippen
        ty = (1 - e) * 90;
        op = 0.2 + e * 0.8;
      } else if (t > OUT) {
        const p = Math.min(1, (t - OUT) / (1 - OUT));
        const e = Math.pow(p, 2.2);
        rot = -e * 46;               // nach hinten oben wegrollen
        ty = -e * 70;
        op = 1 - e * 0.85;
      } else {
        rot = 0;
        ty = 0;
        op = 1;
      }

      const sc = 0.92 + (1 - Math.abs(rot) / 46) * 0.08;
      el.style.transform = `perspective(1300px) rotateX(${rot}deg) translateY(${ty}px) scale(${sc})`;
      el.style.opacity = String(Math.max(0, Math.min(1, op)));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <a
      ref={wrapRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card cursor-pointer group block will-change-transform opacity-0"
    >
      <div className="border border-line bg-panel mb-[18px] transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:border-accent/40 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-line">
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <i className="w-2 h-2 rounded-full bg-[#2e2e33] inline-block" />
          <span className="ml-auto font-mono text-xs text-dim">{url}</span>
        </div>
        <div className="h-[380px] md:h-[460px] bg-panel relative overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.045]">
            <img
              src={img}
              alt={`Website von ${title}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top grayscale-[35%] contrast-[1.02] transition-[filter] duration-500 group-hover:grayscale-0 group-hover:contrast-100"
            />
          </div>
        </div>
      </div>
      <div ref={footRef} className="reveal flex justify-between items-baseline gap-4">
        <h3 className="font-syne font-bold text-[22px] md:text-[26px]">{title}</h3>
        <div className="font-mono text-[13px] text-muted uppercase text-right">{tag}</div>
      </div>
    </a>
  );
};

/** Kundenstimmen — Hairline-Grid-Zelle mit Reveal. */
const TestimonialCell: React.FC<{ quote: string; logo: string; alt: string; name: string; company: string }> = ({ quote, logo, alt, name, company }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal bg-ink hover:bg-panel transition-colors p-9 flex flex-col justify-between">
      <p className="text-[17px] leading-[1.65] text-[#d8d8de] mb-7">&bdquo;{quote}&ldquo;</p>
      <div className="flex items-center gap-3.5">
        <img src={logo} alt={alt} className="h-10 w-auto max-w-[90px] object-contain" />
        <div className="font-mono text-[13px] text-muted uppercase leading-[1.9]">
          {name}<br />{company}
        </div>
      </div>
    </div>
  );
};

/** Prozess — Schritt mit großer Outline-Zahl (Hover → lime). */
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
      <p className="text-base leading-[1.6] text-muted">{desc}</p>
    </div>
  );
};

/** Preise — Tier-Karte mit Reveal, Professional mit Lime-Outline. */
const PriceTier: React.FC<{
  name: string; for: string; price: string; reco: boolean; features: string[]; openCalendly: () => void;
}> = ({ name, for: forWhom, price, reco, features, openCalendly }) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal bg-ink hover:bg-panel transition-colors p-10 flex flex-col relative ${reco ? 'outline outline-1 outline-accent -outline-offset-1' : ''}`}
    >
      {reco && (
        <div className="absolute top-0 right-0 px-3.5 py-2 bg-accent text-ink font-mono text-[11px] font-medium uppercase">
          ✦ Empfohlen
        </div>
      )}
      <h3 className="font-syne font-bold text-[26px] mb-1.5">{name}</h3>
      <div className="font-mono text-[13px] text-dim uppercase mb-6">{forWhom}</div>
      <div className="font-syne font-extrabold text-[40px] text-accent mb-7">{price}</div>
      <ul className="flex flex-col gap-2.5 text-[15px] text-muted flex-grow mb-7">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 items-start">
            <span className="text-accent flex-shrink-0">→</span>
            {f}
          </li>
        ))}
      </ul>
      <MagneticButton
        as="button"
        onClick={openCalendly}
        className={`self-start inline-flex items-center gap-2.5 font-mono text-[13px] font-medium uppercase px-[22px] py-[13px] border transition-colors ${
          reco
            ? 'bg-accent text-ink border-accent hover:bg-transparent hover:text-accent'
            : 'bg-ink text-ftext border-line hover:bg-transparent'
        }`}
      >
        Entwurf anfragen
      </MagneticButton>
    </div>
  );
};

const App: React.FC = () => {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [heroIn, setHeroIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Wasser-Shader erst nach dem Hero-Intro aktivieren, damit der
  // Zeilen-Reveal beim Laden sichtbar bleibt.
  const [waterReady, setWaterReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaterReady(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const faqRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const lastScrollY = useRef(0);

  useLenis();

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
      const path = window.location.pathname;
      if (path === '/imprint' || path === '/impressum') {
        setCurrentView('IMPRINT');
      } else if (path === '/privacy' || path === '/datenschutz') {
        setCurrentView('PRIVACY');
      } else if (path === '/preise') {
        setCurrentView('PREISE');
      } else if (path === '/blog') {
        setCurrentView('BLOG');
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
        setCurrentSlug(slug);
        setCurrentView('BLOG_POST');
      } else {
        setCurrentView('HOME');
      }
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let path = '/';
    if (currentView === 'IMPRINT') path = '/imprint';
    else if (currentView === 'PRIVACY') path = '/privacy';
    else if (currentView === 'PREISE') path = '/preise';
    else if (currentView === 'BLOG') path = '/blog';
    else if (currentView === 'BLOG_POST' && currentSlug) path = `/blog/${currentSlug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView, currentSlug]);

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

  if (currentView === 'IMPRINT') return <Imprint onBack={() => navigate('HOME')} />;
  if (currentView === 'PRIVACY') return <Privacy onBack={() => navigate('HOME')} />;
  if (currentView === 'PREISE') return <PreisePage onNavigate={navigate} openCalendly={openCalendly} />;
  if (currentView === 'BLOG') return <BlogIndex onNavigate={navigate} />;
  if (currentView === 'BLOG_POST') {
    const post = getPostBySlug(currentSlug);
    if (post) return <BlogPostView post={post} onNavigate={navigate} openCalendly={openCalendly} />;
    return <BlogIndex onNavigate={navigate} />;
  }

  const faqs = [
    {
      q: 'Was kostet eine Website?',
      a: 'Das hängt vom Umfang ab. Eine einfache One-Page Website beginnt ab 1.500 €, eine mehrseitige Website mit Buchungssystem ab 3.000 €. Im kostenlosen Erstgespräch bekommst du ein individuelles Angebot — transparent, ohne versteckte Kosten.',
    },
    {
      q: 'Wie lange dauert es, bis meine Website fertig ist?',
      a: 'Eine einfache Website ist in wenigen Tagen fertig. Komplexere Projekte mit Shop oder individuellen Funktionen dauern 1–2 Wochen. Kein monatelanges Warten — wir setzen schnell um.',
    },
    {
      q: 'Brauche ich technisches Wissen?',
      a: 'Nein, überhaupt nicht. Wir kümmern uns um alles Technische. Nach dem Launch zeigen wir dir in einer Einführung, wie du einfache Änderungen selbst vornehmen kannst — falls gewünscht.',
    },
    {
      q: 'Was passiert nach dem Launch?',
      a: 'Wir lassen dich nicht im Stich. Je nach Paket bekommst du laufenden Support, Hosting und regelmäßige Updates. Wenn du etwas ändern oder erweitern möchtest, sind wir für dich da.',
    },
    {
      q: 'Könnt ihr auch bestehende Websites überarbeiten?',
      a: 'Ja, definitiv. Ob Redesign, Performance-Optimierung oder neue Funktionen — wir schauen uns an, was du hast, und machen daraus etwas Modernes.',
    },
    {
      q: 'Nutzt ihr WordPress?',
      a: 'Nein. Wir nutzen modernere Technik — das bedeutet: schnellere Ladezeiten, bessere Platzierung bei Google und keine Probleme durch veraltete Plugins.',
    },
    {
      q: 'Arbeitet ihr nur mit Unternehmen in Berlin?',
      a: 'Wir sind in Berlin ansässig und spezialisiert auf lokale Unternehmen. Aber wir arbeiten auch remote — der Standort spielt für digitale Projekte keine Rolle.',
    },
  ];

  const marqueeItems = (
    <>
      <span className="inline-flex items-baseline gap-3 px-7">
        <span className="text-ftext">Muay Thai Subyen</span>
        <span className="font-body font-normal normal-case text-[15px] tracking-normal text-muted">Kampfsportschule</span>
      </span>
      <span className="text-accent self-center">✦</span>
      <span className="inline-flex items-baseline gap-3 px-7">
        <span className="text-ftext">Colombina</span>
        <span className="font-body font-normal normal-case text-[15px] tracking-normal text-muted">Kochkurse &amp; Catering</span>
      </span>
      <span className="text-accent self-center">✦</span>
      <span className="inline-flex items-baseline gap-3 px-7">
        <span className="text-ftext">RopeFX</span>
        <span className="font-body font-normal normal-case text-[15px] tracking-normal text-muted">Höhenarbeiten</span>
      </span>
      <span className="text-accent self-center">✦</span>
    </>
  );

  return (
    <div className="bg-texture bg-ink text-ftext font-body overflow-x-hidden selection:bg-accent selection:text-ink">
      <CustomCursor />

      {/* Nav */}
      <nav
        className={`nav-autohide ${navHidden ? 'hidden' : ''} fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-3 px-4 md:px-12 py-4 md:py-5 bg-ink/[0.82] backdrop-blur-md border-b border-line`}
      >
        <button onClick={scrollToTop} className="font-syne font-extrabold text-[16px] md:text-[19px] uppercase tracking-[0.01em] text-ftext whitespace-nowrap shrink-0">
          JPR <span className="text-accent">Studio</span>&reg;
        </button>
        <ul className="hidden md:flex gap-8 list-none font-mono text-[13px] uppercase">
          {navLinks.map((link) => (
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
        <MagneticButton
          as="button"
          onClick={openCalendly}
          className="inline-flex items-center gap-2 font-mono text-[11px] md:text-[13px] font-medium uppercase bg-accent text-ink px-3 md:px-5 py-2.5 md:py-3 border border-accent hover:bg-transparent hover:text-accent transition-colors whitespace-nowrap shrink-0"
        >
          Entwurf anfragen →
        </MagneticButton>
      </nav>

      <main className="relative z-[1]">
        {/* Hero */}
        <header className="px-4 md:px-12 border-b border-line pt-28 md:pt-[220px] pb-16 md:pb-[72px]">
          {waterReady ? (
            <WaterHeadline>
          <div className="flex justify-between font-mono text-[13px] text-muted uppercase mb-10 md:mb-14 flex-wrap gap-2">
            <div data-line>Webdesign — Berlin</div>
            <div data-line>Kein WordPress / React-Stack</div>
          </div>

          <h1 className="font-syne font-extrabold uppercase text-[clamp(38px,8.4vw,132px)] leading-[1.02] tracking-[-0.015em] break-words">
            <span className={`hero-line ${heroIn ? 'in' : ''}`}>
              <span data-line>Websites,</span>
            </span>
            <span className={`hero-line hero-line-2 text-accent ${heroIn ? 'in' : ''}`}>
              <span data-line>die Kunden</span>
            </span>
            <span
              className={`hero-line hero-line-3 ${heroIn ? 'in' : ''}`}
              style={{ WebkitTextStroke: '2px #f4f4f0', color: 'transparent' }}
            >
              <span data-line>bringen.</span>
            </span>
          </h1>

          <div className={`hero-foot ${heroIn ? 'in' : ''} flex justify-between items-end gap-8 mt-14 flex-wrap`}>
            <div className="font-mono text-[13px] text-muted leading-[1.9] uppercase">
              <span data-line className="block">Für Handwerker, Praxen, Gyms</span>
              <span data-line className="block">und lokale Unternehmen</span>
            </div>
            <div className="flex flex-col items-start gap-6 max-w-[460px]">
              <div data-line className="text-lg leading-[1.65] text-[#d8d8de]">
                Erster Entwurf kostenlos — du siehst vorab, was du bekommst. Festpreis ab 1.500&nbsp;€.
              </div>
            </div>
          </div>

          <div className={`hero-foot ${heroIn ? 'in' : ''} flex gap-3.5 flex-wrap mt-12`}>
                <MagneticButton
                  as="button"
                  onClick={openCalendly}
                  className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-accent text-ink px-7 py-4 border border-accent hover:bg-transparent hover:text-accent transition-colors"
                >
                  Kostenloser Entwurf anfragen →
                </MagneticButton>
                <MagneticButton
                  as="button"
                  onClick={() => scrollToSection('preise')}
                  className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-transparent text-ftext px-7 py-4 border border-[#3a3a40] hover:border-accent hover:text-accent transition-colors"
                >
                  Preise ansehen
                </MagneticButton>
          </div>

          <div className={`hero-proof ${heroIn ? 'in' : ''} flex gap-7 flex-wrap mt-10 pt-6 border-t border-line font-mono text-[13px] text-muted uppercase`}>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Live in Tagen statt Monaten</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Festpreis vor Projektstart</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Erster Entwurf kostenlos</span>
            </span>
          </div>

          <p className="mt-6 font-mono text-[13px] text-dim uppercase">
            <span data-line>Aktuell freie Kapazitäten — Projekt noch diesen Monat starten</span>
          </p>
            </WaterHeadline>
          ) : (
            <>
          <div className="flex justify-between font-mono text-[13px] text-muted uppercase mb-10 md:mb-14 flex-wrap gap-2">
            <div data-line>Webdesign — Berlin</div>
            <div data-line>Kein WordPress / React-Stack</div>
          </div>

          <h1 className="font-syne font-extrabold uppercase text-[clamp(38px,8.4vw,132px)] leading-[1.02] tracking-[-0.015em] break-words">
            <span className={`hero-line ${heroIn ? 'in' : ''}`}>
              <span data-line>Websites,</span>
            </span>
            <span className={`hero-line hero-line-2 text-accent ${heroIn ? 'in' : ''}`}>
              <span data-line>die Kunden</span>
            </span>
            <span
              className={`hero-line hero-line-3 ${heroIn ? 'in' : ''}`}
              style={{ WebkitTextStroke: '2px #f4f4f0', color: 'transparent' }}
            >
              <span data-line>bringen.</span>
            </span>
          </h1>

          <div className={`hero-foot ${heroIn ? 'in' : ''} flex justify-between items-end gap-8 mt-14 flex-wrap`}>
            <div className="font-mono text-[13px] text-muted leading-[1.9] uppercase">
              <span data-line className="block">Für Handwerker, Praxen, Gyms</span>
              <span data-line className="block">und lokale Unternehmen</span>
            </div>
            <div className="flex flex-col items-start gap-6 max-w-[460px]">
              <div data-line className="text-lg leading-[1.65] text-[#d8d8de]">
                Erster Entwurf kostenlos — du siehst vorab, was du bekommst. Festpreis ab 1.500&nbsp;€.
              </div>
            </div>
          </div>

          <div className={`hero-foot ${heroIn ? 'in' : ''} flex gap-3.5 flex-wrap mt-12`}>
                <MagneticButton
                  as="button"
                  onClick={openCalendly}
                  className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-accent text-ink px-7 py-4 border border-accent hover:bg-transparent hover:text-accent transition-colors"
                >
                  Kostenloser Entwurf anfragen →
                </MagneticButton>
                <MagneticButton
                  as="button"
                  onClick={() => scrollToSection('preise')}
                  className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-transparent text-ftext px-7 py-4 border border-[#3a3a40] hover:border-accent hover:text-accent transition-colors"
                >
                  Preise ansehen
                </MagneticButton>
          </div>

          <div className={`hero-proof ${heroIn ? 'in' : ''} flex gap-7 flex-wrap mt-10 pt-6 border-t border-line font-mono text-[13px] text-muted uppercase`}>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Live in Tagen statt Monaten</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Festpreis vor Projektstart</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4ff4f" strokeWidth={2.5}><path d="M4 12L10 18L20 6" /></svg>
              <span data-line>Erster Entwurf kostenlos</span>
            </span>
          </div>

          <p className="mt-6 font-mono text-[13px] text-dim uppercase">
            <span data-line>Aktuell freie Kapazitäten — Projekt noch diesen Monat starten</span>
          </p>
            </>
          )}
        </header>

        {/* Marquee */}
        <section className="overflow-hidden border-b border-line" aria-label="Referenzen">
          <div className="font-mono text-[13px] text-accent uppercase pt-3.5 px-6 md:px-12">Unsere Kunden</div>
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
          <Eyebrow>[01] — Leistungen</Eyebrow>
          <SectionTitle>Alles aus einer Hand.</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            <ServiceCell idx="/ 001" title="Moderne Website" desc="Mobil optimiert, schnell, wird bei Google gefunden. React statt WordPress." />
            <ServiceCell idx="/ 002" title="Online-Terminbuchung" desc="Deine Kunden buchen direkt online — Tag und Nacht, ohne Telefon." />
            <ServiceCell idx="/ 003" title="Shop & Web-Apps" desc="Zahlungsabwicklung, Kundenverwaltung, individuelle Funktionen." />
            <ServiceCell idx="/ 004" title="KI-Automatisierung" desc="Prozesse automatisieren — vom Angebot bis zur Rechnung." />
          </div>
        </section>

        {/* [02] Projekte */}
        <section id="projekte" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>[02] — Ausgewählte Projekte</Eyebrow>
          <SectionTitle>Aktuelle Projekte.</SectionTitle>
          <div className="flex flex-col gap-20 md:gap-28 max-w-[900px] mx-auto">
            <ProjectCard url="muaythai-subyen.de" href="https://www.muaythai-subyen.de" title="Muay Thai Subyen" tag="Web-App / Mitgliederverwaltung" img="/portfolio-shots/subyen.jpg" />
            <ProjectCard url="colombina-kochkurse.vercel.app" href="https://colombina-kochkurse.vercel.app" title="Colombina Kochkurse" tag="Landingpage / Buchung" img="/portfolio-shots/colombina.jpg" />
            <ProjectCard url="ropefx.com" href="https://ropefx.com" title="RopeFX" tag="Website / Anfragen-Funnel" img="/portfolio-shots/ropefx.jpg" />
          </div>
        </section>

        {/* Kundenstimmen */}
        <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>Kundenstimmen</Eyebrow>
          <SectionTitle>Das sagen unsere Kunden.</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            <TestimonialCell
              quote="Meine Kurstermine, Texte und Anfragen verwalte ich jetzt einfach selbst — und die Seite fühlt sich trotzdem hundertprozentig nach meiner Marke an. Dass das alles an einem Tag entstanden ist, kann ich immer noch nicht ganz glauben."
              logo="/logos/colombina.webp"
              alt="Colombina Logo"
              name="Diana Römer Duque"
              company="Colombina — Catering & Kochkurse"
            />
            <TestimonialCell
              quote="Die Website stand innerhalb weniger Tage. Seitdem bekommen wir regelmäßig Anfragen darüber — und sie sieht richtig professionell aus. Unkompliziert und auf den Punkt."
              logo="/logos/ropefx.webp"
              alt="RopeFX Logo"
              name="Michael Nüske"
              company="RopeFX — Industriekletterer Berlin"
            />
            <TestimonialCell
              quote="Innerhalb einer Woche hatten wir eine komplette Website mit Trainingsplan, Mitgliederverwaltung und Online-Vertragsabschluss. Das hätte ich so schnell nicht erwartet."
              logo="/logos/muay-thai-subyen.webp"
              alt="Muay Thai Subyen Logo"
              name="Sven Markulla"
              company="Muay Thai Subyen e.V."
            />
          </div>
          <p className="mt-7 font-mono text-[13px] uppercase">
            <a href="https://g.page/r/Cbent0mi4nueEAE/review" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ftext transition-colors">
              Auch zufrieden? Bewertung auf Google hinterlassen →
            </a>
          </p>
        </section>

        {/* [03] Prozess */}
        <section id="prozess" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>[03] — Prozess</Eyebrow>
          <SectionTitle>So funktioniert's.</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            <ProcessStep n="01" title="Kostenloses Erstgespräch" desc="Wir besprechen dein Geschäft, deine Ziele und was du brauchst. 30 Minuten, unverbindlich." />
            <ProcessStep n="02" title="Kostenloser Entwurf" desc="Du bekommst einen ersten Entwurf deiner Website — komplett kostenlos. Erst wenn du zufrieden bist, geht's weiter." />
            <ProcessStep n="03" title="Umsetzung & Launch" desc="Wir bauen, du gibst Feedback, wir gehen live. Du bekommst eine Einführung und laufenden Support." />
          </div>
        </section>

        {/* Über mich */}
        <section id="jan" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>Wer dahinter steckt</Eyebrow>
          <div className="flex gap-16 items-center flex-wrap">
            <AboutPhoto />
            <AboutText />
          </div>
        </section>

        {/* [04] Preise */}
        <section id="preise" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>[04] — Preise / Festpreis vor Start</Eyebrow>
          <SectionTitle>Transparent. Ohne Tagessätze.</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
            <PriceTier
              name="Starter" for="Für den Start" price="ab 1.500 €" reco={false}
              features={['One-Page Website', 'Mobil optimiert', 'Kontaktformular', 'Google Maps Einbindung', 'Basis-SEO', '1 Korrekturschleife']}
              openCalendly={openCalendly}
            />
            <PriceTier
              name="Professional" for="Unser beliebtestes Paket" price="ab 3.000 €" reco={true}
              features={['Mehrseitige Website', 'Online-Terminbuchung', 'Team- & Leistungsseiten', 'Erweiterte SEO-Optimierung', 'Google Analytics', '3 Korrekturschleifen', 'Einführung & Support']}
              openCalendly={openCalendly}
            />
            <PriceTier
              name="Business" for="Für anspruchsvolle Projekte" price="ab 5.000 €" reco={false}
              features={['Alles aus Professional', 'Online-Shop oder Web-App', 'Kundenverwaltung / Backend', 'Individuelle Funktionen', 'Automatisierungen', 'Unbegrenzte Korrekturen']}
              openCalendly={openCalendly}
            />
          </div>
          <p className="mt-6 font-mono text-[13px] text-dim uppercase">
            Alle Preise netto zzgl. MwSt. · Ratenzahlung möglich · Hosting ab 15 €/Monat
          </p>
          <p className="mt-4 text-sm font-mono">
            <a href="/preise" className="text-accent hover:text-ftext transition-colors">
              Alle Webdesign-Preise in Berlin im Detail →
            </a>
          </p>
        </section>

        {/* [05] FAQ */}
        <section id="faq" className="px-6 md:px-12 border-b border-line py-16 md:py-24">
          <Eyebrow>[05] — FAQ</Eyebrow>
          <SectionTitle>Häufige Fragen.</SectionTitle>
          <div ref={faqRef} className="reveal border-t border-line max-w-[980px]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} isOpen={isOpen} onToggle={() => setOpenFaq(isOpen ? null : idx)} />
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section id="kontakt" className="px-6 md:px-12 border-b border-line bg-accent text-ink py-16 md:py-24">
          <div ref={ctaRef} className="reveal flex justify-between items-center gap-10 flex-wrap">
            <h2 className="font-syne font-extrabold text-[clamp(38px,6vw,78px)] leading-[1.04] uppercase tracking-[-0.015em] break-words max-w-full">
              Bereit<br />loszulegen?
            </h2>
            <div className="max-w-[380px]">
              <p className="text-[17px] leading-[1.6] mb-6">
                30 Minuten Gespräch — der erste Entwurf ist kostenlos.
              </p>
              <MagneticButton
                as="button"
                onClick={openCalendly}
                className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-ink text-ftext px-7 py-4 border border-ink hover:bg-transparent hover:text-ink transition-colors"
              >
                Kostenloser Entwurf →
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 flex flex-col md:flex-row md:justify-between md:items-center gap-5 py-8 font-mono text-[13px] text-muted uppercase">
          <div className="leading-[1.7] normal-case md:uppercase">JPR Studio ist eine Marke der JPR Consulting GmbH · Letteallee 91 · 13409 Berlin</div>
          <div className="flex gap-x-6 gap-y-3 items-center flex-wrap">
            <button onClick={scrollToTop} className="text-muted hover:text-accent transition-colors">Nach oben</button>
            <button onClick={() => navigate('BLOG')} className="text-muted hover:text-accent transition-colors">Blog</button>
            <button onClick={() => navigate('IMPRINT')} className="text-muted hover:text-accent transition-colors">Impressum</button>
            <button onClick={() => navigate('PRIVACY')} className="text-muted hover:text-accent transition-colors">Datenschutz</button>
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
              Bewertung auf Google
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
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="font-mono text-[12px] text-muted hover:text-accent uppercase transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              onClick={openCalendly}
              className="font-mono text-[12px] font-medium uppercase bg-accent text-ink px-4 py-2.5 border border-accent hover:bg-transparent hover:text-accent transition-colors"
            >
              Entwurf anfragen
            </button>
          </div>
        </div>
      )}

      <CookieBanner />
    </div>
  );
};

/** Über-mich Foto mit Clip-Path-Reveal + Grayscale→Farbe bei Hover. */
const AboutPhoto: React.FC = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mask-reveal group w-[320px] h-[380px] flex-shrink-0 relative overflow-hidden">
      <WaterImage
        src="/jan-rojek.webp"
        alt="Jan Rojek, Gründer von JPR Studio"
        intensity={0.4}
        className="w-full h-full grayscale contrast-[1.05] transition-[filter] duration-500 group-hover:grayscale-0 group-hover:contrast-100"
      />
      <div className="absolute bottom-0 left-0 px-4 py-2.5 bg-accent text-ink font-mono text-[11px] font-medium uppercase">
        Berlin / Gründer
      </div>
    </div>
  );
};

const AboutText: React.FC = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal flex-1 min-w-[300px] max-w-[640px]">
      <h2 className="font-syne font-extrabold uppercase text-[clamp(30px,3.6vw,48px)] tracking-[-0.015em] mb-6">
        Hi, ich bin <span className="text-accent">Jan.</span>
      </h2>
      <p className="text-base leading-[1.7] text-muted mb-4">
        Seit über 7 Jahren baue ich Websites und digitale Lösungen — von Websites für lokale Unternehmen bis zu Automatisierungssystemen für internationale Firmen.
      </p>
      <p className="text-base leading-[1.7] text-muted mb-4">
        Was mich antreibt: Wenn ein Handwerker plötzlich über seine Website Anfragen bekommt. Oder eine Praxis ihre Terminbuchung online hat und das Telefon nicht mehr ständig klingelt.
      </p>
      <p className="text-base leading-[1.7] text-ftext font-medium mb-4">
        Ich spreche deine Sprache — nicht die von Entwicklern. Du sagst mir, was dein Business braucht, und ich baue es.
      </p>
      <div className="flex gap-7 flex-wrap mt-7 pt-[22px] border-t border-line font-mono text-xs text-muted uppercase">
        <span>7+ Jahre Webentwicklung</span>
        <span>Du sprichst direkt mit dem, der baut</span>
        <span>
          <a href="https://www.linkedin.com/in/jan-rojek-b31474a" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ftext transition-colors">
            LinkedIn →
          </a>
        </span>
      </div>
    </div>
  );
};

/** FAQ-Akkordeon-Item (+ dreht zu × via rotate 45deg, max-height-Transition). */
const FaqItem: React.FC<{ q: string; a: string; isOpen: boolean; onToggle: () => void }> = ({ q, a, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  // Hoehe messen statt beim ersten Render zu raten: scrollHeight ist vor dem
  // Layout 0, wodurch die Antwort zugeklappt blieb. Auch bei Resize neu messen.
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => ro.disconnect();
  }, [a]);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-6 py-[26px] bg-transparent border-none cursor-pointer text-left font-syne font-bold text-xl text-ftext hover:text-accent transition-colors"
      >
        {q}
        <span
          className="font-mono text-xl text-accent flex-shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
        style={{ maxHeight: isOpen ? `${height || 600}px` : '0px' }}
      >
        <div ref={contentRef}>
          <p className="pb-[26px] pr-10 text-[15px] leading-[1.7] text-muted max-w-[760px]">{a}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
