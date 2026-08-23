import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  openCalendly: () => void;
  showDetailsLink?: boolean;
}

const PricingSection: React.FC<Props> = ({ openCalendly, showDetailsLink }) => {
  const tiers = [
    {
      name: 'Starter',
      price: 'ab 1.500',
      desc: 'Für den Start',
      features: [
        'One-Page Website',
        'Mobil optimiert',
        'Kontaktformular',
        'Google Maps Einbindung',
        'Basis-SEO',
        '1 Korrekturschleife'
      ],
      highlight: false
    },
    {
      name: 'Professional',
      price: 'ab 3.000',
      desc: 'Unser beliebtestes Paket',
      features: [
        'Mehrseitige Website',
        'Online-Terminbuchung',
        'Team- & Leistungsseiten',
        'Erweiterte SEO-Optimierung',
        'Google Analytics',
        'Galerie / Portfolio',
        '3 Korrekturschleifen',
        'Einführung & Support'
      ],
      highlight: true
    },
    {
      name: 'Business',
      price: 'ab 5.000',
      desc: 'Für anspruchsvolle Projekte',
      features: [
        'Alles aus Professional',
        'Online-Shop oder Web-App',
        'Kundenverwaltung / Backend',
        'Individuelle Funktionen',
        'Automatisierungen',
        'Laufender Support',
        'Unbegrenzte Korrekturen'
      ],
      highlight: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-zinc-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Preise</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent und fair</h2>
          <p className="text-gray-400 text-lg">Jedes Projekt ist anders. Im Gespräch erstellen wir dir ein Angebot — kostenlos und unverbindlich.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
              tier.highlight
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                : 'bg-zinc-800/40 border-white/5 hover:border-cyan-500/30'
            }`}>
              {tier.highlight && (
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">Am beliebtesten</div>
              )}
              <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{tier.desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-500 text-sm ml-1">€</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-cyan-400' : 'text-gray-600'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={openCalendly}
                className={`w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                  tier.highlight
                    ? 'text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] animate-gradient-shift bg-[length:200%_200%]'
                    : 'bg-zinc-700 text-white hover:bg-zinc-600'
                }`}
                style={tier.highlight ? { backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981, #06b6d4)' } : undefined}
              >
                Kostenloser Entwurf anfragen
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Alle Preise netto zzgl. MwSt. · Ratenzahlung möglich · Hosting ab 15€/Monat
        </p>
        {showDetailsLink && (
          <p className="text-center text-sm mt-4">
            <a href="/preise" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Alle Webdesign-Preise in Berlin im Detail →
            </a>
          </p>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
