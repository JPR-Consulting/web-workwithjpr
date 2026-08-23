import React, { useEffect } from 'react';
import { ArrowLeft, Layers, Palette, Plug, RefreshCw } from 'lucide-react';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';

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
    <div className="min-h-[100dvh] bg-zinc-950 text-white">
      <div className="container mx-auto max-w-6xl px-4 pt-20">
        <button
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Zur Startseite
        </button>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Preise</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6 leading-tight">
            Webdesign Preise in Berlin —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              transparent ab 1.500&nbsp;€
            </span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Eine professionelle Website kostet bei uns zwischen <strong className="text-white">1.500&nbsp;€</strong> und{' '}
            <strong className="text-white">5.000&nbsp;€+</strong> — je nach Umfang. Keine versteckten Kosten, keine
            Agentur-Tagessätze: Du bekommst ein festes Angebot, bevor es losgeht. Und den ersten Entwurf gibt es kostenlos.
          </p>
        </div>
      </div>

      {/* Pricing tiers (same as homepage) */}
      <PricingSection openCalendly={openCalendly} />

      {/* Price factors */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Was den Preis beeinflusst</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              „Ab-Preise" sind ehrlich gemeint — hier sind die vier Faktoren, die entscheiden, wo dein Projekt landet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factors.map((f, i) => (
              <div key={i} className="p-7 rounded-2xl bg-zinc-800/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                <f.icon className="w-7 h-7 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-7 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-lg font-bold mb-2">Warum kein WordPress?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Viele Agenturen wirken auf den ersten Blick günstiger, weil sie ein WordPress-Theme anpassen. Dafür zahlst du
              später: Plugin-Lizenzen, Sicherheitsupdates, langsame Ladezeiten. Wir bauen mit moderner Webtechnologie —
              schneller bei Google, keine Plugin-Wartung, keine laufenden Lizenzkosten.{' '}
              <button
                onClick={() => onNavigate('BLOG_POST', 'individuelles-backend-vs-wordpress')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Mehr dazu im Vergleich →
              </button>
            </p>
          </div>

          <p className="text-center text-gray-500 text-sm mt-10">
            Du willst tiefer einsteigen? Im Ratgeber{' '}
            <button
              onClick={() => onNavigate('BLOG_POST', 'was-kostet-eine-website-berlin')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              „Was kostet eine Website in Berlin?"
            </button>{' '}
            rechnen wir alle Posten (inkl. versteckter Kosten) im Detail durch.
          </p>
        </div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Was kostet deine Website?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Buch dir 30 Minuten — du bekommst ein festes Angebot und den ersten Entwurf kostenlos.
          </p>
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-200 rounded-lg hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-gradient-shift bg-[length:200%_200%]"
            style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981, #06b6d4)' }}
          >
            Kostenloser Entwurf anfragen
          </button>
        </div>
      </section>

      {/* Mini footer */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <button onClick={() => onNavigate('HOME')} className="text-gray-400 hover:text-white transition-colors">Startseite</button>
          <button onClick={() => onNavigate('BLOG')} className="text-gray-400 hover:text-white transition-colors">Blog</button>
          <button onClick={() => onNavigate('IMPRINT')} className="text-gray-400 hover:text-white transition-colors">Impressum</button>
          <button onClick={() => onNavigate('PRIVACY')} className="text-gray-400 hover:text-white transition-colors">Datenschutz</button>
        </div>
      </footer>
    </div>
  );
};

export default PreisePage;
