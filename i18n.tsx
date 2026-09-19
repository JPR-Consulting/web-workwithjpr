import React, { createContext, useContext } from 'react';
import { copy, type Lang } from './content/site-copy';

export const LangContext = createContext<Lang>('de');
export const useLang = () => useContext(LangContext);
export const useCopy = () => copy[useContext(LangContext)];

/** DE / EN — die aktive Sprache ist hervorgehoben, die andere klickbar. */
export const LangSwitch: React.FC<{ onChange: (lang: Lang) => void; className?: string }> = ({ onChange, className = '' }) => {
  const lang = useLang();
  const t = useCopy();
  const item = (l: Lang) => (
    <button
      type="button"
      onClick={() => l !== lang && onChange(l)}
      aria-current={l === lang ? 'true' : undefined}
      aria-label={l === lang ? undefined : t.nav.switchTo}
      lang={l}
      className={l === lang ? 'text-ftext' : 'text-muted hover:text-accent transition-colors'}
    >
      {l.toUpperCase()}
    </button>
  );
  return (
    <div className={`flex items-center gap-1.5 font-mono text-[13px] md:text-[14px] uppercase ${className}`}>
      {item('de')}
      <span className="text-dim" aria-hidden="true">/</span>
      {item('en')}
    </div>
  );
};
