import React, { useState, useEffect } from 'react';
import { ArrowUp, Menu, X } from 'lucide-react';
import AboutSection from './components/AboutSection';
import HowItWorksSection from './components/HowItWorksSection';
import ServicesSection from './components/ServicesSection';
import ProblemSection from './components/ProblemSection';
import PricingSection from './components/PricingSection';
import PortfolioSection from './components/PortfolioSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Imprint from './components/Imprint';
import Privacy from './components/Privacy';
import CookieBanner from './components/CookieBanner';
import HeroBackdrop from './components/HeroBackdrop';
import BlogIndex from './components/BlogIndex';
import BlogPostView from './components/BlogPost';
import { useInView } from './hooks/useInView';
import { getPostBySlug } from './content/blog';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}


type ViewState = 'HOME' | 'IMPRINT' | 'PRIVACY' | 'BLOG' | 'BLOG_POST';

const navLinks = [
  { label: 'Leistungen', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Preise', id: 'pricing' },
  { label: 'Blog', id: 'blog' },
];

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [currentSlug, setCurrentSlug] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setShowStickyCTA(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
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
    else if (currentView === 'BLOG') path = '/blog';
    else if (currentView === 'BLOG_POST' && currentSlug) path = `/blog/${currentSlug}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView, currentSlug]);

  const scrollToSection = (id: string) => {
    if (id === 'blog') {
      navigate('BLOG');
      setMobileMenuOpen(false);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/workwithjpr/30min?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=06b6d4'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (view: string, slug?: string) => {
    if (slug) setCurrentSlug(slug);
    setCurrentView(view as ViewState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const section1 = useInView();
  const section2 = useInView();
  const section3 = useInView();
  const section4 = useInView();
  const section5 = useInView();
  const section6 = useInView();
  const section7 = useInView();
  const section8 = useInView();
  const section9 = useInView();

  const fadeUp = (inView: boolean) =>
    `transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
  const fadeLeft = (inView: boolean) =>
    `transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
  const fadeScale = (inView: boolean) =>
    `transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;

  if (currentView === 'IMPRINT') return <Imprint onBack={() => navigate('HOME')} />;
  if (currentView === 'PRIVACY') return <Privacy onBack={() => navigate('HOME')} />;
  if (currentView === 'BLOG') return <BlogIndex onNavigate={navigate} />;
  if (currentView === 'BLOG_POST') {
    const post = getPostBySlug(currentSlug);
    if (post) return <BlogPostView post={post} onNavigate={navigate} openCalendly={openCalendly} />;
    return <BlogIndex onNavigate={navigate} />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <header className="relative overflow-hidden min-h-[100dvh] flex items-center justify-center px-4 pt-10 pb-20">
          <HeroBackdrop />
          <div className="relative z-10 container mx-auto max-w-5xl text-center">
            <div className="flex justify-center mb-14 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-6 bg-cyan-500/10 rounded-full blur-[50px]" />
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden hover:scale-105 transition-all duration-500">
                  <img
                    src="/JPR1.webp"
                    alt="JPR Consulting"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6 leading-none animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                Deine neue Website —
              </span>
              <br />
              <span className="text-white">in Tagen, nicht Monaten.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
              Webdesign für lokale Unternehmen in Berlin.
              <br />
              <span className="text-white font-semibold">Erster Entwurf kostenlos — du siehst vorab, was du bekommst.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center animate-fade-in">
              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 active:scale-[0.98] hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981)' }}
              >
                Kostenloser Entwurf anfragen
              </button>
              <p className="text-gray-500 text-sm">Aktuell freie Kapazitäten — Projekt noch diesen Monat starten</p>
            </div>
          </div>
        </header>

        <div ref={section1.ref} className={fadeUp(section1.isInView)}>
          <ProblemSection />
        </div>
        <div ref={section2.ref} className={fadeLeft(section2.isInView)} id="services">
          <ServicesSection openCalendly={openCalendly} />
        </div>
        <div ref={section3.ref} className={fadeUp(section3.isInView)}>
          <HowItWorksSection />
        </div>
        <div ref={section4.ref} className={fadeScale(section4.isInView)} id="portfolio">
          <PortfolioSection />
        </div>
        <div ref={section5.ref} className={fadeUp(section5.isInView)}>
          <TestimonialsSection />
        </div>
        <div ref={section6.ref} className={fadeLeft(section6.isInView)} id="pricing">
          <PricingSection openCalendly={openCalendly} />
        </div>
        <div ref={section7.ref} className={fadeUp(section7.isInView)} id="about">
          <AboutSection openCalendly={openCalendly} />
        </div>

        {/* Consultation Section */}
        <div ref={section8.ref} className={fadeScale(section8.isInView)}>
          <section id="consultation-form" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Bereit loszulegen?</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                Buch dir 30 Minuten — wir besprechen dein Projekt und du bekommst einen ersten Entwurf kostenlos.
              </p>

              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-200 rounded-lg hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-gradient-shift bg-[length:200%_200%]"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981, #06b6d4)' }}
              >
                Termin buchen — kostenlos
              </button>

              <p className="text-gray-500 text-sm mt-4">30 Minuten · Unverbindlich · Per Video-Call</p>

              <p className="text-gray-600 text-sm mt-8">
                Oder schreib uns direkt an{' '}
                <a href="mailto:info@workwithjpr.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  info@workwithjpr.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <div ref={section9.ref} className={fadeUp(section9.isInView)}>
          <FAQSection />
        </div>

        {/* Footer */}
        <footer className="py-20 px-4 bg-zinc-950 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center mb-10">
              <img src="/JPR1.webp" alt="JPR Consulting" className="w-28 h-28 md:w-36 md:h-36 rounded-full opacity-80 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Site Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">Web Services</span>
              <a href="https://ai.workwithjpr.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold hover:text-white hover:border-white/20 transition-colors">KI-Automatisierung</a>
              <a href="https://game.workwithjpr.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold hover:text-white hover:border-white/20 transition-colors">Gaming UA</a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mb-10 text-sm">
              <button onClick={() => navigate('BLOG')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</button>
              <button onClick={() => navigate('IMPRINT')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Impressum</button>
              <button onClick={() => navigate('PRIVACY')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Datenschutz</button>
              <a href="mailto:info@workwithjpr.com" className="text-gray-400 hover:text-white transition-colors">Kontakt</a>
              <a href="https://www.linkedin.com/in/jan-rojek-b31474a" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            </div>
            {/* Google Review CTA */}
            <div className="flex justify-center mb-10">
              <a
                href="https://g.page/r/Cbent0mi4nueEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold group-hover:text-cyan-400 transition-colors">Bewertung auf Google hinterlassen</p>
                  <p className="text-gray-500 text-xs">Ihre Meinung hilft uns und anderen Unternehmen</p>
                </div>
                <span className="text-yellow-400 text-sm ml-1">★★★★★</span>
              </a>
            </div>

            <div className="border-t border-white/5 mb-8" />
            <div className="text-center space-y-2">
              <p className="text-white font-semibold text-sm">JPR Consulting GmbH</p>
              <p className="text-gray-500 text-xs">Letteallee 91 · 13409 Berlin · Deutschland</p>
              <p className="text-gray-600 text-xs pt-4">© 2026 JPR Consulting GmbH. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Sticky Navigation */}
      {showStickyCTA && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/98 backdrop-blur-2xl border-b border-white/5 shadow-2xl animate-slide-up">
          <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            {/* Logo + Name */}
            <button onClick={scrollToTop} className="flex items-center gap-4 group">
              <img src="/JPR1.webp" alt="JPR" className="w-12 h-12 md:w-10 md:h-10 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="hidden md:block text-white font-bold text-sm">JPR Consulting</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={openCalendly}
                className="ml-2 px-5 py-2 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-gradient-shift bg-[length:200%_200%] text-sm"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981, #06b6d4)' }}
              >
                Kostenloser Entwurf
              </button>
            </nav>

            {/* Mobile: CTA + Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={openCalendly}
                className="px-4 py-2 text-white font-semibold rounded-lg transition-all text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-gradient-shift bg-[length:200%_200%]"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981, #06b6d4)' }}
              >
                Anfragen
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Menü"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/5 bg-zinc-950/98 backdrop-blur-2xl">
              <div className="container mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-400 hover:text-white text-base font-medium transition-colors text-left py-2 border-b border-white/5 last:border-0"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-300 hover:scale-110 animate-fade-in" aria-label="Nach oben">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <CookieBanner />
    </div>
  );
};

export default App;
