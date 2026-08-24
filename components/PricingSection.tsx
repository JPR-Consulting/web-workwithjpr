import React from 'react';
import { useReveal } from '../hooks/useReveal';
import MagneticButton from './MagneticButton';

interface Props {
  openCalendly: () => void;
  showDetailsLink?: boolean;
}

const tiers = [
  {
    name: 'Starter',
    for: 'Für den Start',
    price: 'ab 1.500 €',
    reco: false,
    features: ['One-Page Website', 'Mobil optimiert', 'Kontaktformular', 'Google Maps Einbindung', 'Basis-SEO', '1 Korrekturschleife'],
  },
  {
    name: 'Professional',
    for: 'Unser beliebtestes Paket',
    price: 'ab 3.000 €',
    reco: true,
    features: ['Mehrseitige Website', 'Online-Terminbuchung', 'Team- & Leistungsseiten', 'Erweiterte SEO-Optimierung', 'Google Analytics', 'Galerie / Portfolio', '3 Korrekturschleifen', 'Einführung & Support'],
  },
  {
    name: 'Business',
    for: 'Für anspruchsvolle Projekte',
    price: 'ab 5.000 €',
    reco: false,
    features: ['Alles aus Professional', 'Online-Shop oder Web-App', 'Kundenverwaltung / Backend', 'Individuelle Funktionen', 'Automatisierungen', 'Laufender Support', 'Unbegrenzte Korrekturen'],
  },
];

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

const PricingSection: React.FC<Props> = ({ openCalendly, showDetailsLink }) => {
  return (
    <section className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      <div className="font-mono text-[13px] text-accent uppercase mb-5">Preise</div>
      <h2 className="font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px]">
        Transparent. Ohne Tagessätze.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        {tiers.map((tier) => (
          <PriceTier key={tier.name} {...tier} openCalendly={openCalendly} />
        ))}
      </div>

      <p className="mt-6 font-mono text-[13px] text-dim uppercase">
        Alle Preise netto zzgl. MwSt. · Ratenzahlung möglich · Hosting ab 15 €/Monat
      </p>
      {showDetailsLink && (
        <p className="mt-4 text-sm font-mono">
          <a href="/preise" className="text-accent hover:text-ftext transition-colors">
            Alle Webdesign-Preise in Berlin im Detail →
          </a>
        </p>
      )}
    </section>
  );
};

export default PricingSection;
