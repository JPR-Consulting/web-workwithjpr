import React, { useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Devices } from './parts';
import { dresden as t } from '../../content/dresden-copy';

// Reiter-Namen aus den Branchen der KI-Zeilen (Handwerk, Praxen, Fahrzeug); Reihenfolge wie examples.items
const TAB_LABELS = [t.voice.niches[0].label, t.voice.niches[1].label, t.voice.niches[2].label];

/**
 * Ein großes Fenster statt drei Karten: Reiter wechseln die Branche (Überblendung), beim Überfahren fährt das Bild
 * langsam über den Entwurf (die Bilder sind nur 1200x750 hoch, also Schwenk + Zoom statt echtem Scrollen). Klick öffnet die Lightbox.
 */
const ExampleSwitcher: React.FC<{ onOpen: (i: number) => void }> = ({ onOpen }) => {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = t.examples.items;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = items.length;
    const next = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i + n - 1) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={t.ui.stackLabel} className="flex flex-wrap gap-x-8 gap-y-1 border-b border-line">
        {items.map((it, i) => (
          <button
            key={it.title}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`ex-tab-${i}`}
            aria-selected={i === active}
            aria-controls="ex-panel"
            tabIndex={i === active ? 0 : -1}
            type="button"
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative min-h-[48px] font-display font-bold text-[18px] md:text-[20px] tracking-[-0.02em] transition-colors ${i === active ? 'text-ftext' : 'text-muted hover:text-ftext'}`}
          >
            {TAB_LABELS[i]}
            <span className={`absolute left-0 right-0 -bottom-px h-[3px] rounded-full bg-accent origin-left transition-transform duration-500 ${i === active ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div id="ex-panel" role="tabpanel" aria-labelledby={`ex-tab-${active}`} className="mt-8 md:mt-10">
        <button
          type="button"
          onClick={() => onOpen(active)}
          aria-label={`${t.examples.badge}: ${items[active].title}`}
          className="dd-zoom dd-pan-host group relative block w-full text-left cursor-zoom-in"
        >
          <div className="dd-stage relative rounded-[24px] md:rounded-[32px] px-4 pt-6 pb-5 md:px-12 md:pt-12 md:pb-10 ring-1 ring-black/5 shadow-[0_50px_100px_-50px_rgba(20,40,140,0.6)]">
            <div className="grid max-w-[1000px] mx-auto">
              {items.map((it, i) => (
                <div
                  key={it.title}
                  className={`col-start-1 row-start-1 transition-opacity duration-500 ease-out ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-hidden={i !== active}
                >
                  <Devices desktop={it.img} mobile={it.img} host={it.title} alt={`${t.examples.badge}: ${it.title}`} phoneRight className="dd-pan" eager={i === 0} />
                </div>
              ))}
            </div>
            <span className="absolute right-4 top-4 md:right-6 md:top-6 grid place-items-center w-10 h-10 rounded-full bg-white/10 text-white/85 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">
              <Maximize2 className="w-4 h-4" strokeWidth={2} />
            </span>
          </div>
        </button>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/[0.08] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            {t.examples.badge}
          </span>
          <h3 className="dd-h text-[22px] md:text-[26px] leading-tight tracking-[-0.025em] text-ftext">{items[active].title}</h3>
          <p className="text-[16px] text-muted">{items[active].tag}</p>
        </div>
      </div>
    </div>
  );
};

export default ExampleSwitcher;
