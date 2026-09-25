import React, { useState } from 'react';
import MagneticButton from './MagneticButton';
import { useCopy } from '../i18n';

interface Props {
  /** Öffnet den Entwurf-Dialog, die eingetragene Adresse wird übernommen. */
  onStart: (website: string) => void;
  onPricing: () => void;
}

/**
 * Einstieg im Hero: nur die Website-Adresse, der Rest folgt im Dialog.
 * Eigener State, damit Tippen nicht die ganze Startseite (und den Wasser-Effekt) neu rendert.
 */
const HeroDraftForm: React.FC<Props> = ({ onStart, onPricing }) => {
  const t = useCopy();
  const [url, setUrl] = useState('');

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onStart(url.trim()); }}
      className="max-w-[820px]"
    >
      <label htmlFor="hero-website" className="block font-mono text-[13px] md:text-[14px] uppercase text-muted mb-3">
        {t.draft.heroLabel}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="hero-website"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t.draft.heroPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 min-w-0 h-[58px] px-5 bg-panel/80 border border-[#3a3a40] text-ftext text-[17px] font-body placeholder:text-dim transition-colors hover:border-[#4a4a52] focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <MagneticButton
          as="button"
          type="submit"
          className="cta-glow shrink-0 inline-flex items-center justify-center gap-2.5 font-mono text-[14px] sm:text-[15px] font-medium uppercase whitespace-nowrap bg-accent text-ink px-6 sm:px-7 h-[58px] border border-accent hover:bg-transparent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t.hero.ctaPrimary}
        </MagneticButton>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-[15px]">
        <span className="text-dim">{t.draft.heroHint}</span>
        <button type="button" onClick={onPricing} className="text-muted hover:text-accent transition-colors underline underline-offset-4 py-1">
          {t.hero.ctaSecondary}
        </button>
      </div>
    </form>
  );
};

export default HeroDraftForm;
