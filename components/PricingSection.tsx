import React from 'react';
import { useReveal } from '../hooks/useReveal';
import MagneticButton from './MagneticButton';
import { useCopy, useLang } from '../i18n';
import { paths, type Tier } from '../content/site-copy';

interface Props {
  openCalendly: () => void;
  /** Startseite: Anker-ID, Nummern-Eyebrow und Link zur Preisseite. */
  onHome?: boolean;
}

const PriceTier: React.FC<Tier & { openCalendly: () => void; recoLabel: string; ctaLabel: string }> = ({
  name, for: forWhom, price, reco, features, openCalendly, recoLabel, ctaLabel,
}) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal bg-ink hover:bg-panel transition-colors p-10 flex flex-col relative ${reco ? 'outline outline-1 outline-accent -outline-offset-1' : ''}`}
    >
      {reco && (
        <div className="absolute top-0 right-0 px-3.5 py-2 bg-accent text-ink font-mono text-[13px] font-medium uppercase">
          {recoLabel}
        </div>
      )}
      <h3 className="font-syne font-bold text-[26px] mb-1.5">{name}</h3>
      <div className="font-mono text-[14px] text-muted uppercase mb-6">{forWhom}</div>
      <div className="font-syne font-extrabold text-[40px] text-accent mb-7">{price}</div>
      <ul className="flex flex-col gap-2.5 text-[17px] text-muted flex-grow mb-7">
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
        className={`self-start inline-flex items-center gap-2.5 font-mono text-[14px] font-medium uppercase px-[22px] py-[13px] border transition-colors ${
          reco
            ? 'bg-accent text-ink border-accent hover:bg-transparent hover:text-accent'
            : 'bg-ink text-ftext border-line hover:bg-transparent'
        }`}
      >
        {ctaLabel}
      </MagneticButton>
    </div>
  );
};

const PricingSection: React.FC<Props> = ({ openCalendly, onHome }) => {
  const t = useCopy().pricing;
  const lang = useLang();
  const eyebrowRef = useReveal<HTMLDivElement>();
  const titleRef = useReveal<HTMLHeadingElement>();
  return (
    <section id={onHome ? 'preise' : undefined} className="px-6 md:px-12 border-b border-line py-16 md:py-24">
      {/* Auf der Preisseite steht das Stichwort schon über der H1 */}
      {onHome && (
        <div ref={eyebrowRef} className="reveal font-mono text-[14px] text-accent uppercase mb-5">
          {t.eyebrow}
        </div>
      )}
      <h2
        ref={titleRef}
        className="font-syne font-extrabold uppercase text-[clamp(34px,4.5vw,60px)] tracking-[-0.015em] leading-[1.02] mb-[52px] sec-title-line"
      >
        <span>{t.title}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        {t.tiers.map((tier) => (
          <PriceTier key={tier.name} {...tier} openCalendly={openCalendly} recoLabel={t.reco} ctaLabel={t.cta} />
        ))}
      </div>

      <p className="mt-6 font-body text-[16px] text-muted">{t.note}</p>
      {onHome && (
        <p className="mt-4 text-[15px] font-mono">
          <a href={paths.pricing[lang]} className="text-accent hover:text-ftext transition-colors">
            {t.detailsLink}
          </a>
        </p>
      )}
    </section>
  );
};

export default PricingSection;
