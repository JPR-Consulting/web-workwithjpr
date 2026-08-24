import React, { useEffect } from 'react';
import { ArrowLeft, Layers, Palette, Plug, RefreshCw } from 'lucide-react';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import MagneticButton from './MagneticButton';

interface Props {
  onNavigate: (view: string, slug?: string) => void;
  openCalendly: () => void;
}

const factors = [
  {
    icon: Layers,
    title: 'Umfang & Seitenanzahl',
    text: 'Ein One-Pager ist schneller gebaut als zehn Unterseiten mit eigener Struktur. Mehr Seiten bedeuten mehr Konzept, mehr Inhalt, mehr Abstimmung.'
  },
  {
    icon: Palette,
    title: 'Design-Anspruch',
    text: 'Ein sauberes Standard-Design ist im Preis enthalten. Individuelle Illustrationen, Animationen oder ein komplettes Branding kosten zusätzlich Zeit.'
  },
  {
    icon: Plug,
    title: 'Funktionen & Schnittstellen',
    text: 'Terminbuchung, Bezahlung, Kundenverwaltung oder Anbindungen an bestehende Systeme — jede Funktion, die "einfach laufen" soll, muss gebaut und getestet werden.'
  },
  {
    icon: RefreshCw,
    title: 'Inhalte & Pflege',
    text: 'Lieferst du Texte und Bilder, oder erstellen wir sie? Und soll die Seite danach betreut werden? Beides beeinflusst den Gesamtpreis.'
  }
];

const PreisePage: React.FC<Props> = ({ onNavigate, openCalendly }) => {
  useEffect(() => {
    document.title = 'Webdesign Preise Berlin 2026 — Website ab 1.500 € | JPR Consulting';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Transparente Preisliste: One-Page Website ab 1.500 €, Website mit Terminbuchung ab 3.000 €, Shop oder Web-App ab 5.000 €. Festes Angebot im kostenlosen Erstgespräch.'
      );
    }
    return () => {
      document.title = 'Webdesign Berlin — Moderne Websites für lokale Unternehmen | JPR Consulting';
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-ink text-ftext font-body">
      <div className="px-6 md:px-12 pt-20">
        <button
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12 font-mono text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Zur Startseite
        </button>

        {/* Hero */}
        <div className="max-w-3xl mb-4">
          <div className="font-mono text-[13px] text-accent uppercase mb-5">Preise</div>
          <h1 className="font-syne font-extrabold uppercase text-[clamp(34px,5.5vw,70px)] tracking-[-0.02em] leading-[1.02] mb-6">
            Webdesign Preise in Berlin — <span className="text-accent">transparent ab 1.500&nbsp;€</span>
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Eine professionelle Website kostet bei uns zwischen <strong className="text-ftext">1.500&nbsp;€</strong> und{' '}
            <strong className="text-ftext">5.000&nbsp;€+</strong> — je nach Umfang. Keine versteckten Kosten, keine
            Agentur-Tagessätze: Du bekommst ein festes Angebot, bevor es losgeht. Und den ersten Entwurf gibt es kostenlos.
          </p>
        </div>
      </div>

      {/* Pricing tiers (wie Homepage) */}
      <PricingSection openCalendly={openCalendly} />

      {/* Price factors */}
      <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
        <div className="mb-[52px] max-w-3xl">
          <h2 className="font-syne font-extrabold uppercase text-[clamp(28px,3.5vw,44px)] tracking-[-0.015em] mb-4">
            Was den Preis beeinflusst
          </h2>
          <p className="text-muted text-lg">
            „Ab-Preise" sind ehrlich gemeint — hier sind die vier Faktoren, die entscheiden, wo dein Projekt landet.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          {factors.map((f) => (
            <div key={f.title} className="bg-ink hover:bg-panel transition-colors p-9">
              <f.icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="font-syne font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-[1.6]">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-8 border border-line bg-panel">
          <h3 className="font-syne font-bold text-lg mb-2">Warum kein WordPress?</h3>
          <p className="text-muted text-sm leading-[1.6]">
            Viele Agenturen wirken auf den ersten Blick günstiger, weil sie ein WordPress-Theme anpassen. Dafür zahlst du
            später: Plugin-Lizenzen, Sicherheitsupdates, langsame Ladezeiten. Wir bauen mit moderner Webtechnologie —
            schneller bei Google, keine Plugin-Wartung, keine laufenden Lizenzkosten.{' '}
            <button
              onClick={() => onNavigate('BLOG_POST', 'individuelles-backend-vs-wordpress')}
              className="text-accent hover:text-ftext transition-colors"
            >
              Mehr dazu im Vergleich →
            </button>
          </p>
        </div>

        <p className="text-muted text-sm mt-8 font-mono uppercase">
          Du willst tiefer einsteigen? Im Ratgeber{' '}
          <button
            onClick={() => onNavigate('BLOG_POST', 'was-kostet-eine-website-berlin')}
            className="text-accent hover:text-ftext transition-colors normal-case"
          >
            „Was kostet eine Website in Berlin?"
          </button>{' '}
          rechnen wir alle Posten (inkl. versteckter Kosten) im Detail durch.
        </p>
      </section>

      <TestimonialsSection />
      <FAQSection />

      {/* CTA */}
      <section className="px-6 md:px-12 bg-accent text-ink py-16 md:py-24 text-center">
        <h2 className="font-syne font-extrabold uppercase text-[clamp(34px,5vw,60px)] tracking-[-0.02em] mb-4">
          Was kostet deine Website?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Buch dir 30 Minuten — du bekommst ein festes Angebot und den ersten Entwurf kostenlos.
        </p>
        <MagneticButton
          as="button"
          onClick={openCalendly}
          className="inline-flex items-center gap-2.5 font-mono text-sm font-medium uppercase bg-ink text-ftext px-7 py-4 border border-ink hover:bg-transparent hover:text-ink transition-colors"
        >
          Kostenloser Entwurf anfragen →
        </MagneticButton>
      </section>

      {/* Mini footer */}
      <footer className="px-6 md:px-12 py-10 border-t border-line">
        <div className="flex flex-wrap justify-center gap-8 font-mono text-[13px] uppercase">
          <button onClick={() => onNavigate('HOME')} className="text-muted hover:text-accent transition-colors">Startseite</button>
          <button onClick={() => onNavigate('BLOG')} className="text-muted hover:text-accent transition-colors">Blog</button>
          <button onClick={() => onNavigate('IMPRINT')} className="text-muted hover:text-accent transition-colors">Impressum</button>
          <button onClick={() => onNavigate('PRIVACY')} className="text-muted hover:text-accent transition-colors">Datenschutz</button>
        </div>
      </footer>
    </div>
  );
};

export default PreisePage;
